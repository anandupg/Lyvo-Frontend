import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  MapPin,
  Users,
  DollarSign,
  Star,
  Calendar
} from 'lucide-react';

const Properties = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Mock data for properties
  const properties = [
    {
      id: 1,
      name: "Sunset Apartments",
      location: "Koramangala, Bangalore",
      type: "Apartment Complex",
      status: "Active",
      tenants: 12,
      maxTenants: 15,
      monthlyRent: 45000,
      rating: 4.6,
      lastUpdated: "2024-01-15",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "Green Valley Residences",
      location: "Indiranagar, Bangalore",
      type: "Independent Houses",
      status: "Active",
      tenants: 8,
      maxTenants: 8,
      monthlyRent: 38000,
      rating: 4.8,
      lastUpdated: "2024-01-10",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 3,
      name: "City Center Flats",
      location: "MG Road, Bangalore",
      type: "Studio Apartments",
      status: "Active",
      tenants: 4,
      maxTenants: 6,
      monthlyRent: 22000,
      rating: 4.4,
      lastUpdated: "2024-01-12",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 4,
      name: "Riverside Villas",
      location: "Whitefield, Bangalore",
      type: "Villas",
      status: "Under Construction",
      tenants: 0,
      maxTenants: 4,
      monthlyRent: 75000,
      rating: 0,
      lastUpdated: "2024-01-08",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 5,
      name: "Tech Park Residences",
      location: "Electronic City, Bangalore",
      type: "Serviced Apartments",
      status: "Maintenance",
      tenants: 6,
      maxTenants: 10,
      monthlyRent: 32000,
      rating: 4.2,
      lastUpdated: "2024-01-05",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Under Construction':
        return 'text-yellow-600 bg-yellow-100';
      case 'Maintenance':
        return 'text-orange-600 bg-orange-100';
      case 'Inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPropertyTypeColor = (type) => {
    switch (type) {
      case 'Apartment Complex':
        return 'text-blue-600 bg-blue-100';
      case 'Independent Houses':
        return 'text-green-600 bg-green-100';
      case 'Studio Apartments':
        return 'text-purple-600 bg-purple-100';
      case 'Villas':
        return 'text-red-600 bg-red-100';
      case 'Serviced Apartments':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Properties</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your property portfolio and listings</p>
          </div>
          <div className="sm:mt-0">
            <button
              onClick={() => navigate('/owner-add-property')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search properties by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Property Image */}
              <div className="relative h-40 sm:h-48 bg-gray-200">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{property.name}</h3>
                  <button className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-3 sm:mb-4">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPropertyTypeColor(property.type)}`}>
                    {property.type}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4 text-center">
                  <div>
                    <div className="text-sm sm:text-lg font-semibold text-gray-900">{property.tenants}/{property.maxTenants}</div>
                    <div className="text-xs text-gray-500">Tenants</div>
                  </div>
                  <div>
                    <div className="text-sm sm:text-lg font-semibold text-gray-900">₹{property.monthlyRent.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Monthly</div>
                  </div>
                  <div>
                    <div className="text-sm sm:text-lg font-semibold text-gray-900">{property.rating > 0 ? property.rating : 'N/A'}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/owner-property/${property.id}`)}
                    className="flex-1 flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/owner-edit-property/${property.id}`)}
                    className="flex-1 flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Edit
                  </button>
                </div>

                {/* Last Updated */}
                <div className="mt-2 sm:mt-3 text-xs text-gray-500 text-center">
                  Last updated: {new Date(property.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Building className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first property'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/owner-add-property')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </button>
            )}
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};

export default Properties; 