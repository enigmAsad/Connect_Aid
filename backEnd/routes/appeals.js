const express = require('express');
const Appeal = require('../models/Appeal');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
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
    const { title, description, targetAmount, category } = req.body;
    
    const newAppeal = new Appeal({
      user: req.user._id,
      title,
      description,
      targetAmount: parseFloat(targetAmount),
      category: category || 'other',
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

// Get a single appeal by ID
// Change this route from authenticated to public
router.get('/:id', async (req, res) => {
  try {
    const appeal = await Appeal.find({ _id: req.params.id });
    
    if (!appeal || appeal.length === 0) {
      return res.status(404).json({ message: 'Appeal not found' });
    }

    res.json(appeal[0]); // Return the first (and only) appeal
  } catch (error) {
    console.error('Fetching single appeal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update an appeal
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, targetAmount, category } = req.body;
    
    // Find the existing appeal
    const appeal = await Appeal.findById(req.params.id);

    // Verify appeal exists and belongs to the user
    if (!appeal || appeal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Appeal not found' });
    }

    // If a new image is uploaded, delete the old image (if it exists and is not a placeholder)
    if (req.file && appeal.image && !appeal.image.includes('/api/placeholder/')) {
      try {
        await fs.unlink(path.join('.' + appeal.image));
      } catch (unlinkError) {
        console.error('Error deleting old image:', unlinkError);
      }
    }

    // Update appeal details
    appeal.title = title;
    appeal.description = description;
    appeal.targetAmount = parseFloat(targetAmount);
    appeal.category = category || 'other';

    // Update image if a new one is uploaded
    if (req.file) {
      appeal.image = `/uploads/appeals/${req.file.filename}`;
    }

    await appeal.save();

    res.json(appeal);
  } catch (error) {
    console.error('Appeal update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete an appeal
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Find the appeal
    const appeal = await Appeal.findById(req.params.id);

    // Verify appeal exists and belongs to the user
    if (!appeal || appeal.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Appeal not found' });
    }

    // Delete the associated image file if it exists and is not a placeholder
    if (appeal.image && !appeal.image.includes('/api/placeholder/')) {
      try {
        await fs.unlink(path.join('.' + appeal.image));
      } catch (unlinkError) {
        console.error('Error deleting appeal image:', unlinkError);
      }
    }

    // Remove the appeal from the database
    await Appeal.findByIdAndDelete(req.params.id);

    res.json({ message: 'Appeal deleted successfully' });
  } catch (error) {
    console.error('Appeal deletion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;