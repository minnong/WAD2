import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LiquidGlassNav from './LiquidGlassNav';
import { Search, Filter, Star, MapPin, Clock, List, Map as MapIcon } from 'lucide-react';

export default function BrowsePage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Power Tools', 'Garden', 'Electronics', 'Kitchen', 'Sports', 'Home & DIY'];

  const mockTools = [
    {
      id: 1,
      name: 'Drill Press',
      price: 25,
      period: 'day',
      location: 'Orchard, Singapore',
      coordinates: { lat: 1.3048, lng: 103.8318 },
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
      coordinates: { lat: 1.3526, lng: 103.9449 },
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
      coordinates: { lat: 1.3329, lng: 103.7436 },
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
      coordinates: { lat: 1.4382, lng: 103.7890 },
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
      coordinates: { lat: 1.3162, lng: 103.7649 },
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
      coordinates: { lat: 1.3519, lng: 103.8486 },
      rating: 4.8,
      reviews: 15,
      image: '🎨',
      category: 'Home & DIY',
      owner: 'Emma T.'
    },
    {
      id: 7,
      name: 'Circular Saw',
      price: 30,
      period: 'day',
      location: 'Ang Mo Kio, Singapore',
      coordinates: { lat: 1.3691, lng: 103.8454 },
      rating: 4.5,
      reviews: 20,
      image: '⚙️',
      category: 'Power Tools',
      owner: 'Alex C.'
    },
    {
      id: 8,
      name: 'Gaming Laptop',
      price: 50,
      period: 'day',
      location: 'Punggol, Singapore',
      coordinates: { lat: 1.4043, lng: 103.9021 },
      rating: 4.9,
      reviews: 35,
      image: '💻',
      category: 'Electronics',
      owner: 'Ryan S.'
    }
  ];

  const filteredTools = mockTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const searchSuggestions = searchTerm.length > 0
    ? mockTools
        .filter(tool => tool.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5)
        .map(tool => tool.name)
    : [];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
          // Fallback to Singapore center if location access denied
          setUserLocation({ lat: 1.3521, lng: 103.8198 });
        }
      );
    } else {
      // Fallback to Singapore center if geolocation not supported
      setUserLocation({ lat: 1.3521, lng: 103.8198 });
    }
  }, []);

  // Google Maps integration
  useEffect(() => {
    if (viewMode === 'map' && searchSubmitted && window.google && mapRef.current && userLocation) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: userLocation,
        styles: [
          // Hide all POI labels and businesses
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.attraction",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.government",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.medical",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.place_of_worship",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.school",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.sports_complex",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "transit.station",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          // Apply theme-specific styles
          ...(theme === 'dark' ? [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }],
            },
          ] : [])
        ]
      });

      // Add user location marker (red pin like Google Maps)
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Your Location',
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 32 16 32s16-23.163 16-32C32 7.163 24.837 0 16 0z" fill="#EA4335"/>
              <circle cx="16" cy="16" r="8" fill="white"/>
              <circle cx="16" cy="16" r="4" fill="#EA4335"/>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(32, 48),
          anchor: new window.google.maps.Point(16, 48),
        }
      });

      const userInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; text-align: center;">
            <h3 style="margin: 0; color: #1f2937;">📍 Your Location</h3>
            <p style="margin: 4px 0; color: #6b7280;">You are here</p>
          </div>
        `
      });

      userMarker.addListener('click', () => {
        userInfoWindow.open(map, userMarker);
      });

      // Add markers for filtered tools
      filteredTools.forEach((tool) => {
        const marker = new window.google.maps.Marker({
          position: tool.coordinates,
          map: map,
          title: tool.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="2"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">${tool.image}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(40, 40),
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 24px; margin-right: 8px;">${tool.image}</span>
                <h3 style="margin: 0; color: #1f2937;">${tool.name}</h3>
              </div>
              <p style="margin: 4px 0; color: #6b7280;">📍 ${tool.location}</p>
              <p style="margin: 4px 0; color: #6b7280;">⭐ ${tool.rating} (${tool.reviews} reviews)</p>
              <p style="margin: 8px 0 0 0; font-weight: bold; color: #3b82f6;">$${tool.price}/${tool.period}</p>
              <button style="
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                margin-top: 8px;
                cursor: pointer;
                font-weight: 500;
              " onclick="alert('Rent ${tool.name}')">
                Rent Now
              </button>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    }
  }, [viewMode, searchSubmitted, filteredTools, theme, userLocation]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmitted(true);
    setShowSuggestions(false);
    if (searchTerm.trim()) {
      setViewMode('map');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSearchSubmitted(true);
    setViewMode('map');
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
          <h1 className="text-3xl font-bold mb-2">Browse Tools</h1>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Find the perfect tool for your project
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar with Suggestions */}
            <div className="flex-1 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools... (Press Enter to see map)"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border-0 shadow-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 text-white placeholder-gray-400'
                      : 'bg-white/80 text-gray-900 placeholder-gray-500 backdrop-blur-sm'
                  }`}
                />
              </form>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border-0 shadow-lg backdrop-blur-sm z-10 ${
                  theme === 'dark'
                    ? 'bg-gray-800/90'
                    : 'bg-white/90'
                }`}>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-4 py-3 transition-all first:rounded-t-2xl last:rounded-b-2xl ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700/50 text-white'
                          : 'hover:bg-gray-100/50 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Search className="w-4 h-4 text-gray-400" />
                        <span>{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border-0 shadow-sm transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800/60 hover:bg-gray-800/80 text-white'
                    : 'bg-white/80 hover:bg-white/90 text-gray-900 backdrop-blur-sm'
                }`}
              >
                <List className="w-5 h-5" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border-0 shadow-sm transition-all ${
                  viewMode === 'map'
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800/60 hover:bg-gray-800/80 text-white'
                    : 'bg-white/80 hover:bg-white/90 text-gray-900 backdrop-blur-sm'
                }`}
              >
                <MapIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>

            {/* Filter Button */}
            <button className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border-0 shadow-sm transition-all ${
              theme === 'dark'
                ? 'bg-gray-800/60 hover:bg-gray-800/80 text-white'
                : 'bg-white/80 hover:bg-white/90 text-gray-900 backdrop-blur-sm'
            }`}>
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
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

        {/* Content Area */}
        {viewMode === 'list' ? (
          <>
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
          </>
        ) : (
          /* Map View */
          <div className="space-y-4">
            {searchSubmitted && searchTerm ? (
              <div className={`p-4 rounded-2xl border-0 shadow-sm ${
                theme === 'dark'
                  ? 'bg-gray-800/60'
                  : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Showing {filteredTools.length} results for "{searchTerm}" on map
                </p>
              </div>
            ) : null}

            <div className={`rounded-2xl overflow-hidden border-0 shadow-lg ${
              theme === 'dark'
                ? 'bg-gray-800/60'
                : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <div
                ref={mapRef}
                className="w-full h-96 md:h-[500px]"
                style={{ minHeight: '400px' }}
              />

              {!window.google && (
                <div className="flex items-center justify-center h-96 md:h-[500px]">
                  <div className="text-center">
                    <MapIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Loading Google Maps...
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Please make sure Google Maps API is loaded
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}