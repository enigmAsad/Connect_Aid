const express = require('express');
const Appeal = require('../models/Appeal');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/appeals/');
  },
  filename: (req, file, cb) => {
    cb(null, `appeal-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Error: Images Only!'));
  }
});

// Create a new appeal
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, targetAmount, reason } = req.body;
    
    const newAppeal = new Appeal({
      user: req.user._id,
      title,
      description,
      targetAmount: parseFloat(targetAmount),
      reason,
      // Use full path including server URL if needed
      image: req.file 
        ? `/uploads/appeals/${req.file.filename}` 
        : '/api/placeholder/400/300'
    });

    await newAppeal.save();

    res.status(201).json(newAppeal);
  } catch (error) {
    console.error('Appeal creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's appeals
router.get('/my-appeals', authMiddleware, async (req, res) => {
  try {
    const appeals = await Appeal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(appeals);
  } catch (error) {
    console.error('Fetching user appeals error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all active appeals (for donation page)
router.get('/', async (req, res) => {
  try {
    const appeals = await Appeal.find({ status: 'active' })
      .populate('user', 'username firstName lastName')
      .sort({ createdAt: -1 });
    res.json(appeals);
  } catch (error) {
    console.error('Fetching appeals error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;