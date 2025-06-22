
import React from 'react';

interface GeminiResponseViewProps {
  geminiResponse: string | null;
  feedback: string | null; // Sparky's evaluation/feedback
  isSuccess?: boolean; // To style feedback differently
}

const GeminiResponseView: React.FC<GeminiResponseViewProps> = ({ geminiResponse, feedback, isSuccess }) => {
  if (!geminiResponse && !feedback) {
    return null;
  }

  const feedbackColor = isSuccess === true ? 'border-green-500 bg-green-900/30 text-green-300' 
                      : isSuccess === false ? 'border-amber-500 bg-amber-900/30 text-amber-300' 
                      : 'border-slate-600 bg-slate-700/50 text-slate-300';

  return (
    <div className="w-full space-y-4">
      {geminiResponse && (
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-sky-400 mb-2">Gemini's Response:</h3>
          <p className="text-slate-200 whitespace-pre-wrap">{geminiResponse}</p>
        </div>
      )}
      {feedback && (
        <div className={`p-4 border rounded-lg shadow ${feedbackColor}`}>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
              <path fillRule="evenodd" d="M10 2.5c-1.31 0-2.521.384-3.565 1.079A6.082 6.082 0 005.16 6.247C4.19 7.994 4.56 10.207 5.09 12.02l-.334.334a1 1 0 000 1.414l.333.334c-.53 1.813-.16 4.026.81 5.773A6.082 6.082 0 007.435 21a1 1 0 00.907-.373c1.396-2.172.99-5.26-.052-7.702a1 1 0 00-1.48-.603l-.435.208a3.79 3.79 0 01-1.302-1.926c-.432-1.25.04-2.65.647-3.488a3.79 3.79 0 011.303-1.126l.435.208a1 1 0 001.48-.603c1.042-2.442.446-5.53-.95-7.702A1 1 0 007.435 0 6.082 6.082 0 003.92 2.585 6.082 6.082 0 002.565 4.96 1 1 0 002.999 6.5h1.002a1 1 0 100-2H2.52a1 1 0 00-.316.066A3.999 3.999 0 014.28 2.72a4.018 4.018 0 016.196 2.396 1 1 0 101.94-.472A6.014 6.014 0 0010 2.5zM12.5 6a1 1 0 100-2 1 1 0 000 2zM6.5 12a1 1 0 100-2 1 1 0 000 2zM12.5 18a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Sparky's Feedback:
          </h3>
          <p className="whitespace-pre-wrap">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiResponseView;
