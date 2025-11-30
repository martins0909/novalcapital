const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Investment = require('../models/Investment');
const Withdrawal = require('../models/Withdrawal');

// Get investments by user ID
const mongoose = require('mongoose');
router.get('/investments/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    let investments = [];
    if (mongoose.Types.ObjectId.isValid(userId)) {
      investments = await Investment.find({ userId: mongoose.Types.ObjectId(userId) });
    } else {
      investments = await Investment.find({ userId });
    }
    res.json(investments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create new user
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Record new investment
router.post('/investments', async (req, res) => {
  try {
    const investment = new Investment(req.body);
    await investment.save();
    res.json(investment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Handle withdrawal request
router.post('/withdrawals', async (req, res) => {
  try {
    const withdrawal = new Withdrawal(req.body);
    await withdrawal.save();
    res.json(withdrawal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
