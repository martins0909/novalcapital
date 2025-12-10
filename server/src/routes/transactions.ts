import { Router, Request, Response } from 'express';
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Investment = require('../models/Investment');
import { authMiddleware } from '../middleware/auth';
import { sendNotificationEmail } from '../utils/emailService';

const router = Router();

// Get all transactions for a user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { type, status, limit = 50 } = req.query;
    const query: any = { userId };
    if (type) query.type = type;
    if (status) query.status = status;
    const transactions = await Transaction.find(query).sort({ createdAt: -1 }).limit(Number(limit));
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get transaction by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Create manual transaction (deposit)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { type, amount, description } = req.body;
    if (!type || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid transaction data' });
    }
    const validTypes = ['deposit', 'withdrawal', 'investment', 'profit'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }
    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      status: type === 'deposit' ? 'pending' : 'completed',
      description: description || `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`
    });

    // Fetch user details for email
    const user = await User.findById(userId);

    // Send notification email if it's a deposit or withdrawal
    if (type === 'deposit' || type === 'withdrawal') {
      await sendNotificationEmail(
        `New ${type.charAt(0).toUpperCase() + type.slice(1)} Transaction`,
        `<p>A new ${type} transaction has been created.</p>
         <p><strong>User:</strong> ${user ? user.fullName : 'Unknown'} (${user ? user.email : 'Unknown'})</p>
         <p><strong>Type:</strong> ${type}</p>
         <p><strong>Amount:</strong> ${amount}</p>
         <p><strong>Status:</strong> ${transaction.status}</p>
         <p><strong>Description:</strong> ${transaction.description}</p>`
      );
    }

    res.status(201).json({ message: 'Transaction created', transaction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

export default router;
// Admin: Get all transactions
router.get('/admin/all', authMiddleware, async (req: Request, res: Response) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const txs = await Transaction.find({}).populate('userId');
    console.log('[ADMIN] /admin/all transactions:', txs);
    res.json(txs);
  } catch (err) {
    console.error('[ADMIN] /admin/all error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Admin: Approve transaction
router.post('/admin/:id/approve', authMiddleware, async (req: Request, res: Response) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { id } = req.params;
    const tx = await Transaction.findByIdAndUpdate(id, { status: 'approved' }, { new: true }).populate('userId');

    if (tx && tx.userId) {
      await sendNotificationEmail(
        'Transaction Approved',
        `<p>Your transaction has been approved.</p>
         <p><strong>Type:</strong> ${tx.type}</p>
         <p><strong>Amount:</strong> ${tx.amount}</p>
         <p><strong>Status:</strong> Approved</p>`
      );
    }

    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve transaction' });
  }
});

// Admin: Reject transaction
router.post('/admin/:id/reject', authMiddleware, async (req: Request, res: Response) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { id } = req.params;
    const tx = await Transaction.findByIdAndUpdate(id, { status: 'rejected' }, { new: true }).populate('userId');

    // Refund if it was a withdrawal from investment
    if (tx.type === 'withdrawal' && tx.investmentId) {
      const investment = await Investment.findById(tx.investmentId);
      if (investment) {
        investment.currentValue += tx.amount;
        if (investment.status === 'completed' && investment.currentValue > 0) {
          investment.status = 'active';
        }
        await investment.save();
      }
    }

    if (tx && tx.userId) {
      await sendNotificationEmail(
        'Transaction Rejected',
        `<p>Your transaction has been rejected.</p>
         <p><strong>Type:</strong> ${tx.type}</p>
         <p><strong>Amount:</strong> ${tx.amount}</p>
         <p><strong>Status:</strong> Rejected</p>`
      );
    }

    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject transaction' });
  }
});