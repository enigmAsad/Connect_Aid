// In your donations.js routes file
const express = require('express');
const Appeal = require('../models/Appeal');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Process a donation for a specific appeal
router.post('/:appealId', authMiddleware, async (req, res) => {
  try {
    const { appealId } = req.params;
    const { amount } = req.body;

    // Validate donation amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid donation amount' });
    }

    // Find the appeal
    const appeal = await Appeal.findById(appealId);

    if (!appeal) {
      return res.status(404).json({ message: 'Appeal not found' });
    }

    // Update current amount
    appeal.currentAmount = (appeal.currentAmount || 0) + amount;

    // Update status if target is reached
    if (appeal.currentAmount >= appeal.targetAmount) {
      appeal.status = 'completed';
    }

    await appeal.save();

    // Optional: Create a donation record in a separate Donation model
    // const donation = new Donation({
    //   user: req.user._id,
    //   appeal: appealId,
    //   amount
    // });
    // await donation.save();

    res.json(appeal);
  } catch (error) {
    console.error('Donation processing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;