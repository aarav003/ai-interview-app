import { useCallback, useEffect, useRef, useState } from 'react';
import { createVapiSession } from '../utils/vapiSession';

interface UseVapiWebRTCOptions {
  assistantId: string | undefined;
  onError?: (err: Error) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export function useVapiWebRTC(opts: UseVapiWebRTCOptions) {
  const { assistantId, onError, onConnectionChange } = opts;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  // Attach an audio element lazily to play remote audio
  useEffect(() => {
    if (!remoteAudioRef.current) {
      const el = document.createElement('audio');
      el.autoplay = true;
      el.playsInline = true;
      el.style.display = 'none';
      document.body.appendChild(el);
      remoteAudioRef.current = el;
    }
    return () => {
      // do not remove to avoid disrupting audio during navigation
    };
  }, []);

  const disconnect = useCallback(() => {
    try {
      setIsConnecting(false);
      setIsConnected(false);
      if (pcRef.current) {
        pcRef.current.getSenders().forEach(s => {
          try { s.track?.stop(); } catch {}
        });
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      onConnectionChange?.(false);
    } catch (e) {
      // ignore
    }
  }, [onConnectionChange]);

  const connect = useCallback(async () => {
    try {
      if (!assistantId) {
        throw new Error('Missing VITE_VAPI_ASSISTANT_ID');
      }
      setIsConnecting(true);
      setError(null);

      // Get local mic stream (audio only)
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      // Create session
      const session = await createVapiSession(assistantId);

      // Create PeerConnection
      pcRef.current = new RTCPeerConnection({
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
      });

      // Forward remote audio to element
      pcRef.current.ontrack = (ev) => {
        const [stream] = ev.streams;
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = stream;
        }
      };

      // Add local audio track
      localStreamRef.current.getTracks().forEach(track => pcRef.current!.addTrack(track, localStreamRef.current!));

      // Create offer
      const offer = await pcRef.current.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false });
      await pcRef.current.setLocalDescription(offer);

      // Send offer to Vapi's session endpoint response fields (generic shape)
      // Many Vapi responses include an endpoint to exchange SDP; here we assume
      // the session JSON includes a `rtcSessionDescription` field or similar.
      const sdpResp = await fetch(session.webrtc?.answerUrl || session.rtcSessionDescriptionUrl || session.rtcAnswerUrl || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdp: offer.sdp, type: 'offer' }),
      }).catch(() => null);

      if (!sdpResp || !sdpResp.ok) {
        throw new Error('Failed to negotiate WebRTC with assistant.');
      }
      const remoteDesc = await sdpResp.json();
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(remoteDesc));

      setIsConnected(true);
      setIsConnecting(false);
      onConnectionChange?.(true);
    } catch (e: any) {
      console.error('Vapi connect error', e);
      setIsConnecting(false);
      setIsConnected(false);
      const msg = e?.message || 'Failed to connect to assistant';
      setError(msg);
      onError?.(e);
    }
  }, [assistantId, onConnectionChange, onError]);

  useEffect(() => () => disconnect(), [disconnect]);

  return { isConnected, isConnecting, error, connect, disconnect };
}