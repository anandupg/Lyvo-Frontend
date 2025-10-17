import React, { useState } from 'react';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const KycUploadTest = () => {
  const [testState, setTestState] = useState('working');

  return (
    <SeekerLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">KYC Upload Test</h1>
            <p className="text-gray-600 mt-2">Testing basic component rendering</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600 font-semibold">✅ Component is rendering!</p>
              <p className="text-gray-600 mt-2">State: {testState}</p>
              <Button 
                onClick={() => setTestState(testState === 'working' ? 'clicked' : 'working')}
                className="mt-4"
              >
                Test Button
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SeekerLayout>
  );
};

export default KycUploadTest;
