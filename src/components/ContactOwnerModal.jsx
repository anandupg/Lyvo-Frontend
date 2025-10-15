import React from 'react';
import { X, Phone, Mail, User, MessageCircle } from 'lucide-react';

const ContactOwnerModal = ({ isOpen, onClose, owner }) => {
  if (!isOpen) return null;

  const handleWhatsApp = () => {
    if (owner?.phone) {
      const message = encodeURIComponent(`Hi, I'm interested in your property and would like to get more information.`);
      window.open(`https://wa.me/${owner.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (owner?.email) {
      const subject = encodeURIComponent(`Property Inquiry`);
      const body = encodeURIComponent(`Hi ${owner.name || 'Owner'},\n\nI'm interested in your property and would like to get more information.\n\nThank you!`);
      window.location.href = `mailto:${owner.email}?subject=${subject}&body=${body}`;
    }
  };

  const handleCall = () => {
    if (owner?.phone) {
      window.location.href = `tel:${owner.phone}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Owner</h2>
                <p className="text-sm text-gray-600">Get in touch with the property owner</p>
              </div>
            </div>
          </div>

          {/* Owner Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Owner Name</p>
                <p className="font-medium text-gray-900">{owner?.name || owner?.ownerName || 'Not available'}</p>
              </div>
            </div>

            {owner?.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">{owner.phone}</p>
                </div>
              </div>
            )}

            {owner?.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900 break-all">{owner.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {owner?.phone && (
              <>
                <button
                  onClick={handleCall}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call Owner
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
              </>
            )}

            {owner?.email && (
              <button
                onClick={handleEmail}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </button>
            )}
          </div>

          {/* Note */}
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Please be respectful when contacting the property owner. Provide your details and requirements clearly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactOwnerModal;
