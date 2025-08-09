import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader, Mail } from "lucide-react";
import axios from "axios";

const API_URL = 'http://localhost:4002/api/user';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        return;
      }
      if (isVerifying) return;
      setIsVerifying(true);

      try {
        const response = await axios.get(`${API_URL}/verify-email/${token}`);
        if (response.status === 200 && response.data.user && response.data.token) {
          setStatus('success');
          setMessage(response.data.message || 'Email verified successfully!');
          setUser(response.data.user);
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          window.dispatchEvent(new Event('lyvo-login'));
          setTimeout(() => {
            // Redirect based on role
            if (response.data.user.role === 2) {
              navigate('/admin-dashboard');
            } else if (response.data.user.role === 3) {
              navigate('/room-owner-dashboard');
            } else {
              navigate('/dashboard');
            }
          }, 3000);
          return; // Prevents any further code from running
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        if (error.response?.status === 400) {
          setMessage(error.response.data.message || 'Invalid or expired verification token.');
        } else if (error.response?.status === 500) {
          setMessage('Server error. Please try again later.');
        } else {
          setMessage('Verification failed. Please check your internet connection and try again.');
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
    // Only run once on mount
    // eslint-disable-next-line
  }, []);

  const getStatusContent = () => {
    switch (status) {
      case 'verifying':
        return {
          icon: <Loader className="w-12 h-12 animate-spin text-red-500" />,
          title: 'Verifying your email...',
          message: 'Please wait while we verify your email address.',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          title: 'Email Verified Successfully!',
          message: message,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700'
        };
      case 'error':
        return {
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          title: 'Verification Failed',
          message: message,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: <Mail className="w-12 h-12 text-gray-500" />,
          title: 'Email Verification',
          message: 'Processing your verification request...',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700'
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"
          >
            <span className="text-2xl">🏠</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 font-display">
            Email Verification
          </h2>
          <p className="mt-2 text-gray-600">
            Completing your account setup
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-white rounded-2xl shadow-xl p-8 border ${content.borderColor}`}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="mb-6"
            >
              {content.icon}
            </motion.div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-display">
              {content.title}
            </h3>
            
            <p className={`text-sm ${content.textColor} mb-6`}>
              {content.message}
            </p>

            {status === 'success' && user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
              >
                <p className="text-sm text-green-700">
                  Welcome, <span className="font-semibold">{user.name}</span>! 
                  You're now part of the Lyvo+ community.
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full border border-red-500 text-red-500 py-3 px-4 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                  Sign Up Again
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Go to Login
                </button>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Redirecting to dashboard...</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail; 