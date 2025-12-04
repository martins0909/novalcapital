import { Link } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  isAuthenticated?: boolean;
}

const Header = ({ isAuthenticated }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-border">
      <nav className="w-full py-4">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/other-img/logoicon1.png" alt="Company logo" className="h-12 w-12" />
            <span className="font-bold text-xl text-primary">NovalCapitalFX</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-heading hover:text-primary transition text-sm font-bold">Home</Link>
            <Link to="/markets" className="text-heading hover:text-primary transition text-sm font-bold">Markets</Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary transition">
                Company
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">About</Link>
                <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Contact</Link>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary transition">
                Resources
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/customers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Customers</Link>
                <Link to="/roadmap" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Roadmap</Link>
                <Link to="/legal-docs" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Legal Docs</Link>
              </div>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-info">Dashboard</Link>
            ) : (
              <>
                <Link to="/signin" className="btn btn-link">
                  <i className="fas fa-circle-user mr-2"></i>Login
                </Link>
                <Link to="/signup" className="btn btn-info">Create account</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4 px-0">
            <Link to="/" className="block py-2 text-gray-700 hover:text-primary">Home</Link>
            <Link to="/markets" className="block py-2 text-gray-700 hover:text-primary">Markets</Link>
            <Link to="/about" className="block py-2 text-gray-700 hover:text-primary">About</Link>
            <Link to="/contact" className="block py-2 text-gray-700 hover:text-primary">Contact</Link>
            <Link to="/customers" className="block py-2 text-gray-700 hover:text-primary">Customers</Link>
            <Link to="/roadmap" className="block py-2 text-gray-700 hover:text-primary">Roadmap</Link>
            <Link to="/legal-docs" className="block py-2 text-gray-700 hover:text-primary">Legal Docs</Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="block mt-4 btn btn-info w-full">Dashboard</Link>
            ) : (
              <>
                <Link to="/signin" className="block mt-4 btn btn-link w-full">Login</Link>
                <Link to="/signup" className="block mt-2 btn btn-info w-full">Create account</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
