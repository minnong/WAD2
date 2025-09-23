import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useListings } from '../contexts/ListingsContext';
import { useRentals } from '../contexts/RentalsContext';
import { useNavigate } from 'react-router-dom';
import LiquidGlassNav from './LiquidGlassNav';
import Footer from './Footer';
import { Edit3, Star, Award, Clock, MapPin, Mail, Phone, User, Settings, Shield, ExternalLink } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { listings } = useListings();
  const { getUserRentals } = useRentals();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phoneNumber || '',
    location: 'Singapore',
    bio: 'Tool sharing enthusiast passionate about making DIY projects accessible to everyone.',
    photoURL: currentUser?.photoURL || '',
    uid: currentUser?.uid || '',
    emailVerified: currentUser?.emailVerified || false,
    creationTime: currentUser?.metadata?.creationTime || '',
    lastSignInTime: currentUser?.metadata?.lastSignInTime || ''
  });

  // Update profile data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || '',
        location: 'Singapore', // This could be stored in user profile later
        bio: 'Tool sharing enthusiast passionate about making DIY projects accessible to everyone.',
        photoURL: currentUser.photoURL || '',
        uid: currentUser.uid || '',
        emailVerified: currentUser.emailVerified || false,
        creationTime: currentUser.metadata?.creationTime || '',
        lastSignInTime: currentUser.metadata?.lastSignInTime || ''
      });
    }
  }, [currentUser]);

  // Get user stats (filter by userId instead of email for better accuracy)
  const userListings = listings.filter(l => l.userId === currentUser?.uid);
  const userRentals = currentUser ? getUserRentals(currentUser.email || '') : [];
  const completedRentals = userRentals.filter(r => r.status === 'completed');
  const totalEarnings = completedRentals.reduce((sum, r) => sum + r.totalCost, 0);
  const averageRating = userListings.length > 0 ?
    userListings.reduce((sum, l) => sum + l.rating, 0) / userListings.length : 0;

  const stats = [
    { label: 'Tools Listed', value: userListings.length, icon: Award, color: 'text-purple-300' },
    { label: 'Total Rentals', value: userRentals.length, icon: Clock, color: 'text-green-500' },
    { label: 'Total Earnings', value: `$${totalEarnings}`, icon: Star, color: 'text-yellow-500' },
    { label: 'Average Rating', value: averageRating.toFixed(1), icon: Star, color: 'text-purple-400' }
  ];

  const handleSaveProfile = () => {
    // Here you would typically save to Firebase/backend
    setEditMode(false);
    console.log('Saving profile:', profileData);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'listings', label: 'My Listings' },
    { id: 'rentals', label: 'My Rentals' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <LiquidGlassNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        {/* Profile Header */}
        <div className={`p-6 rounded-lg shadow-sm mb-8 ${
          theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-900 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-900 text-white rounded-full flex items-center justify-center shadow-lg">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold">{profileData.displayName || 'Anonymous User'}</h1>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                </div>
                {profileData.emailVerified && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 dark:bg-purple-300/20 text-purple-300 rounded-full text-xs">
                    <Shield className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{profileData.location}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Joined {profileData.creationTime ? new Date(profileData.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}</span>
                </div>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-2xl`}>
                {profileData.bio}
              </p>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                editMode
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{editMode ? 'Save' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Edit Form */}
          {editMode && (
            <div className="mt-6 pt-6 border-t border-gray-200/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border resize-none ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-sm ${
              theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-900 text-white shadow-lg'
                    : theme === 'dark'
                    ? 'bg-gray-800/60 text-gray-300 hover:bg-gray-800/80'
                    : 'bg-white/80 text-gray-700 hover:bg-white/90 backdrop-blur-sm'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`p-6 rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
        }`}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Information */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
                }`}>
                  <h4 className="font-semibold mb-3">Account Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">User ID:</span>
                      <span className="font-mono text-xs">{profileData.uid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email Verified:</span>
                      <span className={profileData.emailVerified ? 'text-green-600' : 'text-red-600'}>
                        {profileData.emailVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Member Since:</span>
                      <span>{profileData.creationTime ? new Date(profileData.creationTime).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Sign In:</span>
                      <span>{profileData.lastSignInTime ? new Date(profileData.lastSignInTime).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
                }`}>
                  <h4 className="font-semibold mb-3">Quick Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Active Listings:</span>
                      <span className="font-semibold text-purple-300">{userListings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Rentals:</span>
                      <span className="font-semibold text-green-600">{userRentals.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Completed Rentals:</span>
                      <span className="font-semibold text-purple-300">{completedRentals.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Earnings:</span>
                      <span className="font-semibold text-yellow-600">${totalEarnings}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <div className="space-y-4">
                {userRentals.slice(0, 5).map((rental, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{rental.toolName}</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {rental.startDate} - {rental.endDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-300">${rental.totalCost}</p>
                        <span className={`text-xs px-2 py-1 rounded-lg ${
                          rental.status === 'completed' ? 'bg-green-100 text-green-800' :
                          rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rental.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {userRentals.length === 0 && (
                  <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No rental activity yet. Start by browsing available tools!
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">My Listed Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userListings.map((listing) => (
                  <div key={listing.id} className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="text-3xl mb-2">{listing.image}</div>
                    <h4 className="font-medium mb-1">{listing.name}</h4>
                    <p className="text-sm text-purple-300 font-bold">${listing.price}/{listing.period}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{listing.rating} ({listing.reviews} reviews)</span>
                    </div>
                  </div>
                ))}
                {userListings.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                      You haven't listed any tools yet.
                    </p>
                    <button className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl font-medium transition-colors">
                      List Your First Tool
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rentals' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Rental History</h3>
              <div className="space-y-4">
                {userRentals.map((rental, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{rental.toolImage}</div>
                        <div>
                          <h4 className="font-medium">{rental.toolName}</h4>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Rented from {rental.ownerName}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {rental.startDate} - {rental.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-300">${rental.totalCost}</p>
                        <span className={`text-xs px-2 py-1 rounded-lg ${
                          rental.status === 'completed' ? 'bg-green-100 text-green-800' :
                          rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rental.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Account Settings</h3>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl font-medium transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Open Full Settings</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-purple-300" />
                      <div>
                        <h4 className="font-medium">Profile Settings</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Update your personal information and profile picture
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/settings')}
                      className="text-purple-300 hover:text-purple-300 text-sm font-medium"
                    >
                      Configure
                    </button>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-purple-300" />
                      <div>
                        <h4 className="font-medium">Privacy & Security</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Manage your privacy settings, security preferences, and change password
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/settings')}
                      className="text-purple-300 hover:text-purple-300 text-sm font-medium"
                    >
                      Configure
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-purple-300" />
                      <div>
                        <h4 className="font-medium">Notification Preferences</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Choose how you want to be notified about rentals and messages
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/settings')}
                      className="text-purple-300 hover:text-purple-300 text-sm font-medium"
                    >
                      Manage
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border border-orange-200 ${
                  theme === 'dark' ? 'bg-orange-900/10' : 'bg-orange-50'
                }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-5 h-5 text-orange-500" />
                    <h4 className="font-medium text-orange-600">Account Status</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Email Verified:</span>
                      <span className={currentUser?.emailVerified ? 'text-green-600' : 'text-red-600'}>
                        {currentUser?.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Two-Factor Auth:</span>
                      <span className="text-gray-500">Not Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Profile Visibility:</span>
                      <span className="text-purple-300">Public</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/settings')}
                    className="mt-3 w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Manage Account Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}