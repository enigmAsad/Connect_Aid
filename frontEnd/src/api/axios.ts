import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  // Base URL for API requests - use the current origin
  // Since we're using a reverse proxy, all API requests should go to /api
  baseURL: '',
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
    
    // Make sure auth endpoints use the correct path
    if (config.url?.includes('login') || config.url?.includes('signup')) {
      config.url = `/api${config.url}`;
    } else if (!config.url?.startsWith('/api') && !config.url?.startsWith('http')) {
      config.url = `/api${config.url}`;
    }
    
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
