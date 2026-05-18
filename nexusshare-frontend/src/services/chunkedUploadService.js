import apiClient from '../api/apiClient';

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks

const pausedStates = new Map();
const abortControllers = new Map();

export const chunkedUploadService = {
  /**
   * Pause an ongoing upload.
   */
  pauseUpload: (uploadId) => {
    pausedStates.set(uploadId, true);
    window.dispatchEvent(new CustomEvent('upload-progress', {
      detail: { id: uploadId, status: 'paused', isPauseUpdate: true }
    }));
  },

  /**
   * Resume an ongoing upload.
   */
  resumeUpload: (uploadId) => {
    pausedStates.set(uploadId, false);
    window.dispatchEvent(new CustomEvent('upload-progress', {
      detail: { id: uploadId, status: 'uploading', isPauseUpdate: true }
    }));
  },

  /**
   * Cancel an ongoing upload.
   */
  cancelUpload: async (uploadId, backendUploadId = null) => {
    if (uploadId) {
      pausedStates.set(uploadId, 'canceled');
      // Abort the ongoing HTTP request immediately
      const controller = abortControllers.get(uploadId);
      if (controller) {
        controller.abort();
        abortControllers.delete(uploadId);
      }
    }
    if (backendUploadId) {
      try {
        await apiClient.delete(`files/chunked/status/${backendUploadId}/`);
      } catch (e) {
        console.error('Failed to cancel on backend:', e);
      }
    }
    window.dispatchEvent(new CustomEvent('upload-progress', {
      detail: { id: uploadId, status: 'canceled' }
    }));
  },

  /**
   * Internal helper to wait if paused.
   */
  _waitIfPaused: async (uploadId) => {
    if (pausedStates.get(uploadId) === 'canceled') {
        throw new Error('Upload canceled');
    }
    while (pausedStates.get(uploadId) === true) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (pausedStates.get(uploadId) === 'canceled') {
        throw new Error('Upload canceled');
      }
    }
  },

  /**
   * Initializes a chunked upload.
   */
  initUpload: async (filename, totalSize) => {
    const response = await apiClient.post('files/chunked/init/', {
      filename,
      total_size: totalSize
    });
    return response.data;
  },

  /**
   * Uploads a single chunk.
   */
  uploadChunk: async (uploadId, offset, chunk, trackingId) => {
    const formData = new FormData();
    formData.append('upload_id', uploadId);
    formData.append('offset', offset);
    formData.append('chunk', chunk);

    // Create abort controller for this specific request
    const controller = new AbortController();
    if (trackingId) abortControllers.set(trackingId, controller);

    try {
      const response = await apiClient.post('files/chunked/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: controller.signal
      });
      return response.data; 
    } finally {
      if (trackingId) abortControllers.delete(trackingId);
    }
  },

  /**
   * Finalizes the chunked upload.
   */
  completeUpload: async (uploadId, displayName = '', description = '') => {
    const response = await apiClient.post('files/chunked/complete/', {
      upload_id: uploadId,
      display_name: displayName,
      description: description
    });
    return response.data;
  },

  /**
   * Checks for existing active uploads for the user.
   */
  getActiveUploads: async () => {
    const response = await apiClient.get('files/chunked/active/');
    return response.data;
  },

  /**
   * Main function to handle the full chunked upload process.
   */
  uploadFile: async (file, onProgress, customId = null) => {
    const totalSize = file.size;
    let currentUploadId = null;
    let startOffset = 0;
    const trackingId = customId || file.name; // Use UI id if provided

    // Check for existing active upload to resume
    try {
      const activeUploads = await chunkedUploadService.getActiveUploads();
      const existing = activeUploads.find(u => u.filename === file.name && u.total_size === totalSize);
      
      if (existing) {
        currentUploadId = existing.upload_id;
        startOffset = existing.current_size;
      } else {
        const initData = await chunkedUploadService.initUpload(file.name, totalSize);
        currentUploadId = initData.upload_id;
      }
    } catch (error) {
      const initData = await chunkedUploadService.initUpload(file.name, totalSize);
      currentUploadId = initData.upload_id;
    }

    // 2. Upload chunks
    try {
      while (startOffset < totalSize) {
        // Check if paused or canceled
        await chunkedUploadService._waitIfPaused(trackingId);

        const endOffset = Math.min(startOffset + CHUNK_SIZE, totalSize);
        const chunk = file.slice(startOffset, endOffset);
        
        // Retry logic for each chunk
        let chunkRetries = 3;
        let chunkSuccess = false;
        let lastError = null;

        while (chunkRetries > 0 && !chunkSuccess) {
          try {
            await chunkedUploadService.uploadChunk(currentUploadId, startOffset, chunk, trackingId);
            chunkSuccess = true;
          } catch (error) {
            // Don't retry if it was explicitly aborted/canceled
            if (error.name === 'AbortError' || pausedStates.get(trackingId) === 'canceled') {
               throw new Error('Upload canceled');
            }

            chunkRetries--;
            lastError = error;
            if (chunkRetries > 0) {
              console.warn(`Chunk upload failed, retrying... (${3 - chunkRetries}/3)`);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
            }
          }
        }

        if (!chunkSuccess) throw lastError;
        
        startOffset = endOffset;
        if (onProgress) {
          onProgress(Number(((startOffset / totalSize) * 100).toFixed(1)), currentUploadId);
        }
      }
    } catch (e) {
      if (e.message === 'Upload canceled') {
        console.log('Upload canceled locally');
        return; // Exit silently
      }
      throw e;
    }

    // 3. Complete
    const result = await chunkedUploadService.completeUpload(currentUploadId);
    return result;
  }
};

export default chunkedUploadService;
