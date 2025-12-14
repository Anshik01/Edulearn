import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check if backend is running.');
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check if backend is running on port 8080.');
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
    } else if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission.');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
      console.error('Server error details:', error.response?.data);
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default api;