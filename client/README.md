# BlueStockFX - Investment Platform

A modern, full-stack investment platform built with React, TypeScript, Tailwind CSS, Express, Prisma, and MongoDB.

## 🚀 Features

### Frontend
- ✅ Modern React 18 with TypeScript
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ Responsive design (mobile-first)
- ✅ User authentication (Sign Up / Sign In)
- ✅ Protected routes
- ✅ Investment dashboard
- ✅ Multiple investment plans
- ✅ Real-time portfolio tracking
- ✅ Markets overview page
- ✅ About and Contact pages

### Backend
- ✅ Node.js + Express + TypeScript
- ✅ Prisma ORM with MongoDB
- ✅ JWT authentication
- ✅ RESTful API
- ✅ Password hashing with bcrypt
- ✅ CORS enabled
- ✅ Environment variables support

## 📁 Project Structure

```
blue/
├── src/                    # Frontend source
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── SignUp.tsx
│   │   ├── SignIn.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Markets.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── backend/              # Backend API
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   └── index.ts     # Server entry
│   ├── .env.example     # Environment template
│   └── package.json
├── index.html           # HTML entry
├── package.json         # Frontend dependencies
└── README.md           # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Frontend Setup

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Start development server:**
   ```powershell
   npm run dev
   ```

3. **Build for production:**
   ```powershell
   npm run build
   ```

The frontend will run on `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`:
     ```powershell
     Copy-Item .env.example .env
     ```
   - Edit `.env` and add your MongoDB Atlas connection string:
     ```
     DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/bluestockfx?retryWrites=true&w=majority"
     JWT_SECRET=your-super-secret-key-change-this
     CLIENT_URL=http://localhost:3000
     ```

4. **Set up MongoDB Atlas:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Whitelist your IP address (or allow access from anywhere: 0.0.0.0/0)
   - Get your connection string

5. **Initialize Prisma:**
   ```powershell
   npm run prisma:generate
   npm run prisma:push
   ```

6. **Start backend server:**
   ```powershell
   npm run dev
   ```

The backend will run on `http://localhost:5000`

## 📊 Database Schema

### User Model
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `fullName`: User's full name
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Investment Model
- `id`: Unique identifier
- `userId`: Reference to User
- `planName`: Name of investment plan
- `planType`: Type (forex, stocks, crypto, diversified)
- `investedAmount`: Initial investment
- `currentValue`: Current portfolio value
- `profit`: Total profit/loss
- `profitPercentage`: Profit percentage
- `duration`: Investment duration in days
- `roi`: Expected ROI percentage
- `status`: active, completed, cancelled
- `startDate`: Investment start date
- `endDate`: Investment end date

### Transaction Model
- `id`: Unique identifier
- `userId`: Reference to User
- `type`: deposit, withdrawal, investment, profit
- `amount`: Transaction amount
- `status`: pending, completed, failed
- `description`: Transaction details
- `createdAt`: Transaction timestamp

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `GET /api/users/stats` - Get user statistics (protected)

### Investments
- `GET /api/investments` - Get all user investments (protected)
- `POST /api/investments` - Create new investment (protected)
- `GET /api/investments/:id` - Get specific investment (protected)
- `PUT /api/investments/:id` - Update investment (protected)

## 🎨 Investment Plans

1. **Starter Plan**
   - Min: $500 | Max: $5,000
   - Duration: 30 days
   - ROI: 15%
   - Type: Forex

2. **Growth Plan**
   - Min: $5,000 | Max: $20,000
   - Duration: 60 days
   - ROI: 30%
   - Type: Stocks

3. **Premium Plan**
   - Min: $20,000 | Max: $100,000
   - Duration: 90 days
   - ROI: 50%
   - Type: Crypto

4. **Elite Plan**
   - Min: $100,000 | Max: $500,000
   - Duration: 180 days
   - ROI: 100%
   - Type: Diversified

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- CORS configuration
- Environment variables for secrets
- Input validation

## 🚧 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Real-time price updates via WebSocket
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] KYC verification
- [ ] Withdrawal system
- [ ] Push notifications
- [ ] Mobile app (React Native)

## 📝 Development Notes

### Current Implementation
- Frontend: Fully functional with localStorage for temporary auth
- Backend: Complete REST API with Prisma + MongoDB
- Authentication: JWT-based authentication
- Database: MongoDB Atlas ready

### Next Steps
1. Connect frontend to backend API
2. Replace localStorage with API calls
3. Implement real-time investment growth simulation
4. Add payment processing
5. Deploy to production

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```powershell
npm run build
# Upload dist/ folder to hosting service
```

### Backend (Railway/Render/Heroku)
```powershell
cd backend
npm run build
# Deploy dist/ folder with environment variables
```

## 📄 License

This project is private and confidential.

## 👨‍💻 Support

For questions or issues, contact the development team.

---

Built with ❤️ using React, TypeScript, Tailwind CSS, Express, Prisma, and MongoDB
