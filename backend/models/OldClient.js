const mongoose = require('mongoose');

// Only schema definition should be here
const oldClientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  amountSpent: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    required: true,
    enum: [  // Validation for months
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
  }
});

// Only export the model
module.exports = mongoose.model('OldClient', oldClientSchema);
