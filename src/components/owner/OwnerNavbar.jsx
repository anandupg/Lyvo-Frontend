import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  User, 
  Menu,
  LogOut,
  X,
  XCircle
} from 'lucide-react';

// Helper function to format time ago
const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

const OwnerNavbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  
  // Keep navbar avatar in sync when profile changes
  useEffect(() => {
    const onUpdate = () => {
      try { setUser(JSON.parse(localStorage.getItem('user') || '{}')); } catch {}
    };
    window.addEventListener('lyvo-profile-update', onUpdate);
    window.addEventListener('lyvo-login', onUpdate);
    window.addEventListener('lyvo-logout', onUpdate);
    return () => {
      window.removeEventListener('lyvo-profile-update', onUpdate);
      window.removeEventListener('lyvo-login', onUpdate);
      window.removeEventListener('lyvo-logout', onUpdate);
    };
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const authToken = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!authToken || !userData._id) {
        return;
      }

      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${baseUrl}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'x-user-id': userData._id
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data || []);
          setUnreadCount(data.unread_count || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!authToken || !userData._id) {
        return;
      }

      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${baseUrl}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'x-user-id': userData._id
        }
      });

      if (response.ok) {
        // Refresh notifications
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const pollInterval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(pollInterval);
  }, []);

  // Listen for notification events
  useEffect(() => {
    const handleNewNotification = () => {
      fetchNotifications();
    };
    
    window.addEventListener('new-notification', handleNewNotification);
    return () => window.removeEventListener('new-notification', handleNewNotification);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('lyvo-logout'));
    navigate('/login');
  };

  // Animation variants

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transformOrigin: "top right"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  const buttonHoverVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.1 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Menu Toggle */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Mobile Menu Toggle */}
          <motion.button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          {/* Logo */}
          <Link to="/owner-dashboard" className="flex items-center space-x-2 sm:space-x-3">
            <motion.div 
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src="/Lyvo_no_bg.png" 
                alt="Lyvo Owner" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            <div className="hidden sm:block">
                              <h1 className="text-lg sm:text-xl font-bold text-gray-900"><span className="text-red-600">Lyvo</span><span className="text-black">+</span> Owner</h1>
              <p className="text-xs text-gray-500">Property Management</p>
            </div>
          </Link>
        </div>


        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <div className="relative dropdown-container">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 relative"
              aria-label="Notifications"
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notificationsLoading ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                      </div>
                    ) : notifications.filter(n => !n.is_read).length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No new notifications</p>
                        <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.filter(n => !n.is_read).slice(0, 5).map((notification) => (
                        <motion.div 
                          key={notification._id}
                          className="relative p-4 border-b border-gray-100 bg-blue-50 hover:bg-blue-100 group"
                          transition={{ duration: 0.2 }}
                        >
                          <div 
                            className="cursor-pointer pr-8"
                            onClick={() => {
                              if (notification.action_url) {
                                navigate(notification.action_url);
                                setShowNotifications(false);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{getTimeAgo(notification.createdAt)}</p>
                              </div>
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            </div>
                          </div>
                          {/* Mark as Read Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                            title="Mark as read"
                          >
                            <XCircle className="w-4 h-4 text-gray-400 hover:text-red-600" />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                      <Link 
                        to="/owner-notifications" 
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                        onClick={() => setShowNotifications(false)}
                      >
                        View all notifications
                      </Link>
                      <span className="text-xs text-gray-500">
                        {notifications.filter(n => !n.is_read).length} unread
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative dropdown-container">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              aria-label="User menu"
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-red-100 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                )}
              </motion.div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user.name || 'Owner'}
              </span>
            </motion.button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="py-2">
                    <motion.div
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to="/owner-profile"
                        className="block px-4 py-2 text-sm text-gray-700"
                      >
                        Profile Settings
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default OwnerNavbar; 