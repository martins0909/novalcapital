import express, { Application } from 'express';
import fs from 'fs';
import path from 'path';
import connectDB from './utils/db';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import investmentRoutes from './routes/investments';
import userRoutes from './routes/users';
import transactionRoutes from './routes/transactions';
import marketRoutes from './routes/market';
import paymentsRoutes from './routes/payments';
import { updateInvestmentValues, checkInvestmentMaturity } from './utils/investmentCalculator';
import WebSocket from 'ws';
import http from 'http';

dotenv.config();
connectDB();

const app: Application = express();
// Ensure uploads folder exists at startup
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://novalcapital.vercel.app',
    'https://novalcapital.org'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Investment Platform API Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (register, login)',
      investments: '/api/investments',
      users: '/api/users',
      transactions: '/api/transactions'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is working!',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/payments', paymentsRoutes);

// Serve uploaded files with existence check
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File missing: show error or placeholder
      return res.status(404).send('Receipt file not found');
    }
    res.sendFile(filePath);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BlueStockFX API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected from', req.url);

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    // Echo back for now
    ws.send('Hello from server');
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  
  // Start investment growth simulator (runs every 30 seconds)
  setInterval(async () => {
    await updateInvestmentValues();
    await checkInvestmentMaturity();
  }, 30000);
  
  console.log('📈 Investment growth simulator started');
  console.log('🔌 WebSocket server running on the same port');
});

console.log('🔌 WebSocket server running on port 8080');

export default app;
