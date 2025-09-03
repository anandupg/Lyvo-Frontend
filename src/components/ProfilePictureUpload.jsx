import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';
import axios from 'axios';

const ProfilePictureUpload = ({ currentImage, onImageUpdate, className = "" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!previewImage) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      // Convert base64 to blob
      const response = await fetch(previewImage);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('profilePicture', blob, 'profile-picture.jpg');

      const result = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4002/api'}/user/upload-profile-picture`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (result.data.user) {
        // Update local storage
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, profilePicture: result.data.user.profilePicture };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Call parent callback
        onImageUpdate(result.data.user.profilePicture);
        
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('lyvo-profile-update'));
        
        // Clear preview
        setPreviewImage(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload image. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || errorMessage;
        console.error('Server error:', error.response.data);
        
        // If token is invalid, suggest logging in again
        if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
          // Clear invalid token
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
        console.error('Network error:', error.request);
      } else {
        // Other error
        console.error('Error:', error.message);
      }
      
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getDisplayImage = () => {
    if (previewImage) return previewImage;
    if (currentImage) return currentImage;
    return null;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Profile Picture Display */}
      <div className="relative group">
        <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
          {getDisplayImage() ? (
            <img
              src={getDisplayImage()}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-white" />
          )}
        </div>
        
        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-white hover:text-gray-200 transition-colors"
            disabled={isUploading}
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview Profile Picture</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
