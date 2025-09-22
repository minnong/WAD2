import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useListings } from '../contexts/ListingsContext';
import { useRentals } from '../contexts/RentalsContext';
import LiquidGlassNav from './LiquidGlassNav';
import { Package, Clock, CheckCircle, XCircle, Eye, MessageCircle, Calendar } from 'lucide-react';

export default function MyRentalsPage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { listings } = useListings();
  const { getUserRentals } = useRentals();
  const [activeTab, setActiveTab] = useState<'rented' | 'listed'>('rented');

  // Get user's actual rental requests and listings
  const userRentals = currentUser ? getUserRentals(currentUser.email || '') : [];
  const userOwnListings = currentUser ? listings : [];



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'rented':
        return 'text-blue-500 bg-blue-500/10';
      case 'completed':
      case 'available':
        return 'text-green-500 bg-green-500/10';
      case 'overdue':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'rented':
        return <Clock className="w-4 h-4" />;
      case 'completed':
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'overdue':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
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
          <h1 className="text-3xl font-bold mb-2">My Rentals</h1>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your rentals and listings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('rented')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'rented'
                ? 'bg-blue-500 text-white shadow-lg'
                : theme === 'dark'
                ? 'bg-gray-800/60 text-gray-300 hover:bg-gray-800/80'
                : 'bg-white/80 text-gray-700 hover:bg-white/90 backdrop-blur-sm'
            }`}
          >
            Items I'm Renting
          </button>
          <button
            onClick={() => setActiveTab('listed')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'listed'
                ? 'bg-blue-500 text-white shadow-lg'
                : theme === 'dark'
                ? 'bg-gray-800/60 text-gray-300 hover:bg-gray-800/80'
                : 'bg-white/80 text-gray-700 hover:bg-white/90 backdrop-blur-sm'
            }`}
          >
            My Listings
          </button>
        </div>

        {/* Content */}
        {activeTab === 'rented' ? (
          <div className="space-y-4">
            {userRentals.map((item) => (
              <div key={item.id} className={`rounded-2xl p-6 border-0 shadow-sm ${
                theme === 'dark'
                  ? 'bg-gray-800/60'
                  : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{item.toolImage}</div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{item.toolName}</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          From {item.ownerName} • {item.location}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Rental Period</p>
                        <p className="font-medium">{item.startDate} to {item.endDate}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Cost</p>
                        <p className="font-medium text-blue-500">${item.totalCost}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Request Date</p>
                        <p className="font-medium">
                          {item.requestDate instanceof Date
                            ? item.requestDate.toLocaleDateString()
                            : new Date((item.requestDate as any).toDate()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {item.message && (
                      <div className={`p-3 rounded-xl mb-4 ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <strong>Your message:</strong> {item.message}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}>
                        <MessageCircle className="w-4 h-4" />
                        <span>Contact Owner</span>
                      </button>
                      {item.status === 'pending' && (
                        <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">
                          <XCircle className="w-4 h-4" />
                          <span>Cancel Request</span>
                        </button>
                      )}
                      {item.status === 'active' && (
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors">
                          <Calendar className="w-4 h-4" />
                          <span>Extend Rental</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {userOwnListings.map((item) => (
              <div key={item.id} className={`rounded-2xl p-6 border-0 shadow-sm ${
                theme === 'dark'
                  ? 'bg-gray-800/60'
                  : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{item.image}</div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Listed on {item.createdAt instanceof Date
                            ? item.createdAt.toLocaleDateString()
                            : new Date((item.createdAt as any).toDate()).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor('available')}`}>
                        {getStatusIcon('available')}
                        <span className="capitalize">Available</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Price</p>
                        <p className="font-medium text-blue-500">${item.price}/{item.period}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Category</p>
                        <p className="font-medium">{item.category}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Condition</p>
                        <p className="font-medium capitalize">{item.condition}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Location</p>
                        <p className="font-medium">{item.location}</p>
                      </div>
                    </div>

                    {item.description && (
                      <div className={`p-3 rounded-xl mb-4 ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.description}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}>
                        <Eye className="w-4 h-4" />
                        <span>View Listing</span>
                      </button>
                      <button className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}>
                        <span>Edit</span>
                      </button>
                      {item.availability === 'available' && (
                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors">
                          Boost Listing
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'rented' && userRentals.length === 0) ||
          (activeTab === 'listed' && userOwnListings.length === 0)) && (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">
              {activeTab === 'rented' ? 'No rentals yet' : 'No listings yet'}
            </p>
            <p className="text-sm">
              {activeTab === 'rented'
                ? 'Start browsing tools to rent!'
                : 'List your first tool to start earning!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}