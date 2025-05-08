import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube'; // Import specific player
import { toast } from 'react-toastify';
import api from '../services/api'; // Axios instance
import ChatBox from '../components/ChatBox'; // Import ChatBox
import TranscriptViewer from '../components/TranscriptViewer'; // Import TranscriptViewer
import { useAuth } from '../context/AuthContext'; 

const VideoQnAPage = () => {
  const { videoId } = useParams(); // Get the video DB ID from the URL
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user info
  const playerRef = useRef(null); // Ref for ReactPlayer

  // State for video data
  const [videoData, setVideoData] = useState(null); // { title, youtubeVideoId, transcript, questions }
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  
  // State for chat
  const [messages, setMessages] = useState([]); // Array of { text: string, isUser: boolean }
  const [isAISending, setIsAISending] = useState(false); // Loading state for AI response

  // Fetch video details on mount
  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!videoId || !user) { // Ensure videoId and user are available
        setIsLoadingPage(false);
        return; 
      }
      setIsLoadingPage(true);
      try {
        const response = await api.get(`/videos/${videoId}`);
        setVideoData(response.data);
        // Initialize chat messages from saved questions
        const initialMessages = response.data.questions.flatMap(q => [
            { text: q.question, isUser: true },
            { text: q.answer, isUser: false }
        ]);
        setMessages(initialMessages);
      } catch (error) {
        console.error("Error fetching video details:", error);
        toast.error(error.response?.data?.message || "Failed to load video details. It might not exist or you may not have access.");
        setVideoData(null); // Clear data on error
        // Optional: Redirect if video not found or unauthorized
        if (error.response?.status === 404 || error.response?.status === 403) {
            navigate('/dashboard'); // Redirect back to dashboard
        }
      } finally {
        setIsLoadingPage(false);
      }
    };

    fetchVideoDetails();
  }, [videoId, user, navigate]); // Dependency array

  // Function to handle timestamp click from TranscriptViewer
  const handleTimestampClick = (timeInSeconds) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timeInSeconds, 'seconds');
    }
  };

  // Function to handle sending a message from ChatBox
  const handleSendMessage = async (questionText) => {
    if (!questionText.trim() || isAISending) return;

    // Add user's question to the chat immediately
    const newUserMessage = { text: questionText, isUser: true };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsAISending(true); // Show AI thinking indicator

    try {
      // Call backend API to get AI answer
      const response = await api.post(`/chat/${videoId}`, { question: questionText });
      const aiAnswer = response.data.answer;

      // Add AI's answer to the chat
      const newAIMessage = { text: aiAnswer, isUser: false };
      setMessages(prevMessages => [...prevMessages, newAIMessage]);

    } catch (error) {
      console.error("Error getting AI answer:", error);
      const errorMessage = error.response?.data?.message || "Sorry, I couldn't get an answer right now.";
      toast.error(errorMessage);
      // Optionally add an error message to the chat
       const errorAIMessage = { text: `Error: ${errorMessage}`, isUser: false };
       setMessages(prevMessages => [...prevMessages, errorAIMessage]);
       // Or remove the user's last message if preferred on error:
       // setMessages(prevMessages => prevMessages.slice(0, -1));
    } finally {
      setIsAISending(false); // Hide AI thinking indicator
    }
  };

  // Render Loading State
  if (isLoadingPage) {
    return <div className='container mx-auto p-6 text-center'>Loading video data...</div>;
  }

  // Render Not Found State
  if (!videoData) {
    // Error handled in useEffect, this is a fallback or for state after failed fetch
    return <div className='container mx-auto p-6 text-center text-red-500'>Video data could not be loaded.</div>;
  }
  
  // Construct YouTube URL for ReactPlayer
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoData.youtubeVideoId}`;

  // Main Render
  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Video Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white truncate" title={videoData.title}>
        {videoData.title}
      </h1>

      {/* Main Layout: Video Player and Chat */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-6">
        {/* Left Side: Video Player */}
        <div className="w-full lg:w-2/3 aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
          <ReactPlayer
            ref={playerRef}
            url={youtubeWatchUrl}
            controls // Show default YouTube controls
            width="100%"
            height="100%"
            // Optional: Add more props like onProgress, playing, etc. if needed
          />
        </div>

        {/* Right Side: Chat Box */}
        <div className="w-full lg:w-1/3 lg:max-h-[calc((9/16)*(66.66vw))] xl:max-h-[calc((9/16)*(60vw))]"> 
        {/* Adjust max-h based on aspect ratio and screen width to roughly match player height */}
          <ChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoadingAI={isAISending}
          />
        </div>
      </div>

      {/* Bottom Section: Transcript Viewer */}
      <div>
        <TranscriptViewer
          transcript={videoData.transcript}
          onTimestampClick={handleTimestampClick}
        />
      </div>
    </div>
  );
};

export default VideoQnAPage;
