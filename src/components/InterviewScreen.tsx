import { useEffect, useMemo, useState } from 'react';
import { MicIcon } from './icons/MicIcon.tsx';
import { PhoneIcon } from './icons/PhoneIcon.tsx';
import { SpinnerIcon } from './icons/SpinnerIcon.tsx';
import { WaveformIcon } from './icons/WaveformIcon.tsx';
import { useVapiWebRTC } from '../hooks/useVapiWebRTC';

interface InterviewScreenProps {
  onComplete: () => void;
  onError: (message: string) => void;
}

export default function InterviewScreen({ onComplete, onError }: InterviewScreenProps) {
  const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID as string | undefined;

  const { isConnected, isConnecting, error, connect, disconnect } = useVapiWebRTC({
    assistantId,
    onError: (e) => onError(e.message || 'Unknown error'),
    onConnectionChange: (connected) => {
      /* Optional: react to connection state changes */
    },
  });

  const [showWave, setShowWave] = useState(false);
  useEffect(() => setShowWave(isConnected), [isConnected]);

  const canStart = useMemo(() => !!assistantId && !isConnected && !isConnecting, [assistantId, isConnected, isConnecting]);

  useEffect(() => {
    if (!assistantId) {
      onError('Missing VITE_VAPI_ASSISTANT_ID. Set it in environment variables.');
    }
  }, [assistantId, onError]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">Interview In Progress</h1>
        <p className="text-sm text-gray-300 mb-6">
          This interview connects your microphone to a Vapi assistant via WebRTC.
        </p>

        <div className="flex items-center gap-3 mb-4">
          <MicIcon className="w-5 h-5" />
          <span>{isConnected ? 'Connected to assistant' : isConnecting ? 'Connecting...' : 'Not connected'}</span>
        </div>

        {error && (
          <div className="bg-red-900/40 text-red-200 border border-red-700 rounded p-3 mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:bg-gray-700 flex items-center gap-2"
            onClick={connect}
            disabled={!canStart}
          >
            {isConnecting ? <SpinnerIcon className="w-4 h-4" /> : <PhoneIcon className="w-4 h-4" />}
            {isConnecting ? 'Connecting' : 'Start Interview'}
          </button>

          <button
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800"
            onClick={() => {
              disconnect();
              onComplete();
            }}
            disabled={!isConnected}
          >
            End Interview
          </button>
        </div>

        <div className="mt-8 h-24 flex items-center justify-center bg-gray-900 border border-gray-800 rounded">
          {showWave ? (
            <WaveformIcon isAnimating={showWave} className="w-48 h-16 text-green-400" />
          ) : (
            <div className="text-gray-400 text-sm">Audio waveform appears when connected</div>
          )}
        </div>
      </div>
    </div>
  );
}