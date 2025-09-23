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
        } rounded-sm blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${
          theme === 'dark' ? 'bg-blue-500/5' : 'bg-blue-400/10'
        } rounded-sm blur-3xl animate-pulse delay-2000`}></div>
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
          <div className={`rounded-3xl p-8 border-0 shadow-2xl backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-gray-900/80 border border-gray-700/30'
              : 'bg-white/90 border border-gray-200/50'
          }`}
          style={{
            boxShadow: `
              0 0 20px rgba(139, 92, 246, 0.15),
              0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04)
            `
          }}>
            {userRentals.length > 0 || userListings.length > 0 ? (
              <div className="space-y-6">
                {/* Show recent listings */}
                {userListings.slice(0, 2).map((listing, index) => (
                  <div key={`listing-${index}`} className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20'
                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-5">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg truncate">You listed "{listing.name}"</p>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          📅 {listing.createdAt instanceof Date
                            ? listing.createdAt.toLocaleDateString()
                            : new Date((listing.createdAt as any).toDate()).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-md">
                          ${listing.price}/{listing.period}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show recent rentals */}
                {userRentals.slice(0, 2).map((rental, index) => (
                  <div key={`rental-${index}`} className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-500/20'
                      : 'bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200/50'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-5">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <ShoppingBag className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg truncate">You rented "{rental.toolName}"</p>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          📅 {rental.startDate} - {rental.endDate}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md ${
                          rental.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                          rental.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                          rental.status === 'active' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' :
                          'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                        }`}>
                          {rental.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(userRentals.length > 2 || userListings.length > 2) && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => navigate('/my-rentals')}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      View all activity
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                  <div className="text-4xl">📈</div>
                </div>
                <p className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  No recent activity yet
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Start browsing or listing items to see your activity here!
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate('/browse')}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                  >
                    Browse Items
                  </button>
                  <button
                    onClick={() => navigate('/list-item')}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                  >
                    List an Item
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div>
          <h2 className="text-3xl font-bold mb-8 px-2">Quick Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`group relative overflow-hidden rounded-3xl p-8 border-0 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-blue-500/20'
                : 'bg-gradient-to-br from-white/90 to-blue-50/80 border border-blue-200/50'
            }`}
            style={{
              boxShadow: `
                0 0 20px rgba(147, 51, 234, 0.15),
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04)
              `
            }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-start space-x-5">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Users className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Build Your Reputation
                  </h3>
                  <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Complete rentals and maintain your tools well to earn higher ratings and more bookings. Great reviews lead to more trust!
                  </p>
                  <div className="mt-4 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Aim for 5-star reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`group relative overflow-hidden rounded-3xl p-8 border-0 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-green-500/20'
                : 'bg-gradient-to-br from-white/90 to-green-50/80 border border-green-200/50'
            }`}
            style={{
              boxShadow: `
                0 0 20px rgba(34, 197, 94, 0.15),
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04)
              `
            }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-start space-x-5">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Maximize Earnings
                  </h3>
                  <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Set competitive prices and keep your availability updated to attract more renters. Regular updates keep you visible!
                  </p>
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Stay active
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-green-500">💰</div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Earn more
                      </span>
                    </div>
                  </div>
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