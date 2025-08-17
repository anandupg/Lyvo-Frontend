import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Home, Shield, ArrowLeft } from "lucide-react";
import axios from "axios";

const API_URL = 'http://localhost:4002/api/user';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
      feedback.push('8+ characters');
    } else if (password.length >= 6) {
      score += 0.5;
      feedback.push('6+ characters');
    }

    // Character variety checks
    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push('lowercase');
    }
    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push('uppercase');
    }
    if (/[0-9]/.test(password)) {
      score += 1;
      feedback.push('number');
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
      feedback.push('symbol');
    }

    // Determine strength level
    if (score >= 4) {
      return { score: 4, label: 'Strong', color: 'bg-green-500', feedback };
    } else if (score >= 3) {
      return { score: 3, label: 'Good', color: 'bg-blue-500', feedback };
    } else if (score >= 2) {
      return { score: 2, label: 'Fair', color: 'bg-yellow-500', feedback };
    } else if (score >= 1) {
      return { score: 1, label: 'Weak', color: 'bg-red-500', feedback };
    } else {
      return { score: 0, label: 'Very Weak', color: 'bg-gray-300', feedback };
    }
  };

  const passwordStrength = getPasswordStrength(password);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900"><span className="text-red-600">Lyvo</span><span className="text-black">+</span></span>
              </Link>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <AlertCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Invalid Reset Link
                </h1>
                <p className="text-red-100 text-sm">
                  This password reset link is invalid or has expired
                </p>
              </div>
              
              <div className="px-8 py-8 text-center">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    The password reset link you're trying to use is no longer valid. This could be because:
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left">
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• The link has expired (links expire after 1 hour)</li>
                      <li>• The link has already been used</li>
                      <li>• The link was copied incorrectly</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4">
                    <Link
                      to="/forgot-password"
                      className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Request a new reset link
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/reset-password`, { token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900"><span className="text-red-600">Lyvo</span><span className="text-black">+</span></span>
            </Link>
            <Link 
              to="/login" 
              className="text-sm text-gray-600 hover:text-red-500 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Create New Password
              </h1>
              <p className="text-red-100 text-sm">
                Choose a strong password for your account
              </p>
            </div>

            {/* Form Section */}
            <div className="px-8 py-8">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Error</p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Success!</p>
                      <p className="text-sm text-green-700 mt-1">
                        Your password has been reset successfully
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!success ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 space-y-2"
                      >
                        {/* Strength Bar */}
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                passwordStrength.score >= level 
                                  ? passwordStrength.color 
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        
                        {/* Strength Label */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium ${
                            passwordStrength.score >= 4 ? 'text-green-600' :
                            passwordStrength.score >= 3 ? 'text-blue-600' :
                            passwordStrength.score >= 2 ? 'text-yellow-600' :
                            passwordStrength.score >= 1 ? 'text-red-600' :
                            'text-gray-500'
                          }`}>
                            {passwordStrength.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {password.length}/8+ characters
                          </span>
                        </div>
                        
                        {/* Strength Feedback */}
                        {passwordStrength.feedback.length > 0 && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Includes: </span>
                            {passwordStrength.feedback.join(', ')}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirm" className="block text-sm font-semibold text-gray-700 mb-3">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="confirm"
                        type={showConfirm ? "text" : "password"}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                        placeholder="Confirm your new password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {confirm && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2"
                      >
                        <div className={`flex items-center gap-2 text-xs ${
                          password === confirm ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {password === confirm ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          <span className="font-medium">
                            {password === confirm ? 'Passwords match' : 'Passwords do not match'}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Password Requirements</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• At least 6 characters long</li>
                      <li>• Use a mix of letters, numbers, and symbols</li>
                      <li>• Avoid common passwords</li>
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Update Password
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Password Updated!
                    </h3>
                    <p className="text-gray-600">
                      Your password has been successfully reset. You can now sign in with your new password.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">Security Tip</h4>
                    <p className="text-sm text-green-700">
                      For your security, we recommend using a unique password that you don't use on other websites.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Sign in to your account
                    </Link>
                  </div>
                </motion.div>
              )}

              {!success && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">
                      Remember your password?
                    </p>
                    <Link 
                      to="/login" 
                      className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Sign in to your account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword; 