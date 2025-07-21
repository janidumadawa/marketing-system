const mongoose = require('mongoose');

const OldTargetSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: String, required: true },
  target: { type: Number, required: true },
});

OldTargetSchema.index({ year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('OldTarget', OldTargetSchema);
