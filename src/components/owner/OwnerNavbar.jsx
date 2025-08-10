import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  User, 
  Menu,
  Search,
  LogOut,
  X
} from 'lucide-react';

const OwnerNavbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
  const mobileSearchVariants = {
    hidden: { 
      opacity: 0, 
      height: 0, 
      marginTop: 0,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      height: "auto", 
      marginTop: 12,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginTop: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

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
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Lyvo Owner</h1>
              <p className="text-xs text-gray-500">Property Management</p>
            </div>
          </Link>
        </div>

        {/* Center - Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search properties, tenants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <motion.button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle search"
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <AnimatePresence mode="wait">
            {showMobileSearch ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

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
              <motion.span 
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
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
                    <motion.div 
                      className="p-4 border-b border-gray-100 hover:bg-gray-50"
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-800">New maintenance request for Property #123</p>
                      <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                    </motion.div>
                    <motion.div 
                      className="p-4 border-b border-gray-100 hover:bg-gray-50"
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-800">Rent payment received from Tenant A</p>
                      <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                    </motion.div>
                    <motion.div 
                      className="p-4 hover:bg-gray-50"
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-800">New tenant application for Property #456</p>
                      <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                    </motion.div>
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <Link to="/owner-notifications" className="text-sm text-red-600 hover:text-red-700 font-medium">
                      View all notifications
                    </Link>
                  </div>
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
                className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
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
                      <Link
                        to="/owner-account"
                        className="block px-4 py-2 text-sm text-gray-700"
                      >
                        Account Settings
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

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div 
            className="md:hidden"
            variants={mobileSearchVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <motion.input
                type="text"
                placeholder="Search properties, tenants..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default OwnerNavbar; 