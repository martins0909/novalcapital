require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Payment = require('./src/models/Payment');
const Investment = require('./src/models/Investment');
const Transaction = require('./src/models/Transaction');

const MONGO_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/blue';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Payment.deleteMany({});
  await Investment.deleteMany({});
  await Transaction.deleteMany({});

  // Create users
  const admin = await User.create({
    email: 'admin@blue.com',
    password: 'adminpass',
    fullName: 'Admin User',
    role: 'admin',
    balance: 10000
  });
  const user = await User.create({
    email: 'user@blue.com',
    password: 'userpass',
    fullName: 'Regular User',
    role: 'user',
    balance: 5000
  });

  // Create payments
  const payment1 = await Payment.create({
    userId: user._id,
    amount: 1000,
    receipt: 'receipt1.png',
    status: 'confirmed'
  });
  const payment2 = await Payment.create({
    userId: admin._id,
    amount: 2000,
    receipt: 'receipt2.png',
    status: 'pending'
  });

  // Create investments
  const investment1 = await Investment.create({
    userId: user._id,
    planName: 'Gold Plan',
    planType: 'fixed',
    investedAmount: 1000,
    currentValue: 1100,
    profit: 100,
    profitPercentage: 10,
    duration: 12,
    roi: 10,
    status: 'active'
  });
  const investment2 = await Investment.create({
    userId: admin._id,
    planName: 'Platinum Plan',
    planType: 'flexible',
    investedAmount: 2000,
    currentValue: 2200,
    profit: 200,
    profitPercentage: 10,
    duration: 6,
    roi: 10,
    status: 'active'
  });

  // Create transactions
  const transaction1 = await Transaction.create({
    userId: user._id,
    type: 'deposit',
    amount: 1000,
    status: 'approved',
    description: 'Initial deposit'
  });
  const transaction2 = await Transaction.create({
    userId: admin._id,
    type: 'withdrawal',
    amount: 500,
    status: 'pending',
    description: 'Admin withdrawal'
  });

  console.log('Seed data created');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
