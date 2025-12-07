import { Router, Request, Response } from 'express';
const User = require('../models/User');
import { authMiddleware } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();

// Get user profile
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const userId = req.userId;
    console.log('[PROFILE] Token:', token);
    console.log('[PROFILE] userId:', userId);
    let user = await User.findById(userId).select('id email fullName balance referralCode referralEarnings createdAt');
    if (!user) {
      console.log('[PROFILE] User not found for userId:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('[PROFILE] User:', user.email, 'code:', user.referralCode, 'earnings:', user.referralEarnings);
    // Generate referral code if missing
    if (!user.referralCode) {
      let newReferralCode;
      do {
        newReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      } while (await User.findOne({ referralCode: newReferralCode }));
      user.referralCode = newReferralCode;
      await user.save();
      console.log('[PROFILE] Generated referral code for user:', userId, newReferralCode);
    }
    console.log('[PROFILE] User found:', user);
    res.json(user);
  } catch (error) {
    console.error('[PROFILE] Error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user statistics
const Investment = require('../models/Investment');
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const investments = await Investment.find({ userId });
    const totalInvested = investments.reduce((sum: number, inv: any) => sum + inv.investedAmount, 0);
    const totalCurrentValue = investments.reduce((sum: number, inv: any) => sum + inv.currentValue, 0);
    const totalProfit = totalCurrentValue - totalInvested;
    res.json({
      totalInvestments: investments.length,
      totalInvested,
      totalCurrentValue,
      totalProfit,
      activeInvestments: investments.filter((inv: any) => inv.status === 'active').length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Admin: Get all users
router.get('/admin/all', authMiddleware, async (req: Request, res: Response) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const users = await User.find({}).select('id email fullName role balance');
    console.log('[ADMIN] /admin/all users:', users);
    res.json(users);
  } catch (err) {
    console.error('[ADMIN] /admin/all error:', err);
    res.status(500).json({ error: 'Failed to fetch users', details: err instanceof Error ? err.message : String(err) });
  }
});

// Admin: Edit user
router.put('/admin/:id', authMiddleware, async (req: Request, res: Response) => {
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
router.delete('/admin/:id', authMiddleware, async (req: Request, res: Response) => {
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
router.post('/admin/:id/balance', authMiddleware, async (req: Request, res: Response) => {
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
// Admin: Get referral statistics
router.get('/admin/referrals', authMiddleware, async (req: Request, res: Response) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const users = await User.find({ referralCode: { $exists: true } }).select('email fullName referralCode referralEarnings');
    const referrals = await Promise.all(users.map(async (user: any) => {
      const referralsCount = await User.countDocuments({ referredBy: user._id });
      return {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        referralCode: user.referralCode,
        referralsCount,
        referralEarnings: user.referralEarnings
      };
    }));
    res.json(referrals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
});

export default router;
