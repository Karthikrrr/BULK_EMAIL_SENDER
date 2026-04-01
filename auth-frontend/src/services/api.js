// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function for file uploads
export const uploadFile = (url, formData, onUploadProgress = null) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  };
  
  if (onUploadProgress) {
    config.onUploadProgress = onUploadProgress;
  }
  
  return api.post(url, formData, config).then(response => response.data);
};

// Helper function for regular API calls
export const apiCall = (method, url, data = null) => {
  return api({
    method,
    url,
    data,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => response.data);
};

// Auth API methods
export const authApi = {
  login: (credentials) => apiCall('post', '/auth/login', credentials),
  register: (userData) => apiCall('post', '/auth/register', userData),
  getProfile: () => apiCall('get', '/users/profile'),
  getAllUsers: () => apiCall('get', '/users/all'),
};

// Email API methods
export const emailApi = {
  // Template bulk email methods
  previewTemplate: (formData) => uploadFile('/emails/preview-template', formData),
  sendBulkWithTemplate: (formData) => uploadFile('/emails/bulk-with-template', formData),
  
  // Regular bulk email method
  sendBulk: (data) => apiCall('post', '/emails/bulk', data),
  
  // Single email method
  sendSingle: (to, subject, message) => 
    apiCall('post', '/emails/single', { to, subject, message }),
};

export default api;