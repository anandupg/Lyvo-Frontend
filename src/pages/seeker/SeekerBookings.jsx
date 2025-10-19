import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import { 
  Calendar, 
  MapPin, 
  Star, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  ArrowRight,
  Filter,
  Search,
  Building,
  Bed,
  Wifi,
  Car,
  Shield,
  Utensils,
  Dumbbell,
  Camera,
  Users,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import ContactOwnerModal from '../../components/ContactOwnerModal';

const SeekerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get user ID from localStorage
  const getUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.id || userData._id;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  };

  // Fetch user bookings
  const fetchBookings = async () => {
    const userId = getUserId();
    if (!userId) {
      console.error('User ID not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      const response = await fetch(`${baseUrl}/api/bookings/user?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Bookings data received:', data);
        console.log('First booking room data:', data.bookings?.[0]?.room);
        setBookings(data.bookings || []);
        setFilteredBookings(data.bookings || []);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on status and search query
  useEffect(() => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(booking => {
        const propertyName = booking.property?.propertyName?.toLowerCase() || '';
        const roomNumber = booking.room?.roomNumber?.toLowerCase() || '';
        
        // Handle address object or string
        let address = '';
        if (booking.property?.address) {
          if (typeof booking.property.address === 'string') {
            address = booking.property.address.toLowerCase();
          } else {
            address = `${booking.property.address.street || ''} ${booking.property.address.city || ''} ${booking.property.address.state || ''} ${booking.property.address.pincode || ''}`.toLowerCase();
          }
        }
        
        const query = searchQuery.toLowerCase();
        return propertyName.includes(query) || roomNumber.includes(query) || address.includes(query);
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, searchQuery]);

  // Load bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'text-green-600 bg-green-100',
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Confirmed'
        };
      case 'pending_approval':
        return {
          color: 'text-yellow-600 bg-yellow-100',
          icon: <Clock className="w-4 h-4" />,
          text: 'Pending Approval'
        };
      case 'payment_pending':
        return {
          color: 'text-orange-600 bg-orange-100',
          icon: <Clock className="w-4 h-4" />,
          text: 'Payment Pending'
        };
      case 'rejected':
        return {
          color: 'text-red-600 bg-red-100',
          icon: <XCircle className="w-4 h-4" />,
          text: 'Rejected'
        };
      case 'cancelled':
        return {
          color: 'text-gray-600 bg-gray-100',
          icon: <XCircle className="w-4 h-4" />,
          text: 'Cancelled'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100',
          icon: <Clock className="w-4 h-4" />,
          text: 'Unknown'
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Open contact modal
  const openContactModal = (booking) => {
    setSelectedOwner({
      name: booking.property?.ownerName,
      phone: booking.property?.ownerPhone,
      email: booking.property?.ownerEmail,
      ownerName: booking.property?.ownerName
    });
    setContactModalOpen(true);
  };

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'food':
        return <Utensils className="w-4 h-4" />;
      case 'gym':
        return <Dumbbell className="w-4 h-4" />;
      case 'cctv':
        return <Camera className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <SeekerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  return (
    <SeekerLayout>
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage and track all your room bookings and reservations.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by property name, room number, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="payment_pending">Payment Pending</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
            <button
              onClick={fetchBookings}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">
              {bookings.length === 0 
                ? "You haven't made any bookings yet. Start exploring properties to book your perfect room!"
                : "No bookings match your current filters. Try adjusting your search criteria."
              }
            </p>
            {bookings.length === 0 && (
              <button
                onClick={() => navigate('/seeker-dashboard')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => {
              const statusInfo = getStatusInfo(booking.status);
              
              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Room and Property Images */}
                      <div className="lg:w-80 flex-shrink-0">
                        <div className="relative">
                          {/* Room Image (Primary) */}
                          <img
                            src={booking.room?.roomImage || booking.room?.images?.[0] || booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'}
                            alt={`Room ${booking.room?.roomNumber || 'N/A'} - ${booking.property?.propertyName || 'Property'}`}
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop';
                            }}
                          />
                          <div className="absolute top-3 right-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                              {statusInfo.icon}
                              {statusInfo.text}
                            </span>
                          </div>
                          {/* Room Number Badge */}
                          <div className="absolute bottom-3 left-3">
                            <span className="px-3 py-1 bg-black bg-opacity-70 text-white text-sm font-medium rounded-lg">
                              Room {booking.room?.roomNumber || 'N/A'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Property Image (Secondary) - Smaller */}
                        {booking.property?.images?.[0] && booking.room?.images?.[0] && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                              <Building className="w-3 h-3" />
                              <span>Property View</span>
                            </div>
                            <img
                              src={booking.property.images[0]}
                              alt={booking.property.propertyName || 'Property'}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        {/* Room Image Gallery - If multiple room images */}
                        {((booking.room?.images && booking.room.images.length > 1) || (booking.room?.roomImage && booking.room?.toiletImage)) && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                              <Camera className="w-3 h-3" />
                              <span>Room Gallery</span>
                            </div>
                            <div className="flex gap-1 overflow-x-auto">
                              {/* Room Image */}
                              {booking.room?.roomImage && (
                                <img
                                  src={booking.room.roomImage}
                                  alt={`Room ${booking.room?.roomNumber || 'N/A'} - Main`}
                                  className="w-16 h-12 object-cover rounded border"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              {/* Toilet Image */}
                              {booking.room?.toiletImage && (
                                <img
                                  src={booking.room.toiletImage}
                                  alt={`Room ${booking.room?.roomNumber || 'N/A'} - Bathroom`}
                                  className="w-16 h-12 object-cover rounded border"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              {/* Additional images from images array */}
                              {booking.room?.images && booking.room.images.slice(0, 2).map((image, idx) => (
                                <img
                                  key={idx}
                                  src={image}
                                  alt={`Room ${booking.room?.roomNumber || 'N/A'} - Photo ${idx + 1}`}
                                  className="w-16 h-12 object-cover rounded border"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                          <div>
                            {/* Property Name - More Prominent */}
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="w-5 h-5 text-blue-600" />
                              <h3 className="text-2xl font-bold text-gray-900">
                                {booking.property?.propertyName || 'Unnamed Property'}
                              </h3>
                            </div>
                            
                            {/* Address */}
                            <div className="flex items-center text-gray-600 mb-3">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {booking.property?.address 
                                  ? (typeof booking.property.address === 'string' 
                                      ? booking.property.address 
                                      : `${booking.property.address.street || ''}, ${booking.property.address.city || ''}, ${booking.property.address.state || ''} ${booking.property.address.pincode || ''}`.trim().replace(/^,\s*|,\s*$/g, ''))
                                  : 'Address not available'
                                }
                              </span>
                            </div>
                            
                            {/* Room Details */}
                            <div className="flex items-center text-gray-600 mb-2">
                              <Bed className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">Room {booking.room?.roomNumber || 'N/A'}</span>
                              <span className="mx-2">•</span>
                              <span className="text-sm">{booking.room?.roomType || 'Standard Room'}</span>
                              {booking.room?.bedType && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span className="text-sm">{booking.room.bedType}</span>
                                </>
                              )}
                            </div>
                            
                            {/* Additional Room Info */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                              {booking.room?.occupancy && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{booking.room.occupancy} person{booking.room.occupancy > 1 ? 's' : ''}</span>
                                </div>
                              )}
                              {booking.room?.roomSize && (
                                <div className="flex items-center gap-1">
                                  <Building className="w-3 h-3" />
                                  <span>{booking.room.roomSize} sq ft</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Property Type Badge */}
                            {booking.property?.propertyType && (
                              <div className="inline-block">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  {booking.property.propertyType}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 lg:mt-0 lg:text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(booking.room?.rent || 0)}
                            </div>
                            <div className="text-sm text-gray-600">per month</div>
                          </div>
                        </div>

                        {/* Booking Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span>Check-in:</span>
                                <span>{formatDate(booking.checkInDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Check-out:</span>
                                <span>{formatDate(booking.checkOutDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Security Deposit:</span>
                                <span>{formatCurrency(booking.securityDeposit || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Amount:</span>
                                <span className="font-medium">{formatCurrency(booking.totalAmount || 0)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Payment Info</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span>Payment Status:</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  booking.payment?.paymentStatus === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {booking.payment?.paymentStatus || 'Pending'}
                                </span>
                              </div>
                              {booking.payment?.paidAt && (
                                <div className="flex justify-between">
                                  <span>Paid On:</span>
                                  <span>{formatDate(booking.payment.paidAt)}</span>
                                </div>
                              )}
                              {booking.approvedAt && (
                                <div className="flex justify-between">
                                  <span>Approved On:</span>
                                  <span>{formatDate(booking.approvedAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Room Amenities */}
                        {booking.room?.amenities && Object.keys(booking.room.amenities).length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Room Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(booking.room.amenities)
                                .filter(([key, value]) => value === true)
                                .slice(0, 6)
                                .map(([amenity, value]) => (
                                  <span
                                    key={amenity}
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                  >
                                    {getAmenityIcon(amenity)}
                                    {amenity}
                                  </span>
                                ))}
                              {Object.keys(booking.room.amenities).filter(key => booking.room.amenities[key] === true).length > 6 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  +{Object.keys(booking.room.amenities).filter(key => booking.room.amenities[key] === true).length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Property Owner */}
                        {booking.property?.ownerName && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Property Owner</h4>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{booking.property.ownerName}</span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => navigate(`/booking-dashboard/${booking._id}`)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                            View Booking Details
                          </button>
                          
                          <button
                            onClick={() => navigate(`/seeker/property/${booking.property?._id}`)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Property
                          </button>
                          
                          <button
                            onClick={() => navigate(`/seeker/room/${booking.room?._id}`)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <Bed className="w-4 h-4" />
                            View Room
                          </button>

                          <button 
                            onClick={() => openContactModal(booking)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            Contact Owner
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact Owner Modal */}
      <ContactOwnerModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        owner={selectedOwner}
      />
    </SeekerLayout>
  );
};

export default SeekerBookings;
