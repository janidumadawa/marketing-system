// backend/models/OldTarget.js
const mongoose = require('mongoose');

const oldTargetSchema = new mongoose.Schema({
  year: { 
    type: Number, 
    required: true 
  },
  month: { 
    type: String, 
    required: true 
  },
  target: { 
    type: Number, 
    required: true 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Update the index to include user for user-specific unique constraints
oldTargetSchema.index({ user: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('OldTarget', oldTargetSchema);