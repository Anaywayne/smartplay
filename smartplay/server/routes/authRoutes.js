const express = require('express');
const router = express.Router();
// Import the controller functions
const { register, login } = require('../controllers/authController');

// Define the actual auth routes
router.post('/register', register); // Use the register controller function
router.post('/login', login);       // Use the login controller function

module.exports = router;
