import apiClient from './apiClient';

export const taskService = {
  getByProject: (projectId) => apiClient.get(`/tasks/project/${projectId}`),

  create: (projectId, data) => apiClient.post(`/tasks/project/${projectId}`, data),

  update: (id, data) => apiClient.put(`/tasks/${id}`, data),

  delete: (id) => apiClient.delete(`/tasks/${id}`),
};
