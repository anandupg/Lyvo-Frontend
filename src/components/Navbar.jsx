import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, Utensils, Home, BarChart3, BookOpen, Plus, User, Scan, LogOut, Settings, Info, Phone } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      const newLoginStatus = !!token;
      
      setIsLoggedIn(newLoginStatus);
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    
    // Check immediately on component mount
    checkLoginStatus();
    
    const handleStorage = () => {
      checkLoginStatus();
    };
    
    const handleCustomLogout = () => {
      setIsLoggedIn(false);
      setUser(null);
    };

    const handleCustomLogin = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('storage', handleStorage);
    window.addEventListener('lyvo-logout', handleCustomLogout);
    window.addEventListener('lyvo-login', handleCustomLogin);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('lyvo-logout', handleCustomLogout);
      window.removeEventListener('lyvo-login', handleCustomLogin);
    };
  }, []);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdown && !event.target.closest('.user-dropdown')) {
        setUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdown]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setUserDropdown(false);
    window.dispatchEvent(new Event('lyvo-logout'));
    navigate('/');
  };



  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
    ...(isLoggedIn ? [
      { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
      { name: "Profile", href: "/profile", icon: User },
    ] : [])
  ];

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
        staggerDirection: 1
      }
    }
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 lg:backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-white/90 lg:backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 ${
                location.pathname === '/' ? 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' : ''
              }`}>
                <span className="text-white font-bold text-lg lg:text-xl">L</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                location.pathname === '/' ? 'text-red-600' : 'text-gray-900 group-hover:text-red-600'
              }`}>Lyvo+</span>
              <span className="text-xs text-gray-500 font-medium hidden sm:block">Co-Living Platform</span>
            </div>
          </Link>

                     {/* Desktop Navigation */}
           <div className="hidden lg:flex items-center space-x-1">
             {navigation.map((item) => {
               const Icon = item.icon;
               const isActive = location.pathname === item.href;
               return (
                 <Link key={item.href} to={item.href} className={`relative px-4 py-2 transition-all duration-300 font-medium group ${
                   isActive 
                     ? 'text-red-600' 
                     : 'text-gray-700 hover:text-red-600'
                 }`}>
                   <span className="relative z-10 flex items-center space-x-2">
                     <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'}`} />
                     <span>{item.name}</span>
                   </span>
                   <div className={`absolute inset-0 rounded-lg transition-all duration-300 origin-center ${
                     isActive 
                       ? 'bg-red-50 scale-100' 
                       : 'bg-red-50 scale-0 group-hover:scale-100'
                   }`}></div>
                 </Link>
               );
             })}
           </div>

                     {/* Auth Buttons */}
           <div className="hidden lg:flex items-center space-x-3">
             {!isLoggedIn ? (
               <>
                 <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">
                   Sign In
                 </Link>
                 <div className="flex items-center space-x-2">
                   <Link to="/signup" className="relative px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                     <span className="relative z-10">Get Started</span>
                     <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                   </Link>
                   <Link to="/room-owner-signup" className="relative px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                     <span className="relative z-10">List Property</span>
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                   </Link>
                 </div>
               </>
             ) : (
               <div className="relative user-dropdown">
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => {
                     setUserDropdown(!userDropdown);
                   }}
                   className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-red-50 hover:to-red-100 transition-all duration-300 border border-gray-200 hover:border-red-200"
                   title={`Hi, ${user?.name || 'User'}!`}
                 >
                   <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                     <User className="w-4 h-4 text-white" />
                   </div>
                   <div className="flex flex-col items-start">
                     <span className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</span>
                     <span className="text-xs text-gray-500">Welcome back!</span>
                   </div>
                   <div className={`w-2 h-2 rounded-full transition-all duration-300 ${userDropdown ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                 </motion.button>
                
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-[100]"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Hi, {user?.name || 'User'}!</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                             onClick={() => {
                         setUserDropdown(false);
                       }}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                             onClick={() => {
                         setUserDropdown(false);
                       }}
                    >
                      <BarChart3 className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    <button
                                             onClick={() => {
                         handleLogout();
                       }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-all duration-300 rounded-lg hover:bg-red-50"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    variants={menuItemVariants}
                    custom={index}
                  >
                                         <Link 
                       to={item.href} 
                       onClick={() => setIsOpen(false)}
                       className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                         isActive 
                           ? 'bg-red-50 text-red-600 border-l-4 border-red-600' 
                           : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                       }`}
                     >
                       <Icon className={`h-5 w-5 ${isActive ? 'text-red-600' : ''}`} />
                       <span className="text-base">{item.name}</span>
                     </Link>
                  </motion.div>
                );
              })}
              
              <motion.div 
                variants={menuItemVariants}
                className="pt-4 border-t border-gray-100"
              >
                {!isLoggedIn ? (
                  <div className="space-y-3">
                    <motion.div variants={menuItemVariants}>
                      <Link 
                        to="/login" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <User className="h-5 w-5" />
                        <span className="text-base">Sign In</span>
                      </Link>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <Link 
                        to="/signup" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
                      >
                        <span className="text-base">Get Started</span>
                      </Link>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <Link 
                        to="/room-owner-signup" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                      >
                        <span className="text-base">List Property</span>
                      </Link>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-3">
                                         <motion.div variants={menuItemVariants}>
                       <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                         <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                             <User className="w-5 h-5 text-white" />
                           </div>
                           <div className="flex flex-col">
                             <div className="text-sm font-semibold text-gray-900">
                               {user?.name || 'User'}
                             </div>
                             <div className="text-xs text-gray-500">
                               {user?.email}
                             </div>
                           </div>
                         </div>
                       </div>
                     </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <User className="w-5 h-5" />
                        <span className="text-base">Profile</span>
                      </Link>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <button
                        onClick={() => { setIsOpen(false); handleLogout(); }}
                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium w-full text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-base">Logout</span>
                      </button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;