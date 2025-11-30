# 🔌 Connecting Frontend to Backend API

This guide shows you how to connect your React frontend to the Express backend API.

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://your-backend-url.com/api
```

## API Service

The `src/services/api.ts` file is already created with:
- Axios instance configured
- Automatic token injection
- Auth, Investment, and User API methods

## Update Components to Use API

### 1. Update SignUp Component

Replace the `handleSubmit` function in `src/pages/SignUp.tsx`:

```typescript
import { authAPI } from '../services/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const response = await authAPI.register({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
    });

    // Store token and user data
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    setIsAuthenticated(true);
    navigate('/dashboard');
  } catch (error: any) {
    setErrors({ 
      submit: error.response?.data?.error || 'Failed to create account. Please try again.' 
    });
  } finally {
    setLoading(false);
  }
};
```

### 2. Update SignIn Component

Replace the `handleSubmit` function in `src/pages/SignIn.tsx`:

```typescript
import { authAPI } from '../services/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const response = await authAPI.login({
      email: formData.email,
      password: formData.password,
    });

    // Store token and user data
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    setIsAuthenticated(true);
    navigate('/dashboard');
  } catch (error: any) {
    setErrors({ 
      submit: error.response?.data?.error || 'Invalid email or password' 
    });
  } finally {
    setLoading(false);
  }
};
```

### 3. Update Dashboard Component

Add API calls to load investments in `src/pages/Dashboard.tsx`:

```typescript
import { investmentAPI, userAPI } from '../services/api';

useEffect(() => {
  const loadData = async () => {
    try {
      // Load user profile
      const profile = await userAPI.getProfile();
      setUser(profile);

      // Load investments
      const investmentsData = await investmentAPI.getAll();
      setInvestments(investmentsData);

      // Load stats
      const stats = await userAPI.getStats();
      setBalance(50000 - stats.totalInvested); // Adjust based on your logic
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  loadData();
}, []);
```

Update the `handleInvest` function:

```typescript
const handleInvest = async (plan: typeof investmentPlans[0]) => {
  const amount = prompt(`Enter investment amount ($${plan.minAmount} - $${plan.maxAmount}):`);
  if (amount) {
    const investAmount = parseFloat(amount);
    if (investAmount >= plan.minAmount && investAmount <= plan.maxAmount && investAmount <= balance) {
      try {
        const response = await investmentAPI.create({
          planName: plan.name,
          planType: plan.type,
          investedAmount: investAmount,
          duration: parseInt(plan.duration), // Convert "30 days" to 30
          roi: plan.roi,
        });

        // Reload investments
        const investmentsData = await investmentAPI.getAll();
        setInvestments(investmentsData);
        setBalance(balance - investAmount);
        
        alert(`Successfully invested $${investAmount} in ${plan.name}!`);
        setActiveTab('portfolio');
      } catch (error: any) {
        alert(error.response?.data?.error || 'Failed to create investment');
      }
    } else {
      alert('Invalid amount. Please check the limits and your balance.');
    }
  }
};
```

## Install Axios

```powershell
npm install axios
```

## Testing the API Integration

1. **Start Backend**:
   ```powershell
   cd backend
   npm run dev
   ```

2. **Start Frontend**:
   ```powershell
   npm run dev
   ```

3. **Test Flow**:
   - Go to http://localhost:3000
   - Sign up with a new account
   - Check backend console for logs
   - Sign in
   - View dashboard
   - Create an investment
   - Check MongoDB (Prisma Studio): `cd backend && npm run prisma:studio`

## Error Handling

The API service automatically:
- Adds JWT token to all requests
- Handles authorization errors
- Provides error messages from backend

## CORS Configuration

Make sure your backend `.env` has:
```env
CLIENT_URL=http://localhost:3000
```

For production, update to your frontend URL.

## Production Deployment

1. **Update environment variables**:
   - Frontend: Set `VITE_API_URL` to production backend URL
   - Backend: Set `CLIENT_URL` to production frontend URL

2. **Build and deploy**:
   ```powershell
   # Frontend
   npm run build
   
   # Backend
   cd backend
   npm run build
   ```

## Troubleshooting

### CORS Errors
- Verify `CLIENT_URL` in backend `.env`
- Check CORS configuration in `backend/src/index.ts`

### 401 Unauthorized
- Token might be expired (JWT expires in 7 days)
- Clear localStorage and sign in again

### Network Errors
- Ensure backend is running on correct port
- Check `VITE_API_URL` in frontend `.env`
- Verify MongoDB connection

## Optional: Type Safety

Create TypeScript interfaces for better type safety:

```typescript
// src/types/index.ts

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Investment {
  id: string;
  userId: string;
  planName: string;
  planType: string;
  investedAmount: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
  duration: number;
  roi: number;
  status: string;
  startDate: string;
  endDate: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}
```

Then import and use these types in your components.

---

**Your frontend and backend are now connected! 🎉**
