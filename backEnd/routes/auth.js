// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      email,
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
      user: { id: user.id, email: user.email }
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ msg: 'Server error during signup' });
  }
});

// Login Route
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
// router.post('/login', loginValidation, async (req, res) => {
//   // Check for validation errors
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ msg: errors.array()[0].msg });
//   }

//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid email or password' });
//     }

//     // Validate password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid email or password' });
//     }

//     // Create and sign JWT token
//     const payload = {
//       user: {
//         id: user._id,
//         email: user.email
//       }
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({
//           token,
//           user: {
//             id: user._id,
//             email: user.email
//           },
//           msg: 'Login successful'
//         });
//       }
//     );
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// @route   POST /api/auth/google
// @desc    Google OAuth login/signup
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body; // Google OAuth token

    // Verify token with Google OAuth API
    // Note: Implementation depends on your Google OAuth setup
    // const ticket = await client.verifyIdToken({...})
    
    // Find or create user
    let user = await User.findOne({ email: googleEmail });
    
    if (!user) {
      user = new User({
        email: googleEmail,
        // Add other necessary user fields
        authProvider: 'google'
      });
      await user.save();
    }

    // Create JWT token
    const payload = {
      user: {
        id: user._id,
        email: user.email
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
            email: user.email
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

// @route   POST /api/auth/github
// @desc    GitHub OAuth login/signup
// @access  Public
router.post('/github', async (req, res) => {
  try {
    const { code } = req.body; // GitHub OAuth code

    // Exchange code for access token
    // Note: Implementation depends on your GitHub OAuth setup
    // const { access_token } = await axios.post('https://github.com/login/oauth/access_token'...)
    
    // Get user data from GitHub
    // const githubUser = await axios.get('https://api.github.com/user'...)
    
    let user = await User.findOne({ email: githubEmail });
    
    if (!user) {
      user = new User({
        email: githubEmail,
        // Add other necessary user fields
        authProvider: 'github'
      });
      await user.save();
    }

    // Create JWT token
    const payload = {
      user: {
        id: user._id,
        email: user.email
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
            email: user.email
          },
          msg: 'Login successful'
        });
      }
    );
  } catch (err) {
    console.error('GitHub auth error:', err);
    res.status(500).json({ msg: 'Server error during GitHub authentication' });
  }
});

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// @route   GET /api/auth/user
// @desc    Get authenticated user
// @access  Private
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// In auth.js - Login Route
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
        email: user.email
      },
      msg: 'Login successful'
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;