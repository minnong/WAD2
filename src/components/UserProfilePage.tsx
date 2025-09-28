import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useListings } from '../contexts/ListingsContext';
import { reviewsService, listingsService } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import LiquidGlassNav from './LiquidGlassNav';
import { ArrowLeft, Star, Package, MapPin, Calendar, MessageCircle, TrendingUp, Award, Eye } from 'lucide-react';

interface UserStats {
  totalListings: number;
  averageRating: number;
  totalReviews: number;
  joinDate: string;
}

interface UserReview {
  id: string;
  listingName: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: any;
}

export default function UserProfilePage() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { listings } = useListings();
  
  const [userListings, setUserListings] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalListings: 0,
    averageRating: 0,
    totalReviews: 0,
    joinDate: 'Recently'
  });
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');

  // Mock user data - in a real app, this would come from a user service
  const mockUsers: { [key: string]: any } = {
    'john.doe@email.com': { name: 'John D.', joinDate: '2023-01-15', bio: 'DIY enthusiast and tool collector. Happy to share my tools with the community!' },
    'sarah.lim@email.com': { name: 'Sarah L.', joinDate: '2023-03-20', bio: 'Gardening lover with a green thumb. Let me help you grow your garden!' },
    'mike.roberts@email.com': { name: 'Mike R.', joinDate: '2023-02-10', bio: 'Photography and tech enthusiast. Always upgrading my gear!' },
    'lisa.martin@email.com': { name: 'Lisa M.', joinDate: '2023-04-05', bio: 'Home chef who loves trying new kitchen gadgets.' },
    'david.kim@email.com': { name: 'David K.', joinDate: '2023-01-30', bio: 'Sports and fitness enthusiast. Staying active is my passion!' },
    'emma.tan@email.com': { name: 'Emma T.', joinDate: '2023-05-12', bio: 'Interior designer and DIY expert. Making homes beautiful!' },
    'peter.wong@email.com': { name: 'Peter W.', joinDate: '2023-02-28', bio: 'Professional contractor with quality tools to share.' },
    'alex.chen@email.com': { name: 'Alex C.', joinDate: '2023-03-15', bio: 'Tech professional and gadget collector.' },
    'mary.lau@email.com': { name: 'Mary L.', joinDate: '2023-04-20', bio: 'Weekend gardener with a passion for organic growing.' },
    'james.tan@email.com': { name: 'James T.', joinDate: '2023-01-08', bio: 'Coffee connoisseur and kitchen appliance enthusiast.' },
    'rachel.koh@email.com': { name: 'Rachel K.', joinDate: '2023-02-14', bio: 'Weekend warrior and sports enthusiast. Love cycling and staying active!' },
    'daniel.sim@email.com': { name: 'Daniel S.', joinDate: '2023-03-08', bio: 'Film and photography professional. Capturing life\'s beautiful moments!' },
    'kevin.lee@email.com': { name: 'Kevin L.', joinDate: '2023-01-22', bio: 'Woodworker and craftsman. Creating beautiful things with my hands!' },
    'sophie.ng@email.com': { name: 'Sophie N.', joinDate: '2023-04-18', bio: 'Culinary enthusiast and food blogger. Always trying new recipes!' },
    'ryan.ong@email.com': { name: 'Ryan O.', joinDate: '2023-03-25', bio: 'Musician and audio engineer. Making music and sharing the joy!' },
    'linda.wu@email.com': { name: 'Linda W.', joinDate: '2023-02-03', bio: 'Wellness coach and fitness instructor. Helping others live healthier lives!' },
    'marcus.ho@email.com': { name: 'Marcus H.', joinDate: '2023-05-01', bio: 'Home renovation expert and interior designer. Transforming spaces!' },
    'grace.lim@email.com': { name: 'Grace L.', joinDate: '2023-01-28', bio: 'Professional photographer specializing in portraits and events.' },
    'tommy.lim@email.com': { name: 'Tommy L.', joinDate: '2023-04-12', bio: 'Adventure seeker and outdoor enthusiast. Always ready for the next adventure!' },
    'jenny.choo@email.com': { name: 'Jenny C.', joinDate: '2023-03-30', bio: 'Content creator and tech reviewer. Sharing the latest in technology!' },
    'violet.koh@email.com': { name: 'Violet K.', joinDate: '2023-05-15', bio: 'Artist and crafter. Creating beautiful handmade pieces with love!' },
    'nancy.wong@email.com': { name: 'Nancy W.', joinDate: '2023-02-20', bio: 'Home baker and cooking enthusiast. Spreading joy through delicious food!' },
    'alan.tan@email.com': { name: 'Alan T.', joinDate: '2023-04-08', bio: 'Physical therapist and health advocate. Helping people move better and feel great!' },
    'priya.singh@email.com': { name: 'Priya S.', joinDate: '2023-03-12', bio: 'Music lover and event organizer. Bringing people together through great experiences!' }
  };

  // Decode the email parameter in case it's URL encoded
  const decodedEmail = email ? decodeURIComponent(email) : null;
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadUserFromFirebase = async (email: string) => {
    try {
      // Try to find user in Firebase users collection by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        return {
          name: userData.displayName || 'User',
          joinDate: userData.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : 'Recently',
          bio: userData.bio || 'ShareLah community member'
        };
      }
      
      // If not found in users collection, create a fallback profile
      return {
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        joinDate: 'Recently',
        bio: 'ShareLah community member'
      };
    } catch (error) {
      console.error('Error loading user from Firebase:', error);
      // Return fallback profile
      return {
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        joinDate: 'Recently',
        bio: 'ShareLah community member'
      };
    }
  };

  // Single useEffect to load data when email changes
  useEffect(() => {
    const loadUserData = async () => {
      if (!decodedEmail) return;
      
      try {
        setLoading(true);
        
        // Reset all data first to prevent accumulation
        setUserListings([]);
        setUserReviews([]);
        setCurrentUser(null);
        setUserStats({
          totalListings: 0,
          averageRating: 0,
          totalReviews: 0,
          joinDate: 'Recently'
        });
        
        // First try to find user in mock data
        let user = mockUsers[decodedEmail];
        
        // If not found in mock data, try to load from Firebase
        if (!user) {
          user = await loadUserFromFirebase(decodedEmail);
        }
        
        setCurrentUser(user);
        
        // Load user's listings from Firebase
        const firebaseListings = await listingsService.getUserListings(decodedEmail);
        
        // Also get mock listings for this user (from context)
        const mockListings = listings.filter(listing => 
          listing.ownerContact === decodedEmail
        );
        
        // Combine and deduplicate listings
        const allListings = [...firebaseListings, ...mockListings];
        const uniqueListings = allListings.filter((listing, index, self) => 
          index === self.findIndex(l => l.id === listing.id)
        );
        
        setUserListings(uniqueListings);
        
        // Load reviews for user's listings
        const allReviews: UserReview[] = [];
        for (const listing of uniqueListings) {
          try {
            const listingId = listing.id?.toString() || '';
            const listingReviews = await reviewsService.getListingReviews(listingId);
            
            for (const review of listingReviews) {
              allReviews.push({
                id: review.id || '',
                listingName: listing.name,
                rating: review.rating,
                comment: review.comment,
                reviewerName: review.reviewerName,
                createdAt: review.createdAt
              });
            }
          } catch (error) {
            console.error(`Error loading reviews for listing ${listing.id}:`, error);
          }
        }
        
        // Deduplicate reviews by id
        const uniqueReviews = allReviews.filter((review, index, self) => 
          index === self.findIndex(r => r.id === review.id)
        );
        
        setUserReviews(uniqueReviews);
        
        // Calculate user stats
        const totalReviews = uniqueReviews.length;
        const averageRating = totalReviews > 0 
          ? uniqueReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
          : 0;
        
        setUserStats({
          totalListings: uniqueListings.length,
          averageRating,
          totalReviews,
          joinDate: user?.joinDate || 'Recently'
        });
        
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [decodedEmail]); // Only depend on decodedEmail

  const handleListingClick = (listing: any) => {
    navigate(`/listing/${listing.id}`);
  };

  const renderToolImage = (imageStr: string, size: 'small' | 'medium' = 'small') => {
    const sizeClasses = size === 'medium' ? "w-20 h-20" : "w-16 h-16";

    if (imageStr && imageStr.startsWith('data:image/')) {
      return (
        <img
          src={imageStr}
          alt="Tool"
          className={`${sizeClasses} object-cover rounded-xl shadow-md`}
        />
      );
    }
    
    return (
      <div className={`${sizeClasses} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-md ${
        size === 'medium' ? 'text-4xl' : 'text-3xl'
      }`}>
        {imageStr}
      </div>
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Show loading while fetching user data
  if (loading && !currentUser) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
      }`}>
        <LiquidGlassNav />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
          <div className={`p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <div className="animate-pulse">
              <div className="flex items-center space-x-8 mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if user not found after loading
  if (!loading && !currentUser) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
      }`}>
        <LiquidGlassNav />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The user profile you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/browse')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <LiquidGlassNav />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-xl transition-colors ${
            theme === 'dark'
              ? ' text-gray-300'
              : 'bg-white/80 hover:bg-white/90 text-gray-700'
          }`}
        >
          <ArrowLeft className="w-8 h-8" />
          <span></span>
        </button>

        {/* Profile Header */}
        <div className={`p-8 rounded-2xl mb-8 ${
          theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {currentUser.name.charAt(0)}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{currentUser.name}</h1>
              <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentUser.bio}
              </p>
              
              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">{userStats.totalListings}</span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    listing{userStats.totalListings !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">
                    {userStats.averageRating > 0 ? userStats.averageRating.toFixed(1) : 'N/A'}
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    ({userStats.totalReviews} review{userStats.totalReviews !== 1 ? 's' : ''})
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Joined {userStats.joinDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`rounded-2xl p-1 mb-8 ${
          theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === 'listings'
                  ? 'bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-lg transform scale-[1.02]'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700/50'
                  : 'text-gray-700 hover:bg-gray-100/80'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Listings ({userStats.totalListings})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-lg transform scale-[1.02]'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700/50'
                  : 'text-gray-700 hover:bg-gray-100/80'
              }`}
            >
              <Star className="w-5 h-5" />
              <span>Reviews ({userStats.totalReviews})</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className={`p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'listings' ? (
          <div className="space-y-6">
            {userListings.length > 0 ? (
              userListings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => handleListingClick(listing)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 hover:bg-gray-800/80'
                      : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    {/* Tool Image */}
                    <div className="flex-shrink-0">
                      {renderToolImage(listing.image || listing.imageUrls?.[0] || '🔧', 'medium')}
                    </div>

                    {/* Listing Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{listing.name}</h3>
                      <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {listing.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-purple-500">
                            ${listing.price.toFixed(2)}
                          </span>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            /{listing.period}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {listing.location}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">
                            {listing.rating || 0} ({listing.reviews || 0})
                          </span>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-green-900/30 text-green-300'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {listing.availability || 'Available'}
                        </span>
                      </div>
                    </div>

                    {/* View Icon */}
                    <div className="flex-shrink-0">
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`p-12 rounded-2xl text-center ${
                theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No Listings Yet</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {currentUser.name} hasn't listed any tools yet.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <div
                  key={review.id}
                  className={`p-6 rounded-2xl ${
                    theme === 'dark'
                      ? 'bg-gray-800/60'
                      : 'bg-white/80 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{review.listingName}</h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Review by {review.reviewerName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{review.rating}/5</span>
                    </div>
                  </div>
                  
                  <p className={`mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {review.comment}
                  </p>
                  
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <div className={`p-12 rounded-2xl text-center ${
                theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No Reviews Yet</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {currentUser.name} hasn't received any reviews yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
