const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed passwords in production
  role: { type: String, default: 'user' }, // 'admin' or 'user'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
