import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import { 
  Search, 
  Heart, 
  Calendar, 
  MapPin, 
  Star, 
  Users, 
  Building,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const SeekerDashboard = () => {
  const [user, setUser] = useState({});
  const [recentSearches, setRecentSearches] = useState([]);
  const [favoritePGs, setFavoritePGs] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Mock data
    setRecentSearches([
      { id: 1, location: 'Koramangala, Bangalore', date: '2 hours ago' },
      { id: 2, location: 'Indiranagar, Bangalore', date: '1 day ago' },
      { id: 3, location: 'HSR Layout, Bangalore', date: '3 days ago' }
    ]);

    setFavoritePGs([
      {
        id: 1,
        name: 'Student PG Koramangala',
        location: 'Koramangala, Bangalore',
        price: '₹15,000',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        amenities: ['AC', 'Food', 'WiFi', 'Laundry']
      },
      {
        id: 2,
        name: 'Professional PG Indiranagar',
        location: 'Indiranagar, Bangalore',
        price: '₹18,000',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        amenities: ['AC', 'Food', 'WiFi', 'Gym']
      }
    ]);

    setUpcomingBookings([
      {
        id: 1,
        pgName: 'Student PG Koramangala',
        checkIn: '2024-01-15',
        checkOut: '2024-02-15',
        status: 'confirmed',
        amount: '₹15,000'
      },
      {
        id: 2,
        pgName: 'Professional PG Indiranagar',
        checkIn: '2024-01-20',
        checkOut: '2024-02-20',
        status: 'pending',
        amount: '₹18,000'
      }
    ]);

    setRecommendations([
      {
        id: 1,
        name: 'New PG Near Tech Park',
        location: 'Electronic City, Bangalore',
        price: '₹12,000',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        distance: '2.5 km',
        matchScore: 95
      },
      {
        id: 2,
        name: 'Premium Co-living Space',
        location: 'Whitefield, Bangalore',
        price: '₹22,000',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        distance: '5.2 km',
        matchScore: 88
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <SeekerLayout>
      <div className="p-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to find your perfect PG? Here's what's happening with your account.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Link
            to="/seeker-search"
            className="group bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Search PGs</h3>
                <p className="text-blue-100 text-sm">Find your perfect accommodation</p>
              </div>
              <Search className="w-8 h-8 text-blue-200 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>

          <Link
            to="/seeker-favorites"
            className="group bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Favorites</h3>
                <p className="text-pink-100 text-sm">View your saved PGs</p>
              </div>
              <Heart className="w-8 h-8 text-pink-200 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>

          <Link
            to="/seeker-bookings"
            className="group bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">My Bookings</h3>
                <p className="text-green-100 text-sm">Manage your reservations</p>
              </div>
              <Calendar className="w-8 h-8 text-green-200 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Searches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Searches</h2>
                <Link
                  to="/seeker-search"
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <motion.div
                    key={search.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{search.location}</p>
                        <p className="text-sm text-gray-500">{search.date}</p>
                      </div>
                    </div>
                    <Search className="w-4 h-4 text-gray-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
                <Link
                  to="/seeker-search"
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((pg, index) => (
                  <motion.div
                    key={pg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={pg.image}
                        alt={pg.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {pg.matchScore}% Match
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {pg.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{pg.location}</span>
                        <span className="text-xs text-gray-400">• {pg.distance}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-gray-900">{pg.price}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{pg.rating}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Favorites</span>
                  </div>
                  <span className="font-semibold text-gray-900">{favoritePGs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Bookings</span>
                  </div>
                  <span className="font-semibold text-gray-900">{upcomingBookings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-600">Searches</span>
                  </div>
                  <span className="font-semibold text-gray-900">{recentSearches.length}</span>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Bookings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h3>
              <div className="space-y-3">
                {upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{booking.pgName}</h4>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Check-in: {booking.checkIn}</p>
                      <p>Check-out: {booking.checkOut}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-gray-900">{booking.amount}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)} flex items-center space-x-1`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/seeker-bookings"
                className="mt-4 w-full text-center text-red-600 hover:text-red-700 text-sm font-medium block"
              >
                View All Bookings
              </Link>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Save PGs to favorites for quick access</li>
                <li>• Use filters to find exact matches</li>
                <li>• Read reviews before booking</li>
                <li>• Contact owners for questions</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </SeekerLayout>
  );
};

export default SeekerDashboard;
