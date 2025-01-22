const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Signup Route
router.post('/signup', [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { username, email, password } = req.body;

    // Check if user exists (either email or username)
    let existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ msg: 'Email already registered' });
      }
      return res.status(400).json({ msg: 'Username already taken' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      msg: 'User created successfully',
      token,
      user: { 
        id: user.id, 
        email: user.email,
        username: user.username 
      }
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ msg: 'Server error during signup' });
  }
});

// Login Route remains the same as it uses email/password
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  try {
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Log successful login
    console.log('Login successful for:', email);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      },
      msg: 'Login successful'
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// OAuth routes and middleware remain the same...
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body; 
    let user = await User.findOne({ email: googleEmail });
    
    if (!user) {
      user = new User({
        email: googleEmail,
        username: googleEmail.split('@')[0], // Generate username from email
        authProvider: 'google'
      });
      await user.save();
    }

    // Create JWT token
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            email: user.email,
            username: user.username
          },
          msg: 'Login successful'
        });
      }
    );
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ msg: 'Server error during Google authentication' });
  }
});

// Rest of your routes remain the same...

module.exports = router;