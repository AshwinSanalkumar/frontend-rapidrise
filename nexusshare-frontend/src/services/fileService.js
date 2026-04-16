import apiClient from '../api/apiClient';

/**
 * Maps the backend file object to the frontend's UI-friendly format.
 */
export const mapFileFromApi = (apiFile) => {
  const mimeMap = {
    'application/pdf': 'pdf',
    'image/png': 'image',
    'image/jpeg': 'image',
    'image/webp': 'image',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
    'application/vnd.ms-excel': 'excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
    'application/msword': 'word',
    'application/zip': 'zip',
    'application/x-zip-compressed': 'zip',
  };

  return {
    id: apiFile.id,
    name: apiFile.display_name || apiFile.filename,
    filename: apiFile.filename,
    description:apiFile.description,
    date: new Date(apiFile.uploaded_at).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    size: apiFile.size_readable,
    type: mimeMap[apiFile.mime_type] || 'default',
    preview: apiFile.content ? `http://localhost:8000${apiFile.content}` : null,
    extension: apiFile.filename ? '.' + apiFile.filename.split('.').pop().toUpperCase() : '',
    status: 'PRIVATE',
    isDeleted: apiFile.is_deleted || false,
    isFavorite: apiFile.is_favorite || false,
    uploadedAt: apiFile.uploaded_at,
  };
};

/**
 * Fetches all files for the authenticated user.
 */
export const fetchFiles = async () => {
  const response = await apiClient.get('files/list/');
  const filesArray = Array.isArray(response.data) ? response.data : (response.data.results || []);
  return filesArray.map(mapFileFromApi);
};

export const fetchDeletedFiles = async () => {
  const response = await apiClient.get('trash/');
  const filesArray = Array.isArray(response.data) ? response.data : (response.data.results || []);
  return filesArray.map(mapFileFromApi);
};

export const restoreFile = async (fileId) => {
  const response = await apiClient.post(`files/restore/${fileId}/`);
  return response.data;
};

export const deleteFilePermanently = async (fileId) => {
  const response = await apiClient.delete(`trash/delete/${fileId}/`);
  return response.data;
};

/**
 * Fetches a single file's details by its ID.
 */
export const fetchFileDetail = async (fileId) => {
  const response = await apiClient.get(`files/view/${fileId}/`);
  return mapFileFromApi(response.data);
};

/**
 * Uploads a single file to the backend.
 * @param {File} file - The File object from the browser.
 * @param {string} description - Optional display name / description for the file.
 */
export const uploadFile = async (file, description = '') => {
  const formData = new FormData();
  formData.append('file', file);
  if (description) {
    formData.append('description', description);
  }

  const response = await apiClient.post('files/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Uploads multiple files, each with an optional description.
 * @param {File[]} files - Array of File objects.
 * @param {Object} descriptions - Map of index -> description string.
 * @returns {Promise<{ successes: Array, failures: Array }>}
 */
export const uploadFiles = async (files, descriptions = {}) => {
  const successes = [];
  const failures = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await uploadFile(files[i], descriptions[i] || '');
      successes.push({ file: files[i].description, data: result });
    } catch (error) {
      failures.push({ file: files[i].description, error: error.response?.data || error.message });
    }
  }

  return { successes, failures };
};

/**
 * Deletes a file by its ID.
 * @param {number|string} fileId
 */
export const deleteFile = async (fileId) => {
  const response = await apiClient.delete(`files/delete/${fileId}/`);
  return response.data;
};

/**
 * Renames / updates a file's metadata.
 * @param {number|string} fileId
 * @param {Object} data - { display_name, description, ... }
 */
export const updateFile = async (fileId, data) => {
  const response = await apiClient.put(`files/update/${fileId}/`, data);
  return response.data;
};
/**
 * Toggles a file's favorite status.
 * @param {string} fileId
 */
export const toggleFileFavorite = async (fileId) => {
  const response = await apiClient.patch(`files/favorite/${fileId}/`);
  return response.data;
};
/**
 * Fetches all files and returns them sorted by upload date (newest first).
 */
export const fetchRecentFiles = async () => {
  const files = await fetchFiles();
  return files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
};

/**
 * Fetches upload history and stats for a specific month and year.
 * Returns { history, month_stats, global_stats }
 * @param {number} year 
 * @param {number} month 
 */
export const fetchUploadHistory = async (year, month) => {
  const response = await apiClient.get('files/history/', {
    params: { year, month }
  });
  return response.data;
};
