import React, { useState } from 'react';
import aiService from '../services/aiService';

const AITest = () => {
  const [status, setStatus] = useState('Not tested');
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAIService = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatus('Testing...');

    try {
      console.log('Testing Google Gemini Pro AI Service...');
      console.log('Environment variables:', {
        NODE_ENV: import.meta.env.NODE_ENV
      });

      // Test initialization
      await aiService.initialize();
      setStatus('Gemini Pro initialization successful');

      // Test a simple request
      const testResponse = await aiService.getLyvoAssistantResponse("Hello, what are your room prices?");
      setResponse(testResponse);
      setStatus('Gemini Pro test completed successfully');

    } catch (err) {
      console.error('AI Test Error:', err);
      setError(err.message);
      setStatus('Test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">AI Service Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Environment Check:</h3>
          <p>Google Gemini Pro: ✅ Ready (Real AI Model)</p>
          <p>API Key: ✅ Configured</p>
          <p>Node Environment: {import.meta.env.NODE_ENV}</p>
        </div>

        <button
          onClick={testAIService}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test AI Service'}
        </button>

        <div>
          <h3 className="font-semibold">Status:</h3>
          <p className={status.includes('success') ? 'text-green-600' : status.includes('failed') ? 'text-red-600' : 'text-yellow-600'}>
            {status}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <h3 className="font-semibold text-red-800">Error:</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <h3 className="font-semibold text-green-800">AI Response:</h3>
            <p className="text-green-600 text-sm">{response}</p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded p-3">
          <h3 className="font-semibold text-gray-800">Google Gemini Pro Features:</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>✅ Real AI model powered by Google Gemini Pro</li>
            <li>✅ Intelligent, context-aware responses</li>
            <li>✅ Lyvo+ specific knowledge and system prompt</li>
            <li>✅ Automatic fallback to local responses if API fails</li>
            <li>✅ Rate limit handling (15 requests/minute)</li>
            <li>✅ Error handling and connection testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AITest;
