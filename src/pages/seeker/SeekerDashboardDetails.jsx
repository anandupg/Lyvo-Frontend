import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

const SeekerDashboardDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [property, setProperty] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default to Bangalore
  const [mapZoom, setMapZoom] = useState(15);
  
  // Refs for Google Maps
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  
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

  // Initialize Google Maps
  const initializeGoogleMaps = async () => {
    try {
      // Load Google Maps API if not already loaded
      if (!window.google || !window.google.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCoPzRJLAmma54BBOyF4AhZ2ZIqGvak8CA&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Initialize map
      if (mapRef.current && window.google && window.google.maps) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: mapZoom,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        });

        // Add marker
        markerRef.current = new window.google.maps.Marker({
          position: mapCenter,
          map: mapInstanceRef.current,
          title: property?.property_name || 'Property Location',
        });
      }
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  };

  // Test API connectivity
  const testApiConnectivity = async () => {
    const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
    
    try {
      console.log('Testing API connectivity...');
      console.log('Base URL:', baseUrl);
      
      // Test basic connectivity
      const testResponse = await fetch(`${baseUrl}/test-db`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log('API Connectivity Test:', testData);
        return true;
      } else {
        console.error('API connectivity test failed:', testResponse.status);
        return false;
      }
    } catch (error) {
      console.error('API connectivity error:', error);
      return false;
    }
  };

  // Fetch property details
  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      
      console.log('=== FETCHING PROPERTY DETAILS ===');
      console.log('Property ID:', propertyId);
      console.log('Base URL:', baseUrl);
      console.log('Full URL:', `${baseUrl}/api/public/properties/${propertyId}`);
      
      // Test API connectivity first
      const isApiConnected = await testApiConnectivity();
      if (!isApiConnected) {
        throw new Error('Property service is not accessible. Please ensure the service is running on port 3002.');
      }
      
      const response = await fetch(
        `${baseUrl}/api/public/properties/${propertyId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Property API Response Status:', response.status);
      console.log('Property API Response Headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        if (response.status === 404) {
          throw new Error('Property not found or not approved. Please check if the property ID is correct.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please check if the property service is running and the database is connected.');
        } else {
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('Property API Response Data:', data);
      
      if (data.success && data.data) {
        setProperty(data.data);
        setRooms(data.data.rooms || []);
        
        // Set map center if coordinates are available
        if (data.data.latitude && data.data.longitude) {
          setMapCenter({
            lat: parseFloat(data.data.latitude),
            lng: parseFloat(data.data.longitude)
          });
        }
      } else {
        throw new Error(data.message || 'Failed to fetch property details');
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      toast({
        title: "Error",
        description: `Failed to load property details: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle room booking with Razorpay payment
  const handleBookRoom = async (roomId) => {
    const userId = getUserId();
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please login to book a room",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setBookingLoading(prev => ({ ...prev, [roomId]: true }));

    try {
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      
      // Step 1: Create payment order
      const orderResponse = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId, 
          roomId, 
          propertyId: propertyId 
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();
      console.log('Payment order created:', orderData);

      // Step 2: Initialize Razorpay
      const options = {
        key: 'rzp_test_RL5vMta3bKvRd4', // Your Razorpay key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Lyvo',
        description: `Booking for ${orderData.paymentDetails.roomDetails.roomType} Room`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // Step 3: Verify payment
          try {
            const verifyResponse = await fetch(`${baseUrl}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                roomId,
                propertyId: propertyId,
                monthlyRent: orderData.paymentDetails.monthlyRent,
                securityDeposit: orderData.paymentDetails.securityDeposit
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            console.log('Payment verified and booking created:', verifyData);

            toast({
              title: "Payment Successful!",
              description: "Your room has been booked successfully.",
              variant: "default",
            });

          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: (() => {
            const userData = localStorage.getItem('user');
            if (userData) {
              try {
                const parsed = JSON.parse(userData);
                return parsed.name || '';
              } catch (e) {
                return '';
              }
            }
            return '';
          })(),
          email: (() => {
            const userData = localStorage.getItem('user');
            if (userData) {
              try {
                const parsed = JSON.parse(userData);
                return parsed.email || '';
              } catch (e) {
                return '';
              }
            }
            return '';
          })(),
          contact: (() => {
            const userData = localStorage.getItem('user');
            if (userData) {
              try {
                const parsed = JSON.parse(userData);
                return parsed.phone || '';
              } catch (e) {
                return '';
              }
            }
            return '';
          })()
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled. You can try again.",
              variant: "destructive",
            });
          }
        }
      };

      // Initialize Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Error creating payment order:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(prev => ({ ...prev, [roomId]: false }));
    }
  };

  // Get behavioral match percentage (placeholder)
  const getBehavioralMatch = () => {
    // TODO: Replace with actual ML-based behavioral matching
    return Math.floor(Math.random() * 30) + 70; // Random between 70-100%
  };

  // Get verification badge (placeholder)
  const getVerificationBadge = () => {
    // TODO: Replace with actual OCR verification status
    return Math.random() > 0.3; // 70% chance of being verified
  };

  useEffect(() => {
    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  useEffect(() => {
    if (property && mapCenter.lat && mapCenter.lng) {
      initializeGoogleMaps();
    }
  }, [property, mapCenter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
          <p className="text-sm text-gray-500 mt-2">Property ID: {propertyId}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or is no longer available.</p>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <p>Property ID: {propertyId}</p>
            <p>Please check if the property service is running on port 3002</p>
          </div>
          <button
            onClick={() => navigate('/seeker/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.property_name}</h1>
              <p className="text-gray-600 mt-1">
                {property.address?.street}, {property.address?.city}, {property.address?.state}
              </p>
            </div>
            <button
              onClick={() => navigate('/seeker/dashboard')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Images */}
            {property.images && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Images</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(property.images).map(([key, imageUrl]) => {
                      if (imageUrl && typeof imageUrl === 'string') {
                        return (
                          <div key={key} className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={imageUrl}
                              alt={`Property ${key}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Property Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
              
              {/* Property Amenities */}
              {property.amenities && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Property Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(property.amenities).map(([key, value]) => {
                      if (value === true) {
                        return (
                          <span
                            key={key}
                            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                          >
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Google Map */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                <div 
                  ref={mapRef}
                  className="h-64 w-full rounded-lg overflow-hidden"
                  style={{ minHeight: '256px' }}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Coordinates: {mapCenter.lat.toFixed(6)}, {mapCenter.lng.toFixed(6)}
                </p>
              </div>
            </div>

            {/* Rooms Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Rooms</h2>
              
              {rooms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms available</h3>
                  <p className="text-gray-600">This property doesn't have any available rooms at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map((room) => (
                    <div key={room._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      {/* Room Images */}
                      {(room.roomImage || room.toiletImage) && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {room.roomImage && (
                            <div className="aspect-square overflow-hidden rounded-lg">
                              <img
                                src={room.roomImage}
                                alt="Room"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          {room.toiletImage && (
                            <div className="aspect-square overflow-hidden rounded-lg">
                              <img
                                src={room.toiletImage}
                                alt="Toilet"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Room Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Room {room.roomNumber} • {room.roomType}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              room.isAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {room.isAvailable ? 'Available' : 'Not Available'}
                            </span>
                            {getVerificationBadge() && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Size: {room.roomSize} sq ft</p>
                          <p>Bed: {room.bedType}</p>
                          <p>Occupancy: {room.occupancy} person{room.occupancy > 1 ? 's' : ''}</p>
                        </div>

                        {room.description && (
                          <p className="text-sm text-gray-700">{room.description}</p>
                        )}

                        {/* Room Amenities */}
                        {room.amenities && Object.keys(room.amenities).some(key => room.amenities[key] === true) && (
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(room.amenities).map(([key, value]) => {
                              if (value === true) {
                                return (
                                  <span
                                    key={key}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                  >
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </span>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}

                        {/* Behavioral Match */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-900">Behavioral Match</span>
                            <span className="text-sm font-bold text-blue-900">{getBehavioralMatch()}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getBehavioralMatch()}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Price and Book Button */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{room.rent ? room.rent.toLocaleString() : 'Ask Price'}
                            </span>
                            <span className="text-sm text-gray-600">/month</span>
                          </div>
                          <button
                            onClick={() => handleBookRoom(room._id)}
                            disabled={!room.isAvailable || bookingLoading[room._id]}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                              room.isAvailable && !bookingLoading[room._id]
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {bookingLoading[room._id] ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Booking...
                              </div>
                            ) : (
                              'Book Now'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Owner</span>
                  <p className="font-medium text-gray-900">{property.ownerName || 'Unknown Owner'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Security Deposit</span>
                  <p className="font-medium text-gray-900">₹{property.security_deposit?.toLocaleString() || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Rooms</span>
                  <p className="font-medium text-gray-900">{rooms.length}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Available Rooms</span>
                  <p className="font-medium text-gray-900">
                    {rooms.filter(room => room.isAvailable).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Owner */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Owner</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about this property? Contact the owner directly.
              </p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Contact Owner
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Add to Favorites
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Share Property
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboardDetails;