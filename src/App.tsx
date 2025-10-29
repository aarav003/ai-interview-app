import React, { useState, useCallback } from 'react';
import { InterviewStatus } from './types.ts';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';
import InterviewScreen from './components/InterviewScreen.tsx';
import { EndScreen } from './components/EndScreen.tsx';

const App: React.FC = () => {
  const [status, setStatus] = useState<InterviewStatus>(InterviewStatus.NOT_STARTED);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStart = useCallback(() => {
    setStatus(InterviewStatus.IN_PROGRESS);
    setErrorMessage(null);
  }, []);

  const handleComplete = useCallback(() => {
    setStatus(InterviewStatus.COMPLETED);
  }, []);
  
  const handleError = useCallback((message: string) => {
    setErrorMessage(message);
    setStatus(InterviewStatus.ERROR);
  }, []);

  const renderContent = () => {
    switch (status) {
      case InterviewStatus.NOT_STARTED:
        return <WelcomeScreen onStart={handleStart} />;
      case InterviewStatus.IN_PROGRESS:
        return <InterviewScreen onComplete={handleComplete} onError={handleError} />;
      case InterviewStatus.COMPLETED:
        return <EndScreen />;
      case InterviewStatus.ERROR:
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4 text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">An Error Occurred</h1>
            <p className="text-gray-300 mb-6">{errorMessage}</p>
            <button
              onClick={() => {
                setStatus(InterviewStatus.NOT_STARTED);
                setErrorMessage(null);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return <div className="min-h-screen bg-gray-900 font-sans">{renderContent()}</div>;
};

export default App;