import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';
import chatService from '../../services/chatService';
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
  CheckCheck,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Get user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Initialize chat service
    const token = localStorage.getItem('authToken');
    if (token) {
      chatService.connect(token);
      
      // Set up event listeners
      chatService.on('connected', () => {
        setConnectionStatus('connected');
        loadUserChats();
      });

      chatService.on('disconnected', () => {
        setConnectionStatus('disconnected');
      });

      chatService.on('error', (error) => {
        console.error('Chat service error:', error);
        setConnectionStatus('error');
      });

      chatService.on('receive_message', (messageData) => {
        console.log('Received message:', messageData);
        setMessages(prev => [...prev, messageData]);
        
        // Update conversation last message
        setConversations(prev => prev.map(conv => 
          conv.chatId === messageData.chatId 
            ? { 
                ...conv, 
                lastMessage: messageData.content,
                lastMessageTime: new Date(messageData.createdAt).toLocaleTimeString(),
                unreadCount: messageData.senderId !== userData.id ? (conv.unreadCount || 0) + 1 : conv.unreadCount
              }
            : conv
        ));
      });

      chatService.on('messages_read', (data) => {
        console.log('Messages read:', data);
        // Update message read status
        setMessages(prev => prev.map(msg => 
          data.messageIds.includes(msg.messageId) 
            ? { ...msg, readBy: [...(msg.readBy || []), data.readBy] }
            : msg
        ));
      });

      chatService.on('user_typing', (data) => {
        setOtherUserTyping(data.isTyping);
      });

      chatService.on('chat_joined', (data) => {
        console.log('Joined chat:', data);
      });

      // Load initial data
      loadUserChats();
    } else {
      setLoading(false);
    }

    return () => {
      chatService.disconnect();
    };
  }, []);

  const loadUserChats = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const chats = await chatService.getUserChats(userData.id || userData._id);
      
      // Transform chats to match UI format with real user details
      const transformedChats = chats.map(chat => ({
        chatId: chat.chatId,
        bookingId: chat.bookingId,
        seeker: {
          id: chat.otherParticipant?.id || chat.otherParticipantId,
          name: chat.otherParticipant?.name || `Tenant ${chat.otherParticipantId?.slice(-4) || 'Unknown'}`,
          email: chat.otherParticipant?.email,
          phone: chat.otherParticipant?.phone,
          avatar: chat.otherParticipant?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          property: chat.propertyDetails?.name || `Property ${chat.bookingId?.slice(-4) || 'Unknown'}`,
          address: chat.propertyDetails?.address,
          status: "online"
        },
        propertyDetails: chat.propertyDetails,
        bookingDetails: chat.bookingDetails,
        lastMessage: chat.lastMessage?.content || "No messages yet",
        lastMessageTime: chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString() : "No messages",
        unreadCount: chat.unreadCount || 0,
        status: chat.status
      }));

      setConversations(transformedChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatMessages = async (chatId) => {
    try {
      const chatMessages = await chatService.getChatMessages(chatId);
      setMessages(chatMessages);
      
      // Join the chat room
      chatService.joinChat(chatId);
      
      // Mark messages as read
      chatService.markAsRead();
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    loadChatMessages(chat.chatId);
    
    // Reset unread count
    setConversations(prev => prev.map(conv => 
      conv.chatId === chat.chatId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      chatService.sendMessage(message.trim());
      setMessage('');
      
      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      chatService.setTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (selectedChat) {
      // Set typing indicator
      chatService.setTyping(true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Clear typing indicator after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        chatService.setTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredConversations = conversations.filter(conv =>
    conv.seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.seeker.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <OwnerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout hideFooter>
      <div className="h-[calc(100vh-120px)] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
        {/* Connection Status */}
        <div className={`px-4 py-2 text-sm text-center ${
          connectionStatus === 'connected' 
            ? 'bg-green-100 text-green-800' 
            : connectionStatus === 'error'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {connectionStatus === 'connected' && '🟢 Connected to chat service'}
          {connectionStatus === 'error' && '🔴 Connection error - Retrying...'}
          {connectionStatus === 'disconnected' && '🟡 Connecting to chat service...'}
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Conversations Sidebar */}
          <div className={`${
            selectedChat 
              ? 'hidden lg:flex lg:w-80'
              : 'flex w-full lg:w-80'
          } bg-white border-r border-gray-200 flex-col`}>
            {/* Header */}
            <div className="p-4 bg-red-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold">Messages</h1>
                  <p className="text-xs sm:text-sm text-red-100">Chat with your tenants</p>
                </div>
                <button
                  onClick={loadUserChats}
                  className="p-2 hover:bg-red-700 rounded-lg transition-colors"
                  title="Refresh chats"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
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
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Chats will appear here after booking approval
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.chatId}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedChat?.chatId === conversation.chatId ? 'bg-red-50 border-r-4 border-r-red-500' : ''
                    }`}
                    onClick={() => handleChatSelect(conversation)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <img
                          src={conversation.seeker.avatar}
                          alt={conversation.seeker.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          conversation.seeker.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {conversation.seeker.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {conversation.seeker.property}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 truncate flex-1">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${
            selectedChat 
              ? 'flex flex-col w-full lg:flex-1'
              : 'hidden lg:flex lg:flex-1'
          }`}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedChat.seeker.avatar}
                      alt={selectedChat.seeker.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedChat.seeker.name}</h3>
                      <p className="text-sm text-gray-600">{selectedChat.seeker.property}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                        <p className="text-sm text-gray-400">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 px-4 py-4">
                      {messages.map((msg) => {
                        // Determine if this message is from the current user
                        const currentUserId = user?.id || user?._id;
                        const senderId = msg.senderId || msg.sender;
                        const isCurrentUserMessage = String(senderId) === String(currentUserId);
                        
                        return (
                          <div
                            key={msg.messageId || msg.id}
                            className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'} mb-3`}
                          >
                            <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                              isCurrentUserMessage
                                ? 'bg-red-600 text-white rounded-br-md' // Sent messages on right (red)
                                : 'bg-gray-100 text-gray-900 rounded-bl-md' // Received messages on left (gray)
                            }`}>
                              <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                              <div className={`flex items-center mt-2 space-x-1 ${
                                isCurrentUserMessage ? 'justify-end' : 'justify-start'
                              }`}>
                                <span className="text-xs opacity-70">
                                  {new Date(msg.createdAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                                {isCurrentUserMessage && (
                                  <CheckCheck className="w-3 h-3 opacity-70" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Typing Indicator */}
                      {otherUserTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-md">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-end space-x-3">
                    <button 
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                      title="Attach file"
                    >
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        value={message}
                        onChange={handleTyping}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[44px] max-h-32"
                        rows="1"
                        disabled={connectionStatus !== 'connected'}
                        style={{
                          height: 'auto',
                          overflow: 'hidden'
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                        }}
                      />
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Emoji"
                      >
                        <Smile className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || connectionStatus !== 'connected'}
                      className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                      title="Send message"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-sm">Choose a chat to start messaging</p>
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