import React, { useState } from 'react';
import { Home, Search, Filter, MoreVertical, Edit, Trash2, Eye, MapPin, DollarSign, Users, Star, Calendar } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { motion } from 'framer-motion';

const PropertiesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProperties, setSelectedProperties] = useState([]);

  // Mock property data
  const properties = [
    {
      id: 1,
      title: 'Modern 2BHK Apartment',
      location: 'Koramangala, Bangalore',
      price: 25000,
      type: 'apartment',
      status: 'active',
      owner: 'Jane Smith',
      rooms: 2,
      rating: 4.5,
      bookings: 12,
      listedDate: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
    },
    {
      id: 2,
      title: 'Cozy Studio in HSR Layout',
      location: 'HSR Layout, Bangalore',
      price: 18000,
      type: 'studio',
      status: 'active',
      owner: 'John Doe',
      rooms: 1,
      rating: 4.2,
      bookings: 8,
      listedDate: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
    },
    {
      id: 3,
      title: 'Luxury Villa with Pool',
      location: 'Whitefield, Bangalore',
      price: 45000,
      type: 'villa',
      status: 'pending',
      owner: 'Sarah Wilson',
      rooms: 4,
      rating: 4.8,
      bookings: 3,
      listedDate: '2024-01-08',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400'
    },
    {
      id: 4,
      title: 'Student PG Accommodation',
      location: 'Electronic City, Bangalore',
      price: 12000,
      type: 'pg',
      status: 'active',
      owner: 'Mike Johnson',
      rooms: 1,
      rating: 4.0,
      bookings: 15,
      listedDate: '2024-01-12',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
    },
    {
      id: 5,
      title: 'Premium 3BHK Flat',
      location: 'Indiranagar, Bangalore',
      price: 35000,
      type: 'apartment',
      status: 'inactive',
      owner: 'David Brown',
      rooms: 3,
      rating: 4.6,
      bookings: 6,
      listedDate: '2024-01-05',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Active', color: 'bg-green-100 text-green-800' },
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      inactive: { text: 'Inactive', color: 'bg-gray-100 text-gray-800' },
      suspended: { text: 'Suspended', color: 'bg-red-100 text-red-800' }
    };
    return badges[status] || badges.inactive;
  };

  const getTypeBadge = (type) => {
    const badges = {
      apartment: { text: 'Apartment', color: 'bg-blue-100 text-blue-800' },
      studio: { text: 'Studio', color: 'bg-purple-100 text-purple-800' },
      villa: { text: 'Villa', color: 'bg-orange-100 text-orange-800' },
      pg: { text: 'PG', color: 'bg-indigo-100 text-indigo-800' }
    };
    return badges[type] || badges.apartment;
  };

  const handleSelectProperty = (propertyId) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(property => property.id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
            <p className="text-gray-600 mt-1">Manage all property listings and verify new submissions</p>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Add New Property</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">320</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Home className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">285</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Star className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Calendar className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹8.2M</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search properties by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedProperties.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedProperties.length} selected</span>
                <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                  Approve Selected
                </button>
                <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                  Reject Selected
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Properties Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProperties.map((property, index) => {
            const statusBadge = getStatusBadge(property.status);
            const typeBadge = getTypeBadge(property.type);
            
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => handleSelectProperty(property.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                      {statusBadge.text}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeBadge.color}`}>
                      {typeBadge.text}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{property.rooms} rooms</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{property.rating}</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ₹{property.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Owner: {property.owner}</span>
                    <span>{property.bookings} bookings</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">{filteredProperties.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md">1</button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">2</button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">3</button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default PropertiesPage; 