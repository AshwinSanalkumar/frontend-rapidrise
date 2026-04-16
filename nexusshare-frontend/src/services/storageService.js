import apiClient from '../api/apiClient';

/**
 * Fetches the current user's storage usage summary.
 * @returns {Object} - { total, used, categories: [...] }
 */
export const fetchStorageUsage = async () => {
  const response = await apiClient.get('storage/usage/');
  return response.data;
};

/**
 * Fetches files sorted by size (largest first) for storage management.
 * @param {string} category - Optional category filter ('Images', 'Documents', etc.)
 */
export const fetchLargeFiles = async (category = '') => {
  const params = category ? { category } : {};
  const response = await apiClient.get('storage/large-files/', { params });
  return Array.isArray(response.data) ? response.data : (response.data.results || []);
};

/**
 * Triggers a cache/temp file cleanup on the server.
 * @param {string} type - 'cache' | 'trash'
 */
export const runCleanup = async (type) => {
  const response = await apiClient.post('storage/cleanup/', { type });
  return response.data;
};

/**
 * Finds and returns duplicate files for the current user.
 */
export const fetchDuplicates = async () => {
  const response = await apiClient.get('storage/duplicates/');
  return Array.isArray(response.data) ? response.data : (response.data.results || []);
};
