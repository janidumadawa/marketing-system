const mongoose = require('mongoose');

const monthlyTargetSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  month: {
    type: String,
    required: true,
    unique: true
  },
  target: {
    type: Number,
    required: true
  },
  // total will be calculated dynamically
});

module.exports = mongoose.model('MonthlyTarget', monthlyTargetSchema);
