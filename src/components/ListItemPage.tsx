import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LiquidGlassNav from './LiquidGlassNav';
import { Camera, MapPin, DollarSign, Clock, Tag, FileText } from 'lucide-react';

export default function ListItemPage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    period: 'day',
    location: '',
    condition: 'excellent',
    availability: '',
  });

  const categories = [
    'Power Tools',
    'Garden Tools',
    'Electronics',
    'Kitchen Appliances',
    'Sports Equipment',
    'Home & DIY',
    'Photography',
    'Automotive',
    'Other'
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent - Like new' },
    { value: 'good', label: 'Good - Minor wear' },
    { value: 'fair', label: 'Fair - Some wear but functional' },
    { value: 'poor', label: 'Poor - Heavy wear but working' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Listing data:', formData);
    // Handle form submission here
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <LiquidGlassNav />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">List Your Tool</h1>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Share your tools and start earning money
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className={`rounded-2xl p-6 border-0 shadow-sm ${
            theme === 'dark'
              ? 'bg-gray-800/60'
              : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Photos
            </h3>
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 hover:border-gray-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Add photos of your tool
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Drag and drop or click to upload
              </p>
              <button type="button" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
                Choose Files
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className={`rounded-2xl p-6 border-0 shadow-sm ${
            theme === 'dark'
              ? 'bg-gray-800/60'
              : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tool Name</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Cordless Drill, Lawn Mower"
                  className={`w-full px-4 py-3 rounded-xl border-0 shadow-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 text-white placeholder-gray-400'
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your tool, its condition, and any special features..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-0 shadow-sm resize-none ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 text-white placeholder-gray-400'
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-0 shadow-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 text-white'
                        : 'bg-gray-50 text-gray-900'
                    }`}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-0 shadow-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 text-white'
                        : 'bg-gray-50 text-gray-900'
                    }`}
                  >
                    {conditions.map((condition) => (
                      <option key={condition.value} value={condition.value}>{condition.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Location */}
          <div className={`rounded-2xl p-6 border-0 shadow-sm ${
            theme === 'dark'
              ? 'bg-gray-800/60'
              : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing & Location
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Rental Price</label>
                  <div className="flex">
                    <span className={`px-4 py-3 rounded-l-xl border-0 ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      $
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="25"
                      className={`flex-1 px-4 py-3 rounded-r-xl border-0 shadow-sm ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 text-white placeholder-gray-400'
                          : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Per</label>
                  <select
                    name="period"
                    value={formData.period}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-0 shadow-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 text-white'
                        : 'bg-gray-50 text-gray-900'
                    }`}
                  >
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Orchard, Singapore"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-0 shadow-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 text-white placeholder-gray-400'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Availability</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="e.g., Weekends, Weekdays after 6pm"
                  className={`w-full px-4 py-3 rounded-xl border-0 shadow-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 text-white placeholder-gray-400'
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}