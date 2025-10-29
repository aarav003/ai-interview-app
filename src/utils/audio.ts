export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export async function playAudio(
    base64Audio: string,
    audioContext: AudioContext,
    destinationNode: MediaStreamAudioDestinationNode,
    audioQueue: { source: AudioBufferSourceNode, startTime: number, duration: number }[],
    nextStartTime: { current: number }
) {
    const audioData = decode(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
    
    const now = audioContext.currentTime;
    const startTime = Math.max(now, nextStartTime.current);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    // Connect to both the speakers (destination) and the recording stream node
    source.connect(audioContext.destination);
    source.connect(destinationNode);
    
    source.start(startTime);
    
    const duration = audioBuffer.duration;
    nextStartTime.current = startTime + duration;
    
    audioQueue.push({ source, startTime, duration });
    
    source.onended = () => {
        const index = audioQueue.findIndex(item => item.source === source);
        if (index > -1) {
            audioQueue.splice(index, 1);
        }
    };
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // remove the prefix `data:image/jpeg;base64,`
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}