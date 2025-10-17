import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { ArrowLeft, Heart } from 'lucide-react';
import SeekerLayout from '../../components/seeker/SeekerLayout';

const RoomDetailsView = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  // State management
  const [room, setRoom] = useState(null);
  const [property, setProperty] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [checkingBookingStatus, setCheckingBookingStatus] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [statusPolling, setStatusPolling] = useState(false);
  const [pollingStartTime, setPollingStartTime] = useState(null);
  const [justPaid, setJustPaid] = useState(false);
  const [aadharStatus, setAadharStatus] = useState(null);
  const [checkingAadharStatus, setCheckingAadharStatus] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(false);
  
  // Refs for Google Maps
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const pollIntervalRef = useRef(null);
  
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

  // Check if user has existing booking for this room
  const checkBookingStatus = async () => {
    const userId = getUserId();
    if (!userId || !roomId) return;

    setCheckingBookingStatus(true);
    try {
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      const response = await fetch(`${baseUrl}/api/bookings/check-status?userId=${userId}&roomId=${roomId}`);
      
      if (response.ok) {
        const data = await response.json();
        setBookingStatus(data);
        
        // Stop polling if booking is confirmed or rejected
        if (data?.status === 'confirmed' || data?.status === 'rejected') {
          setStatusPolling(false);
        }
      }
    } catch (error) {
      console.error('Error checking booking status:', error);
    } finally {
      setCheckingBookingStatus(false);
    }
  };

  // Start polling for status updates
  const startStatusPolling = () => {
    if (statusPolling || pollIntervalRef.current) return; // Already polling
    
    setStatusPolling(true);
    setPollingStartTime(Date.now());
    
    pollIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const pollingDuration = now - pollingStartTime;
      
      // Stop polling after 5 minutes (300000ms) or if status changed
      if (pollingDuration > 300000) {
        stopStatusPolling();
        return;
      }
      
      checkBookingStatus();
    }, 10000); // Check every 10 seconds (less frequent)
  };

  // Stop polling
  const stopStatusPolling = () => {
    setStatusPolling(false);
    setPollingStartTime(null);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  // Check if room is favorited
  const checkFavoriteStatus = async () => {
    const userId = getUserId();
    if (!userId || !roomId || !property) return;

    try {
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      const response = await fetch(`${baseUrl}/api/favorites/check-status?userId=${userId}&propertyId=${property._id}&roomId=${roomId}`);
      
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    const userId = getUserId();
    if (!userId || !roomId || !property) return;

    setFavoriteLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`${baseUrl}/api/favorites/remove`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            propertyId: property._id,
            roomId: roomId
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsFavorited(false);
            toast({
              title: "Removed from Favorites",
              description: "Room has been removed from your favorites",
            });
          }
        }
      } else {
        // Add to favorites
        const response = await fetch(`${baseUrl}/api/favorites/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            propertyId: property._id,
            roomId: roomId
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsFavorited(true);
            toast({
              title: "Added to Favorites",
              description: "Room has been added to your favorites",
            });
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Back navigation with graceful fallback
  const handleBack = () => {
    const fromPropertyId = location.state?.fromPropertyId;
    // If we were sent here from a property page, replace history to that page
    if (fromPropertyId) {
      navigate(`/seeker/property/${fromPropertyId}`, { replace: true });
      return;
    }
    // Else, if we know the property id from data, replace to it
    if (property?._id) {
      navigate(`/seeker/property/${property._id}`, { replace: true });
      return;
    }
    // Otherwise, replace to dashboard to avoid loops
    navigate('/seeker-dashboard', { replace: true });
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

  // Initialize Google Maps
  const initializeGoogleMaps = async (coordinates) => {
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
      if (mapRef.current && window.google && window.google.maps && coordinates) {
        const center = { lat: coordinates.lat, lng: coordinates.lng };
        
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: center,
          zoom: 15,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        });

        // Add marker
        markerRef.current = new window.google.maps.Marker({
          position: center,
          map: mapInstanceRef.current,
          title: property?.property_name || 'Property Location',
        });
      }
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  };

  // Fetch room details
  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      
      console.log('=== FETCHING ROOM DETAILS ===');
      console.log('Room ID:', roomId);
      console.log('Base URL:', baseUrl);
      console.log('Full URL:', `${baseUrl}/api/public/rooms/${roomId}`);
      
      // Test API connectivity first
      const isApiConnected = await testApiConnectivity();
      if (!isApiConnected) {
        throw new Error('Property service is not accessible. Please ensure the service is running on port 3003.');
      }
      
      const response = await fetch(
        `${baseUrl}/api/public/rooms/${roomId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Room API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        if (response.status === 400) {
          throw new Error('Invalid room ID format. Please check the room ID.');
        } else if (response.status === 404) {
          throw new Error('Room not found in database. Please check if the room ID is correct or visit /debug/rooms to see available rooms.');
        } else if (response.status === 403) {
          throw new Error('Room is not approved yet. Please contact the property owner or wait for approval.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please check if the property service is running and the database is connected.');
        } else {
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('Room API Response Data:', data);
      
      if (data.success && data.data) {
        setRoom(data.data.room);
        setProperty(data.data.property);
        setOwner(data.data.owner);
        
        // Initialize map if coordinates are available
        if (data.data.property?.latitude && data.data.property?.longitude) {
          setTimeout(() => {
            initializeGoogleMaps({
              lat: parseFloat(data.data.property.latitude),
              lng: parseFloat(data.data.property.longitude)
            });
          }, 100);
        }
      } else {
        throw new Error(data.message || 'Failed to fetch room details');
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast({
        title: "Error",
        description: `Failed to load room details: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch tenant details for the room
  const fetchTenantDetails = async () => {
    if (!roomId) return;
    
    try {
      setLoadingTenants(true);
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      
      const response = await fetch(`${baseUrl}/api/rooms/${roomId}/tenants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTenants(data.tenants || []);
        console.log('Tenant details:', data.tenants);
      } else {
        console.error('Failed to fetch tenant details');
        setTenants([]);
      }
    } catch (error) {
      console.error('Error fetching tenant details:', error);
      setTenants([]);
    } finally {
      setLoadingTenants(false);
    }
  };

  // Check Aadhar verification status
  const checkAadharStatus = async () => {
    try {
      setCheckingAadharStatus(true);
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('No auth token found');
        return { isApproved: false, status: 'not_verified' };
      }
      
      const response = await fetch('http://localhost:4002/api/user/aadhar-status', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAadharStatus(data.aadharStatus);
        return data.aadharStatus;
      }
      return { isApproved: false, status: 'not_verified' };
    } catch (error) {
      console.error('Error checking Aadhar status:', error);
      return { isApproved: false, status: 'error' };
    } finally {
      setCheckingAadharStatus(false);
    }
  };

  // Handle room booking with Razorpay payment
  const handleBookRoom = async () => {
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

    // Check Aadhar status before allowing booking
    const aadharStatus = await checkAadharStatus();
    if (!aadharStatus.isApproved) {
      toast({
        title: "Identity Verification Required",
        description: aadharStatus.message || "Please verify your identity before booking a room",
        variant: "destructive",
      });
      navigate('/seeker-kyc');
      return;
    }

    setBookingLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      
      // Step 1: Create payment order
      const orderResponse = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId, 
          roomId, 
          propertyId: property?._id 
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
                propertyId: property?._id,
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
              description: "Your payment has been processed. Waiting for owner approval.",
              variant: "default",
            });

            // Update booking status in real-time
            setJustPaid(true);
            await checkBookingStatus();
            
            // Reset justPaid flag after 30 seconds
            setTimeout(() => {
              setJustPaid(false);
            }, 30000);

            // Optionally redirect to booking confirmation page
            // navigate('/booking-confirmation');

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
      setBookingLoading(false);
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

  // Format field names for display
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .replace(/_/g, ' ') // Replace underscores with spaces
      .trim();
  };

  // Check if field should be displayed
  const shouldDisplayField = (key, value) => {
    // Skip internal MongoDB fields
    const skipFields = ['_id', '__v', 'created_at', 'updated_at', 'createdAt', 'updatedAt', 'property_id', 'approved_at', 'approved_by'];
    if (skipFields.includes(key)) return false;
    
    // Skip image-related fields; images are rendered in the gallery section
    const imageFieldPatterns = [
      'room_image', 'roomImage', 'toilet_image', 'toiletImage',
      'image', 'img', 'photo', 'thumbnail', 'coverImage',
      'images', 'gallery', 'photos'
    ];
    if (imageFieldPatterns.some((pattern) => key.toLowerCase().includes(pattern.toLowerCase()))) {
      return false;
    }
    
    // Skip null, undefined, or empty values
    if (value === null || value === undefined || value === '') return false;
    
    // Skip boolean false values for amenities
    if (typeof value === 'boolean' && !value) return false;
    
    return true;
  };

  // Get all images from room data
  const getRoomImages = () => {
    const images = [];
    // Support both snake_case and camelCase from backend transforms
    if (room?.room_image) images.push({ url: room.room_image, alt: 'Room' });
    if (room?.roomImage) images.push({ url: room.roomImage, alt: 'Room' });
    if (room?.toilet_image) images.push({ url: room.toilet_image, alt: 'Toilet' });
    if (room?.toiletImage) images.push({ url: room.toiletImage, alt: 'Toilet' });
    // Fallback: collect any URL-looking string fields that include 'image'
    Object.entries(room || {}).forEach(([key, value]) => {
      if (typeof value === 'string' && /(image|img|photo)/i.test(key) && /^https?:\/\//i.test(value)) {
        // Avoid duplicates
        if (!images.find((img) => img.url === value)) {
          images.push({ url: value, alt: key });
        }
      }
      // Handle arrays of image URLs
      if (Array.isArray(value) && /(images|gallery|photos)/i.test(key)) {
        value.filter((v) => typeof v === 'string' && /^https?:\/\//i.test(v)).forEach((v) => {
          if (!images.find((img) => img.url === v)) {
            images.push({ url: v, alt: key });
          }
        });
      }
    });
    return images;
  };

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
      checkBookingStatus();
      fetchTenantDetails();
    }
  }, [roomId]);

  useEffect(() => {
    if (property && roomId) {
      checkFavoriteStatus();
    }
  }, [property, roomId]);

  // Check Aadhar status when component loads
  useEffect(() => {
    checkAadharStatus();
  }, []);

  // Start/stop polling based on booking status
  useEffect(() => {
    if (bookingStatus?.hasBooking && bookingStatus?.status === 'pending_approval' && justPaid) {
      // Only start polling if user just paid and status is pending
      startStatusPolling();
    } else {
      // Stop polling for other statuses
      stopStatusPolling();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      stopStatusPolling();
    };
  }, [bookingStatus?.hasBooking, bookingStatus?.status, justPaid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room details...</p>
          <p className="text-sm text-gray-500 mt-2">Room ID: {roomId}</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room Not Found</h2>
          <p className="text-gray-600 mb-6">The room you're looking for doesn't exist or is no longer available.</p>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <p>Room ID: {roomId}</p>
            <p>Please check if the property service is running on port 3003</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/seeker/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/debug/rooms')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              View Available Rooms
            </button>
          </div>
        </div>
      </div>
    );
  }

  const roomImages = getRoomImages();

  return (
    <SeekerLayout hideFooter={true}>
    <div className="min-h-screen bg-gray-50">
      {/* Page Top Controls - Back button outside cards (matches SeekerPropertyDetails) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <button onClick={handleBack} className="inline-flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title block */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {room.roomNumber ? `Room ${room.roomNumber}` : 'Room Details'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {property?.property_name && `${property.property_name} • `}
                    {property?.address?.city}, {property?.address?.state}
                  </p>
                </div>
              </div>
            </div>
            {/* Room Images */}
            {roomImages.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Images</h2>
                  <div className="relative">
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <img
                        src={roomImages[currentImageIndex].url}
                        alt={roomImages[currentImageIndex].alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {roomImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev + 1) % roomImages.length)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {roomImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Room Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Room Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(room).map(([key, value]) => {
                  if (!shouldDisplayField(key, value)) return null;
                  
                  // Handle amenities object
                  if (key === 'amenities' && typeof value === 'object' && value !== null) {
                    const amenityKeys = Object.entries(value)
                      .filter(([_, val]) => val === true)
                      .map(([k, _]) => k);
                    
                    if (amenityKeys.length === 0) return null;
                    
                    return (
                      <div key={key} className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">{formatFieldName(key)}</h3>
                        <div className="flex flex-wrap gap-2">
                          {amenityKeys.map((amenity) => (
                            <span
                              key={amenity}
                              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                              {formatFieldName(amenity)}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  // Handle availability status
                  if (key === 'isAvailable') {
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {value ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    );
                  }
                  
                  // Handle rent with currency formatting
                  if (key === 'rent') {
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">{formatFieldName(key)}:</span>
                        <span className="text-lg font-semibold text-gray-900">₹{value.toLocaleString()}</span>
                      </div>
                    );
                  }
                  
                  // Default field display
                  return (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">{formatFieldName(key)}</span>
                      <span className="text-sm text-gray-900 mt-1">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Property Information */}
            {property && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Property Name</span>
                    <p className="text-sm text-gray-900 mt-1">{property.property_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.pincode}
                    </p>
                  </div>
                  {property.description && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-500">Description</span>
                      <p className="text-sm text-gray-900 mt-1">{property.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Google Map */}
            {property?.latitude && property?.longitude && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                  <div 
                    ref={mapRef}
                    className="h-64 w-full rounded-lg overflow-hidden"
                    style={{ minHeight: '256px' }}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Coordinates: {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            )}

            {/* Tenant Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Tenants</h2>
              {loadingTenants ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading tenant details...</span>
                </div>
              ) : tenants.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    {tenants.length} {tenants.length === 1 ? 'person' : 'people'} currently living in this room
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tenants.map((tenant, index) => (
                      <div key={tenant._id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {tenant.name ? tenant.name.charAt(0).toUpperCase() : 'T'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {tenant.name || 'Anonymous Tenant'}
                              </h3>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Verified
                              </span>
                            </div>
                            <div className="mt-1 space-y-1">
                              <p className="text-xs text-gray-500">
                                Age: {tenant.age || 'Not specified'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Occupation: {tenant.occupation || 'Not specified'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Living since: {tenant.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString() : 'Not specified'}
                              </p>
                            </div>
                            {tenant.bio && (
                              <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                "{tenant.bio}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">No tenants yet</h3>
                  <p className="text-sm text-gray-500">
                    This room is available and waiting for tenants.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Information */}
            {owner && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
                <div className="space-y-3">
                  {Object.entries(owner).map(([key, value]) => {
                    if (!shouldDisplayField(key, value)) return null;
                    return (
                      <div key={key}>
                        <span className="text-sm text-gray-600">{formatFieldName(key)}</span>
                        <p className="font-medium text-gray-900">{String(value)}</p>
                      </div>
                    );
                  })}
                  {getVerificationBadge() && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        Verified Owner
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Behavioral Match */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Match</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Compatibility</span>
                  <span className="text-lg font-bold text-blue-900">{getBehavioralMatch()}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getBehavioralMatch()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  Based on your preferences and lifestyle
                </p>
              </div>
            </div>

            {/* Booking Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Room</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monthly Rent</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{room.rent ? room.rent.toLocaleString() : 'Ask Price'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Security Deposit</span>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{property?.security_deposit?.toLocaleString() || 'Not specified'}
                  </span>
                </div>
                
                {/* Favorite Button */}
                <div className="mt-4">
                  <button
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isFavorited
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {favoriteLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                        {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                      </>
                    )}
                  </button>
                </div>
                
                {/* Booking Status Display */}
                {checkingBookingStatus ? (
                  <div className="w-full py-3 px-4 rounded-lg bg-gray-100 text-gray-600 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Checking booking status...
                    </div>
                  </div>
                ) : bookingStatus?.hasBooking ? (
                  <div className="w-full py-3 px-4 rounded-lg text-center">
                    {bookingStatus.status === 'pending_approval' && (
                      <div className="bg-yellow-100 text-yellow-800 rounded-lg p-3">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-medium">Approval Pending</span>
                          {statusPolling && justPaid && (
                            <span className="text-xs bg-yellow-200 px-2 py-1 rounded-full animate-pulse">
                              Checking...
                            </span>
                          )}
                        </div>
                        <p className="text-sm">Your booking is waiting for owner approval</p>
                      </div>
                    )}
                    {bookingStatus.status === 'confirmed' && (
                      <div className="bg-green-100 text-green-800 rounded-lg p-3">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Booking Confirmed</span>
                        </div>
                        <p className="text-sm">Your booking has been approved</p>
                      </div>
                    )}
                    {bookingStatus.status === 'payment_pending' && (
                      <div className="bg-orange-100 text-orange-800 rounded-lg p-3">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-medium">Payment Pending</span>
                        </div>
                        <p className="text-sm">Complete your payment to proceed</p>
                      </div>
                    )}
                    {bookingStatus.status === 'rejected' && (
                      <div className="bg-red-100 text-red-800 rounded-lg p-3">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Booking Rejected</span>
                        </div>
                        <p className="text-sm">Your booking was not approved</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Aadhar Status Warning */}
                    {aadharStatus && !aadharStatus.isApproved && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Identity Verification Required</p>
                            <p className="text-xs text-yellow-700">{aadharStatus.message || 'Please verify your identity before booking'}</p>
                            <button 
                              onClick={() => navigate('/seeker-kyc')}
                              className="text-xs text-yellow-600 hover:text-yellow-800 underline mt-1"
                            >
                              Verify Now →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Aadhar Status Success */}
                    {aadharStatus && aadharStatus.isApproved && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-green-800">Identity Verified</p>
                            <p className="text-xs text-green-700">Your Aadhar verification is approved</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={handleBookRoom}
                      disabled={!room.isAvailable || bookingLoading || checkingAadharStatus || (aadharStatus && !aadharStatus.isApproved)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        room.isAvailable && !bookingLoading && !checkingAadharStatus && (!aadharStatus || aadharStatus.isApproved)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {bookingLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : checkingAadharStatus ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Checking Verification...
                        </div>
                      ) : aadharStatus && aadharStatus.isApproved ? (
                        'Book This Room'
                      ) : (
                        'Verify Identity to Book'
                      )}
                    </button>
                  </>
                )}
                {!room.isAvailable && !bookingStatus?.hasBooking && (
                  <p className="text-sm text-red-600 text-center">This room is currently not available</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Contact Owner
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Add to Favorites
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Share Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SeekerLayout>
  );
};

export default RoomDetailsView;
