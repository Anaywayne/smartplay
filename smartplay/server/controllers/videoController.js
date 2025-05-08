const Video = require('../models/Video');
const { getTranscriptAndTitle } = require('../services/transcriptService');
const { URL } = require('url'); // Node.js built-in URL parser
const mongoose = require('mongoose'); // To check for valid ObjectId

// Helper function to extract YouTube Video ID from various URL formats
const extractVideoId = (youtubeUrl) => {
    try {
        // Handle potential strings that aren't valid URLs first
        if (!youtubeUrl || typeof youtubeUrl !== 'string' || !youtubeUrl.startsWith('http')) {
             return null;
        }
        const url = new URL(youtubeUrl);
        // Handle standard URLs (youtube.com/watch?v=...)
        if (url.hostname.includes('youtube.com') && url.searchParams.has('v')) {
            return url.searchParams.get('v');
        }
        // Handle short URLs (youtu.be/...)
        if (url.hostname === 'youtu.be') {
            // Take the first part of the path after the slash
            return url.pathname.slice(1).split('/')[0].split('?')[0]; 
        }
        // Handle embed URLs (youtube.com/embed/...)
        if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/embed/')) {
             return url.pathname.split('/')[2].split('?')[0];
        }
        // Handle Shorts URLs (youtube.com/shorts/...)
         if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/shorts/')) {
             return url.pathname.split('/')[2].split('?')[0];
        }
        
        return null; // Not a recognized YouTube URL format we handle
    } catch (error) {
        console.error("Error parsing YouTube URL:", error.message);
        return null; // Invalid URL format
    }
};

// POST /api/videos
// Process and save a new video
exports.processVideo = async (req, res) => {
    const { youtubeUrl } = req.body;
    const userId = req.user.id; // From authMiddleware

    if (!youtubeUrl) {
        return res.status(400).json({ message: 'YouTube URL is required' });
    }

    const youtubeVideoId = extractVideoId(youtubeUrl);
    console.log("Extracted Video ID:", youtubeVideoId); // <-- ADD THIS LINE

    if (!youtubeVideoId) {
        return res.status(400).json({ message: 'Invalid or unsupported YouTube URL format' });
    }

    try {
        // Check if this user has already processed this exact video ID
        const existingVideo = await Video.findOne({ userId, youtubeVideoId });
        if (existingVideo) {
            console.log(`Video ${youtubeVideoId} already processed by user ${userId}. Returning existing.`);
             // Return the existing video's ID so the frontend can navigate
             return res.status(200).json({ 
                 message: 'Video already exists in your list', 
                 video: { // Send consistent structure
                    _id: existingVideo._id,
                    title: existingVideo.title, // Include title for potential immediate use
                    youtubeVideoId: existingVideo.youtubeVideoId
                 }
             });
        }

        // Fetch transcript and title from YouTube
        const videoData = await getTranscriptAndTitle(youtubeVideoId);
        
        // Handle failure to fetch data (no transcript, video unavailable etc.)
        if (!videoData || !videoData.transcript || videoData.transcript.length === 0) {
             const reason = !videoData ? "fetching details failed" : "transcript is unavailable or empty";
             console.warn(`Could not process video ${youtubeVideoId}: ${reason}`);
             return res.status(400).json({ message: `Could not process video: ${reason}. It might be private, unavailable, or lack transcripts.` });
        }

        // Create and save the new video document in the database
        const newVideo = new Video({
            userId,
            youtubeVideoId,
            title: videoData.title || `YouTube Video ${youtubeVideoId}`, // Use fetched title or a fallback
            transcript: videoData.transcript,
            questions: [], // Initialize with empty questions array
            // isFavorite: false // Optional: Default favorite status if adding this field
        });

        const savedVideo = await newVideo.save();
        console.log(`Video ${youtubeVideoId} processed and saved for user ${userId} with DB ID ${savedVideo._id}`);

        // Respond with success and the core details of the new video record
        res.status(201).json({ // 201 Created
            message: 'Video processed and added successfully!',
            video: {
                _id: savedVideo._id,
                title: savedVideo.title,
                youtubeVideoId: savedVideo.youtubeVideoId
            }
        });

    } catch (error) {
        console.error('Error in processVideo controller:', error);
        // Handle potential database errors (like connection issues)
        if (error.name === 'MongoServerError' && error.code === 11000) {
             // Duplicate key error (though the initial check should prevent this unless race condition)
             return res.status(409).json({ message: 'Conflict: Video might have been added simultaneously.' });
        }
        res.status(500).json({ message: 'Server error during video processing' });
    }
};

// GET /api/videos/myvideos
// Fetch all videos belonging to the authenticated user
exports.getUserVideos = async (req, res) => {
    const userId = req.user.id;

    try {
        const videos = await Video.find({ userId })
            .select('_id title youtubeVideoId createdAt') // Only fields needed for dashboard list
            .sort({ createdAt: -1 }); // Show newest first

        res.status(200).json(videos);
        
    } catch (error) {
         console.error('Error fetching user videos:', error);
         res.status(500).json({ message: 'Server error fetching your videos' });
    }
};

// GET /api/videos/:videoId
// Fetch full details for a single video, ensuring ownership
exports.getVideoDetails = async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id;

    // Validate if videoId is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json({ message: 'Invalid video ID format' });
    }

    try {
         // Find the video by its DB ID and ensure it belongs to the current user
         const video = await Video.findOne({ _id: videoId, userId });
         
         if (!video) {
             // Either video doesn't exist or doesn't belong to the user
             return res.status(404).json({ message: 'Video not found or access denied' });
         }
         
         // Send the full video document (including transcript and questions)
         res.status(200).json(video); 

    } catch (error) {
         console.error(`Error fetching details for video ${videoId}:`, error);
         res.status(500).json({ message: 'Server error fetching video details' });
    }
};

// DELETE /api/videos/:videoId
// Delete a video, ensuring ownership
exports.deleteVideo = async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json({ message: 'Invalid video ID format' });
    }

    try {
        // Attempt to find and delete the video belonging to the user in one operation
        const result = await Video.deleteOne({ _id: videoId, userId });
        
        // Check if a document was actually deleted
        if (result.deletedCount === 0) {
            // This means either the video didn't exist or didn't belong to the user
            return res.status(404).json({ message: 'Video not found or you do not have permission to delete it' });
        }
        
        console.log(`Video ${videoId} deleted by user ${userId}`);
        res.status(200).json({ message: 'Video deleted successfully' }); // Send success message

    } catch (error) {
        console.error(`Error deleting video ${videoId}:`, error);
        res.status(500).json({ message: 'Server error while deleting the video' });
    }
};

// Optional: Implement Favorite/Unfavorite function if needed
// exports.toggleFavorite = async (req, res) => { ... }
