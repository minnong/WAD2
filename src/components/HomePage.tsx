import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LiquidGlassNav from './LiquidGlassNav';
import { Search, Plus, Heart, ShoppingBag } from 'lucide-react';

export default function HomePage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Ready to find what you need or share what you have?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-xl p-6 transition-all cursor-pointer border ${
            theme === 'dark'
              ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-700/50 hover:border-gray-600/50'
              : 'bg-white/50 hover:bg-white/70 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-sm'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Browse Tools</h3>
                <p className="text-sm text-gray-400">Find what you need</p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 transition-all cursor-pointer border ${
            theme === 'dark'
              ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-700/50 hover:border-gray-600/50'
              : 'bg-white/50 hover:bg-white/70 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-sm'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">List an Item</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Share & earn money</p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 transition-all cursor-pointer border ${
            theme === 'dark'
              ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-700/50 hover:border-gray-600/50'
              : 'bg-white/50 hover:bg-white/70 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-sm'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">My Rentals</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Track your items</p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 transition-all cursor-pointer border ${
            theme === 'dark'
              ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-700/50 hover:border-gray-600/50'
              : 'bg-white/50 hover:bg-white/70 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-sm'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Favorites</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Saved items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { name: 'Power Tools', icon: '🔧', count: '120+ items' },
              { name: 'Garden Tools', icon: '🌱', count: '85+ items' },
              { name: 'Electronics', icon: '📱', count: '60+ items' },
              { name: 'Kitchen', icon: '🍳', count: '45+ items' },
              { name: 'Sports', icon: '⚽', count: '70+ items' },
              { name: 'Home & DIY', icon: '🏠', count: '95+ items' }
            ].map((category, index) => (
              <div key={index} className={`rounded-lg p-4 text-center transition-all cursor-pointer border ${
                theme === 'dark'
                  ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-700/50 hover:border-gray-600/50'
                  : 'bg-white/50 hover:bg-white/70 border-gray-200/50 hover:border-gray-300/50 backdrop-blur-sm'
              }`}>
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{category.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className={`rounded-xl p-6 border ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700/50'
              : 'bg-white/50 border-gray-200/50 backdrop-blur-sm'
          }`}>
            <p className={`text-center py-8 ${
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