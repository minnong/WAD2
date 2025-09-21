import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useListings } from '../contexts/ListingsContext';
import { useRentals } from '../contexts/RentalsContext';
import LiquidGlassNav from './LiquidGlassNav';
import ReviewsSection from './ReviewsSection';
import { listingsService } from '../services/firebase';
import { ArrowLeft, Star, MapPin, Clock, MessageSquare, X, Heart } from 'lucide-react';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { listings } = useListings();
  const { addRentalRequest } = useRentals();

  const [showRentModal, setShowRentModal] = useState(false);
  const [rentRequest, setRentRequest] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    message: ''
  });
  const [isFavorited, setIsFavorited] = useState(false);
  const [listingData, setListingData] = useState<any>(null);

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
  const tool = allTools.find(t => t.id === parseInt(id || '0'));

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

    setRentRequest({
      ...rentRequest,
      startDate: today.toISOString().split('T')[0],
      endDate: tomorrow.toISOString().split('T')[0]
    });
  };

  const handleRentRequestSubmit = () => {
    if (!currentUser) return;

    // Calculate total cost
    const startDate = new Date(rentRequest.startDate);
    const endDate = new Date(rentRequest.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalCost = days * tool.price;

    // Create rental request and add to context
    const rentalRequestData = {
      toolId: tool.id,
      toolName: tool.name,
      toolImage: tool.image,
      renterName: currentUser.displayName || 'Anonymous',
      renterEmail: currentUser.email || '',
      ownerEmail: tool.ownerContact,
      ownerName: tool.owner,
      startDate: rentRequest.startDate,
      endDate: rentRequest.endDate,
      startTime: rentRequest.startTime,
      endTime: rentRequest.endTime,
      message: rentRequest.message,
      totalCost: totalCost,
      status: 'pending' as const,
      location: tool.location
    };

    addRentalRequest(rentalRequestData);

    console.log('Rental request sent:', rentalRequestData);

    alert(`Rental request sent to ${tool.owner}!\n\nRequest Details:\n• Tool: ${tool.name}\n• Dates: ${rentRequest.startDate} to ${rentRequest.endDate}\n• Time: ${rentRequest.startTime} - ${rentRequest.endTime}\n• Total Cost: $${totalCost}\n\nThe owner will be notified via email and can approve or decline your request.\n\nYou can track this request in "My Rentals".`);

    // Close modal and reset
    setShowRentModal(false);
    setRentRequest({
      startDate: '',
      endDate: '',
      startTime: '09:00',
      endTime: '17:00',
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
              {(tool as any).imageUrl ? (
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
            <div className={`p-4 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {tool.owner.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{tool.owner}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">
                      {listingData?.rating ? `${listingData.rating.toFixed(1)} (${listingData.reviews} reviews)` : `${tool.rating} (${tool.reviews} reviews)`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool Details */}
            <div className={`p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{tool.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{tool.category}</span>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {tool.condition}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorited
                      ? 'bg-red-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
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
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-blue-500">${tool.price}</span>
                    <span className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      /{tool.period}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleRentClick}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
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

            {/* Description */}
            <div className={`p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {tool.description || 'No description provided for this item.'}
              </p>
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
                <div className="text-3xl">{tool.image}</div>
                <div>
                  <h4 className="font-semibold">{tool.name}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    by {tool.owner} • {tool.location}
                  </p>
                  <p className="text-lg font-bold text-blue-500">
                    ${tool.price}/{tool.period}
                  </p>
                </div>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={rentRequest.startDate}
                    onChange={(e) => setRentRequest({...rentRequest, startDate: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={rentRequest.endDate}
                    onChange={(e) => setRentRequest({...rentRequest, endDate: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    value={rentRequest.startTime}
                    onChange={(e) => setRentRequest({...rentRequest, startTime: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    value={rentRequest.endTime}
                    onChange={(e) => setRentRequest({...rentRequest, endTime: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
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
              {rentRequest.startDate && rentRequest.endDate && (
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Cost:</span>
                    <span className="font-bold text-lg text-blue-500">
                      ${Math.ceil((new Date(rentRequest.endDate).getTime() - new Date(rentRequest.startDate).getTime()) / (1000 * 60 * 60 * 24)) * tool.price}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {Math.ceil((new Date(rentRequest.endDate).getTime() - new Date(rentRequest.startDate).getTime()) / (1000 * 60 * 60 * 24))} day(s) × ${tool.price}/{tool.period}
                  </p>
                </div>
              )}
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
                disabled={!rentRequest.startDate || !rentRequest.endDate}
                className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}