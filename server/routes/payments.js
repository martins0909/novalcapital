const User = require('../models/User');
// Create a new payment (Fund Wallet form)
router.post('/user/create', async (req, res) => {
  try {
    const { userId, amount, currency, method } = req.body;
    if (!userId || !amount || !currency || !method) return res.status(400).json({ error: 'Missing required fields' });
    const payment = new Payment({ userId, amount, currency, method, status: 'pending' });
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Upload receipt for a payment
router.post('/user/receipt', async (req, res) => {
  try {
    const { paymentId, receipt } = req.body;
    if (!paymentId || !receipt) return res.status(400).json({ error: 'Missing paymentId or receipt' });
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    payment.receipt = receipt;
    payment.status = 'awaiting_confirmation';
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Admin confirm payment and add to user balance
router.post('/admin/confirm', async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    if (payment.status === 'confirmed') return res.status(400).json({ error: 'Already confirmed' });
    payment.status = 'confirmed';
    await payment.save();
    // Add to user balance
    const user = await User.findById(payment.userId);
    if (user) {
      user.balance += payment.amount;
      await user.save();
    }
    res.json({ payment, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Admin decline payment
router.post('/admin/decline', async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    payment.status = 'declined';
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Get all payments for a user
router.get('/user/all', async (req, res) => {
  try {
    // You may want to use req.user.id if using authentication
    const userId = req.query.userId || req.body.userId || req.user?.id;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    const payments = await Payment.find({ userId });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
