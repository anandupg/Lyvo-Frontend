import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  CreditCard,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [kycDocs, setKycDocs] = useState([{ type: '', number: '', file: null }]);
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [kycMessage, setKycMessage] = useState('');

  const refreshUserFromApi = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const current = JSON.parse(localStorage.getItem('user') || 'null');
      if (!token || !current?._id) return;
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4002/api';
      const { data } = await axios.get(`${base}/user/profile/${current._id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (data?._id) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      }
    } catch (e) {
      console.error('refreshUserFromApi error:', e);
    }
  };

  const addKycDoc = () => {
    setKycDocs((prev) => [...prev, { type: '', number: '', file: null }]);
  };

  const removeKycDoc = (index) => {
    setKycDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateKycDoc = (index, field, value) => {
    setKycDocs((prev) => prev.map((doc, i) => (i === index ? { ...doc, [field]: value } : doc)));
  };

  const handleSubmitKyc = async () => {
    try {
      setKycSubmitting(true);
      setKycMessage('');
      const token = localStorage.getItem('authToken');
      if (!token) {
        setKycMessage('Not authenticated');
        return;
      }
      // Upload only one image per request; pick the first selected file
      const firstWithFile = kycDocs.find(d => d.file) || null;
      if (!firstWithFile) {
        setKycMessage('Please add an ID image to upload.');
        return;
      }
      // Decide which side to upload based on current user state
      let side = 'front';
      if (user?.govtIdFrontUrl && !user?.govtIdBackUrl) {
        side = 'back';
      } else if (user?.govtIdFrontUrl && user?.govtIdBackUrl) {
        setKycMessage('Both front and back already uploaded. Awaiting review.');
        return;
      }
      const form = new FormData();
      form.append(side, firstWithFile.file);
      // Optional metadata
      if (kycDocs[0]?.type) form.append('idType', kycDocs[0].type);
      if (kycDocs[0]?.number) form.append('idNumber', kycDocs[0].number);
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4002/api';
      const { data } = await axios.post(`${base}/user/kyc/upload`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data?.user) {
        const updated = { ...(JSON.parse(localStorage.getItem('user')) || {}), ...data.user };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
        // Notify other components (e.g., layout) that user has updated
        window.dispatchEvent(new Event('lyvo-user-updated'));
      }
      await refreshUserFromApi();
      window.dispatchEvent(new Event('lyvo-user-updated'));
      setKycMessage(`KYC ${side === 'front' ? 'front' : 'back'} image submitted. Status: pending`);
    } catch (e) {
      console.error('KYC submit error:', e);
      setKycMessage(e?.response?.data?.message || 'Failed to submit KYC');
    } finally {
      setKycSubmitting(false);
    }
  };

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

  const handleRemoveProfilePicture = async () => {
    if (!user?._id) return;
    try {
      setProfileUpdating(true);
      const token = localStorage.getItem('authToken');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:4002/api'}/user/profile/${user._id}`,
        { profilePicture: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = { ...user, profilePicture: null };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    } catch (e) {
      console.error('Remove profile picture error:', e);
      alert('Failed to remove picture.');
    } finally {
      setProfileUpdating(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'properties', name: 'Properties', icon: Building },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'kyc', name: 'Govt ID (KYC)', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  useEffect(() => {
    if (window.location.hash === '#kyc') {
      setActiveTab('kyc');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'kyc') {
      refreshUserFromApi();
    }
  }, [activeTab]);

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
    <OwnerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and property preferences</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Mobile Tab Selector */}
          <div className="lg:hidden p-4 border-b border-gray-200">
            <Select value={activeTab} onValueChange={(val) => setActiveTab(val)}>
              <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent position="popper">
                {tabs.map((tab) => (
                  <SelectItem key={tab.id} value={tab.id}>{tab.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'kyc' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-gray-900">Government ID Verification</h2>
                <p className="text-sm text-gray-600">Upload any government-approved ID (e.g., Aadhaar, PAN, Driving License, Passport). This increases trust for seekers.</p>

                {/* Existing KYC preview and status */}
                {(user?.govtIdFrontUrl || user?.govtIdBackUrl) && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-gray-900">Submitted Documents</div>
                      {user?.kycStatus && (
                        <span className={`text-xs px-2 py-1 rounded-md ${user.kycStatus === 'approved' ? 'bg-green-100 text-green-700' : user.kycStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>
                          Status: {String(user.kycStatus).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user?.govtIdFrontUrl && (
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Front</div>
                          <img src={user.govtIdFrontUrl} alt="Govt ID Front" className="w-full h-40 object-cover rounded-lg border" />
                        </div>
                      )}
                      {user?.govtIdBackUrl && (
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Back</div>
                          <img src={user.govtIdBackUrl} alt="Govt ID Back" className="w-full h-40 object-cover rounded-lg border" />
                        </div>
                      )}
                    </div>
                    {user?.kycStatus === 'rejected' && (
                      <div className="text-xs text-red-600 mt-3">Your KYC was rejected. Please re-submit clear images.</div>
                    )}
                    {user?.kycStatus === 'approved' && (
                      <div className="text-xs text-green-600 mt-3">Your KYC is approved.</div>
                    )}
                  </div>
                )}

                {kycDocs.map((doc, index) => (
                  <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Type</label>
                        <div className="relative">
                          <Select value={doc.type} onValueChange={(val) => updateKycDoc(index, 'type', val)}>
                            <SelectTrigger className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none text-sm md:text-base bg-white">
                              <SelectValue placeholder="Choose ID type" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="aadhaar">Aadhaar</SelectItem>
                              <SelectItem value="pan">PAN</SelectItem>
                              <SelectItem value="dl">Driving License</SelectItem>
                              <SelectItem value="passport">Passport</SelectItem>
                              <SelectItem value="voter">Voter ID</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                        <input
                          type="text"
                          value={doc.number}
                          onChange={(e) => updateKycDoc(index, 'number', e.target.value)}
                          className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm md:text-base"
                          placeholder="Enter ID number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID Image</label>
                      {doc.file ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={URL.createObjectURL(doc.file)}
                            alt="Preview"
                            className="w-28 h-28 object-cover rounded-lg border"
                            onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                          />
                          <button
                            type="button"
                            onClick={() => updateKycDoc(index, 'file', null)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                          <div className="text-xs text-gray-500 text-center px-2">Click to upload (PNG, JPG up to 5MB)</div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => updateKycDoc(index, 'file', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                          />
                        </label>
                      )}
                    </div>

                    <div className="flex justify-end">
                      {kycDocs.length > 1 && (
                        <button type="button" onClick={() => removeKycDoc(index)} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove ID
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <button type="button" onClick={addKycDoc} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <Plus className="w-4 h-4 mr-2" />
                    Add another ID
                  </button>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={handleSubmitKyc} disabled={kycSubmitting} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50">
                      {kycSubmitting ? 'Submitting…' : 'Submit for Verification'}
                    </button>
                    <span className="text-xs text-gray-500">We will review and update your status shortly.</span>
                  </div>
                </div>
                {kycMessage && (
                  <div className="text-xs mt-2 text-gray-600">{kycMessage}</div>
                )}
              </motion.div>
            )}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Profile Picture */}
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-3">Profile Picture</div>
                  <div className="flex items-center gap-4">
                    <ProfilePictureUpload
                      currentImage={user?.profilePicture || null}
                      onImageUpdate={(url) => {
                        const updated = { ...user, profilePicture: url };
                        localStorage.setItem('user', JSON.stringify(updated));
                        setUser(updated);
                      }}
                    />
                    {user?.profilePicture && (
                      <button
                        type="button"
                        onClick={handleRemoveProfilePicture}
                        disabled={profileUpdating}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        {profileUpdating ? 'Removing…' : 'Remove'}
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Lyvo+ Property Management"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </motion.div>
            )}

            {activeTab === 'properties' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-gray-900">Property Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Auto-approve applications</h3>
                      <p className="text-sm text-gray-500">Automatically approve tenant applications that meet criteria</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Maintenance notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications for maintenance requests</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Financial reports</h3>
                      <p className="text-sm text-gray-500">Generate monthly financial reports automatically</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Email notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">SMS notifications</h3>
                      <p className="text-sm text-gray-500">Receive urgent notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Push notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications in the app</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200">
                    <Shield className="w-4 h-4 mr-2" />
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-gray-900">Billing Information</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Current Plan</h3>
                    <p className="text-sm text-gray-600">Professional Plan - ₹999/month</p>
                    <p className="text-xs text-gray-500 mt-1">Next billing date: March 15, 2024</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing Address
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="123 Property Street, Bangalore, Karnataka 560001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID (GST)
                      </label>
                      <input
                        type="text"
                        defaultValue="29ABCDE1234F1Z5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Update Billing Info
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default Settings; 