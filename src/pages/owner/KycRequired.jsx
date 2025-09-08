import React from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../components/owner/OwnerLayout';

const KycRequired = () => {
  const navigate = useNavigate();

  return (
    <OwnerLayout>
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white border border-yellow-200 rounded-xl p-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Government ID verification required</h1>
          <p className="text-sm text-gray-600 mb-4">To add a property, please upload and verify your Government ID.</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/owner-settings#kyc')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Go to Upload Documents
            </button>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default KycRequired;


