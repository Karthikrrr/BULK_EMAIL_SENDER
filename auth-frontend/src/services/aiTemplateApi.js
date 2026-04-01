import { apiCall } from './api';

export const aiTemplateApi = {
  generateTemplate: (prompt, tone = 'professional', purpose = '') => 
    apiCall('post', '/ai-templates/generate', { prompt, tone, purpose }),
  
  improveTemplate: (existingTemplate, improvementPrompt) => 
    apiCall('post', '/ai-templates/improve', { existingTemplate, improvementPrompt }),
  
  // Add health check
  healthCheck: () => apiCall('get', '/ai-templates/health'),
};