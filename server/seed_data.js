// Seed script for transactions, investments, and payments
const mongoose = require('mongoose');
const Transaction = require('./src/models/Transaction');
const Investment = require('./src/models/Investment');
const Payment = require('./src/models/Payment');
const User = require('./src/models/User');

const MONGO_URI = 'mongodb+srv://georgegoodlook_db_user:8hoPDo8kf1zP53F0@blue.jc2ki4r.mongodb.net/bluestockfx?retryWrites=true&w=majority&appName=blue';

async function seedData() {
  await mongoose.connect(MONGO_URI);
  const users = await User.find({});
  const user1 = users[0];
  const user2 = users[1];

  // Transactions
  await Transaction.deleteMany({});
  await Transaction.create([
    {
      userId: user1._id,
      type: 'deposit',
      amount: 2000,
      status: 'completed',
      createdAt: new Date(),
    },
    {
      userId: user2._id,
      type: 'withdrawal',
      amount: 500,
      status: 'pending',
      createdAt: new Date(),
    }
  ]);

  // Investments
  await Investment.deleteMany({});
  await Investment.create([
    {
      userId: user1._id,
      planName: 'Growth Plan',
      planType: 'stocks',
      investedAmount: 1500,
      currentValue: 1700,
      profit: 200,
      profitPercentage: 13.3,
      duration: 12,
      roi: 15,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 31536000000),
    },
    {
      userId: user2._id,
      planName: 'Crypto Plan',
      planType: 'crypto',
      investedAmount: 1000,
      currentValue: 900,
      profit: -100,
      profitPercentage: -10,
      duration: 6,
      roi: 8,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 15768000000),
    }
  ]);

  // Payments
  await Payment.deleteMany({});
  await Payment.create([
    {
      userId: user1._id,
      amount: 2000,
      status: 'completed',
      date: new Date(),
      receipt: '',
    },
    {
      userId: user2._id,
      amount: 500,
      status: 'pending',
      date: new Date(),
      receipt: '',
    }
  ]);

  console.log('Seeded transactions, investments, and payments!');
  await mongoose.disconnect();
}

seedData();
