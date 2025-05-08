const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
// Import chat controller
const { askQuestion } = require('../controllers/chatController');

// Ask a question about a specific video (using its database _id)
router.post('/:videoId', authMiddleware, askQuestion);

module.exports = router;
