import React, { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useToast } from '../common/ToastContent';
import { fetchMe } from '../../services/authService';
import { useEffect } from 'react';
import UploadConfirmModal from '../modals/UploadConfirmModel';
import PendingUploadsModal from '../modals/PendingUploadsModal';

import { uploadFiles } from '../../services/fileService';
import chunkedUploadService from '../../services/chunkedUploadService';
import DeleteModal from '../modals/DeleteModal';

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `sidebar-link flex items-center px-4 py-2.5 transition rounded-xl ${isActive
        ? 'active-link font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-r-4 border-indigo-600'
        : 'text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800'
      }`
    }
  >
    <i className={`fas ${icon} mr-3 text-lg w-6 text-center`}></i>
    <span className="flex-1">{label}</span>
  </NavLink>
);

const Sidebar = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States to handle the modal and staging
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [activeUploads, setActiveUploads] = useState([]);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [uploadToDelete, setUploadToDelete] = useState(null);
  const [isDiscarding, setIsDiscarding] = useState(false);

  useEffect(() => {
    loadUserData();
    
    // Refresh storage stats when a file is uploaded or storage changes (e.g. trash emptied)
    const handleRefresh = () => {
      loadUserData();
      loadActiveUploads();
    };
    window.addEventListener('file-uploaded', handleRefresh);
    window.addEventListener('storage-updated', handleRefresh);
    loadActiveUploads();
    return () => {
      window.removeEventListener('file-uploaded', handleRefresh);
      window.removeEventListener('storage-updated', handleRefresh);
    };
  }, []);

  const loadUserData = async () => {
    try {
      const data = await fetchMe();
      setUserData(data);
    } catch (error) {
      console.error("Failed to load storage data in Sidebar:", error);
    }
  };

  const loadActiveUploads = async () => {
    try {
      const data = await chunkedUploadService.getActiveUploads();
      setActiveUploads(data);
    } catch (error) {
      console.error("Failed to load active uploads:", error);
    }
  };

  const cancelPendingUpload = (backendId) => {
    setUploadToDelete(backendId);
    setIsDeleteModalOpen(true);
  };

  const confirmDiscardPending = async () => {
    if (!uploadToDelete) return;
    
    setIsDiscarding(true);
    try {
      await chunkedUploadService.cancelUpload(null, uploadToDelete);
      showToast("Pending upload discarded.", "success");
      loadActiveUploads();
    } catch (error) {
      showToast("Failed to discard upload.", "error");
    } finally {
      setIsDiscarding(false);
      setIsDeleteModalOpen(false);
      setUploadToDelete(null);
    }
  };

  const consumed = userData?.consumed_storage || 0;
  const total = userData?.storage_limit_bytes || 1024 * 1024 * 1024;
  const percentage = Math.min(100, Math.round((consumed / total) * 100));
  
  const consumedGB = (consumed / (1024 * 1024 )).toFixed(2);
  const totalGB = (total / (1024 * 1024 * 1024)).toFixed(0);


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setStagedFiles(files);
      setIsModalOpen(true);
    }
    event.target.value = null;
  };


  const removeStagedFile = (index) => {
    const updated = stagedFiles.filter((_, i) => i !== index);
    setStagedFiles(updated);
    if (updated.length === 0) setIsModalOpen(false);
  };


  const handleConfirmUpload = async (filesToUpload, descriptions) => {
    setIsUploading(true);
    setIsModalOpen(false); // Close immediately for non-blocking feel

    const uploadId = Math.random().toString(36).substr(2, 9);
    const fileName = filesToUpload.length === 1 ? filesToUpload[0].name : `${filesToUpload.length} files`;

    const dispatchProgress = (progress, status = 'uploading', backendId = null) => {
      window.dispatchEvent(new CustomEvent('upload-progress', {
        detail: { id: uploadId, name: fileName, progress, status, backendId }
      }));
    };

    dispatchProgress(0);

    try {
      const { successes, failures } = await uploadFiles(filesToUpload, { ...descriptions, id: uploadId }, (index, percent, backendId) => {
        // Aggregate progress for multiple files
        const aggregatePercent = Math.round(((index + (percent / 100)) / filesToUpload.length) * 100);
        dispatchProgress(aggregatePercent, 'uploading', backendId);
      });

      if (successes.length > 0) {
        dispatchProgress(100, 'completed');
        window.dispatchEvent(new CustomEvent('file-uploaded'));
        // Optional: navigate('/files');
      }

      if (failures.length > 0) {
        const firstError = failures[0].error;
        let errorMessage = typeof firstError === 'string' 
          ? firstError 
          : (firstError.error || firstError.detail || `${failures.length} file(s) failed to upload.`);
        
        if (errorMessage.includes('Storage limit exceeded')) {
          errorMessage = "Vault Storage Full! Please clear your trash or upgrade to continue.";
        }
        
        showToast(errorMessage, 'error');
        if (successes.length === 0) {
           dispatchProgress(0, 'removed');
        }
      }

      setStagedFiles([]);
    } catch (error) {
      showToast('Upload failed. Please try again.', 'error');
      dispatchProgress(0, 'removed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-transform duration-300 transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:h-[calc(100vh-73px)] lg:w-64`}
      >

        <div className="px-6 py-6 border-b border-gray-50 dark:border-gray-800 lg:border-none">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <span className="text-xl font-black text-gray-900 dark:text-white">Menu</span>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <button
            onClick={() => {
              fileInputRef.current.click();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full gradient-bg text-white font-bold py-3 rounded-2xl shadow-lg hover:shadow-indigo-200 transition flex items-center justify-center group active:scale-95"
          >
            <i className="fas fa-plus mr-2 group-hover:rotate-90 transition-transform"></i>
            New Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          <nav className="space-y-1 py-4">
            <div onClick={() => window.innerWidth < 1024 && onClose()}>
              <SidebarLink to="/dashboard" icon=" fa-house" label="Dashboard" />
            </div>
            <div onClick={() => window.innerWidth < 1024 && onClose()}>
              <SidebarLink to="/files" icon="fa-folder-open" label="My Files" />
            </div>
            <div onClick={() => window.innerWidth < 1024 && onClose()}>
              <SidebarLink to="/shared" icon="fa-share-alt" label="Shared Links" />
            </div>
            <div onClick={() => window.innerWidth < 1024 && onClose()}>
              <SidebarLink to="/Favorites" icon="fa-heart" label="Favorites" />
            </div>
            <div onClick={() => window.innerWidth < 1024 && onClose()}>
              <SidebarLink to="/send-request" icon="fa-paper-plane" label="Request Files" />
            </div>
            <div onClick={() => window.innerWidth < 1024 && onClose()}>
              <SidebarLink to="/workstation" icon="fa-laptop" label="Work Station" />
            </div>
            <div className="pt-6">
              <p className="px-4 text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-2">Storage</p>
              <div className="border-b border-gray-100 dark:border-gray-800 mx-3 mb-2"></div>

              <div onClick={() => window.innerWidth < 1024 && onClose()}>
                <SidebarLink to="/assets" icon="fa-folder-open" label="File Explorer" />
              </div>
              <div onClick={() => window.innerWidth < 1024 && onClose()}>
                <SidebarLink to="/recents" icon="fa-history" label="Recent" />
              </div>
              <div onClick={() => window.innerWidth < 1024 && onClose()}>
                <SidebarLink to="/history" icon="fa-calendar-days" label="History" />
              </div>
            </div>
            <div className="pt-6">
              <p className="px-4 text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-2">System</p>
              <div className="border-b border-gray-100 dark:border-gray-800 mx-3 mb-2"></div>
              <div onClick={() => window.innerWidth < 1024 && onClose()}>
                <SidebarLink to="/storage" icon="fa-compact-disc" label="Manage Storage" />
              </div>
              <div onClick={() => window.innerWidth < 1024 && onClose()}>
                <SidebarLink to="/analytics" icon="fa-chart-pie" label="Analytics" />
              </div>
              <div onClick={() => window.innerWidth < 1024 && onClose()}>
                <SidebarLink to="/bin" icon="fa-trash-alt" label="Bin" />
              </div>
            </div>
          </nav>
        </div>

        {/* Pending Uploads Alert */}
        {activeUploads.length > 0 && (
          <div className="px-6 mb-2">
            <div 
              className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-3 flex items-center justify-between group cursor-pointer" 
              onClick={() => setIsPendingModalOpen(true)}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-2"></div>
                <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                  {activeUploads.length} Pending Assets
                </span>
              </div>
              <i className="fas fa-arrow-right text-[10px] text-amber-500 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
        )}

        {/* Storage Stats Indicator */}
        <div className="p-6 border-t border-gray-50 dark:border-gray-800/50">
          <Link
            to="/storage"
            onClick={() => window.innerWidth < 1024 && onClose()}
            className="block"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-3">Cloud Storage</p>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-bg transition-all duration-1000" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 font-medium">
                {consumedGB} MB of {totalGB} GB
              </p>
            </div>
          </Link>
        </div>
      </aside>

      {/* --- THE MODAL (Triggered by Button selection) --- */}
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
        onRemove={removeStagedFile}
        onConfirm={handleConfirmUpload}
      />

      <PendingUploadsModal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        uploads={activeUploads}
        onCancelUpload={cancelPendingUpload}
        onSelectFile={(filename) => {
          setIsPendingModalOpen(false);
          showToast(`Please select "${filename}" to resume.`, "info");
          fileInputRef.current.click();
        }}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUploadToDelete(null);
        }}
        onDelete={confirmDiscardPending}
        title="Discard Pending Upload"
        message="Are you sure you want to discard this incomplete upload? This will permanently remove the partial data from our servers."
        isLoading={isDiscarding}
      />
    </>
  );
};

export default Sidebar;