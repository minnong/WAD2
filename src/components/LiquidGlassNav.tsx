import React, { useState } from 'react';
import { Menu, X, Search, User, Bell } from 'lucide-react';
import ShareLahLogo from './LendLahLogo';

const LiquidGlassNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Browse', href: '#browse' },
    { name: 'List Item', href: '#list' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Community', href: '#community' },
    { name: 'Support', href: '#support' }
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      {/* Glass Container */}
      <div className="relative">
        {/* Background Glass Effect */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
          {/* Liquid Glass Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-2xl" />
          
          {/* Animated Liquid Blobs */}
          <div className="absolute top-2 left-4 w-6 h-6 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-sm animate-pulse" />
          <div className="absolute bottom-2 right-8 w-4 h-4 bg-gradient-to-br from-pink-400/30 to-blue-400/30 rounded-full blur-sm animate-pulse delay-300" />
          <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-sm animate-pulse delay-700" />
        </div>

        {/* Navigation Content */}
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <ShareLahLogo size="md" />
              <span className="text-white font-bold text-xl tracking-tight">
                ShareLah
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative text-white/80 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide group"
                >
                  {item.name}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white rounded-lg transition-all duration-300 border border-white/10 hover:border-white/20">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white/80 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/20">
              <div className="space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-white/80 hover:text-white transition-colors duration-300 py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-3 space-y-3 border-t border-white/20">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white rounded-lg transition-all duration-300 border border-white/10">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Sign In</span>
                  </button>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg transition-all duration-300 shadow-lg font-medium">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LiquidGlassNav; 