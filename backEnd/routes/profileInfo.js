const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      country: user.country,
      profession: user.profession,
      bio: user.bio,
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const {
      firstName, 
      lastName, 
      phone, 
      country, 
      profession, 
      bio,
      avatar
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id, 
      {
        firstName, 
        lastName, 
        phone, 
        country, 
        profession, 
        bio,
        avatar
      }, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('balance');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Top up balance
router.post('/balance/topup', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid top-up amount' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { $inc: { balance: amount } }, 
      { new: true, select: 'balance' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Balance topped up successfully', 
      balance: user.balance 
    });
  } catch (error) {
    console.error('Balance top-up error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Deduct balance (for purchases)
router.post('/balance/deduct', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid deduction amount' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ 
        message: 'Insufficient balance', 
        currentBalance: user.balance 
      });
    }

    user.balance -= amount;
    await user.save();

    res.json({ 
      message: 'Balance deducted successfully', 
      balance: user.balance 
    });
  } catch (error) {
    console.error('Balance deduction error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
