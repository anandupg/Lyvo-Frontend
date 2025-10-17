import React from 'react';
import { useBookingStatus } from '../hooks/useBookingStatus';
import { dispatchBookingStatusChange } from '../utils/bookingEvents';

const BookingStatusTest = () => {
  const { hasConfirmedBooking, loading, error, refreshBookingStatus } = useBookingStatus();

  const simulateBookingApproval = () => {
    dispatchBookingStatusChange('approved', 'test-booking-123');
  };

  const simulateBookingCancellation = () => {
    dispatchBookingStatusChange('cancelled', 'test-booking-123');
  };

  if (loading) {
    return <div className="p-4 bg-blue-50 rounded-lg">Loading booking status...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 rounded-lg text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Booking Status Test</h3>
      
      <div className="space-y-2">
        <p><strong>Current Status:</strong> {hasConfirmedBooking ? 'Has Confirmed Booking' : 'No Confirmed Booking'}</p>
        <p><strong>Sidebar Behavior:</strong> {hasConfirmedBooking ? 'Minimal Navigation (Favorites, Messages, Profile)' : 'Full Navigation (Dashboard, Bookings, KYC, etc.)'}</p>
      </div>

      <div className="space-x-2">
        <button
          onClick={simulateBookingApproval}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Simulate Booking Approval
        </button>
        <button
          onClick={simulateBookingCancellation}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Simulate Booking Cancellation
        </button>
        <button
          onClick={refreshBookingStatus}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Status
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p>This component demonstrates how the sidebar navigation changes based on booking status.</p>
        <p>When a user has a confirmed booking, the sidebar will hide Dashboard, My Bookings, and Identity Verification.</p>
        <p>When the booking is cancelled, these items will reappear.</p>
      </div>
    </div>
  );
};

export default BookingStatusTest;
