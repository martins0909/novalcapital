const mongoose = require('mongoose');
const User = require('../models/User');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function addReferralCodes() {
  try {
    // Connect to DB
    const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/bluestockfx';
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log('Using URI:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({ referralCode: { $exists: false } });
    console.log(`Found ${users.length} users without referral codes`);

    for (const user of users) {
      let newReferralCode;
      do {
        newReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      } while (await User.findOne({ referralCode: newReferralCode }));

      user.referralCode = newReferralCode;
      user.referralEarnings = user.referralEarnings || 0;
      user.accountBalance = user.accountBalance || 0;
      await user.save();
      console.log(`Added referral code ${newReferralCode} to user ${user.email}`);
    }

    console.log('Done');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addReferralCodes();