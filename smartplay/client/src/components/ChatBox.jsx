import React, { useState, useRef, useEffect } from 'react';
import { IoSend } from "react-icons/io5"; // Send icon

// Placeholder props: messages array, onSendMessage function, isLoadingAI
const ChatBox = ({ messages = [], onSendMessage, isLoadingAI = false }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null); // Ref to scroll to bottom

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && onSendMessage && !isLoadingAI) {
      onSendMessage(inputMessage.trim());
      setInputMessage(''); // Clear input after sending
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow">
      {/* Message Display Area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && <p className='text-center text-gray-500 dark:text-gray-400 text-sm'>Ask a question about the video!</p>}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.isUser
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {/* AI Typing Indicator Placeholder */}
        {isLoadingAI && (
           <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white animate-pulse">
                  AI is thinking...
              </div>
           </div>
        )}
        {/* Element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2 bg-white dark:bg-gray-700">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
          disabled={isLoadingAI} // Disable input while AI is thinking
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputMessage.trim() || isLoadingAI}
        >
          <IoSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
