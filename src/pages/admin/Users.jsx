import React, { useState } from 'react';
import { Users, Search, Filter, MoreVertical, Edit, Trash2, Eye, Mail, Phone, Calendar, Shield, UserCheck, UserX } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { motion } from 'framer-motion';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Mock user data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 98765 43210',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20',
      verified: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 98765 43211',
      role: 'room_owner',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19',
      verified: true
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+91 98765 43212',
      role: 'user',
      status: 'inactive',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-15',
      verified: false
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+91 98765 43213',
      role: 'room_owner',
      status: 'active',
      joinDate: '2024-01-12',
      lastLogin: '2024-01-20',
      verified: true
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+91 98765 43214',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-08',
      lastLogin: '2024-01-18',
      verified: true
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const badges = {
      user: { text: 'User', color: 'bg-blue-100 text-blue-800' },
      room_owner: { text: 'Room Owner', color: 'bg-orange-100 text-orange-800' },
      admin: { text: 'Admin', color: 'bg-red-100 text-red-800' }
    };
    return badges[role] || badges.user;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Active', color: 'bg-green-100 text-green-800' },
      inactive: { text: 'Inactive', color: 'bg-gray-100 text-gray-800' },
      suspended: { text: 'Suspended', color: 'bg-red-100 text-red-800' }
    };
    return badges[status] || badges.inactive;
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Mobile User Card Component
  const UserCard = ({ user, index }) => {
    const roleBadge = getRoleBadge(user.role);
    const statusBadge = getStatusBadge(user.status);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
      >
        {/* Header with checkbox and avatar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.id)}
              onChange={() => handleSelectUser(user.id)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-orange-400 to-red-700 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{user.phone}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleBadge.color}`}>
            {roleBadge.text}
          </span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span>Last: {new Date(user.lastLogin).toLocaleDateString()}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">Manage all users, room owners, and administrators</p>
          </div>
          <button className="bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm lg:text-base">
            <Users className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">1,245</p>
              </div>
              <div className="p-2 lg:p-3 rounded-lg bg-blue-50">
                <Users className="w-4 lg:w-6 h-4 lg:h-6 text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Room Owners</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">320</p>
              </div>
              <div className="p-2 lg:p-3 rounded-lg bg-orange-50">
                <Shield className="w-4 lg:w-6 h-4 lg:h-6 text-orange-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">1,180</p>
              </div>
              <div className="p-2 lg:p-3 rounded-lg bg-green-50">
                <UserCheck className="w-4 lg:w-6 h-4 lg:h-6 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">65</p>
              </div>
              <div className="p-2 lg:p-3 rounded-lg bg-gray-50">
                <UserX className="w-4 lg:w-6 h-4 lg:h-6 text-gray-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm lg:text-base"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm lg:text-base"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="room_owner">Room Owners</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs lg:text-sm text-gray-600">{selectedUsers.length} selected</span>
                <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm">
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Users Content - Mobile Cards / Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Mobile View - Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredUsers.map((user, index) => (
              <UserCard key={user.id} user={user} index={index} />
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => {
                  const roleBadge = getRoleBadge(user.role);
                  const statusBadge = getStatusBadge(user.status);
                  
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-orange-400 to-red-700 flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <Phone className="w-3 h-3" />
                              <span className="truncate">{user.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleBadge.color}`}>
                          {roleBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 lg:px-6 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="text-xs lg:text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
              </div>
              <div className="flex items-center space-x-1 lg:space-x-2">
                <button className="px-2 lg:px-3 py-1 text-xs lg:text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-2 lg:px-3 py-1 text-xs lg:text-sm bg-red-600 text-white rounded-md">1</button>
                <button className="px-2 lg:px-3 py-1 text-xs lg:text-sm border border-gray-300 rounded-md hover:bg-gray-50">2</button>
                <button className="px-2 lg:px-3 py-1 text-xs lg:text-sm border border-gray-300 rounded-md hover:bg-gray-50">3</button>
                <button className="px-2 lg:px-3 py-1 text-xs lg:text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage; 