import apiClient from '../api/apiClient';

/**
 * Creates a shareable link for a file.
 * @param {number|string} fileId
 * @param {Object} options - { email, access, expiry_minutes, ... }
 */
export const createShareLink = async (fileId, options = {}) => {
  const response = await apiClient.post(`files/${fileId}/share/`, options);
  return response.data;
};

/**
 * Fetches all active shared links for the current user.
 */
export const fetchSharedLinks = async () => {
  const response = await apiClient.get('files/shared-links/');
  return Array.isArray(response.data) ? response.data : (response.data.results || []);
};

/**
 * Revokes a specific shared link.
 * @param {number|string} shareId
 */
export const revokeShareLink = async (shareId) => {
  const response = await apiClient.delete(`files/shared-links/${shareId}/`);
  return response.data;
};

/**
 * Fetches the publicly-accessible file data from a share token.
 * Used by the SharedFileView page (no auth required).
 * @param {string} shareToken
 */
export const fetchSharedFile = async (shareToken) => {
  const response = await apiClient.get(`files/shared/${shareToken}/`);
  return response.data;
};
