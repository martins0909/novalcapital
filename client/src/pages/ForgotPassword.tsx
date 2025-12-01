import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Placeholder for forgot password logic
      setMessage('If your email exists, a reset link has been sent.');
    } catch (err: any) {
      setError('Failed to send reset link');
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
                <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Enter your email"
                    required
                  />
                  {error && <div className="text-red-500">{error}</div>}
                  {message && <div className="text-green-600">{message}</div>}
                  <button type="submit" className="w-full btn btn-info py-3" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;