import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Users, 
  Home, 
  Calendar, 
  TrendingUp, 
  Star, 
  Clock, 
  MessageCircle,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Coffee,
  Shield,
  Calculator,
  FileText,
  Zap,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  Heart,
  Share2,
  User
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for the dashboard
  const userProfile = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
    currentLocation: "Koramangala, Bangalore",
    memberSince: "March 2024",
    verified: true
  };

  const stats = {
    totalAccommodations: 12,
    activeBookings: 3,
    savedProperties: 8,
    totalRoommates: 5,
    averageRating: 4.8,
    monthlySavings: 25000
  };

  const myAccommodations = [
    {
      id: 1,
      title: "Modern Single Room in Koramangala",
      location: "Koramangala, Bangalore",
      price: "₹15,000",
      rating: 4.8,
      type: "Single",
      gender: "Any",
      status: "Active",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
      amenities: ["Wifi", "Parking", "Kitchen"],
      roommates: 2,
      nextPayment: "2024-04-15"
    },
    {
      id: 2,
      title: "Spacious Shared Living Space",
      location: "Indiranagar, Bangalore",
      price: "₹12,000",
      rating: 4.6,
      type: "Shared",
      gender: "Male",
      status: "Active",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
      amenities: ["Wifi", "Gym", "Cafeteria"],
      roommates: 3,
      nextPayment: "2024-04-20"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "payment",
      message: "Rent payment successful for Koramangala room",
      time: "2 hours ago",
      amount: "₹15,000"
    },
    {
      id: 2,
      type: "roommate",
      message: "New roommate joined - Sarah from Mumbai",
      time: "1 day ago"
    },
    {
      id: 3,
      type: "maintenance",
      message: "Maintenance request submitted for AC repair",
      time: "2 days ago"
    },
    {
      id: 4,
      type: "booking",
      message: "New accommodation booked in HSR Layout",
      time: "3 days ago"
    }
  ];

  const upcomingPayments = [
    {
      id: 1,
      accommodation: "Koramangala Room",
      amount: "₹15,000",
      dueDate: "2024-04-15",
      type: "Rent"
    },
    {
      id: 2,
      accommodation: "Indiranagar Shared Space",
      amount: "₹12,000",
      dueDate: "2024-04-20",
      type: "Rent"
    },
    {
      id: 3,
      accommodation: "Utility Bills",
      amount: "₹2,500",
      dueDate: "2024-04-25",
      type: "Utilities"
    }
  ];

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-3 w-3" />;
      case 'parking': return <Car className="h-3 w-3" />;
      case 'kitchen': return <Utensils className="h-3 w-3" />;
      case 'gym': return <Dumbbell className="h-3 w-3" />;
      case 'cafeteria': return <Coffee className="h-3 w-3" />;
      default: return <Wifi className="h-3 w-3" />;
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        console.log('No authentication token or user data found');
        navigate('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
        return;
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'payment': return <Calculator className="h-4 w-4 text-green-500" />;
      case 'roommate': return <Users className="h-4 w-4 text-blue-500" />;
      case 'maintenance': return <Settings className="h-4 w-4 text-orange-500" />;
      case 'booking': return <Home className="h-4 w-4 text-purple-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {userProfile.name.split(' ')[0]}! 🏠
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{userProfile.currentLocation}</span>
                <span>•</span>
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-red-500/20"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <Home className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Roommates</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRoommates}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Monthly Savings</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.monthlySavings.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
            {['overview', 'accommodations', 'roommates', 'payments', 'activities'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* My Accommodations */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Accommodations</h2>
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200">
                      <Plus className="h-4 w-4" />
                      <span>Add New</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {myAccommodations.map((accommodation, index) => (
                      <motion.div
                        key={accommodation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2 }}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                      >
                        <img
                          src={accommodation.image}
                          alt={accommodation.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{accommodation.title}</h3>
                          <p className="text-sm text-gray-600 flex items-center space-x-2">
                            <MapPin className="h-3 w-3" />
                            <span>{accommodation.location}</span>
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-lg font-bold text-red-600">{accommodation.price}</span>
                            <span className="text-sm text-gray-500">/month</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600">{accommodation.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Payments */}
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Payments</h3>
                  <div className="space-y-3">
                    {upcomingPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{payment.accommodation}</p>
                          <p className="text-sm text-gray-500">{payment.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">{payment.amount}</p>
                          <p className="text-xs text-gray-500">{payment.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200">
                    View All Payments
                  </button>
                </div>
              </ScrollReveal>

              {/* Recent Activities */}
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                          {activity.amount && (
                            <p className="text-xs font-medium text-green-600">{activity.amount}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        )}

        {activeTab === 'accommodations' && (
          <ScrollReveal>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Accommodations</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search accommodations..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myAccommodations.map((accommodation, index) => (
                  <motion.div
                    key={accommodation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="relative h-48">
                      <img
                        src={accommodation.image}
                        alt={accommodation.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex space-x-2">
                        <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">
                          {accommodation.type}
                        </span>
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {accommodation.gender}
                        </span>
                        </div>
                      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-gray-900">{accommodation.rating}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{accommodation.title}</h3>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{accommodation.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {accommodation.amenities.map((amenity, index) => (
                          <span key={index} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-red-600">{accommodation.price}</span>
                          <span className="text-sm text-gray-500">/month</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
          </div>
          </ScrollReveal>
        )}

        {activeTab === 'roommates' && (
          <ScrollReveal>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Roommates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Roommate cards would go here */}
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Roommate management features coming soon!</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {activeTab === 'payments' && (
          <ScrollReveal>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
              <div className="text-center py-12 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Payment history and management features coming soon!</p>
              </div>
              </div>
          </ScrollReveal>
        )}

        {activeTab === 'activities' && (
          <ScrollReveal>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Log</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                      {activity.amount && (
                        <p className="text-sm font-medium text-green-600">{activity.amount}</p>
                      )}
                </div>
              </div>
                ))}
              </div>
          </div>
          </ScrollReveal>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
