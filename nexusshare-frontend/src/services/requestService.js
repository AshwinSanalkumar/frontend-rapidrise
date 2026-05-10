import apiClient from '../api/apiClient';

/**
 * Sends a new file request to an external user.
 * @param {Object} data - { email, note }
 */
export const createFileRequest = async (data) => {
  const response = await apiClient.post('requests/send/', data);
  return response.data;
};

/**
 * Fetches all outbound file requests created by the current user.
 */
export const fetchSentRequests = async () => {
  const response = await apiClient.get('requests/sent/');
  return Array.isArray(response.data) ? response.data : (response.data.results || []);
};

/**
 * Fetches all inbound file requests received by the current user.
 */
export const fetchReceivedRequests = async () => {
  const response = await apiClient.get('requests/received/');
  return Array.isArray(response.data) ? response.data : (response.data.results || []);
};

/**
 * Declines a received request.
 * @param {number|string} requestId
 */
export const declineRequest = async (requestId) => {
  const response = await apiClient.post(`requests/${requestId}/decline/`);
  return response.data;
};

/**
 * Fulfills a received request with a file upload.
 * @param {number|string} requestId
 * @param {FormData} formData
 */
export const fulfillRequest = async (requestId, formData) => {
  const response = await apiClient.post(`requests/${requestId}/fulfill/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Imports a file from a fulfilled request into the sender's own cloud.
 * @param {number|string} requestId
 * @param {string} fileId
 */
export const importRequestFile = async (requestId, fileId) => {
  const response = await apiClient.post(`requests/${requestId}/import/`, { file_id: fileId });
  return response.data;
};
