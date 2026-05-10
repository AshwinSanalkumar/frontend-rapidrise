import apiClient from '../api/apiClient';

/**
 * Fetches the current user's profile details.
 */
export const fetchProfile = async () => {
  const response = await apiClient.get('user/');
  return response.data;
};

/**
 * Updates the current user's profile.
 * @param {Object} data - { first_name, last_name, dob, ... }
 */
export const updateProfile = async (data) => {
  const response = await apiClient.patch('user/', data);
  return response.data;
};

/**
 * Changes the user's password.
 * @param {Object} data - { old_password, new_password }
 */
export const changePassword = async (data) => {
  const response = await apiClient.post('user/change-password/', data);
  return response.data;
};
