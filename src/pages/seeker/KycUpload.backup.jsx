// BACKUP VERSION - Use this if main component fails
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';

const KycUploadBackup = () => {
  const navigate = useNavigate();

  return (
    <SeekerLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/seeker-dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center">
              <Shield className="w-12 h-12 text-blue-600 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  KYC Verification (Backup Mode)
                </h1>
                <p className="text-gray-600">
                  Component is loading in backup mode
                </p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-600 font-semibold">
                ⚠️ Running in backup mode. Main component has an error.
              </p>
              <p className="text-gray-600 mt-4">
                Please check the browser console (F12) for error details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SeekerLayout>
  );
};

export default KycUploadBackup;
