import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  User, 
  CheckCircle, 
  Shield, 
  X, 
  Check,
  Home,
  Phone,
  MapPin,
  Building,
  FileText,
  CreditCard
} from "lucide-react";
import axios from "axios";

const API_URL = 'http://localhost:4002/api/user';

const RoomOwnerSignup = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    phone: '',
    address: '',
    propertyType: '',
    propertyCount: '',
    experience: '',
    idProof: '',
    bankDetails: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ 
    name: false, 
    email: false, 
    password: false,
    phone: false,
    address: false,
    propertyType: false,
    propertyCount: false,
    experience: false,
    idProof: false,
    bankDetails: false
  });
  const [errors, setErrors] = useState({ 
    name: '', 
    email: '', 
    password: '',
    phone: '',
    address: '',
    propertyType: '',
    propertyCount: '',
    experience: '',
    idProof: '',
    bankDetails: ''
  });
  const navigate = useNavigate();

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters long';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters long';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/\d/.test(value)) return 'Password must contain at least one number';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.trim())) return 'Please enter a valid 10-digit phone number';
        return '';
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Address must be at least 10 characters long';
        return '';
      default:
        if (!value.trim()) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        return '';
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      newErrors[field] = validateField(field, formData[field]);
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    if (Object.values(newErrors).some(error => error)) {
      setError("Please fix the errors above before submitting.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post(`${API_URL}/register-room-owner`, {
        ...formData,
        userType: 'roomOwner'
      });
      
      setSuccess(response.data.message);
      setFormData({ 
        name: '', 
        email: '', 
        password: '',
        phone: '',
        address: '',
        propertyType: '',
        propertyCount: '',
        experience: '',
        idProof: '',
        bankDetails: ''
      });
      setErrors({ 
        name: '', 
        email: '', 
        password: '',
        phone: '',
        address: '',
        propertyType: '',
        propertyCount: '',
        experience: '',
        idProof: '',
        bankDetails: ''
      });
      setTouched({ 
        name: false, 
        email: false, 
        password: false,
        phone: false,
        address: false,
        propertyType: false,
        propertyCount: false,
        experience: false,
        idProof: false,
        bankDetails: false
      });
      
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
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                    <img 
                      src="/Lyvo_no_bg.png" 
                      alt="Lyvo Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">Lyvo+</span>
                  <span className="text-xs text-gray-500 font-medium">Co-Living Platform</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Register as Room Owner
            </h2>
            <p className="text-sm text-gray-600">
              Join our platform to list your properties
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

          {/* Registration Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      touched.phone && errors.phone 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                  />
                </div>
                {touched.phone && errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    {errors.phone}
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
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <textarea
                  id="address"
                  required
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                    touched.address && errors.address 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur('address')}
                />
              </div>
              {touched.address && errors.address && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  {errors.address}
                </motion.p>
              )}
            </div>

            {/* Property Information */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="propertyType"
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      touched.propertyType && errors.propertyType 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    value={formData.propertyType}
                    onChange={handleChange}
                    onBlur={() => handleBlur('propertyType')}
                  >
                    <option value="">Select property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="pg">PG/Hostel</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                {touched.propertyType && errors.propertyType && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    {errors.propertyType}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="propertyCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Properties
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="propertyCount"
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      touched.propertyCount && errors.propertyCount 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    value={formData.propertyCount}
                    onChange={handleChange}
                    onBlur={() => handleBlur('propertyCount')}
                  >
                    <option value="">Select count</option>
                    <option value="1">1 Property</option>
                    <option value="2-5">2-5 Properties</option>
                    <option value="6-10">6-10 Properties</option>
                    <option value="10+">10+ Properties</option>
                  </select>
                </div>
                {touched.propertyCount && errors.propertyCount && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    {errors.propertyCount}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="experience"
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      touched.experience && errors.experience 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    value={formData.experience}
                    onChange={handleChange}
                    onBlur={() => handleBlur('experience')}
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
                {touched.experience && errors.experience && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    {errors.experience}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Verification Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="idProof" className="block text-sm font-medium text-gray-700 mb-2">
                  ID Proof Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="idProof"
                    type="text"
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      touched.idProof && errors.idProof 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Aadhar/PAN/Driving License"
                    value={formData.idProof}
                    onChange={handleChange}
                    onBlur={() => handleBlur('idProof')}
                  />
                </div>
                {touched.idProof && errors.idProof && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    {errors.idProof}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="bankDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Account Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="bankDetails"
                    type="text"
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      touched.bankDetails && errors.bankDetails 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter bank account number"
                    value={formData.bankDetails}
                    onChange={handleChange}
                    onBlur={() => handleBlur('bankDetails')}
                  />
                </div>
                {touched.bankDetails && errors.bankDetails && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    {errors.bankDetails}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Create Account Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold shadow-sm hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Register as Room Owner"}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-red-600 hover:text-red-700 underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomOwnerSignup; 