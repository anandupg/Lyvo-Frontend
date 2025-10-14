import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';

const OwnerBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    const cls =
      status === 'confirmed'
        ? 'bg-green-100 text-green-700'
        : status === 'cancelled'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-700';
    return <span className={`text-xs px-2 py-1 rounded-full ${cls}`}>{status}</span>;
  };

  return (
    <OwnerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
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
          <div className="bg-white rounded-lg border p-4">
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
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b._id}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/owner-bookings/${b._id}`, { state: { userId: b.userId, ownerId: b.ownerId, propertyId: b.propertyId, roomId: b.roomId } })}
                    >
                      <td className="py-3 px-3 whitespace-nowrap">{new Date(b.createdAt || b.bookedAt).toLocaleString()}</td>
                      <td className="py-3 px-3">{renderStatusPill(b.status)}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-900">{b.userSnapshot?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">User ID: {b.userId}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-gray-800">{b.userSnapshot?.email || '-'}</div>
                        <div className="text-gray-600 text-xs">{b.userSnapshot?.phone || '-'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-900">{b.propertySnapshot?.name || '-'}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[220px]">
                          {b.propertySnapshot?.address?.street || ''}{b.propertySnapshot?.address?.city ? `, ${b.propertySnapshot.address.city}` : ''}{b.propertySnapshot?.address?.state ? `, ${b.propertySnapshot.address.state}` : ''}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-gray-900">Room {b.roomSnapshot?.roomNumber || '-'}</div>
                        <div className="text-xs text-gray-500">{b.roomSnapshot?.roomType || ''}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{b.roomSnapshot?.rent ? `₹${Number(b.roomSnapshot.rent).toLocaleString()}` : '-'}</td>
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


