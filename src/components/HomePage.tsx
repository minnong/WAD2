import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useListings } from '../contexts/ListingsContext';
import { useRentals } from '../contexts/RentalsContext';
import { useNavigate } from 'react-router-dom';
import LiquidGlassNav from './LiquidGlassNav';
import Footer from './Footer';
import { Search, Plus, Heart, ShoppingBag, Star, TrendingUp, Users, Award } from 'lucide-react';

export default function HomePage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { listings } = useListings();
  const { getUserRentals } = useRentals();
  const navigate = useNavigate();

  // Get user stats
  const userRentals = currentUser ? getUserRentals(currentUser.email || '') : [];
  const totalEarnings = userRentals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.totalCost, 0);

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
            Welcome to ShareLah, {currentUser?.displayName?.split(' ')[0] || 'User'}! 
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

        {/* User Stats */}
        {userRentals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Your ShareLah Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`rounded-2xl p-4 border-0 shadow-sm ${
                theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{listings.length}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Items Listed</p>
                  </div>
                </div>
              </div>
              <div className={`rounded-2xl p-4 border-0 shadow-sm ${
                theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{userRentals.length}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Rentals Made</p>
                  </div>
                </div>
              </div>
              <div className={`rounded-2xl p-4 border-0 shadow-sm ${
                theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">${totalEarnings}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Earned</p>
                  </div>
                </div>
              </div>
              <div className={`rounded-2xl p-4 border-0 shadow-sm ${
                theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">4.8</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Featured Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'Power Tools', icon: '🔨', count: '120+', category: 'Power Tools' },
              { name: 'Garden', icon: '🌱', count: '85+', category: 'Garden Tools' },
              { name: 'Electronics', icon: '📱', count: '60+', category: 'Electronics' },
              { name: 'Kitchen', icon: '🍳', count: '45+', category: 'Kitchen Appliances' },
              { name: 'Sports', icon: '🎾', count: '70+', category: 'Sports Equipment' },
              { name: 'Photography', icon: '📷', count: '35+', category: 'Photography' },
              { name: 'Music', icon: '🎵', count: '28+', category: 'Musical Instruments' },
              { name: 'Fitness', icon: '💪', count: '42+', category: 'Health & Fitness' },
              { name: 'Baby & Kids', icon: '🧸', count: '55+', category: 'Baby & Kids' },
              { name: 'Gaming', icon: '🎮', count: '38+', category: 'Gaming' },
              { name: 'Art & Craft', icon: '🎭', count: '25+', category: 'Art & Craft' },
              { name: 'Office', icon: '💼', count: '32+', category: 'Office Equipment' }
            ].map((category, index) => (
              <div
                key={index}
                onClick={() => navigate(`/browse?category=${encodeURIComponent(category.category)}`)}
                className={`rounded-2xl p-3 text-center transition-all cursor-pointer border-0 shadow-sm hover:shadow-md hover:scale-105 ${
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
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className={`rounded-2xl p-6 border-0 shadow-sm ${
            theme === 'dark'
              ? 'bg-gray-800/60'
              : 'bg-white/80 backdrop-blur-sm'
          }`}>
            {userRentals.length > 0 || listings.length > 0 ? (
              <div className="space-y-4">
                {/* Show recent listings */}
                {listings.slice(0, 2).map((listing, index) => (
                  <div key={`listing-${index}`} className="flex items-center space-x-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">You listed "{listing.name}"</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-green-600 dark:text-green-400 font-semibold">
                      ${listing.price}/{listing.period}
                    </div>
                  </div>
                ))}

                {/* Show recent rentals */}
                {userRentals.slice(0, 2).map((rental, index) => (
                  <div key={`rental-${index}`} className="flex items-center space-x-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">You rented "{rental.toolName}"</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {rental.startDate} - {rental.endDate}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      rental.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      rental.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {rental.status}
                    </div>
                  </div>
                ))}

                {(userRentals.length > 2 || listings.length > 2) && (
                  <div className="text-center">
                    <button
                      onClick={() => navigate('/my-rentals')}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      View all activity →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className={`text-center py-6 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No recent activity yet. Start browsing or listing items to see your activity here!
              </p>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-2xl p-4 border-0 shadow-sm ${
              theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Build Your Reputation</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Complete rentals and maintain your tools well to earn higher ratings and more bookings.
                  </p>
                </div>
              </div>
            </div>
            <div className={`rounded-2xl p-4 border-0 shadow-sm ${
              theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Maximize Earnings</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Set competitive prices and keep your availability updated to attract more renters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}