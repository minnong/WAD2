import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useListings } from '../contexts/ListingsContext';
import { useRentals } from '../contexts/RentalsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import LiquidGlassNav from './LiquidGlassNav';
import ReviewsSection from './ReviewsSection';
import { listingsService } from '../services/firebase';
import { ArrowLeft, Star, MapPin, Clock, MessageSquare, X, Heart, CheckCircle } from 'lucide-react';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { listings } = useListings();
  const { addRentalRequest } = useRentals();
  const { isFavorited, toggleFavorite } = useFavorites();

  // Helper function to get full condition description
  const getConditionLabel = (condition: string) => {
    const conditionMap: { [key: string]: string } = {
      'excellent': 'Excellent - Like new',
      'good': 'Good - Minor wear',
      'fair': 'Fair - Some wear but functional',
      'poor': 'Poor - Heavy wear but working'
    };
    return conditionMap[condition] || condition;
  };

  // Helper function to format price - show decimals only if needed
  const formatPrice = (price: number) => {
    return price % 1 === 0 ? price.toString() : price.toFixed(2);
  };

  const [showRentModal, setShowRentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [rentRequest, setRentRequest] = useState({
    startDateTime: '',
    endDateTime: '',
    message: ''
  });
  const [listingData, setListingData] = useState<any>(null);

  // Helper function to render tool image (emoji or base64)
  const renderToolImage = (imageStr: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClasses = size === 'small'
      ? "w-8 h-8 text-2xl"
      : size === 'large'
      ? "w-16 h-16 text-5xl"
      : "w-12 h-12 text-3xl";

    // Check if image is a base64 data URL
    if (imageStr && imageStr.startsWith('data:image/')) {
      return (
        <img
          src={imageStr}
          alt="Tool"
          className={`${sizeClasses} object-cover rounded-lg`}
        />
      );
    }
    // Otherwise, treat as emoji
    return (
      <div className={`${sizeClasses} flex items-center justify-center`}>
        {imageStr}
      </div>
    );
  };

  // Mock tools data (same as BrowsePage)
  const mockTools = [
    {
      id: 1,
      name: 'Drill Press',
      description: 'Professional grade drill press perfect for precision drilling. Features adjustable speed settings and depth control. Ideal for woodworking and metalworking projects.',
      price: 25,
      period: 'day',
      location: 'Orchard, Singapore',
      coordinates: { lat: 1.3048, lng: 103.8318 },
      rating: 4.8,
      reviews: 24,
      image: '🔨',
      category: 'Power Tools',
      owner: 'John D.',
      ownerContact: 'john.doe@email.com',
      condition: 'excellent',
      availability: 'Available weekdays and weekends'
    },
    {
      id: 2,
      name: 'Lawn Mower',
      description: 'Gas-powered lawn mower with 21-inch cutting deck. Self-propelled with variable speed control. Perfect for medium to large lawns.',
      price: 40,
      period: 'day',
      location: 'Tampines, Singapore',
      coordinates: { lat: 1.3526, lng: 103.9449 },
      rating: 4.9,
      reviews: 18,
      image: '🌱',
      category: 'Garden Tools',
      owner: 'Sarah L.',
      ownerContact: 'sarah.lim@email.com',
      condition: 'good',
      availability: 'Weekends only'
    },
    {
      id: 3,
      name: 'Professional Camera',
      description: 'High-end DSLR camera with multiple lenses. Perfect for professional photography, events, and creative projects.',
      price: 60,
      period: 'day',
      location: 'Jurong, Singapore',
      coordinates: { lat: 1.3329, lng: 103.7436 },
      rating: 5.0,
      reviews: 31,
      image: '📷',
      category: 'Electronics',
      owner: 'Mike R.',
      ownerContact: 'mike.roberts@email.com',
      condition: 'excellent',
      availability: 'Available daily'
    },
    {
      id: 4,
      name: 'Stand Mixer',
      description: 'KitchenAid stand mixer with multiple attachments. Perfect for baking, mixing, and food preparation.',
      price: 15,
      period: 'day',
      location: 'Woodlands, Singapore',
      coordinates: { lat: 1.4382, lng: 103.7890 },
      rating: 4.7,
      reviews: 12,
      image: '🍳',
      category: 'Kitchen Appliances',
      owner: 'Lisa M.',
      ownerContact: 'lisa.martin@email.com',
      condition: 'good',
      availability: 'Weekends preferred'
    },
    {
      id: 5,
      name: 'Tennis Racket Set',
      description: 'Professional tennis racket set with 2 rackets and balls. Great for recreational and competitive play.',
      price: 20,
      period: 'day',
      location: 'Clementi, Singapore',
      coordinates: { lat: 1.3162, lng: 103.7649 },
      rating: 4.6,
      reviews: 8,
      image: '🎾',
      category: 'Sports Equipment',
      owner: 'David K.',
      ownerContact: 'david.kim@email.com',
      condition: 'good',
      availability: 'Available weekdays'
    },
    {
      id: 6,
      name: 'Paint Sprayer',
      description: 'Electric paint sprayer for interior and exterior painting. Includes multiple nozzles and paint cups.',
      price: 35,
      period: 'day',
      location: 'Bishan, Singapore',
      coordinates: { lat: 1.3519, lng: 103.8486 },
      rating: 4.8,
      reviews: 15,
      image: '🎨',
      category: 'Home & DIY',
      owner: 'Emma T.',
      ownerContact: 'emma.tan@email.com',
      condition: 'excellent',
      availability: 'Available weekends'
    },
    {
      id: 7,
      name: 'Angle Grinder',
      description: 'Heavy-duty angle grinder for cutting and grinding metal, concrete, and masonry.',
      price: 30,
      period: 'day',
      location: 'Toa Payoh, Singapore',
      coordinates: { lat: 1.3344, lng: 103.8563 },
      rating: 4.5,
      reviews: 19,
      image: '⚙️',
      category: 'Power Tools',
      owner: 'Peter W.',
      ownerContact: 'peter.wong@email.com',
      condition: 'good',
      availability: 'Available daily'
    },
    {
      id: 8,
      name: 'Gaming Laptop',
      description: 'High-performance gaming laptop with RTX graphics. Perfect for gaming, streaming, and creative work.',
      price: 45,
      period: 'day',
      location: 'Ang Mo Kio, Singapore',
      coordinates: { lat: 1.3691, lng: 103.8454 },
      rating: 4.9,
      reviews: 27,
      image: '💻',
      category: 'Electronics',
      owner: 'Alex C.',
      ownerContact: 'alex.chen@email.com',
      condition: 'excellent',
      availability: 'Available daily'
    },
    {
      id: 9,
      name: 'Garden Hedge Trimmer',
      description: 'Electric hedge trimmer for maintaining garden hedges and shrubs. Lightweight and easy to use.',
      price: 25,
      period: 'day',
      location: 'Bukit Timah, Singapore',
      coordinates: { lat: 1.3294, lng: 103.8077 },
      rating: 4.7,
      reviews: 14,
      image: '✂️',
      category: 'Garden Tools',
      owner: 'Mary L.',
      ownerContact: 'mary.lau@email.com',
      condition: 'good',
      availability: 'Weekends only'
    },
    {
      id: 10,
      name: 'Espresso Machine',
      description: 'Professional espresso machine with milk frother. Perfect for coffee enthusiasts and events.',
      price: 20,
      period: 'day',
      location: 'Marina Bay, Singapore',
      coordinates: { lat: 1.2845, lng: 103.8607 },
      rating: 4.8,
      reviews: 22,
      image: '☕',
      category: 'Kitchen Appliances',
      owner: 'James T.',
      ownerContact: 'james.tan@email.com',
      condition: 'excellent',
      availability: 'Available daily'
    },
    {
      id: 11,
      name: 'Mountain Bike',
      description: 'High-quality mountain bike suitable for trails and city riding. Includes helmet and safety gear.',
      price: 35,
      period: 'day',
      location: 'East Coast, Singapore',
      coordinates: { lat: 1.3058, lng: 103.9129 },
      rating: 4.6,
      reviews: 16,
      image: '🚴',
      category: 'Sports Equipment',
      owner: 'Rachel K.',
      ownerContact: 'rachel.koh@email.com',
      condition: 'good',
      availability: 'Available weekends'
    },
    {
      id: 12,
      name: 'Projector',
      description: 'Full HD projector perfect for presentations, movies, and events. Includes cables and screen.',
      price: 40,
      period: 'day',
      location: 'Hougang, Singapore',
      coordinates: { lat: 1.3613, lng: 103.8860 },
      rating: 4.9,
      reviews: 33,
      image: '📽️',
      category: 'Electronics',
      owner: 'Daniel S.',
      ownerContact: 'daniel.sim@email.com',
      condition: 'excellent',
      availability: 'Available daily'
    },
    {
      id: 13,
      name: 'Circular Saw',
      description: 'Professional circular saw for precise wood cutting. Safety features and dust collection included.',
      price: 28,
      period: 'day',
      location: 'Serangoon, Singapore',
      coordinates: { lat: 1.3553, lng: 103.8677 },
      rating: 4.7,
      reviews: 21,
      image: '🪚',
      category: 'Power Tools',
      owner: 'Kevin L.',
      ownerContact: 'kevin.lee@email.com',
      condition: 'good',
      availability: 'Weekdays preferred'
    },
    {
      id: 14,
      name: 'Air Fryer',
      description: 'Large capacity air fryer perfect for healthy cooking. Digital controls and multiple presets.',
      price: 18,
      period: 'day',
      location: 'Punggol, Singapore',
      coordinates: { lat: 1.4043, lng: 103.9021 },
      rating: 4.5,
      reviews: 11,
      image: '🍟',
      category: 'Kitchen Appliances',
      owner: 'Sophie N.',
      ownerContact: 'sophie.ng@email.com',
      condition: 'excellent',
      availability: 'Available daily'
    },
    {
      id: 15,
      name: 'Guitar',
      description: 'Acoustic guitar perfect for learning or performing. Includes picks, strap, and carrying case.',
      price: 22,
      period: 'day',
      location: 'Novena, Singapore',
      coordinates: { lat: 1.3208, lng: 103.8434 },
      rating: 4.8,
      reviews: 17,
      image: '🎸',
      category: 'Musical Instruments',
      owner: 'Ryan O.',
      ownerContact: 'ryan.ong@email.com',
      condition: 'excellent',
      availability: 'Available weekends'
    },
    {
      id: 16,
      name: 'Yoga Mat Set',
      description: 'Premium yoga mat set with blocks, straps, and carrying bag. Perfect for home practice.',
      price: 12,
      period: 'day',
      location: 'Bedok, Singapore',
      coordinates: { lat: 1.3244, lng: 103.9273 },
      rating: 4.4,
      reviews: 9,
      image: '🧘',
      category: 'Health & Fitness',
      owner: 'Linda W.',
      ownerContact: 'linda.wu@email.com',
      condition: 'good',
      availability: 'Available daily'
    },
    {
      id: 17,
      name: 'Power Washer',
      description: 'High-pressure washer for cleaning driveways, cars, and outdoor surfaces. Multiple nozzles included.',
      price: 32,
      period: 'day',
      location: 'Yishun, Singapore',
      coordinates: { lat: 1.4304, lng: 103.8354 },
      rating: 4.9,
      reviews: 25,
      image: '🚿',
      category: 'Home & DIY',
      owner: 'Marcus H.',
      ownerContact: 'marcus.ho@email.com',
      condition: 'excellent',
      availability: 'Available weekends'
    },
    {
      id: 18,
      name: 'DSLR Camera Kit',
      description: 'Complete DSLR camera kit with multiple lenses, tripod, and lighting equipment. Professional quality.',
      price: 55,
      period: 'day',
      location: 'Chinatown, Singapore',
      coordinates: { lat: 1.2833, lng: 103.8435 },
      rating: 5.0,
      reviews: 28,
      image: '📸',
      category: 'Photography',
      owner: 'Grace L.',
      ownerContact: 'grace.lim@email.com',
      condition: 'excellent',
      availability: 'Available daily'
    },
    {
      id: 19,
      name: 'Electric Scooter',
      description: 'Foldable electric scooter with long battery life. Perfect for short commutes and recreation.',
      price: 30,
      period: 'day',
      location: 'Kallang, Singapore',
      coordinates: { lat: 1.3116, lng: 103.8636 },
      rating: 4.6,
      reviews: 14,
      image: '🛴',
      category: 'Sports Equipment',
      owner: 'Tommy L.',
      ownerContact: 'tommy.lim@email.com',
      condition: 'good',
      availability: 'Available daily'
    },
    {
      id: 20,
      name: 'Karaoke Machine',
      description: 'Portable karaoke machine with wireless microphones and LED lights. Great for parties.',
      price: 25,
      period: 'day',
      location: 'Buona Vista, Singapore',
      coordinates: { lat: 1.3067, lng: 103.7903 },
      rating: 4.7,
      reviews: 19,
      image: '🎤',
      category: 'Electronics',
      owner: 'Jenny C.',
      ownerContact: 'jenny.choo@email.com',
      condition: 'excellent',
      availability: 'Available weekends'
    },
    {
      id: 21,
      name: 'Sewing Machine',
      description: 'Computerized sewing machine with multiple stitches and automatic features. Perfect for crafting.',
      price: 15,
      period: 'day',
      location: 'Tiong Bahru, Singapore',
      coordinates: { lat: 1.2866, lng: 103.8317 },
      rating: 4.8,
      reviews: 12,
      image: '🧵',
      category: 'Art & Craft',
      owner: 'Violet K.',
      ownerContact: 'violet.koh@email.com',
      condition: 'excellent',
      availability: 'Available daily'
    },
    {
      id: 22,
      name: 'Pressure Cooker',
      description: 'Large capacity pressure cooker for fast cooking. Multiple safety features and cooking presets.',
      price: 12,
      period: 'day',
      location: 'Redhill, Singapore',
      coordinates: { lat: 1.2896, lng: 103.8167 },
      rating: 4.5,
      reviews: 8,
      image: '🍲',
      category: 'Kitchen Appliances',
      owner: 'Nancy W.',
      ownerContact: 'nancy.wong@email.com',
      condition: 'good',
      availability: 'Weekends only'
    },
    {
      id: 23,
      name: 'Electric Wheelchair',
      description: 'Comfortable electric wheelchair with adjustable seat and long battery life. Easy to operate.',
      price: 20,
      period: 'day',
      location: 'Geylang, Singapore',
      coordinates: { lat: 1.3147, lng: 103.8831 },
      rating: 4.9,
      reviews: 15,
      image: '♿',
      category: 'Health & Fitness',
      owner: 'Alan T.',
      ownerContact: 'alan.tan@email.com',
      condition: 'excellent',
      availability: 'Available daily'
    },
    {
      id: 24,
      name: 'Bluetooth Speaker',
      description: 'Portable bluetooth speaker with excellent sound quality. Waterproof and long battery life.',
      price: 10,
      period: 'day',
      location: 'Little India, Singapore',
      coordinates: { lat: 1.3067, lng: 103.8518 },
      rating: 4.4,
      reviews: 22,
      image: '🔊',
      category: 'Electronics',
      owner: 'Priya S.',
      ownerContact: 'priya.singh@email.com',
      condition: 'good',
      availability: 'Available daily'
    }
  ];

  // Combine mock tools with user listings
  const allTools = [...mockTools, ...listings];
  // Handle both string and number IDs
  const tool = allTools.find(t =>
    t.id === id || t.id === parseInt(id || '0') || String(t.id) === id
  );

  console.log('ListingDetailPage - ID:', id);
  console.log('ListingDetailPage - All tools:', allTools.map(t => ({ id: t.id, name: t.name })));
  console.log('ListingDetailPage - Found tool:', tool);

  const loadListingData = async () => {
    if (!id) return;

    try {
      // Try to load from Firebase first (for actual listings)
      const firebaseListing = await listingsService.getListingById(id);
      if (firebaseListing) {
        setListingData(firebaseListing);
      }
    } catch (error) {
      console.error('Error loading listing data:', error);
    }
  };

  useEffect(() => {
    loadListingData();
  }, [id]);

  useEffect(() => {
    if (!tool) {
      navigate('/browse');
    }
  }, [tool, navigate]);

  const handleReviewAdded = () => {
    loadListingData(); // Refresh listing data when a review is added
  };

  if (!tool) {
    return null;
  }

  const handleRentClick = () => {
    setShowRentModal(true);
    // Set default dates (today to tomorrow)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format for datetime-local input: YYYY-MM-DDTHH:MM
    const startDateTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T09:00`;
    const endDateTime = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}T17:00`;

    setRentRequest({
      ...rentRequest,
      startDateTime: startDateTime,
      endDateTime: endDateTime
    });
  };

  const handleRentRequestSubmit = () => {
    if (!currentUser) return;

    // Parse datetime strings
    const startDateTime = new Date(rentRequest.startDateTime);
    const endDateTime = new Date(rentRequest.endDateTime);

    // Calculate total cost based on duration and pricing period
    const millisecondsDiff = endDateTime.getTime() - startDateTime.getTime();

    let totalCost: number;
    if (tool.period.toLowerCase() === 'day') {
      // For daily pricing, calculate number of days (minimum 1 day)
      const days = Math.max(1, Math.ceil(millisecondsDiff / (1000 * 60 * 60 * 24)));
      totalCost = days * tool.price;
    } else {
      // For hourly pricing, calculate number of hours
      const hours = Math.ceil(millisecondsDiff / (1000 * 60 * 60));
      totalCost = hours * tool.price;
    }

    // Ensure 2 decimal places
    totalCost = Math.round(totalCost * 100) / 100;

    // Extract date and time components for compatibility with existing system
    const startDate = startDateTime.toISOString().split('T')[0];
    const endDate = endDateTime.toISOString().split('T')[0];
    const startTime = startDateTime.toTimeString().slice(0, 5);
    const endTime = endDateTime.toTimeString().slice(0, 5);

    // Create rental request and add to context
    const rentalRequestData = {
      toolId: String(tool.id),
      toolName: tool.name,
      toolImage: tool.image,
      renterName: currentUser.displayName || 'Anonymous',
      renterEmail: currentUser.email || '',
      ownerEmail: (tool as any).ownerContact || (tool as any).ownerEmail || tool.ownerContact,
      ownerName: tool.owner,
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      message: rentRequest.message,
      totalCost: totalCost,
      status: 'pending' as const,
      location: tool.location
    };

    addRentalRequest(rentalRequestData);

    console.log('Rental request sent:', rentalRequestData);

    // Store success data for the modal
    setSuccessData({
      tool,
      startDateTime: startDateTime.toLocaleDateString(),
      startTime,
      endDateTime: endDateTime.toLocaleDateString(),
      endTime,
      totalCost
    });

    // Close rent modal and show success modal
    setShowRentModal(false);
    setShowSuccessModal(true);
    setRentRequest({
      startDateTime: '',
      endDateTime: '',
      message: ''
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <LiquidGlassNav />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className={`aspect-square rounded-2xl overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              {(tool as any).imageUrls && (tool as any).imageUrls.length > 0 ? (
                <img
                  src={(tool as any).imageUrls[0]}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              ) : (tool as any).imageUrl ? (
                <img
                  src={(tool as any).imageUrl}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-8xl">{tool.image}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Owner Info */}
            <button
              onClick={() => navigate(`/profile/${encodeURIComponent(tool.ownerContact)}`)}
              className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-left ${
                theme === 'dark' 
                  ? 'bg-gray-800/60 hover:bg-gray-800/80' 
                  : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-300 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                  {tool.owner.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{tool.owner}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">
                      {listingData?.rating ? `${listingData.rating.toFixed(1)} (${listingData.reviews} reviews)` : `${tool.rating} (${tool.reviews} reviews)`}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Click to view profile
                  </p>
                </div>
              </div>
            </button>

            {/* Tool Details */}
            <div className={`p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{tool.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="bg-gray-100 dark:bg-gray-700 text-white px-2 py-1 rounded">{tool.category}</span>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {getConditionLabel(tool.condition)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(String(tool.id))}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorited(String(tool.id))
                      ? 'bg-pink-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={isFavorited(String(tool.id)) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-5 h-5 ${isFavorited(String(tool.id)) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center space-x-1 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">
                  {listingData?.rating ? listingData.rating.toFixed(1) : tool.rating}
                </span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({listingData?.reviews ?? tool.reviews} reviews)
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{tool.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>{tool.availability || 'Contact owner for availability'}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200/20">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-10`}>
                    {tool.description || 'No description provided for this item.'}
                  </p>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-purple-300">${formatPrice(tool.price)}</span>
                    <span className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      /{tool.period}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleRentClick}
                    className="flex-1 bg-purple-900 hover:bg-purple-950 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
                  >
                    Rent Now
                  </button>
                  <button className={`px-6 py-3 rounded-xl border transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewsSection
            listingId={tool.id?.toString() || ''}
            listingName={tool.name}
            ownerEmail={tool.ownerContact}
            onReviewAdded={handleReviewAdded}
          />
        </div>
      </div>

      {/* Rent Request Modal */}
      {showRentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border-0 shadow-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/20">
              <h3 className="text-lg font-semibold">Request to Rent</h3>
              <button
                onClick={() => setShowRentModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Tool Info */}
              <div className="flex items-center space-x-4">
                {renderToolImage(tool.image, 'medium')}
                <div>
                  <h4 className="font-semibold">{tool.name}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    by {tool.owner} • {tool.location}
                  </p>
                  <p className="text-lg font-bold text-purple-300">
                    ${formatPrice(tool.price)}/{tool.period}
                  </p>
                </div>
              </div>

              {/* DateTime Selection */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={rentRequest.startDateTime}
                    onChange={(e) => setRentRequest({...rentRequest, startDateTime: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={rentRequest.endDateTime}
                    onChange={(e) => setRentRequest({...rentRequest, endDateTime: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">Message to Owner (Optional)</label>
                <textarea
                  value={rentRequest.message}
                  onChange={(e) => setRentRequest({...rentRequest, message: e.target.value})}
                  placeholder="Let the owner know about your rental needs..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border resize-none ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Cost Calculation */}
              {rentRequest.startDateTime && rentRequest.endDateTime && (() => {
                const startDateTime = new Date(rentRequest.startDateTime);
                const endDateTime = new Date(rentRequest.endDateTime);
                const millisecondsDiff = endDateTime.getTime() - startDateTime.getTime();

                let quantity: number;
                let unitName: string;
                let totalCost: number;

                if (tool.period.toLowerCase() === 'day') {
                  quantity = Math.max(1, Math.ceil(millisecondsDiff / (1000 * 60 * 60 * 24)));
                  unitName = quantity === 1 ? 'day' : 'days';
                  totalCost = quantity * tool.price;
                } else {
                  quantity = Math.ceil(millisecondsDiff / (1000 * 60 * 60));
                  unitName = quantity === 1 ? 'hour' : 'hours';
                  totalCost = quantity * tool.price;
                }

                // Ensure 2 decimal places
                totalCost = Math.round(totalCost * 100) / 100;

                return (
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Cost:</span>
                      <span className="font-bold text-lg text-purple-300">
                        ${formatPrice(totalCost)}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {quantity} {unitName} × ${formatPrice(tool.price)}/{tool.period}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-3 p-6 border-t border-gray-200/20">
              <button
                onClick={() => setShowRentModal(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleRentRequestSubmit}
                disabled={!rentRequest.startDateTime || !rentRequest.endDateTime}
                className="flex-1 py-2 px-4 bg-purple-900 hover:bg-purple-950 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border-0 shadow-2xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Request Sent Successfully!</h3>
              <p className="text-green-100">Your rental request has been sent to {successData.tool.owner}</p>
            </div>

            {/* Request Details */}
            <div className="p-6 space-y-4">
              {/* Tool Info */}
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                {renderToolImage(successData.tool.image, 'medium')}
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-purple-800 dark:text-purple-200">{successData.tool.name}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    by {successData.tool.owner} • {successData.tool.location}
                  </p>
                </div>
              </div>

              {/* Request Summary */}
              <div className={`p-4 rounded-xl border-2 border-dashed ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'
              }`}>
                <h5 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Request Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Start:</span>
                    <span className="font-medium">{successData.startDateTime} {successData.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">End:</span>
                    <span className="font-medium">{successData.endDateTime} {successData.endTime}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Total Cost:</span>
                    <span className="font-bold text-xl text-green-600 dark:text-green-400">${formatPrice(successData.totalCost)}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'
              }`}>
                <h5 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">What happens next?</h5>
                <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                  <li>• The owner will be notified via email</li>
                  <li>• They can approve or decline your request</li>
                  <li>• Track this request in "My Rentals"</li>
                  <li>• You'll receive updates about the status</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200/20">
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/my-rentals')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  View My Rentals
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}