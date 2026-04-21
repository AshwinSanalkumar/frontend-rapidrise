import apiClient from '../api/apiClient';

/**
 * Creates a shareable link for a file.
 * @param {number|string} fileId
 * @param {Object} options - { emails, message, duration_minutes }
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
 * Returns the full absolute URL for the public file download/preview.
 * @param {string} shareToken 
 */
export const getPublicShareUrl = (shareToken) => {
  return `http://localhost:8000/api/file/shared/${shareToken}/`;
};
