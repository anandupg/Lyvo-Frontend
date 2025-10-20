import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import Chatbot from '../../components/Chatbot';
import { 
  Search, 
  Heart, 
  Calendar, 
  MapPin, 
  Star, 
  Users, 
  Building,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Navigation,
  Map,
  SlidersHorizontal
} from 'lucide-react';

const SeekerDashboard = () => {
  const [user, setUser] = useState({});
  const [recentSearches, setRecentSearches] = useState([]);
  const [favoritePGs, setFavoritePGs] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  
  // Google Maps and Location Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [radius, setRadius] = useState(5); // in kilometers
  const [isSearching, setIsSearching] = useState(false);
  const [nearbyPGs, setNearbyPGs] = useState([]);
  const navigate = useNavigate();
  const [locationError, setLocationError] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);

  // Load Google Maps API (singleton) and initialize when container is visible
  useEffect(() => {
    let observer;

    const ensureGoogleMaps = () => {
      if (window.google && window.google.maps) return Promise.resolve();

      if (window.__googleMapsPromise) return window.__googleMapsPromise;

      window.__googleMapsPromise = new Promise((resolve, reject) => {
        const existing = document.getElementById('google-maps-script');
        if (existing) {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', (e) => reject(e));
          return;
        }

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCoPzRJLAmma54BBOyF4AhZ2ZIqGvak8CA&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
      });

      return window.__googleMapsPromise;
    };

    const initWhenVisible = async () => {
      try {
        await ensureGoogleMaps();
        if (!mapRef.current) return;
        // Wait until the container is actually visible to avoid zero-size init
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              initializeMap();
              // Trigger a resize in case container dimensions changed
              if (mapInstanceRef.current && window.google && window.google.maps) {
                window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
              }
              observer.disconnect();
            }
          });
        }, { threshold: 0.1 });
        observer.observe(mapRef.current);
      } catch (e) {
        console.error('Failed to ensure Google Maps:', e);
      }
    };

    initWhenVisible();

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  // Reinitialize autocomplete when search input ref changes
  useEffect(() => {
    if (window.google && window.google.maps && searchInputRef.current && !autocompleteRef.current) {
      initializeMap();
    }
  }, [searchInputRef.current]);

  // Fallback initialization after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.google && window.google.maps && mapRef.current && !mapInstanceRef.current) {
        console.log('Fallback map initialization...');
        initializeMap();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize Google Maps
  const initializeMap = () => {
    console.log('Initializing map...');
    console.log('Google Maps available:', !!window.google);
    console.log('Map ref available:', !!mapRef.current);
    
    if (window.google && window.google.maps) {
      // Initialize Places Autocomplete first
      if (searchInputRef.current && !autocompleteRef.current) {
        console.log('Initializing autocomplete...');
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          searchInputRef.current,
          {
            types: ['establishment', 'geocode'],
            componentRestrictions: { country: 'in' },
            fields: ['place_id', 'geometry', 'name', 'formatted_address']
          }
        );

        autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
        console.log('Autocomplete initialized');
      }

      // Initialize map if container exists
      if (mapRef.current && !mapInstanceRef.current) {
        console.log('Creating map instance...');
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });
        
        console.log('Map created successfully');
        
        // Load all properties on map initialization
        loadAllPropertiesOnMap();
        console.log('Map initialized, loading properties...');
        // If we already have a selected location, draw/update the radius circle
        if (selectedLocation) {
          const center = new window.google.maps.LatLng(selectedLocation.lat, selectedLocation.lng);
          updateRadiusCircle(center);
        }
      } else {
        console.log('Map container not ready or already initialized');
      }
    } else {
      console.log('Google Maps not available');
    }
  };

  // Create or update the radius circle on the map
  const updateRadiusCircle = (centerLatLng) => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) return;

    const options = {
      map: mapInstanceRef.current,
      center: centerLatLng,
      radius: (radius || 0) * 1000, // km -> meters
      strokeColor: '#ef4444',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#ef4444',
      fillOpacity: 0.12,
      clickable: false,
    };

    if (circleRef.current) {
      circleRef.current.setOptions(options);
    } else {
      circleRef.current = new window.google.maps.Circle(options);
    }
  };

  // Handle place selection from autocomplete
  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      setSelectedLocation({
        name: place.name || place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address
      });
      setSearchQuery(place.name || place.formatted_address);
      setSearchResults([]);
      
      // Update map center
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(place.geometry.location);
        mapInstanceRef.current.setZoom(15);
        updateRadiusCircle(place.geometry.location);
      }
      
      // Search for nearby PGs
      searchNearbyPGs(place.geometry.location.lat(), place.geometry.location.lng(), radius);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsSearching(true);
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setCurrentLocation({ 
            lat: latitude, 
            lng: longitude,
            accuracy: accuracy,
            timestamp: new Date().toLocaleString()
          });
          
          // Get location name using reverse geocoding
          if (window.google && window.google.maps) {
            setIsGeocoding(true);
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results, status) => {
                setIsGeocoding(false);
                let locationName = 'Current Location';
                let address = 'Your current location';
                
                if (status === 'OK' && results[0]) {
                  const result = results[0];
                  address = result.formatted_address;
                  
                  // Try to get a shorter, more readable name
                  if (result.address_components) {
                    const components = result.address_components;
                    
                    // Look for different types of location names
                    const locality = components.find(comp => comp.types.includes('locality'));
                    const sublocality = components.find(comp => comp.types.includes('sublocality'));
                    const neighborhood = components.find(comp => comp.types.includes('neighborhood'));
                    const administrative_area_level_1 = components.find(comp => comp.types.includes('administrative_area_level_1'));
                    const administrative_area_level_2 = components.find(comp => comp.types.includes('administrative_area_level_2'));
                    
                    // Build location name with priority: locality > sublocality > neighborhood
                    if (locality && administrative_area_level_1) {
                      locationName = `${locality.long_name}, ${administrative_area_level_1.long_name}`;
                    } else if (sublocality && administrative_area_level_1) {
                      locationName = `${sublocality.long_name}, ${administrative_area_level_1.long_name}`;
                    } else if (neighborhood && administrative_area_level_1) {
                      locationName = `${neighborhood.long_name}, ${administrative_area_level_1.long_name}`;
                    } else if (administrative_area_level_2 && administrative_area_level_1) {
                      locationName = `${administrative_area_level_2.long_name}, ${administrative_area_level_1.long_name}`;
                    } else {
                      // Fallback to formatted address
                      locationName = result.formatted_address;
                    }
                  } else {
                    // Fallback to formatted address
                    locationName = result.formatted_address;
                  }
                }
                
                setSelectedLocation({
                  name: locationName,
                  lat: latitude,
                  lng: longitude,
                  address: address
                });
                
                // Update search query to show the actual place name
                setSearchQuery(locationName);
              }
            );
          } else {
            // Fallback if geocoding fails
            setIsGeocoding(false);
            setSelectedLocation({
              name: 'Current Location',
              lat: latitude,
              lng: longitude,
              address: 'Your current location'
            });
            setSearchQuery('Current Location');
          }
          
          // Update map center
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
            mapInstanceRef.current.setZoom(15);
            const center = new window.google.maps.LatLng(latitude, longitude);
            updateRadiusCircle(center);
          }
          
          // Search for nearby PGs
          searchNearbyPGs(latitude, longitude, radius);
          setIsSearching(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsSearching(false);
          let errorMessage = 'Unable to get your current location. ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location access denied by user.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Unknown error occurred.';
              break;
          }
          setLocationError(errorMessage);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  // Search for nearby PGs
  const getDistanceKm = (lat1, lng1, lat2, lng2) => {
    if (window.google && window.google.maps && window.google.maps.geometry && window.google.maps.geometry.spherical) {
      const a = new window.google.maps.LatLng(lat1, lng1);
      const b = new window.google.maps.LatLng(lat2, lng2);
      return window.google.maps.geometry.spherical.computeDistanceBetween(a, b) / 1000; // meters -> km
    }
    return calculateDistance(lat1, lng1, lat2, lng2);
  };

  const searchNearbyPGs = async (lat, lng, radiusKm = radius) => {
    try {
      // Fetch real properties from the database
      const response = await fetch(`${import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002'}/api/public/properties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      const properties = data.properties || [];

      // Transform properties to match the expected format and filter by radius
      const nearbyProperties = properties
        .filter(property => property.latitude && property.longitude) // Only include properties with coordinates
        .map((property) => {
          const dKm = getDistanceKm(lat, lng, property.latitude, property.longitude);
          return {
            id: property._id,
            name: property.propertyName || 'Unnamed Property',
            address: property.address || 'Address not available',
            lat: property.latitude,
            lng: property.longitude,
            price: property.rent ? `₹${property.rent.toLocaleString()}` : 'Price not available',
            rating: 4.5, // Default rating since we don't have ratings yet
            distance: `${dKm.toFixed(1)} km`,
            _distanceKm: dKm,
            amenities: property.amenities ? Object.entries(property.amenities).filter(([key, value]) => value === true).map(([key]) => key) : [],
            propertyType: property.propertyType || 'PG',
            maxOccupancy: property.maxOccupancy || 1,
            images: property.images || [],
            ownerName: property.ownerName || 'Unknown Owner',
          };
        })
        .filter(pg => pg._distanceKm <= radiusKm)
        .sort((a, b) => a._distanceKm - b._distanceKm); // Sort by distance

      setNearbyPGs(nearbyProperties);
      addMarkersToMap(nearbyProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setNearbyPGs([]);
      addMarkersToMap([]);
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Load all properties on map initialization
  const loadAllPropertiesOnMap = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002'}/api/public/properties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      const properties = data.properties || [];

      // Transform properties to match the expected format
      const allProperties = properties
        .filter(property => property.latitude && property.longitude) // Only include properties with coordinates
        .map((property) => {
          return {
            id: property._id,
            name: property.propertyName || 'Unnamed Property',
            address: property.address || 'Address not available',
            lat: property.latitude,
            lng: property.longitude,
            price: property.rent ? `₹${property.rent.toLocaleString()}` : 'Price not available',
            rating: 4.5, // Default rating since we don't have ratings yet
            distance: '0 km', // Will be calculated when user searches
            _distanceKm: 0,
            amenities: property.amenities ? Object.entries(property.amenities).filter(([key, value]) => value === true).map(([key]) => key) : [],
            propertyType: property.propertyType || 'PG',
            maxOccupancy: property.maxOccupancy || 1,
            images: property.images || [],
            ownerName: property.ownerName || 'Unknown Owner'
          };
        });

      console.log(`Loaded ${allProperties.length} properties on map`);
      addMarkersToMap(allProperties);
    } catch (error) {
      console.error('Error loading properties on map:', error);
    }
  };

  // Add markers to map
  const addMarkersToMap = (pgs) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    pgs.forEach(pg => {
      // Create different colored markers based on property type
      const getMarkerColor = (propertyType) => {
        switch (propertyType?.toLowerCase()) {
          case 'pg': return '#ef4444'; // Red
          case 'co-living': return '#3b82f6'; // Blue
          case 'apartment': return '#10b981'; // Green
          case 'house': return '#f59e0b'; // Yellow
          default: return '#ef4444'; // Default red
        }
      };

      const markerColor = getMarkerColor(pg.propertyType);
      
      const marker = new window.google.maps.Marker({
        position: { lat: pg.lat, lng: pg.lng },
        map: mapInstanceRef.current,
        title: `${pg.name} - ${pg.price}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="16" fill="${markerColor}" stroke="white" stroke-width="3"/>
              <path d="M20 8l-6 12h12l-6-12z" fill="white"/>
              <text x="20" y="32" text-anchor="middle" fill="white" font-size="8" font-weight="bold">${pg.propertyType?.charAt(0)?.toUpperCase() || 'P'}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-4 max-w-sm">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-semibold text-gray-900 text-sm">${pg.name}</h3>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">${pg.propertyType || 'PG'}</span>
            </div>
            <p class="text-xs text-gray-600 mb-2">${pg.address}</p>
            <p class="text-[10px] text-gray-500 mb-1">Lat: ${pg.lat?.toFixed(6) || ''}, Lng: ${pg.lng?.toFixed(6) || ''}</p>
            <div class="flex items-center justify-between mb-2">
              <p class="text-lg font-bold text-red-600">${pg.price}</p>
              ${pg.distance !== '0 km' ? `<p class="text-xs text-gray-500">${pg.distance} away</p>` : ''}
            </div>
            <div class="space-y-1 text-xs text-gray-600">
              ${pg.maxOccupancy ? `<p><span class="font-medium">Max Occupancy:</span> ${pg.maxOccupancy} people</p>` : ''}
              ${pg.ownerName ? `<p><span class="font-medium">Owner:</span> ${pg.ownerName}</p>` : ''}
              ${pg.amenities && Object.keys(pg.amenities).length > 0 ? `
                <div class="mt-2">
                  <p class="font-medium mb-1">Amenities:</p>
                  <div class="flex flex-wrap gap-1">
                    ${Object.entries(pg.amenities)
                      .filter(([key, value]) => value === true)
                      .slice(0, 3)
                      .map(([key]) => `<span class="px-1 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">${key}</span>`)
                      .join('')}
                    ${Object.keys(pg.amenities).filter(key => pg.amenities[key] === true).length > 3 ? 
                      `<span class="px-1 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">+${Object.keys(pg.amenities).filter(key => pg.amenities[key] === true).length - 3} more</span>` : ''}
                  </div>
                </div>
              ` : ''}
            </div>
            ${pg.images && pg.images.length > 0 ? `
              <div class="mt-3">
                <img src="${pg.images[0]}" alt="${pg.name}" class="w-full h-20 object-cover rounded border" />
              </div>
            ` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  };

  // Open property modal and fetch full details
  const openPropertyDetails = (propertyId) => {
    navigate(`/seeker/property/${propertyId}`);
  };

  // Handle search input
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    
    // Initialize autocomplete if not already done
    if (window.google && window.google.maps && !autocompleteRef.current && searchInputRef.current) {
      initializeMap();
    }
    
    if (e.target.value.length > 2) {
      // In real app, this would trigger API search
      setSearchResults([]);
    } else {
      setSearchResults([]);
    }
  };

  // Handle radius change
  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
    if (selectedLocation) {
      searchNearbyPGs(selectedLocation.lat, selectedLocation.lng, newRadius);
      if (circleRef.current) {
        circleRef.current.setRadius(newRadius * 1000);
      } else if (window.google && window.google.maps) {
        const center = new window.google.maps.LatLng(selectedLocation.lat, selectedLocation.lng);
        updateRadiusCircle(center);
      }
    } else if (currentLocation) {
      searchNearbyPGs(currentLocation.lat, currentLocation.lng, newRadius);
      if (circleRef.current) {
        circleRef.current.setRadius(newRadius * 1000);
      } else if (window.google && window.google.maps) {
        const center = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng);
        updateRadiusCircle(center);
      }
    }
  };

  // Keep circle in sync when selected location changes
  useEffect(() => {
    if (selectedLocation && window.google && window.google.maps && mapInstanceRef.current) {
      const center = new window.google.maps.LatLng(selectedLocation.lat, selectedLocation.lng);
      updateRadiusCircle(center);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  // Check if user has confirmed booking and redirect to PostBookingDashboard
  const checkAndRedirectToBookingDashboard = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id || userData._id || userData.userId;
      
      if (!userId) return;

      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${baseUrl}/api/bookings/user?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const bookings = data.bookings || [];
        
        // Find the most recent confirmed booking
        const confirmedBookings = bookings.filter(booking => 
          booking.status === 'confirmed' && 
          booking.payment?.paymentStatus === 'completed'
        );
        
        if (confirmedBookings.length > 0) {
          // Get the most recent confirmed booking
          const latestBooking = confirmedBookings.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          )[0];
          
          console.log('User has confirmed booking, redirecting to BasicRoomDashboard:', latestBooking._id);
          navigate(`/my-room`);
          return true; // Indicates redirect happened
        }
      }
    } catch (error) {
      console.error('Error checking booking status for redirect:', error);
    }
    return false; // No redirect happened
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Check if this is the user's first login
    const checkFirstLogin = () => {
      const userId = userData._id || userData.id;
      const lastLoginKey = `lastLogin_${userId}`;
      const lastLogin = localStorage.getItem(lastLoginKey);
      
      if (!lastLogin) {
        // First time logging in
        setIsFirstLogin(true);
        // Set current timestamp as last login
        localStorage.setItem(lastLoginKey, new Date().toISOString());
      } else {
        // Not first login
        setIsFirstLogin(false);
        // Update last login timestamp
        localStorage.setItem(lastLoginKey, new Date().toISOString());
      }
    };

    checkFirstLogin();

    // Check if user has confirmed booking and redirect
    checkAndRedirectToBookingDashboard().then((redirected) => {
      if (!redirected) {
        // Only fetch data if no redirect happened
        // Clear mock sections until real endpoints exist
        setRecentSearches([]);

        // Fetch real data
        fetchPropertyRecommendations();
        fetchFavoritesCount();
        fetchBookingsCount();
      }
    });

    // Listen for booking status changes
    const handleBookingStatusChange = (event) => {
      console.log('Booking status change detected:', event.detail);
      if (event.detail.status === 'confirmed' || event.detail.status === 'approved') {
        // Redirect to PostBookingDashboard when booking is confirmed
        setTimeout(() => {
          checkAndRedirectToBookingDashboard();
        }, 1000); // Small delay to ensure booking is saved
      }
    };

    // Add event listeners
    window.addEventListener('booking-approved', handleBookingStatusChange);
    window.addEventListener('booking-status-changed', handleBookingStatusChange);

    // Cleanup
    return () => {
      window.removeEventListener('booking-approved', handleBookingStatusChange);
      window.removeEventListener('booking-status-changed', handleBookingStatusChange);
    };
  }, []);

  // Fetch property recommendations from the database
  const fetchPropertyRecommendations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002'}/api/public/properties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      const properties = data.properties || [];
      
      console.log('=== RAW PROPERTIES DATA ===');
      console.log('Total properties from API:', properties.length);
      properties.forEach((property, index) => {
        console.log(`\nProperty ${index + 1}:`);
        console.log('  _id:', property._id);
        console.log('  propertyName:', property.propertyName);
        console.log('  address:', property.address);
        console.log('  rent:', property.rent);
        console.log('  propertyType:', property.propertyType);
        console.log('  maxOccupancy:', property.maxOccupancy);
        console.log('  amenities:', property.amenities);
        console.log('  images:', property.images);
        console.log('  description:', property.description);
        console.log('  latitude:', property.latitude);
        console.log('  longitude:', property.longitude);
      });
      console.log('=== END RAW PROPERTIES ===');

      // Transform properties to recommendations format (limit to 4 for display)
      const recommendations = properties
        .slice(0, 4)
        .map((property, index) => ({
          id: property._id,
          name: property.propertyName || 'Unnamed Property',
          location: property.address || 'Address not available',
          price: property.rent ? `₹${property.rent.toLocaleString()}` : 'Price not available',
          rating: 4.5, // Default rating
          image: property.images && property.images.length > 0 
            ? property.images[0] 
            : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
          distance: `${(index + 1) * 2}.${index + 1} km`, // Mock distance for now
          matchScore: 95 - (index * 5), // Decreasing match score
          propertyType: property.propertyType || 'PG',
          maxOccupancy: property.maxOccupancy || 1,
          amenities: property.amenities || []
        }));

      setRecommendations(recommendations);
      console.log('=== RECOMMENDATIONS DATA ===');
      console.log('Total recommendations:', recommendations.length);
      recommendations.forEach((rec, index) => {
        console.log(`\nRecommendation ${index + 1}:`);
        console.log('  ID:', rec.id);
        console.log('  Name:', rec.name);
        console.log('  Location:', rec.location);
        console.log('  Price:', rec.price);
        console.log('  Rating:', rec.rating);
        console.log('  Distance:', rec.distance);
        console.log('  Match Score:', rec.matchScore + '%');
        console.log('  Property Type:', rec.propertyType);
        console.log('  Max Occupancy:', rec.maxOccupancy);
        console.log('  Amenities:', rec.amenities);
        console.log('  Image URL:', rec.image);
      });
      console.log('=== END RECOMMENDATIONS ===');
    } catch (error) {
      console.error('Error fetching property recommendations:', error);
      
      setRecommendations([]);
    }
  };

  // Fetch favorites count
  const fetchFavoritesCount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.userId || user._id;
      console.log('Fetching favorites for userId:', userId);
      
      if (!userId) {
        console.log('No userId found in localStorage');
        return;
      }

      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      const url = `${baseUrl}/api/favorites/user?userId=${userId}`;
      console.log('Favorites API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Favorites API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Favorites data received:', data);
        setFavoritePGs(data.favorites || []);
        console.log('Favorites count:', (data.favorites || []).length);
      } else {
        const errorText = await response.text();
        console.error('Favorites API error:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error fetching favorites count:', error);
      setFavoritePGs([]);
    }
  };

  // Fetch bookings count
  const fetchBookingsCount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.userId || user._id;
      console.log('Fetching bookings for userId:', userId);
      
      if (!userId) {
        console.log('No userId found in localStorage');
        return;
      }

      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      const url = `${baseUrl}/api/bookings/user?userId=${userId}`;
      console.log('Bookings API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Bookings API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Bookings data received:', data);
        setUpcomingBookings(data.bookings || []);
        console.log('Bookings count:', (data.bookings || []).length);
      } else {
        const errorText = await response.text();
        console.error('Bookings API error:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error fetching bookings count:', error);
      setUpcomingBookings([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <SeekerLayout>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
      <div className="p-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isFirstLogin ? 'Welcome' : 'Welcome back'}, {user.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            {isFirstLogin 
              ? "Welcome to Lyvo+! Let's help you find your perfect co-living space." 
              : "Ready to find your perfect PG? Here's what's happening with your account."
            }
          </p>
        </motion.div>

      
        {/* Location Search Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Find PGs Near You
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for a location (e.g., Koramangala, Bangalore)"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoComplete="off"
                />
                {/* Debug info */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {window.google && window.google.maps ? (
                    <span className="text-xs text-green-600">✓ Maps Loaded</span>
                  ) : (
                    <span className="text-xs text-yellow-600">⏳ Loading...</span>
                  )}
                </div>
              </div>
              {/* Manual initialization button */}
              {window.google && window.google.maps && !autocompleteRef.current && (
                <button
                  onClick={() => initializeMap()}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Initialize Search (Click if dropdown not working)
                </button>
              )}
            </div>

          </div>

          {/* Radius Setting */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Search Radius:</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="20"
                value={radius}
                onChange={handleRadiusChange}
                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm font-medium text-gray-700 min-w-[3rem]">{radius} km</span>
            </div>
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">{selectedLocation.name}</p>
                  <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Getting Your Location...</h4>
                  <p className="text-sm text-gray-600">Please allow location access and wait a moment.</p>
                </div>
              </div>
            </div>
          )}

          {/* Geocoding State */}
          {isGeocoding && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Finding Your Location Name...</h4>
                  <p className="text-sm text-gray-600">Converting coordinates to place name.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {locationError && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Location Error</h4>
                  <p className="text-sm text-gray-600 mb-2">{locationError}</p>
                  <button
                    onClick={() => setLocationError(null)}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Map Container - Always Visible */}
          <div className="mt-4">
            <div 
              ref={mapRef}
              className="w-full h-80 rounded-lg border border-gray-200 relative"
              style={{ minHeight: '320px' }}
            />
            
            
            {/* Debug info and manual initialization */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div>
                {window.google && window.google.maps ? (
                  <span className="text-green-600">✓ Google Maps Loaded</span>
                ) : (
                  <span className="text-yellow-600">⏳ Loading Google Maps...</span>
                )}
                {mapInstanceRef.current ? (
                  <span className="ml-2 text-green-600">✓ Map Initialized</span>
                ) : (
                  <span className="ml-2 text-red-600">✗ Map Not Ready</span>
                )}
              </div>
              {window.google && window.google.maps && !mapInstanceRef.current && (
                <button
                  onClick={() => initializeMap()}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Initialize Map
                </button>
              )}
            </div>
          </div>

          {/* Nearby PGs Results */}
          {nearbyPGs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Found {nearbyPGs.length} PGs within {radius} km
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyPGs.map((pg, index) => (
                  <motion.div
                    key={pg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openPropertyDetails(pg.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{pg.name}</h4>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        {pg.distance}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{pg.address}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-600">{pg.price}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{pg.rating}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {pg.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Searches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Searches</h2>
              </div>
              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <motion.div
                    key={search.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{search.location}</p>
                        <p className="text-sm text-gray-500">{search.date}</p>
                      </div>
                    </div>
                    <Search className="w-4 h-4 text-gray-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Rooms</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((pg, index) => (
                  <motion.div
                    key={pg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="group cursor-pointer"
                    onClick={() => openPropertyDetails(pg.id)}
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={pg.image}
                        alt={pg.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {pg.matchScore}% Match
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {pg.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{pg.location}</span>
                        <span className="text-xs text-gray-400">• {pg.distance}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{pg.rating}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Favorites</span>
                  </div>
                  <span className="text-2xl font-bold text-pink-600">{favoritePGs.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Bookings</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{upcomingBookings.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Searches</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{recentSearches.length}</span>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Bookings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h3>
              <div className="space-y-3">
                {upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{booking.pgName}</h4>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Check-in: {booking.checkIn}</p>
                      <p>Check-out: {booking.checkOut}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-gray-900">{booking.amount}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)} flex items-center space-x-1`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/seeker-bookings"
                className="mt-4 w-full text-center text-red-600 hover:text-red-700 text-sm font-medium block"
              >
                View All Bookings
              </Link>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Save PGs to favorites for quick access</li>
                <li>• Use filters to find exact matches</li>
                <li>• Read reviews before booking</li>
                <li>• Contact owners for questions</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </SeekerLayout>
  );
};

export default SeekerDashboard;
