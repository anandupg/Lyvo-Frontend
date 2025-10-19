import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Users, 
  Home, 
  Building, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Phone,
  Mail,
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  Star,
  Wifi,
  Car,
  Utensils,
  Zap,
  Shield,
  User,
  Bed,
  Bath,
  Square
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { motion } from 'framer-motion';

const AdminPropertyDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  
  console.log('AdminPropertyDetails component loaded');
  console.log('propertyId from useParams:', propertyId);
  console.log('Current URL:', window.location.href);
  console.log('Component mounted successfully');
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Google Maps state
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const sidebarMapDivRef = useRef(null);
  const modalMapDivRef = useRef(null);

  const propertyServiceUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';

  // Calculate hasCoords early to avoid reference errors
  const hasCoords = property && typeof property.latitude === 'number' && typeof property.longitude === 'number' && 
                   !Number.isNaN(property.latitude) && !Number.isNaN(property.longitude);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const authToken = localStorage.getItem('authToken');
        const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
        const userId = user._id || user.id || '';

        console.log('Fetching property details for ID:', propertyId);
        console.log('Current URL:', window.location.href);

        const resp = await fetch(`${propertyServiceUrl}/api/admin/properties/${propertyId}`, {
          headers: {
            'Authorization': authToken ? `Bearer ${authToken}` : '',
            'x-user-id': userId
          }
        });
        const data = await resp.json();
        console.log('Admin property response:', data);
        if (!resp.ok || data.success !== true) {
          throw new Error(data.message || 'Failed to fetch property');
        }
        
        console.log('Found property:', data.data);
        setProperty(data.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  // Load Google Maps JS API
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCoPzRJLAmma54BBOyF4AhZ2ZIqGvak8CA';
    if (!key) return;
    if (window.google && window.google.maps) {
      setIsGoogleLoaded(true);
      return;
    }
    const existing = document.querySelector('script[data-google-maps="true"]');
    if (existing) {
      existing.addEventListener('load', () => setIsGoogleLoaded(true));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.onload = () => setIsGoogleLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize sidebar map
  useEffect(() => {
    if (!isGoogleLoaded || !property || !hasCoords) return;
    if (!sidebarMapDivRef.current) return;
    
    const center = {
      lat: property.latitude,
      lng: property.longitude,
    };
    
    const map = new window.google.maps.Map(sidebarMapDivRef.current, {
      center,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeId: 'roadmap',
    });
    
    new window.google.maps.Marker({ 
      map, 
      position: center, 
      draggable: false,
      title: property.name || 'Property Location'
    });
  }, [isGoogleLoaded, property, hasCoords]);

  // Initialize modal map when modal opens
  useEffect(() => {
    if (!isMapOpen || !isGoogleLoaded || !property || !hasCoords) return;
    if (!modalMapDivRef.current) return;
    
    const center = {
      lat: property.latitude,
      lng: property.longitude,
    };
    
    mapRef.current = new window.google.maps.Map(modalMapDivRef.current, {
      center,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeId: isSatellite ? 'hybrid' : 'roadmap',
    });
    
    markerRef.current = new window.google.maps.Marker({ 
      map: mapRef.current, 
      position: center, 
      draggable: false,
      title: property.name || 'Property Location'
    });
  }, [isMapOpen, isGoogleLoaded, isSatellite, property, hasCoords]);

  const toggleSatellite = () => {
    const next = !isSatellite;
    setIsSatellite(next);
    if (mapRef.current) {
      mapRef.current.setMapTypeId(next ? 'hybrid' : 'roadmap');
    }
  };

  const approveRoom = async (roomId, action) => {
    try {
      console.log(`Attempting to ${action} room:`, roomId);
      const authToken = localStorage.getItem('authToken');
      const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
      const userId = user._id || user.id || '';
      
      console.log('Auth token:', authToken ? 'Present' : 'Missing');
      console.log('User ID:', userId);
      
      const resp = await fetch(`${propertyServiceUrl}/api/admin/rooms/${roomId}/approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken}` : '',
          'x-user-id': userId
        },
        body: JSON.stringify({ action })
      });
      
      console.log('Response status:', resp.status);
      const data = await resp.json();
      console.log('Response data:', data);
      
      if (!resp.ok || data.success !== true) {
        throw new Error(data.message || 'Failed to update room');
      }
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        rooms: (prev.rooms || []).map(r => r._id === roomId ? { ...r, ...data.data } : r)
      }));
      
      // Close modal after successful update
      setShowRoomModal(false);
      
      // Show success modal
      setSuccessMessage(`Room ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      setShowSuccessModal(true);
      
      // Auto-close success modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      
      console.log(`Room ${roomId} ${action}ed successfully`);
    } catch (e) {
      console.error(`Error ${action}ing room:`, e);
      setErrorMessage(`Failed to ${action} room: ${e.message}`);
      setShowErrorModal(true);
      
      // Auto-close error modal after 5 seconds
      setTimeout(() => {
        setShowErrorModal(false);
      }, 5000);
    }
  };

  const approveProperty = async (action) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
      const userId = user._id || user.id || '';

      const resp = await fetch(`${propertyServiceUrl}/api/admin/properties/${propertyId}/approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken}` : '',
          'x-user-id': userId
        },
        body: JSON.stringify({ action })
      });

      const data = await resp.json();
      if (!resp.ok || data.success !== true) {
        throw new Error(data.message || 'Failed to update property');
      }

      setProperty(prev => ({ ...prev, ...data.data }));
      setSuccessMessage(`Property ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (e) {
      setErrorMessage(e.message);
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 5000);
    }
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      ac: '❄️',
      wifi: '📶',
      tv: '📺',
      fridge: '🧊',
      wardrobe: '👔',
      studyTable: '📚',
      balcony: '🏠',
      attachedBathroom: '🚿',
      parking4w: '🚗',
      parking2w: '🏍️',
      kitchen: '🍳',
      powerBackup: '🔋'
    };
    return icons[amenity] || '✓';
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Active', color: 'bg-green-100 text-green-800' },
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      approved: { text: 'Approved', color: 'bg-green-100 text-green-800' },
      rejected: { text: 'Rejected', color: 'bg-red-100 text-red-800' },
      inactive: { text: 'Inactive', color: 'bg-gray-100 text-gray-800' }
    };
    return badges[status] || badges.pending;
  };

  const openRoomModal = (room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !property) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Property not found'}</p>
            <button
              onClick={() => navigate('/admin-properties')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Back to Properties
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin-properties')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{property.property_name}</h1>
                  <p className="text-gray-600">{property.owner?.name || 'Unknown Owner'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(property.approval_status || 'pending').color}`}>
                  {getStatusBadge(property.approval_status || 'pending').text}
                </span>
                {['pending','rejected'].includes(property.approval_status || 'pending') && (
                  <button
                    onClick={() => approveProperty('approve')}
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                  >
                    Approve Property
                  </button>
                )}
                {['pending','approved'].includes(property.approval_status || 'pending') && (
                  <button
                    onClick={() => approveProperty('reject')}
                    className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                  >
                    Reject Property
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Images */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Property Images
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.images?.front && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Front View</h3>
                        <img src={property.images.front} alt="Front View" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                    {property.images?.back && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Back View</h3>
                        <img src={property.images.back} alt="Back View" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                    {property.images?.hall && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Hall</h3>
                        <img src={property.images.hall} alt="Hall" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                    {property.images?.kitchen && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Kitchen</h3>
                        <img src={property.images.kitchen} alt="Kitchen" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                    {property.outside_toilet_image && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Outside Toilet</h3>
                        <img src={property.outside_toilet_image} alt="Outside Toilet" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                  {property.images?.gallery && property.images.gallery.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {property.images.gallery.map((image, index) => (
                          <img key={index} src={image} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Property Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Property Details
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                      <p className="text-gray-900">{property.description || 'No description provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Address</h3>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-gray-900">{property.address?.street || 'N/A'}</p>
                          <p className="text-gray-600">{property.address?.city || 'N/A'}, {property.address?.state || 'N/A'}</p>
                          <p className="text-gray-600">Pincode: {property.address?.pincode || 'N/A'}</p>
                          {property.address?.landmark && (
                            <p className="text-gray-600">Landmark: {property.address.landmark}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Security Deposit</h3>
                      <p className="text-2xl font-bold text-gray-900">₹{property.security_deposit?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Monthly Rent</h3>
                      <p className="text-2xl font-bold text-gray-900">₹{property.monthly_rent?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Coordinates</h3>
                      <p className="text-sm text-gray-600">
                        {hasCoords ? `${property.latitude}, ${property.longitude}` : 'Not provided'}
                      </p>
                    </div>
                  </div>

                  {/* Amenities */}
                  {property.amenities && Object.keys(property.amenities).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Property Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(property.amenities).map(([amenity, available]) => {
                          if (available) {
                            return (
                              <div key={amenity} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                                <span className="text-lg">{getAmenityIcon(amenity)}</span>
                                <span className="text-sm font-medium text-green-800 capitalize">
                                  {amenity.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Rules */}
                  {property.rules && Object.keys(property.rules).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">House Rules</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(property.rules).map(([rule, value]) => (
                          <div key={rule} className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-sm text-gray-700 capitalize">
                              {rule.replace(/([A-Z])/g, ' $1').trim()}: {value ? 'Allowed' : 'Not Allowed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Rooms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Rooms ({(property.rooms || []).length})
                    </h2>
                    
                    {/* Bulk Room Actions */}
                    {(property.rooms || []).some(room => room.approval_status === 'pending') && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const pendingRooms = (property.rooms || []).filter(room => room.approval_status === 'pending');
                            if (window.confirm(`Are you sure you want to approve all ${pendingRooms.length} pending rooms?`)) {
                              pendingRooms.forEach(room => approveRoom(room._id, 'approve'));
                            }
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Approve All Pending
                        </button>
                        <button
                          onClick={() => {
                            const pendingRooms = (property.rooms || []).filter(room => room.approval_status === 'pending');
                            if (window.confirm(`Are you sure you want to reject all ${pendingRooms.length} pending rooms?`)) {
                              pendingRooms.forEach(room => approveRoom(room._id, 'reject'));
                            }
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject All Pending
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Room Status Summary */}
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <div className="flex items-center space-x-6">
                    {(property.rooms || []).filter(room => room.approval_status === 'pending').length > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {(property.rooms || []).filter(room => room.approval_status === 'pending').length} Pending
                        </span>
                      </div>
                    )}
                    {(property.rooms || []).filter(room => room.approval_status === 'approved').length > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {(property.rooms || []).filter(room => room.approval_status === 'approved').length} Approved
                        </span>
                      </div>
                    )}
                    {(property.rooms || []).filter(room => room.approval_status === 'rejected').length > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {(property.rooms || []).filter(room => room.approval_status === 'rejected').length} Rejected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(property.rooms || []).map((room) => {
                      const roomStatus = getStatusBadge(room.approval_status || 'pending');
                      return (
                        <div key={room._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Room {room.room_number}</h3>
                              <p className="text-sm text-gray-600">{room.room_type} • {room.room_size} sq ft</p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roomStatus.color}`}>
                              {roomStatus.text}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Rent</span>
                              <span className="font-semibold text-gray-900">₹{room.rent?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Occupancy</span>
                              <span className="font-semibold text-gray-900">{room.occupancy || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Bed Type</span>
                              <span className="font-semibold text-gray-900">{room.bed_type || 'N/A'}</span>
                            </div>
                          </div>

                          {room.description && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600">{room.description}</p>
                            </div>
                          )}

                          {/* Room Images */}
                          <div className="mt-4 space-y-2">
                            {room.room_image && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-700 mb-1">Room Image</h4>
                                <img src={room.room_image} alt="Room" className="w-full h-32 object-cover rounded" />
                              </div>
                            )}
                            {room.toilet_image && room.amenities?.attachedBathroom && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-700 mb-1">Toilet Image</h4>
                                <img src={room.toilet_image} alt="Toilet" className="w-full h-32 object-cover rounded" />
                              </div>
                            )}
                          </div>

                          {/* Room Amenities */}
                          {room.amenities && Object.keys(room.amenities).length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-xs font-medium text-gray-700 mb-2">Room Amenities</h4>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(room.amenities).map(([amenity, available]) => {
                                  if (available) {
                                    return (
                                      <span key={amenity} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                        {getAmenityIcon(amenity)} {amenity.replace(/([A-Z])/g, ' $1').trim()}
                                      </span>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="mt-4 flex items-center space-x-2">
                            <button
                              onClick={() => openRoomModal(room)}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4 inline mr-1" />
                              View Details
                            </button>
                            
                            {/* Room Approval Buttons */}
                            {room.approval_status === 'pending' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    approveRoom(room._id, 'approve');
                                  }}
                                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center"
                                >
                                  <CheckCircle2 className="w-4 h-4 inline mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    approveRoom(room._id, 'reject');
                                  }}
                                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center"
                                >
                                  <XCircle className="w-4 h-4 inline mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                            
                            {/* Show status for approved/rejected rooms */}
                            {room.approval_status === 'approved' && (
                              <div className="flex-1 bg-green-100 text-green-800 px-3 py-2 rounded text-sm text-center font-medium">
                                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                                Approved
                              </div>
                            )}
                            
                            {room.approval_status === 'rejected' && (
                              <div className="flex-1 bg-red-100 text-red-800 px-3 py-2 rounded text-sm text-center font-medium">
                                <XCircle className="w-4 h-4 inline mr-1" />
                                Rejected
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Map */}
              {hasCoords && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Location
                      </h3>
                      <button
                        onClick={() => setIsMapOpen(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Full Map
                      </button>
                    </div>
                  </div>
                  <div className="h-64 relative">
                    {isGoogleLoaded ? (
                      <div 
                        ref={sidebarMapDivRef} 
                        className="w-full h-full"
                        style={{ minHeight: '256px' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Loading map...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Owner Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Owner Information
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{property.owner?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{property.owner?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Owner ID</p>
                    <p className="text-gray-900 font-mono text-sm">{property.owner_id}</p>
                  </div>
                </div>
              </motion.div>

              {/* Documents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Documents
                  </h3>
                </div>
                <div className="p-4">
                  {property.land_tax_receipt ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Land Tax Receipt</p>
                          <p className="text-xs text-gray-500">PDF Document</p>
                        </div>
                      </div>
                      <a
                        href={property.land_tax_receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Room Detail Modal */}
        {showRoomModal && selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Room {selectedRoom.room_number} Details</h2>
                  <button
                    onClick={() => setShowRoomModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Room Type</h3>
                    <p className="text-gray-900">{selectedRoom.room_type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Room Size</h3>
                    <p className="text-gray-900">{selectedRoom.room_size} sq ft</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Bed Type</h3>
                    <p className="text-gray-900">{selectedRoom.bed_type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Occupancy</h3>
                    <p className="text-gray-900">{selectedRoom.occupancy}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Rent</h3>
                    <p className="text-gray-900">₹{selectedRoom.rent?.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Status</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedRoom.approval_status || 'pending').color}`}>
                      {getStatusBadge(selectedRoom.approval_status || 'pending').text}
                    </span>
                  </div>
                </div>

                {selectedRoom.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-900">{selectedRoom.description}</p>
                  </div>
                )}

                {selectedRoom.amenities && Object.keys(selectedRoom.amenities).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedRoom.amenities).map(([amenity, available]) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="text-sm text-gray-700 capitalize">
                            {amenity.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-4 border-t"></div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
                <p className="text-sm text-gray-600 mb-4">{successMessage}</p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error!</h3>
                <p className="text-sm text-gray-600 mb-4">{errorMessage}</p>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Full Screen Map Modal */}
        {isMapOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="text-lg font-semibold text-gray-900">Property Location</div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={toggleSatellite} 
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
                  >
                    {isSatellite ? 'Satellite' : 'Map'} view
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsMapOpen(false)} 
                    className="px-3 py-1 text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div ref={modalMapDivRef} style={{ width: '100%', height: '500px' }} />
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 flex items-center justify-between">
                <div>
                  Lat: {property?.latitude || '—'} | Lng: {property?.longitude || '—'}
                </div>
                <div className="text-xs text-gray-500">
                  {property?.name || 'Property Location'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPropertyDetails;
