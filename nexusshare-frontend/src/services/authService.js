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
