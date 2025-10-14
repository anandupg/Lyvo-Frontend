import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
        const token = localStorage.getItem('authToken');
        let endpoint = token && bookingId ? `${baseUrl}/api/bookings/${bookingId}` : `${baseUrl}/api/public/bookings/${bookingId}`;
        let resp = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        let data;
        if (resp.ok) {
          data = await resp.json();
          setBooking(data.booking);
          setSource(data.source || 'booking');
        } else {
          // Second attempt: try public by id explicitly (even if token exists)
          if (bookingId) {
            const publicById = `${baseUrl}/api/public/bookings/${bookingId}`;
            const publicResp = await fetch(publicById, { headers: { 'Content-Type': 'application/json' } });
            if (publicResp.ok) {
              const publicData = await publicResp.json();
              setBooking(publicData.booking);
              setSource(publicData.source || 'booking');
              return;
            }
          }

          // Build lookup params from state or query
          const stateParams = location.state || {};
          const searchParams = new URLSearchParams(location.search);
          const userId = stateParams.userId || searchParams.get('userId');
          const ownerId = stateParams.ownerId || searchParams.get('ownerId');
          const propertyId = stateParams.propertyId || searchParams.get('propertyId');
          const roomId = stateParams.roomId || searchParams.get('roomId');

          if (userId && ownerId && propertyId && roomId) {
            const lookupUrl = `${baseUrl}/api/bookings/lookup?userId=${encodeURIComponent(userId)}&ownerId=${encodeURIComponent(ownerId)}&propertyId=${encodeURIComponent(propertyId)}&roomId=${encodeURIComponent(roomId)}`;
            const lookupResp = await fetch(lookupUrl);
            if (!lookupResp.ok) {
              const text = await lookupResp.text();
              throw new Error(text || `HTTP ${lookupResp.status}`);
            }
            const lookupData = await lookupResp.json();
            setBooking(lookupData.booking);
            setSource(lookupData.source || 'composed');
          } else {
            const text = await resp.text();
            throw new Error(text || `HTTP ${resp.status}`);
          }
        }
      } catch (e) {
        setError(e.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    // allow fetching via composite if no bookingId provided
    load();
  }, [bookingId, location.search, location.state]);

  const Section = ({ title, children }) => (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );

  const Row = ({ label, value }) => (
    <div className="flex items-start justify-between py-2 border-b last:border-b-0">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-gray-900 font-medium max-w-[60%] text-right break-words">{value}</div>
    </div>
  );

  const updateStatus = async (action) => {
    try {
      if (!booking?._id) return;
      setUpdating(true);
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      const token = localStorage.getItem('authToken');
      const resp = await fetch(`${baseUrl}/api/bookings/${booking._id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ action })
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setBooking(data.booking);
    } catch (e) {
      setError(e.message || 'Failed to update booking');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          <button onClick={() => navigate('/owner-bookings')} className="text-sm text-blue-600 hover:text-blue-800">← Back to Bookings</button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading booking…</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border p-10 text-center">
            <div className="text-red-600 text-5xl mb-3">⚠️</div>
            <p className="text-gray-700">{error}</p>
          </div>
        ) : booking ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Section title="Overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Row label="Booking ID" value={booking._id} />
                  <Row label="Status" value={booking.status} />
                  <Row label="Booked At" value={new Date(booking.createdAt || booking.bookedAt).toLocaleString()} />
                  <Row label="User ID" value={booking.userId} />
                  <Row label="Owner ID" value={booking.ownerId} />
                  <Row label="Data Source" value={source} />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    disabled={updating}
                    onClick={() => updateStatus('approve')}
                    className={`px-4 py-2 rounded-md text-white ${updating ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    Approve
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => updateStatus('reject')}
                    className={`px-4 py-2 rounded-md text-white ${updating ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    Reject
                  </button>
                </div>
              </Section>

              <Section title="Property">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Row label="Name" value={booking.propertySnapshot?.name || '-'} />
                  <Row label="Security Deposit" value={booking.propertySnapshot?.security_deposit != null ? `₹${Number(booking.propertySnapshot.security_deposit).toLocaleString()}` : '-'} />
                  <Row label="Latitude" value={booking.propertySnapshot?.latitude ?? '-'} />
                  <Row label="Longitude" value={booking.propertySnapshot?.longitude ?? '-'} />
                  <Row label="Address" value={`${booking.propertySnapshot?.address?.street || ''} ${booking.propertySnapshot?.address?.city || ''} ${booking.propertySnapshot?.address?.state || ''}`} />
                </div>
              </Section>

              <Section title="Room">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Row label="Room Number" value={booking.roomSnapshot?.roomNumber ?? '-'} />
                  <Row label="Type" value={booking.roomSnapshot?.roomType || '-'} />
                  <Row label="Size" value={booking.roomSnapshot?.roomSize != null ? `${booking.roomSnapshot.roomSize} sq ft` : '-'} />
                  <Row label="Bed" value={booking.roomSnapshot?.bedType || '-'} />
                  <Row label="Occupancy" value={booking.roomSnapshot?.occupancy ?? '-'} />
                  <Row label="Rent" value={booking.roomSnapshot?.rent != null ? `₹${Number(booking.roomSnapshot.rent).toLocaleString()}` : '-'} />
                </div>
                {(booking.roomSnapshot?.images?.room || booking.roomSnapshot?.images?.toilet) && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {booking.roomSnapshot?.images?.room && (
                      <img src={booking.roomSnapshot.images.room} alt="Room" className="w-full h-44 object-cover rounded" />
                    )}
                    {booking.roomSnapshot?.images?.toilet && (
                      <img src={booking.roomSnapshot.images.toilet} alt="Toilet" className="w-full h-44 object-cover rounded" />
                    )}
                  </div>
                )}
              </Section>
            </div>

            <div className="space-y-6">
              <Section title="Seeker">
                <Row label="Name" value={booking.userSnapshot?.name || '-'} />
                <Row label="Email" value={booking.userSnapshot?.email || '-'} />
                <Row label="Phone" value={booking.userSnapshot?.phone || '-'} />
              </Section>

              <Section title="Owner">
                <Row label="Name" value={booking.ownerSnapshot?.name || '-'} />
                <Row label="Email" value={booking.ownerSnapshot?.email || '-'} />
                <Row label="Phone" value={booking.ownerSnapshot?.phone || '-'} />
              </Section>
            </div>
          </div>
        ) : null}
      </div>
    </OwnerLayout>
  );
};

export default BookingDetails;


