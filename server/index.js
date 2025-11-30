const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');
const paymentsRoutes = require('./routes/payments');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const connectDB = require('./src/utils/db');
connectDB();

app.use(bodyParser.json());
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use('/api/payments', paymentsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));