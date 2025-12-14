import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DebugPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const [tests, setTests] = useState({
    health: { status: 'pending', message: '' },
    cors: { status: 'pending', message: '' },
    database: { status: 'pending', message: '' },
    auth: { status: 'pending', message: '' }
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      runTests();
    }
  }, [isVisible]);

  const runTests = async () => {
    // Reset tests
    setTests({
      health: { status: 'testing', message: 'Testing...' },
      cors: { status: 'testing', message: 'Testing...' },
      database: { status: 'testing', message: 'Testing...' },
      auth: { status: 'testing', message: 'Testing...' }
    });

    // Test 1: Health Check
    try {
      const response = await api.get('/test/health');
      setTests(prev => ({
        ...prev,
        health: { status: 'success', message: response.data.message }
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        health: { status: 'error', message: error.message }
      }));
    }

    // Test 2: CORS
    try {
      const response = await api.get('/test/cors');
      setTests(prev => ({
        ...prev,
        cors: { status: 'success', message: response.data.message }
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        cors: { status: 'error', message: error.message }
      }));
    }

    // Test 3: Database
    try {
      const response = await api.get('/test/database');
      setTests(prev => ({
        ...prev,
        database: { 
          status: response.data.database === 'connected' ? 'success' : 'error', 
          message: `${response.data.message} (Users: ${response.data.userCount || 0})` 
        }
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        database: { status: 'error', message: error.message }
      }));
    }

    // Test 4: Authentication
    setTests(prev => ({
      ...prev,
      auth: { 
        status: isAuthenticated ? 'success' : 'warning', 
        message: isAuthenticated ? `Logged in as ${user?.username} (${user?.role})` : 'Not authenticated'
      }
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'testing': return '🔄';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'testing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">System Debug</h3>
        <div className="flex space-x-2">
          <button
            onClick={runTests}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Refresh
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        {Object.entries(tests).map(([key, test]) => (
          <div key={key} className="flex items-start space-x-2">
            <span className="text-lg">{getStatusIcon(test.status)}</span>
            <div className="flex-1">
              <div className="font-medium capitalize">{key}</div>
              <div className={`text-xs ${getStatusColor(test.status)}`}>
                {test.message}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        <div>Backend: http://localhost:8080</div>
        <div>Frontend: {window.location.origin}</div>
      </div>
    </div>
  );
};

export default DebugPanel;