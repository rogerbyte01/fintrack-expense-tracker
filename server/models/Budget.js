const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    set: v => v.toLowerCase()
  },
  monthlyLimit: {
    type: Number,
    required: true,
    min: 1
  },
  rolloverEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);
