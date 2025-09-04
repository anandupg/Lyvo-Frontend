import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, CheckCircle, Shield, X, Check } from "lucide-react";
import axios from "axios";

const API_URL = 'http://localhost:4002/api/user';

// Password strength interface
const PasswordStrength = {
  score: 0,
  label: '',
  color: '',
  barColor: ''
};

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(PasswordStrength);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // Initialize Google Sign-In
  useEffect(() => {
    const loadGoogleScript = () => {
      // Check if Google Client ID is configured
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId || clientId === 'your-google-client-id') {
        console.warn('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file');
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.google) {
          try {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleSignIn,
              auto_select: false,
              cancel_on_tap_outside: true,
            });

            window.google.accounts.id.renderButton(
              document.getElementById('google-signin-button'),
              {
                theme: 'outline',
                size: 'large',
                text: 'signup_with',
                shape: 'rectangular',
                width: '100%',
              }
            );
          } catch (error) {
            console.error('Error initializing Google Sign-In:', error);
          }
        }
      };

      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
      };
    };

    loadGoogleScript();
  }, []);

  const handleGoogleSignIn = async (response) => {
    try {
      setGoogleLoading(true);
      setError(null);
      setSuccess(null);

      const result = await axios.post(`${API_URL}/google-signin`, {
        credential: response.credential,
      });

      // Store user data and token
      localStorage.setItem('authToken', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      // Dispatch login event to update navbar
      window.dispatchEvent(new Event('lyvo-login'));
      
      // Navigate to home
      navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Password validation rules
  const passwordValidation = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&]/.test(formData.password)
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      return {
        score: 0,
        label: '',
        color: 'text-gray-400',
        barColor: 'bg-gray-200'
      };
    }

    let score = 0;
    let feedback = '';

    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 20;
    if (/[@$!%*?&]/.test(password)) score += 20;

    // Additional complexity
    if (password.length > 8 && /[a-z]/.test(password) && /[A-Z]/.test(password)) score += 10;
    if (password.length > 8 && /\d/.test(password) && /[@$!%*?&]/.test(password)) score += 10;

    // Cap at 100
    score = Math.min(score, 100);

    // Determine strength level and colors
    let label = '';
    let color = '';
    let barColor = '';

    if (score < 20) {
      label = 'weak';
      color = 'text-orange-500';
      barColor = 'bg-orange-500';
    } else if (score < 40) {
      label = 'weak';
      color = 'text-orange-500';
      barColor = 'bg-orange-500';
    } else if (score < 60) {
      label = 'medium';
      color = 'text-yellow-500';
      barColor = 'bg-gradient-to-r from-orange-500 to-yellow-500';
    } else if (score < 80) {
      label = 'good';
      color = 'text-yellow-500';
      barColor = 'bg-gradient-to-r from-orange-500 to-yellow-500';
    } else {
      label = 'strong';
      color = 'text-green-500';
      barColor = 'bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 to-green-500';
    }

    // Generate feedback
    if (score < 20) {
      feedback = 'This password is not acceptable. Add another word or two.';
    } else if (score < 40) {
      feedback = 'Weak password. Try adding numbers and special characters.';
    } else if (score < 60) {
      feedback = 'Fair password. Add more variety to make it stronger.';
    } else if (score < 80) {
      feedback = 'Good password. Almost there!';
    } else {
      feedback = 'Excellent! Your password is strong.';
    }

    setPasswordFeedback(feedback);

    return {
      score,
      label,
      color,
      barColor
    };
  };

  // Minimize password validation card if all requirements are met
  const allPasswordValid = Object.values(passwordValidation).every(Boolean);

  // Calculate password strength when password changes
  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  // Auto-minimize when all requirements are met
  useEffect(() => {
    if (allPasswordValid && showPasswordValidation) {
      const timer = setTimeout(() => {
        setShowPasswordValidation(false);
      }, 1000); // Auto-minimize after 1 second
      return () => clearTimeout(timer);
    }
  }, [allPasswordValid, showPasswordValidation]);

  const validateFullName = (name) => {
    if (!name.trim()) {
      return 'Full name is required';
    }
    if (name.trim().length < 2) {
      return 'Full name must be at least 2 characters long';
    }
    if (name.trim().length > 50) {
      return 'Full name must be less than 50 characters';
    }
    return undefined;
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[@$!%*?&]/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return undefined;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error;
    
    switch (field) {
      case 'name':
        error = validateFullName(formData.name);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
    
    // Show password validation when user starts typing password
    if (id === 'password' && value && !showPasswordValidation) {
      setShowPasswordValidation(true);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateFullName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      name: nameError || '',
      email: emailError || '',
      password: passwordError || ''
    });
    
    setTouched({ name: true, email: true, password: true });
    
    // Check if there are any errors
    if (nameError || emailError || passwordError) {
      setError("Please fix the errors above before submitting.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post(`${API_URL}/register`, formData);
      
      // Show success message instead of automatically logging in
      setSuccess(response.data.message);
      
      // Clear form data
      setFormData({ name: '', email: '', password: '' });
      setPasswordStrength(PasswordStrength);
      setPasswordFeedback('');
      setShowPasswordValidation(false);
      setErrors({ name: '', email: '', password: '' });
      setTouched({ name: false, email: false, password: false });
      
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
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
              Join <span className="text-red-600">Lyvo</span><span className="text-black">+</span> as a Room Seeker
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Find your perfect co-living space and connect with roommates
            </p>
            

          </div>

          {/* Error and Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5" />
                <div className="text-sm">
                  <div className="font-medium">{success}</div>
                  <div className="text-xs mt-1">
                    Please check your email and click the verification link to complete your registration.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign-In Button */}
          <div className="mb-6">
            <div id="google-signin-button" className="w-full"></div>
            {googleLoading && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                  Signing in with Google...
                </div>
              </div>
            )}
            {!import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID === 'your-google-client-id' && (
              <div className="mt-3 text-center">
                <div className="text-xs text-gray-500">
                  Google Sign-In not configured. Please set up your Google OAuth credentials.
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  required
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                    touched.name && errors.name 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                />
              </div>
              {touched.name && errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  {errors.name}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                    touched.email && errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                />
              </div>
              {touched.email && errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                    touched.password && errors.password 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Bar */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-3"
                >
                  {/* Strength Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Password strength</span>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${passwordStrength.barColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength.score}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  {/* Password Feedback */}
                  {passwordFeedback && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-xs ${passwordStrength.color}`}
                    >
                      {passwordFeedback}
                    </motion.p>
                  )}
                  
                  {/* Password Requirements */}
                  <AnimatePresence>
                    {showPasswordValidation && !allPasswordValid && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-500" />
                          <span className="text-xs font-medium text-gray-700">Password requirements</span>
                        </div>
                        <div className="space-y-1">
                          <div className={`flex items-center gap-2 text-xs ${
                            passwordValidation.length ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {passwordValidation.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>At least 8 characters</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {passwordValidation.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>One uppercase letter</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {passwordValidation.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>One lowercase letter</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            passwordValidation.number ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {passwordValidation.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>One number</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            passwordValidation.special ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {passwordValidation.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>One special character (@$!%*?&)</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
              
              {touched.password && errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Create Account Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold shadow-sm hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-red-600 hover:text-red-700 underline"
              >
                Sign in
              </Link>
            </p>
            
            {/* Owner Signup Link */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Are you a property owner?</p>
              <Link
                to="/room-owner-signup"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 underline"
              >
                <Shield className="w-4 h-4 mr-1" />
                Sign up as Property Owner
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup; 