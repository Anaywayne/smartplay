const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  // 1. Get token from header
  const authHeader = req.headers.authorization;

  // 2. Check if token exists and is in the correct format (Bearer <token>)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token part

  try {
    // 3. Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user information (payload) to the request object
    // We stored { userId: user._id } in the payload during login
    req.user = { id: decoded.userId }; // Attach user ID

    // 5. Call the next middleware or route handler
    next();

  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    // Handle other potential errors during verification
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
  }
};

module.exports = authMiddleware;
