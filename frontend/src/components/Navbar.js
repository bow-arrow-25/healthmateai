import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Menu, 
  X, 
  Home, 
  Activity, 
  Pill, 
  FileText, 
  Apple, 
  User, 
  LogOut,
  LogIn,
  Scale,
  Info
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = isAuthenticated ? [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/symptom-checker', label: 'Symptom Checker', icon: Heart },
    { path: '/bmi-calculator', label: 'BMI Calculator', icon: Scale },
    { path: '/health-info', label: 'Health Info', icon: Info },
    { path: '/medicines', label: 'Medicines', icon: Pill },
    { path: '/prescriptions', label: 'Prescriptions', icon: FileText },
    { path: '/diet', label: 'Diet', icon: Apple },
    { path: '/profile', label: 'Profile', icon: User },
  ] : [
    { path: '/', label: 'Home', icon: Home },
    { path: '/symptom-checker', label: 'Symptom Checker', icon: Heart },
    { path: '/bmi-calculator', label: 'BMI Calculator', icon: Scale },
    { path: '/health-info', label: 'Health Info', icon: Info },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-50 overflow-x-hidden">
      <div className="container mx-auto px-4 overflow-x-hidden">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold hover:opacity-80 transition">
            <Heart className="w-8 h-8" fill="currentColor" />
            <span>HealthMate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 overflow-x-auto scrollbar-hide max-w-3xl">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-2 py-2 rounded-lg transition-all whitespace-nowrap text-sm ${
                    isActive(link.path)
                      ? 'bg-white bg-opacity-20 font-semibold'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 ml-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all whitespace-nowrap text-sm flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-3 py-2 ml-2 bg-white text-blue-600 hover:bg-opacity-90 rounded-lg transition-all font-semibold whitespace-nowrap text-sm flex-shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden lg:inline">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'bg-white bg-opacity-20 font-semibold'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-4 py-3 mt-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 w-full px-4 py-3 mt-2 bg-white text-blue-600 hover:bg-opacity-90 rounded-lg transition-all font-semibold"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
