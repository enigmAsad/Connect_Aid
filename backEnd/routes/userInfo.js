// backEnd/routes/userInfo.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.get('/details', authMiddleware, async (req, res) => {
  try {
    // req.user is now populated by the authMiddleware
    const user = await User.findById(req.user._id).select('username');
    console.log(user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;