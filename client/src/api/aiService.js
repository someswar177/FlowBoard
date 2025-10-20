import apiClient from './apiClient';

export const aiService = {
  /**
   * Requests an AI summary for a given project and a specific column.
   * @param {string} projectId - The ID of the project to summarize.
   * @param {string} columnName - The name of the column to focus the summary on.
   * @returns {Promise<object>} A promise that resolves to the summary object.
   */
  summarizeProject: (projectId, columnName) => apiClient.post('/ai/summarize', { projectId, columnName }),

  /**
   * Asks the AI a question about a specific project.
   * @param {string} projectId - The ID of the project for context.
   * @param {string} question - The user's question.
   * @returns {Promise<object>} A promise that resolves to the answer object.
   */
  ask: (projectId, question) => apiClient.post('/ai/ask', { projectId, question }),
};