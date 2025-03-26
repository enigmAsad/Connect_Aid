const mongoose = require("mongoose");

const appealSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  targetAmount: { 
    type: Number, 
    required: true,
    min: 0 
  },
  currentAmount: { 
    type: Number, 
    default: 0 
  },
  image: { 
    type: String, 
    default: '/api/placeholder/400/300' 
  },
  reason: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'closed'], 
    default: 'active' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appeal', appealSchema);