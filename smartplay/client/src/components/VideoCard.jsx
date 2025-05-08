import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa'; // Example icons

// Props:
// - video: object { _id: string, title: string, youtubeVideoId: string }
// - onDelete: function to call when delete button is clicked (passes video._id)
// - onToggleFavorite: function to call when favorite button is clicked (passes video._id)
// - isFavorite: boolean indicating if the video is currently favorited
const VideoCard = ({ video, onDelete, onToggleFavorite, isFavorite }) => {
  
  // Generate standard YouTube thumbnail URL (Medium Quality)
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`; 

  // Fallback image handler if YouTube thumbnail fails to load
  const handleImageError = (e) => {
    // Replace with a placeholder or hide
    e.target.src = 'https://via.placeholder.com/320x180?text=Thumbnail+Error'; 
    e.target.alt = 'Thumbnail failed to load';
  };

  // Prevent click event propagation when clicking action buttons inside the link
  const handleActionClick = (e, action) => {
      e.preventDefault(); // Stop the Link navigation
      e.stopPropagation(); // Stop event bubbling further up
      action(); // Execute the intended action (delete or favorite)
  };

  return (
    // Wrap the entire card in a Link for navigation, but handle button clicks separately
    <Link 
        to={`/video/${video._id}`} 
        className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col no-underline"
    >
      {/* Thumbnail Area */}
      <div className="block aspect-video overflow-hidden relative">
          <img 
            src={thumbnailUrl} 
            alt={`Thumbnail for ${video.title}`} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            loading="lazy" // Lazy load images for better performance
            onError={handleImageError} 
          />
          {/* Optional: Add an overlay on hover */}
          {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div> */}
      </div>
      
      {/* Card Content */}
      <div className="p-3 flex flex-col flex-grow"> {/* Use flex-grow to push buttons down */}
        {/* Title */}
        <div className="mb-2 flex-grow"> {/* flex-grow allows title to take space */}
            <h3 
                className="font-semibold text-sm md:text-md text-gray-800 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" 
                title={video.title} // Show full title on hover
            >
                {video.title || "Untitled Video"}
            </h3>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-200 dark:border-gray-700"> 
           {/* Favorite Button */}
           <button 
              onClick={(e) => handleActionClick(e, onToggleFavorite)} 
              className={`text-lg p-1 rounded-full transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900 ${isFavorite ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500 hover:text-red-400'}`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </button>
           {/* Delete Button */}
           <button 
                onClick={(e) => handleActionClick(e, onDelete)}
                className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900 text-lg"
                title="Delete Video"
             >
                <FaTrash />
             </button>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
