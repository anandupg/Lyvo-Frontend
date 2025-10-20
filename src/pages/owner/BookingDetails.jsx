import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Home, 
  Bed, 
  Users, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  Tag,
  Maximize,
  User,
  Building,
  AlertCircle
} from 'lucide-react';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
        const token = localStorage.getItem('authToken');
        let endpoint = token && bookingId ? `${baseUrl}/api/bookings/${bookingId}` : `${baseUrl}/api/public/bookings/${bookingId}`;
        let resp = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        let data;
        if (resp.ok) {
          data = await resp.json();
          setBooking(data.booking);
          setSource(data.source || 'booking');
        } else {
          // Second attempt: try public by id explicitly
          if (bookingId) {
            const publicById = `${baseUrl}/api/public/bookings/${bookingId}`;
            const publicResp = await fetch(publicById, { headers: { 'Content-Type': 'application/json' } });
            if (publicResp.ok) {
              const publicData = await publicResp.json();
              setBooking(publicData.booking);
              setSource(publicData.source || 'booking');
              return;
            }
          }

          // Build lookup params from state or query
          const stateParams = location.state || {};
          const searchParams = new URLSearchParams(location.search);
          const userId = stateParams.userId || searchParams.get('userId');
          const ownerId = stateParams.ownerId || searchParams.get('ownerId');
          const propertyId = stateParams.propertyId || searchParams.get('propertyId');
          const roomId = stateParams.roomId || searchParams.get('roomId');

          if (userId && ownerId && propertyId && roomId) {
            const lookupUrl = `${baseUrl}/api/bookings/lookup?userId=${encodeURIComponent(userId)}&ownerId=${encodeURIComponent(ownerId)}&propertyId=${encodeURIComponent(propertyId)}&roomId=${encodeURIComponent(roomId)}`;
            const lookupResp = await fetch(lookupUrl);
            if (!lookupResp.ok) {
              const text = await lookupResp.text();
              throw new Error(text || `HTTP ${lookupResp.status}`);
            }
            const lookupData = await lookupResp.json();
            setBooking(lookupData.booking);
            setSource(lookupData.source || 'composed');
          } else {
            const text = await resp.text();
            throw new Error(text || `HTTP ${resp.status}`);
          }
        }
      } catch (e) {
        setError(e.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId, location.search, location.state]);

  const updateStatus = async (action) => {
    try {
      if (!booking?._id) return;
      setUpdating(true);
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      const token = localStorage.getItem('authToken');
      const resp = await fetch(`${baseUrl}/api/bookings/${booking._id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ action })
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setBooking(data.booking);
      setActionType(action);
      
      // Show success modal
      if (action === 'approve') {
        setShowApprovalModal(true);
      } else {
        setShowRejectionModal(true);
      }
    } catch (e) {
      setError(e.message || 'Failed to update booking');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_approval: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending Approval' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Confirmed' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle, label: 'Cancelled' },
    };
    
    const config = statusConfig[status] || statusConfig.pending_approval;
    const StatusIcon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.text} font-medium`}>
        <StatusIcon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  return (
    <OwnerLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button 
              onClick={() => navigate('/owner-bookings')} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Bookings</span>
            </button>
        <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
                <p className="text-gray-600 mt-1">Manage and review booking information</p>
              </div>
              {booking && (
                <div>
                  {getStatusBadge(booking.status)}
                </div>
              )}
        </div>
          </motion.div>

        {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading booking details...</p>
          </div>
        ) : error ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-gray-700 text-lg">{error}</p>
          </div>
        ) : booking ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                {/* Property Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Building className="w-6 h-6" />
                      Property Details
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          Property Name
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {booking.propertySnapshot?.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Security Deposit
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {booking.propertySnapshot?.security_deposit != null 
                            ? `₹${Number(booking.propertySnapshot.security_deposit).toLocaleString()}` 
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Address
                        </label>
                        <p className="mt-1 text-gray-900">
                          {booking.propertySnapshot?.address?.street && `${booking.propertySnapshot.address.street}, `}
                          {booking.propertySnapshot?.address?.city && `${booking.propertySnapshot.address.city}, `}
                          {booking.propertySnapshot?.address?.state && `${booking.propertySnapshot.address.state} `}
                          {booking.propertySnapshot?.address?.pincode && `- ${booking.propertySnapshot.address.pincode}`}
                          {!booking.propertySnapshot?.address && 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Room Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Bed className="w-6 h-6" />
                      Room Details
                    </h2>
                  </div>
                  <div className="p-6">
                    {/* Room Images */}
                    {(booking.roomSnapshot?.images?.room || booking.roomSnapshot?.images?.toilet) && (
                      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {booking.roomSnapshot?.images?.room && (
                          <div className="relative group overflow-hidden rounded-xl">
                            <img 
                              src={booking.roomSnapshot.images.room} 
                              alt="Room" 
                              className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300" 
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                              <p className="text-white font-medium">Room View</p>
                            </div>
                          </div>
                        )}
                        {booking.roomSnapshot?.images?.toilet && (
                          <div className="relative group overflow-hidden rounded-xl">
                            <img 
                              src={booking.roomSnapshot.images.toilet} 
                              alt="Bathroom" 
                              className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300" 
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                              <p className="text-white font-medium">Bathroom View</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Room Number
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {booking.roomSnapshot?.roomNumber ?? 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Bed className="w-4 h-4" />
                          Room Type
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {booking.roomSnapshot?.roomType || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Maximize className="w-4 h-4" />
                          Room Size
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {booking.roomSnapshot?.roomSize != null ? `${booking.roomSnapshot.roomSize} sq ft` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Bed Type</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {booking.roomSnapshot?.bedType || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Occupancy
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {booking.roomSnapshot?.occupancy ?? 'N/A'} {booking.roomSnapshot?.occupancy > 1 ? 'Persons' : 'Person'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Monthly Rent
                        </label>
                        <p className="mt-1 text-lg font-semibold text-green-600">
                          {booking.roomSnapshot?.rent != null ? `₹${Number(booking.roomSnapshot.rent).toLocaleString()}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Booking Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Calendar className="w-6 h-6" />
                      Booking Timeline
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Booking Date</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {new Date(booking.createdAt || booking.bookedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.createdAt || booking.bookedAt).toLocaleTimeString('en-IN')}
                        </p>
                      </div>
                      {booking.approvedAt && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approved Date</label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {new Date(booking.approvedAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.approvedAt).toLocaleTimeString('en-IN')}
                          </p>
                        </div>
                      )}
                    </div>
                </div>
                </motion.div>

                {/* Action Buttons */}
                {booking.status === 'pending_approval' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                    <div className="flex flex-wrap gap-4">
                  <button
                    disabled={updating}
                    onClick={() => updateStatus('approve')}
                        className="flex-1 min-w-[200px] bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {updating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Approve Booking
                          </>
                        )}
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => updateStatus('reject')}
                        className="flex-1 min-w-[200px] bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {updating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5" />
                            Reject Booking
                          </>
                        )}
                  </button>
                </div>
                  </motion.div>
                )}
            </div>

              {/* Sidebar */}
            <div className="space-y-6">
                {/* Seeker Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Seeker Information
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {booking.userSnapshot?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <p className="mt-1 text-gray-900 break-words">
                        {booking.userSnapshot?.email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </label>
                      <p className="mt-1 text-gray-900">
                        {booking.userSnapshot?.phone || 'N/A'}
                      </p>
                    </div>
                </div>
                </motion.div>

                {/* Owner Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Owner Information
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {booking.ownerSnapshot?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <p className="mt-1 text-gray-900 break-words">
                        {booking.ownerSnapshot?.email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </label>
                      <p className="mt-1 text-gray-900">
                        {booking.ownerSnapshot?.phone || 'N/A'}
                      </p>
                </div>
                  </div>
                </motion.div>
            </div>
          </div>
        ) : null}
      </div>
            </div>

      {/* Approval Success Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Approved!</h3>
            <p className="text-gray-600 mb-6">
              The booking has been successfully approved. The seeker will be notified via email.
            </p>
            <button
              onClick={() => {
                setShowApprovalModal(false);
                navigate('/owner-bookings');
              }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              Back to Bookings
            </button>
          </motion.div>
        </div>
      )}

      {/* Rejection Success Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Rejected</h3>
            <p className="text-gray-600 mb-6">
              The booking has been rejected. The seeker will be notified via email.
            </p>
            <button
              onClick={() => {
                setShowRejectionModal(false);
                navigate('/owner-bookings');
              }}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200"
            >
              Back to Bookings
            </button>
          </motion.div>
          </div>
      )}
    </OwnerLayout>
  );
};

export default BookingDetails;
