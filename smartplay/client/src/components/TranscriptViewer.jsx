import React from 'react';

// Helper function to format time (e.g., seconds to MM:SS)
const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


// Placeholder props: transcript array, onTimestampClick function
const TranscriptViewer = ({ transcript = [], onTimestampClick }) => {
  
  if (!transcript || transcript.length === 0) {
      return <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded text-center text-gray-500 dark:text-gray-400">Transcript not available.</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-4 max-h-80 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Transcript</h3>
      <div className="space-y-2">
        {transcript.map((item, index) => (
          <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
            <button
              onClick={() => onTimestampClick(item.start)} // Pass start time in seconds
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline mr-2 focus:outline-none"
              title={`Jump to ${formatTime(item.start)}`}
            >
              [{formatTime(item.start)}]
            </button>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptViewer;
