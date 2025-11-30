const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, required: true },
  planType: { type: String, required: true },
  investedAmount: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  profit: { type: Number, default: 0 },
  profitPercentage: { type: Number, default: 0 },
  duration: { type: Number, required: true },
  roi: { type: Number, required: true },
  status: { type: String, default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Investment', InvestmentSchema);
