import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SeekerNavbar from './SeekerNavbar';
import SeekerSidebar from './SeekerSidebar';
import SeekerFooter from './SeekerFooter';

const SeekerLayout = ({ children, hideFooter = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Animation variants for mobile sidebar
  const sidebarVariants = {
    hidden: {
      x: '-100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: "easeInOut"
      }
    }
  };

  const overlayVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15
      }
    }
  };

  // Check seeker profile completion prompt flag
  useEffect(() => {
    try {
      const userRaw = localStorage.getItem('user');
      if (!userRaw) return;
      const user = JSON.parse(userRaw);
      if (user?.role === 2) { // Seeker role
        // If no profileCompleted flag or false, show prompt
        if (!user.profileCompleted) {
          setShowProfilePrompt(true);
        }
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <SeekerSidebar onClose={closeSidebar} />
      </div>
      
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Navbar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <SeekerNavbar onMenuToggle={toggleSidebar} />
        </div>

        {/* Profile completion prompt (top-right) */}
        {showProfilePrompt && (
          <div className="fixed top-20 right-4 z-40 max-w-xs">
            <div className="bg-white border border-blue-300 rounded-xl shadow-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Complete Your Profile
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Add your preferences to find better PG matches
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => setShowProfilePrompt(false)}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Complete Now
                    </button>
                    <button
                      onClick={() => setShowProfilePrompt(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Later
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfilePrompt(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={closeSidebar}
              />
              <motion.div
                className="fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] lg:hidden"
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SeekerSidebar onClose={closeSidebar} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        {!hideFooter && <SeekerFooter />}
      </div>
    </div>
  );
};

export default SeekerLayout;
