import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import LiquidGlassNav from './LiquidGlassNav';
import { Search, Plus, Heart, ShoppingBag } from 'lucide-react';

export default function HomePage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Fluid Glass Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -inset-10 opacity-30 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10'
            : 'bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20'
        } blur-3xl animate-pulse`}></div>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${
          theme === 'dark' ? 'bg-blue-500/5' : 'bg-blue-400/10'
        } rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${
          theme === 'dark' ? 'bg-purple-500/5' : 'bg-purple-400/10'
        } rounded-full blur-3xl animate-pulse delay-2000`}></div>
      </div>

      {/* Keep your original LiquidGlassNav */}
      <LiquidGlassNav />

      {/* Main Content - Added padding-top to prevent navbar overlap */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Hey {currentUser?.displayName?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Find tools or share what you have
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => navigate('/browse')}
            className={`rounded-2xl p-4 transition-all cursor-pointer border-0 shadow-sm hover:shadow-md ${
            theme === 'dark'
              ? 'bg-gray-800/60 hover:bg-gray-800/80'
              : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
          }`}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Browse</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Find tools</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/list-item')}
            className={`rounded-2xl p-4 transition-all cursor-pointer border-0 shadow-sm hover:shadow-md ${
            theme === 'dark'
              ? 'bg-gray-800/60 hover:bg-gray-800/80'
              : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
          }`}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">List Item</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Earn money</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/my-rentals')}
            className={`rounded-2xl p-4 transition-all cursor-pointer border-0 shadow-sm hover:shadow-md ${
            theme === 'dark'
              ? 'bg-gray-800/60 hover:bg-gray-800/80'
              : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
          }`}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">My Rentals</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Track items</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/favorites')}
            className={`rounded-2xl p-4 transition-all cursor-pointer border-0 shadow-sm hover:shadow-md ${
            theme === 'dark'
              ? 'bg-gray-800/60 hover:bg-gray-800/80'
              : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
          }`}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Favorites</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Saved items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'Power Tools', icon: '🔧', count: '120+' },
              { name: 'Garden', icon: '🌱', count: '85+' },
              { name: 'Electronics', icon: '📱', count: '60+' },
              { name: 'Kitchen', icon: '🍳', count: '45+' },
              { name: 'Sports', icon: '⚽', count: '70+' },
              { name: 'Home & DIY', icon: '🏠', count: '95+' }
            ].map((category, index) => (
              <div key={index} className={`rounded-2xl p-3 text-center transition-all cursor-pointer border-0 shadow-sm hover:shadow-md ${
                theme === 'dark'
                  ? 'bg-gray-800/60 hover:bg-gray-800/80'
                  : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
              }`}>
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-medium text-xs">{category.name}</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{category.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className={`rounded-2xl p-6 border-0 shadow-sm ${
            theme === 'dark'
              ? 'bg-gray-800/60'
              : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <p className={`text-center py-6 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No recent activity yet. Start browsing or listing items to see your activity here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}