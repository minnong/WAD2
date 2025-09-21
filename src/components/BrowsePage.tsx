import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useListings } from '../contexts/ListingsContext';
import { useRentals } from '../contexts/RentalsContext';
import { loadGoogleMapsScript } from '../utils/googleMaps';
import LiquidGlassNav from './LiquidGlassNav';
import Footer from './Footer';
import { Search, Filter, Star, List, Map as MapIcon, X, TrendingUp, Award, ChevronRight, ChevronDown, CheckCircle2, Calendar, Clock, DollarSign, Eye } from 'lucide-react';

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: any;
    rentTool: (toolId: number) => void;
    viewListing: (toolId: number) => void;
  }
}

export default function BrowsePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { listings, loading: listingsLoading } = useListings();
  const { addRentalRequest } = useRentals();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showRentModal, setShowRentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [successData, setSuccessData] = useState<any>(null);
  const [rentRequest, setRentRequest] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    message: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortBy, setSortBy] = useState('relevance');
  const [distance, setDistance] = useState(50);
  const [navigating, setNavigating] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const discoverMapRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'Power Tools',
    'Garden Tools',
    'Electronics',
    'Kitchen Appliances',
    'Sports Equipment',
    'Home & DIY',
    'Photography',
    'Automotive',
    'Musical Instruments',
    'Health & Fitness',
    'Baby & Kids',
    'Books & Education',
    'Art & Craft',
    'Outdoor & Camping',
    'Party & Events',
    'Office Equipment',
    'Beauty & Personal Care',
    'Gaming',
    'Other'
  ];

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
      owner: 'John D.',
      ownerContact: 'john.doe@email.com'
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
      category: 'Garden Tools',
      owner: 'Sarah L.',
      ownerContact: 'sarah.lim@email.com'
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
      owner: 'Mike R.',
      ownerContact: 'mike.roberts@email.com'
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
      category: 'Kitchen Appliances',
      owner: 'Lisa M.',
      ownerContact: 'lisa.martin@email.com'
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
      category: 'Sports Equipment',
      owner: 'David K.',
      ownerContact: 'david.kim@email.com'
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
      owner: 'Emma T.',
      ownerContact: 'emma.tan@email.com'
    },
    {
      id: 7,
      name: 'Angle Grinder',
      price: 30,
      period: 'day',
      location: 'Toa Payoh, Singapore',
      coordinates: { lat: 1.3344, lng: 103.8563 },
      rating: 4.5,
      reviews: 19,
      image: '⚙️',
      category: 'Power Tools',
      owner: 'Peter W.',
      ownerContact: 'peter.wong@email.com'
    },
    {
      id: 8,
      name: 'Gaming Laptop',
      price: 45,
      period: 'day',
      location: 'Ang Mo Kio, Singapore',
      coordinates: { lat: 1.3691, lng: 103.8454 },
      rating: 4.9,
      reviews: 27,
      image: '💻',
      category: 'Electronics',
      owner: 'Alex C.',
      ownerContact: 'alex.chen@email.com'
    },
    {
      id: 9,
      name: 'Garden Hedge Trimmer',
      price: 25,
      period: 'day',
      location: 'Bukit Timah, Singapore',
      coordinates: { lat: 1.3294, lng: 103.8077 },
      rating: 4.7,
      reviews: 14,
      image: '✂️',
      category: 'Garden Tools',
      owner: 'Mary L.',
      ownerContact: 'mary.lau@email.com'
    },
    {
      id: 10,
      name: 'Espresso Machine',
      price: 20,
      period: 'day',
      location: 'Marina Bay, Singapore',
      coordinates: { lat: 1.2845, lng: 103.8607 },
      rating: 4.8,
      reviews: 22,
      image: '☕',
      category: 'Kitchen Appliances',
      owner: 'James T.',
      ownerContact: 'james.tan@email.com'
    },
    {
      id: 11,
      name: 'Mountain Bike',
      price: 35,
      period: 'day',
      location: 'East Coast, Singapore',
      coordinates: { lat: 1.3058, lng: 103.9129 },
      rating: 4.6,
      reviews: 16,
      image: '🚴',
      category: 'Sports Equipment',
      owner: 'Rachel K.',
      ownerContact: 'rachel.koh@email.com'
    },
    {
      id: 12,
      name: 'Projector',
      price: 40,
      period: 'day',
      location: 'Hougang, Singapore',
      coordinates: { lat: 1.3613, lng: 103.8860 },
      rating: 4.9,
      reviews: 33,
      image: '📽️',
      category: 'Electronics',
      owner: 'Daniel S.',
      ownerContact: 'daniel.sim@email.com'
    },
    {
      id: 13,
      name: 'Circular Saw',
      price: 28,
      period: 'day',
      location: 'Serangoon, Singapore',
      coordinates: { lat: 1.3553, lng: 103.8677 },
      rating: 4.7,
      reviews: 21,
      image: '🪚',
      category: 'Power Tools',
      owner: 'Kevin L.',
      ownerContact: 'kevin.lee@email.com'
    },
    {
      id: 14,
      name: 'Air Fryer',
      price: 18,
      period: 'day',
      location: 'Punggol, Singapore',
      coordinates: { lat: 1.4043, lng: 103.9021 },
      rating: 4.5,
      reviews: 11,
      image: '🍟',
      category: 'Kitchen Appliances',
      owner: 'Sophie N.',
      ownerContact: 'sophie.ng@email.com'
    },
    {
      id: 15,
      name: 'Guitar',
      price: 22,
      period: 'day',
      location: 'Novena, Singapore',
      coordinates: { lat: 1.3208, lng: 103.8434 },
      rating: 4.8,
      reviews: 17,
      image: '🎸',
      category: 'Musical Instruments',
      owner: 'Ryan O.',
      ownerContact: 'ryan.ong@email.com'
    },
    {
      id: 16,
      name: 'Yoga Mat Set',
      price: 12,
      period: 'day',
      location: 'Bedok, Singapore',
      coordinates: { lat: 1.3244, lng: 103.9273 },
      rating: 4.4,
      reviews: 9,
      image: '🧘',
      category: 'Health & Fitness',
      owner: 'Linda W.',
      ownerContact: 'linda.wu@email.com'
    },
    {
      id: 17,
      name: 'Power Washer',
      price: 32,
      period: 'day',
      location: 'Yishun, Singapore',
      coordinates: { lat: 1.4304, lng: 103.8354 },
      rating: 4.9,
      reviews: 25,
      image: '🚿',
      category: 'Home & DIY',
      owner: 'Marcus H.',
      ownerContact: 'marcus.ho@email.com'
    },
    {
      id: 18,
      name: 'DSLR Camera Kit',
      price: 55,
      period: 'day',
      location: 'Chinatown, Singapore',
      coordinates: { lat: 1.2833, lng: 103.8435 },
      rating: 5.0,
      reviews: 28,
      image: '📸',
      category: 'Photography',
      owner: 'Grace L.',
      ownerContact: 'grace.lim@email.com'
    },
    // Additional tools for more variety
    {
      id: 19,
      name: 'Electric Scooter',
      price: 30,
      period: 'day',
      location: 'Kallang, Singapore',
      coordinates: { lat: 1.3116, lng: 103.8636 },
      rating: 4.6,
      reviews: 14,
      image: '🛴',
      category: 'Sports Equipment',
      owner: 'Tommy L.',
      ownerContact: 'tommy.lim@email.com'
    },
    {
      id: 20,
      name: 'Karaoke Machine',
      price: 25,
      period: 'day',
      location: 'Buona Vista, Singapore',
      coordinates: { lat: 1.3067, lng: 103.7903 },
      rating: 4.7,
      reviews: 19,
      image: '🎤',
      category: 'Electronics',
      owner: 'Jenny C.',
      ownerContact: 'jenny.choo@email.com'
    },
    {
      id: 21,
      name: 'Sewing Machine',
      price: 15,
      period: 'day',
      location: 'Tiong Bahru, Singapore',
      coordinates: { lat: 1.2866, lng: 103.8317 },
      rating: 4.8,
      reviews: 12,
      image: '🧵',
      category: 'Art & Craft',
      owner: 'Violet K.',
      ownerContact: 'violet.koh@email.com'
    },
    {
      id: 22,
      name: 'Pressure Cooker',
      price: 12,
      period: 'day',
      location: 'Redhill, Singapore',
      coordinates: { lat: 1.2896, lng: 103.8167 },
      rating: 4.5,
      reviews: 8,
      image: '🍲',
      category: 'Kitchen Appliances',
      owner: 'Nancy W.',
      ownerContact: 'nancy.wong@email.com'
    },
    {
      id: 23,
      name: 'Electric Wheelchair',
      price: 20,
      period: 'day',
      location: 'Geylang, Singapore',
      coordinates: { lat: 1.3147, lng: 103.8831 },
      rating: 4.9,
      reviews: 15,
      image: '♿',
      category: 'Health & Fitness',
      owner: 'Alan T.',
      ownerContact: 'alan.tan@email.com'
    },
    {
      id: 24,
      name: 'Bluetooth Speaker',
      price: 10,
      period: 'day',
      location: 'Little India, Singapore',
      coordinates: { lat: 1.3067, lng: 103.8518 },
      rating: 4.4,
      reviews: 22,
      image: '🔊',
      category: 'Electronics',
      owner: 'Priya S.',
      ownerContact: 'priya.singh@email.com'
    }
  ];

  // Combine mock tools with user listings
  const allTools = [...mockTools, ...listings];

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesPrice = tool.price >= priceRange.min && tool.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Get top rated tools (rating >= 4.7 and at least 15 reviews)
  const topRatedTools = allTools
    .filter(tool => tool.rating >= 4.7 && tool.reviews >= 15)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // Get trending tools (based on reviews and rating)
  const trendingTools = allTools
    .filter(tool => tool.reviews >= 10)
    .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
    .slice(0, 6);

  // Featured categories with tool counts
  const featuredCategories = [
    { name: 'Power Tools', emoji: '🔨', count: allTools.filter(t => t.category === 'Power Tools').length },
    { name: 'Electronics', emoji: '📱', count: allTools.filter(t => t.category === 'Electronics').length },
    { name: 'Garden Tools', emoji: '🌱', count: allTools.filter(t => t.category === 'Garden Tools').length },
    { name: 'Kitchen Appliances', emoji: '🍳', count: allTools.filter(t => t.category === 'Kitchen Appliances').length },
    { name: 'Sports Equipment', emoji: '🎾', count: allTools.filter(t => t.category === 'Sports Equipment').length },
    { name: 'Home & DIY', emoji: '🔧', count: allTools.filter(t => t.category === 'Home & DIY').length }
  ];

  const searchSuggestions = searchTerm.length > 0
    ? allTools
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

  // Initialize Discover Map
  useEffect(() => {
    const initializeDiscoverMap = async () => {
      if (discoverMapRef.current && userLocation && !searchSubmitted && !loading) {
        try {
          // Load Google Maps script if not already loaded
          await loadGoogleMapsScript();

          if (!window.google || !window.google.maps) {
            return;
          }
      const discoverMap = new window.google.maps.Map(discoverMapRef.current, {
        center: userLocation,
        zoom: 11,
        styles: [
          // Hide all POI markers (shopping malls, restaurants, etc.)
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.attraction',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.government',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.medical',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.park',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.place_of_worship',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.school',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.sports_complex',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit.station',
            stylers: [{ visibility: 'off' }]
          },
          // Dark theme styles when enabled
          ...(theme === 'dark' ? [
            { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
            { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
            { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
            { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
            { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
            { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
            { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
            { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
            { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
            { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] }
          ] : [])
        ]
      });

      // Add markers for all tools
      allTools.slice(0, 12).forEach((tool) => {
        const marker = new window.google.maps.Marker({
          position: tool.coordinates,
          map: discoverMap,
          title: tool.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 48 16 48S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="#3B82F6"/>
                <circle cx="16" cy="16" r="10" fill="white"/>
                <text x="16" y="20" text-anchor="middle" font-size="12" fill="#3B82F6">${tool.image}</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 48),
            anchor: new window.google.maps.Point(16, 48),
          }
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div
              onclick="window.viewListing(${tool.id})"
              style="
                padding: 12px;
                min-width: 200px;
                color: #333;
                cursor: pointer;
                border-radius: 12px;
                transition: all 0.2s;
              "
              onmouseover="this.style.background='#f8f9fa'; this.style.transform='scale(1.02)'"
              onmouseout="this.style.background='white'; this.style.transform='scale(1)'"
            >
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 24px; margin-right: 8px;">${tool.image}</span>
                <div>
                  <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${tool.name}</h3>
                  <p style="margin: 2px 0; font-size: 12px; color: #666;">by ${tool.owner}</p>
                </div>
              </div>
              <div style="margin-bottom: 8px;">
                <span style="font-size: 18px; font-weight: 700; color: #3B82F6;">$${tool.price}</span>
                <span style="font-size: 14px; color: #666;">/${tool.period}</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="color: #F59E0B; margin-right: 4px;">⭐</span>
                <span style="font-size: 14px; font-weight: 500;">${tool.rating}</span>
                <span style="font-size: 12px; color: #666; margin-left: 4px;">(${tool.reviews} reviews)</span>
              </div>
              <p style="margin: 4px 0; font-size: 12px; color: #666;">📍 ${tool.location}</p>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #999; text-align: center;">Click to view details</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(discoverMap, marker);
        });
      });

      // Add user location marker if available
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: userLocation,
          map: discoverMap,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 48 16 48S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="#DC2626"/>
                <circle cx="16" cy="16" r="8" fill="white"/>
                <circle cx="16" cy="16" r="4" fill="#DC2626"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 48),
            anchor: new window.google.maps.Point(16, 48),
          }
        });

        // Create simple info window for user location
        const userInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 16px; text-align: center; color: #333;">
              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                <div style="width: 8px; height: 8px; background: #DC2626; border-radius: 50%; margin-right: 8px;"></div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">You are here</h3>
              </div>
              <p style="margin: 0; font-size: 14px; color: #666;">Your current location</p>
            </div>
          `
        });

        userMarker.addListener('click', () => {
          userInfoWindow.open(discoverMap, userMarker);
        });
      }
        } catch (error) {
          console.error('Failed to load Google Maps for discover map:', error);
        }
      }
    };

    initializeDiscoverMap();
  }, [userLocation, theme, searchSubmitted, loading, allTools]);

  // Initialize Google Map
  useEffect(() => {
    const initializeMainMap = async () => {
      if (viewMode === 'map' && mapRef.current && userLocation) {
        try {
          // Load Google Maps script if not already loaded
          await loadGoogleMapsScript();

          if (!window.google || !window.google.maps) {
            return;
          }
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 12,
        styles: [
          // Hide all POI markers (shopping malls, restaurants, etc.)
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.attraction',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.government',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.medical',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.park',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.place_of_worship',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.school',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.sports_complex',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit.station',
            stylers: [{ visibility: 'off' }]
          },
          // Dark theme styles when enabled
          ...(theme === 'dark' ? [
            { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
            { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
            { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
            { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
            { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
            { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
            { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
            { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
            { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
            { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] }
          ] : [])
        ]
      });

      // Add markers for filtered tools
      filteredTools.forEach((tool) => {
        const marker = new window.google.maps.Marker({
          position: tool.coordinates,
          map: map,
          title: tool.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 48 16 48S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="#3B82F6"/>
                <circle cx="16" cy="16" r="10" fill="white"/>
                <text x="16" y="20" text-anchor="middle" font-size="12" fill="#3B82F6">${tool.image}</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 48),
            anchor: new window.google.maps.Point(16, 48),
          }
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div
              onclick="window.viewListing(${tool.id})"
              style="
                padding: 12px;
                min-width: 200px;
                color: #333;
                cursor: pointer;
                border-radius: 12px;
                transition: all 0.2s;
              "
              onmouseover="this.style.background='#f8f9fa'; this.style.transform='scale(1.02)'"
              onmouseout="this.style.background='white'; this.style.transform='scale(1)'"
            >
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 24px; margin-right: 8px;">${tool.image}</span>
                <div>
                  <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${tool.name}</h3>
                  <p style="margin: 2px 0; font-size: 12px; color: #666;">by ${tool.owner}</p>
                </div>
              </div>
              <div style="margin-bottom: 8px;">
                <span style="font-size: 18px; font-weight: 700; color: #3B82F6;">$${tool.price}</span>
                <span style="font-size: 14px; color: #666;">/${tool.period}</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="color: #F59E0B; margin-right: 4px;">⭐</span>
                <span style="font-size: 14px; font-weight: 500;">${tool.rating}</span>
                <span style="font-size: 12px; color: #666; margin-left: 4px;">(${tool.reviews} reviews)</span>
              </div>
              <p style="margin: 4px 0; font-size: 12px; color: #666;">📍 ${tool.location}</p>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #999; text-align: center;">Click to view details</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      // Add user location marker if available
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 48 16 48S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="#DC2626"/>
                <circle cx="16" cy="16" r="8" fill="white"/>
                <circle cx="16" cy="16" r="4" fill="#DC2626"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 48),
            anchor: new window.google.maps.Point(16, 48),
          }
        });

        // Create simple info window for user location
        const userInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 16px; text-align: center; color: #333;">
              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                <div style="width: 8px; height: 8px; background: #DC2626; border-radius: 50%; margin-right: 8px;"></div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">You are here</h3>
              </div>
              <p style="margin: 0; font-size: 14px; color: #666;">Your current location</p>
            </div>
          `
        });

        userMarker.addListener('click', () => {
          userInfoWindow.open(map, userMarker);
        });
      }
        } catch (error) {
          console.error('Failed to load Google Maps for main map:', error);
        }
      }
    };

    initializeMainMap();
  }, [viewMode, userLocation, filteredTools, theme]);

  // Global functions for map info windows
  useEffect(() => {
    window.rentTool = (toolId: number) => {
      const tool = filteredTools.find(t => t.id === toolId);
      if (tool) {
        handleRentClick(tool);
      }
    };

    window.viewListing = (toolId: number) => {
      const tool = filteredTools.find(t => t.id === toolId);
      if (tool) {
        handleCardClick(tool);
      }
    };

    return () => {
      delete window.rentTool;
      delete window.viewListing;
    };
  }, [filteredTools]);

  // Click outside to close suggestions and filters
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearchSubmitted(true);
    setShowSuggestions(false);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setLoading(true);
    setSearchSubmitted(true);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleCardClick = (tool: any) => {
    setNavigating(true);
    // Show loading animation for a short time before navigating
    setTimeout(() => {
      navigate(`/listing/${tool.id}`);
    }, 600);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setLoading(true);
    setSearchSubmitted(true);
    setViewMode('list');

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleRentClick = (tool: any) => {
    setSelectedTool(tool);
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

  const handleRentRequestSubmit = async () => {
    if (!selectedTool || !currentUser) return;

    try {
      // Calculate total cost
      const startDate = new Date(rentRequest.startDate);
      const endDate = new Date(rentRequest.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalCost = days * selectedTool.price;

      // Create rental request and add to context
      const rentalRequestData = {
        toolId: selectedTool.id,
        toolName: selectedTool.name,
        toolImage: selectedTool.image,
        renterName: currentUser.displayName || 'Anonymous',
        renterEmail: currentUser.email || '',
        ownerEmail: selectedTool.ownerContact,
        ownerName: selectedTool.owner,
        startDate: rentRequest.startDate,
        endDate: rentRequest.endDate,
        startTime: rentRequest.startTime,
        endTime: rentRequest.endTime,
        message: rentRequest.message,
        totalCost: totalCost,
        status: 'pending' as const,
        location: selectedTool.location
      };

      await addRentalRequest(rentalRequestData);

      console.log('Rental request sent:', rentalRequestData);

      // Store success data and show success modal
      setSuccessData({
        toolName: selectedTool.name,
        ownerName: selectedTool.owner,
        startDate: rentRequest.startDate,
        endDate: rentRequest.endDate,
        startTime: rentRequest.startTime,
        endTime: rentRequest.endTime,
        totalCost: totalCost
      });

      // Close rent modal and show success modal
      setShowRentModal(false);
      setShowSuccessModal(true);

      // Reset form data
      setSelectedTool(null);
      setRentRequest({
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '17:00',
        message: ''
      });
    } catch (error) {
      console.error('Error sending rental request:', error);
      // Show error modal instead of alert - for now just close the modal
      setShowRentModal(false);
      // TODO: Add error modal for better UX
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
          <h1 className="text-3xl font-bold mb-2">Browse Tools</h1>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Find the perfect tool for your project
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar with Suggestions */}
            <div className="flex-1 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-0 shadow-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 text-white placeholder-gray-400'
                      : 'bg-white/80 text-gray-900 placeholder-gray-500 backdrop-blur-sm'
                  }`}
                />
              </form>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg border-0 shadow-lg backdrop-blur-sm z-10 ${
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
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-0 shadow-sm transition-all ${
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
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-0 shadow-sm transition-all ${
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

            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-0 shadow-sm transition-all ${
                  showFilters
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800/60 hover:bg-gray-800/80 text-white'
                    : 'bg-white/80 hover:bg-white/90 text-gray-900 backdrop-blur-sm'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showFilters && (
                <div className={`absolute top-full right-0 mt-2 w-72 rounded-2xl border shadow-xl backdrop-blur-md z-20 ${
                  theme === 'dark'
                    ? 'bg-gray-800/95 border-gray-700'
                    : 'bg-white/95 border-gray-200'
                }`}>
                  <div className="p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Filters</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className={`p-1 rounded-full transition-colors ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-semibold mb-3">Price Range (SGD)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Min</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                            className={`w-full px-3 py-2.5 rounded-xl border-0 text-sm transition-all focus:ring-2 focus:ring-blue-500 ${
                              theme === 'dark'
                                ? 'bg-gray-700/50 text-white placeholder-gray-400'
                                : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Max</label>
                          <input
                            type="number"
                            placeholder="100"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 100})}
                            className={`w-full px-3 py-2.5 rounded-xl border-0 text-sm transition-all focus:ring-2 focus:ring-blue-500 ${
                              theme === 'dark'
                                ? 'bg-gray-700/50 text-white placeholder-gray-400'
                                : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-semibold mb-3">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border-0 text-sm transition-all focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700/50 text-white'
                            : 'bg-gray-50 text-gray-900'
                        }`}
                      >
                        <option value="relevance">Most Relevant</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest First</option>
                      </select>
                    </div>

                    {/* Distance */}
                    <div>
                      <label className="block text-sm font-semibold mb-3">Distance</label>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={distance}
                          onChange={(e) => setDistance(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(distance / 50) * 100}%, ${theme === 'dark' ? '#374151' : '#E5E7EB'} ${(distance / 50) * 100}%, ${theme === 'dark' ? '#374151' : '#E5E7EB'} 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1 km</span>
                          <span className="font-semibold text-blue-500">{distance} km</span>
                          <span>50 km</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-3 border-t border-gray-200/20">
                      <button
                        onClick={() => {
                          setPriceRange({ min: 0, max: 100 });
                          setSortBy('relevance');
                          setDistance(50);
                        }}
                        className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-xl transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="flex-1 py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
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

        {/* Loading Animation */}
        {loading && (
          <div className={`p-8 rounded-lg mb-8 ${
            theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-lg">Loading tools...</span>
            </div>
          </div>
        )}

        {/* Discover Tools Near You Map */}
        {!searchSubmitted && !loading && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapIcon className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Discover tools near you!</h2>
              </div>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-1 text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
              >
                <span>Full map view</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className={`h-80 rounded-2xl overflow-hidden shadow-lg ${
              theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <div ref={discoverMapRef} className="w-full h-full" />
            </div>
          </div>
        )}

        {/* Featured Categories */}
        {!searchSubmitted && !loading && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Popular Categories</h2>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-1 text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
              >
                <span>See all</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`p-4 rounded-2xl border-0 shadow-sm hover:shadow-lg transition-all text-center group ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 hover:bg-gray-800/80'
                      : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
                  }`}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {category.emoji}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.count} items
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Top Rated Tools */}
        {!searchSubmitted && !loading && topRatedTools.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold">Top Rated Tools</h2>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setLoading(true);
                  setSearchSubmitted(true);
                  setViewMode('list');
                  setTimeout(() => setLoading(false), 800);
                }}
                className={`flex items-center space-x-1 text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
              >
                <span>View all</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {topRatedTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => handleCardClick(tool)}
                  className={`rounded-2xl border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 hover:bg-gray-800/80'
                      : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
                  }`}
                >
                  {/* Tool Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative">
                    <div className="text-4xl group-hover:scale-110 transition-transform">{tool.image}</div>
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{tool.rating}</span>
                    </div>
                  </div>

                  {/* Tool Info */}
                  <div className="p-3 space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2">{tool.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-500">${tool.price}/{tool.period}</span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {tool.reviews} reviews
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Tools */}
        {!searchSubmitted && !loading && trendingTools.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold">Trending Now</h2>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setLoading(true);
                  setSearchSubmitted(true);
                  setViewMode('list');
                  setTimeout(() => setLoading(false), 800);
                }}
                className={`flex items-center space-x-1 text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
              >
                <span>View all</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {trendingTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => handleCardClick(tool)}
                  className={`rounded-2xl border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 hover:bg-gray-800/80'
                      : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
                  }`}
                >
                  {/* Tool Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative">
                    <div className="text-4xl group-hover:scale-110 transition-transform">{tool.image}</div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Hot</span>
                    </div>
                  </div>

                  {/* Tool Info */}
                  <div className="p-3 space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2">{tool.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-500">${tool.price}/{tool.period}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs">{tool.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results / Filtered Listings */}
        {(searchSubmitted || selectedCategory !== 'All') && !loading && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {searchTerm ? `Search Results for "${searchTerm}"` : `${selectedCategory} Tools`}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSearchSubmitted(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 hover:bg-gray-800/80 text-white'
                    : 'bg-white/80 hover:bg-white/90 text-gray-900 backdrop-blur-sm'
                }`}
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>

            {viewMode === 'map' ? (
              /* Map View */
              <div className={`h-96 rounded-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <div ref={mapRef} className="w-full h-full" />
              </div>
            ) : filteredTools.length > 0 ? (
              /* List View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => handleCardClick(tool)}
                    className={`rounded-2xl border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group ${
                      theme === 'dark'
                        ? 'bg-gray-800/60 hover:bg-gray-800/80'
                        : 'bg-white/80 hover:bg-white/90 backdrop-blur-sm'
                    }`}
                  >
                    {/* Tool Image */}
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative">
                      <div className="text-6xl group-hover:scale-110 transition-transform">{tool.image}</div>
                      <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{tool.rating}</span>
                      </div>
                    </div>

                    {/* Tool Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2">{tool.name}</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          by {tool.owner}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-blue-500">${tool.price}</span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            /{tool.period}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{tool.rating}</span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            ({tool.reviews})
                          </span>
                        </div>
                      </div>

                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        📍 {tool.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/80 backdrop-blur-sm'
              }`}>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {searchTerm
                    ? `No tools match your search for "${searchTerm}"`
                    : `No tools found in the ${selectedCategory} category`
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSearchSubmitted(false);
                  }}
                  className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors"
                >
                  Browse All Tools
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />

      {/* Rent Request Modal */}
      {showRentModal && selectedTool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-lg border-0 shadow-xl ${
            theme === 'dark'
              ? 'bg-gray-800'
              : 'bg-white'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/20">
              <h3 className="text-lg font-semibold">Request to Rent</h3>
              <button
                onClick={() => setShowRentModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Tool Info */}
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{selectedTool.image}</div>
                <div>
                  <h4 className="font-semibold">{selectedTool.name}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    by {selectedTool.owner} • {selectedTool.location}
                  </p>
                  <p className="text-lg font-bold text-blue-500">
                    ${selectedTool.price}/{selectedTool.period}
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
                      ${Math.ceil((new Date(rentRequest.endDate).getTime() - new Date(rentRequest.startDate).getTime()) / (1000 * 60 * 60 * 24)) * selectedTool.price}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {Math.ceil((new Date(rentRequest.endDate).getTime() - new Date(rentRequest.startDate).getTime()) / (1000 * 60 * 60 * 24))} day(s) × ${selectedTool.price}/{selectedTool.period}
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

      {/* Success Modal */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${
            theme === 'dark'
              ? 'bg-gray-800'
              : 'bg-white'
          }`}>
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Request Sent Successfully!</h2>
              <p className="text-green-100">Your rental request has been sent to the tool owner</p>
            </div>

            {/* Success Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Request Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span>Request Summary</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Tool:</span>
                    <span className="font-medium">{successData.toolName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Owner:</span>
                    <span className="font-medium">{successData.ownerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Calendar className="w-4 h-4" />
                      <span>Dates:</span>
                    </span>
                    <span className="font-medium">{successData.startDate} to {successData.endDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Clock className="w-4 h-4" />
                      <span>Time:</span>
                    </span>
                    <span className="font-medium">{successData.startTime} - {successData.endTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <DollarSign className="w-4 h-4" />
                      <span>Total Cost:</span>
                    </span>
                    <span className="font-bold text-lg text-green-500">${successData.totalCost}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
              }`}>
                <h4 className="font-semibold text-blue-600 mb-2">What happens next?</h4>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                  <li>• The owner will be notified via email</li>
                  <li>• They can approve or decline your request</li>
                  <li>• You'll receive a notification with their decision</li>
                  <li>• Track your request in "My Rentals"</li>
                </ul>
              </div>
            </div>

            {/* Success Footer */}
            <div className="px-6 pb-6 flex space-x-3">
              <button
                onClick={() => navigate('/my-rentals')}
                className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
              >
                View My Rentals
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Loading Overlay */}
      {navigating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className={`p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-lg font-medium">Loading listing...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}