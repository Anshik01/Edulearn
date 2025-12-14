import React, { useState, useEffect } from 'react';
import api from '../services/api';

const HealthCheck = () => {
  const [status, setStatus] = useState('Checking...');
  const [isHealthy, setIsHealthy] = useState(false);
  const [details, setDetails] = useState('');

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await api.get('/test/health');
      setStatus('✅ Backend Connected');
      setDetails(`API: ${response.data.status}`);
      setIsHealthy(true);
    } catch (error) {
      setIsHealthy(false);
      if (error.code === 'ERR_NETWORK') {
        setStatus('❌ Backend Offline');
        setDetails('Check if Spring Boot is running on port 8080');
      } else if (error.code === 'ECONNABORTED') {
        setStatus('⏱️ Backend Timeout');
        setDetails('Backend is slow to respond');
      } else {
        setStatus('❌ Backend Error');
        setDetails(`Error: ${error.response?.status || error.message}`);
      }
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-lg text-sm max-w-xs ${
      isHealthy ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <div className="font-medium">{status}</div>
      <div className="text-xs mt-1 opacity-75">{details}</div>
      <button 
        onClick={checkHealth}
        className="text-xs underline mt-1 opacity-75 hover:opacity-100"
      >
        Refresh
      </button>
    </div>
  );
};

export default HealthCheck;