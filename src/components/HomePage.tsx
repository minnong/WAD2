import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useListings } from '../contexts/ListingsContext';
import { useRentals } from '../contexts/RentalsContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LiquidGlassNav from './LiquidGlassNav';
import Footer from './Footer';
import { Search, Plus, Heart, ShoppingBag, Star, TrendingUp, Users, Award, ChevronLeft, ChevronRight, Hammer, Leaf, Smartphone, ChefHat, Dumbbell, Camera, Music, Baby, Gamepad2, Palette, Briefcase, Wrench } from 'lucide-react';

import toolLibrary from '../assets/tool_library.jpg';
import rentImage from '../assets/rent.jpg';
import toolsImage from '../assets/tools.jpg';
import communityImage from '../assets/community.jpeg';

export default function HomePage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { listings, userListings } = useListings();
  const { getUserRentals } = useRentals();
  const navigate = useNavigate();

  // Get user stats
  const userRentals = currentUser ? getUserRentals() : [];
  const totalEarnings = userRentals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.totalCost, 0);

  // Carousel state and data
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    {
      id: 1,
      title: `Welcome to ShareLah, ${currentUser?.displayName?.split(' ')[0] || 'User'}!`,
      subtitle: "Find tools or share what you have",
      image: toolLibrary,
      color: "from-indigo-500 to-purple-600",
      action: () => navigate('/browse')
    },
    {
      id: 2,
      title: "Share Your Tools",
      subtitle: "Earn money from unused tools",
      image: toolsImage,
      color: "from-blue-500 to-purple-600",
      action: () => navigate('/list-item')
    },
    {
      id: 3,
      title: "Find What You Need",
      subtitle: "Rent tools instead of buying",
      image: rentImage,
      color: "from-green-500 to-blue-500",
      action: () => navigate('/browse')
    },
    {
      id: 4,
      title: "Join the Community",
      subtitle: "Over 1000+ tools available",
      image: communityImage,
      color: "from-purple-500 to-pink-500",
      action: () => navigate('/browse')
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

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
        {/* Enhanced Carousel Banner */}
        <div className="mb-8 relative overflow-hidden rounded-3xl shadow-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`w-full flex-shrink-0 ${typeof banner.image === 'string' && banner.image.startsWith('/') ? 'relative' : `bg-gradient-to-r ${banner.color}`} p-12 md:p-20 cursor-pointer min-h-[400px] md:min-h-[450px]`}
                onClick={banner.action}
                style={typeof banner.image === 'string' && banner.image.startsWith('/') ? {
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${banner.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                } : {}}
              >
                <div className="flex items-center justify-between h-full">
                  <div className="text-white z-10 relative">
                    {typeof banner.image === 'string' && banner.image.startsWith('/') ? (
                      // For image backgrounds, don't show the small icon
                      <div className="mb-6"></div>
                    ) : (
                      <div className="text-8xl md:text-9xl mb-6">{banner.image}</div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">{banner.title}</h1>
                    <p className="text-xl md:text-2xl opacity-90 mb-6 drop-shadow-md">{banner.subtitle}</p>
                    <div className="flex space-x-4">
                      <div className="px-6 py-2 bg-white/30 backdrop-blur-sm rounded-full text-sm font-medium shadow-lg">
                        Click to explore
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    {typeof banner.image === 'string' && banner.image.startsWith('/') ? (
                      // For image backgrounds, no decorative element
                      null
                    ) : (
                      <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="text-8xl">{banner.image}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category Icons Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-8 px-2">Popular Categories</h2>
          <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide gap-8 pb-6">
              {[
                { name: 'Power Tools', icon: Hammer, count: '120+', category: 'Power Tools' },
                { name: 'Garden', icon: Leaf, count: '85+', category: 'Garden Tools' },
                { name: 'Electronics', icon: Smartphone, count: '60+', category: 'Electronics' },
                { name: 'Kitchen', icon: ChefHat, count: '45+', category: 'Kitchen Appliances' },
                { name: 'Sports', icon: Dumbbell, count: '70+', category: 'Sports Equipment' },
                { name: 'Photography', icon: Camera, count: '35+', category: 'Photography' },
                { name: 'Music', icon: Music, count: '28+', category: 'Musical Instruments' },
                { name: 'Fitness', icon: Dumbbell, count: '42+', category: 'Health & Fitness' },
                { name: 'Baby & Kids', icon: Baby, count: '55+', category: 'Baby & Kids' },
                { name: 'Gaming', icon: Gamepad2, count: '38+', category: 'Gaming' },
                { name: 'Art & Craft', icon: Palette, count: '25+', category: 'Art & Craft' },
                { name: 'Office', icon: Briefcase, count: '32+', category: 'Office Equipment' }
              ].map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={index}
                    onClick={() => navigate(`/browse?category=${encodeURIComponent(category.category)}`)}
                    className="flex-none cursor-pointer group"
                  >
                    <div className={`w-24 h-24 rounded-full border border-gray-200/40 flex items-center justify-center mb-3 transition-all group-hover:border-gray-300/60 group-hover:shadow-lg group-hover:scale-105 ${
                      theme === 'dark' ? 'bg-gray-800/15' : 'bg-gray-100/25'
                    }`}>
                      <IconComponent className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-400/80' : 'text-gray-500/80'}`} strokeWidth={1.5} />
                    </div>
                    <div className="text-center max-w-[96px]">
                      <h3 className="font-medium text-xs mb-1 leading-tight">{category.name}</h3>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{category.count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Stats with Glowing Purple Shadow */}
        {userRentals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-8 px-2">Your ShareLah Stats</h2>
            <div className={`rounded-3xl p-6 shadow-2xl ${
              theme === 'dark'
                ? 'bg-gray-900/90 backdrop-blur-sm border border-purple-500/20'
                : 'bg-white/90 backdrop-blur-sm border border-purple-300/30'
            }`}
            style={{
              boxShadow: `
                0 0 30px rgba(147, 51, 234, 0.3),
                0 0 60px rgba(147, 51, 234, 0.2),
                0 0 90px rgba(147, 51, 234, 0.1),
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04)
              `
            }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center text-center p-4">
                    <TrendingUp className="w-12 h-12 mb-4" style={{
                      fill: 'none',
                      stroke: 'url(#purpleBlueGradient)',
                      strokeWidth: '2'
                    }} />
                    <p className="text-2xl font-bold mb-1">{listings.length}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Items Listed</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4">
                    <ShoppingBag className="w-12 h-12 mb-4" style={{
                      fill: 'none',
                      stroke: 'url(#purpleBlueGradient)',
                      strokeWidth: '2'
                    }} />
                    <p className="text-2xl font-bold mb-1">{userRentals.length}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Rentals Made</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4">
                    <Award className="w-12 h-12 mb-4" style={{
                      fill: 'none',
                      stroke: 'url(#purpleBlueGradient)',
                      strokeWidth: '2'
                    }} />
                    <p className="text-2xl font-bold mb-1">${totalEarnings}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Earned</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4">
                    <Star className="w-12 h-12 mb-4" style={{
                      fill: 'none',
                      stroke: 'url(#purpleBlueGradient)',
                      strokeWidth: '2'
                    }} />
                    <p className="text-2xl font-bold mb-1">4.8</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</p>
                  </div>
                </div>

                {/* Single SVG gradient definition for all icons */}
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient id="purpleBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
            </div>
          </div>
        )}

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

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-8 px-2">Recent Activity</h2>
          <div className={`rounded-2xl p-6 border-0 shadow-sm ${
            theme === 'dark'
              ? 'bg-gray-800/60'
              : 'bg-white/80 backdrop-blur-sm'
          }`}>
            {userRentals.length > 0 || userListings.length > 0 ? (
              <div className="space-y-4">
                {/* Show recent listings */}
                {userListings.slice(0, 2).map((listing, index) => (
                  <div key={`listing-${index}`} className="flex items-center space-x-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">You listed "{listing.name}"</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {listing.createdAt instanceof Date
                          ? listing.createdAt.toLocaleDateString()
                          : new Date((listing.createdAt as any).toDate()).toLocaleDateString()}
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

                {(userRentals.length > 2 || userListings.length > 2) && (
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
          <h2 className="text-3xl font-bold mb-8 px-2">Quick Tips</h2>
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