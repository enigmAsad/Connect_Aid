// backEnd/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Extract token from "Bearer TOKEN" format
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key'
    );

    // Find user by ID from token
    const user = await User.findById(decoded.userId || decoded.user?.id).select('-password');

    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;