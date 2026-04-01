// services/emailHistoryApi.js
import { apiCall } from './api';

export const emailHistoryApi = {
  getEmailHistory: () => apiCall('get', '/email-history'),
  
  getEmailHistoryPaginated: (page, size) => 
    apiCall('get', `/email-history/paginated?page=${page}&size=${size}`),
  
  getEmailHistoryDetail: (id) => 
    apiCall('get', `/email-history/${id}`),
  
  getEmailHistoryCount: () => 
    apiCall('get', '/email-history/count'),
  
  // Add methods for template-related history if needed
  getTemplateHistory: () => 
    apiCall('get', '/email-history/templates'),
  
  getTemplateHistoryDetail: (id) => 
    apiCall('get', `/email-history/templates/${id}`),
};