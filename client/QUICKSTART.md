# 🚀 Quick Start Guide - BlueStockFX

## Step-by-Step Setup Instructions

### 1. Frontend Setup ✅ (Already Done!)

The frontend is now ready to run. Dependencies are installed.

**To start the frontend:**
```powershell
npm run dev
```

Visit: http://localhost:3000

### 2. Backend Setup (Complete These Steps)

#### A. Install Backend Dependencies

```powershell
cd backend
npm install
```

#### B. Setup MongoDB Atlas

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Sign up** or **Log in**
3. **Create a new cluster**:
   - Click "Build a Database"
   - Choose "Free" (M0 Sandbox)
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster"

4. **Create Database User**:
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set user privileges to "Atlas admin"
   - Click "Add User"

5. **Whitelist IP Address**:
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

6. **Get Connection String**:
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password
   - Add database name before the `?`: `mongodb+srv://username:password@cluster.mongodb.net/bluestockfx?retryWrites=true&w=majority`

#### C. Configure Environment Variables

```powershell
# Still in backend directory
Copy-Item .env.example .env
```

Then edit the `.env` file with your details:

```env
NODE_ENV=development
PORT=5000

# Replace with your MongoDB connection string
DATABASE_URL="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/bluestockfx?retryWrites=true&w=majority"

# Generate a random secret (or keep this one for testing)
JWT_SECRET=bluestockfx-super-secret-jwt-key-2025

# Frontend URL
CLIENT_URL=http://localhost:3000
```

#### D. Initialize Database

```powershell
# Generate Prisma Client
npm run prisma:generate

# Push schema to MongoDB
npm run prisma:push
```

You should see: "✔ Your database is now in sync with your Prisma schema."

#### E. Start Backend Server

```powershell
npm run dev
```

You should see: "🚀 Server is running on port 5000"

### 3. Testing the Application

#### Option 1: Test with Current Frontend (localStorage)

1. **Start Frontend** (in main directory):
   ```powershell
   npm run dev
   ```

2. **Open browser**: http://localhost:3000

3. **Test Features**:
   - ✅ Browse home page
   - ✅ Sign up for an account
   - ✅ Sign in
   - ✅ View dashboard
   - ✅ Create investments
   - ✅ Check portfolio
   - ✅ Browse markets

**Note**: Currently using localStorage for temporary data storage.

#### Option 2: Connect Frontend to Backend API

To connect the frontend to your backend, you'll need to:

1. Create an API service file
2. Replace localStorage calls with API calls
3. Handle authentication with JWT tokens

Would you like me to create these connection files?

### 4. Useful Commands

#### Frontend Commands:
```powershell
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Check code quality
```

#### Backend Commands:
```powershell
cd backend

# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Compile TypeScript
npm start            # Run compiled code

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema changes
npm run prisma:studio    # Open Prisma Studio (GUI)
```

### 5. Verify Everything Works

✅ **Frontend Checklist**:
- [ ] Runs on http://localhost:3000
- [ ] Home page loads
- [ ] Can navigate to all pages
- [ ] Sign up form works
- [ ] Sign in form works
- [ ] Dashboard is accessible after login
- [ ] Investment plans are displayed
- [ ] Can create new investments

✅ **Backend Checklist**:
- [ ] Runs on http://localhost:5000
- [ ] Health check: http://localhost:5000/api/health
- [ ] MongoDB connection successful
- [ ] Prisma Client generated
- [ ] No errors in console

### 6. Common Issues & Solutions

#### Issue: "Cannot find module"
**Solution**: Run `npm install` in the correct directory

#### Issue: "MongoDB connection failed"
**Solution**: 
- Check your connection string in `.env`
- Verify password has no special characters (or URL encode them)
- Ensure IP is whitelisted in MongoDB Atlas
- Check database name is included in connection string

#### Issue: "Port already in use"
**Solution**: 
- Change PORT in `.env` (backend)
- Change port in `vite.config.ts` (frontend)
- Or kill the process using the port

#### Issue: Prisma errors
**Solution**: 
```powershell
cd backend
rm -r node_modules
rm -r prisma/generated  # if exists
npm install
npm run prisma:generate
npm run prisma:push
```

### 7. Next Steps

Once everything is running:

1. **Test all features** on the frontend
2. **Create test investments** in the dashboard
3. **Check Prisma Studio** to view database:
   ```powershell
   cd backend
   npm run prisma:studio
   ```
4. **Test API endpoints** with Postman or Thunder Client
5. **Connect frontend to backend API** (if desired)

### 8. Production Deployment

When ready to deploy:

**Frontend** (Vercel/Netlify):
- Run `npm run build`
- Deploy `dist/` folder
- Set environment variables in hosting platform

**Backend** (Railway/Render):
- Push code to GitHub
- Connect repository to hosting platform
- Set environment variables
- Deploy

### Need Help?

- Check `README.md` for detailed documentation
- Review error messages in browser console
- Check backend logs in terminal
- Verify all environment variables are set correctly

---

**Congratulations! Your investment platform is ready! 🎉**
