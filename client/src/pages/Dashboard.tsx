  // ...existing code...
import TradingViewWidget from '../components/TradingViewWidget';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TradingViewWidgetTickerTape from '../components/TradingViewWidgetTickerTape';
import { investmentAPI, userAPI, transactionAPI } from '../services/api';
import { simulatePortfolioGrowth } from '../utils/investmentSimulator';

interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface Investment {
  id: string;
  _id?: string;
  userId?: string;
  user?: {
    id: string;
    fullName?: string;
    email?: string;
  };
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
  createdAt?: string;
  updatedAt?: string;
}

const Dashboard = ({ setIsAuthenticated }: DashboardProps): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  const [activeTab, setActiveTab] = useState<
    'overview' | 'invest' | 'portfolio' | 'withdraw' | 'transactions' | 'fundwallet' | 'assets' | 'stocks' | 'activities' | 'tradingbots' | 'verification'
  >('overview');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  // Account Verification State
  const [verificationType, setVerificationType] = useState('');
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [verificationUploading, setVerificationUploading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [fundMethod, setFundMethod] = useState<'bitcoin' | 'bnb' | ''>(''); // fundMethod value remains 'bnb' for logic
  const [fundAmount, setFundAmount] = useState('');
  const [showFundOverview, setShowFundOverview] = useState(false);
  const fundWalletRef = useRef<HTMLDivElement>(null);
  const [fundCurrency, setFundCurrency] = useState<'dollars' | 'euro' | 'pound'>('dollars');
  const [fundReceipt, setFundReceipt] = useState<File | null>(null);
  const [createdPaymentId, setCreatedPaymentId] = useState<string | null>(null);

  // Payment method and form fields for Withdraw modal
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankFullName, setBankFullName] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [bankRoutingNumber, setBankRoutingNumber] = useState('');
  const [bankSwiftCode, setBankSwiftCode] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [coinbaseAddress, setCoinbaseAddress] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

    // ...existing code...

  // Restore handleLogout function for logout button
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Restore handleInvest function for investment plan actions
  const handleInvest = async (plan: any) => {
    const amount = prompt(`Enter investment amount ($${plan.minAmount} - $${plan.maxAmount}):`);
    if (amount) {
      const investAmount = parseFloat(amount);
      if (investAmount >= plan.minAmount && investAmount <= plan.maxAmount && investAmount <= balance) {
        try {
          await investmentAPI.create({
            planName: plan.name,
            planType: plan.type,
            investedAmount: investAmount,
            duration: parseInt(plan.duration.split(' ')[0]),
            roi: plan.roi,
          });
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

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user profile and balance from backend
        const profile = await userAPI.getProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
        console.log('[DASHBOARD] Profile loaded:', profile);
        setBalance(profile.balance || 0);

        // Load investments (user view)
        const investmentsData = await investmentAPI.getAll();
        setInvestments(investmentsData);

        // Load transactions
        const transactionsData = await transactionAPI.getAll({ limit: 50 });
        setTransactions(transactionsData);
        // ...existing code...
      } catch (error: any) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  // Simulate investment growth every 10 seconds
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setInvestments((prevInvestments) => simulatePortfolioGrowth(prevInvestments));
    }, 10000);
    return () => clearInterval(growthInterval);
  }, []);

  // Calculate stats
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + (isNaN(inv.currentValue) ? 0 : inv.currentValue), 0);
  const totalProfit = investments.reduce((sum, inv) => sum + (isNaN(inv.profit) ? 0 : inv.profit), 0);
  const totalProfitPercentage = totalInvested > 0 && !isNaN(totalProfit) && !isNaN(totalInvested) ? (totalProfit / totalInvested) * 100 : 0;

  // Investment plans (mock data)
  const investmentPlans = [
    { name: 'Starter Plan', type: 'fixed', minAmount: 50, maxAmount: 1999, duration: '24hours', roi: 6 },
    { name: 'Standard Plan', type: 'flexible', minAmount: 2000, maxAmount: 4999, duration: '2 days', roi: 10 },
    { name: 'VIP Plan', type: 'fixed', minAmount: 5000, maxAmount: 29999, duration: '5 days', roi: 15 },
    { name: 'Bonus Plan', type: 'fixed', minAmount: 30000, maxAmount: 49999, duration: '30 days', roi: 30 },
    { name: 'Yop Plan', type: 'fixed', minAmount: 50000, maxAmount: 100000, duration: '24 Hours', roi: 40 },
    { name: 'Master Plan', type: 'fixed', minAmount: '1 BTC', maxAmount: 'Unlimited', duration: '7 days', roi: 50 },
  ];

  // Withdraw handler
  const handleWithdraw = async () => {
    if (!selectedInvestment) return;
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError('Enter a valid amount');
      return;
    }
    if (amount > selectedInvestment.currentValue) {
      setWithdrawError('Amount exceeds available balance');
      return;
    }

    let paymentDetails = {};
    if (paymentMethod === 'bank') {
        paymentDetails = { method: 'bank', bankAccountNumber, bankFullName, bankName, bankAddress, bankRoutingNumber, bankSwiftCode };
    } else if (paymentMethod === 'paypal') {
        paymentDetails = { method: 'paypal', paypalEmail };
    } else if (paymentMethod === 'coinbase') {
        paymentDetails = { method: 'coinbase', coinbaseAddress };
    } else if (paymentMethod === 'card') {
        paymentDetails = { method: 'card', cardHolderName, cardNumber, cardExpiry, cardCVV };
    } else {
        setWithdrawError('Select a payment method');
        return;
    }

    try {
      await investmentAPI.withdraw(selectedInvestment.id || selectedInvestment._id || '', amount, paymentDetails);
      alert('Withdrawal request submitted successfully. Admin will review it shortly.');
      setSelectedInvestment(null);
      setWithdrawAmount('');
      // Refresh data
      const investmentsData = await investmentAPI.getAll();
      setInvestments(investmentsData);
      const transactionsData = await transactionAPI.getAll({ limit: 50 });
      setTransactions(transactionsData);
    } catch (error: any) {
      setWithdrawError(error.response?.data?.error || 'Withdraw failed, contact admin');
    }
  };
  // All logic and functions above
  return (
    <div className="min-h-screen flex flex-col bg-light-lighter">
      <Header isAuthenticated={true} />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex">
            {/* Sidebar Menu */}
            <aside className="hidden md:flex flex-col w-64 bg-white rounded-lg shadow-lg mr-8 py-8 px-4">
              <nav className="space-y-4">
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 font-semibold" onClick={() => setActiveTab('overview')}>Dashboard</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100" onClick={() => setActiveTab('assets')}>Assets</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100" onClick={() => setActiveTab('stocks')}>Stocks</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100" onClick={() => setActiveTab('portfolio')}>Portfolio</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100" onClick={() => setActiveTab('activities')}>Activities</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100" onClick={() => setActiveTab('withdraw')}>Withdraw</button>
                              <button
                                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                                onClick={() => {
                                  setActiveTab('fundwallet');
                                  setTimeout(() => {
                                    fundWalletRef.current?.scrollIntoView({ behavior: 'smooth' });
                                  }, 100);
                                }}
                              >Fund Wallet</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100" onClick={() => setActiveTab('tradingbots')}>Trading bots</button>
              </nav>
            </aside>
            {/* Main Dashboard Content */}
            <div className="flex-1" style={{ minHeight: '100vh' }}>
              {/* TradingView Ticker Tape Widget */}
              <div className="mb-4">
                <TradingViewWidgetTickerTape />
              </div>
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg p-8 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || 'Investor'}!</h1>
                    <p className="text-xl opacity-90">Track and manage your investments</p>
                  </div>
                  <button onClick={handleLogout} className="btn bg-white text-primary hover:bg-gray-100">Logout</button>
                </div>
              </div>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="card p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Account Balance</span>
                    <button className="btn btn-xs btn-outline" onClick={async () => {
                      try {
                        const profile = await userAPI.getProfile();
                        setUser(profile);
                        setBalance(profile.balance || 0);
                      } catch (error) {
                        alert('Failed to refresh balance');
                      }
                    }}>Refresh</button>
                  </div>
                  <div className="text-3xl font-bold text-primary">${balance.toLocaleString()}</div>
                </div>
                <div className="card p-6">
                  <div className="text-gray-600 mb-2">Total Invested</div>
                  <div className="text-3xl font-bold text-gray-900">${totalInvested.toLocaleString()}</div>
                </div>
                <div className="card p-6">
                  <div className="text-gray-600 mb-2">Current Value</div>
                  <div className="text-3xl font-bold text-green-600">${isNaN(totalCurrentValue) ? 0 : totalCurrentValue.toLocaleString()}</div>
                </div>
                <div className="card p-6">
                  <div className="text-gray-600 mb-2">Total Profit</div>
                  <div className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>${isNaN(totalProfit) ? 0 : totalProfit.toLocaleString()} ({isNaN(totalProfitPercentage) ? 0 : totalProfitPercentage.toFixed(2)}%)</div>
                </div>
              </div>
              {/* Tabs and Tab Content */}
              <div className="card">
                <div className="border-b border-gray-200">
                  <nav className="dashboard-tabs-nav px-0">
                    <button onClick={() => setActiveTab('verification')} className={`py-3 px-2 border-b-2 font-medium text-sm ${activeTab === 'verification' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Account Verification</button>
                    <button onClick={() => setActiveTab('overview')} className={`py-3 px-2 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Overview</button>
                    <button onClick={() => setActiveTab('invest')} className={`py-3 px-2 border-b-2 font-medium text-sm ${activeTab === 'invest' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Investment Plans</button>
                    <button onClick={() => setActiveTab('portfolio')} className={`py-3 px-2 border-b-2 font-medium text-sm ${activeTab === 'portfolio' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>My Portfolio</button>
                    <button onClick={() => setActiveTab('withdraw')} className={`py-3 px-2 border-b-2 font-medium text-sm ${activeTab === 'withdraw' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Withdraw</button>
                    <button onClick={() => setActiveTab('fundwallet')} className={`py-3 px-2 border-b-2 font-medium text-sm ${activeTab === 'fundwallet' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Fund Wallet</button>
                    <button onClick={() => setActiveTab('transactions')} className={`py-3 px-2 border-b-2 font-medium text-sm ${activeTab === 'transactions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Transactions</button>
                  </nav>
                </div>
                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div>
                      <h2 className="section-heading">Investment Overview</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Portfolio Distribution</h3>
                          {investments.length > 0 ? (
                            <div className="space-y-3">
                              {investments.map((inv) => (
                                <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                  <div>
                                    <div className="font-medium">{inv.planName}</div>
                                    <div className="text-sm text-gray-600 capitalize">{inv.planType}</div>
                                    <div className="text-xs text-gray-500">User: {inv.user?.fullName || inv.user?.email || inv.userId || 'N/A'}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">${isNaN(inv.currentValue) ? 0 : inv.currentValue.toLocaleString()}</div>
                                    <div className={`text-sm ${inv.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{inv.profit >= 0 ? '+' : ''}{isNaN(inv.profitPercentage) ? 0 : inv.profitPercentage.toFixed(2)}%</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600">No investments yet. Start investing to see your portfolio grow!</p>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                          <div className="space-y-3">
                            {investments.slice(-5).reverse().map((inv) => (
                              <div key={inv.id} className="flex items-center justify-between p-3 border-l-4 border-info bg-gray-50">
                                <div>
                                  <div className="font-medium">Invested in {inv.planName}</div>
                                  <div className="text-sm text-gray-600">{new Date(inv.startDate).toLocaleDateString()}</div>
                                </div>
                                <div className="font-semibold text-primary">${inv.investedAmount.toLocaleString()}</div>
                              </div>
                            ))}
                            {investments.length === 0 && (<p className="text-gray-600">No recent activity</p>)}
                          </div>
                        </div>
                      </div>
                      {/* Referral Code Section */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Referral Program</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-600 mb-2">Share your referral code to earn $5 for each successful signup!</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Your Referral Link</label>
                              <div className="flex">
                                <input
                                  type="text"
                                  value={user?.referralCode ? `${window.location.origin}/#/signup?referral=${user.referralCode}` : 'Loading...'}
                                  readOnly
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-white"
                                />
                                <button
                                  onClick={() => {
                                    const link = user?.referralCode ? `${window.location.origin}/#/signup?referral=${user.referralCode}` : '';
                                    if (link) {
                                      navigator.clipboard.writeText(link);
                                      alert('Referral link copied to clipboard!');
                                    }
                                  }}
                                  className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark"
                                >
                                  Copy
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Earnings</div>
                              <div className="text-xl font-bold text-green-600">${user?.referralEarnings || 0}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Investment Plans Tab */}
                  {activeTab === 'invest' && (
                    <div>
                      <h2 className="section-heading">Choose Your Investment Plan</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {investmentPlans.map((plan, index) => (
                          <div key={index} className="border rounded-lg p-6 hover:shadow-xl transition">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-bold">{plan.name}</h3>
                              <span className="bg-info text-white px-3 py-1 rounded-full text-sm">{plan.roi}% ROI</span>
                            </div>
                            <div className="space-y-3 mb-6">
                              <div className="flex justify-between"><span className="text-gray-600">Min Investment:</span><span className="font-semibold">${plan.minAmount.toLocaleString()}</span></div>
                              <div className="flex justify-between"><span className="text-gray-600">Max Investment:</span><span className="font-semibold">${plan.maxAmount.toLocaleString()}</span></div>
                              <div className="flex justify-between"><span className="text-gray-600">Duration:</span><span className="font-semibold">{plan.duration}</span></div>
                              <div className="flex justify-between"><span className="text-gray-600">Type:</span><span className="font-semibold capitalize">{plan.type}</span></div>
                            </div>
                            <button onClick={() => handleInvest(plan)} className="w-full btn btn-info">Invest Now</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Portfolio Tab */}
                  {activeTab === 'portfolio' && (
                    <div>
                      <h2 className="section-heading">My Portfolio</h2>
                      {investments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="responsive-table">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {investments.map((inv) => (
                                <tr key={inv.id || inv._id}>
                                  <td className="font-medium">{inv.user?.fullName || inv.user?.email || inv.userId || 'N/A'}</td>
                                  <td>{inv.planName}</td>
                                  <td>${inv.investedAmount.toLocaleString()}</td>
                                  <td>{inv.roi}%</td>
                                  <td className="capitalize">{inv.status}</td>
                                  <td>{new Date(inv.startDate).toLocaleDateString()}</td>
                                  <td>{new Date(inv.endDate).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (<div className="text-center py-12"><p className="text-gray-600">No investments yet</p></div>)}
                    </div>
                  )}
                  {/* Withdraw Tab */}
                  {activeTab === 'withdraw' && (
                    <div>
                      <h2 className="section-heading">Withdraw Funds</h2>
                      {investments.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                          {investments.map((inv) => (
                            <div key={inv.id || inv._id} className="border rounded-lg p-6 mb-4">
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <h3 className="text-lg font-bold">{inv.planName}</h3>
                                  <p className="text-sm text-gray-600 capitalize">{inv.planType}</p>
                                </div>
                                <span className="bg-info text-white px-3 py-1 rounded-full text-sm">${inv.currentValue.toLocaleString()}</span>
                              </div>
                              <div className="mb-4">
                                <p className="text-gray-600">Available Balance</p>
                                <p className="text-2xl font-bold text-green-600">${inv.currentValue.toLocaleString()}</p>
                              </div>
                              <button onClick={() => setSelectedInvestment(inv)} className="w-full btn btn-warning">Withdraw</button>
                            </div>
                          ))}
                        </div>
                      ) : (<div className="text-center py-12"><p className="text-gray-600">No investments available for withdrawal</p></div>)}
                    </div>
                  )}
                  {/* Fund Wallet Tab */}
                  {activeTab === 'fundwallet' && !showFundOverview && (
                    <div className="max-w-md mx-auto" ref={fundWalletRef}>
                      <h2 className="text-2xl font-bold mb-6">Fund Wallet</h2>
                      <label className="block mb-2 font-medium">Select Payment Method</label>
                      <select value={fundMethod} onChange={e => setFundMethod(e.target.value as 'bitcoin' | 'bnb')} className="w-full mb-4 px-4 py-2 border rounded">
                        <option value="">Choose...</option>
                        <option value="bitcoin">Bitcoin</option>
                        <option value="bnb">TRON (Tron wallet)</option>
                      </select>
                      <label className="block mb-2 font-medium">Currency Type</label>
                      <select value={fundCurrency} onChange={e => setFundCurrency(e.target.value as 'dollars' | 'euro' | 'pound')} className="w-full mb-4 px-4 py-2 border rounded">
                        <option value="dollars">Dollars</option>
                        <option value="euro">Euro</option>
                        <option value="pound">Pound</option>
                      </select>
                      <label className="block mb-2 font-medium">Amount to Deposit</label>
                      <input type="number" value={fundAmount} onChange={e => setFundAmount(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded" placeholder="Enter amount" />
                       <button
                         className="btn btn-primary w-full"
                         onClick={async () => {
                           // Create a pending payment on the server, then show Payment Details
                           if (!fundMethod) {
                             alert('Please select a payment method');
                             return;
                           }
                           if (!fundAmount || Number(fundAmount) <= 0) {
                             alert('Please enter a valid amount');
                             return;
                           }
                           try {
                             const payload = {
                               amount: Number(fundAmount),
                               currency: fundCurrency,
                               method: fundMethod,
                               userId: user?._id || undefined,
                             };
                             const token = localStorage.getItem('authToken');
                             const res = await fetch('/api/payments/user/create', {
                               method: 'POST',
                               headers: {
                                 'Content-Type': 'application/json',
                                 ...(token ? { Authorization: `Bearer ${token}` } : {}),
                               },
                               body: JSON.stringify(payload),
                             });
                             if (res.ok) {
                               // Payment created successfully (pending). Save id (if returned) and show details for receipt upload
                               try {
                                 const json = await res.json();
                                 const id = json && (json._id || json.id || (json.payment && (json.payment._id || json.payment.id)));
                                 if (id) setCreatedPaymentId(String(id));
                               } catch (e) {
                                 // ignore parse errors; proceed to show details
                               }
                               setShowFundOverview(true);
                             } else {
                               const txt = await res.text();
                               console.error('[FUND WALLET] Payment create failed:', txt);
                               alert('Failed to create payment. You can still upload your receipt.');
                               setShowFundOverview(true);
                             }
                           } catch (err) {
                             console.error('[FUND WALLET] Error creating payment:', err);
                             alert('Error creating payment. You can still upload your receipt.');
                             setShowFundOverview(true);
                           }
                         }}
                       >Continue</button>
                    </div>
                  )}
                  {activeTab === 'fundwallet' && showFundOverview && (
                    <div className="max-w-lg mx-auto">
                      <h2 className="section-heading">PAYMENT DETAILS</h2>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">Upload payment receipt</span>
                        <input
                          type="file"
                          id="fund-receipt-upload"
                          style={{ display: 'none' }}
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) setFundReceipt(e.target.files[0]);
                          }}
                        />
                        <button
                          className="btn btn-secondary"
                          onClick={() => document.getElementById('fund-receipt-upload')?.click()}
                        >
                          Upload
                        </button>
                        {fundReceipt && (
                          <span className="ml-2 text-xs text-green-700">{fundReceipt.name}</span>
                        )}
                      </div>
                      <div className="mb-4">
                        <span className="font-semibold">Pay to:</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-mono select-all">{fundMethod === 'bitcoin' ? 'bc1qs6htjud525973zpz5e4zduxkrkwlhcm2dfx7sv' : 'TMjBYxYEbNFut9WbRWoZd1hLPzYhLQZ78U'}</span>
                          <button className="btn btn-xs btn-outline" onClick={() => navigator.clipboard.writeText(fundMethod === 'bitcoin' ? 'bc1qs6htjud525973zpz5e4zduxkrkwlhcm2dfx7sv' : 'TMjBYxYEbNFut9WbRWoZd1hLPzYhLQZ78U')}>Copy</button>
                        </div>
                        <div className="mt-2"><span className="font-semibold">NETWORK:</span> {fundMethod === 'bitcoin' ? 'BTC' : 'TRON (Tron wallet)'}</div>
                      </div>
                      <div className="mb-4">
                        <span className="font-semibold">QR CODE:</span>
                        <div className="mt-2 mb-2"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fundMethod === 'bitcoin' ? 'bc1qs6htjud525973zpz5e4zduxkrkwlhcm2dfx7sv' : 'TMjBYxYEbNFut9WbRWoZd1hLPzYhLQZ78U')}`} alt="QR Code" /></div>
                        <p className="text-xs text-gray-600">If the QR code doesn't work with your wallet, simply copy and paste the address displayed above.</p>
                      </div>
                      <div className="mb-4">
                        <div><span className="font-semibold">Invoice Amount:</span></div>
                        <div className="text-lg">{fundAmount} {fundCurrency.charAt(0).toUpperCase() + fundCurrency.slice(1)} ON {fundMethod === 'bitcoin' ? 'BTC' : 'TRON (Tron wallet)'}</div>
                        <div className="mt-2"><span className="font-semibold">PAID:</span> 0 {fundCurrency.charAt(0).toUpperCase() + fundCurrency.slice(1)} ON {fundMethod === 'bitcoin' ? 'BTC' : 'TRON (Tron wallet)'}</div>
                        <div className="mt-2"><span className="font-semibold">DUE:</span> {fundAmount} {fundCurrency.charAt(0).toUpperCase() + fundCurrency.slice(1)} ON {fundMethod === 'bitcoin' ? 'BTC' : 'TRON (Tron wallet)'}</div>
                      </div>
                      <div className="mb-4">
                        <div className="font-semibold mb-2">Real-time historical records of your incoming invoice payments</div>
                        <table className="w-full text-left border">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-2 py-1">TRANSACTION ID</th>
                              <th className="px-2 py-1">AMOUNT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Example row, replace with real data */}
                            <tr>
                              <td className="px-2 py-1">-</td>
                              <td className="px-2 py-1">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <button
                        className="btn btn-primary w-full mb-2"
                        onClick={async () => {
                          // Show immediate popup informing user the payment is successful and to chat with agent
                          try {
                            // Immediate user-facing popup
                            alert('payment successful! await admin confirmation. chat with our online agent.');
                          } catch (e) {
                            // ignore alert errors
                          }

                          // Upload receipt to backend
                          try {
                            if (!fundReceipt) {
                              alert('Please upload a receipt.');
                              return;
                            }
                            // Determine paymentId: prefer the freshly created id saved earlier
                            let paymentIdToUse: string | null = createdPaymentId;
                            if (!paymentIdToUse) {
                              // Fallback: find the latest payment for this user and amount
                              const paymentsRes = await fetch(`/api/payments/user/all?userId=${user?._id}`);
                              const paymentsData = paymentsRes.ok ? await paymentsRes.json() : [];
                              const latestPayment = paymentsData
                                .filter((p: any) => p.amount == fundAmount && p.method === fundMethod && (p.status && String(p.status).toLowerCase() === 'pending'))
                                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                              if (!latestPayment) {
                                alert('No matching payment found.');
                                return;
                              }
                              paymentIdToUse = latestPayment._id || latestPayment.id;
                            }
                            // Upload receipt (simulate file upload as base64 string)
                            const reader = new FileReader();
                            reader.onload = async (e) => {
                              const base64Receipt = e.target?.result;
                              const res = await fetch('/api/payments/user/receipt', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  paymentId: paymentIdToUse,
                                  receipt: base64Receipt
                                })
                              });
                              if (res.ok) {
                                // Clear createdPaymentId and return to dashboard
                                setCreatedPaymentId(null);
                                setShowFundOverview(false);
                                navigate('/dashboard');
                              } else {
                                alert('Failed to upload receipt.');
                              }
                            };
                            reader.readAsDataURL(fundReceipt);
                          } catch (err) {
                            // Removed error popup for uploading receipt
                          }
                        }}
                      >Done</button>
                      <button className="btn btn-secondary w-full" onClick={() => setShowFundOverview(false)}>Back</button>
                    </div>
                  )}
                  {/* Account Verification Tab */}
                  {activeTab === 'verification' && (
                    <div className="max-w-md mx-auto">
                      <h2 className="section-heading">Account Verification</h2>
                      <label className="block mb-2 font-medium">Select Document Type</label>
                      <div className="relative mb-4">
                        <select value={verificationType} onChange={e => setVerificationType(e.target.value)} className="w-full px-4 py-2 border rounded appearance-none">
                          <option value="">Choose document...</option>
                          <option value="drivers_licence">Driver's Licence</option>
                          <option value="international_passport">International Passport</option>
                          <option value="government_document">Approved Government Document</option>
                        </select>
                        <span className="absolute right-3 top-3 pointer-events-none">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                        </span>
                      </div>
                      <label className="block mb-2 font-medium">Upload Document</label>
                      <input type="file" accept="image/*,.pdf" onChange={e => setVerificationFile(e.target.files?.[0] || null)} className="w-full mb-4 px-4 py-2 border rounded" />
                      <button className="btn btn-primary w-full" disabled={!verificationType || !verificationFile || verificationUploading} onClick={async () => {
                        if (!verificationType || !verificationFile) return;
                        setVerificationUploading(true);
                        setVerificationMessage('');
                        // TODO: Call backend API to upload document
                        setTimeout(() => {
                          setVerificationUploading(false);
                          setVerificationMessage('Document uploaded successfully!');
                        }, 1500);
                      }}>Upload</button>
                      {verificationMessage && <div className="mt-4 text-green-600 font-medium">{verificationMessage}</div>}
                    </div>
                  )}
                  {activeTab === 'transactions' && (
                    <div>
                      <h2 className="section-heading">Transaction History</h2>
                      {transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="responsive-table">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map((txn, idx) => (
                                <tr key={txn.id || idx}>
                                  <td className="text-sm text-gray-600">{new Date(txn.createdAt).toLocaleString()}</td>
                                  <td>
                                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${txn.type === 'deposit' ? 'bg-blue-100 text-blue-800' : txn.type === 'withdrawal' ? 'bg-yellow-100 text-yellow-800' : txn.type === 'investment' ? 'bg-purple-100 text-purple-800' : txn.type === 'payment' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{txn.type}</span>
                                  </td>
                                  <td className="text-sm text-gray-900">{txn.description} {txn.method === 'bitcoin' ? '(Bitcoin)' : txn.method === 'bnb' ? '(TRON)' : ''}</td>
                                  <td className="font-semibold">${txn.amount?.toLocaleString?.() ?? txn.amount}</td>
                                  <td>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${txn.status === 'completed' ? 'bg-green-100 text-green-800' : txn.status === 'pending' || txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{txn.status === 'pending' || txn.status === 'Pending' ? 'Await Approval' : txn.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (<div className="text-center py-12"><p className="text-gray-600">No transactions or payments yet</p></div>)}
                    </div>
                  )}
                </div>
              </div>
              {/* Withdraw Modal */}
              {selectedInvestment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                    <h3 className="text-2xl font-bold mb-4">Withdraw from {selectedInvestment.planName}</h3>
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-2">Available Balance</p>
                      <p className="text-3xl font-bold text-green-600">${selectedInvestment.currentValue.toLocaleString()}</p>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Amount</label>
                      <input type="number" id="withdrawAmount" value={withdrawAmount} onChange={(e) => { setWithdrawAmount(e.target.value); setWithdrawError(''); }} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="0.00" max={selectedInvestment.currentValue} step="0.01" />
                      {withdrawError && <p className="mt-1 text-sm text-red-500">{withdrawError}</p>}
                    </div>
                    {/* Payment Method Dropdown */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Choose payment method</label>
                      <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-4 py-2 border rounded">
                        <option value="">Select...</option>
                        <option value="paypal">Paypal</option>
                        <option value="coinbase">Coin Base</option>
                        <option value="bank">Bank</option>
                        <option value="card">Through Card</option>
                      </select>
                    </div>
                    {/* Conditional Payment Forms */}
                    {paymentMethod === 'bank' && (
                      <div className="mb-4">
                        <label className="block mb-2">Enter account number to transfer</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Account Number" value={bankAccountNumber} onChange={e => setBankAccountNumber(e.target.value)} />
                        <label className="block mb-2">Beneficiary Full Name</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Full Name" value={bankFullName} onChange={e => setBankFullName(e.target.value)} />
                        <label className="block mb-2">Beneficiary Bank Name</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Bank Name" value={bankName} onChange={e => setBankName(e.target.value)} />
                        <label className="block mb-2">Beneficiary's Bank Address</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Bank Address" value={bankAddress} onChange={e => setBankAddress(e.target.value)} />
                        <label className="block mb-2">Routing Number</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Routing Number" value={bankRoutingNumber} onChange={e => setBankRoutingNumber(e.target.value)} />
                        <label className="block mb-2">Swift Code</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Swift Code" value={bankSwiftCode} onChange={e => setBankSwiftCode(e.target.value)} />
                        <label className="block mb-2">Amount to transfer (USD)</label>
                        <input className="input input-bordered w-full mb-2" type="number" placeholder="Amount" value={withdrawAmount} readOnly />
                      </div>
                    )}
                    {paymentMethod === 'paypal' && (
                      <div className="mb-4">
                        <label className="block mb-2">Paypal e-mail</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Paypal Email" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} />
                        <label className="block mb-2">Amount to withdraw</label>
                        <input className="input input-bordered w-full mb-2" type="number" placeholder="Amount" value={withdrawAmount} readOnly />
                      </div>
                    )}
                    {paymentMethod === 'coinbase' && (
                      <div className="mb-4">
                        <label className="block mb-2">Amount</label>
                        <input className="input input-bordered w-full mb-2" type="number" placeholder="Amount" value={withdrawAmount} readOnly />
                        <label className="block mb-2">Coinbase address</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Coinbase Address" value={coinbaseAddress} onChange={e => setCoinbaseAddress(e.target.value)} />
                      </div>
                    )}
                    {paymentMethod === 'card' && (
                      <div className="mb-4">
                        <label className="block mb-2">Credit card detail</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Card Holder Name" value={cardHolderName} onChange={e => setCardHolderName(e.target.value)} />
                        <label className="block mb-2">Amount to withdraw</label>
                        <input className="input input-bordered w-full mb-2" type="number" placeholder="Amount" value={withdrawAmount} readOnly />
                        <label className="block mb-2">Card Number</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                        <label className="block mb-2">Expiry (MM/YYYY)</label>
                        <input className="input input-bordered w-full mb-2" placeholder="Expiry" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} />
                        <label className="block mb-2">CVV</label>
                        <input className="input input-bordered w-full mb-2" placeholder="CVV" value={cardCVV} onChange={e => setCardCVV(e.target.value)} />
                        <small className="block text-xs text-gray-500 mb-2">3 or 4 digits usually found on the signature strip</small>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button onClick={() => setSelectedInvestment(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                      <button onClick={handleWithdraw} className="flex-1 btn btn-warning">Confirm Withdrawal</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* TradingView Market Overview Widget at bottom */}
      <div className="mt-8 mb-6 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 px-0">Market Overview</h2>
          <div className="w-full">
            <TradingViewWidget />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
