import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { 
  MessageCircle, 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  Smile,
  Check,
  CheckCheck
} from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  // Mock data for conversations
  const [conversations] = useState([
    {
      id: 1,
      tenant: {
        id: 1,
        name: "Rahul Sharma",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        property: "Sunset Apartments - Unit 2A",
        status: "online"
      },
      lastMessage: "Hi, I have a maintenance request for the kitchen sink",
      lastMessageTime: "2 min ago",
      unreadCount: 2,
      messages: [
        {
          id: 1,
          sender: "tenant",
          text: "Hi, I have a maintenance request for the kitchen sink",
          timestamp: "10:30 AM",
          status: "read"
        },
        {
          id: 2,
          sender: "owner",
          text: "Hello Rahul! What's the issue with the sink?",
          timestamp: "10:32 AM",
          status: "read"
        },
        {
          id: 3,
          sender: "tenant",
          text: "The water is not draining properly and there's a leak under the cabinet",
          timestamp: "10:35 AM",
          status: "read"
        },
        {
          id: 4,
          sender: "owner",
          text: "I'll send a plumber tomorrow morning. Is it urgent or can it wait?",
          timestamp: "10:37 AM",
          status: "read"
        },
        {
          id: 5,
          sender: "tenant",
          text: "It's not urgent, tomorrow is fine. Thank you!",
          timestamp: "10:40 AM",
          status: "read"
        }
      ]
    },
    {
      id: 2,
      tenant: {
        id: 2,
        name: "Priya Patel",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        property: "Green Valley Residences - House 3",
        status: "offline"
      },
      lastMessage: "The rent has been transferred to your account",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: "tenant",
          text: "Hi, I've transferred the rent for this month",
          timestamp: "9:15 AM",
          status: "read"
        },
        {
          id: 2,
          sender: "owner",
          text: "Thank you Priya! I've received the payment",
          timestamp: "9:20 AM",
          status: "read"
        },
        {
          id: 3,
          sender: "tenant",
          text: "The rent has been transferred to your account",
          timestamp: "9:25 AM",
          status: "read"
        }
      ]
    },
    {
      id: 3,
      tenant: {
        id: 3,
        name: "Amit Kumar",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        property: "City Center Flats - Studio 5",
        status: "online"
      },
      lastMessage: "Can I extend my lease for another 6 months?",
      lastMessageTime: "3 hours ago",
      unreadCount: 1,
      messages: [
        {
          id: 1,
          sender: "tenant",
          text: "Hi, my lease is ending next month",
          timestamp: "8:00 AM",
          status: "read"
        },
        {
          id: 2,
          sender: "owner",
          text: "Hello Amit! Yes, I can see that. What are your plans?",
          timestamp: "8:05 AM",
          status: "read"
        },
        {
          id: 3,
          sender: "tenant",
          text: "Can I extend my lease for another 6 months?",
          timestamp: "8:10 AM",
          status: "read"
        }
      ]
    },
    {
      id: 4,
      tenant: {
        id: 4,
        name: "Neha Singh",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        property: "Tech Park Residences - Apt 12B",
        status: "offline"
      },
      lastMessage: "The new AC unit is working perfectly, thank you!",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: "tenant",
          text: "The new AC unit is working perfectly, thank you!",
          timestamp: "Yesterday",
          status: "read"
        }
      ]
    }
  ]);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (!authToken || !userData) {
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (user.role !== 3) {
          navigate('/login');
          return;
        }
        setUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setShouldAutoScroll(false); // Reset after scrolling
    }
  }, [shouldAutoScroll]);

  const filteredConversations = conversations.filter(conv =>
    conv.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.tenant.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'owner',
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Update the selected chat with new message
    setSelectedChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: newMessage.text,
      lastMessageTime: 'Just now',
      unreadCount: 0
    }));

    // Update the conversation in the list
    const updatedConversations = conversations.map(conv =>
      conv.id === selectedChat.id
        ? {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage.text,
            lastMessageTime: 'Just now',
            unreadCount: 0
          }
        : conv
    );

    // In a real app, you would send this to your backend
    console.log('Sending message:', newMessage);
    
    setMessage('');
    
    // Trigger auto-scroll after sending a message
    setTimeout(() => setShouldAutoScroll(true), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-500' : 'bg-gray-400';
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout hideFooter>
      <div className="h-[calc(100vh-120px)] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
        {/* Mobile: Show conversations list when no chat is selected, or show chat when selected */}
        {/* Desktop: Always show both side by side */}
        <div className="flex flex-col lg:flex-row h-full">
          {/* Conversations Sidebar - Always visible on desktop, conditional on mobile */}
          <div className={`${
            selectedChat 
              ? 'hidden lg:flex lg:w-80' // Hide on mobile when chat is open, show on desktop
              : 'flex w-full lg:w-80' // Show full width on mobile when no chat, normal width on desktop
          } bg-white border-r border-gray-200 flex-col`}>
            {/* Header */}
            <div className="p-4 bg-red-600 text-white">
              <h1 className="text-lg sm:text-xl font-semibold">Messages</h1>
              <p className="text-xs sm:text-sm text-red-100">Chat with your tenants</p>
            </div>

            {/* Search */}
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto bg-white">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                    selectedChat?.id === conversation.id ? 'bg-red-50' : ''
                  }`}
                  onClick={() => setSelectedChat(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.tenant.avatar}
                        alt={conversation.tenant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.tenant.status)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.tenant.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {conversation.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-1">
                        {conversation.tenant.property}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700 truncate flex-1">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="flex-shrink-0 ml-2">
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area - Full screen on mobile when open */}
          <div className={`${
            selectedChat 
              ? 'w-full lg:flex-1' // Full width on mobile when chat is open, normal flex on desktop
              : 'hidden lg:flex lg:flex-1' // Hidden on mobile when no chat, normal flex on desktop
          } flex flex-col min-h-0`}>
            {selectedChat ? (
              <>
                {/* Chat Header with Back Button on Mobile */}
                <div className="p-3 bg-red-600 text-white border-b border-red-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Back Button - Only visible on mobile */}
                      <button 
                        onClick={() => setSelectedChat(null)}
                        className="lg:hidden p-1 text-white hover:bg-red-700 rounded-full transition-colors duration-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <img
                        src={selectedChat.tenant.avatar}
                        alt={selectedChat.tenant.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">
                          {selectedChat.tenant.name}
                        </h3>
                        <p className="text-sm text-red-100">
                          {selectedChat.tenant.property}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-white hover:bg-red-700 rounded-full transition-colors duration-200">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-white hover:bg-red-700 rounded-full transition-colors duration-200">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-white hover:bg-red-700 rounded-full transition-colors duration-200">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-gray-100">
                  <div className="p-4 pb-6 space-y-3">
                    {selectedChat.messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'owner' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          msg.sender === 'owner'
                            ? 'bg-red-600 text-white rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <div className={`flex items-center justify-end mt-2 space-x-1 ${
                            msg.sender === 'owner' ? 'text-red-100' : 'text-gray-400'
                          }`}>
                            <span className="text-xs">{msg.timestamp}</span>
                            {msg.sender === 'owner' && (
                              <span className="ml-1">
                                {getMessageStatusIcon(msg.status)}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Fixed space at bottom for better scrolling */}
                  <div className="h-4 bg-gray-100" />
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message"
                        rows={1}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-red-500 focus:bg-white resize-none text-sm"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        message.trim()
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State - Only visible on desktop */
              <div className="hidden lg:flex flex-1 items-center justify-center p-4 bg-gray-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default Messages;
