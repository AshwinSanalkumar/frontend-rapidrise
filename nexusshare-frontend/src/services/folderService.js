import apiClient from '../api/apiClient';
import { mapFileFromApi } from './fileService';

/**
 * Maps the backend asset/folder object to the frontend's UI format.
 */
export const mapFolderFromApi = (apiFolder) => {
  const mapped = {
    id: apiFolder.id,
    name: apiFolder.name,
  };

  if (typeof apiFolder.files_count !== 'undefined') {
    mapped.filesCount = apiFolder.files_count;
  }
  if (apiFolder.total_size) {
    mapped.size = apiFolder.total_size;
  }
  if (apiFolder.color_class) {
    mapped.color = apiFolder.color_class;
  }
  else if (apiFolder.directory_path) {
    mapped.directoryPath = apiFolder.directory_path;
  } 

  return mapped;
};

/**
 * Fetches all folders (assets) for the authenticated user.
 */
export const fetchFolders = async (page = 1) => {
  const response = await apiClient.get('assets/list/', {
    params: { page }
  });
  
  if (response.data.results) {
    return {
      folders: response.data.results.map(mapFolderFromApi),
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous
    };
  }
  
  const foldersArray = Array.isArray(response.data) ? response.data : [];
  return { folders: foldersArray.map(mapFolderFromApi), count: foldersArray.length };
};

/**
 * Creates a new folder.
 */
export const createFolder = async (name) => {
  const response = await apiClient.post('assets/create/', { name });
  return mapFolderFromApi(response.data);
};

/**
 * Renames an existing folder.
 */
export const renameFolder = async (id, name) => {
  const response = await apiClient.put(`assets/update/${id}/`, { name });
  return mapFolderFromApi(response.data);
};

/**
 * Deletes a folder by its ID.
 */
export const deleteFolder = async (id) => {
  const response = await apiClient.delete(`assets/delete/${id}/`);
  return response.data;
};

/**
 * Fetches specific folder data including its files.
 */
export const fetchFolderDetails = async (id, page = 1) => {
  const response = await apiClient.get(`assets/view/${id}/`, {
    params: { page }
  });
  const data = response.data;
  
  // Handle paginated response
  if (data.results) {
    return {
      ...mapFolderFromApi(data.results),
      files: (data.results.files || []).map(mapFileFromApi),
      count: data.count,
      next: data.next,
      previous: data.previous
    };
  }

  return {
    ...mapFolderFromApi(data),
    files: (data.files || []).map(mapFileFromApi),
    count: (data.files || []).length
  };
};

/**
 * Uploads files directly into a specific folder.
 */
export const uploadFilesToFolder = async (folderId, files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('files', file);
  });

  const response = await apiClient.post(`assets/view/${folderId}/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Links existing cloud/vault files to a specific folder.
 * @param {string|number} folderId
 * @param {Array<string|number>} fileIds
 */
export const importFilesToFolder = async (folderId, fileIds) => {
  const response = await apiClient.post(`assets/view/${folderId}/upload/`, {
    file_ids: fileIds
  });
  return response.data;
};

/**
 * Unlinks a file from a specific folder (Many-to-Many removal).
 * @param {string|number} folderId
 * @param {string|number} fileId
 */
export const removeFileFromFolder = async (folderId, fileId) => {
  const response = await apiClient.delete(`assets/view/${folderId}/files/${fileId}/remove/`);
  return response.data;
};
