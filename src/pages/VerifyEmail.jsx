import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import axios from "axios";

const API_URL = 'http://localhost:4002/api/user';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        // No token - redirect to login
        navigate('/login');
        return;
      }

      try {
        console.log('Verifying email with token:', token);
        const response = await axios.get(`${API_URL}/verify-email/${token}`, {
          timeout: 10000 // 10 second timeout
        });
        
        // If verification is successful, store auth data and redirect immediately
        if (response.status >= 200 && response.status < 300 && 
            response.data && response.data.user && response.data.token) {
          
          console.log('Verification successful, redirecting immediately');
          
          // Store authentication data
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Dispatch login event
          window.dispatchEvent(new Event('lyvo-login'));
          
          // Redirect immediately based on role
          if (response.data.user.role === 2) {
            navigate('/admin-dashboard');
          } else if (response.data.user.role === 3) {
            navigate('/owner-dashboard');
          } else {
            navigate('/seeker-dashboard');
          }
        } else {
          // Verification failed - redirect to login
          console.log('Verification failed, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('Verification error:', error);
        // Any error - redirect to login
        navigate('/login');
      }
    };

    verifyEmail();
    // Only run once on mount
    // eslint-disable-next-line
  }, []);


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
            Verifying Email...
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we verify your email address
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="mb-6"
            >
              <Loader className="w-12 h-12 animate-spin text-red-500 mx-auto" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-display">
              Processing Verification
            </h3>
            
            <p className="text-sm text-blue-700 mb-6">
              We're verifying your email address and logging you in...
            </p>

            <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Please wait...</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail; 