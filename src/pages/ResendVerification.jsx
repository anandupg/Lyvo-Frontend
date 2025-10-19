import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, XCircle, ArrowLeft, Loader } from "lucide-react";
import axios from "axios";

const API_URL = 'http://localhost:4002/api/user';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [emailStatus, setEmailStatus] = useState(null); // null, 'checking', 'verified', 'unverified', 'not_found'
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const navigate = useNavigate();

  // Debounced email checking
  useEffect(() => {
    if (!email.trim()) {
      setEmailStatus(null);
      setMessage('');
      setMessageType('');
      return;
    }

    const timeoutId = setTimeout(async () => {
      await checkEmailVerificationStatus(email.trim());
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [email]);

  const checkEmailVerificationStatus = async (emailToCheck) => {
    try {
      setIsCheckingEmail(true);
      setEmailStatus('checking');
      
      const response = await axios.get(`${API_URL}/check-email?email=${encodeURIComponent(emailToCheck)}`);
      
      if (response.data.exists && response.data.isVerified) {
        setEmailStatus('verified');
        setMessage('This email is already verified. Please log in to your account.');
        setMessageType('info');
      } else if (response.data.isUnverified) {
        setEmailStatus('unverified');
        setMessage('This email is registered but not verified. You can request a new verification email.');
        setMessageType('info');
      } else {
        setEmailStatus('not_found');
        setMessage('This email is not registered. Please check your email address or sign up for a new account.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Email check error:', error);
      setEmailStatus('error');
      setMessage('Unable to check email status. Please try again.');
      setMessageType('error');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || emailStatus === 'verified' || emailStatus === 'not_found') return;

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await axios.post(`${API_URL}/resend-verification`, {
        email: email.trim()
      });

      if (response.status === 200) {
        setMessage('Verification email sent! Please check your inbox and spam folder.');
        setMessageType('success');
        setEmail(''); // Clear the form
        setEmailStatus(null);
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to send verification email.';
        setMessage(errorMessage);
        
        if (error.response.status === 404) {
          setMessageType('error');
        } else if (error.response.status === 400) {
          setMessageType('info');
        } else {
          setMessageType('error');
        }
      } else {
        setMessage('Network error. Please check your internet connection and try again.');
        setMessageType('error');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Mail className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getMessageStyles = () => {
    switch (messageType) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const isButtonDisabled = () => {
    return loading || !email.trim() || emailStatus === 'verified' || emailStatus === 'not_found' || emailStatus === 'checking' || isCheckingEmail;
  };

  const getButtonText = () => {
    if (loading) return "Sending...";
    if (isCheckingEmail || emailStatus === 'checking') return "Checking...";
    if (emailStatus === 'verified') return "Email Already Verified";
    if (emailStatus === 'not_found') return "Email Not Found";
    return "Send Verification Email";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Lyvo+ Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden">
                    <img 
                      src="/Lyvo_no_bg.png" 
                      alt="Lyvo Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900"><span className="text-red-600">Lyvo</span><span className="text-black">+</span></span>
                  <span className="text-xs text-gray-500 font-medium">Co-Living Platform</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Resend Verification Email
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email address to receive a new verification link
            </p>
          </div>

          {/* Message Display */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 border rounded-lg px-4 py-3 flex items-center gap-3 ${getMessageStyles()}`}
              >
                {getMessageIcon()}
                <span className="text-sm font-medium">{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {isCheckingEmail && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: emailStatus === 'unverified' ? 1.02 : 1 }}
              whileTap={{ scale: emailStatus === 'unverified' ? 0.98 : 1 }}
              type="submit"
              disabled={isButtonDisabled()}
              className={`w-full py-3 px-4 rounded-lg font-semibold shadow-sm transition-all duration-200 ${
                emailStatus === 'unverified' 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {getButtonText()}
            </motion.button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center space-y-3">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700 hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
            
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Don't have an account?</p>
              <Link
                to="/signup"
                className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Sign up for Lyvo+
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResendVerification;
