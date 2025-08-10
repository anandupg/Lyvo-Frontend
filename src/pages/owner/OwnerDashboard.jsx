import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Calendar,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (!authToken || !userData) {
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        // Check if user is a property owner (role 3 or specific role for property owners)
        if (user.role !== 3) {
          navigate('/dashboard');
          return;
        }
        setUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Mock data for owner dashboard
  const stats = {
    totalProperties: 8,
    activeTenants: 24,
    monthlyRevenue: 125000,
    averageRating: 4.6,
    occupancyRate: 87,
    pendingApplications: 5
  };

  const recentProperties = [
    {
      id: 1,
      name: "Sunset Apartments",
      location: "Koramangala, Bangalore",
      type: "Apartment Complex",
      tenants: 12,
      occupancy: "92%",
      revenue: "₹45,000",
      status: "Active",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "Green Valley Residences",
      location: "Indiranagar, Bangalore",
      type: "Independent Houses",
      tenants: 8,
      occupancy: "100%",
      revenue: "₹38,000",
      status: "Active",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 3,
      name: "City Center Flats",
      location: "MG Road, Bangalore",
      type: "Studio Apartments",
      tenants: 4,
      occupancy: "75%",
      revenue: "₹22,000",
      status: "Active",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "tenant",
      message: "New tenant application received for Sunset Apartments",
      time: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      type: "payment",
      message: "Rent payment received from Green Valley Residences",
      time: "4 hours ago",
      status: "completed"
    },
    {
      id: 3,
      type: "maintenance",
      message: "Maintenance request submitted for City Center Flats",
      time: "1 day ago",
      status: "in-progress"
    },
    {
      id: 4,
      type: "property",
      message: "New property listing approved: Riverside Villas",
      time: "2 days ago",
      status: "completed"
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'tenant':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'maintenance':
        return <Building className="w-5 h-5 text-orange-600" />;
      case 'property':
        return <Plus className="w-5 h-5 text-purple-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Owner'}!</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Here's what's happening with your properties today.</p>
          </div>
          <div className="sm:mt-0">
            <button
              onClick={() => navigate('/owner-add-property')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-600">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>+2 this month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Tenants</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.activeTenants}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-600">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>+3 this week</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-600">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>+12% vs last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-600">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>+0.2 this month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-green-600">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>+5% vs last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-blue-600">
              <span>Requires attention</span>
            </div>
          </motion.div>
        </div>

        {/* Recent Properties and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Properties */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg border border-gray-200"
          >
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Properties</h2>
              <p className="text-xs sm:text-sm text-gray-600">Your latest property listings and their performance</p>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {recentProperties.map((property) => (
                <div key={property.id} className="flex items-center space-x-3 sm:space-x-4">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">{property.name}</h3>
                    <p className="text-xs text-gray-500">{property.location}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-600">{property.tenants} tenants</span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-600">{property.occupancy} occupied</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{property.revenue}</p>
                    <p className="text-xs text-green-600">{property.status}</p>
                  </div>
                  <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/owner-properties')}
                className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View all properties →
              </button>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg border border-gray-200"
          >
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activities</h2>
              <p className="text-xs sm:text-sm text-gray-600">Latest updates and notifications</p>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)} flex-shrink-0`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/owner-notifications')}
                className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View all activities →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard; 