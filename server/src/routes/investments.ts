import { Router, Request, Response } from 'express';
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
import { authMiddleware } from '../middleware/auth';
import { sendNotificationEmail } from '../utils/emailService';

const router = Router();

// Get all investments for a user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const investments = await Investment.find({ userId }).sort({ createdAt: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

// Get investments for a specific user (admin only)
router.get('/user/:userId', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const userId = req.params.userId;
    const investments = await Investment.find({ userId }).sort({ createdAt: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

// Create new investment
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { planName, planType, investedAmount, duration, roi } = req.body;
    if (!planName || !planType || !investedAmount || !duration || !roi) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check user balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.balance < investedAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct balance
    user.balance -= investedAmount;
    await user.save();

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

    // Create transaction for investment
    await Transaction.create({
      userId,
      type: 'investment',
      amount: investedAmount,
      status: 'completed',
      description: `Investment in ${planName}`,
      investmentId: investment._id
    });

    // Send notification email
    await sendNotificationEmail(
      'New Investment Created',
      `<p>A new investment has been created.</p>
       <p><strong>User:</strong> ${user.fullName} (${user.email})</p>
       <p><strong>Plan:</strong> ${planName} (${planType})</p>
       <p><strong>Amount:</strong> ${investedAmount}</p>
       <p><strong>Duration:</strong> ${duration} days</p>
       <p><strong>ROI:</strong> ${roi}%</p>`
    );

    res.status(201).json({ message: 'Investment created successfully', investment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create investment' });
  }
});

// Get investment by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
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
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
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
router.post('/:id/withdraw', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { amount, paymentDetails } = req.body;
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
    
    const transaction = await Transaction.create({
      userId,
      type: 'withdrawal',
      amount,
      status: 'pending',
      description: `Withdrawal from ${investment.planName}`,
      details: paymentDetails,
      investmentId: investment._id
    });

    // Fetch user details for email
    const user = await User.findById(userId);

    // Send notification email to Admin
    await sendNotificationEmail(
      'New Withdrawal Request',
      `<p>A new withdrawal request has been submitted.</p>
       <p><strong>User:</strong> ${user ? user.fullName : 'Unknown'} (${user ? user.email : 'Unknown'})</p>
       <p><strong>Plan:</strong> ${investment.planName}</p>
       <p><strong>Amount:</strong> ${amount}</p>
       <p><strong>Payment Details:</strong> <pre>${JSON.stringify(paymentDetails, null, 2)}</pre></p>`
    );

    res.json({ message: 'Withdrawal request submitted successfully', investment, withdrawnAmount: amount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

export default router;
// Admin: Get all investments
router.get('/admin/all', authMiddleware, async (req: Request, res: Response) => {
    if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    try {
      const investments = await Investment.find({}).populate('userId');
      console.log('[ADMIN] /admin/all investments:', investments);
      res.json(investments);
    } catch (err) {
      console.error('[ADMIN] /admin/all error:', err);
      res.status(500).json({ error: 'Failed to fetch investments' });
    }
});

// Admin: Update investment status
router.put('/admin/:id/status', authMiddleware, async (req: Request, res: Response) => {
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
