import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { simulatePortfolioGrowth } from '../utils/investmentSimulator';
import { useNavigate } from 'react-router-dom';

// Use VITE_API_URL for API base URL (Vite standard)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const AdminDashboard: React.FC = () => {
    // Modal state
    const [editUser, setEditUser] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({ fullName: '', email: '', role: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewUser, setViewUser] = useState<any | null>(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetUser, setResetUser] = useState<any | null>(null);
    const [resetPassword, setResetPassword] = useState('');

    // Modal handlers
    const handleView = (user: any) => {
      setViewUser(user);
      setShowViewModal(true);
    };
    const handleEdit = (user: any) => {
      setEditUser(user);
      setEditForm({ fullName: user.fullName || user.name, email: user.email, role: user.role });
      setShowEditModal(true);
    };
    const handleResetPassword = (user: any) => {
      setResetUser(user);
      setShowResetModal(true);
      setResetPassword('');
    };
    const handleEditSubmit = async () => {
      // Implement edit logic here
      setShowEditModal(false);
    };
    const handleResetSubmit = async () => {
      // Implement reset logic here
      setShowResetModal(false);
    };
  // State declarations
  const [trackRawInvestments, setTrackRawInvestments] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'users' | 'transactions' | 'investments' | 'payments' | 'track'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [trackData, setTrackData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    try {
      JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      navigate('/admin-login');
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'users') {
      axios.get(`${API_BASE_URL}/api/users/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      })
      .then(res => setUsers(res.data))
      .catch(err => {
        setUsers([]);
        console.error('[ADMIN DASHBOARD] Users fetch error:', err);
      });
    } else if (activeTab === 'transactions') {
      axios.get(`${API_BASE_URL}/api/transactions/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      })
      .then(res => setTransactions(res.data))
      .catch(err => {
        setTransactions([]);
        console.error('[ADMIN DASHBOARD] Transactions fetch error:', err);
      });
    } else if (activeTab === 'investments') {
      axios.get(`${API_BASE_URL}/api/investments/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      })
      .then(res => setInvestments(res.data))
      .catch(err => {
        setInvestments([]);
        console.error('[ADMIN DASHBOARD] Investments fetch error:', err);
      });
    } else if (activeTab === 'payments') {
      axios.get(`${API_BASE_URL}/api/payments/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      })
      .then(res => setPayments(res.data))
      .catch(err => {
        setPayments([]);
        console.error('[ADMIN DASHBOARD] Payments fetch error:', err);
      });
    } else if (activeTab === 'track') {
      axios.get(`${API_BASE_URL}/api/users/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      })
      .then(async res => {
        const usersList = res.data;
        const promises = usersList.map(async (user: any) => {
          let investments = [];
          try {
            const invRes = await axios.get(`${API_BASE_URL}/api/investments/user/${user._id || user.id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            investments = invRes.data || [];
            // Debug log: print API response for each user
            console.log('API response for user', user._id || user.id, investments);
          } catch (err: any) {
            if (err.response && err.response.status === 404) {
              investments = [];
            } else {
              console.error('[ADMIN DASHBOARD] Track investments fetch error:', err);
              throw err;
            }
          }
          return { id: user._id || user.id, name: user.fullName || user.name || user.email, balance: user.balance || 0, investments };
        });
        const trackRaw = await Promise.all(promises);
        const rawMap: any = {};
        trackRaw.forEach(row => { rawMap[row.id] = { ...row }; });
        setTrackRawInvestments(rawMap);
      })
      .catch(err => {
        setTrackRawInvestments({});
        console.error('[ADMIN DASHBOARD] Track users fetch error:', err);
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'track') return;
    const interval = setInterval(() => {
      const trackResults = Object.values(trackRawInvestments).map((row: any) => {
        // Debug: log raw investments
        console.log('TrackInvestments RAW:', row.id, row.investments);
        const grownInvestments = simulatePortfolioGrowth(row.investments || []);
        // Debug: log simulator output
        console.log('TrackInvestments SIMULATED:', row.id, grownInvestments);
        const totalInvested = grownInvestments.reduce((sum, inv) => sum + (inv.investedAmount || 0), 0);
        const currentValue = grownInvestments.reduce((sum, inv) => sum + (isNaN(inv.currentValue) ? 0 : inv.currentValue), 0);
        const totalProfit = grownInvestments.reduce((sum, inv) => sum + (isNaN(inv.profit) ? 0 : inv.profit), 0);
        return {
          id: row.id,
          name: row.name,
          balance: row.balance,
          totalInvested,
          currentValue,
          totalProfit
        };
      });
      setTrackData(trackResults);
    }, 10000);
    // Run once immediately
    const trackResults = Object.values(trackRawInvestments).map((row: any) => {
      // Debug: log raw investments
      console.log('TrackInvestments RAW:', row.id, row.investments);
      const grownInvestments = simulatePortfolioGrowth(row.investments || []);
      // Debug: log simulator output
      console.log('TrackInvestments SIMULATED:', row.id, grownInvestments);
      const totalInvested = grownInvestments.reduce((sum, inv) => sum + (inv.investedAmount || 0), 0);
      const currentValue = grownInvestments.reduce((sum, inv) => sum + (isNaN(inv.currentValue) ? 0 : inv.currentValue), 0);
      const totalProfit = grownInvestments.reduce((sum, inv) => sum + (isNaN(inv.profit) ? 0 : inv.profit), 0);
      return {
        id: row.id,
        name: row.name,
        balance: row.balance,
        totalInvested,
        currentValue,
        totalProfit
      };
    });
    setTrackData(trackResults);
    return () => clearInterval(interval);
  }, [activeTab, trackRawInvestments]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            className="btn btn-error btn-sm"
            onClick={() => {
              localStorage.removeItem('adminToken');
              window.location.href = '/admin-login';
            }}
          >Logout</button>
        </div>
        <nav className="mb-8">
          <ul className="flex space-x-4 border-b pb-2">
            <li>
              <button
                className={`px-4 py-2 font-semibold ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('users')}
              >User Management</button>
            </li>
            <li>
              <button
                className={`px-4 py-2 font-semibold ${activeTab === 'transactions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('transactions')}
              >Transactions</button>
            </li>
            <li>
              <button
                className={`px-4 py-2 font-semibold ${activeTab === 'investments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('investments')}
              >Investments</button>
            </li>
            <li>
              <button
                className={`px-4 py-2 font-semibold ${activeTab === 'payments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('payments')}
              >Payments</button>
            </li>
            <li>
              <button
                className={`px-4 py-2 font-semibold ${activeTab === 'track' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('track')}
              >Track Investment</button>
            </li>
          </ul>
        </nav>
        {/* Tab rendering logic */}
        {activeTab === 'users' && (
          <div className="card p-4">
            <h2 className="text-xl font-semibold mb-2">User Management</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="text-left">Email</th>
                    <th className="text-left">Name</th>
                    <th className="text-left">Role</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(users) ? users : []).map((user: any) => (
                    <tr key={user._id || user.id} className="border-b hover:bg-gray-100">
                      <td className="text-left">{user.email}</td>
                      <td className="text-left">{user.fullName || user.name}</td>
                      <td className="text-left">{user.role}</td>
                      <td className="text-left">
                        <button className="btn btn-xs btn-outline mr-1" onClick={() => handleView(user)}>View</button>
                        <button className="btn btn-xs btn-outline mr-1" onClick={() => handleEdit(user)}>Edit</button>
                        <button className="btn btn-xs btn-outline" onClick={() => handleResetPassword(user)}>Reset Password</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'transactions' && (
          <div className="card p-4">
            <h2 className="text-xl font-semibold mb-2">Transactions</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="text-left">Email</th>
                    <th className="text-left">Type</th>
                    <th className="text-right">Amount</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(transactions) ? transactions : []).map((tx: any) => (
                    <tr key={tx._id || tx.id} className="border-b hover:bg-gray-100">
                      <td className="text-left">{tx.userId?.email || tx.userId || 'N/A'}</td>
                      <td className="text-left">{tx.type}</td>
                      <td className="text-right">${isNaN(tx.amount) ? 0 : tx.amount}</td>
                      <td className="text-left">{tx.status}</td>
                      <td className="text-left">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'investments' && (
          <div className="card p-4">
            <h2 className="text-xl font-semibold mb-2">Investments</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="text-left">ID</th>
                    <th className="text-left">Email</th>
                    <th className="text-left">Plan Name</th>
                    <th className="text-left">Type</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Current Value</th>
                    <th className="text-right">Profit</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(investments) ? investments : []).map((inv: any) => (
                    <tr key={inv._id || inv.id} className="border-b hover:bg-gray-100">
                      <td className="text-left">{inv._id || inv.id}</td>
                      <td className="text-left">{inv.userId?.email || inv.userId || 'N/A'}</td>
                      <td className="text-left">{inv.planName}</td>
                      <td className="text-left">{inv.planType}</td>
                      <td className="text-right">${isNaN(inv.investedAmount) ? 0 : inv.investedAmount}</td>
                      <td className="text-right">${isNaN(inv.currentValue) ? 0 : inv.currentValue}</td>
                      <td className="text-right">${isNaN(inv.profit) ? 0 : inv.profit}</td>
                      <td className="text-left">{inv.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'payments' && (
          <div className="card p-4">
            <h2 className="text-xl font-semibold mb-2">Payments</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="text-left">Email</th>
                    <th className="text-right">Amount</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Date</th>
                    <th className="text-left">Receipt</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(payments) ? payments : []).map((pay: any) => (
                    <tr key={pay._id || pay.id} className="border-b hover:bg-gray-100">
                      <td className="text-left">{pay.user?.email || 'N/A'}</td>
                      <td className="text-right">${isNaN(pay.amount) ? 0 : pay.amount}</td>
                      <td className="text-left">{pay.status}</td>
                      <td className="text-left">{pay.date}</td>
                      <td className="text-left">
                        {pay.receipt ? (
                          <a href={pay.receipt} target="_blank" rel="noopener noreferrer">
                            <img src={pay.receipt} alt="Receipt" style={{ maxWidth: 80, maxHeight: 80 }} />
                          </a>
                        ) : (
                          <span className="text-gray-400">No receipt</span>
                        )}
                      </td>
                      <td className="text-left">
                        {pay.status === 'awaiting_confirmation' || pay.status === 'pending' ? (
                          <>
                            <button
                              className="btn btn-xs btn-success mr-2"
                              onClick={async () => {
                                try {
                                  const res = await fetch('/api/payments/admin/confirm', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ paymentId: pay._id || pay.id })
                                  });
                                  if (res.ok) {
                                    alert('Payment confirmed and balance updated!');
                                  } else {
                                    alert('Failed to confirm payment.');
                                  }
                                } catch (err) {
                                  alert('Error confirming payment.');
                                }
                              }}
                            >Confirm</button>
                            <button
                              className="btn btn-xs btn-error"
                              onClick={async () => {
                                try {
                                  const res = await fetch('/api/payments/admin/decline', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ paymentId: pay._id || pay.id })
                                  });
                                  if (res.ok) {
                                    alert('Payment declined.');
                                  } else {
                                    alert('Failed to decline payment.');
                                  }
                                } catch (err) {
                                  alert('Error declining payment.');
                                }
                              }}
                            >Decline</button>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'track' && (
          <div className="card p-4">
            <h2 className="text-xl font-semibold mb-2">Track Investment</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-right">Account Balance</th>
                    <th className="px-4 py-2 text-right">Total Invested</th>
                    <th className="px-4 py-2 text-right">Current Value</th>
                    <th className="px-4 py-2 text-right">Total Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(trackData) ? trackData : []).map((row: any) => (
                      <tr key={row.id} className={row.totalInvested === 0 && row.currentValue === 0 && row.totalProfit === 0 ? "border-b bg-gray-50" : "border-b hover:bg-gray-100"}>
                        <td className="px-4 py-2 align-middle font-medium text-left">{row.email || row.name}</td>
                        <td className="px-4 py-2 align-middle text-right">
                          {isNaN(row.balance) ? 0 : row.balance}
                          <form
                            className="inline-flex items-center ml-2"
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const amountInput = (e.currentTarget.elements.namedItem('amount') as HTMLInputElement);
                              const amount = Number(amountInput.value);
                              if (isNaN(amount) || amount === 0) {
                                alert('Enter a valid amount');
                                return;
                              }
                              try {
                                const res = await axios.post(`/api/users/admin/${row.id}/balance`, { amount }, {
                                  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                                });
                                setTrackData(prev => prev.map(r => r.id === row.id ? { ...r, balance: res.data.balance } : r));
                                amountInput.value = '';
                              } catch (err) {
                                alert('Failed to update balance');
                              }
                            }}
                          >
                            <input
                              type="number"
                              name="amount"
                              placeholder="Amount"
                              className="input input-xs w-20 mr-1"
                              min="-1000000"
                              max="1000000"
                            />
                            <button type="submit" className="btn btn-xs btn-primary">Add</button>
                          </form>
                        </td>
                        <td className="px-4 py-2 align-middle text-right">${isNaN(row.totalInvested) ? 0 : row.totalInvested.toFixed(2)}
                          <button className="ml-2 btn btn-xs btn-outline" onClick={async () => {
                            try {
                              const invRes = await axios.get(`/api/investments/user/${row.id}`, {
                                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                              });
                              const investments = invRes.data || [];
                              const grownInvestments = simulatePortfolioGrowth(investments);
                              const totalInvested = grownInvestments.reduce((sum, inv) => sum + (inv.investedAmount || 0), 0);
                              const currentValue = grownInvestments.reduce((sum, inv) => sum + (isNaN(inv.currentValue) ? 0 : inv.currentValue), 0);
                              const totalProfit = grownInvestments.reduce((sum, inv) => sum + (isNaN(inv.profit) ? 0 : inv.profit), 0);
                              setTrackData(prev => prev.map(r => r.id === row.id ? {
                                ...r,
                                totalInvested,
                                currentValue,
                                totalProfit
                              } : r));
                            } catch (err) {
                              alert('Failed to refresh data');
                            }
                          }}>Refresh</button>
                        </td>
                        <td className="px-4 py-2 align-middle text-right">${isNaN(row.currentValue) ? 0 : row.currentValue.toFixed(2)}
                          <button className="ml-2 btn btn-xs btn-outline" onClick={async () => {
                            try {
                              const invRes = await axios.get(`/api/investments/user/${row.id}`, {
                                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                              });
                              const investments = invRes.data || [];
                              const grownInvestments = simulatePortfolioGrowth(investments);
                              const totalInvested = grownInvestments.reduce((sum, inv) => sum + (inv.investedAmount || 0), 0);
                              const currentValue = grownInvestments.reduce((sum, inv) => sum + (isNaN(inv.currentValue) ? 0 : inv.currentValue), 0);
                              const totalProfit = grownInvestments.reduce((sum, inv) => sum + (isNaN(inv.profit) ? 0 : inv.profit), 0);
                              setTrackData(prev => prev.map(r => r.id === row.id ? {
                                ...r,
                                totalInvested,
                                currentValue,
                                totalProfit
                              } : r));
                            } catch (err) {
                              alert('Failed to refresh data');
                            }
                          }}>Refresh</button>
                        </td>
                        <td className="px-4 py-2 align-middle text-right">${isNaN(row.totalProfit) ? 0 : row.totalProfit.toFixed(2)}
                          <button className="ml-2 btn btn-xs btn-outline" onClick={async () => {
                            try {
                              const invRes = await axios.get(`/api/investments/user/${row.id}`, {
                                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                              });
                              const investments = invRes.data || [];
                              const grownInvestments = simulatePortfolioGrowth(investments);
                              const totalInvested = grownInvestments.reduce((sum, inv) => sum + (inv.investedAmount || 0), 0);
                              const currentValue = grownInvestments.reduce((sum, inv) => sum + (isNaN(inv.currentValue) ? 0 : inv.currentValue), 0);
                              const totalProfit = grownInvestments.reduce((sum, inv) => sum + (isNaN(inv.profit) ? 0 : inv.profit), 0);
                              setTrackData(prev => prev.map(r => r.id === row.id ? {
                                ...r,
                                totalInvested,
                                currentValue,
                                totalProfit
                              } : r));
                            } catch (err) {
                              alert('Failed to refresh data');
                            }
                          }}>Refresh</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Modals */}
        {showViewModal && viewUser && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
              <h3 className="text-lg font-bold mb-2">User Details</h3>
              <p><b>Email:</b> {viewUser.email}</p>
              <p><b>Name:</b> {viewUser.fullName || viewUser.name}</p>
              <p><b>Role:</b> {viewUser.role}</p>
              <button className="btn btn-sm btn-primary mt-4" onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        )}
        {showEditModal && editUser && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
              <h3 className="text-lg font-bold mb-2">Edit User</h3>
              <label className="block mb-2">Full Name
                <input className="input input-bordered w-full" value={editForm.fullName} onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))} />
              </label>
              <label className="block mb-2">Email
                <input className="input input-bordered w-full" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
              </label>
              <label className="block mb-2">Role
                <input className="input input-bordered w-full" value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} />
              </label>
              <div className="flex gap-2 mt-4">
                <button className="btn btn-sm btn-success" onClick={handleEditSubmit}>Save</button>
                <button className="btn btn-sm btn-error" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {showResetModal && resetUser && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
              <h3 className="text-lg font-bold mb-2">Reset Password</h3>
              <p><b>User:</b> {resetUser.email}</p>
              <input className="input input-bordered w-full mb-2" type="password" placeholder="New Password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} />
              <div className="flex gap-2 mt-4">
                <button className="btn btn-sm btn-success" onClick={handleResetSubmit}>Reset</button>
                <button className="btn btn-sm btn-error" onClick={() => setShowResetModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;