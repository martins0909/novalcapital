import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Placeholder for reset password logic
      setMessage('Password reset successful. You can now sign in.');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err: any) {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-lighter">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="max-w-md w-full">
              <div className="card p-8">
                <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Enter new password"
                    required
                  />
                  {error && <div className="text-red-500">{error}</div>}
                  {message && <div className="text-green-600">{message}</div>}
                  <button type="submit" className="w-full btn btn-info py-3" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;