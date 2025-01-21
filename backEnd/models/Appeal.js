const mongoose = require('mongoose');

const appealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    minLength: 10
  },
  category: {
    type: String,
    required: true,
    enum: ['Medical', 'Education', 'Emergency', 'Community', 'Natural Disaster', 'Other']
  },
  description: {
    type: String,
    required: true,
    minLength: 50
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  beneficiaryName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  documentUrls: [{
    type: String
  }],
  currentAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appeal', appealSchema);