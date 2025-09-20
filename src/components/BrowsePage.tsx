import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LiquidGlassNav from './LiquidGlassNav';
import { Search, Filter, Star, MapPin, Clock } from 'lucide-react';

export default function BrowsePage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Power Tools', 'Garden', 'Electronics', 'Kitchen', 'Sports', 'Home & DIY'];

  const mockTools = [
    {
      id: 1,
      name: 'Drill Press',
      price: 25,
      period: 'day',
      location: 'Orchard, Singapore',
      rating: 4.8,
      reviews: 24,
      image: '🔨',
      category: 'Power Tools',
      owner: 'John D.'
    },
    {
      id: 2,
      name: 'Lawn Mower',
      price: 40,
      period: 'day',
      location: 'Tampines, Singapore',
      rating: 4.9,
      reviews: 18,
      image: '🌱',
      category: 'Garden',
      owner: 'Sarah L.'
    },
    {
      id: 3,
      name: 'Professional Camera',
      price: 60,
      period: 'day',
      location: 'Jurong, Singapore',
      rating: 5.0,
      reviews: 31,
      image: '📷',
      category: 'Electronics',
      owner: 'Mike R.'
    },
    {
      id: 4,
      name: 'Stand Mixer',
      price: 15,
      period: 'day',
      location: 'Woodlands, Singapore',
      rating: 4.7,
      reviews: 12,
      image: '🍳',
      category: 'Kitchen',
      owner: 'Lisa M.'
    },
    {
      id: 5,
      name: 'Tennis Racket Set',
      price: 20,
      period: 'day',
      location: 'Clementi, Singapore',
      rating: 4.6,
      reviews: 8,
      image: '🎾',
      category: 'Sports',
      owner: 'David K.'
    },
    {
      id: 6,
      name: 'Paint Sprayer',
      price: 35,
      period: 'day',
      location: 'Bishan, Singapore',
      rating: 4.8,
      reviews: 15,
      image: '🎨',
      category: 'Home & DIY',
      owner: 'Emma T.'
    }
  ];

  const filteredTools = mockTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-3xl font-bold mb-2">Browse Tools</h1>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Find the perfect tool for your project
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border-0 shadow-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 text-white placeholder-gray-400'
                    : 'bg-white/80 text-gray-900 placeholder-gray-500 backdrop-blur-sm'
                }`}
              />
            </div>

            {/* Filter Button */}
            <button className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border-0 shadow-sm transition-all ${
              theme === 'dark'
                ? 'bg-gray-800/60 hover:bg-gray-800/80 text-white'
                : 'bg-white/80 hover:bg-white/90 text-gray-900 backdrop-blur-sm'
            }`}>
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>

          {/* Categories */}
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-lg'
                    : theme === 'dark'
                    ? 'bg-gray-800/60 text-gray-300 hover:bg-gray-800/80'
                    : 'bg-white/80 text-gray-700 hover:bg-white/90 backdrop-blur-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div key={tool.id} className={`rounded-2xl p-4 border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-gray-800/60 hover:bg-gray-800/80'
                : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
            }`}>
              {/* Tool Image */}
              <div className="text-6xl mb-4 text-center">{tool.image}</div>

              {/* Tool Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{tool.name}</h3>

                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{tool.rating}</span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    ({tool.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tool.location}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    By {tool.owner}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-2xl font-bold text-blue-500">${tool.price}</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      /{tool.period}
                    </span>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    Rent Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>No tools found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}