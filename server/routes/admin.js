const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET = 'your_jwt_secret';
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, role: 'admin' });
    if (user && user.password === password) { // Use hashed passwords in production
      const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }
    return res.status(401).json({ error: 'Invalid username or password' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
