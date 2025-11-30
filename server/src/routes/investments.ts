import { Router, Request, Response } from 'express';
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get all investments for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const investments = await Investment.find({ userId }).sort({ createdAt: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

// Create new investment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { planName, planType, investedAmount, duration, roi } = req.body;
    if (!planName || !planType || !investedAmount || !duration || !roi) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    const investment = await Investment.create({
      userId,
      planName,
      planType,
      investedAmount,
      currentValue: investedAmount,
      duration,
      roi,
      startDate,
      endDate
    });
    res.status(201).json({ message: 'Investment created successfully', investment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create investment' });
  }
});

// Get investment by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const investment = await Investment.findOne({ _id: id, userId });
    if (!investment) return res.status(404).json({ error: 'Investment not found' });
    res.json(investment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investment' });
  }
});

// Update investment (for profit updates)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { currentValue, profit, profitPercentage } = req.body;
    const investment = await Investment.findOne({ _id: id, userId });
    if (!investment) return res.status(404).json({ error: 'Investment not found' });
    investment.currentValue = currentValue || investment.currentValue;
    investment.profit = profit !== undefined ? profit : investment.profit;
    investment.profitPercentage = profitPercentage !== undefined ? profitPercentage : investment.profitPercentage;
    await investment.save();
    res.json({ message: 'Investment updated successfully', investment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update investment' });
  }
});

// Withdraw from investment
router.post('/:id/withdraw', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }
    const investment = await Investment.findOne({ _id: id, userId });
    if (!investment) return res.status(404).json({ error: 'Investment not found' });
    if (investment.status !== 'active' && investment.status !== 'completed') {
      return res.status(400).json({ error: 'Cannot withdraw from this investment' });
    }
    if (amount > investment.currentValue) {
      return res.status(400).json({ error: 'Insufficient funds in investment' });
    }
    investment.currentValue -= amount;
    if (investment.currentValue === 0) investment.status = 'completed';
    await investment.save();
    await Transaction.create({
      userId,
      type: 'withdrawal',
      amount,
      status: 'completed',
      description: `Withdrawal from ${investment.planName}`
    });
    res.json({ message: 'Withdrawal successful', investment, withdrawnAmount: amount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

export default router;
// Admin: Get all investments
router.get('/admin/all', authMiddleware, async (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const investments = await Investment.find({}).populate('userId');
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

// Admin: Update investment status
router.put('/admin/:id/status', authMiddleware, async (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { id } = req.params;
    const { status } = req.body;
    const investment = await Investment.findByIdAndUpdate(id, { status }, { new: true });
    res.json(investment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update investment status' });
  }
});
