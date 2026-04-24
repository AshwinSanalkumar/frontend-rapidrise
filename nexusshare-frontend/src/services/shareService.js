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
export const fetchSharedLinks = async (page = 1, search = '', status = '', fileId = '') => {
  const response = await apiClient.get(`files/shared-links/?page=${page}&search=${search}&status=${status}&file_id=${fileId}`);
  return response.data;
};

/**
 * Revokes a specific shared link.
 * @param {number|string} shareId
 */
export const revokeShareLink = async (token) => {
  const response = await apiClient.post(`files/share/revoke/${token}/`);
  return response.data;
};


/**
 * Returns the full absolute URL for the public file download/preview.
 * @param {string} shareToken 
 */
export const getPublicShareUrl = (shareToken) => {
  return `http://localhost:8000/api/file/shared/${shareToken}/`;
};
