const mongoose = require('mongoose');

// Subdocument schema for individual transcript parts
const transcriptPartSchema = new mongoose.Schema({
  text: { type: String, required: true },
  start: { type: Number, required: true }, // Start time in seconds
  duration: { type: Number, required: true } // Duration in seconds
}, { _id: false }); // Don't create separate IDs for transcript parts

// Subdocument schema for questions/answers related to this video
const questionAnswerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  askedAt: { type: Date, default: Date.now },
  // Optional: relevantTimestamp: Number // To link answer to a video point
}, { _id: true, timestamps: { createdAt: 'askedAt', updatedAt: false } }); // Use _id and customize timestamp name

const videoSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  youtubeVideoId: { // More specific name
    type: String, 
    required: true, 
    index: true // Index for faster lookups
  },
  title: { 
    type: String, 
    required: true 
  },
  transcript: [transcriptPartSchema], // Array of transcript parts
  questions: [questionAnswerSchema] // Array of Q&A for this video
}, { timestamps: true }); // Add createdAt/updatedAt timestamps for the video record

// Index userId and youtubeVideoId together for efficient user-specific video lookups
videoSchema.index({ userId: 1, youtubeVideoId: 1 }); 

module.exports = mongoose.model('Video', videoSchema);
