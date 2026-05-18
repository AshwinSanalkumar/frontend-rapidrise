import React, { useState, useEffect } from 'react';
import { chunkedUploadService } from '../../services/chunkedUploadService';
import DeleteModal from '../modals/DeleteModal';

const GlobalUploadProgress = () => {
  const [uploads, setUploads] = useState({});
  const [cancelTarget, setCancelTarget] = useState(null); // { id, backendId, name }

  useEffect(() => {
    const handleProgress = (e) => {
      const { id, name, progress, status, isPauseUpdate } = e.detail;
      
      setUploads(prev => {
        const updated = { ...prev };
        const existing = updated[id];

        if (status === 'removed') {
          delete updated[id];
        } else if (isPauseUpdate) {
            updated[id] = { ...existing, status };
        } else {
            // Don't overwrite 'paused' or 'canceled' status with standard 'uploading' or 'completed' updates
            const isFinished = existing?.status === 'canceled' || existing?.status === 'completed';
            const finalStatus = (isFinished && (status === 'uploading' || status === 'completed')) 
                ? existing.status 
                : (existing?.status === 'paused' && status === 'uploading') 
                    ? 'paused' 
                    : status;
            
            updated[id] = { 
                name, 
                progress, 
                status: finalStatus,
                backendId: e.detail.backendId || existing?.backendId
            };
        }
        return updated;
      });

      if (status === 'completed' || status === 'canceled') {
        setTimeout(() => {
          setUploads(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }, 2500);
      }
    };

    window.addEventListener('upload-progress', handleProgress);
    return () => window.removeEventListener('upload-progress', handleProgress);
  }, []);

  const handleConfirmCancel = () => {
    if (cancelTarget) {
      chunkedUploadService.cancelUpload(cancelTarget.id, cancelTarget.backendId);
      setCancelTarget(null);
    }
  };

  const uploadList = Object.entries(uploads);
  if (uploadList.length === 0) return null;

  return (
    <>
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[999] w-full max-w-sm px-4 pointer-events-none">
      <div className="flex flex-col gap-3">
        {uploadList.map(([id, upload]) => (
          <div 
            key={id} 
            className="flex items-center space-x-3 animate-in fade-in slide-in-from-top-10 duration-500 pointer-events-none mb-2"
          >
            {/* Main Uploader Pill (Icon + Status + Progress) */}
            <div className="flex-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-full shadow-xl border border-white/20 dark:border-gray-700/50 pl-1.5 pr-4 py-2 pointer-events-auto flex items-center space-x-3 min-w-0">
              {/* Icon Section */}
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                {upload.status === 'completed' ? (
                  <div className="text-emerald-500 animate-in zoom-in duration-500">
                    <i className="fas fa-check-circle text-lg"></i>
                  </div>
                ) : upload.status === 'canceled' ? (
                  <div className="text-rose-500 animate-in zoom-in duration-500">
                    <i className="fas fa-times-circle text-lg"></i>
                  </div>
                ) : (
                  <div className="text-indigo-500 relative">
                      <i className="fas fa-cloud-upload-alt text-sm"></i>
                      <div className="absolute -inset-1 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-gray-800 dark:text-gray-100 truncate pr-4">
                    {upload.status === 'completed' ? 'Success' : upload.status === 'canceled' ? 'Cancelled' : upload.name}
                  </span>
                  <span className="text-[10px] font-black text-indigo-500 tabular-nums">
                    {upload.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${
                      upload.status === 'completed' ? 'bg-emerald-500' : 
                      upload.status === 'canceled' ? 'bg-rose-500' : 'gradient-bg'
                    }`}
                    style={{ width: `${upload.status === 'canceled' ? 100 : upload.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Controls Circle (Pause + Cancel) */}
            {upload.status !== 'completed' && upload.status !== 'canceled' && (
              <div className="flex items-center space-x-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-full shadow-xl border border-white/20 dark:border-gray-700/50 p-1.5 pointer-events-auto">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (upload.status === 'paused') {
                      chunkedUploadService.resumeUpload(id);
                    } else {
                      chunkedUploadService.pauseUpload(id);
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                  <i className={`fas fa-${upload.status === 'paused' ? 'play' : 'pause'} text-[10px]`}></i>
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCancelTarget({ id, backendId: upload.backendId, name: upload.name });
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                  <i className="fas fa-times text-[10px]"></i>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    
    <DeleteModal 
      isOpen={!!cancelTarget}
      onClose={() => setCancelTarget(null)}
      onDelete={handleConfirmCancel}
      title="Cancel Upload?"
      message={`Are you sure you want to cancel the upload for "${cancelTarget?.name}"? All partially uploaded data will be removed.`}
      confirmText="Yes, Cancel"
    />
    </>
  );
};

export default GlobalUploadProgress;
