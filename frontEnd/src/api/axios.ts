import axios from 'axios';

// Determine the base URL based on the environment
const getBaseUrl = () => {
  // Use environment variable if available, otherwise fallback to defaults
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // In production (Docker/EC2), use relative URL as nginx handles routing
  if (import.meta.env.PROD) {
    return apiUrl || ''; // Use environment variable or empty string for relative URLs
  }
  
  // Local development
  return apiUrl || 'http://localhost:5000';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Remove the API prefix handling since nginx already handles it
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
