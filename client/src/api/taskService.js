// src/api/taskService.js
import apiClient from './apiClient';

export const taskService = {
  update: (id, data) => apiClient.put(`/tasks/${id}`, data),

  delete: (id) => apiClient.delete(`/tasks/${id}`),
};