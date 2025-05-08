// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaQuestionCircle } from 'react-icons/fa';
import Button from '../components/Button'; // Use your Button component

const LandingPage = () => {
  return (
    // Center content vertically and horizontally within the main area
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-24 lg:py-32">
        
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-gray-900 dark:text-white leading-tight">
            Welcome to <span className='text-indigo-600 dark:text-indigo-400'>SmartPlay</span>
        </h1>

        {/* Subheading/Description */}
        <p className="mt-2 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
            Paste any YouTube video link and interact with an AI chatbot that answers your questions based on the video content. Smarter viewing starts here!
        </p>

        {/* Call to Action Button */}
        <div className="flex flex-col sm:flex-row gap-4">
             <Link to="/register">
                 <Button variant="primary" className="w-full sm:w-auto text-lg px-6 py-3">
                     Get Started
                 </Button>
             </Link>
              {/* Optional secondary action */}
             {/* <Link to="/#features"> 
                 <Button variant="secondary" className="w-full sm:w-auto text-lg px-6 py-3">
                     Learn More
                 </Button>
             </Link> */}
        </div>

        {/* Optional: Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <div className='p-6 bg-white dark:bg-gray-800 rounded-lg shadow'>
                <FaYoutube className="text-4xl text-red-500 mb-3 mx-auto" />
                <h3 className='text-xl font-semibold mb-2'>YouTube Integration</h3>
                <p className='text-gray-600 dark:text-gray-400'>Simply paste a link, and we handle the transcript fetching automatically.</p>
            </div>
             <div className='p-6 bg-white dark:bg-gray-800 rounded-lg shadow'>
                <FaQuestionCircle className="text-4xl text-indigo-500 mb-3 mx-auto" />
                <h3 className='text-xl font-semibold mb-2'>AI-Powered Q&A</h3>
                <p className='text-gray-600 dark:text-gray-400'>Ask questions in natural language and get answers based on the video's content.</p>
            </div>
        </div>
      
    </div>
  );
};

export default LandingPage;
