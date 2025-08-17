import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, MapPin, Users } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900"><span className="text-red-600">Lyvo</span><span className="text-black">+</span></span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="text-center">
            {/* 404 Number */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <div className="relative">
                <div className="text-8xl md:text-9xl font-bold text-red-500 mb-4 tracking-tight">
                  404
                </div>
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Search className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Page Not Found
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Oops! The page you're looking for doesn't exist or has been moved. 
                Don't worry, there are plenty of amazing co-living opportunities waiting for you!
              </p>
            </motion.div>

            {/* Card with Options */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
            >
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Option 1 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200"
                >
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Go Home</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Return to the main page and explore our co-living community
                  </p>
                  <Link to="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      Home
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Option 2 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Accommodations</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Discover available co-living spaces in your area
                  </p>
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Browse
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Option 3 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Join Community</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect with other co-living enthusiasts
                  </p>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    >
                      <Home className="w-5 h-5" />
                      Go Home
                    </motion.button>
                  </Link>
                  
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back to Login
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-50 rounded-xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you're having trouble finding what you're looking for, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="mailto:support@lyvo.com" 
                  className="text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Contact Support
                </a>
                <span className="text-gray-400">•</span>
                <a 
                  href="/help" 
                  className="text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Help Center
                </a>
                <span className="text-gray-400">•</span>
                <a 
                  href="/faq" 
                  className="text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  FAQ
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-full blur-2xl"
        />
      </div>
    </div>
  );
};

export default NotFound;