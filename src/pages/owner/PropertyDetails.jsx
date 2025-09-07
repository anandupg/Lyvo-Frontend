 import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { 
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  Star,
  Calendar,
  Building,
  Home,
  Car,
  Wifi,
  Coffee,
  Dumbbell,
  Shield,
  Camera,
  Edit,
  Trash2,
  Share2,
  FileText,
  Download,
  Eye,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const openDocumentPreview = (docUrl, fileName) => {
    const isPdf = fileName.toLowerCase().endsWith('.pdf');
    console.log('Opening document preview:', { docUrl, fileName, isPdf });
    
    // Test if the URL is accessible
    fetch(docUrl, { method: 'HEAD' })
      .then(response => {
        console.log('Document URL response:', response.status, response.statusText);
        if (!response.ok) {
          console.error('Document URL not accessible:', response.status);
        }
      })
      .catch(error => {
        console.error('Error checking document URL:', error);
      });
    
    setPreviewDoc({
      url: docUrl,
      name: fileName,
      type: isPdf ? 'pdf' : 'image'
    });
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
    };

    checkAuth();
  }, [navigate]);

  // Fetch property details
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        console.log('PropertyDetails - Fetching property with ID:', id);
        const authToken = localStorage.getItem('authToken');
        if (!authToken) return;

        const url = `${import.meta.env.VITE_ADD_PROPERTY_API_URL || 'http://localhost:3002'}/api/properties/${id}`;
        console.log('PropertyDetails - Fetching from URL:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'x-user-id': (() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u._id || u.id || ''; } catch { return ''; } })()
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('Property details fetched:', result.data);
            console.log('Property documents:', result.data.documents);
            setProperty(result.data);
          }
        } else {
          console.error('Failed to fetch property:', response.status);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  // Process images to create the expected array format
  const processImages = (imagesData) => {
    if (!imagesData) return [];
    
    const imageArray = [];
    
    // Handle both old format (frontImage, backImage, etc.) and new format (front, back, etc.)
    const imageMappings = [
      { key: 'front', label: 'Front View' },
      { key: 'hall', label: 'Hall' },
      { key: 'room', label: 'Room' },
      { key: 'back', label: 'Back View' },
      { key: 'toilet', label: 'Toilet' },
      { key: 'frontImage', label: 'Front View' },
      { key: 'hallImage', label: 'Hall' },
      { key: 'roomImage', label: 'Room' },
      { key: 'backImage', label: 'Back View' },
      { key: 'toiletImage', label: 'Toilet' }
    ];
    
    // Add individual images
    imageMappings.forEach(({ key, label }) => {
      if (imagesData[key] && imagesData[key] !== null) {
        imageArray.push({
          url: imagesData[key],
          label: label
        });
      }
    });
    
    // Add additional images array if it exists
    if (imagesData.images && Array.isArray(imagesData.images)) {
      imagesData.images.forEach((url, index) => {
        if (url && url !== null) {
          imageArray.push({
            url: url,
            label: `Additional Image ${index + 1}`
          });
        }
      });
    }
    
    return imageArray;
  };

  const goToNextImage = () => {
    if (property?.images && property.images.length > 1) {
      setCurrentImageIndex(prev => (prev + 1) % property.images.length);
    }
  };

  const goToPrevImage = () => {
    if (property?.images && property.images.length > 1) {
      setCurrentImageIndex(prev => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'wifi': Wifi,
      'parking': Car,
      'kitchen': Coffee,
      'gym': Dumbbell,
      'security': Shield,
      'camera': Camera,
      'ac': Coffee,
      'waterSupply': Coffee,
      'powerBackup': Coffee,
      'garden': Coffee,
      'swimmingPool': Coffee
    };
    return iconMap[amenity.toLowerCase()] || Home;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  if (!property) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/owner-properties')}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </button>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  // Process images
  const processedImages = processImages(property.images);

  return (
    <OwnerLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/owner-properties')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{property.property_name}</h1>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{property.address?.city}, {property.address?.state}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building className="w-4 h-4" />
                      <span>{property.property_type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>Max {property.max_occupancy || 'N/A'} people</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => navigate(`/owner-edit-property/${property._id || property.id}`)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              {processedImages.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="relative">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={processedImages[currentImageIndex]?.url}
                      alt={processedImages[currentImageIndex]?.label}
                      className="w-full h-96 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=800&h=600&fit=crop&crop=center';
                      }}
                    />
                  </div>
                    
                    {/* Navigation arrows */}
                    {processedImages.length > 1 && (
                      <>
                        <button
                          onClick={goToPrevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={goToNextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Image counter and label */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {processedImages.length}
                      </span>
                      <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {processedImages[currentImageIndex]?.label}
                      </span>
                    </div>

                    {/* Fullscreen button */}
                    <button
                      onClick={() => setIsImageModalOpen(true)}
                      className="absolute bottom-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Thumbnail strip */}
                  {processedImages.length > 1 && (
                    <div className="p-4 bg-gray-50">
                      <div className="flex space-x-2 overflow-x-auto">
                        {processedImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              index === currentImageIndex ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={image.label}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Available</h3>
                  <p className="text-gray-500 mb-4">This property doesn't have any images uploaded yet.</p>
                  <button
                    onClick={() => navigate(`/owner-edit-property/${property._id || property.id}`)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Add Images
                  </button>
                </div>
              )}

              {/* Property Description */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Pricing Details */}
              {property.pricing && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {property.pricing.monthly_rent && (
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                        <p className="text-2xl font-bold text-green-600">{formatPrice(property.pricing.monthly_rent)}</p>
                      </div>
                    )}
                    {property.pricing.security_deposit && (
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Security Deposit</p>
                        <p className="text-2xl font-bold text-blue-600">{formatPrice(property.pricing.security_deposit)}</p>
                      </div>
                    )}
                    {property.pricing.maintenance_charges > 0 && (
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <Home className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Maintenance</p>
                        <p className="text-2xl font-bold text-purple-600">{formatPrice(property.pricing.maintenance_charges)}</p>
                      </div>
                    )}
                    {property.pricing.utility_charges > 0 && (
                      <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <Wifi className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Utilities</p>
                        <p className="text-2xl font-bold text-orange-600">{formatPrice(property.pricing.utility_charges)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && Object.keys(property.amenities).length > 0 && (() => {
                const availableAmenities = Object.entries(property.amenities).filter(([amenity, available]) => available === true);
                return availableAmenities.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {availableAmenities.map(([amenity, available]) => {
                        const IconComponent = getAmenityIcon(amenity);
                        return (
                          <div key={amenity} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <IconComponent className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800 capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* House Rules */}
              {property.rules && Object.keys(property.rules).length > 0 && (() => {
                const activeRules = Object.entries(property.rules).filter(([rule, value]) => value === true);
                return activeRules.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">House Rules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeRules.map(([rule, value]) => (
                        <div key={rule} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700 capitalize">{rule.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Property Documents */}
              {property.documents && property.documents.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Documents</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.documents.map((docUrl, index) => {
                      const fileName = docUrl.split('/').pop() || `Document ${index + 1}`;
                      const isPdf = fileName.toLowerCase().endsWith('.pdf');
                      return (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{fileName}</p>
                              <p className="text-xs text-gray-500">{isPdf ? 'PDF Document' : 'Image Document'}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openDocumentPreview(docUrl, fileName)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <a
                              href={docUrl}
                              download={fileName}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Property Status */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Status</h3>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Property Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Property Type</p>
                      <p className="font-medium">{property.property_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Maximum Occupancy</p>
                      <p className="font-medium">{property.max_occupancy || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Listed On</p>
                      <p className="font-medium">{new Date(property.createdAt || property.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Street</p>
                      <p className="font-medium">{property.address?.street || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">City, State</p>
                      <p className="font-medium">{property.address?.city}, {property.address?.state}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Pincode</p>
                      <p className="font-medium">{property.address?.pincode || 'Not provided'}</p>
                    </div>
                  </div>
                  {property.address?.landmark && (
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Landmark</p>
                        <p className="font-medium">{property.address.landmark}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              {property.latitude && property.longitude && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Coordinates</p>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">{property.latitude}, {property.longitude}</p>
                    </div>
                    <button 
                      onClick={() => {
                        const googleMapsUrl = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
                        window.open(googleMapsUrl, '_blank');
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View on Google Maps</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {isImageModalOpen && processedImages.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <img
                src={processedImages[currentImageIndex]?.url}
                alt={processedImages[currentImageIndex]?.label}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              {processedImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Document Preview Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="text-sm font-semibold text-gray-900">Document Preview - {previewDoc.name}</div>
                <button 
                  type="button" 
                  onClick={() => setPreviewDoc(null)} 
                  className="px-2 py-1 text-gray-500 hover:text-gray-700 text-sm"
                >
                  Close
                </button>
              </div>
              <div className="p-4 max-h-[80vh] overflow-auto">
                {previewDoc.type === 'pdf' ? (
                  <div className="w-full h-[70vh] border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <iframe 
                      title="PDF Preview" 
                      src={`${previewDoc.url}#toolbar=1&navpanes=1&scrollbar=1`}
                      className="w-full h-full border-0" 
                      style={{ minHeight: '600px' }}
                      onLoad={() => {
                        console.log('PDF iframe loaded successfully');
                      }}
                      onError={(e) => {
                        console.error('PDF iframe error:', e);
                        // Show fallback message
                        e.target.style.display = 'none';
                        const fallback = e.target.parentElement;
                        fallback.innerHTML = `
                          <div class="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
                            <div class="text-center">
                              <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                              <h3 class="text-lg font-medium text-gray-900 mb-2">PDF Preview Not Available</h3>
                              <p class="text-gray-600 mb-4">This PDF cannot be previewed in the browser.</p>
                              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                                <a href="${previewDoc.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                  <ExternalLink class="w-4 h-4 mr-2" />
                                  Open in New Tab
                                </a>
                                <a href="${previewDoc.url}" download="${previewDoc.name}" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                  <Download class="w-4 h-4 mr-2" />
                                  Download PDF
                                </a>
                              </div>
                            </div>
                          </div>
                        `;
                      }}
                    />
                  </div>
                ) : (
                  <img 
                    src={previewDoc.url} 
                    alt={previewDoc.name} 
                    className="w-full max-h-[70vh] object-contain border border-gray-200 rounded-lg" 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                    }}
                  />
                )}
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {previewDoc.type === 'pdf' ? 'PDF Document' : 'Image Document'}
                </div>
                <div className="flex gap-2">
                  {previewDoc.type === 'pdf' && (
                    <a
                      href={previewDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open in New Tab
                    </a>
                  )}
                  <a
                    href={previewDoc.url}
                    download={previewDoc.name}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};

export default PropertyDetails;