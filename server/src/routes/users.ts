import { Router, Request, Response } from 'express';
const User = require('../models/User');
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('id email fullName balance createdAt');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user statistics
const Investment = require('../models/Investment');
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const investments = await Investment.find({ userId });
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalProfit = totalCurrentValue - totalInvested;
    res.json({
      totalInvestments: investments.length,
      totalInvested,
      totalCurrentValue,
      totalProfit,
      activeInvestments: investments.filter(inv => inv.status === 'active').length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
// Admin: Get all users
router.get('/admin/all', authMiddleware, async (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// Admin: Edit user
router.put('/admin/:id', authMiddleware, async (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { id } = req.params;
    const { fullName, email, role } = req.body;
    const user = await User.findByIdAndUpdate(id, { fullName, email, role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Admin: Delete user
router.delete('/admin/:id', authMiddleware, async (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Admin: Reset user password
// Admin: Update user account balance
router.post('/admin/:id/balance', authMiddleware, async (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { id } = req.params;
    const { amount } = req.body;
    if (typeof amount !== 'number') {
      return res.status(400).json({ error: 'Amount must be a number' });
    }
    const user = await User.findByIdAndUpdate(id, { $inc: { balance: amount } }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update balance' });
  }
});
const bcrypt = require('bcryptjs');
router.post('/admin/:id/reset-password', authMiddleware, async (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashed });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});
