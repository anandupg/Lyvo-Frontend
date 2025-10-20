import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';
import {
  Calendar,
  Search,
  RefreshCw,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';

const OwnerBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | confirmed | pending | rejected | cancelled
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      const token = localStorage.getItem('authToken');
      const resp = await fetch(`${baseUrl}/api/owner/bookings`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (e) {
      setError(e.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderStatusPill = (status) => {
    const base = 'text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 capitalize';
    if (status === 'confirmed') {
      return (
        <span className={`${base} bg-green-100 text-green-700`}>
          <CheckCircle className="w-3 h-3" /> {status}
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className={`${base} bg-red-100 text-red-700`}>
          <XCircle className="w-3 h-3" /> {status}
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className={`${base} bg-gray-100 text-gray-700`}>
          <XCircle className="w-3 h-3" /> {status}
        </span>
      );
    }
    return (
      <span className={`${base} bg-yellow-100 text-yellow-700`}>
        <Clock className="w-3 h-3" /> {status}
      </span>
    );
  };

  const filteredBookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings
      .filter((b) => (statusFilter === 'all' ? true : b.status === statusFilter))
      .filter((b) => {
        if (!q) return true;
        const seeker = `${b.userSnapshot?.name || ''} ${b.userSnapshot?.email || ''}`.toLowerCase();
        const property = `${b.propertySnapshot?.name || ''}`.toLowerCase();
        const room = `${b.roomSnapshot?.roomNumber || ''} ${b.roomSnapshot?.roomType || ''}`.toLowerCase();
        return seeker.includes(q) || property.includes(q) || room.includes(q);
      })
      .sort((a, b) => new Date(b.createdAt || b.bookedAt) - new Date(a.createdAt || a.bookedAt));
  }, [bookings, query, statusFilter]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const rejected = bookings.filter(b => b.status === 'rejected').length;
    return { total, confirmed, pending, cancelled, rejected };
  }, [bookings]);

  const refresh = async () => {
    setIsRefreshing(true);
    await fetchBookings();
    setIsRefreshing(false);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `₹${Number(amount).toLocaleString()}`;
  };

  return (
    <OwnerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600 text-sm">Manage and review all bookings</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 text-sm bg-white border px-3 py-2 rounded-md hover:bg-gray-50"
            >
              {isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Refresh
            </button>
            <button
              onClick={() => navigate('/owner-dashboard')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border rounded-lg p-4">
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-xs text-gray-500">Confirmed</div>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
              <CheckCircle className="w-5 h-5" /> {stats.confirmed}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-xs text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600 flex items-center gap-1">
              <Clock className="w-5 h-5" /> {stats.pending}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-xs text-gray-500">Cancelled</div>
            <div className="text-2xl font-bold text-gray-700 flex items-center gap-1">
              <XCircle className="w-5 h-5" /> {stats.cancelled}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-xs text-gray-500">Rejected</div>
            <div className="text-2xl font-bold text-red-600 flex items-center gap-1">
              <XCircle className="w-5 h-5" /> {stats.rejected}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-lg p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by seeker, property, or room"
                className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              {['all','confirmed','pending','rejected','cancelled'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-md text-sm border ${statusFilter===s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading bookings…</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-red-600 text-4xl mb-2">⚠️</div>
            <p className="text-gray-700">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">No bookings yet</h2>
            <p className="text-gray-600">New bookings will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-2 sm:p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-3 px-3">Booked At</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Seeker</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Property</th>
                    <th className="py-3 px-3">Room</th>
                    <th className="py-3 px-3">Rent</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr
                      key={b._id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="py-3 px-3 whitespace-nowrap">{new Date(b.createdAt || b.bookedAt).toLocaleString()}</td>
                      <td className="py-3 px-3">{renderStatusPill(b.status)}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-900">{b.userSnapshot?.name || 'Unknown'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-gray-800">{b.userSnapshot?.email || '-'}</div>
                        <div className="text-gray-600 text-xs">{b.userSnapshot?.phone || '-'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-900">{b.propertySnapshot?.name || b.property?.propertyName || '-'}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[220px]">
                          {b.propertySnapshot?.address?.street || ''}{b.propertySnapshot?.address?.city ? `, ${b.propertySnapshot.address.city}` : ''}{b.propertySnapshot?.address?.state ? `, ${b.propertySnapshot.address.state}` : ''}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-gray-900">Room {b.roomSnapshot?.roomNumber || '-'}</div>
                        <div className="text-xs text-gray-500">{b.roomSnapshot?.roomType || ''}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{formatCurrency(b.roomSnapshot?.rent)}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => navigate(`/owner-bookings/${b._id}`, { state: { userId: b.userId, ownerId: b.ownerId, propertyId: b.propertyId, roomId: b.roomId } })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};

export default OwnerBookings;


