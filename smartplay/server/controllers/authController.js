const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// --- Registration ---
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10); // Generate salt
    const passwordHash = await bcrypt.hash(password, salt); // Hash password

    // 4. Create new user
    const newUser = new User({
      email: email.toLowerCase(), // Store email in lowercase
      passwordHash, // Store the hashed password
    });

    // 5. Save user to database
    const savedUser = await newUser.save();

    // 6. Respond (don't send password hash)
    res.status(201).json({ // 201 Created
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        email: savedUser.email,
      },
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// --- Login ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Use a generic message for security (don't reveal if email exists)
      return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
    }

    // 3. Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
    }

    // 4. Generate JWT token
    const payload = {
      userId: user._id, // Include user ID in the token payload
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expiration (e.g., 7 days) - adjust as needed
    );

    // 5. Respond with the token
    res.status(200).json({
      message: 'Login successful',
      token: token, // Send the token to the client
      user: { // Optionally send some non-sensitive user info
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
