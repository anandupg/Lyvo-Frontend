import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Home,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  MessageCircle,
  Star,
  Building,
  Bed,
  Bath,
  Wifi,
  Car,
  Utensils,
  Zap,
  Shield,
  User,
  FileText,
  Navigation,
  CreditCard,
  Key,
  Bell,
  Camera,
  Printer,
  Share2,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Map as MapIcon,
  Monitor,
  ExternalLink,
  Copy,
  QrCode,
  Receipt,
  Wallet,
  TrendingUp,
  Award,
  Heart,
  Bookmark,
  Settings,
  HelpCircle,
  Info,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Edit3,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  LogIn
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const PostBookingDashboard = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { toast } = useToast();
  const [booking, setBooking] = useState(null);
  const [property, setProperty] = useState(null);
  const [room, setRoom] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    amenities: true,
    payment: true,
    contact: true,
    documents: false
  });
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!authToken) {
        navigate('/login');
        return;
      }

      // Fetch booking details
      const bookingResponse = await fetch(`${import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002'}/api/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const bookingData = await bookingResponse.json();
      setBooking(bookingData.booking);

      // Fetch property details
      if (bookingData.booking.propertyId) {
        const propertyResponse = await fetch(`${import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002'}/api/public/properties/${bookingData.booking.propertyId}`);
        if (propertyResponse.ok) {
          const propertyData = await propertyResponse.json();
          setProperty(propertyData.property);
          
          // Find the specific room
          if (propertyData.property.rooms) {
            const roomData = propertyData.property.rooms.find(r => r._id === bookingData.booking.roomId);
            setRoom(roomData);
          }
        }
      }

      // Fetch owner details (if available)
      if (bookingData.booking.ownerId) {
        const ownerResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4002/api'}/user/profile/${bookingData.booking.ownerId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        if (ownerResponse.ok) {
          const ownerData = await ownerResponse.json();
          setOwner(ownerData);
        }
      }

    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: <Wifi className="w-3 h-3" />,
      parking: <Car className="w-3 h-3" />,
      kitchen: <Utensils className="w-3 h-3" />,
      powerBackup: <Zap className="w-3 h-3" />,
      security: <Shield className="w-3 h-3" />,
      parking4w: <Car className="w-3 h-3" />,
      parking2w: <Car className="w-3 h-3" />,
      gym: <TrendingUp className="w-3 h-3" />,
      laundry: <Settings className="w-3 h-3" />,
      balcony: <Home className="w-3 h-3" />,
      ac: <Zap className="w-3 h-3" />,
      tv: <Monitor className="w-3 h-3" />,
      refrigerator: <Home className="w-3 h-3" />,
      geyser: <Zap className="w-3 h-3" />,
      cctv: <Camera className="w-3 h-3" />,
      lift: <TrendingUp className="w-3 h-3" />,
      waterSupply: <Home className="w-3 h-3" />,
      housekeeping: <Users className="w-3 h-3" />
    };
    return icons[amenity] || <Home className="w-3 h-3" />;
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
        variant: "default",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    });
  };

  const generateReceipt = async () => {
    setIsGeneratingReceipt(true);
    try {
      // Generate receipt HTML content
      const receiptContent = generateReceiptHTML();
      
      // Create a new window for printing/downloading
      const printWindow = window.open('', '_blank');
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
      toast({
        title: "Receipt Generated!",
        description: "Your booking receipt has been opened for download/printing",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast({
        title: "Error",
        description: "Failed to generate receipt",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  const generateReceiptHTML = () => {
    const monthlyRent = room?.rent || booking.rent || 0;
    const securityDeposit = property?.security_deposit || booking.securityDeposit || booking.propertySnapshot?.security_deposit || monthlyRent;
    const totalAmount = monthlyRent + securityDeposit;
    const advancePaid = totalAmount * 0.1;
    const remaining = totalAmount * 0.9;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Receipt - ${property?.propertyName || 'Property'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .receipt-title { font-size: 20px; margin: 10px 0; }
          .receipt-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .info-label { font-weight: bold; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
          .payment-table { width: 100%; border-collapse: collapse; }
          .payment-table th, .payment-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          .payment-table th { background: #f3f4f6; font-weight: bold; }
          .total-row { font-weight: bold; background: #f0f9ff; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Lyvo+</div>
          <div class="receipt-title">Booking Receipt</div>
          <div>Generated on: ${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="receipt-info">
          <div class="info-row">
            <span class="info-label">Receipt Number:</span>
            <span>LYV-${booking._id?.slice(-8)?.toUpperCase() || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Booking Date:</span>
            <span>${formatDateTime(booking.createdAt)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <span style="color: #059669; font-weight: bold;">CONFIRMED</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Property Details</div>
          <div class="info-row">
            <span class="info-label">Property Name:</span>
            <span>${property?.propertyName || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Address:</span>
            <span>${property?.address || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Room Number:</span>
            <span>Room ${room?.roomNumber || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Room Type:</span>
            <span>${room?.roomType || 'N/A'}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Booking Period</div>
          <div class="info-row">
            <span class="info-label">Check-in Date:</span>
            <span>${formatDate(booking.checkInDate)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Check-out Date:</span>
            <span>${formatDate(booking.checkOutDate)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Duration:</span>
            <span>${Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} days</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Payment Summary</div>
          <table class="payment-table">
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
            <tr>
              <td>Monthly Rent</td>
              <td>₹${monthlyRent.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Security Deposit</td>
              <td>₹${securityDeposit.toLocaleString()}</td>
            </tr>
            <tr class="total-row">
              <td><strong>Total Amount</strong></td>
              <td><strong>₹${totalAmount.toLocaleString()}</strong></td>
            </tr>
            <tr>
              <td>Advance Paid (10%)</td>
              <td style="color: #059669;">₹${advancePaid.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Remaining (90%)</td>
              <td style="color: #d97706;">₹${remaining.toLocaleString()}</td>
            </tr>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">Payment Status</div>
          <div class="info-row">
            <span class="info-label">Payment Status:</span>
            <span style="color: #059669; font-weight: bold;">COMPLETED</span>
          </div>
          ${booking.payment?.transactionId ? `
          <div class="info-row">
            <span class="info-label">Transaction ID:</span>
            <span>${booking.payment.transactionId}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Lyvo+!</p>
          <p>For any queries, contact us at support@lyvo.com</p>
          <p>This is a computer-generated receipt and does not require a signature.</p>
        </div>
      </body>
      </html>
    `;
  };

  const getDirections = () => {
    // Try room coordinates first, then property coordinates
    const coordinates = (room && room.latitude && room.longitude) 
      ? { lat: room.latitude, lng: room.longitude, type: 'room' }
      : (property && property.latitude && property.longitude)
      ? { lat: property.latitude, lng: property.longitude, type: 'property' }
      : null;

    if (coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
      window.open(url, '_blank');
      
      toast({
        title: "Directions Opened",
        description: `Opening directions to ${coordinates.type === 'room' ? 'your room' : 'the property'}`,
        variant: "default",
      });
    } else {
      toast({
        title: "Location Not Available",
        description: "Property and room location coordinates are not available",
        variant: "destructive",
      });
    }
  };

  const contactOwner = () => {
    if (owner && owner.phone) {
      window.open(`tel:${owner.phone}`, '_self');
    } else if (owner && owner.email) {
      window.open(`mailto:${owner.email}`, '_self');
    } else {
      toast({
        title: "Contact Information Not Available",
        description: "Owner contact details are not available",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = () => {
    try {
      // Create booking data for QR code
      const bookingData = {
        bookingId: booking._id,
        propertyName: property?.propertyName,
        roomNumber: room?.roomNumber,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        status: booking.status,
        generatedAt: new Date().toISOString()
      };

      // Create a simple QR code using canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 200;
      canvas.width = size;
      canvas.height = size;

      // Generate a simple pattern-based QR code
      const dataString = JSON.stringify(bookingData);
      const pattern = generateQRPattern(dataString, size);
      
      // Draw the QR pattern
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);
      
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < size; i += 10) {
        for (let j = 0; j < size; j += 10) {
          if (pattern[i / 10][j / 10]) {
            ctx.fillRect(i, j, 8, 8);
          }
        }
      }

      // Convert to data URL
      const dataURL = canvas.toDataURL('image/png');
      setQrCodeDataURL(dataURL);
      
      toast({
        title: "QR Code Generated!",
        description: "Your booking QR code is ready",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const generateQRPattern = (data, size) => {
    const pattern = [];
    const moduleSize = 10;
    const modules = size / moduleSize;
    
    // Initialize pattern
    for (let i = 0; i < modules; i++) {
      pattern[i] = [];
      for (let j = 0; j < modules; j++) {
        pattern[i][j] = false;
      }
    }
    
    // Add corner markers
    const addCornerMarker = (startX, startY) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (startX + i < modules && startY + j < modules) {
            pattern[startX + i][startY + j] = (i === 0 || i === 6 || j === 0 || j === 6 || 
                                             (i >= 2 && i <= 4 && j >= 2 && j <= 4));
          }
        }
      }
    };
    
    // Add corner markers
    addCornerMarker(0, 0);
    addCornerMarker(modules - 7, 0);
    addCornerMarker(0, modules - 7);
    
    // Add data pattern based on string hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data.charCodeAt(i)) & 0xffffffff;
    }
    
    // Fill remaining modules with pseudo-random pattern
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        // Skip corner markers
        if ((i < 7 && j < 7) || 
            (i >= modules - 7 && j < 7) || 
            (i < 7 && j >= modules - 7)) {
          continue;
        }
        
        // Skip timing patterns
        if (i === 6 || j === 6) {
          pattern[i][j] = (i + j) % 2 === 0;
          continue;
        }
        
        // Add pseudo-random pattern
        const seed = (hash + i * 31 + j * 17) % 1000;
        pattern[i][j] = seed % 2 === 0;
      }
    }
    
    return pattern;
  };

  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Booking Confirmation',
        text: `I've booked ${property?.propertyName || 'a room'} for ${booking?.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}`,
        url: window.location.href
      });
    } else {
      copyToClipboard(window.location.href, 'Booking link');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = () => {
    if (!booking?.checkInDate) return 0;
    const today = new Date();
    const checkIn = new Date(booking.checkInDate);
    const diffTime = checkIn - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBookingProgress = () => {
    if (!booking) return 0;
    const steps = ['payment', 'confirmation', 'check-in', 'stay'];
    const currentStep = booking.status === 'confirmed' ? 2 : booking.status === 'pending' ? 1 : 0;
    return ((currentStep + 1) / steps.length) * 100;
  };

  const canCancelBooking = () => {
    if (!booking) return false;
    
    console.log('🔍 Cancel Booking Debug:', {
      status: booking.status,
      checkInDate: booking.checkInDate,
      canCancel: true
    });
    
    // Allow cancellation for pending bookings (not yet approved)
    if (['pending', 'pending_approval', 'payment_pending'].includes(booking.status)) {
      console.log('✅ Can cancel: Pending booking');
      return true;
    }
    
    // For confirmed bookings, check if check-in is more than 24 hours away
    if (booking.status === 'confirmed') {
      const checkInDate = new Date(booking.checkInDate);
      const today = new Date();
      const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
      console.log('🔍 Confirmed booking check:', {
        checkInDate: checkInDate.toISOString(),
        today: today.toISOString(),
        daysUntilCheckIn,
        canCancel: daysUntilCheckIn > 1
      });
      return daysUntilCheckIn > 1;
    }
    
    // Cannot cancel rejected or already cancelled bookings
    console.log('❌ Cannot cancel: Status not allowed');
    return false;
  };

  // Cancel booking function
  const cancelBooking = async () => {
    if (!booking?._id) {
      toast({
        title: "Error",
        description: "No booking found to cancel",
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking? This action cannot be undone and will remove all booking and tenant records."
    );

    if (!confirmed) return;

    try {
      setIsCancelling(true);
      const token = localStorage.getItem('authToken');
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      
      const response = await fetch(`${baseUrl}/api/bookings/${booking._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been cancelled successfully",
          variant: "default",
        });
        
        // Navigate back to seeker dashboard
        setTimeout(() => {
          navigate('/seeker-dashboard');
        }, 1500);
      } else {
        const error = await response.json();
        toast({
          title: "Cancellation Failed",
          description: error.message || "Failed to cancel booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "An error occurred while cancelling the booking",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Mark check-in date function
  const markCheckIn = async () => {
    if (!booking || !checkInDate) return;

    try {
      setIsCheckingIn(true);
      const token = localStorage.getItem('authToken');
      const baseUrl = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
      
      const response = await fetch(`${baseUrl}/api/bookings/${booking._id}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          checkInDate: checkInDate
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Check-in date marked successfully",
          variant: "default"
        });
        // Refresh booking details
        fetchBookingDetails();
        // Close modal
        setShowCheckInModal(false);
        setCheckInDate('');
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to mark check-in date",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error marking check-in:', error);
      toast({
        title: "Error",
        description: "Failed to mark check-in date. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Open check-in modal
  const openCheckInModal = () => {
    setCheckInDate(booking.checkInDate ? new Date(booking.checkInDate).toISOString().split('T')[0] : '');
    setShowCheckInModal(true);
  };

  if (loading) {
    return (
      <SeekerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your booking details...</p>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  if (error || !booking) {
    return (
      <SeekerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The booking you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/seeker-dashboard')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  // Check if booking is confirmed - if status is confirmed/approved, owner has accepted
  const isBookingConfirmed = booking.status === 'confirmed' || booking.status === 'approved';
  
  // If booking is confirmed, owner has accepted (confirmed status implies owner approval)
  const isOwnerAccepted = isBookingConfirmed || 
                         booking.ownerAccepted === true || 
                         booking.ownerApproval === 'approved' || 
                         booking.ownerApproval === 'accepted';
  
  // Debug logging to see actual booking data
  console.log('Booking data for debugging:', {
    status: booking.status,
    ownerAccepted: booking.ownerAccepted,
    ownerApproval: booking.ownerApproval,
    isBookingConfirmed,
    isOwnerAccepted,
    allBookingFields: Object.keys(booking)
  });
  
  if (!isBookingConfirmed) {
    return (
      <SeekerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Ready</h2>
            <p className="text-gray-600 mb-4">
              This dashboard is only available for confirmed bookings where the owner has accepted your request.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-yellow-800 mb-2">Current Status:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Status:</span>
                  <span className={`font-semibold capitalize ${
                    booking.status === 'confirmed' || booking.status === 'approved' 
                      ? 'text-green-600' 
                      : 'text-yellow-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner Acceptance:</span>
                  <span className={`font-semibold ${
                    isOwnerAccepted ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {isOwnerAccepted ? 'Accepted' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-semibold ${
                    booking.payment?.paymentStatus === 'completed' 
                      ? 'text-green-600' 
                      : 'text-yellow-600'
                  }`}>
                    {booking.payment?.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/seeker-dashboard')}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/seeker-bookings')}
                className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  return (
    <SeekerLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
                  </div>
                </div>
                <p className="text-gray-600 mb-2 text-sm sm:text-base">Your accommodation is ready and confirmed</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Owner Accepted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Payment Completed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Ready for Check-in</span>
                  </div>
                </div>
                
                {/* Check-in Card and Actions */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mt-4">
                  {/* Check-in Card */}
                  <div className="bg-white/70 rounded-lg p-3 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Check-in</span>
                    </div>
                    <p className="text-sm sm:text-lg font-semibold text-gray-900">
                      {booking.checkInDate ? formatDate(booking.checkInDate) : 'Not Set'}
                    </p>
                    {booking.checkInDate && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ✓ Check-in Date Marked
                      </p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
                    {/* Check-in button for confirmed bookings */}
                    {booking && booking.status === 'confirmed' && (
                      <button
                        onClick={openCheckInModal}
                        className="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-sm font-medium min-h-[40px]"
                      >
                        <LogIn className="w-4 h-4 mr-1" />
                        Mark Check-in
                      </button>
                    )}
                    
                    {canCancelBooking() && (
                      <button
                        onClick={cancelBooking}
                        disabled={isCancelling}
                        className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm font-medium min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCancelling ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            <span>Cancel Booking</span>
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={shareBooking}
                      className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-medium min-h-[40px]"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
              
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-0 lg:space-y-3">
                <span className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="ml-2 capitalize">{booking.status}</span>
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Booking Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Booking Details
                    </h2>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Booking Date</label>
                      <p className="text-lg font-semibold text-gray-900">{formatDateTime(booking.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Check-in Date</label>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(booking.checkInDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Status</label>
                      <p className="text-lg font-semibold text-gray-900">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          booking.payment?.paymentStatus === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.payment?.paymentStatus === 'completed' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {booking.payment?.paymentStatus || 'Pending'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Booking Status</label>
                      <p className="text-lg font-semibold text-gray-900">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Booking Progress */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Booking Progress</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Overall Progress</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{Math.round(getBookingProgress())}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getBookingProgress()}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Payment</span>
                        <span>Confirmation</span>
                        <span>Check-in</span>
                        <span>Stay</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Confirmation Summary */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Booking Confirmation Summary</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Booking Status:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Confirmed
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Owner Acceptance:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Accepted
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Confirmed On:</span>
                          <span className="text-sm text-gray-600">{formatDateTime(booking.updatedAt || booking.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Property & Room Details */}
              {property && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 sm:p-6 border-b bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                        <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Accommodation Details
                      </h2>
                      <button
                        onClick={() => toggleSection('amenities')}
                        className="text-blue-600 hover:text-blue-700 flex items-center text-xs sm:text-sm self-start sm:self-auto"
                      >
                        {expandedSections.amenities ? <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                        <span className="ml-1">Amenities</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    {/* Property Images */}
                    {property.images && property.images.length > 0 && (
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Property Images</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                          {property.images.slice(0, 4).map((image, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden">
                              <img 
                                src={image} 
                                alt={`Property ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Property Name</label>
                        <p className="text-lg font-semibold text-gray-900">{property.propertyName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Property Type</label>
                        <p className="text-lg font-semibold text-gray-900">{property.propertyType || 'PG'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <div className="flex items-center space-x-2">
                          <p className="text-lg font-semibold text-gray-900">{property.address}</p>
                          <button
                            onClick={getDirections}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <MapIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {room && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Room Number</label>
                            <p className="text-lg font-semibold text-gray-900">Room {room.roomNumber}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Room Type</label>
                            <p className="text-lg font-semibold text-gray-900">{room.roomType}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Room Size</label>
                            <p className="text-lg font-semibold text-gray-900">{room.roomSize} sq ft</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Monthly Rent</label>
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(room.rent)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Max Occupancy</label>
                            <p className="text-lg font-semibold text-gray-900">{room.maxOccupancy || property.maxOccupancy} people</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Available From</label>
                            <p className="text-lg font-semibold text-gray-900">{formatDate(room.availableFrom)}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Property Description */}
                    {property.description && (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Description</h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{property.description}</p>
                      </div>
                    )}

                    {/* Detailed Room Information */}
                    {room && (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Your Room Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Bed className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Room Information</span>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Room Number:</span>
                                <span className="font-semibold">Room {room.roomNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Room Type:</span>
                                <span className="font-semibold">{room.roomType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Size:</span>
                                <span className="font-semibold">{room.roomSize} sq ft</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Max Occupancy:</span>
                                <span className="font-semibold">{room.maxOccupancy || property.maxOccupancy} people</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">Pricing & Terms</span>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Monthly Rent:</span>
                                <span className="font-semibold">{formatCurrency(room.rent)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Security Deposit:</span>
                                <span className="font-semibold">{formatCurrency(booking.securityDeposit)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Available From:</span>
                                <span className="font-semibold">{formatDate(room.availableFrom)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Property Amenities */}
                    {property.amenities && expandedSections.amenities && (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Property Amenities</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                          {Object.entries(property.amenities).map(([amenity, available]) => {
                            if (available) {
                              return (
                                <div key={amenity} className="flex items-center px-2 sm:px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                                  {getAmenityIcon(amenity)}
                                  <span className="ml-2 text-xs sm:text-sm font-medium">
                                    {amenity.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Room Amenities */}
                    {room && room.amenities && expandedSections.amenities && (
                      <div className="mt-4 sm:mt-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Room Amenities</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                          {Object.entries(room.amenities).map(([amenity, available]) => {
                            if (available) {
                              return (
                                <div key={amenity} className="flex items-center px-2 sm:px-3 py-2 bg-green-50 text-green-700 rounded-lg">
                                  {getAmenityIcon(amenity)}
                                  <span className="ml-2 text-xs sm:text-sm font-medium">
                                    {amenity.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Important Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Important Information
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Check-in Instructions</h3>
                        <p className="text-gray-600">Please arrive on your check-in date. Contact the property owner for specific check-in procedures.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Payment Status</h3>
                        <p className="text-gray-600">Ensure all payments are completed before check-in. Contact support if you have payment issues.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Key className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Keys & Access</h3>
                        <p className="text-gray-600">Keys will be provided upon check-in. Make sure to return them during check-out.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Documentation</h3>
                        <p className="text-gray-600">Keep your booking confirmation and payment receipts for your records.</p>
                      </div>
                    </div>
                    {canCancelBooking() && (
                      <div className="flex items-start space-x-3">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Cancellation Policy</h3>
                          <p className="text-gray-600">
                            {booking.status === 'pending' 
                              ? 'You can cancel your pending booking at any time before owner approval.'
                              : 'You can cancel your booking up to 24 hours before check-in. Cancellation after this period may incur charges.'}
                          </p>
                        </div>
                      </div>
                    )}
                    {!canCancelBooking() && booking.status === 'confirmed' && (
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Cancellation Policy</h3>
                          <p className="text-gray-600">Cancellation is not available as check-in is within 24 hours. Please contact support for assistance.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Owner Contact */}
              {owner && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Property Owner
                    </h3>
                    <button
                      onClick={() => toggleSection('contact')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {expandedSections.contact ? <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </button>
                  </div>
                  
                  {expandedSections.contact && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                          <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">{owner.name || 'Owner Name'}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{owner.email}</p>
                      </div>
                      
                      {owner.phone && (
                        <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            <span className="text-xs sm:text-sm text-gray-600">{owner.phone}</span>
                          </div>
                          <button
                            onClick={() => window.open(`tel:${owner.phone}`, '_self')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={contactOwner}
                          className="bg-blue-600 text-white py-2 px-2 sm:px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-xs sm:text-sm"
                        >
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Call
                        </button>
                        <button 
                          onClick={() => window.open(`mailto:${owner.email}`, '_self')}
                          className="bg-green-600 text-white py-2 px-2 sm:px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-xs sm:text-sm"
                        >
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Email
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={generateReceipt}
                    disabled={isGeneratingReceipt}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {isGeneratingReceipt ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {isGeneratingReceipt ? 'Generating...' : 'Download Receipt'}
                  </button>
                  <button 
                    onClick={getDirections}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </button>
                  
                  <button 
                    onClick={shareBooking}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Booking
                  </button>
                  
                  {canCancelBooking() && (
                    <button 
                      onClick={cancelBooking}
                      disabled={isCancelling}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCancelling ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          <span>Cancel Booking</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                
              </motion.div>

              {/* Payment Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Payment Summary
                  </h3>
                  <button
                    onClick={() => toggleSection('payment')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {expandedSections.payment ? <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>
                </div>
                
                {expandedSections.payment && (() => {
                  const monthlyRent = room?.rent || booking.rent || 0;
                  const securityDeposit = property?.security_deposit || booking.securityDeposit || booking.propertySnapshot?.security_deposit || monthlyRent;
                  const totalAmount = monthlyRent + securityDeposit;
                  const advancePaid = totalAmount * 0.1;
                  const remaining = totalAmount * 0.9;
                  
                  return (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Monthly Rent</span>
                      <span className="text-xs sm:text-sm font-semibold">{formatCurrency(monthlyRent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Security Deposit</span>
                      <span className="text-xs sm:text-sm font-semibold">{formatCurrency(securityDeposit)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-sm sm:text-base">
                      <span>Total Amount</span>
                      <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-green-700 font-semibold">Advance Paid (10%)</span>
                      <span className="font-bold text-green-600">{formatCurrency(advancePaid)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-orange-700 font-semibold">Remaining (90%)</span>
                      <span className="font-bold text-orange-600">{formatCurrency(remaining)}</span>
                    </div>
                    
                    {/* Payment Status */}
                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Payment Status</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          booking.payment?.paymentStatus === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.payment?.paymentStatus === 'completed' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {booking.payment?.paymentStatus || 'Pending'}
                        </span>
                      </div>
                      {booking.payment?.transactionId && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">Transaction ID</span>
                          <button
                            onClick={() => copyToClipboard(booking.payment.transactionId, 'Transaction ID')}
                            className="text-xs text-blue-600 hover:text-blue-700 font-mono break-all"
                          >
                            {booking.payment.transactionId.slice(0, 8)}...
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })()}
              </motion.div>

              {/* Important Documents */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Documents
                  </h3>
                  <button
                    onClick={() => toggleSection('documents')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {expandedSections.documents ? <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>
                </div>
                
                {expandedSections.documents && (
                  <div className="space-y-2 sm:space-y-3">
                    <button className="w-full bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-xs sm:text-sm">
                      <Receipt className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Booking Confirmation
                    </button>
                    <button className="w-full bg-green-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-xs sm:text-sm">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Rental Agreement
                    </button>
                    <button className="w-full bg-purple-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-xs sm:text-sm">
                      <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Payment Receipt
                    </button>
                    <button className="w-full bg-orange-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-xs sm:text-sm">
                      <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Print All Documents
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>


      {/* Check-in Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <LogIn className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Mark Check-in Date</h3>
                    <p className="text-sm text-gray-500">Select your check-in date</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckInModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isCheckingIn}
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                {/* Booking Details */}
                {booking && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Property:</span>
                        <span className="font-medium">{property?.propertyName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room:</span>
                        <span className="font-medium">Room {room?.roomNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Check-in:</span>
                        <span className="font-medium">{formatDate(booking.checkInDate)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Input */}
                <div className="space-y-2">
                  <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    id="checkInDate"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isCheckingIn}
                  />
                  <p className="text-xs text-gray-500">
                    Select the date when you plan to check into the room
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckInModal(false)}
                  disabled={isCheckingIn}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={markCheckIn}
                  disabled={isCheckingIn || !checkInDate}
                  className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Marking...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Mark Check-in</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SeekerLayout>
  );
};

export default PostBookingDashboard;
