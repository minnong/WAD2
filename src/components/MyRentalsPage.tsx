import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useListings } from '../contexts/ListingsContext';
import { useRentals } from '../contexts/RentalsContext';
import LiquidGlassNav from './LiquidGlassNav';
import { Package, Clock, CheckCircle, XCircle, Eye, MessageCircle, Calendar, AlertTriangle, Edit, Star, TrendingUp, Search, Plus, Inbox, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function MyRentalsPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { userListings } = useListings(); // Get user-specific listings
  const { userRentalRequests, receivedRentalRequests, updateRentalStatus } = useRentals(); // Get user's rental requests directly
  const [activeTab, setActiveTab] = useState<'rented' | 'listed' | 'requests'>('rented');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'decline' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get user's rental activity - separate active rentals and pending requests
  const activeRentals = userRentalRequests.filter(request =>
    request.status === 'approved' || request.status === 'active' || request.status === 'completed'
  );
  const pendingRequests = userRentalRequests.filter(request =>
    request.status === 'pending'
  );
  const userRentals = [...activeRentals, ...pendingRequests]; // Show both active rentals and pending requests
  const userOwnListings = userListings;
  const incomingRequests = receivedRentalRequests.filter(request => request.status === 'pending');

  // Helper function to render tool image (emoji or base64) - enhanced for better layout
  const renderToolImage = (imageStr: string, size: 'small' | 'large' = 'small') => {
    const sizeClasses = size === 'large'
      ? "w-32 h-32 md:w-40 md:h-40"
      : "w-16 h-16";

    // Check if image is a base64 data URL
    if (imageStr && imageStr.startsWith('data:image/')) {
      return (
        <img
          src={imageStr}
          alt="Tool"
          className={`${sizeClasses} object-cover rounded-xl shadow-md`}
        />
      );
    }
    // Otherwise, treat as emoji
    return (
      <div className={`${sizeClasses} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-md ${
        size === 'large' ? 'text-6xl md:text-7xl' : 'text-4xl'
      }`}>
        {imageStr}
      </div>
    );
  };

  const handleViewListing = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  const handleContactOwner = (rental: any) => {
    // Navigate to chat page with owner
    navigate('/chat', { state: { recipientEmail: rental.ownerEmail, recipientName: rental.ownerName } });
  };

  const handleExtendRental = (rental: any) => {
    // Navigate to listing page to make a new request for extended dates
    navigate(`/listing/${rental.toolId}`);
  };

  const handleBoostListing = (listingId: string) => {
    // Future implementation for boosting listings
    alert('Boost listing feature coming soon!');
  };

  const handleEditListing = (listingId: string) => {
    // Navigate to edit listing page
    navigate(`/list-item?edit=${listingId}`);
  };

  const handleCancelRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowCancelModal(true);
  };

  const handleApprovalAction = (requestId: string, action: 'approve' | 'decline') => {
    setSelectedRequestId(requestId);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const confirmApprovalAction = async () => {
    if (!selectedRequestId || !approvalAction) return;

    setIsLoading(true);
    try {
      const status = approvalAction === 'approve' ? 'approved' : 'declined';
      await updateRentalStatus(selectedRequestId, status);
      setShowApprovalModal(false);
      setSelectedRequestId(null);
      setApprovalAction(null);
      setSuccessMessage(
        approvalAction === 'approve'
          ? 'Rental request approved successfully!'
          : 'Rental request declined successfully!'
      );
      setShowSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating rental status:', error);
      alert('Failed to update rental request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedRequestId(null);
    setApprovalAction(null);
  };

  const confirmCancelRequest = async () => {
    if (!selectedRequestId) return;

    setIsLoading(true);
    try {
      await updateRentalStatus(selectedRequestId, 'cancelled');
      setShowCancelModal(false);
      setSelectedRequestId(null);
      setSuccessMessage('Rental request cancelled successfully!');
      setShowSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedRequestId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'rented':
        return 'text-purple-300 bg-purple-300/10';
      case 'completed':
      case 'available':
        return 'text-green-500 bg-green-500/10';
      case 'overdue':
        return 'text-red-500 bg-red-500/10';
      case 'cancelled':
      case 'declined':
        return 'text-gray-500 bg-gray-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
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
      case 'cancelled':
      case 'declined':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
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
        {/* Enhanced Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                My Rentals
              </h1>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your rental activity and listings
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'} border-0 shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userRentals.length}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Rentals</p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'} border-0 shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userOwnListings.length}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>My Listings</p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'} border-0 shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'} border-0 shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Rating</p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'} border-0 shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{incomingRequests.length}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Incoming Requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className={`rounded-2xl p-1 mb-8 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'} border-0 shadow-sm`}>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab('rented')}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === 'rented'
                  ? 'bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-lg transform scale-[1.02]'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700/50'
                  : 'text-gray-700 hover:bg-gray-100/80'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Items I'm Renting ({userRentals.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('listed')}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === 'listed'
                  ? 'bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-lg transform scale-[1.02]'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700/50'
                  : 'text-gray-700 hover:bg-gray-100/80'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>My Listings ({userOwnListings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-lg transform scale-[1.02]'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700/50'
                  : 'text-gray-700 hover:bg-gray-100/80'
              }`}
            >
              <Inbox className="w-5 h-5" />
              <span>Requests ({incomingRequests.length})</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'rented' ? (
          <div className="space-y-6">
            {/* Active Rentals Section */}
            {activeRentals.length > 0 && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  🔥 Active Rentals
                </h2>
                <div className="space-y-6">
                  {activeRentals.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleViewListing(item.toolId)}
                      className={`rounded-2xl p-6 border-0 shadow-sm cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
                        theme === 'dark'
                          ? 'bg-gray-800/60 hover:bg-gray-800/80'
                          : 'bg-white/80 backdrop-blur-sm hover:bg-white/90'
                      }`}>
                      <div className="flex items-start space-x-4">
                        {renderToolImage(item.toolImage, "text-4xl")}

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
                              <p className="font-medium text-purple-300">${item.totalCost}</p>
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

                          <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleContactOwner(item)}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all hover:scale-105 ${
                                theme === 'dark'
                                  ? 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Contact Owner</span>
                            </button>
                            {item.status === 'active' && (
                              <button
                                onClick={() => handleExtendRental(item)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all hover:scale-105 shadow-md"
                              >
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
              </div>
            )}

            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  ⏳ Pending Requests
                </h2>
                <div className="space-y-6">
                  {pendingRequests.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleViewListing(item.toolId)}
                      className={`rounded-2xl p-6 border-0 shadow-sm cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
                        theme === 'dark'
                          ? 'bg-gray-800/60 hover:bg-gray-800/80'
                          : 'bg-white/80 backdrop-blur-sm hover:bg-white/90'
                      }`}>
                      <div className="flex items-start space-x-4">
                        {renderToolImage(item.toolImage, "text-4xl")}

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
                              <p className="font-medium text-purple-300">${item.totalCost}</p>
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

                          <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleContactOwner(item)}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all hover:scale-105 ${
                                theme === 'dark'
                                  ? 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Contact Owner</span>
                            </button>
                            {item.status === 'pending' && (
                              <button
                                onClick={() => handleCancelRequest(item.id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Cancel Request</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'listed' ? (
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              💼 My Tool Listings
            </h2>
            <div className="space-y-6">
              {userOwnListings.map((item) => (
                <div key={item.id} className={`group rounded-3xl p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/60 backdrop-blur-sm'
                    : 'bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm'
                }`}>
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                      }`}>
                        {renderToolImage(item.image, "text-3xl")}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
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
                          <p className="font-medium text-purple-300">${item.price}/{item.period}</p>
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

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleViewListing(item.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all hover:scale-105 ${
                            theme === 'dark'
                              ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400'
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() => handleEditListing(item.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all hover:scale-105 ${
                            theme === 'dark'
                              ? 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit Listing</span>
                        </button>
                        {item.availability === 'available' && (
                          <button
                            onClick={() => handleBoostListing(item.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all hover:scale-105 shadow-md"
                          >
                            <TrendingUp className="w-4 h-4" />
                            <span>Boost Listing</span>
                          </button>
                        )}
                        <button
                          onClick={() => navigate('/chat')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all hover:scale-105 ${
                            theme === 'dark'
                              ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Messages</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              📥 Incoming Rental Requests
            </h2>
            {incomingRequests.length > 0 ? (
              <div className="space-y-6">
                {incomingRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => handleViewListing(request.toolId)}
                    className={`rounded-2xl p-6 border-0 shadow-sm cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
                      theme === 'dark'
                        ? 'bg-gray-800/60 hover:bg-gray-800/80'
                        : 'bg-white/80 backdrop-blur-sm hover:bg-white/90'
                    }`}>
                    <div className="flex items-start space-x-4">
                      {renderToolImage(request.toolImage, "text-4xl")}

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{request.toolName}</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Request from {request.renterName} • {request.renterEmail}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Requested Period</p>
                            <p className="font-medium">{request.startDate} to {request.endDate}</p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {request.startTime} - {request.endTime}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Offered Amount</p>
                            <p className="font-medium text-green-400">${request.totalCost}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Request Date</p>
                            <p className="font-medium">
                              {request.requestDate instanceof Date
                                ? request.requestDate.toLocaleDateString()
                                : new Date((request.requestDate as any).toDate()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {request.message && (
                          <div className={`p-3 rounded-xl mb-4 ${
                            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                          }`}>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              <strong>Renter's message:</strong> {request.message}
                            </p>
                          </div>
                        )}

                        <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleApprovalAction(request.id, 'approve')}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleApprovalAction(request.id, 'decline')}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                          <button
                            onClick={() => handleContactOwner(request)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all hover:scale-105 ${
                              theme === 'dark'
                                ? 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Contact Renter</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-100'
                }`}>
                  <Inbox className="w-12 h-12 opacity-50" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  No Incoming Requests
                </h3>
                <p className="text-lg mb-6 max-w-md mx-auto">
                  When people request to rent your items, you'll see them here for approval.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Empty State */}
        {((activeTab === 'rented' && userRentals.length === 0) ||
          (activeTab === 'listed' && userOwnListings.length === 0) ||
          (activeTab === 'requests' && incomingRequests.length === 0)) && (
          <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-100'
            }`}>
              <Package className="w-12 h-12 opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {activeTab === 'rented'
                ? 'No Rentals Yet'
                : activeTab === 'listed'
                ? 'No Listings Yet'
                : 'No Incoming Requests'}
            </h3>
            <p className="text-lg mb-6 max-w-md mx-auto">
              {activeTab === 'rented'
                ? 'Discover amazing tools from your community and start your first rental adventure!'
                : activeTab === 'listed'
                ? 'Share your tools with the community and start earning passive income today!'
                : 'When people request to rent your items, you\'ll see them here for approval.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {activeTab === 'rented' ? (
                <>
                  <button
                    onClick={() => navigate('/browse')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all hover:scale-105 shadow-lg"
                  >
                    Browse Tools
                  </button>
                  <button
                    onClick={() => navigate('/list-item')}
                    className={`px-6 py-3 rounded-xl border transition-all hover:scale-105 ${
                      theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    List Your Tools
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/list-item')}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all hover:scale-105 shadow-lg"
                  >
                    List Your First Tool
                  </button>
                  <button
                    onClick={() => navigate('/browse')}
                    className={`px-6 py-3 rounded-xl border transition-all hover:scale-105 ${
                      theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Explore Community
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cancel Rental Request</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to cancel this rental request? The owner will be notified and you won't be able to rent this item for the selected dates.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={closeCancelModal}
                disabled={isLoading}
                className={`flex-1 py-2 px-4 rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50`}
              >
                Keep Request
              </button>
              <button
                onClick={confirmCancelRequest}
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  'Cancel Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                approvalAction === 'approve'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {approvalAction === 'approve' ? (
                  <ThumbsUp className={`w-6 h-6 ${
                    approvalAction === 'approve'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                ) : (
                  <ThumbsDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {approvalAction === 'approve' ? 'Approve Rental Request' : 'Decline Rental Request'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This action will notify the renter</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {approvalAction === 'approve'
                ? 'Are you sure you want to approve this rental request? The item will be marked as unavailable for the requested dates.'
                : 'Are you sure you want to decline this rental request? The renter will be notified that their request was declined.'}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={closeApprovalModal}
                disabled={isLoading}
                className={`flex-1 py-2 px-4 rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={confirmApprovalAction}
                disabled={isLoading}
                className={`flex-1 py-2 px-4 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center ${
                  approvalAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : approvalAction === 'approve' ? (
                  'Approve Request'
                ) : (
                  'Decline Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-xl p-4 shadow-lg border-l-4 border-green-500 flex items-center space-x-3 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {successMessage.includes('approved') ? 'Request Approved' :
                 successMessage.includes('declined') ? 'Request Declined' :
                 'Request Cancelled'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate('/browse')}
            className={`w-14 h-14 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-purple-600/90 hover:bg-purple-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
            title="Browse Tools"
          >
            <Search className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => navigate('/list-item')}
            className={`w-14 h-14 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-green-600/90 hover:bg-green-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
            title="List New Tool"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}