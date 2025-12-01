import { Router, Request, Response } from 'express';
const Transaction = require('../models/Transaction');
const User = require('../models/User');
import { authMiddleware } from '../middleware/auth';

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
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Admin: Approve transaction
router.post('/admin/:id/approve', authMiddleware, async (req: Request, res: Response) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { id } = req.params;
    const tx = await Transaction.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
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
    const tx = await Transaction.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject transaction' });
  }
});