import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Building,
  Home,
  DollarSign,
  MoreVertical,
  LogIn,
  LogOut,
  Edit,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';

const Tenants = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [properties, setProperties] = useState([]);

  // Get user ID from localStorage
  const getUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData._id || userData.userId;
    }
    return null;
  };

  // Fetch tenants data with comprehensive error handling
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const userId = getUserId();
      
      if (!token || !userId) {
        console.warn('Missing auth token or user ID');
        navigate('/login');
        return;
      }

      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      console.log('Fetching tenants from:', `${baseUrl}/api/tenants/owner`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${baseUrl}/api/tenants/owner`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Tenants fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Tenants data:', data);
        
        if (data.success) {
          setTenants(data.tenants || []);
          
          // Extract unique properties for filter
          const uniqueProperties = [...new Set(data.tenants.map(tenant => ({
            id: tenant.propertyId,
            name: tenant.propertyName
          })))];
          setProperties(uniqueProperties);
          
          console.log(`Successfully fetched ${data.tenants?.length || 0} tenants`);
        } else {
          throw new Error(data.message || 'Failed to fetch tenants');
        }
      } else {
        const errorText = await response.text();
        console.error('Tenants fetch failed:', response.status, errorText);
        
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          navigate('/login');
        } else if (response.status === 404) {
          // No tenants found - this is not an error, just empty data
          setTenants([]);
          setProperties([]);
          console.log('No tenants found for this owner');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Failed to fetch tenants (${response.status})`);
        }
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
      
      let errorMessage = "Failed to fetch tenants. Please try again.";
      
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Set empty state on error to prevent UI issues
      setTenants([]);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Retry function for failed tenant fetch
  const retryFetchTenants = () => {
    console.log('Retrying tenant fetch...');
    fetchTenants();
  };

  // Filter tenants based on search and filters
  useEffect(() => {
    let filtered = tenants;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(tenant =>
        tenant.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.roomNumber?.toString().includes(searchQuery)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tenant => tenant.status === statusFilter);
    }

    // Property filter
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(tenant => tenant.propertyId === propertyFilter);
    }

    setFilteredTenants(filtered);
  }, [tenants, searchQuery, statusFilter, propertyFilter]);

  // Load data on component mount
  useEffect(() => {
    fetchTenants();
  }, []);

  // Handle tenant actions
  const handleCheckIn = async (tenantId) => {
    try {
      const token = localStorage.getItem('authToken');
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      
      const response = await fetch(`${baseUrl}/api/tenants/${tenantId}/check-in`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Tenant checked in successfully",
        });
        fetchTenants(); // Refresh data
      } else {
        throw new Error('Failed to check in tenant');
      }
    } catch (error) {
      console.error('Error checking in tenant:', error);
      toast({
        title: "Error",
        description: "Failed to check in tenant",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async (tenantId) => {
    try {
      const token = localStorage.getItem('authToken');
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      
      const response = await fetch(`${baseUrl}/api/tenants/${tenantId}/check-out`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Tenant checked out successfully",
        });
        fetchTenants(); // Refresh data
      } else {
        throw new Error('Failed to check out tenant');
      }
    } catch (error) {
      console.error('Error checking out tenant:', error);
      toast({
        title: "Error",
        description: "Failed to check out tenant",
        variant: "destructive",
      });
    }
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Terminated</Badge>;
      case 'extended':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Extended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tenants...</p>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
            <p className="text-gray-600 mt-1">Manage your property tenants</p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">{filteredTenants.length} tenants</span>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tenants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="extended">Extended</SelectItem>
                </SelectContent>
              </Select>

              {/* Property Filter */}
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Refresh Button */}
              <Button onClick={fetchTenants} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tenants List */}
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading tenants...</h3>
              <p className="text-gray-600">Please wait while we fetch your tenant data.</p>
            </CardContent>
          </Card>
        ) : filteredTenants.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
              <p className="text-gray-600 mb-4">
                {tenants.length === 0 
                  ? "You don't have any tenants yet. Tenants will appear here when bookings are approved."
                  : "No tenants match your current filters."
                }
              </p>
              {tenants.length === 0 && (
                <Button onClick={() => navigate('/owner-properties')} className="mt-2">
                  <Building className="w-4 h-4 mr-2" />
                  View Properties
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredTenants.map((tenant) => (
              <motion.div
                key={tenant._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      {/* Tenant Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {tenant.userName || 'Unknown User'}
                            </h3>
                            <p className="text-sm text-gray-600">{tenant.userEmail}</p>
                          </div>
                          {getStatusBadge(tenant.status)}
                        </div>

                        {/* Property & Room Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>{tenant.propertyName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Home className="w-4 h-4" />
                            <span>Room {tenant.roomNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Check-in: {formatDate(tenant.checkInDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span>Rent: {formatCurrency(tenant.monthlyRent)}/month</span>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center gap-4 text-sm">
                          {tenant.userPhone && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{tenant.userPhone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{tenant.userEmail}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {tenant.status === 'active' && !tenant.actualCheckInDate && (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(tenant._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <LogIn className="w-4 h-4 mr-1" />
                            Check In
                          </Button>
                        )}
                        
                        {tenant.status === 'active' && tenant.actualCheckInDate && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckOut(tenant._id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4 mr-1" />
                            Check Out
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Contact Tenant
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {tenant.actualCheckInDate && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Checked in: {formatDate(tenant.actualCheckInDate)}</span>
                          </div>
                          {tenant.actualCheckOutDate && (
                            <div className="flex items-center gap-1">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span>Checked out: {formatDate(tenant.actualCheckOutDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};

export default Tenants;
