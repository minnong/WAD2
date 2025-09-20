import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import shareLahLogo from './sharelah.png';

const LiquidGlassNav: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(currentUser ? '/home' : '/')}>
          <img src={shareLahLogo} alt="ShareLah Logo" className="w-8 h-8" />
          <span className="text-white font-bold text-xl tracking-tight">
            ShareLah
          </span>
        </div>

        {/* Auth Section */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white rounded-full transition-all duration-300 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {currentUser.displayName?.split(' ')[0] || 'User'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 glass-effect rounded-xl border border-white/10 shadow-xl backdrop-blur-sm overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Navigate to profile or settings page
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors font-sf-pro-text"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors font-sf-pro-text"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white rounded-full transition-all duration-300 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default LiquidGlassNav; 