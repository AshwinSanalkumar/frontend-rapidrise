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
 * Approves or declines a received request.
 * @param {number|string} requestId
 * @param {string} action - 'approve' | 'decline'
 */
export const respondToRequest = async (requestId, action) => {
  const response = await apiClient.post(`requests/${requestId}/respond/`, { action });
  return response.data;
};
