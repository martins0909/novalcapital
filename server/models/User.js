const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed passwords in production
  fullName: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'admin' or 'user'
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralEarnings: { type: Number, default: 0 },
  accountBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
