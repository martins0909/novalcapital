import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xl font-heading font-black mb-4 text-white">NovalCapitalFX</h3>
            <p className="text-gray-400">
              Your trusted partner in global investment markets.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Markets</h4>
            <ul className="space-y-2">
              <li><Link to="/markets" className="text-gray-400 hover:text-white transition">Forex</Link></li>
              <li><Link to="/markets" className="text-gray-400 hover:text-white transition">Stocks</Link></li>
              <li><Link to="/markets" className="text-gray-400 hover:text-white transition">Crypto</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-4 mt-4 text-center text-gray-400">
          <p className="text-sm">&copy; 2025 NovalCapitalFX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
