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
  Save,
  FileText,
  Eye
} from 'lucide-react';

const AddProperty = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsKyc, setNeedsKyc] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    propertyName: '',
    propertyType: '',
    description: '',
    maximumOccupancy: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      latitude: '',
      longitude: ''
    },
    
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
    },
    
    // Documents
    documents: []
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
  const [previewDoc, setPreviewDoc] = useState(null);

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
        const requiresKyc = !user.kycVerified && !(user.govtIdFrontUrl && user.govtIdBackUrl);
        setNeedsKyc(requiresKyc);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Stay on this page; do not auto-redirect. Show prompt instead.

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

  // Document upload functions
  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocuments = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      type: file.type
    }));
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const previewDocument = (document) => {
    setPreviewDoc({
      url: document.preview,
      name: document.name,
      type: document.type.includes('pdf') ? 'pdf' : 'image'
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.propertyName.trim()) newErrors.propertyName = 'Property name is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.maximumOccupancy || parseInt(formData.maximumOccupancy) <= 0) newErrors.maximumOccupancy = 'Maximum occupancy is required';
    if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
    if (!formData.address.pincode.trim()) newErrors['address.pincode'] = 'Pincode is required';
    
    // Property details validation
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
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      // Prepare form data for API
      const formDataToSend = new FormData();
      
      // Add property data as JSON string
      formDataToSend.append('propertyData', JSON.stringify(formData));
      
      // Add required images
      console.log('Required images:', formData.requiredImages);
      Object.entries(formData.requiredImages).forEach(([type, imageData]) => {
        if (imageData && imageData.file) {
          console.log(`Adding required image: ${type}Image`, imageData.file.name);
          formDataToSend.append(`${type}Image`, imageData.file);
        }
      });
      
      // Add additional images
      console.log('Additional images:', formData.images);
      formData.images.forEach((imageData, index) => {
        if (imageData.file) {
          console.log(`Adding additional image: images`, imageData.file.name);
          formDataToSend.append('images', imageData.file);
        }
      });
      
      // Add documents
      console.log('Documents:', formData.documents);
      formData.documents.forEach((documentData, index) => {
        if (documentData.file) {
          console.log(`Adding document: documents`, documentData.file.name);
          formDataToSend.append('documents', documentData.file);
        }
      });
      
      console.log('FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Make API call to simple backend
      const response = await fetch(`${import.meta.env.VITE_ADD_PROPERTY_API_URL || 'http://localhost:3002'}/api/properties/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create property');
      }

      if (result.success) {
        // Success - refresh properties list and redirect
        if (window.refreshProperties) {
          window.refreshProperties();
        }
        navigate('/owner-properties');
      } else {
        throw new Error(result.message || 'Failed to create property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      alert(`Error: ${error.message}`);
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

  // If KYC not completed, show blocking prompt and allow navigating to dedicated page
  const showKycBlock = !loading && user && needsKyc;

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

        {/* Govt ID (KYC) Reminder */}
        {showKycBlock && (
          <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-xs sm:text-sm text-yellow-900">
              To add a property, please upload and verify your Government ID.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/owner-settings#kyc')}
                className="px-3 py-2 bg-red-600 text-white rounded-md text-xs sm:text-sm hover:bg-red-700"
              >
                Go to Upload Documents
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-6 sm:space-y-8 ${showKycBlock ? 'pointer-events-none opacity-50 select-none' : ''}`}>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Occupancy *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maximumOccupancy}
                  onChange={(e) => handleInputChange('maximumOccupancy', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.maximumOccupancy ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Number of people allowed"
                />
                {errors.maximumOccupancy && (
                  <p className="mt-1 text-sm text-red-600">{errors.maximumOccupancy}</p>
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

          {/* Property Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Property Documents</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">Upload property documents like lease agreements, property papers, etc.</p>
            
            <div className="space-y-6">
              {/* Document Upload Area */}
              <div className="relative">
                <label className="cursor-pointer block">
                  <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 group">
                    <div className="flex flex-col items-center justify-center pt-6 pb-6">
                      <div className="p-4 bg-red-50 rounded-full mb-4 group-hover:bg-red-100 transition-colors">
                        <FileText className="w-8 h-8 text-red-600" />
                      </div>
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        <span className="text-red-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF files only, up to 10MB each</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>

              {/* Document Preview */}
              {formData.documents.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">Uploaded Documents</h3>
                    <span className="text-xs text-gray-500">{formData.documents.length} file(s)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.documents.map((document, index) => (
                      <div key={index} className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className={`p-2 rounded-lg ${
                              document.type.includes('pdf') ? 'bg-red-100' : 
                              document.type.includes('image') ? 'bg-green-100' : 
                              'bg-blue-100'
                            }`}>
                              <FileText className={`w-5 h-5 ${
                                document.type.includes('pdf') ? 'text-red-600' : 
                                document.type.includes('image') ? 'text-green-600' : 
                                'text-blue-600'
                              }`} />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate" title={document.name}>
                              {document.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PDF Document</p>
                            <div className="flex items-center mt-2 space-x-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {document.type.split('/')[1]?.toUpperCase() || 'FILE'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => previewDocument(document)}
                              className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                              title="Preview document"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                              title="Remove document"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {formData.documents.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No documents uploaded yet</p>
                  <p className="text-xs text-gray-400 mt-1">Upload property documents to get started</p>
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
                      console.log('PDF preview loaded successfully');
                    }}
                    onError={(e) => {
                      console.error('PDF preview error:', e);
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
          </div>
        </div>
      )}
    </OwnerLayout>
  );
};

export default AddProperty;

