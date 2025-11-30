import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TellUsMore from './pages/TellUsMore';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import About from './pages/About';
import Contact from './pages/Contact';
import Customers from './pages/Customers';
import LegalDocs from './pages/LegalDocs';
import LegalDocuments from './pages/LegalDocuments';
import Roadmap from './pages/Roadmap';
import Stocks from './pages/Stocks';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/markets" element={<Markets />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/legal-docs" element={<LegalDocs />} />
      <Route path="/legal-documents" element={<LegalDocuments />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/stocks" element={<Stocks />} />
      <Route path="/tell-us-more" element={<TellUsMore />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard setIsAuthenticated={setIsAuthenticated} />
          </ProtectedRoute>
        }
      />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
