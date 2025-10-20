import apiClient from './apiClient';

export const taskService = {
  updateOrder: (tasks) => apiClient.put('/tasks/update-order', { tasks }),

  update: (id, data) => apiClient.put(`/tasks/${id}`, data),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
};