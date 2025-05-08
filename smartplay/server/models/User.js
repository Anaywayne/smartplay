const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, // Store emails consistently
    trim: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  // Optional: Reference videos associated with the user
  // videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }] 
}, { timestamps: true }); // Add createdAt/updatedAt timestamps

module.exports = mongoose.model('User', userSchema);
