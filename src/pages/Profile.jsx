import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Edit, Save, X, User, Mail, Phone, MapPin, Calendar, Shield, Star,
  Lock, Eye, EyeOff
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import ProfilePictureUpload from "../components/ProfilePictureUpload";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    joinDate: "",
    bio: "",
    isVerified: false,
    trustScore: 0,
    profilePicture: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          setUser(null);
          setLoading(false);
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        console.log('Profile: User role check:', parsedUser.role);
        
        // Check user role and redirect if necessary
        if (parsedUser.role === 2) {
          // Admin user - redirect to admin dashboard
          console.log('Profile: Redirecting admin to admin dashboard');
          window.location.href = '/admin-dashboard';
          return;
        } else if (parsedUser.role === 3) {
          // Owner user - redirect to owner profile
          console.log('Profile: Redirecting owner to owner profile');
          window.location.href = '/owner-profile';
          return;
        } else if (parsedUser.role === 1) {
          // Regular user - stay on this profile page
          console.log('Profile: Regular user, staying on profile page');
          setUser(parsedUser);
        } else {
          // Invalid role - redirect to login
          console.error('Profile: Invalid user role:', parsedUser.role);
          navigate('/login');
          return;
        }
        
        setProfileData(prev => ({
          ...prev,
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          profilePicture: parsedUser.profilePicture || "",
          phone: parsedUser.phone || "",
          location: parsedUser.location || "",
          bio: parsedUser.bio || "",
          isVerified: parsedUser.isVerified || false,
          trustScore: 95,
          joinDate: parsedUser.createdAt ? new Date(parsedUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently"
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    try {
      setSaveStatus({ type: 'loading', message: 'Saving changes...' });
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Prepare the data to update
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio
      };

      // Call the backend API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4002/api'}/user/profile/${user._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      
      // Update local storage with new user data
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, ...result.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update the user state
      setUser(updatedUser);
      
      setIsEditing(false);
      setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
      
      // Dispatch event to update navbar
      window.dispatchEvent(new Event('lyvo-profile-update'));
      
      setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setSaveStatus({ type: 'error', message: error.message || 'Failed to update profile' });
      setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 3000);
    }
  };

  const handleProfilePictureUpdate = (newImageUrl) => {
    setProfileData(prev => ({
      ...prev,
      profilePicture: newImageUrl
    }));
    setSaveStatus({ type: 'success', message: 'Profile picture updated successfully!' });
    setTimeout(() => {
      setSaveStatus({ type: '', message: '' });
    }, 3000);
  };

  const handlePasswordUpdate = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setSaveStatus({ type: 'error', message: 'New passwords do not match' });
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setSaveStatus({ type: 'error', message: 'Password must be at least 6 characters long' });
        return;
      }

      setSaveStatus({ type: 'loading', message: 'Updating password...' });
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Call the backend API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4002/api'}/user/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      setSaveStatus({ type: 'success', message: 'Password updated successfully!' });
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Password update error:', error);
      setSaveStatus({ type: 'error', message: error.message || 'Failed to update password' });
      setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <ScrollReveal>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="relative h-48 bg-gradient-to-r from-red-500/10 via-red-600/10 to-red-700/10">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
              <div className="absolute bottom-6 left-8 flex items-end space-x-6">
                <div className="relative group">
                  <ProfilePictureUpload
                    currentImage={profileData.profilePicture}
                    onImageUpdate={handleProfilePictureUpdate}
                    className="w-24 h-24"
                  />
                  {profileData.isVerified && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-gray-900 pb-2">
                  <h1 className="text-3xl font-bold mb-1">{profileData.name || 'User'}</h1>
                  <p className="text-gray-600 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {profileData.joinDate || 'Recently'}</span>
                  </p>
                </div>
              </div>
              <div className="absolute top-6 right-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 shadow-lg hover:bg-white transition-all duration-300"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                      />
                    ) : (
                      <p className="text-gray-900 py-3 font-medium">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <p className="text-gray-900 py-3 font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {profileData.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                      />
                    ) : (
                      <p className="text-gray-900 py-3 font-medium flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {profileData.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                        placeholder="Enter your location"
                      />
                    ) : (
                      <p className="text-gray-900 py-3 font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {profileData.location || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {profileData.bio || "No bio provided"}
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column - Stats & Settings */}
          <div className="space-y-6">
            {/* Trust Score */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trust Score</h3>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-white">{profileData.trustScore}</span>
                  </div>
                  <p className="text-sm text-gray-600">Excellent Profile</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Quick Actions */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                  
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>

        {/* Save Changes Button */}
        {isEditing && (
          <ScrollReveal delay={0.4}>
            <div className="text-center mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saveStatus.type === 'loading'}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{saveStatus.type === 'loading' ? 'Saving...' : 'Save Changes'}</span>
              </motion.button>
            </div>
          </ScrollReveal>
        )}

        {/* Status Messages */}
        {saveStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
              saveStatus.type === 'success' 
                ? 'bg-green-100 border border-green-300 text-green-800'
                : saveStatus.type === 'error'
                ? 'bg-red-100 border border-red-300 text-red-800'
                : 'bg-blue-100 border border-blue-300 text-blue-800'
            }`}
          >
            {saveStatus.message}
          </motion.div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordUpdate}
                    disabled={saveStatus.type === 'loading'}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {saveStatus.type === 'loading' ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile; 