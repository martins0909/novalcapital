import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; fullName: string; referralCode?: string }) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },
};

// Investment API
export const investmentAPI = {
  getAll: async () => {
    const response = await api.get('/api/investments');
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get('/api/investments/admin/all');
    return response.data;
  },

  create: async (data: {
    planName: string;
    planType: string;
    investedAmount: number;
    duration: number;
    roi: number;
  }) => {
    const response = await api.post('/api/investments', data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/investments/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: { currentValue?: number; profit?: number; profitPercentage?: number }
  ) => {
    const response = await api.put(`/api/investments/${id}`, data);
    return response.data;
  },

  withdraw: async (id: string, amount: number, paymentDetails?: any) => {
    const response = await api.post(`/api/investments/${id}/withdraw`, { amount, paymentDetails });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

// Transaction API
export const transactionAPI = {
  getAll: async (params?: { type?: string; status?: string; limit?: number }) => {
    const response = await api.get('/api/transactions', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: { type: string; amount: number; description?: string }) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },
};

// Market API
export const marketAPI = {
  getTicker: async (symbols?: string[]) => {
    const params = symbols && symbols.length ? { symbols: symbols.join(',') } : undefined;
    const response = await api.get('/market/ticker', { params });
    return response.data.data as Array<{ symbol: string; price: number; changePercent: number; trend: 'up' | 'down' | 'flat' }>;
  },
};

export default api;
