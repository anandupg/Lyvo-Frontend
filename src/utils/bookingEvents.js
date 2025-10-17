// Utility functions for booking status change events
// These can be used throughout the app to notify components of booking status changes

export const dispatchBookingStatusChange = (status, bookingId = null) => {
  console.log(`Dispatching booking status change: ${status}`, bookingId ? `for booking ${bookingId}` : '');
  
  // Dispatch general booking status change event
  window.dispatchEvent(new CustomEvent('booking-status-changed', {
    detail: { status, bookingId }
  }));

  // Dispatch specific status events
  switch (status) {
    case 'confirmed':
    case 'approved':
      window.dispatchEvent(new CustomEvent('booking-approved', {
        detail: { bookingId }
      }));
      break;
    case 'cancelled':
    case 'rejected':
      window.dispatchEvent(new CustomEvent('booking-cancelled', {
        detail: { bookingId }
      }));
      break;
    default:
      // For other statuses, just dispatch the general event
      break;
  }
};

// Helper function to dispatch when a booking is approved by owner
export const dispatchBookingApproved = (bookingId) => {
  dispatchBookingStatusChange('approved', bookingId);
};

// Helper function to dispatch when a booking is cancelled by owner
export const dispatchBookingCancelled = (bookingId) => {
  dispatchBookingStatusChange('cancelled', bookingId);
};

// Helper function to dispatch when booking status changes in general
export const dispatchBookingStatusUpdate = (status, bookingId) => {
  dispatchBookingStatusChange(status, bookingId);
};
