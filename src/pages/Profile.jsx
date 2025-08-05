import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Edit, Save, X, User, Mail, Phone, MapPin, Calendar, Target, Award, Heart, Home, 
  Camera, Users, Activity, Settings, Bell, Lock, Eye, EyeOff, Shield, Star,
  TrendingUp, Clock, AlertCircle, Globe, Languages, Wifi, Car, Utensils,
  Dumbbell, Coffee, MessageCircle, Calculator, FileText, Zap, ArrowRight,
  Plus, Search, Filter, Share2, Trash2
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [profileData, setProfileData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    location: "",
    language: "English",
    joinDate: "",
    bio: "",
    
    // Co-living Preferences
    preferredLocation: "",
    budget: "",
    roomType: "",
    genderPreference: "",
    moveInDate: "",
    
    // Lifestyle & Preferences
    occupation: "",
    workSchedule: "",
    lifestyle: "",
    smoking: false,
    pets: false,
    cleanliness: "",
    noiseLevel: "",
    
    // Amenities Preferences
    amenities: [],
    mustHaves: [],
    dealBreakers: [],
    
    // Verification & Trust
    isVerified: false,
    trustScore: 0,
    references: [],
    
    // Notifications & Settings
    emailNotifications: true,
    pushNotifications: true,
    roommateAlerts: true,
    paymentReminders: true,
    maintenanceUpdates: true
  });

  // Mock data for the profile
  const profileStats = [
    {
      icon: Home,
      label: "Active Bookings",
      value: 2,
      color: "#EF4444",
      trend: "+1 this month"
    },
    {
      icon: Users,
      label: "Total Roommates",
      value: 5,
      color: "#3B82F6",
      trend: "+2 this year"
    },
    {
      icon: Star,
      label: "Average Rating",
      value: "4.8",
      color: "#F59E0B",
      trend: "↑0.2 points"
    },
    {
      icon: TrendingUp,
      label: "Monthly Savings",
      value: "₹25,000",
      color: "#10B981",
      trend: "vs living alone"
    }
  ];

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

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        // Check if user is authenticated
        if (!token || !userData) {
          console.log('No authentication token or user data found');
          setUser(null);
          setLoading(false);
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Set profile data with user info
            setProfileData(prev => ({
              ...prev,
          name: parsedUser.name || "Alex Johnson",
          email: parsedUser.email || "alex@example.com",
          joinDate: "March 2024",
          location: "Koramangala, Bangalore",
          preferredLocation: "Koramangala, Indiranagar, HSR Layout",
          budget: "₹15,000 - ₹25,000",
          roomType: "Single Room",
          genderPreference: "Any",
          occupation: "Software Engineer",
          workSchedule: "9 AM - 6 PM",
          lifestyle: "Professional, Clean, Quiet",
          cleanliness: "Very Clean",
          noiseLevel: "Quiet",
          amenities: ["Wifi", "Kitchen", "Parking", "Gym"],
          mustHaves: ["Wifi", "Kitchen", "Clean Environment"],
          dealBreakers: ["Smoking", "Loud Music"],
          isVerified: true,
          trustScore: 95,
          bio: "Professional software engineer looking for a clean, quiet living space. I work from home sometimes and prefer a peaceful environment. I'm clean, respectful, and looking for like-minded roommates."
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    try {
      setSaveStatus({ type: 'loading', message: 'Saving changes...' });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    setIsEditing(false);
        setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
        
        setTimeout(() => {
          setSaveStatus({ type: '', message: '' });
        }, 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to update profile' });
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setSaveStatus({ type: 'error', message: 'New passwords do not match' });
        return;
      }

      setSaveStatus({ type: 'loading', message: 'Updating password...' });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
        setSaveStatus({ type: 'success', message: 'Password updated successfully!' });
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        
        setTimeout(() => {
          setSaveStatus({ type: '', message: '' });
        }, 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to update password' });
    }
  };

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
          <p className="text-gray-600">Loading profile...</p>
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
          <p className="text-gray-600 mb-6">Please log in to access your profile.</p>
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

  const tabNavigation = [
    { id: "overview", label: "Overview", icon: User },
    { id: "accommodations", label: "Accommodations", icon: Home },
    { id: "preferences", label: "Preferences", icon: Target },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <ScrollReveal>
          <motion.div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="relative h-64 bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
              <div className="absolute bottom-8 left-8 flex items-end space-x-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-xl border-4 border-white shadow-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    <Camera className="w-5 h-5" />
                  </motion.button>
                  {profileData.isVerified && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                </div>
                  )}
                </div>
                <div className="text-gray-900 pb-4">
                  <h1 className="text-4xl font-bold mb-2">{profileData.name || 'User'}</h1>
                  <p className="text-gray-700 flex items-center space-x-2 text-lg font-medium">
                    <Calendar className="w-5 h-5" />
                    <span>Joined {profileData.joinDate || 'Recently'}</span>
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{profileData.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profileData.location || 'Location not set'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-8 right-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/90 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:bg-white transition-all duration-300"
                >
                  {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                  <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Stats Overview */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {profileStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">{stat.trend}</div>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600">{stat.label}</h3>
                </motion.div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Tab Navigation */}
        <ScrollReveal delay={0.3}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {tabNavigation.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-red-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              <ScrollReveal delay={0.4}>
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Bio Section */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">About Me</h2>
                      {isEditing ? (
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 resize-none font-medium"
                          placeholder="Tell us about yourself and your co-living preferences..."
                        />
                      ) : (
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {profileData.bio || "Welcome to Lyvo! This is where you can share your co-living preferences, lifestyle, and what you're looking for in roommates and accommodations. Click 'Edit Profile' to add your personal bio and make this profile truly yours."}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Trust Score</h3>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-white">{profileData.trustScore}</span>
                              </div>
                        <p className="text-sm text-gray-600">Verified Profile</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Co-living Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Budget Range</span>
                          <span className="font-semibold text-red-600">
                            {profileData.budget}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Room Type</span>
                          <span className="font-semibold text-blue-600">
                            {profileData.roomType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Lifestyle</span>
                          <span className="font-semibold text-green-600">
                            {profileData.lifestyle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </>
          )}

          {/* Accommodations Tab */}
          {activeTab === "accommodations" && (
            <ScrollReveal delay={0.4}>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-900">My Accommodations</h2>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    <span>Add New</span>
                  </button>
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
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <Edit className="h-4 w-4" />
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

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <ScrollReveal delay={0.4}>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Basic Preferences */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Living Preferences</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { icon: MapPin, label: "Preferred Location", field: "preferredLocation", type: "text" },
                      { icon: Target, label: "Budget Range", field: "budget", type: "text" },
                      { icon: Home, label: "Room Type", field: "roomType", type: "text" },
                      { icon: Users, label: "Gender Preference", field: "genderPreference", type: "text" }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.field}>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Icon className="w-4 h-4 inline mr-2" />
                            {item.label}
                          </label>
                          {isEditing ? (
                            <input
                              type={item.type}
                              value={profileData[item.field]}
                              onChange={(e) => handleInputChange(item.field, e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 font-medium"
                            />
                          ) : (
                            <p className="text-gray-600 py-3 font-medium">{profileData[item.field]}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lifestyle Preferences */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Lifestyle</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.occupation}
                            onChange={(e) => handleInputChange("occupation", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 font-medium"
                          />
                        ) : (
                          <p className="text-gray-600 py-3 font-medium">{profileData.occupation}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Work Schedule</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.workSchedule}
                            onChange={(e) => handleInputChange("workSchedule", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 font-medium"
                          />
                        ) : (
                          <p className="text-gray-600 py-3 font-medium">{profileData.workSchedule}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities Preferences</label>
                        <div className="flex flex-wrap gap-2">
                          {profileData.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="px-4 py-2 bg-red-500/10 text-red-600 rounded-full text-sm font-semibold flex items-center space-x-2"
                            >
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Roommates Tab */}
          {activeTab === "roommates" && (
            <ScrollReveal delay={0.4}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">My Roommates</h2>
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Roommate management features coming soon!</p>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <ScrollReveal delay={0.4}>
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Payment History</h2>
                  <div className="space-y-4">
                    {upcomingPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <ScrollReveal delay={0.4}>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Account Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 font-medium"
                      />
                    </div>

                    <div>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full px-4 py-3 border border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Change Password</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Notifications</h2>
                  <div className="space-y-6">
                    {[
                      { key: "emailNotifications", label: "Email Notifications", description: "Receive updates via email" },
                      { key: "pushNotifications", label: "Push Notifications", description: "Mobile app notifications" },
                      { key: "roommateAlerts", label: "Roommate Alerts", description: "New roommate notifications" },
                      { key: "paymentReminders", label: "Payment Reminders", description: "Rent and utility reminders" },
                      { key: "maintenanceUpdates", label: "Maintenance Updates", description: "Property maintenance updates" }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-900">{setting.label}</div>
                          <div className="text-sm text-gray-500">{setting.description}</div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInputChange(setting.key, !profileData[setting.key])}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                            profileData[setting.key] ? "bg-red-500" : "bg-gray-300"
                          }`}
                        >
                          <motion.div
                            animate={{
                              x: profileData[setting.key] ? 24 : 0
                            }}
                            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300"
                          />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Save Changes Button */}
          {isEditing && (
            <ScrollReveal delay={0.6}>
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saveStatus.type === 'loading'}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-12 py-4 rounded-xl font-bold text-lg flex items-center space-x-3 shadow-xl hover:shadow-2xl transition-all duration-300 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-6 h-6" />
                  <span>{saveStatus.type === 'loading' ? 'Saving...' : 'Save All Changes'}</span>
                </motion.button>
              </div>
            </ScrollReveal>
          )}

          {/* Status Messages */}
          {saveStatus.message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
                saveStatus.type === 'success' 
                  ? 'bg-green-100 border border-green-300 text-green-800'
                  : saveStatus.type === 'error'
                  ? 'bg-red-100 border border-red-300 text-red-800'
                  : 'bg-blue-100 border border-blue-300 text-blue-800'
              }`}
            >
              {saveStatus.message}
            </motion.div>
          )}

          {/* Password Change Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-8 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordUpdate}
                      disabled={saveStatus.type === 'loading'}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {saveStatus.type === 'loading' ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;