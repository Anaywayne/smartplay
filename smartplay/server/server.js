const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Added DB connection import

dotenv.config();

connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies


// Define Routes (will be added below)
// ... (other imports like express, cors, dotenv, connectDB)

// Import Routes
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();
connectDB();


// --- Add these lines ---
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/chat', chatRoutes); 
// --- End of lines to add ---
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'Server is running', 
        mongoDBConnection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' 
    });
  });
const PORT = process.env.PORT || 5000;

// Health Check Route (added in next step)


module.exports = app;


// Basic Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export app for potential testing
