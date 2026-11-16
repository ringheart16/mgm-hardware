import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to attach bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mgm_auth_token') || sessionStorage.getItem('mgm_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiry / unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mgm_auth_token');
      sessionStorage.removeItem('mgm_auth_token');
      localStorage.removeItem('mgm_auth_user');
      sessionStorage.removeItem('mgm_auth_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
