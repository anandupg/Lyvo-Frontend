import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Home, Info, Phone, BarChart3, User, LogOut } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Navigation items based on login status
  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
    ...(isLoggedIn ? [
      { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    ] : [])
  ];

  // Scroll effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  // Check login status
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
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setUserDropdown(false);
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new Event('lyvo-logout'));
    navigate('/');
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
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
            <div className="hidden md:flex items-center space-x-1">
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

            {/* Right Section: Auth Buttons + Mobile Menu Button */}
            <div className="flex items-center space-x-3">
              
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-3">
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
                      onClick={() => setUserDropdown(!userDropdown)}
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
                          onClick={() => setUserDropdown(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserDropdown(false)}
                        >
                          <BarChart3 className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
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
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-red-600 transition-all duration-300 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                    {isMobileMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div 
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] sm:max-w-[85vw] bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation menu"
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={closeMobileMenu}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
            aria-label="Close mobile menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="p-6 space-y-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-red-50 text-red-600 border-l-4 border-red-600' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                <span className="text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Auth Section */}
        <div className="p-6 border-t border-gray-100 mt-auto">
          {!isLoggedIn ? (
            <div className="space-y-4">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
              >
                <User className="h-5 w-5 mr-2" />
                Sign In
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg text-sm"
                >
                  Get Started
                </Link>
                <Link
                  to="/room-owner-signup"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg text-sm"
                >
                  List Property
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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
              
              {/* Quick Actions for Logged In Users */}
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-base">Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                >
                  <User className="w-5 h-5" />
                  <span className="text-base">Profile</span>
                </Link>
              </div>
              
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-base">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;