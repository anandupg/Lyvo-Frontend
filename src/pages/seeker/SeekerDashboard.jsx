import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SeekerLayout from '../../components/seeker/SeekerLayout';
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
  
  // Google Maps and Location Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [radius, setRadius] = useState(5); // in kilometers
  const [isSearching, setIsSearching] = useState(false);
  const [nearbyPGs, setNearbyPGs] = useState([]);
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
        
        // Add a default marker for Bangalore
        new window.google.maps.Marker({
          position: { lat: 12.9716, lng: 77.5946 },
          map: mapInstanceRef.current,
          title: 'Bangalore',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="2"/>
                <path d="M16 8l-4 8h8l-4-8z" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });
        console.log('Default marker added');
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

  const searchNearbyPGs = (lat, lng, radiusKm = radius) => {
    // Mock data for nearby PGs - in real app, this would be an API call
    const mockPGs = [
      {
        id: 1,
        name: 'Student PG Koramangala',
        address: 'Koramangala, Bangalore',
        lat: lat + 0.01,
        lng: lng + 0.01,
        price: '₹15,000',
        rating: 4.5,
        distance: '0.8 km',
        amenities: ['AC', 'Food', 'WiFi']
      },
      {
        id: 2,
        name: 'Professional PG Indiranagar',
        address: 'Indiranagar, Bangalore',
        lat: lat - 0.02,
        lng: lng + 0.015,
        price: '₹18,000',
        rating: 4.3,
        distance: '1.2 km',
        amenities: ['AC', 'Food', 'WiFi', 'Gym']
      },
      {
        id: 3,
        name: 'Co-living Space HSR',
        address: 'HSR Layout, Bangalore',
        lat: lat + 0.025,
        lng: lng - 0.01,
        price: '₹12,000',
        rating: 4.7,
        distance: '2.1 km',
        amenities: ['WiFi', 'Laundry', 'Gym']
      }
    ];

    // Filter PGs within radius using accurate geodesic calc when available
    const filteredPGs = mockPGs
      .map((pg) => {
        const dKm = getDistanceKm(lat, lng, pg.lat, pg.lng);
        return { ...pg, distance: `${dKm.toFixed(1)} km`, _distanceKm: dKm };
      })
      .filter(pg => pg._distanceKm <= radiusKm);

    setNearbyPGs(filteredPGs);
    addMarkersToMap(filteredPGs);
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

  // Add markers to map
  const addMarkersToMap = (pgs) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    pgs.forEach(pg => {
      const marker = new window.google.maps.Marker({
        position: { lat: pg.lat, lng: pg.lng },
        map: mapInstanceRef.current,
        title: pg.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="2"/>
              <path d="M16 8l-4 8h8l-4-8z" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${pg.name}</h3>
            <p class="text-sm text-gray-600">${pg.address}</p>
            <p class="text-sm font-medium text-red-600">${pg.price}</p>
            <p class="text-xs text-gray-500">${pg.distance} away</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Mock data
    setRecentSearches([
      { id: 1, location: 'Koramangala, Bangalore', date: '2 hours ago' },
      { id: 2, location: 'Indiranagar, Bangalore', date: '1 day ago' },
      { id: 3, location: 'HSR Layout, Bangalore', date: '3 days ago' }
    ]);

    setFavoritePGs([
      {
        id: 1,
        name: 'Student PG Koramangala',
        location: 'Koramangala, Bangalore',
        price: '₹15,000',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        amenities: ['AC', 'Food', 'WiFi', 'Laundry']
      },
      {
        id: 2,
        name: 'Professional PG Indiranagar',
        location: 'Indiranagar, Bangalore',
        price: '₹18,000',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        amenities: ['AC', 'Food', 'WiFi', 'Gym']
      }
    ]);

    setUpcomingBookings([
      {
        id: 1,
        pgName: 'Student PG Koramangala',
        checkIn: '2024-01-15',
        checkOut: '2024-02-15',
        status: 'confirmed',
        amount: '₹15,000'
      },
      {
        id: 2,
        pgName: 'Professional PG Indiranagar',
        checkIn: '2024-01-20',
        checkOut: '2024-02-20',
        status: 'pending',
        amount: '₹18,000'
      }
    ]);

    setRecommendations([
      {
        id: 1,
        name: 'New PG Near Tech Park',
        location: 'Electronic City, Bangalore',
        price: '₹12,000',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        distance: '2.5 km',
        matchScore: 95
      },
      {
        id: 2,
        name: 'Premium Co-living Space',
        location: 'Whitefield, Bangalore',
        price: '₹22,000',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        distance: '5.2 km',
        matchScore: 88
      }
    ]);
  }, []);

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
            Welcome back, {user.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to find your perfect PG? Here's what's happening with your account.
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
              className="w-full h-80 rounded-lg border border-gray-200"
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Link
            to="/seeker-search"
            className="group bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Search PGs</h3>
                <p className="text-blue-100 text-sm">Find your perfect accommodation</p>
              </div>
              <Search className="w-8 h-8 text-blue-200 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>

          <Link
            to="/seeker-favorites"
            className="group bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Favorites</h3>
                <p className="text-pink-100 text-sm">View your saved PGs</p>
              </div>
              <Heart className="w-8 h-8 text-pink-200 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>

          <Link
            to="/seeker-bookings"
            className="group bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">My Bookings</h3>
                <p className="text-green-100 text-sm">Manage your reservations</p>
              </div>
              <Calendar className="w-8 h-8 text-green-200 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>
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
                <Link
                  to="/seeker-search"
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
                <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
                <Link
                  to="/seeker-search"
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((pg, index) => (
                  <motion.div
                    key={pg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="group cursor-pointer"
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
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-gray-900">{pg.price}</span>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Favorites</span>
                  </div>
                  <span className="font-semibold text-gray-900">{favoritePGs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Bookings</span>
                  </div>
                  <span className="font-semibold text-gray-900">{upcomingBookings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-600">Searches</span>
                  </div>
                  <span className="font-semibold text-gray-900">{recentSearches.length}</span>
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
    </SeekerLayout>
  );
};

export default SeekerDashboard;
