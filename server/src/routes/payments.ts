import { Router, Request, Response } from 'express';
const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: (error: Error | null, destination: string) => void) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req: Request, file: any, cb: (error: Error | null, filename: string) => void) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// User: Upload receipt for existing payment
router.post('/user/receipt', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { paymentId, receipt } = req.body;
    if (!paymentId || !receipt) {
      return res.status(400).json({ error: 'Missing paymentId or receipt' });
    }
    // Update payment with receipt
    const payment = await Payment.findByIdAndUpdate(paymentId, { receipt }, { new: true });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ message: 'Receipt uploaded', payment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload receipt' });
  }
});

// User: Create payment and transaction
router.post('/user/create', authMiddleware, upload.single('receipt'), async (req: Request, res: Response) => {
  try {
    const { amount, currency, method, transactionId, date } = req.body;
    const userId = req.userId;
    let receiptUrl = '';
    if (req.file) {
      receiptUrl = '/uploads/' + req.file.filename;
    } else if (req.body.receipt) {
      receiptUrl = req.body.receipt;
    }
    // Save payment to MongoDB
    const payment = await Payment.create({
      userId,
      amount: Number(amount),
      currency,
      method,
      receipt: receiptUrl,
      transactionId,
      status: 'Pending',
      date,
    });
    // Save transaction to MongoDB
    await Transaction.create({
      userId,
      type: 'payment',
      amount: Number(amount),
      status: 'Pending',
      description: `Payment via ${method}`,
      transactionId,
      date,
    });
    res.status(201).json({ message: 'Payment and transaction recorded', payment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// Admin: Get all payments
router.get('/admin/all', authMiddleware, async (req: Request, res: Response) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const payments = await Payment.find({}).populate('userId');
    console.log('[ADMIN] /admin/all payments:', payments);
    res.json(payments);
  } catch (err) {
    console.error('[ADMIN] /admin/all error:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Admin: Confirm payment
router.post('/admin/:id/confirm', authMiddleware, async (req: Request, res: Response) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndUpdate(id, { status: 'Confirmed' }, { new: true });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    if (!payment.userId) {
      return res.status(400).json({ error: 'Payment missing userId' });
    }
    await User.findByIdAndUpdate(payment.userId, { $inc: { balance: payment.amount } });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Admin: Reject payment
router.post('/admin/:id/reject', authMiddleware, async (req: Request, res: Response) => {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject payment' });
  }
});

export default router;
