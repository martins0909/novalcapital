
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const User = require('../models/User');
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = Router();


// Password reset token model (in-memory for demo, use DB in production)
const passwordResetTokens: Record<string, { userId: string; expires: number }> = {};

// Send email utility (configure for production)
const sendResetEmail = async (email: string, token: string) => {
  // Configure your SMTP transport here
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // Replace with your SMTP host
    port: 587,
    secure: false,
    auth: {
      user: 'your@email.com',
      pass: 'yourpassword',
    },
  });
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
  await transporter.sendMail({
    from: 'noreply@example.com',
    to: email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });
};

// Forgot Password
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: 'If your email exists, a reset link has been sent.' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  passwordResetTokens[token] = { userId: user._id.toString(), expires: Date.now() + 1000 * 60 * 30 };
  await sendResetEmail(email, token);
  res.status(200).json({ message: 'If your email exists, a reset link has been sent.' });
});

// Reset Password
router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password required' });
  }
  const reset = passwordResetTokens[token];
  if (!reset || reset.expires < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
  const user = await User.findById(reset.userId);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }
  user.password = password;
  await user.save();
  delete passwordResetTokens[token];
  res.json({ message: 'Password reset successful' });
});

// Helper: Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper: Validate password strength
const isValidPassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
    return { valid: false, message: 'Password must include uppercase, lowercase, and numbers' };
  }
  return { valid: true };
};

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role, referralCode } = req.body;
    console.log('[REGISTER] Request:', { email, fullName, referralCode });

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate unique referral code
    let newReferralCode;
    do {
      newReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    } while (await User.findOne({ referralCode: newReferralCode }));

    // Handle referral
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      console.log('[REGISTER] Referrer found:', referrer ? referrer.email : 'none');
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
      // Add $5 bonus to referrer
      referrer.referralEarnings += 5;
      referrer.accountBalance += 5;
      await referrer.save();
      console.log('[REGISTER] Referrer updated:', referrer.email, 'earnings:', referrer.referralEarnings);
    }

    const user = await User.create({
      email,
      password,
      fullName,
      role: role === 'admin' ? 'admin' : 'user',
      referralCode: newReferralCode,
      referredBy: referrer ? referrer._id : null
    });
    console.log('[REGISTER] New user created:', user.email, 'code:', user.referralCode);

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        referralCode: user.referralCode
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (password !== user.password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;
