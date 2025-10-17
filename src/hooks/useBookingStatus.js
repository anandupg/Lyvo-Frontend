import { useState, useEffect } from 'react';

export const useBookingStatus = () => {
  const [hasConfirmedBooking, setHasConfirmedBooking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkBookingStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || user._id || user.userId;
      
      if (!userId) {
        console.log('No user ID found');
        setHasConfirmedBooking(false);
        setLoading(false);
        return;
      }

      // Fetch user bookings
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3003';
      const response = await fetch(`${baseUrl}/api/bookings/user?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const data = await response.json();
      const bookings = data.bookings || [];

      // Check if user has any confirmed bookings
      const confirmedBookings = bookings.filter(booking => 
        booking.status === 'confirmed' && 
        booking.payment?.paymentStatus === 'completed'
      );

      setHasConfirmedBooking(confirmedBookings.length > 0);
      
      console.log('Booking status check:', {
        totalBookings: bookings.length,
        confirmedBookings: confirmedBookings.length,
        hasConfirmedBooking: confirmedBookings.length > 0
      });

    } catch (err) {
      console.error('Error checking booking status:', err);
      setError(err.message);
      setHasConfirmedBooking(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBookingStatus();
  }, []);

  // Function to refresh booking status (useful after booking changes)
  const refreshBookingStatus = () => {
    checkBookingStatus();
  };

  return {
    hasConfirmedBooking,
    loading,
    error,
    refreshBookingStatus
  };
};
