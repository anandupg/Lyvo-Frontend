import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Home, 
  Users, 
  Shield, 
  Calculator, 
  MapPin,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  Trash2,
  MoreVertical
} from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm Lyvo+ Assistant. I can help you find the perfect co-living space, answer questions about our services, or assist with bookings. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.chatbot-menu')) {
        handleCloseMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Dummy responses for Lyvo+ co-living platform
  const botResponses = {
    greeting: [
      "Hello! Welcome to Lyvo+. I'm here to help you find your perfect co-living space!",
      "Hi there! Ready to discover amazing co-living opportunities?",
      "Welcome to Lyvo+! Let's find you the ideal living space with great roommates."
    ],
    pricing: [
      "Our rooms start from ₹8,000/month for shared spaces and ₹15,000/month for single rooms. Prices vary by location and amenities. Would you like to see our current listings?",
      "Pricing depends on location, room type, and amenities. Single rooms range from ₹12,000-25,000/month, while shared spaces start at ₹8,000/month. All prices include utilities!",
      "We offer flexible pricing options! Single rooms: ₹12,000-25,000/month, Shared rooms: ₹8,000-15,000/month. All inclusive of WiFi, utilities, and basic amenities."
    ],
    locations: [
      "We have properties in prime locations across Bangalore: Koramangala, Indiranagar, HSR Layout, Whitefield, and Electronic City. Which area interests you?",
      "Our properties are strategically located in Bangalore's best neighborhoods. We have 50+ locations including Koramangala, Indiranagar, HSR Layout, and more!",
      "Currently, we operate in Bangalore with plans to expand to Mumbai, Delhi, and Hyderabad. Our Bangalore locations include all major tech hubs and residential areas."
    ],
    amenities: [
      "All our properties include: High-speed WiFi, 24/7 security, housekeeping, laundry facilities, common kitchen, and co-working spaces. Some locations also have gyms and cafeterias!",
      "Standard amenities: WiFi, security, cleaning, kitchen access, and common areas. Premium locations include gyms, cafeterias, gaming rooms, and rooftop spaces.",
      "We provide WiFi, security, housekeeping, shared kitchens, study areas, and common lounges. Premium properties also feature gyms, cafeterias, and recreational facilities."
    ],
    booking: [
      "To book a room, you can: 1) Browse our listings, 2) Schedule a virtual or in-person tour, 3) Complete the application form, 4) Sign the digital agreement. The process takes 2-3 days!",
      "Booking is simple! Visit any room listing, click 'Book Now', fill the application, and we'll get back within 24 hours. You can also schedule a tour first.",
      "Our booking process: Select a room → Schedule tour → Submit application → Digital agreement → Move in! We typically process applications within 48 hours."
    ],
    roommate: [
      "We use AI-powered compatibility matching based on lifestyle, work schedule, cleanliness preferences, and interests. You can also specify gender preferences and age range.",
      "Our roommate matching considers work schedules, lifestyle habits, cleanliness standards, and personal interests. We ensure compatible living arrangements for everyone.",
      "We match roommates using advanced algorithms that consider lifestyle compatibility, work schedules, and personal preferences. You can also choose your own roommates if you prefer."
    ],
    security: [
      "All properties have 24/7 security, CCTV cameras, secure entry systems, and verified property owners. We also conduct background checks on all residents.",
      "Security features include: 24/7 guards, CCTV surveillance, secure access cards, and emergency response systems. All property owners are background-verified.",
      "Your safety is our priority! We provide 24/7 security, surveillance systems, secure access, and verified property owners. All residents undergo background verification."
    ],
    payment: [
      "We accept online payments via UPI, cards, and net banking. Rent is typically paid monthly, and we offer flexible payment plans. No hidden charges!",
      "Payment options: UPI, credit/debit cards, net banking, and digital wallets. Rent is due monthly, and we provide transparent billing for all utilities.",
      "Payments can be made online through our secure portal. We accept UPI, cards, and net banking. Monthly rent includes utilities with no hidden costs."
    ],
    support: [
      "Our support team is available 24/7 via chat, phone (+91 98765 43210), or email (support@lyvoplus.com). We typically respond within 2 hours!",
      "You can reach us anytime at support@lyvoplus.com or call +91 98765 43210. Our team responds within 2 hours and is available 24/7.",
      "24/7 support available! Contact us at support@lyvoplus.com or +91 98765 43210. We also have in-app chat support for immediate assistance."
    ],
    default: [
      "I'm here to help with co-living questions! You can ask about pricing, locations, amenities, booking process, roommate matching, security, payments, or support.",
      "I can assist with finding rooms, understanding our services, booking process, roommate matching, and general inquiries. What would you like to know?",
      "Feel free to ask about our co-living spaces, pricing, locations, amenities, booking process, or any other questions about Lyvo+!"
    ]
  };

  const quickReplies = [
    { text: "Pricing", category: "pricing" },
    { text: "Locations", category: "locations" },
    { text: "Amenities", category: "amenities" },
    { text: "How to Book", category: "booking" },
    { text: "Roommate Matching", category: "roommate" },
    { text: "Security", category: "security" },
    { text: "Payment Options", category: "payment" },
    { text: "Contact Support", category: "support" }
  ];

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('price') || message.includes('cost') || message.includes('rent') || message.includes('fee')) {
      return botResponses.pricing[Math.floor(Math.random() * botResponses.pricing.length)];
    } else if (message.includes('location') || message.includes('area') || message.includes('where') || message.includes('place')) {
      return botResponses.locations[Math.floor(Math.random() * botResponses.locations.length)];
    } else if (message.includes('amenity') || message.includes('facility') || message.includes('wifi') || message.includes('gym')) {
      return botResponses.amenities[Math.floor(Math.random() * botResponses.amenities.length)];
    } else if (message.includes('book') || message.includes('apply') || message.includes('reserve') || message.includes('process')) {
      return botResponses.booking[Math.floor(Math.random() * botResponses.booking.length)];
    } else if (message.includes('roommate') || message.includes('flatmate') || message.includes('match') || message.includes('compatibility')) {
      return botResponses.roommate[Math.floor(Math.random() * botResponses.roommate.length)];
    } else if (message.includes('security') || message.includes('safe') || message.includes('guard') || message.includes('cctv')) {
      return botResponses.security[Math.floor(Math.random() * botResponses.security.length)];
    } else if (message.includes('payment') || message.includes('pay') || message.includes('upi') || message.includes('card')) {
      return botResponses.payment[Math.floor(Math.random() * botResponses.payment.length)];
    } else if (message.includes('support') || message.includes('help') || message.includes('contact') || message.includes('call')) {
      return botResponses.support[Math.floor(Math.random() * botResponses.support.length)];
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    } else {
      return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (category) => {
    const response = getBotResponse(category);
    handleSendMessage(category);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        content: "Hi! I'm Lyvo+ Assistant. I can help you find the perfect co-living space, answer questions about our services, or assist with bookings. How can I help you today?",
        timestamp: new Date()
      }
    ]);
    setShowClearConfirm(false);
    setShowMenu(false);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
    setShowClearConfirm(false);
  };

  return (
    <>
             {/* Chatbot Toggle Button */}
      <motion.div
         className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 2 
        }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
           className="relative w-16 h-16 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center text-white border-2 border-white/20"
           whileHover={{ scale: 1.1, rotate: 5 }}
           whileTap={{ scale: 0.9, rotate: -5 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                                 <X className="w-7 h-7 sm:w-7 sm:h-7" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                 transition={{ duration: 0.3 }}
              >
                 <MessageCircle className="w-7 h-7 sm:w-7 sm:h-7" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulse animation to attract attention */}
          <motion.div
             className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 opacity-30"
             animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 3 }}
          />
           
           {/* Notification dot */}
           <motion.div
             className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ duration: 1.5, repeat: Infinity }}
           />
        </motion.button>
      </motion.div>

             {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
             initial={{ opacity: 0, scale: 0.8, y: 20, rotateX: -15 }}
             animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
             exit={{ opacity: 0, scale: 0.8, y: 20, rotateX: -15 }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
                           className="fixed bottom-24 right-4 z-20 w-[320px] h-[500px] sm:bottom-32 sm:right-20 bg-gradient-to-br from-white to-gray-50 rounded-[2rem] shadow-2xl border border-gray-200/50 backdrop-blur-sm flex flex-col"
             style={{
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
             }}
           >
                         {/* Header */}
             <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white p-3 rounded-t-[2rem]">
               {/* Background pattern */}
               <div className="absolute inset-0 opacity-10">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-10 -mt-10"></div>
                 <div className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-full -ml-6 -mb-6"></div>
               </div>
               
               <div className="relative flex items-center space-x-2">
                 <div className="relative">
                   <div className="w-9 h-9 sm:w-8 sm:h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                     <Home className="w-5 h-5 sm:w-4 sm:h-4" />
                   </div>
                   <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                 </div>
                 <div className="flex-1">
                   <h3 className="font-bold text-base sm:text-sm">Lyvo+ Assistant</h3>
                   <p className="text-sm sm:text-xs text-red-100 flex items-center space-x-1">
                     <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                     <span>Online • Ready to help</span>
                   </p>
                 </div>
                                   <div className="relative chatbot-menu">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMenu(!showMenu)}
                      className="w-7 h-7 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm"
                    >
                      <MoreVertical className="w-4 h-4 sm:w-3 sm:h-3" />
                    </motion.button>
                    
                    {/* Menu Dropdown */}
                    <AnimatePresence>
                      {showMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-30"
                        >
                          <div className="p-1">
                            <motion.button
                              whileHover={{ backgroundColor: '#fef2f2' }}
                              onClick={() => setShowClearConfirm(true)}
                              className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-red-600 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Clear Chat</span>
                            </motion.button>
                </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 sm:w-3 sm:h-3" />
                  </motion.button>
              </div>
            </div>

                         {/* Messages */}
             <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-gray-50/50 to-white/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                     className={`max-w-[88%] p-3 sm:p-2.5 rounded-xl shadow-sm ${
                       message.type === 'user'
                         ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg'
                         : 'bg-white text-gray-800 border border-gray-100 shadow-md'
                     }`}
                     style={{
                       boxShadow: message.type === 'user' 
                         ? '0 10px 25px -5px rgba(239, 68, 68, 0.3)' 
                         : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                     }}
                   >
                     <p className="text-sm sm:text-xs leading-relaxed">{message.content}</p>
                     <p className={`text-xs mt-1.5 flex items-center space-x-1 ${
                       message.type === 'user' ? 'text-red-100' : 'text-gray-400'
                     }`}>
                       <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       {message.type === 'user' && (
                         <>
                           <span>•</span>
                           <span>Sent</span>
                         </>
                       )}
                    </p>
                  </div>
                </motion.div>
              ))}
              
                             {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
                >
                   <div className="bg-white border border-gray-100 p-3 sm:p-2.5 rounded-xl shadow-md">
                     <div className="flex items-center space-x-2">
                       <div className="w-6 h-6 sm:w-5 sm:h-5 bg-red-100 rounded-full flex items-center justify-center">
                         <Home className="w-3 h-3 sm:w-2.5 sm:h-2.5 text-red-500" />
                       </div>
                    <div className="flex space-x-1">
                      <motion.div
                           className="w-2 h-2 sm:w-1.5 sm:h-1.5 bg-red-400 rounded-full"
                           animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                           className="w-2 h-2 sm:w-1.5 sm:h-1.5 bg-red-400 rounded-full"
                           animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                           className="w-2 h-2 sm:w-1.5 sm:h-1.5 bg-red-400 rounded-full"
                           animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                       </div>
                       <span className="text-sm sm:text-xs text-gray-500 ml-1">Lyvo+ is typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

                         {/* Quick Replies */}
             {messages.length === 1 && (
               <div className="px-3 pb-2">
                 <p className="text-xs text-gray-500 mb-2 font-medium">Quick questions:</p>
                 <div className="flex flex-wrap gap-1.5">
                   {quickReplies.slice(0, 4).map((reply, index) => (
                     <motion.button
                       key={index}
                       onClick={() => handleQuickReply(reply.text)}
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="px-3 py-2 sm:px-2.5 sm:py-1.5 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 text-sm sm:text-xs rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                     >
                       {reply.text}
                     </motion.button>
                   ))}
                 </div>
               </div>
             )}

                         {/* Input */}
             <div className="flex-shrink-0 px-3 pt-4 pb-5 border-t border-gray-200 bg-white shadow-sm rounded-b-[2rem]">
               <div className="flex space-x-2 mb-2">
                 <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                     placeholder="Ask about rooms, pricing, amenities..."
                     className="w-full px-4 py-2.5 sm:px-3 sm:py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-xs bg-white shadow-sm hover:shadow-md transition-all duration-200"
                   />
                   <div className="absolute right-3 sm:right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                     <MessageCircle className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                   </div>
                 </div>
                <motion.button
                   onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                   className="px-4 py-2.5 sm:px-3 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                   <Send className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </motion.button>
              </div>
               <p className="text-xs text-gray-400 text-center">
                 Press Enter to send • Available 24/7
               </p>
            </div>
          </motion.div>
        )}
             </AnimatePresence>

       {/* Clear Chat Confirmation Modal */}
       <AnimatePresence>
         {showClearConfirm && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
             onClick={handleCloseMenu}
           >
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               onClick={(e) => e.stopPropagation()}
               className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
             >
               <div className="text-center">
                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Trash2 className="w-6 h-6 text-red-500" />
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Chat History?</h3>
                 <p className="text-sm text-gray-600 mb-6">
                   This will delete all messages and start a new conversation. This action cannot be undone.
                 </p>
                 <div className="flex space-x-3">
                   <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={handleCloseMenu}
                     className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                   >
                     Cancel
                   </motion.button>
                   <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={handleClearChat}
                     className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors duration-200"
                   >
                     Clear Chat
                   </motion.button>
                 </div>
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot; 