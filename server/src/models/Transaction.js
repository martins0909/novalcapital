const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  description: { type: String },
  details: { type: Object }, // Store payment details (bank info, wallet address, etc.)
  investmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }, // Optional link to investment
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
