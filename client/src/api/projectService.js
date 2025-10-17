import apiClient from './apiClient';

export const projectService = {
  getAll: () => apiClient.get('/projects'),

  getById: (id) => apiClient.get(`/projects/${id}`),

  create: (data) => apiClient.post('/projects', data),

  update: (id, data) => apiClient.put(`/projects/${id}`, data),

  delete: (id) => apiClient.delete(`/projects/${id}`),

  getTasks: (projectId) => apiClient.get(`/projects/${projectId}/tasks`),

  createTask: (projectId, data) => apiClient.post(`/projects/${projectId}/tasks`, data),
};
