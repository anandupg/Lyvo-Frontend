import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Users, 
  Home, 
  Car, 
  Wifi, 
  Snowflake,
  Utensils,
  Dumbbell,
  Shield,
  Camera,
  X,
  Plus,
  ArrowLeft,
  Save
} from 'lucide-react';

const AddProperty = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Basic Information
    propertyName: '',
    propertyType: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      latitude: '',
      longitude: ''
    },
    
    // Property Details
    totalUnits: '',
    availableUnits: '',
    floorNumber: '',
    totalFloors: '',
    builtUpArea: '',
    carpetArea: '',
    yearBuilt: '',
    
    // Pricing
    monthlyRent: '',
    securityDeposit: '',
    maintenanceCharges: '',
    utilityCharges: '',
    
    // Amenities
    amenities: {
      parking: false,
      wifi: false,
      ac: false,
      kitchen: false,
      gym: false,
      security: false,
      waterSupply: false,
      powerBackup: false,
      garden: false,
      swimmingPool: false
    },
    
    // Rules and Policies
    rules: {
      petsAllowed: false,
      smokingAllowed: false,
      visitorsAllowed: true,
      cookingAllowed: true
    },
    
    // Images
    images: [],
    requiredImages: {
      front: null,
      back: null,
      hall: null,
      room: null,
      toilet: null
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Maps Places state (from env key)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const modalMapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [placeSearch, setPlaceSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const listRef = useRef(null);
  const selectingRef = useRef(false);

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

  // Load Google Maps JS API (Places) using env key
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCoPzRJLAmma54BBOyF4AhZ2ZIqGvak8CA';
    if (!key) return;
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      placesServiceRef.current = new window.google.maps.places.PlacesService(document.createElement('div'));
      setIsGoogleLoaded(true);
      return;
    }
    const existing = document.querySelector('script[data-google-places="true"]');
    if (existing) {
      existing.addEventListener('load', () => {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        placesServiceRef.current = new window.google.maps.places.PlacesService(document.createElement('div'));
        setIsGoogleLoaded(true);
      });
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googlePlaces = 'true';
    script.onload = () => {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      placesServiceRef.current = new window.google.maps.places.PlacesService(document.createElement('div'));
      setIsGoogleLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Initialize map when modal opens
  useEffect(() => {
    if (!isMapOpen || !isGoogleLoaded) return;
    // Clear previous map instance
    mapRef.current = null;
    markerRef.current = null;
    if (!modalMapDivRef.current) return;
    const center = {
      lat: formData.address.latitude ? parseFloat(formData.address.latitude) : 12.9716,
      lng: formData.address.longitude ? parseFloat(formData.address.longitude) : 77.5946,
    };
    mapRef.current = new window.google.maps.Map(modalMapDivRef.current, {
      center,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeId: isSatellite ? 'hybrid' : 'roadmap',
    });
    markerRef.current = new window.google.maps.Marker({ map: mapRef.current, position: center, draggable: true });
    markerRef.current.addListener('dragend', () => {
      const pos = markerRef.current.getPosition();
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          latitude: String(pos.lat()),
          longitude: String(pos.lng()),
        }
      }));
    });
    mapRef.current.addListener('click', (e) => {
      const pos = e.latLng;
      markerRef.current.setPosition(pos);
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          latitude: String(pos.lat()),
          longitude: String(pos.lng()),
        }
      }));
    });
  }, [isMapOpen, isGoogleLoaded, isSatellite]);

  const toggleSatellite = () => {
    const next = !isSatellite;
    setIsSatellite(next);
    if (mapRef.current) {
      mapRef.current.setMapTypeId(next ? 'hybrid' : 'roadmap');
    }
  };

  const copyCoords = () => {
    const lat = formData.address.latitude;
    const lng = formData.address.longitude;
    if (!lat || !lng) {
      alert('Set a location first (drag marker or select a place).');
      return;
    }
    const text = `${lat}, ${lng}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Coordinates copied to clipboard');
      }).catch(() => {
        window.prompt('Copy coordinates:', text);
      });
    } else {
      window.prompt('Copy coordinates:', text);
    }
  };

  // Fetch place suggestions (debounced)
  useEffect(() => {
    if (!placeSearch || placeSearch.trim().length < 2 || !isGoogleLoaded || !autocompleteServiceRef.current) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      return;
    }
    if (selectingRef.current) {
      // Ignore suggestion fetch right after a selection
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        autocompleteServiceRef.current.getPlacePredictions({ input: placeSearch }, (predictions, status) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
            setSuggestions([]);
            setShowSuggestions(false);
            setActiveSuggestionIndex(-1);
            return;
          }
          setSuggestions(predictions);
          setShowSuggestions(true);
          setActiveSuggestionIndex(-1);
        });
      } catch (err) {
        console.error('Places autocomplete error:', err);
      }
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [placeSearch, isGoogleLoaded]);

  // Keep active item visible when navigating via keyboard
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${activeSuggestionIndex}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeSuggestionIndex]);

  const selectPlace = (prediction) => {
    if (!prediction || !placesServiceRef.current) return;
    selectingRef.current = true;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setShowSuggestions(false);
    setSuggestions([]);
    placesServiceRef.current.getDetails({ placeId: prediction.place_id, fields: ['geometry', 'address_components', 'formatted_address', 'name'] }, (place, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place) {
        setPlaceSearch(prediction.description || '');
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        selectingRef.current = false;
        return;
      }
      const comps = place.address_components || [];
      const byType = (t) => comps.find(c => c.types?.includes(t))?.long_name || '';
      const street = [byType('route'), byType('sublocality'), byType('neighborhood')].filter(Boolean).join(', ');
      const city = byType('locality') || byType('administrative_area_level_2');
      const state = byType('administrative_area_level_1');
      const pincode = byType('postal_code');
      const landmark = place.name || '';
      const lat = place.geometry?.location?.lat?.();
      const lng = place.geometry?.location?.lng?.();
      // Move map and marker
      if (mapRef.current && markerRef.current && lat !== undefined && lng !== undefined) {
        const pos = { lat, lng };
        mapRef.current.setCenter(pos);
        mapRef.current.setZoom(15);
        markerRef.current.setPosition(pos);
      }
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          street: street || prev.address.street,
          city: city || prev.address.city,
          state: state || prev.address.state,
          pincode: pincode || prev.address.pincode,
          landmark: landmark || prev.address.landmark,
          latitude: lat !== undefined ? String(lat) : prev.address.latitude,
          longitude: lng !== undefined ? String(lng) : prev.address.longitude,
        }
      }));
      setPlaceSearch(place.name || prediction.structured_formatting?.main_text || prediction.description || place.formatted_address || '');
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      // allow suggestion fetching after the value settles
      setTimeout(() => { selectingRef.current = false; }, 0);
    });
  };

  const onKeyDownPlace = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestionIndex((p) => (p + 1) % suggestions.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestionIndex((p) => (p - 1 + suggestions.length) % suggestions.length); }
    else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0) { e.preventDefault(); selectPlace(suggestions[activeSuggestionIndex]); }
    } else if (e.key === 'Escape') { setShowSuggestions(false); setActiveSuggestionIndex(-1); }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  const handleRuleChange = (rule) => {
    setFormData(prev => ({
      ...prev,
      rules: {
        ...prev.rules,
        [rule]: !prev.rules[rule]
      }
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleRequiredImageUpload = (type, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const entry = {
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    };
    setFormData(prev => ({
      ...prev,
      requiredImages: { ...prev.requiredImages, [type]: entry }
    }));
    // Clear field error for this slot
    if (errors[`requiredImages.${type}`]) {
      setErrors(prev => ({ ...prev, [`requiredImages.${type}`]: '' }));
    }
  };

  const removeRequiredImage = (type) => {
    setFormData(prev => ({
      ...prev,
      requiredImages: { ...prev.requiredImages, [type]: null }
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.propertyName.trim()) newErrors.propertyName = 'Property name is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
    if (!formData.address.pincode.trim()) newErrors['address.pincode'] = 'Pincode is required';
    
    // Property details validation
    if (!formData.totalUnits) newErrors.totalUnits = 'Total units is required';
    if (!formData.availableUnits) newErrors.availableUnits = 'Available units is required';
    if (!formData.monthlyRent) newErrors.monthlyRent = 'Monthly rent is required';
    if (!formData.securityDeposit) newErrors.securityDeposit = 'Security deposit is required';

    // Required image slots
    const slots = ['front','back','hall','room','toilet'];
    slots.forEach((s) => {
      if (!formData.requiredImages[s]) {
        newErrors[`requiredImages.${s}`] = 'Required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to properties page
      navigate('/owner-properties');
    } catch (error) {
      console.error('Error adding property:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="max-w-4xl mx-auto p-3 sm:p-0 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => navigate('/owner-dashboard')}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl sm:text-2xl font-bold text-gray-900">Add New Property</h1>
              <p className="text-xs sm:text-sm text-gray-600">Fill in the details to list your property</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Building className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name *
                </label>
                <input
                  type="text"
                  value={formData.propertyName}
                  onChange={(e) => handleInputChange('propertyName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.propertyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter property name"
                />
                {errors.propertyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <Select value={formData.propertyType} onValueChange={(val) => handleInputChange('propertyType', val)}>
                  <SelectTrigger className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.propertyType ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Independent House">Independent House</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="PG/Hostel">PG/Hostel</SelectItem>
                    <SelectItem value="Commercial Space">Commercial Space</SelectItem>
                  </SelectContent>
                </Select>
                {errors.propertyType && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your property, its features, and what makes it special..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Address Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Address Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Google Maps place search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search PG/Property via Google Maps
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={placeSearch}
                    onChange={(e) => setPlaceSearch(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onKeyDown={onKeyDownPlace}
                    placeholder="Start typing address, area, landmark..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {showSuggestions && (
                    <div ref={listRef} className="absolute z-40 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-auto">
                      {suggestions.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">No results</div>
                      )}
                      {suggestions.map((s, idx) => (
                        <button
                          key={`${s.place_id}-${idx}`}
                          type="button"
                          data-idx={idx}
                          onMouseEnter={() => setActiveSuggestionIndex(idx)}
                          onMouseLeave={() => setActiveSuggestionIndex(-1)}
                          onClick={() => selectPlace(s)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${idx===activeSuggestionIndex ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                        >
                          <div className="text-gray-700 leading-snug line-clamp-2">{s.structured_formatting?.main_text || s.description || ''}</div>
                          {s.structured_formatting?.secondary_text && (
                            <div className="text-xs text-gray-500 mt-0.5">{s.structured_formatting.secondary_text}</div>
                          )}
                        </button>
                      ))}
                      <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-500">Powered by Google Places</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Launch */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pin PG Location</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setIsMapOpen(true)} className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Open Map</button>
                  <div className="text-xs text-gray-600">Lat: {formData.address.latitude || '—'} | Lng: {formData.address.longitude || '—'}</div>
                  <button type="button" onClick={copyCoords} className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-xs">Copy Coords</button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors['address.street'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter street address"
                />
                {errors['address.street'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors['address.city'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter city"
                />
                {errors['address.city'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors['address.state'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter state"
                />
                {errors['address.state'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.address.pincode}
                  onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors['address.pincode'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter pincode"
                />
                {errors['address.pincode'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.pincode']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  value={formData.address.landmark}
                  onChange={(e) => handleInputChange('address.landmark', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Near landmark (optional)"
                />
              </div>
            </div>
          </motion.div>

          {/* Property Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Property Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Units *
                </label>
                <input
                  type="number"
                  value={formData.totalUnits}
                  onChange={(e) => handleInputChange('totalUnits', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.totalUnits ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Number of units"
                  min="1"
                />
                {errors.totalUnits && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalUnits}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Units *
                </label>
                <input
                  type="number"
                  value={formData.availableUnits}
                  onChange={(e) => handleInputChange('availableUnits', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.availableUnits ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Available units"
                  min="0"
                />
                {errors.availableUnits && (
                  <p className="mt-1 text-sm text-red-600">{errors.availableUnits}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Number
                </label>
                <input
                  type="number"
                  value={formData.floorNumber}
                  onChange={(e) => handleInputChange('floorNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Floor number"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Floors
                </label>
                <input
                  type="number"
                  value={formData.totalFloors}
                  onChange={(e) => handleInputChange('totalFloors', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Total floors"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Built-up Area (sq ft)
                </label>
                <input
                  type="number"
                  value={formData.builtUpArea}
                  onChange={(e) => handleInputChange('builtUpArea', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Built-up area"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carpet Area (sq ft)
                </label>
                <input
                  type="number"
                  value={formData.carpetArea}
                  onChange={(e) => handleInputChange('carpetArea', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Carpet area"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Year built"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </motion.div>

          {/* Pricing Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Pricing Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.monthlyRent ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Monthly rent amount"
                  min="0"
                />
                {errors.monthlyRent && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyRent}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit (₹) *
                </label>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.securityDeposit ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Security deposit amount"
                  min="0"
                />
                {errors.securityDeposit && (
                  <p className="mt-1 text-sm text-red-600">{errors.securityDeposit}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Charges (₹)
                </label>
                <input
                  type="number"
                  value={formData.maintenanceCharges}
                  onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Monthly maintenance"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Utility Charges (₹)
                </label>
                <input
                  type="number"
                  value={formData.utilityCharges}
                  onChange={(e) => handleInputChange('utilityCharges', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Monthly utilities"
                  min="0"
                />
              </div>
            </div>
          </motion.div>

          {/* Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Amenities</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(formData.amenities).map(([amenity, checked]) => (
                <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleAmenityChange(amenity)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {amenity.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Rules and Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Rules and Policies</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(formData.rules).map(([rule, allowed]) => (
                <label key={rule} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowed}
                    onChange={() => handleRuleChange(rule)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {rule.replace(/([A-Z])/g, ' $1').trim()} Allowed
                  </span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Property Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Property Images</h2>
            </div>

            {/* Required slots */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {[
                { key: 'front', label: 'Front' },
                { key: 'back', label: 'Back' },
                { key: 'hall', label: 'Hall' },
                { key: 'room', label: 'Room' },
                { key: 'toilet', label: 'Toilet' }
              ].map(({ key, label }) => (
                <div key={key} className="">
                  <div className="text-xs font-medium text-gray-700 mb-2">{label} *</div>
                  {!formData.requiredImages[key] ? (
                    <label className={`flex items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer ${errors[`requiredImages.${key}`] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'} hover:bg-gray-100`}>
                      <div className="text-xs text-gray-500 text-center px-2">Upload {label}</div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleRequiredImageUpload(key, e)} />
                    </label>
                  ) : (
                    <div className="relative group">
                      <img src={formData.requiredImages[key].preview} alt={formData.requiredImages[key].name} className="w-full h-28 object-cover rounded-lg border" />
                      <button type="button" onClick={() => removeRequiredImage(key)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {errors[`requiredImages.${key}`] && (
                    <div className="mt-1 text-[11px] text-red-600">{errors[`requiredImages.${key}`]}</div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Plus className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="mt-1 text-xs text-gray-500 truncate">{image.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <button
              type="button"
              onClick={() => navigate('/owner-dashboard')}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding Property...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Add Property</span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>

      {/* Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="text-sm font-semibold text-gray-900">Select Location</div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={toggleSatellite} className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-xs">
                  {isSatellite ? 'Satellite' : 'Map'} view
                </button>
                <button type="button" onClick={() => setIsMapOpen(false)} className="px-2 py-1 text-gray-500 hover:text-gray-700 text-sm">Close</button>
              </div>
            </div>
            <div ref={modalMapDivRef} style={{ width: '100%', height: '420px' }} />
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 flex items-center justify-between">
              <div>
                Lat: {formData.address.latitude || '—'} | Lng: {formData.address.longitude || '—'}
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsMapOpen(false)} className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs">Use This Location</button>
                <button type="button" onClick={copyCoords} className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Copy Coords</button>
                <span className="text-gray-500 hidden sm:inline">Drag marker or click map to set exact point</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
};

export default AddProperty;

