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
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);

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
      setHasAttemptedVerification(true);

      try {
        console.log('Verifying email with token:', token);
        const response = await axios.get(`${API_URL}/verify-email/${token}`, {
          timeout: 10000 // 10 second timeout
        });
        console.log('Verification response:', response);
        
        // Check if the response is successful (status 200-299)
        if (response.status >= 200 && response.status < 300) {
          // Check if we have the required data
          if (response.data && response.data.user && response.data.token) {
            console.log('Verification successful, setting success state');
            setStatus('success');
            setMessage(response.data.message || 'Email verified successfully!');
            setUser(response.data.user);
            
            // Store authentication data
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Dispatch login event
            window.dispatchEvent(new Event('lyvo-login'));
            
            // Redirect after a delay
            setTimeout(() => {
              if (response.data.user.role === 2) {
                navigate('/admin-dashboard');
              } else if (response.data.user.role === 3) {
                navigate('/owner-dashboard');
              } else {
                navigate('/dashboard');
              }
            }, 3000);
          } else {
            // Response is successful but missing required data
            console.error('Verification response missing required data:', response.data);
            setStatus('error');
            setMessage('Verification completed but there was an issue with the response. Please try logging in.');
          }
        } else {
          // Non-successful status code
          console.error('Non-successful status code:', response.status);
          setStatus('error');
          setMessage(response.data?.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        
        // Don't set error status immediately for network issues
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          console.log('Request timeout, retrying...');
          // Retry once after a short delay
          setTimeout(async () => {
            try {
              const retryResponse = await axios.get(`${API_URL}/verify-email/${token}`, {
                timeout: 15000
              });
              console.log('Retry response:', retryResponse);
              
              if (retryResponse.status >= 200 && retryResponse.status < 300 && 
                  retryResponse.data && retryResponse.data.user && retryResponse.data.token) {
                setStatus('success');
                setMessage(retryResponse.data.message || 'Email verified successfully!');
                setUser(retryResponse.data.user);
                
                localStorage.setItem('authToken', retryResponse.data.token);
                localStorage.setItem('user', JSON.stringify(retryResponse.data.user));
                window.dispatchEvent(new Event('lyvo-login'));
                
                setTimeout(() => {
                  if (retryResponse.data.user.role === 2) {
                    navigate('/admin-dashboard');
                  } else if (retryResponse.data.user.role === 3) {
                    navigate('/owner-dashboard');
                  } else {
                    navigate('/dashboard');
                  }
                }, 3000);
              } else {
                setStatus('error');
                setMessage('Verification failed after retry. Please try again.');
              }
            } catch (retryError) {
              console.error('Retry failed:', retryError);
              setStatus('error');
              setMessage('Verification failed. Please try again.');
            }
          }, 2000);
          return;
        }
        
        // Only set error status if we haven't already succeeded
        if (status !== 'success') {
          setStatus('error');
          
          if (error.response) {
            // Server responded with error status
            if (error.response.status === 400) {
              setMessage(error.response.data?.message || 'Invalid or expired verification token.');
            } else if (error.response.status === 500) {
              setMessage('Server error. Please try again later.');
            } else {
              setMessage(error.response.data?.message || 'Verification failed. Please try again.');
            }
          } else if (error.request) {
            // Network error
            setMessage('Network error. Please check your internet connection and try again.');
          } else {
            // Other error
            setMessage('Verification failed. Please try again.');
          }
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
            {user?.role === 3 ? 'Completing your property owner account setup' : 
             user?.role === 2 ? 'Completing your admin account setup' : 
             'Completing your account setup'}
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
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-700">
                    Email Verified Successfully!
                  </p>
                </div>
                <p className="text-sm text-green-700">
                  Welcome, <span className="font-semibold">{user.name}</span>! 
                  {user.role === 3 ? 'You\'re now a verified property owner in the Lyvo+ community.' : 
                   user.role === 2 ? 'You\'re now a verified admin in the Lyvo+ community.' : 
                   'You\'re now part of the Lyvo+ community.'}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  You have been automatically logged in and will be redirected to your {user.role === 3 ? 'owner dashboard' : user.role === 2 ? 'admin dashboard' : 'dashboard'} shortly...
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-semibold text-red-700">
                      Verification Issue
                    </p>
                  </div>
                  <p className="text-sm text-red-700">
                    {message}
                  </p>
                </div>
                
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
                  <span>Redirecting to {user.role === 3 ? 'owner dashboard' : user.role === 2 ? 'admin dashboard' : 'dashboard'}...</span>
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