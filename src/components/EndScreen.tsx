import React from 'react';

export const EndScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
       <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center border border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Interview Complete</h1>
        <p className="text-gray-300">
          Thank you for your time. We have received your responses and will be in touch with the next steps.
        </p>
      </div>
    </div>
  );
};