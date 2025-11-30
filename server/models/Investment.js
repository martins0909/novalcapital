const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  method: { type: String },
  createdAt: { type: Date, default: Date.now }
  ,
  profit: { type: Number, default: 0 },
  currentValue: { type: Number, default: 0 }
});

module.exports = mongoose.model('Investment', investmentSchema);
