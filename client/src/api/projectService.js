// src/api/projectService.js
import apiClient from './apiClient';

export const projectService = {
  // This is the key optimization.
  // We're assuming the backend can handle this query parameter to return a much smaller payload.
  getAll: (populateTaskCount = false) =>
    apiClient.get(`/projects?populateTaskCount=${populateTaskCount}`),

  getById: (id, populateTasks = false) =>
    apiClient.get(`/projects/${id}?populateTasks=${populateTasks}`),

  create: (data) => apiClient.post('/projects', data),

  update: (id, data) => apiClient.put(`/projects/${id}`, data),

  delete: (id) => apiClient.delete(`/projects/${id}`),

  createTask: (projectId, data) => apiClient.post(`/projects/${projectId}/tasks`, data),
};