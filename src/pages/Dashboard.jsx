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
  User,
  ChevronRight
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simplified mock data
  const userProfile = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
    currentLocation: "Koramangala, Bangalore",
    memberSince: "March 2024",
    verified: true
  };

  const stats = {
    activeBookings: 3,
    totalRoommates: 5,
    averageRating: 4.8,
    monthlySavings: 25000
  };

  const myAccommodations = [
    {
      id: 1,
      title: "Modern Single Room",
      location: "Koramangala, Bangalore",
      price: "₹15,000",
      rating: 4.8,
      status: "Active",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
      nextPayment: "2024-04-15"
    },
    {
      id: 2,
      title: "Shared Living Space",
      location: "Indiranagar, Bangalore",
      price: "₹12,000",
      rating: 4.6,
      status: "Active",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
      nextPayment: "2024-04-20"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "payment",
      message: "Rent payment successful",
      time: "2 hours ago",
      amount: "₹15,000"
    },
    {
      id: 2,
      type: "roommate",
      message: "New roommate joined - Sarah",
      time: "1 day ago"
    },
    {
      id: 3,
      type: "maintenance",
      message: "Maintenance request submitted",
      time: "2 days ago"
    }
  ];

  const upcomingPayments = [
    {
      id: 1,
      accommodation: "Koramangala Room",
      amount: "₹15,000",
      dueDate: "2024-04-15"
    },
    {
      id: 2,
      accommodation: "Indiranagar Space",
      amount: "₹12,000",
      dueDate: "2024-04-20"
    }
  ];

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        console.log('Dashboard: No authentication token or user data found');
        navigate('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        console.log('Dashboard: User role check:', parsedUser.role);
        
        // Check user role and redirect if necessary
        if (parsedUser.role === 2) {
          // Admin user - redirect to admin dashboard
          console.log('Dashboard: Redirecting admin to admin dashboard');
          window.location.href = '/admin-dashboard';
          return;
        } else if (parsedUser.role === 3) {
          // Owner user - redirect to owner dashboard
          console.log('Dashboard: Redirecting owner to owner dashboard');
          window.location.href = '/owner-dashboard';
          return;
        } else if (parsedUser.role === 1) {
          // Regular user - stay on this dashboard
          console.log('Dashboard: Regular user, staying on dashboard');
          setUser(parsedUser);
        } else {
          // Invalid role - redirect to login
          console.error('Dashboard: Invalid user role:', parsedUser.role);
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Dashboard: Error parsing user data:', error);
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
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4 text-sm">Please log in to access your dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {userProfile.currentLocation}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Bookings</p>
                <p className="text-xl font-semibold text-gray-900">{stats.activeBookings}</p>
              </div>
              <Home className="w-5 h-5 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Roommates</p>
                <p className="text-xl font-semibold text-gray-900">{stats.totalRoommates}</p>
              </div>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Rating</p>
                <p className="text-xl font-semibold text-gray-900">{stats.averageRating}</p>
              </div>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Savings</p>
                <p className="text-xl font-semibold text-gray-900">₹{stats.monthlySavings.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Accommodations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Accommodations</h2>
                <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {myAccommodations.map((accommodation) => (
                  <div
                    key={accommodation.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <img
                      src={accommodation.image}
                      alt={accommodation.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{accommodation.title}</h3>
                      <p className="text-sm text-gray-600">{accommodation.location}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-lg font-semibold text-red-600">{accommodation.price}</span>
                        <span className="text-xs text-gray-500">/month</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{accommodation.rating}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Payments */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments</h3>
              <div className="space-y-3">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{payment.accommodation}</p>
                      <p className="text-xs text-gray-500">{payment.dueDate}</p>
                </div>
                    <p className="font-semibold text-red-600">{payment.amount}</p>
                </div>
                ))}
              </div>
              </div>
              
            {/* Recent Activities */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
