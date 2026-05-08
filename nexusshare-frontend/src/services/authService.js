import apiClient from '../api/apiClient';

/**
 * Logs in a user with the given credentials.
 * @param {Object} credentials - { email, password }
 * @returns {Object} - { user } on success
 */
export const loginUser = async (credentials) => {
  const response = await apiClient.post('login/', credentials);
  return response.data;
};

/**
 * Logs out the current user (clears httpOnly cookie on server).
 */
export const logoutUser = async () => {
  await apiClient.post('logout/');
};

/**
 * Registers a new user.
 * @param {Object} userData - { email, password, first_name, last_name, ... }
 */
export const registerUser = async (userData) => {
  const response = await apiClient.post('register/', userData);
  return response.data;
};

/**
 * Fetches the current user details.
 */
export const fetchMe = async () => {
  const response = await apiClient.get('user/');
  return response.data;
};

/**
 * Sends password reset email.
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  const response = await apiClient.post('forgot-password/', { email });
  return response.data;
};

/**
 * Resets password using uid + token.
 * @param {string} uid
 * @param {string} token
 * @param {string} password
 */
export const resetPassword = async (uid, token, password) => {
  const response = await apiClient.post(`reset-password/${uid}/${token}/`, { password });
  return response.data;
};
