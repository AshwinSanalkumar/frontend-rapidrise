import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadConfirmModal from '../modals/UploadConfirmModel';
import { uploadFiles } from '../../services/fileService';
import { useToast } from '../common/ToastContent';

const GlobalFileDrop = ({ children }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isDragActive, setIsDragActive] = useState(false);
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;
      if (e.dataTransfer.types.includes('Files')) {
        setIsDragActive(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragActive(false);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      dragCounter = 0;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        setStagedFiles(files);
        setIsModalOpen(true);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleConfirmUpload = async (filesToUpload, descriptions) => {
    setIsUploading(true);
    try {
      const { successes, failures } = await uploadFiles(filesToUpload, descriptions);
      
      if (successes.length > 0) {
        showToast(`${successes.length} file(s) uploaded successfully!`, 'success');
        // Notify other components to refresh
        window.dispatchEvent(new CustomEvent('file-uploaded'));
        // Redirect if not already on /files (consistent with previous behavior)
        navigate('/files');
      }
      
      if (failures.length > 0) {
        showToast(`${failures.length} file(s) failed to upload.`, 'error');
      }

      setIsModalOpen(false);
      setStagedFiles([]);
    } catch (error) {
      showToast('Upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {isDragActive && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 pointer-events-none">
          <div className="absolute inset-0 bg-indigo-600/5 dark:bg-indigo-600/10 backdrop-blur-md transition-all duration-300"></div>
          
          <div className="relative bg-white dark:bg-gray-800 p-12 md:p-16 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(79,70,229,0.25)] border-2 border-indigo-500/30 dark:border-indigo-400/20 animate-in zoom-in duration-300 flex flex-col items-center max-w-lg w-full text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-[2.5rem] animate-ping opacity-20"></div>
              <i className="fas fa-cloud-upload-alt text-5xl text-indigo-500 animate-bounce"></i>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Ready to Upload?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium leading-relaxed">
              Drop your files here to upload them to NexusShare
            </p>

            {/* <div className="mt-10 flex items-center gap-3 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <i className="fas fa-shield-alt text-indigo-500"></i>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Enterprise Cryptography Active</span>
            </div> */}
          </div>
        </div>
      )}

      {children}

      <UploadConfirmModal
        isOpen={isModalOpen}
        files={stagedFiles}
        isUploading={isUploading}
        onClose={() => {
          if (!isUploading) {
            setIsModalOpen(false);
            setStagedFiles([]);
          }
        }}
        onRemove={(index) => {
          const updated = stagedFiles.filter((_, i) => i !== index);
          setStagedFiles(updated);
          if (updated.length === 0) setIsModalOpen(false);
        }}
        onConfirm={handleConfirmUpload}
      />
    </div>
  );
};

export default GlobalFileDrop;
