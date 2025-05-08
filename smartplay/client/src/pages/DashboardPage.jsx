import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { toast } from 'react-toastify';
import api from '../services/api'; // Axios instance
import VideoCard from '../components/VideoCard'; // Reusable VideoCard component
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa'; // Loading icon

const DashboardPage = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videos, setVideos] = useState([]);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false); // Loading state for adding video
  const [isLoadingVideos, setIsLoadingVideos] = useState(true); // Loading state for fetching videos
  const [favorites, setFavorites] = useState(new Set()); // Placeholder for favorite state
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth(); // Get user and auth loading state

  // --- Fetch User Videos ---
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoadingVideos(true);
      try {
        // Call the GET /api/videos/myvideos endpoint
        const response = await api.get('/videos/myvideos');
        setVideos(response.data || []); // Set fetched videos to state
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Failed to load your video history.");
        setVideos([]);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    // Only fetch if auth is done loading and user is logged in
    if (!isAuthLoading && user) {
      fetchVideos();
    } else if (!isAuthLoading && !user) {
        // Clear videos if user logs out
        setVideos([]);
        setIsLoadingVideos(false);
    }
  }, [user, isAuthLoading]); // Rerun when user or auth loading state changes
  // --- End Fetch User Videos ---

  // --- Add Video Logic (from previous phase) ---
  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) {
      toast.warn("Please enter a YouTube URL.");
      return;
    }
    setIsLoadingAdd(true);
    try {
      const response = await api.post('/videos', { youtubeUrl });
      const { video } = response.data;
      toast.success(response.data.message || 'Video processing started!');
      setYoutubeUrl('');
      // OPTIONAL: Add new video to state immediately or refetch list
      // setVideos(prev => [video, ...prev]); // Simplistic add to top (might lack full data)
      navigate(`/video/${video._id}`); // Navigate immediately
    } catch (error) {
      console.error("Error adding video:", error);
      const message = error.response?.data?.message || 'Failed to process video URL.';
      toast.error(message);
    } finally {
      setIsLoadingAdd(false);
    }
  };
  // --- End Add Video Logic ---
  
  // --- Delete Video Logic (Placeholder - requires backend DELETE endpoint) ---
  const handleDeleteVideo = async (videoId) => {
      if (!window.confirm("Are you sure you want to delete this video and its chat history?")) {
          return;
      }
      try {
          await api.delete(`/videos/${videoId}`); // Call backend delete
          setVideos(prevVideos => prevVideos.filter(v => v._id !== videoId)); // Remove from state
          toast.success("Video deleted successfully.");
      } catch (error) {
          console.error("Error deleting video:", error);
          toast.error(error.response?.data?.message || "Failed to delete video.");
      }
  }
  // --- End Delete Video Logic ---

  // --- Favorite Toggle Logic (Placeholder) ---
  const handleToggleFavorite = (videoId) => {
       setFavorites(prev => {
           const newFavs = new Set(prev);
           newFavs.has(videoId) ? newFavs.delete(videoId) : newFavs.add(videoId);
           return newFavs;
       });
       toast.info(`Toggled favorite (placeholder).`);
       // TODO: Add backend call if favorites need persistence
  }
  // --- End Favorite Toggle Logic ---

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* ... (Welcome message, Add Video Form - same as before) ... */}
       <form onSubmit={handleAddVideo} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* ... form content */}
           <div className="flex flex-col sm:flex-row gap-2">
              <TextInput
                 id="youtubeUrl" // ... props
                 value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                 className="flex-grow" 
              />
              <Button type="submit" disabled={isLoadingAdd}>
                 {isLoadingAdd ? 'Analyzing...' : 'Analyze Video'}
              </Button>
           </div>
       </form>

      {/* --- Display Video History --- */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Analyzed Videos</h2>
      {isLoadingVideos ? (
        <div className='flex justify-center items-center py-8'>
            <FaSpinner className="animate-spin text-2xl text-indigo-500 dark:text-indigo-400" />
            <span className='ml-2 text-gray-600 dark:text-gray-400'>Loading your videos...</span>
        </div>
      ) : videos.length > 0 ? (
        // Render grid of VideoCard components
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {videos.map((video) => (
            <VideoCard 
                key={video._id} 
                video={video} // Pass video data { _id, title, youtubeVideoId }
                onDelete={() => handleDeleteVideo(video._id)} 
                onToggleFavorite={() => handleToggleFavorite(video._id)}
                isFavorite={favorites.has(video._id)} 
            />
          ))}
        </div>
      ) : (
        // Show message if no videos found
        <div className='text-center py-8 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
             <p className="text-gray-600 dark:text-gray-400">You haven't analyzed any videos yet. Paste a YouTube URL above to get started!</p>
        </div>
       
      )}
      {/* --- End Display Video History --- */}
    </div>
  );
};

export default DashboardPage;
