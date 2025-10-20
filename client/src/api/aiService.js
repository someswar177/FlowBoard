import apiClient from './apiClient';

export const aiService = {
  /**
   * Requests an AI summary for a given project.
   * @param {string} projectId - The ID of the project to summarize.
   * @returns {Promise<object>} A promise that resolves to the summary object.
   */
  summarizeProject: (projectId) => apiClient.post('/ai/summarize', { projectId }),

  /**
   * Asks the AI a question about a specific project.
   * @param {string} projectId - The ID of the project for context.
   * @param {string} question - The user's question.
   * @returns {Promise<object>} A promise that resolves to the answer object.
   */
  ask: (projectId, question) => apiClient.post('/ai/ask', { projectId, question }),
};