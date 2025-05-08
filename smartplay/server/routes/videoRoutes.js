const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Authentication middleware
const videoController = require('../controllers/videoController'); // Video controller functions

// All routes defined here are automatically prefixed with '/api/videos' (defined in server.js)

// POST /api/videos
// Process a new YouTube video URL and save its data
router.post('/', authMiddleware, videoController.processVideo);

// GET /api/videos/myvideos
// Get a list of videos belonging to the currently authenticated user
router.get('/myvideos', authMiddleware, videoController.getUserVideos);

// GET /api/videos/:videoId
// Get detailed information for a specific video (by its database _id)
// Ensures the video belongs to the authenticated user within the controller
router.get('/:videoId', authMiddleware, videoController.getVideoDetails);

// DELETE /api/videos/:videoId
// Delete a specific video (by its database _id)
// Ensures the video belongs to the authenticated user within the controller
router.delete('/:videoId', authMiddleware, videoController.deleteVideo);

// Optional: Add routes for favoriting/unfavoriting if implemented
// PATCH /api/videos/:videoId/favorite
// router.patch('/:videoId/favorite', authMiddleware, videoController.toggleFavorite);

module.exports = router;
