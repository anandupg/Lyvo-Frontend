import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OwnerNavbar from './OwnerNavbar';
import OwnerSidebar from './OwnerSidebar';
import OwnerFooter from './OwnerFooter';

const OwnerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <OwnerSidebar onClose={closeSidebar} />
      </div>
      
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Navbar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <OwnerNavbar onMenuToggle={toggleSidebar} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <OwnerFooter />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 w-64 max-w-[80vw]"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <OwnerSidebar onClose={closeSidebar} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerLayout; 