import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Home, Users, Shield, Calculator, MapPin } from "lucide-react";

const Demo = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "24/7 Support",
      description: "Get instant help with any co-living questions"
    },
    {
      icon: Home,
      title: "Room Search",
      description: "Find the perfect accommodation near you"
    },
    {
      icon: Users,
      title: "Roommate Matching",
      description: "AI-powered compatibility matching"
    },
    {
      icon: Shield,
      title: "Security Info",
      description: "Learn about our safety features"
    },
    {
      icon: Calculator,
      title: "Pricing Details",
      description: "Transparent cost breakdown"
    },
    {
      icon: MapPin,
      title: "Location Guide",
      description: "Explore our properties"
    }
  ];

  const sampleQuestions = [
    "What are your room prices?",
    "Do you have properties in Koramangala?",
    "What amenities are included?",
    "How does roommate matching work?",
    "Is the area safe and secure?",
    "What payment methods do you accept?",
    "How do I book a room?",
    "Can I schedule a property tour?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-red-600">Lyvo</span><span className="text-black">+</span> <span className="text-red-500">Chatbot</span> Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience our intelligent assistant that helps you find the perfect co-living space, 
            answers your questions, and guides you through the booking process.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Sample Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Try These Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleQuestions.map((question, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors duration-200"
              >
                <p className="text-gray-700 font-medium">"{question}"</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How to Use */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">How to Use the Chatbot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Click the Chat Icon</h3>
              <p className="text-red-100">Find the floating chat button in the bottom-right corner</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Ask Your Question</h3>
              <p className="text-red-100">Type your question or use the quick reply buttons</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Instant Help</h3>
              <p className="text-red-100">Receive helpful answers and guidance immediately</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to experience the <span className="text-red-600">Lyvo</span><span className="text-black">+</span> chatbot?
          </p>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Try the Chatbot Now</span>
            </motion.button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Look for the chat icon in the bottom-right corner of your screen
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Demo; 