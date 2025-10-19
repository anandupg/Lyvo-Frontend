import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home,
  Heart,
  Calendar,
  MessageCircle,
  User,
  LogOut,
  MapPin,
  Star,
  BookOpen,
  X,
  Shield
} from 'lucide-react';
import { useBookingStatus } from '../../hooks/useBookingStatus';

const SeekerSidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
  
  // State for counts
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  
  // Get booking status
  const { hasConfirmedBooking, loading: bookingLoading, refreshBookingStatus } = useBookingStatus();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('lyvo-logout'));
    navigate('/login');
  };

  // Fetch favorites count
  const fetchFavoritesCount = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.userId || userData._id;
      
      if (!userId) return;

      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      const response = await fetch(`${baseUrl}/api/favorites/user?userId=${userId}`);

      if (response.ok) {
        const data = await response.json();
        setFavoritesCount((data.favorites || []).length);
      }
    } catch (error) {
      console.error('Error fetching favorites count:', error);
      setFavoritesCount(0);
    }
  };

  // Fetch bookings count
  const fetchBookingsCount = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.userId || userData._id;
      
      if (!userId) return;

      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      const response = await fetch(`${baseUrl}/api/bookings/user?userId=${userId}`);

      if (response.ok) {
        const data = await response.json();
        setBookingsCount((data.bookings || []).length);
      }
    } catch (error) {
      console.error('Error fetching bookings count:', error);
      setBookingsCount(0);
    }
  };

  // Fetch counts on component mount
  useEffect(() => {
    fetchFavoritesCount();
    fetchBookingsCount();
  }, []);

  // Listen for booking status changes
  useEffect(() => {
    const handleBookingStatusChange = () => {
      refreshBookingStatus();
    };

    // Listen for custom events that indicate booking status changes
    window.addEventListener('booking-status-changed', handleBookingStatusChange);
    window.addEventListener('booking-approved', handleBookingStatusChange);
    window.addEventListener('booking-cancelled', handleBookingStatusChange);

    return () => {
      window.removeEventListener('booking-status-changed', handleBookingStatusChange);
      window.removeEventListener('booking-approved', handleBookingStatusChange);
      window.removeEventListener('booking-cancelled', handleBookingStatusChange);
    };
  }, [refreshBookingStatus]);

  // Base navigation items
  const baseNavigation = [
    { name: 'My Room', href: '/my-room', icon: Home },
    { name: 'My Booking', href: '/seeker-bookings', icon: Calendar },
    { name: 'Favorites', href: '/seeker-favorites', icon: Heart },
    { name: 'Messages', href: '/seeker-messages', icon: MessageCircle },
    { name: 'Profile', href: '/seeker-profile', icon: User },
  ];

  // Items to show only when user has NO confirmed booking
  const conditionalNavigation = [
    { name: 'Dashboard', href: '/seeker-dashboard', icon: Home },
    { name: 'My Bookings', href: '/seeker-bookings', icon: Calendar },
    { name: 'Identity Verification', href: '/seeker-kyc', icon: Shield },
  ];

  // Build navigation based on booking status
  const navigation = hasConfirmedBooking ? baseNavigation : [...conditionalNavigation, ...baseNavigation];

  const isActive = (path) => location.pathname === path;

  // Animation variants for navigation items
  const navItemVariants = {
    hover: {
      x: 4,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-white border-r border-red-200/50 flex flex-col shadow-2xl h-screen"
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-4 w-32 h-32 bg-red-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 w-24 h-24 bg-red-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-red-500 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      {/* Header */}
      <div className="relative flex-shrink-0 flex items-center justify-between p-4 border-b border-red-200/50 bg-red-50/30">
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <motion.div 
            className="relative w-10 h-10 flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src="/Lyvo_no_bg.png" 
              alt="Lyvo Logo" 
              className="w-6 h-6 object-contain filter brightness-0 invert"
            />
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-red-400 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </motion.div>
          <div>
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Lyvo</span>
              <motion.span 
                className="text-xl font-bold text-gray-800 ml-1"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >+</motion.span>
            </motion.div>
            <motion.p 
              className="text-xs text-gray-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >Seeker Portal</motion.p>
          </div>
        </motion.div>
        
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="relative flex-shrink-0 p-4 border-b border-red-200/50 bg-red-50/20">
        <motion.div 
          className="relative flex items-center space-x-3 p-3 rounded-xl bg-white border border-red-100/50 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div 
            className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <img 
              src={user?.profilePicture || DEFAULT_AVATAR}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
            />
          </motion.div>
          <div className="flex-1 min-w-0 pr-2">
            <motion.p 
              className="text-sm font-semibold text-gray-900 truncate"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {user.name || 'User'}
            </motion.p>
            <motion.p 
              className="text-xs text-gray-600 break-words"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              {user.email || 'user@example.com'}
            </motion.p>
            {/* Booking Status Indicator */}
            {!bookingLoading && (
              <motion.div 
                className="mt-1 flex items-center space-x-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <div className={`w-2 h-2 rounded-full ${hasConfirmedBooking ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="text-xs font-medium text-gray-600">
                  {hasConfirmedBooking ? 'Confirmed Tenant' : 'Looking for Room'}
                </span>
              </motion.div>
            )}
          </div>
          {/* Status indicator */}
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full shadow-sm"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            variants={navItemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to={item.href}
              className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-r-4 border-red-500 shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-red-100/50 hover:text-red-700 hover:shadow-md'
              }`}
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 rounded-xl opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              
              <motion.div
                className="relative z-10 flex items-center w-full"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className={`mr-4 h-6 w-6 flex items-center justify-center rounded-lg transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-400 group-hover:bg-red-100 group-hover:text-red-600'
                  }`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.3 }
                  }}
                >
                  <item.icon className="h-4 w-4" />
                </motion.div>
                
                <span className="flex-1 font-semibold">{item.name}</span>
                
                {isActive(item.href) && (
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-red-500 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="w-1 h-1 bg-red-400 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 0.4, 0.8]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="flex-shrink-0 p-4 border-t border-red-200/50">
        <motion.div 
          className="relative bg-gradient-to-br from-red-50 via-red-100/50 to-red-50 rounded-2xl p-4 border border-red-200/50 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          {/* Animated background pattern */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-300/20 rounded-full blur-lg"></div>
          
          <div className="relative z-10">
            <motion.div 
              className="flex items-center justify-between mb-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <span className="text-sm font-semibold text-gray-700 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Favorites
              </span>
              <motion.span 
                className="text-lg font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent"
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >{favoritesCount}</motion.span>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <span className="text-sm font-semibold text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-red-500" />
                Bookings
              </span>
              <motion.span 
                className="text-lg font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent"
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >{bookingsCount}</motion.span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Logout Button */}
      <div className="flex-shrink-0 p-4 border-t border-red-200/50">
        <motion.button
          onClick={handleLogout}
          className="group relative w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="relative z-10 flex items-center"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="mr-3 p-1 rounded-lg bg-white/20"
              whileHover={{ 
                rotate: [0, -10, 10, 0],
                transition: { duration: 0.3 }
              }}
            >
              <LogOut className="h-4 w-4" />
            </motion.div>
            <span>Logout</span>
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SeekerSidebar;
