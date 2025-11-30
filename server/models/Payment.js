const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String },
  method: { type: String },
  status: { type: String, default: 'pending' },
  date: { type: Date, default: Date.now },
  receipt: { type: String },
  transactionId: { type: String },
});

module.exports = mongoose.model('Payment', paymentSchema);
