import apiClient from './apiClient';

export const projectService = {
  getAll: (populateTaskCount = false) =>
    apiClient.get(`/projects?populateTaskCount=${populateTaskCount}`),

  getById: (id, populateTasks = false) =>
    apiClient.get(`/projects/${id}?populateTasks=${populateTasks}`),

  create: (data) => apiClient.post('/projects', data),

  update: (id, data) => apiClient.put(`/projects/${id}`, data),

  delete: (id) => apiClient.delete(`/projects/${id}`),

  createTask: (projectId, data) => apiClient.post(`/projects/${projectId}/tasks`, data),

  addColumn: (projectId, columnName) => apiClient.post(`/projects/${projectId}/columns`, { columnName }),

  deleteColumn: (projectId, columnName) => apiClient.delete(`/projects/${projectId}/columns`, { data: { columnName } }),
};