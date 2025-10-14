import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Heart, 
  Users, 
  Building,
  Wifi,
  Snowflake,
  Utensils,
  Car,
  Shield,
  Eye,
  Phone,
  MessageCircle
} from 'lucide-react';

const SeekerSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState([5000, 25000]);
  const [amenities, setAmenities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [pgs, setPgs] = useState([]);
  const [filteredPGs, setFilteredPGs] = useState([]);
  const [loading, setLoading] = useState(false);

  const amenitiesList = [
    { id: 'wifi', name: 'WiFi', icon: Wifi },
    { id: 'ac', name: 'AC', icon: Snowflake },
    { id: 'food', name: 'Food', icon: Utensils },
    { id: 'parking', name: 'Parking', icon: Car },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'laundry', name: 'Laundry', icon: Building }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'distance', label: 'Distance' }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const base = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
        const resp = await fetch(`${base}/api/public/properties`);
        if (!resp.ok) throw new Error(`Failed ${resp.status}`);
        const data = await resp.json();
        const items = (data.properties || []).map(p => ({
          id: p._id,
          name: p.propertyName || 'Unnamed Property',
          location: p.address || 'Address not available',
          price: Number(p.rent) || 0,
          rating: 4.5,
          reviews: 0,
          distance: '',
          image: Array.isArray(p.images) ? (p.images[0] || '') : (p.images?.images?.[0] || ''),
          amenities: Object.entries(p.amenities || {}).filter(([,v]) => v === true).map(([k]) => k.toLowerCase()),
          description: p.description || '',
          owner: p.ownerName || 'Owner',
          verified: true,
          available: true
        }));
        setPgs(items);
        setFilteredPGs(items);
      } catch (e) {
        setPgs([]);
        setFilteredPGs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    filterPGs();
  }, [searchQuery, location, priceRange, amenities, sortBy]);

  const filterPGs = () => {
    let filtered = [...pgs];

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(pg => 
        pg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pg.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pg.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (location) {
      filtered = filtered.filter(pg => 
        pg.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(pg => 
      pg.price >= priceRange[0] && pg.price <= priceRange[1]
    );

    // Amenities filter
    if (amenities.length > 0) {
      filtered = filtered.filter(pg => 
        amenities.every(amenity => pg.amenities.includes(amenity))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      default:
        // Relevance - keep original order
        break;
    }

    setFilteredPGs(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const toggleAmenity = (amenityId) => {
    setAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setPriceRange([5000, 25000]);
    setAmenities([]);
    setSortBy('relevance');
    setSearchParams({});
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <SeekerLayout>
      <div className="p-6">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect PG
          </h1>
          <p className="text-gray-600">
            Search through thousands of verified PGs, hostels, and co-living spaces
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search PGs, locations, or keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
          </form>
        </motion.div>

        {/* Filters and Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <span className="text-gray-600">
              {filteredPGs.length} PGs found
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} transition-colors`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} transition-colors`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
                <div className="space-y-2">
                  {amenitiesList.map(amenity => (
                    <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={amenities.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <amenity.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching for PGs...</p>
              </div>
            ) : filteredPGs.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredPGs.map((pg, index) => (
                  <motion.div
                    key={pg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                      <img
                        src={pg.image}
                        alt={pg.name}
                        className={`w-full object-cover ${viewMode === 'list' ? 'h-32' : 'h-48'}`}
                      />
                    </div>
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{pg.name}</h3>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{pg.location}</span>
                        <span className="text-xs text-gray-400">• {pg.distance}</span>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{pg.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({pg.reviews} reviews)</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pg.description}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {pg.amenities.slice(0, 4).map(amenity => {
                          const amenityInfo = amenitiesList.find(a => a.id === amenity);
                          return amenityInfo ? (
                            <span
                              key={amenity}
                              className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                              <amenityInfo.icon className="w-3 h-3" />
                              <span>{amenityInfo.name}</span>
                            </span>
                          ) : null;
                        })}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">{formatPrice(pg.price)}</span>
                          <span className="text-sm text-gray-500">/month</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                            <Eye className="w-4 h-4 inline mr-1" />
                            View
                          </button>
                          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            <MessageCircle className="w-4 h-4 inline mr-1" />
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No PGs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SeekerLayout>
  );
};

export default SeekerSearch;
