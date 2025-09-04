import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import { 
  Heart, 
  MapPin, 
  Star, 
  Eye, 
  MessageCircle, 
  Trash2,
  Building,
  Wifi,
  Snowflake,
  Utensils,
  Car,
  Shield
} from 'lucide-react';

const SeekerFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for favorites
    const mockFavorites = [
      {
        id: 1,
        name: 'Student PG Koramangala',
        location: 'Koramangala, Bangalore',
        price: 15000,
        rating: 4.5,
        reviews: 128,
        distance: '1.2 km',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        amenities: ['wifi', 'ac', 'food', 'laundry'],
        description: 'Perfect for students with modern amenities and great location',
        owner: 'Rahul Kumar',
        verified: true,
        available: true,
        addedDate: '2024-01-10'
      },
      {
        id: 2,
        name: 'Professional PG Indiranagar',
        location: 'Indiranagar, Bangalore',
        price: 18000,
        rating: 4.3,
        reviews: 95,
        distance: '2.8 km',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        amenities: ['wifi', 'ac', 'food', 'parking', 'gym'],
        description: 'Premium accommodation for working professionals',
        owner: 'Priya Sharma',
        verified: true,
        available: true,
        addedDate: '2024-01-08'
      },
      {
        id: 3,
        name: 'Co-living Space HSR Layout',
        location: 'HSR Layout, Bangalore',
        price: 12000,
        rating: 4.7,
        reviews: 156,
        distance: '3.5 km',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        amenities: ['wifi', 'ac', 'food', 'laundry', 'security'],
        description: 'Community living with shared spaces and activities',
        owner: 'Vikram Singh',
        verified: true,
        available: true,
        addedDate: '2024-01-05'
      }
    ];

    setFavorites(mockFavorites);
    setLoading(false);
  }, []);

  const removeFromFavorites = (id) => {
    setFavorites(prev => prev.filter(pg => pg.id !== id));
  };

  const amenitiesList = [
    { id: 'wifi', name: 'WiFi', icon: Wifi },
    { id: 'ac', name: 'AC', icon: Snowflake },
    { id: 'food', name: 'Food', icon: Utensils },
    { id: 'parking', name: 'Parking', icon: Car },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'laundry', name: 'Laundry', icon: Building }
  ];

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <SeekerLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading favorites...</p>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  return (
    <SeekerLayout>
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600">
                {favorites.length} PG{favorites.length !== 1 ? 's' : ''} saved for later
              </p>
            </div>
          </div>
        </motion.div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((pg, index) => (
              <motion.div
                key={pg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Image and Favorite Button */}
                <div className="relative">
                  <img
                    src={pg.image}
                    alt={pg.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </button>
                    <button 
                      onClick={() => removeFromFavorites(pg.id)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  {!pg.available && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Not Available
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                      {pg.name}
                    </h3>
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

                  {/* Amenities */}
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

                  {/* Owner Info */}
                  <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {pg.owner.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{pg.owner}</span>
                    </div>
                    {pg.verified && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Price and Actions */}
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

                  {/* Added Date */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Added to favorites on {formatDate(pg.addedDate)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No favorites yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring PGs and save your favorites to easily access them later. 
              Your saved PGs will appear here for quick reference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Search PGs
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                View Recommendations
              </button>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Contact All</h4>
                    <p className="text-sm text-gray-600">Send inquiries to multiple PGs</p>
                  </div>
                </div>
              </button>
              
              <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Compare PGs</h4>
                    <p className="text-sm text-gray-600">Side-by-side comparison</p>
                  </div>
                </div>
              </button>
              
              <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Share List</h4>
                    <p className="text-sm text-gray-600">Share with friends/family</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </SeekerLayout>
  );
};

export default SeekerFavorites;
