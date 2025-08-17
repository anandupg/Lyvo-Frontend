import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  MapPin, 
  Search, 
  Users, 
  Shield, 
  Calculator, 
  MessageCircle, 
  Zap, 
  FileText,
  Star,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Coffee,
  Sparkles
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

const Home = () => {
  const [searchLocation, setSearchLocation] = useState('');

  // Handle search functionality
  const handleSearch = () => {
    if (searchLocation.trim()) {
      console.log('Searching for:', searchLocation);
      // Add your search logic here
      // For example: navigate to search results page, filter data, etc.
    }
  };

  // Handle current location functionality
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Current location:', { latitude, longitude });
          
          // You can use these coordinates to get the address
          // For now, we'll set a placeholder text
          setSearchLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          
          // You can add reverse geocoding here to get the actual address
          // Example: fetch(`https://api.example.com/reverse-geocode?lat=${latitude}&lng=${longitude}`)
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please check your location permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Check authentication and redirect if user is logged in
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          console.log('Home: User logged in with role:', userData.role);
          
          // Redirect based on user role
          if (userData.role === 2) {
            console.log('Home: Redirecting admin to admin dashboard');
            window.location.href = '/admin-dashboard';
          } else if (userData.role === 3) {
            console.log('Home: Redirecting owner to owner dashboard');
            window.location.href = '/owner-dashboard';
          } else if (userData.role === 1) {
            console.log('Home: Redirecting regular user to user dashboard');
            window.location.href = '/dashboard';
          }
        } catch (error) {
          console.error('Home: Error parsing user data:', error);
        }
      }
    };

    checkAuthAndRedirect();
  }, []);

  const featuredAccommodations = [
    {
      id: 1,
      title: "Modern Single Room in Koramangala",
      location: "Koramangala, Bangalore",
      distance: "0.5 km away",
      price: "₹15,000",
      rating: "4.8",
      type: "Single",
      gender: "Any",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
      amenities: ["Wifi", "Parking", "Kitchen"]
    },
    {
      id: 2,
      title: "Spacious Shared Living Space",
      location: "Indiranagar, Bangalore",
      distance: "1.2 km away",
      price: "₹12,000",
      rating: "4.6",
      type: "Shared",
      gender: "Male",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
      amenities: ["Wifi", "Gym", "Cafeteria"]
    },
    {
      id: 3,
      title: "Premium Single Room with Kitchen",
      location: "HSR Layout, Bangalore",
      distance: "0.8 km away",
      price: "₹18,000",
      rating: "4.9",
      type: "Single",
      gender: "Female",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
      amenities: ["Wifi", "Kitchen", "Balcony"]
    }
  ];

  const features = [
    {
      icon: MapPin,
      title: "Smart Location Matching",
      description: "Find rooms within 1km radius using GPS technology and live location tracking."
    },
    {
      icon: Users,
      title: "AI Roommate Compatibility",
      description: "Advanced algorithms match you with compatible roommates based on lifestyle preferences."
    },
    {
      icon: Shield,
      title: "Verified & Secure",
      description: "Background-verified property owners and secure blockchain-based rental agreements."
    },
    {
      icon: Calculator,
      title: "Transparent Cost Sharing",
      description: "Built-in bill splitting for rent, utilities, and shared expenses with your roommates."
    },
    {
      icon: MessageCircle,
      title: "In-App Communication",
      description: "Seamless communication with roommates and property owners through our integrated chat system."
    },
    {
      icon: Zap,
      title: "IoT Safety Features",
      description: "Smart home integration with security cameras, smart locks, and emergency alert systems."
    },
    {
      icon: FileText,
      title: "Digital Agreements",
      description: "Paperless rental agreements with e-signatures and secure document storage."
    },
    {
      icon: MapPin,
      title: "Live Property Maps",
      description: "Interactive maps showing nearby amenities, transport links, and neighborhood insights."
    }
  ];

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-3 w-3" />;
      case 'parking': return <Car className="h-3 w-3" />;
      case 'kitchen': return <Utensils className="h-3 w-3" />;
      case 'gym': return <Dumbbell className="h-3 w-3" />;
      case 'cafeteria': return <Coffee className="h-3 w-3" />;
      case 'balcony': return <MapPin className="h-3 w-3" />;
      default: return <Wifi className="h-3 w-3" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16"
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white pt-20 pb-0 px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="flex flex-col items-center justify-center mb-8">


              {/* Clean Brand Logo */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center mb-8"
              >
                {/* Main Logo */}
                <h1 className="text-6xl md:text-8xl font-black mb-4 relative">
                  {/* Background highlight effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-100 via-yellow-100 to-red-100 rounded-2xl transform -skew-x-12 scale-110 opacity-60 -z-10"></div>
                  
                  {/* Lyvo+ as single word with unique styling */}
                  <span className="relative">
                    <span className="text-red-500 drop-shadow-lg">Lyvo</span>
                    <span className="text-gray-900 drop-shadow-lg relative">
                      +
                      {/* Accent dot above + */}
                      <div className="absolute -top-2 -right-1 w-3 h-3 bg-yellow-400 rounded-full shadow-sm"></div>
                    </span>
                  </span>
                  
                  {/* Unique accent elements */}
                  <div className="absolute -top-4 -right-4 w-4 h-4 bg-gradient-to-br from-red-400 to-orange-400 rounded-full shadow-lg"></div>
                  <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full shadow-lg"></div>
                </h1>

                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                  className="mt-4"
                >
                  <p className="text-lg text-gray-600 font-medium tracking-wide">
                    <span className="text-red-500">[</span>
                    <span className="mx-2">NEXT-GEN LIVING PLATFORM</span>
                    <span className="text-red-500">]</span>
                  </p>
                </motion.div>
              </motion.div>

              {/* Welcome Text with Different Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="relative"
              >
                {/* Floating particles animation */}
                <div className="absolute inset-0 -z-10">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-60"
                      animate={{
                        x: [0, 30, -20, 40, 0],
                        y: [0, -40, 20, -30, 0],
                        scale: [1, 1.5, 0.8, 1.2, 1],
                        opacity: [0.6, 1, 0.4, 0.8, 0.6]
                      }}
                      transition={{
                        duration: 4 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + (i % 3) * 20}%`
                      }}
                    />
                  ))}
                </div>

                {/* Typewriter effect text */}
              <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                  className="overflow-hidden whitespace-nowrap mx-auto text-center"
                >
                  <motion.span
                    className="text-xl font-semibold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0%", "100%", "0%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: "200% 100%"
                    }}
                  >
                    Discover Your Perfect Living Experience
                  </motion.span>
                </motion.div>


                
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Search Section */}
      <section className="pt-8 pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="-mt-6"
          >
            {/* Input Field Container */}
            <div className="bg-white border-2 border-red-600 rounded-lg overflow-hidden shadow-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter city name, area etc..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-8 pr-32 py-5 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 text-base font-medium"
                />
                {/* Current Location Button */}
                <button 
                  onClick={handleCurrentLocation}
                  className="absolute right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
                >
                  <MapPin className="h-6 w-6 text-white" />
                </button>
                {/* Search Button */}
                <button 
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
                >
                  <Search className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Text Content Below Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.8 }}
            className="text-center mt-8"
          >
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Find Your Perfect{' '}
              <motion.span
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent bg-[length:200%_100%]"
              >
                Co-Living Space
              </motion.span>
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Connect with like-minded roommates and discover verified PG accommodations near you. 
              <span className="text-red-600 font-medium"> Smart matching</span>, 
              <span className="text-orange-600 font-medium"> transparent pricing</span>, 
              <span className="text-yellow-600 font-medium"> hassle-free living</span>.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Accommodations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured{' '}
                <span className="text-red-600">Accommodations</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover hand-picked, verified rooms near your location with the best amenities and roommate matches.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAccommodations.map((accommodation, index) => (
              <ScrollReveal key={accommodation.id} direction="up" delay={index * 0.1}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Image Section */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
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

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{accommodation.title}</h3>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{accommodation.location}</span>
                      <span className="text-sm text-gray-500">• {accommodation.distance}</span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {accommodation.amenities.map((amenity, index) => (
                        <span key={index} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </span>
                      ))}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-red-600">{accommodation.price}</span>
                        <span className="text-sm text-gray-500">/month</span>
                      </div>
                      <button className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* View All Button */}
          <ScrollReveal>
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
              >
                View All Rooms
              </motion.button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Choose Lyvo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose{' '}
                <span className="text-red-600">Lyvo</span><span className="text-black">+</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Experience the future of co-living with our innovative platform that combines technology, 
                security, and community to make finding your perfect living space effortless.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 font-display">
              Ready to Find Your <span className="text-orange-300">Perfect Space</span>?
            </h2>
            <p className="text-2xl text-red-100 mb-12 font-medium max-w-3xl mx-auto">
              Join thousands of people who have found their ideal co-living space with Lyvo+.
            </p>
            <Link to="/signup">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-600 px-12 py-6 rounded-2xl font-bold text-2xl flex items-center space-x-4 shadow-2xl hover:shadow-3xl transition-all duration-300 mx-auto group relative overflow-hidden"
              >
                <span className="relative z-10">Get Started Today</span>
                <ArrowRight className="w-7 h-7 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;