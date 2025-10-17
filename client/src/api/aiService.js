import apiClient from './apiClient';

export const aiService = {
  summarizeTasks: (projectData) => apiClient.post('/ai/summarize', projectData),

  ask: (question, context) => apiClient.post('/ai/ask', { question, context }),
};
