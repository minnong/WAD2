import React from 'react';
import { User } from 'lucide-react';
import shareLahLogo from './sharelah.png';

const LiquidGlassNav: React.FC = () => {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={shareLahLogo} alt="ShareLah Logo" className="w-8 h-8" />
          <span className="text-white font-bold text-xl tracking-tight">
            ShareLah
          </span>
        </div>

        {/* Sign In Button */}
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white rounded-full transition-all duration-300 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl backdrop-blur-sm">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">Sign In</span>
        </button>
      </div>
    </header>
  );
};

export default LiquidGlassNav; 