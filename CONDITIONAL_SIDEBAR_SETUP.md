# Conditional Sidebar Setup

This document explains how the seeker sidebar dynamically changes based on booking status.

## Overview

The seeker sidebar now conditionally shows/hides navigation items based on whether the user has a confirmed booking:

- **No Confirmed Booking**: Shows full navigation (Dashboard, Favorites, My Bookings, Identity Verification, Messages, Profile)
- **Has Confirmed Booking**: Shows minimal navigation (Favorites, Messages, Profile only)

## Implementation Details

### 1. Custom Hook: `useBookingStatus`

**File**: `src/hooks/useBookingStatus.js`

This hook manages the booking status state and provides:
- `hasConfirmedBooking`: Boolean indicating if user has confirmed bookings
- `loading`: Loading state for API calls
- `error`: Error state if API calls fail
- `refreshBookingStatus()`: Function to manually refresh booking status

**Booking Status Logic**:
- Fetches user bookings from `/api/bookings/user?userId=${userId}`
- Checks for bookings with `status === 'confirmed'` AND `payment.paymentStatus === 'completed'`
- Updates `hasConfirmedBooking` based on results

### 2. Updated Sidebar Component

**File**: `src/components/seeker/SeekerSidebar.jsx`

**Changes Made**:
- Imported `useBookingStatus` hook
- Split navigation into `baseNavigation` and `conditionalNavigation`
- Dynamic navigation array based on `hasConfirmedBooking`
- Added booking status indicator in user profile section
- Added event listeners for booking status changes

**Navigation Structure**:
```javascript
// Always shown
const baseNavigation = [
  { name: 'Favorites', href: '/seeker-favorites', icon: Heart },
  { name: 'Messages', href: '/seeker-messages', icon: MessageCircle },
  { name: 'Profile', href: '/seeker-profile', icon: User },
];

// Only shown when NO confirmed booking
const conditionalNavigation = [
  { name: 'Dashboard', href: '/seeker-dashboard', icon: Home },
  { name: 'My Bookings', href: '/seeker-bookings', icon: Calendar },
  { name: 'Identity Verification', href: '/seeker-kyc', icon: Shield },
];
```

### 3. Event System

**File**: `src/utils/bookingEvents.js`

Provides utility functions to dispatch booking status change events:
- `dispatchBookingStatusChange(status, bookingId)`
- `dispatchBookingApproved(bookingId)`
- `dispatchBookingCancelled(bookingId)`
- `dispatchBookingStatusUpdate(status, bookingId)`

**Event Listeners**:
- `booking-status-changed`: General booking status change
- `booking-approved`: Specific to booking approval
- `booking-cancelled`: Specific to booking cancellation

### 4. Visual Indicators

**User Profile Section**:
- Green dot + "Confirmed Tenant" when user has confirmed booking
- Yellow dot + "Looking for Room" when user has no confirmed booking
- Loading state while checking booking status

## Usage Examples

### Triggering Sidebar Updates

```javascript
import { dispatchBookingApproved, dispatchBookingCancelled } from '../utils/bookingEvents';

// When owner approves a booking
const handleBookingApproval = (bookingId) => {
  // Update booking in database
  await updateBookingStatus(bookingId, 'approved');
  
  // Notify sidebar to update
  dispatchBookingApproved(bookingId);
};

// When owner cancels a booking
const handleBookingCancellation = (bookingId) => {
  // Update booking in database
  await updateBookingStatus(bookingId, 'cancelled');
  
  // Notify sidebar to update
  dispatchBookingCancelled(bookingId);
};
```

### Manual Status Refresh

```javascript
import { useBookingStatus } from '../hooks/useBookingStatus';

const MyComponent = () => {
  const { refreshBookingStatus } = useBookingStatus();
  
  const handleRefresh = () => {
    refreshBookingStatus();
  };
  
  return <button onClick={handleRefresh}>Refresh Booking Status</button>;
};
```

## Testing

**Test Component**: `src/components/BookingStatusTest.jsx`

This component provides:
- Current booking status display
- Simulation buttons for booking approval/cancellation
- Manual refresh functionality
- Explanation of sidebar behavior

## Integration Points

### Where to Add Event Dispatches

1. **Owner Dashboard - Booking Approval**:
   ```javascript
   // In owner booking management
   dispatchBookingApproved(bookingId);
   ```

2. **Owner Dashboard - Booking Cancellation**:
   ```javascript
   // In owner booking management
   dispatchBookingCancelled(bookingId);
   ```

3. **Payment Completion**:
   ```javascript
   // After successful payment
   dispatchBookingStatusChange('confirmed', bookingId);
   ```

4. **Booking Status Updates**:
   ```javascript
   // Any booking status change
   dispatchBookingStatusUpdate(newStatus, bookingId);
   ```

## API Requirements

The system expects the booking API to return data in this format:

```javascript
{
  "bookings": [
    {
      "status": "confirmed",
      "payment": {
        "paymentStatus": "completed"
      },
      // ... other booking fields
    }
  ]
}
```

## Benefits

1. **Cleaner UI**: Confirmed tenants see only relevant navigation
2. **Better UX**: Reduces confusion for users with confirmed bookings
3. **Real-time Updates**: Sidebar updates automatically when booking status changes
4. **Maintainable**: Centralized booking status logic in custom hook
5. **Flexible**: Easy to add/remove conditional navigation items

## Future Enhancements

1. **Role-based Navigation**: Different navigation for different user types
2. **Feature Flags**: Toggle navigation items based on feature availability
3. **Analytics**: Track navigation usage patterns
4. **Customization**: Allow users to customize their navigation
