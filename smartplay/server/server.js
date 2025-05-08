const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose'); // Add this import

// Import Routes
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/chat', chatRoutes);

// Add a root route handler
app.get('/', (req, res) => {
  res.send('SmartPlay API is running. Use /api/... endpoints to access the API.');
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    mongoDBConnection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
