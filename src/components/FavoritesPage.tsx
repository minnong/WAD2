import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import LiquidGlassNav from './LiquidGlassNav';
import { Heart, Star, MapPin, Clock, Trash2, Share2, MessageCircle } from 'lucide-react';

export default function FavoritesPage() {
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: 'Professional Camera',
      price: 60,
      period: 'day',
      location: 'Jurong, Singapore',
      rating: 5.0,
      reviews: 31,
      image: '📷',
      category: 'Electronics',
      owner: 'Mike R.',
      savedDate: '2024-01-15',
      availability: 'Available'
    },
    {
      id: 2,
      name: 'Drill Press',
      price: 25,
      period: 'day',
      location: 'Orchard, Singapore',
      rating: 4.8,
      reviews: 24,
      image: '🔨',
      category: 'Power Tools',
      owner: 'John D.',
      savedDate: '2024-01-12',
      availability: 'Available'
    },
    {
      id: 3,
      name: 'Stand Mixer',
      price: 15,
      period: 'day',
      location: 'Woodlands, Singapore',
      rating: 4.7,
      reviews: 12,
      image: '🍳',
      category: 'Kitchen',
      owner: 'Lisa M.',
      savedDate: '2024-01-10',
      availability: 'Rented'
    },
    {
      id: 4,
      name: 'Paint Sprayer',
      price: 35,
      period: 'day',
      location: 'Bishan, Singapore',
      rating: 4.8,
      reviews: 15,
      image: '🎨',
      category: 'Home & DIY',
      owner: 'Emma T.',
      savedDate: '2024-01-08',
      availability: 'Available'
    },
    {
      id: 5,
      name: 'Gaming Console',
      price: 30,
      period: 'day',
      location: 'Punggol, Singapore',
      rating: 4.9,
      reviews: 27,
      image: '🎮',
      category: 'Electronics',
      owner: 'Ryan S.',
      savedDate: '2024-01-05',
      availability: 'Available'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Power Tools', 'Electronics', 'Kitchen', 'Home & DIY'];

  const filteredFavorites = favorites.filter(item =>
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const getAvailabilityColor = (availability: string) => {
    return availability === 'Available'
      ? 'text-green-500 bg-green-500/10'
      : 'text-orange-500 bg-orange-500/10';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <LiquidGlassNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-pink-500 fill-current" />
            My Favorites
          </h1>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {favorites.length} saved tools
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-pink-500 text-white shadow-lg'
                  : theme === 'dark'
                  ? 'bg-gray-800/60 text-gray-300 hover:bg-gray-800/80'
                  : 'bg-white/80 text-gray-700 hover:bg-white/90 backdrop-blur-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFavorites.map((item) => (
              <div key={item.id} className={`rounded-2xl p-4 border-0 shadow-sm hover:shadow-md transition-all group ${
                theme === 'dark'
                  ? 'bg-gray-800/60 hover:bg-gray-800/80'
                  : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
              }`}>
                {/* Tool Image and Favorite Button */}
                <div className="relative mb-4">
                  <div className="text-6xl text-center">{item.image}</div>
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="absolute top-0 right-0 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    title="Remove from favorites"
                  >
                    <Heart className="w-6 h-6 text-pink-500 fill-current" />
                  </button>
                </div>

                {/* Tool Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(item.availability)}`}>
                      {item.availability}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      ({item.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.location}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Saved on {item.savedDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-2xl font-bold text-blue-500">${item.price}</span>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        /{item.period}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                        item.availability === 'Available'
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={item.availability !== 'Available'}
                    >
                      {item.availability === 'Available' ? 'Rent Now' : 'Not Available'}
                    </button>

                    <button className={`p-2 rounded-xl transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`} title="Contact owner">
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button className={`p-2 rounded-xl transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`} title="Share">
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="p-2 rounded-xl transition-all text-red-500 hover:bg-red-500/10"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-base mb-6">
              {selectedCategory === 'All'
                ? "Start browsing and save tools you're interested in!"
                : `No ${selectedCategory.toLowerCase()} tools in your favorites yet.`}
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              Browse Tools
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {favorites.length > 0 && (
          <div className={`mt-8 p-6 rounded-2xl border-0 shadow-sm ${
            theme === 'dark'
              ? 'bg-gray-800/60'
              : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Favorites Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-pink-500">{favorites.length}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Favorites</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">
                  {favorites.filter(item => item.availability === 'Available').length}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Available Now</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">
                  ${Math.round(favorites.reduce((sum, item) => sum + item.price, 0) / favorites.length)}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Price/Day</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-500">
                  {(favorites.reduce((sum, item) => sum + item.rating, 0) / favorites.length).toFixed(1)}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Rating</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}