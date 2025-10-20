import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  MapPin, 
  Users, 
  Shield, 
  Calculator, 
  MessageCircle, 
  Zap, 
  FileText,
  Sparkles
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

const Home = () => {



  // Check authentication and redirect admins/owners; users stay on Home
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          console.log('Home: User logged in with role:', userData.role);
          if (userData.role === 2) {
            window.location.href = '/admin-dashboard';
          } else if (userData.role === 3) {
            window.location.href = '/owner-dashboard';
          } else if (userData.role === 1) {
            // Stay on Home for regular users
          }
        } catch (error) {
          console.error('Home: Error parsing user data:', error);
        }
      }
    };
    checkAuthAndRedirect();
  }, []);

  const features = [
    { icon: MapPin, title: "Smart PG Location Finder", description: "Find verified PGs and hostels within 1km radius using GPS technology and live location tracking." },
    { icon: Users, title: "AI Roommate Matching", description: "Advanced algorithms match you with compatible roommates based on lifestyle and preferences." },
    { icon: Shield, title: "Verified Properties", description: "Background-verified PG owners and secure rental agreements like OYO's verified hotels." },
    { icon: Calculator, title: "Transparent Pricing", description: "Clear monthly rent, food charges, and utility costs with no hidden fees." },
    { icon: MessageCircle, title: "Instant Booking", description: "Book PGs instantly with secure payments, just like booking hotels on OYO." },
    { icon: Zap, title: "Safety & Security", description: "24/7 security, CCTV cameras, and verified PG accommodations for your safety." },
    { icon: FileText, title: "Digital Agreements", description: "Paperless PG rental agreements with e-signatures and secure document storage." },
    { icon: MapPin, title: "Nearby Amenities", description: "Interactive maps showing nearby colleges, offices, transport links, and neighborhood insights." }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 overflow-x-hidden"
    >
              <div className="bg-white overflow-x-hidden relative">
          {/* Global Floating Particles System */}
          <div className="fixed inset-0 pointer-events-none z-10">
            {/* Background floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`bg-particle-${i}`}
                className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-gray-200 rounded-full opacity-40"
                animate={{
                  x: [0, 30, -20, 40, 10, -30, 0],
                  y: [0, -40, 30, -60, 20, -50, 0],
                  scale: [0.5, 1.5, 0.8, 1.2, 0.6, 1.4, 0.5],
                  opacity: [0.2, 0.6, 0.3, 0.7, 0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 8 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
            
            {/* Colored floating particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`color-particle-${i}`}
                className={`absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full ${
                  i % 4 === 0 ? 'bg-red-300' :
                  i % 4 === 1 ? 'bg-blue-300' :
                  i % 4 === 2 ? 'bg-yellow-300' :
                  'bg-purple-300'
                } opacity-60`}
                animate={{
                  x: [0, -50, 30, -40, 20, -30, 0],
                  y: [0, 30, -40, 20, -30, 40, 0],
                  scale: [0.8, 1.6, 0.5, 1.3, 0.7, 1.1, 0.8],
                  opacity: [0.3, 0.8, 0.2, 0.6, 0.4, 0.7, 0.3]
                }}
                transition={{
                  duration: 10 + i * 0.8,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
            
            {/* Floating sparkles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-yellow-300 rounded-full opacity-70"
                animate={{
                  x: [0, 25, -15, 30, -10, 20, 0],
                  y: [0, -30, 20, -25, 15, -20, 0],
                  scale: [0.4, 2, 0.3, 1.8, 0.5, 1.5, 0.4],
                  opacity: [0.2, 1, 0.1, 0.9, 0.3, 0.8, 0.2]
                }}
                transition={{
                  duration: 6 + i * 0.6,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
          
      {/* Hero Section */}
          <div className="relative pt-20 pb-4 px-2 sm:px-6 lg:px-8 sm:pt-28 lg:pt-32 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center justify-center mb-12">
              {/* Clean Brand Logo */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-center mb-8 overflow-hidden"
              >
                {/* Main Logo */}
                  <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 relative">
                  {/* Background highlight effect */}
                    <motion.div 
                      animate={{ 
                        scale: [1.05, 1.1, 1.05],
                        opacity: [0.6, 0.8, 0.6],
                        rotate: [-12, -10, -12]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-red-100 via-yellow-100 to-red-100 rounded-2xl transform -skew-x-12 opacity-60 -z-10"
                    />
                  
                  {/* Lyvo+ as single word with unique styling */}
                    <motion.span 
                      whileHover={{ 
                        scale: 1.05,
                        textShadow: "0 0 30px rgba(239, 68, 68, 0.8)"
                      }}
                      animate={{
                        textShadow: [
                          "0 0 20px rgba(239, 68, 68, 0.3)",
                          "0 0 30px rgba(239, 68, 68, 0.6)",
                          "0 0 20px rgba(239, 68, 68, 0.3)"
                        ]
                      }}
                      transition={{ 
                        duration: 0.3,
                        textShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="relative"
                    >
                      <motion.span 
                        animate={{
                          y: [0, -2, 0],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-red-500 drop-shadow-lg relative"
                      >
                        Lyvo
                        {/* Floating sparkles around Lyvo */}
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute -top-2 -right-2 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full opacity-80"
                        />
                        <motion.div
                          animate={{
                            rotate: [360, 0],
                            scale: [1, 1.3, 1]
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute -bottom-1 -left-1 w-1 h-1 sm:w-2 sm:h-2 bg-blue-300 rounded-full opacity-70"
                        />
                      </motion.span>
                      
                      <motion.span 
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 8,
                          textShadow: "0 0 25px rgba(0, 0, 0, 0.6)"
                        }}
                        animate={{
                          y: [0, 1, 0],
                          rotate: [0, 1, -1, 0]
                        }}
                        transition={{ 
                          duration: 0.3,
                          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="text-gray-900 drop-shadow-lg relative"
                      >
                        +
                        {/* Enhanced accent dot above + */}
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.4, 0.8, 1.2, 1],
                            opacity: [0.7, 1, 0.5, 0.9, 0.7],
                            y: [0, -2, 0, -1, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full shadow-sm"
                        />
                        
                        {/* Additional floating elements around + */}
                        <motion.div
                          animate={{
                            rotate: [0, 180, 360],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute -top-3 -right-3 w-1 h-1 sm:w-2 sm:h-2 bg-orange-300 rounded-full opacity-60"
                        />
                      </motion.span>
                    </motion.span>
                    
                    {/* Enhanced accent elements */}
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.5, 0.8, 1.3, 1],
                        opacity: [0.6, 1, 0.3, 0.9, 0.6],
                        rotate: [0, 45, 90, 135, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-1 -right-1 sm:-top-4 sm:-right-4 w-2 h-2 sm:w-4 sm:h-4 bg-gradient-to-br from-red-400 to-orange-400 rounded-full shadow-lg"
                    />
                    
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.3, 0.7, 1.2, 1],
                        opacity: [0.6, 1, 0.4, 0.8, 0.6],
                        rotate: [0, -45, -90, -135, 0]
                      }}
                      transition={{ 
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -bottom-1 -left-1 sm:-bottom-4 sm:-left-4 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full shadow-lg"
                    />
                    
                    {/* New floating elements */}
                    <motion.div
                      animate={{
                        x: [0, 5, -3, 4, 0],
                        y: [0, -3, 2, -4, 0],
                        scale: [1, 1.2, 0.8, 1.1, 1]
                      }}
                      transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-2 right-2 sm:top-6 sm:right-6 w-1 h-1 sm:w-2 sm:h-2 bg-green-400 rounded-full shadow-md"
                    />
                    
                    <motion.div
                      animate={{
                        x: [0, -4, 3, -2, 0],
                        y: [0, 2, -3, 1, 0],
                        scale: [1, 1.1, 0.9, 1.2, 1]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute bottom-2 left-2 sm:bottom-6 sm:left-6 w-1 h-1 sm:w-2 sm:h-2 bg-pink-400 rounded-full shadow-md"
                    />
                </h1>

                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="mt-8"
                >
                                          <p className="text-base sm:text-lg text-gray-600 font-medium tracking-wide px-2">
                    <span className="text-red-500">[</span>
                        <span className="mx-1 sm:mx-2">INDIA'S #1 PG & CO-LIVING PLATFORM</span>
                    <span className="text-red-500">]</span>
                  </p>
                </motion.div>
              </motion.div>

              {/* Welcome Text with Different Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="relative mt-8"
                >
                  {/* Floating particles animation surrounding the logo */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Orbiting particles around logo */}
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30) * (Math.PI / 180); // 30° intervals
                      const radius = 80 + (i % 3) * 20; // Different orbit radii
                      return (
                    <motion.div
                      key={i}
                          className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 rounded-full shadow-lg"
                          animate={{
                            x: [
                              Math.cos(angle) * radius,
                              Math.cos(angle + Math.PI/6) * (radius + 10),
                              Math.cos(angle + Math.PI/3) * (radius - 5),
                              Math.cos(angle + Math.PI/2) * (radius + 15),
                              Math.cos(angle + 2*Math.PI/3) * (radius - 10),
                              Math.cos(angle + 5*Math.PI/6) * (radius + 5),
                              Math.cos(angle + Math.PI) * radius
                            ],
                            y: [
                              Math.sin(angle) * radius,
                              Math.sin(angle + Math.PI/6) * (radius + 10),
                              Math.sin(angle + Math.PI/3) * (radius - 5),
                              Math.sin(angle + Math.PI/2) * (radius + 15),
                              Math.sin(angle + 2*Math.PI/3) * (radius - 10),
                              Math.sin(angle + 5*Math.PI/6) * (radius + 5),
                              Math.sin(angle + Math.PI) * radius
                            ],
                            scale: [1, 1.5, 0.8, 1.3, 0.9, 1.2, 1],
                            opacity: [0.6, 1, 0.3, 0.9, 0.4, 0.8, 0.6]
                          }}
                          transition={{
                            duration: 6 + i * 0.3,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                      );
                    })}
                    
                    {/* Inner orbiting sparkles */}
                    {[...Array(8)].map((_, i) => {
                      const angle = (i * 45) * (Math.PI / 180); // 45° intervals
                      const radius = 40 + (i % 2) * 15; // Closer to logo
                      return (
                        <motion.div
                          key={`sparkle-${i}`}
                          className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-yellow-300 rounded-full shadow-sm"
                      animate={{
                            x: [
                              Math.cos(angle) * radius,
                              Math.cos(angle + Math.PI/4) * (radius + 8),
                              Math.cos(angle + Math.PI/2) * (radius - 3),
                              Math.cos(angle + 3*Math.PI/4) * (radius + 12),
                              Math.cos(angle + Math.PI) * radius
                            ],
                            y: [
                              Math.sin(angle) * radius,
                              Math.sin(angle + Math.PI/4) * (radius + 8),
                              Math.sin(angle + Math.PI/2) * (radius - 3),
                              Math.sin(angle + 3*Math.PI/4) * (radius + 12),
                              Math.sin(angle + Math.PI) * radius
                            ],
                            scale: [0.5, 1.8, 0.4, 1.5, 0.5],
                            opacity: [0.3, 1, 0.2, 0.8, 0.3]
                      }}
                      transition={{
                            duration: 4 + i * 0.4,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                      style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                      );
                    })}
                    
                    {/* Floating accent elements */}
                    {[...Array(6)].map((_, i) => {
                      const angle = (i * 60) * (Math.PI / 180); // 60° intervals
                      const radius = 120 + (i % 2) * 30; // Outer orbit
                      return (
                        <motion.div
                          key={`accent-${i}`}
                          className={`absolute ${
                            i % 2 === 0 
                              ? 'w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full' 
                              : 'w-3 h-3 sm:w-4 sm:h-4 bg-purple-400 transform rotate-45'
                          } shadow-md`}
                          animate={{
                            x: [
                              Math.cos(angle) * radius,
                              Math.cos(angle + Math.PI/3) * (radius + 20),
                              Math.cos(angle + 2*Math.PI/3) * (radius - 15),
                              Math.cos(angle + Math.PI) * radius
                            ],
                            y: [
                              Math.sin(angle) * radius,
                              Math.sin(angle + Math.PI/3) * (radius + 20),
                              Math.sin(angle + 2*Math.PI/3) * (radius - 15),
                              Math.sin(angle + Math.PI) * radius
                            ],
                            scale: [1, 1.6, 0.7, 1],
                            opacity: [0.4, 0.9, 0.2, 0.4],
                            rotate: i % 2 === 0 ? [0, 180, 360] : [0, -180, -360]
                          }}
                          transition={{
                            duration: 8 + i * 0.6,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeInOut"
                          }}
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                      );
                    })}
                </div>

                {/* Typewriter effect text */}
              <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    className="overflow-hidden whitespace-normal break-words sm:whitespace-nowrap mx-auto text-center px-2"
                  >
                                          <motion.span
                        className="text-xl sm:text-xl font-semibold text-red-600"
                      >
                        Find Your Perfect PG, Hostel & Co-Living Space
                  </motion.span>
                </motion.div>

                    {/* Quick Signup Prompt */}
          <motion.div
                      initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className="mt-12"
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-red-200 max-w-md mx-auto mx-2">
                        <p className="text-sm sm:text-sm text-gray-700 mb-3">
                          <span className="text-red-600 font-semibold">⚡ Quick Start:</span> Sign up in 30 seconds and find your perfect PG!
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Link to="/signup">
                            <button className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                              Sign Up Free
                            </button>
                          </Link>
                          <Link to="/login">
                            <button className="w-full sm:w-auto text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
                              Login
                        </button>
                          </Link>
                    </div>
                  </div>
                    </motion.div>
                  </motion.div>
              </div>
            </motion.div>
            </div>
          </div>

        {/* Why Choose Lyvo Section */}
        <div className="py-8 sm:py-12 px-2 sm:px-6 lg:px-8 relative">
          {/* Section-specific floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
          <motion.div
                key={`section-particle-${i}`}
                className={`absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full ${
                  i % 3 === 0 ? 'bg-red-200' :
                  i % 3 === 1 ? 'bg-blue-200' :
                  'bg-yellow-200'
                } opacity-50`}
                animate={{
                  x: [0, 20, -15, 25, -10, 15, 0],
                  y: [0, -25, 15, -20, 10, -15, 0],
                  scale: [0.6, 1.4, 0.5, 1.2, 0.7, 1.1, 0.6],
                  opacity: [0.3, 0.7, 0.2, 0.6, 0.4, 0.5, 0.3]
                }}
                transition={{
                  duration: 7 + i * 0.7,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 4) * 15}%`
                }}
              />
            ))}
        </div>

        <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 px-2">
                  Why Choose{' '}
                  <span className="text-red-600">Lyvo</span><span className="text-black">+</span>?
              </h2>
                <p className="text-lg sm:text-lg text-gray-600 max-w-3xl mx-auto px-2 leading-relaxed">
                  Like OYO for hotels and Airbnb for homes, Lyvo+ is your go-to platform for finding verified PGs, 
                  hostels, and co-living spaces. Book instantly with secure payments and verified properties.
              </p>
            </div>
          </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 sm:p-6 hover:shadow-xl transition-all duration-200 relative"
                  >
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                        POPULAR
                    </div>
                    )}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 sm:mb-5">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-sm leading-relaxed">{feature.description}</p>
                    
                    {/* Quick action for key features */}
                    {index === 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <Link to="/signup">
                          <button className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors">
                            🚀 Try Now - Free
                          </button>
                        </Link>
                      </div>
                    )}
                </motion.div>
            ))}
          </motion.div>
            </div>
        </div>

                {/* CTA Section */}
        <div className="py-20 sm:py-28 lg:py-32 relative overflow-hidden bg-gray-50">
          <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 sm:mb-10 font-display px-2">
                  Ready to Book Your <span className="text-red-600">Perfect PG</span>?
              </h2>
                <p className="text-xl sm:text-xl lg:text-2xl text-gray-600 mb-10 sm:mb-14 font-medium max-w-3xl mx-auto px-2 leading-relaxed">
                  Join thousands of students and professionals who have found their ideal PG, hostel, and co-living space with Lyvo+.
                </p>
                
                {/* Urgency Banner */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 max-w-2xl mx-auto mx-2">
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-red-700 font-semibold text-base sm:text-base">
                    <span className="animate-pulse">🔥</span>
                    <span>Limited Time: Get ₹500 OFF on your first month!</span>
                    <span className="animate-pulse">🔥</span>
                  </div>
            </div>

                {/* Social Proof */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8 text-sm sm:text-sm text-gray-600 px-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-200 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-200 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-200 rounded-full border-2 border-white"></div>
                    </div>
                    <span>500+ PGs booked this week</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span>4.8/5 from 10K+ reviews</span>
          </div>
        </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-2">
            <Link to="/signup">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)" 
                }}
                whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto bg-red-600 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-bold text-xl sm:text-2xl flex items-center justify-center space-x-2 sm:space-x-4 shadow-2xl hover:bg-red-700 transition-all duration-300"
                    >
                      <span className="relative z-10">Sign Up - Get ₹500 OFF</span>
                      <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto border-2 border-red-600 text-red-600 px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-bold text-xl sm:text-2xl hover:bg-red-50 transition-all duration-300"
                    >
                      Login
              </motion.button>
            </Link>
                </div>

                {/* Trust Indicators */}
                <div className="text-center text-sm sm:text-sm text-gray-500 px-2">
                  <p>🔒 Secure & Verified • 💳 No Hidden Charges • 🚀 Instant Booking</p>
                </div>
          </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;