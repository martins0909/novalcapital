const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');
const paymentsRoutes = require('./routes/payments');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const connectDB = require('./src/utils/db');
connectDB();

// Raw-body logger (disabled by default). Enable by setting ENABLE_RAW_BODY_LOG=true in env.
if (process.env.ENABLE_RAW_BODY_LOG === 'true') {
	app.use((req, res, next) => {
		let raw = '';
		req.on('data', (chunk) => { raw += chunk.toString(); });
		req.on('end', () => {
			try {
				console.log('[RAW BODY]', raw || '<empty>');
			} catch (e) {
				console.log('[RAW BODY] <error printing>');
			}
			next();
		});
	});
}

app.use(bodyParser.json());
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use('/api/payments', paymentsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));