import React, { useState } from 'react';
import { VideoIcon } from './icons/VideoIcon.tsx';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      // Request permissions
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      onStart();
    } catch (err) {
      console.error("Permission denied:", err);
      setError("Camera and microphone access is required for the interview. Please enable them in your browser settings and refresh the page.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center border border-gray-700">
        <div className="flex justify-center mb-6">
            <div className="bg-indigo-500 p-3 rounded-full">
                <VideoIcon className="w-8 h-8 text-white" />
            </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">AI Video Interview</h1>
        <p className="text-gray-300 mb-6">
          Welcome to your interview. This will be a conversation with our AI agent to help us understand your skills and experience.
        </p>
        <p className="text-gray-400 mb-8 text-sm">
          Please ensure you are in a quiet environment with a stable internet connection. We will need access to your camera and microphone.
        </p>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text:white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          {loading ? 'Starting...' : 'Begin Interview'}
        </button>
      </div>
    </div>
  );
};