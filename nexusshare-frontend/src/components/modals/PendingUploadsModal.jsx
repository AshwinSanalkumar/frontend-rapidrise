import React, { useEffect } from 'react';

const PendingUploadsModal = ({ 
  isOpen, 
  onClose, 
  uploads, 
  onSelectFile, 
  onCancelUpload 
}) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pending Uploads</h3>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest">Action Required to Resume</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-rose-500 transition cursor-pointer">
            <i className="fas fa-times-circle text-2xl"></i>
          </button>
        </div>

        <div className="p-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            The following files were partially saved in your vault. Please re-select the original file from your computer to finish the transmission.
          </p>
          
          <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {uploads.map((upload) => {
              const progress = Math.round((upload.current_size / upload.total_size) * 100);
              const currentMB = (upload.current_size / (1024 * 1024)).toFixed(1);
              const totalMB = (upload.total_size / (1024 * 1024)).toFixed(1);
              
              return (
                <div 
                  key={upload.upload_id} 
                  className="p-5 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate">
                        {upload.filename}
                      </h4>
                      <div className="flex items-center mt-1.5 space-x-2">
                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tight bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">
                          {progress}% SAVED
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {currentMB}MB / {totalMB}MB
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      <button 
                        onClick={() => onCancelUpload(upload.upload_id)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all cursor-pointer"
                        title="Discard Draft"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                      <button 
                        onClick={() => onSelectFile(upload.filename)}
                        className="px-5 py-2.5 gradient-bg text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Resume
                      </button>
                    </div>
                  </div>
                  
                  {/* Visual Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800">
                    <div 
                      className="h-full gradient-bg transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
             <div className="flex items-center text-gray-400 text-[10px] font-bold">
                <i className="fas fa-shield-halved mr-2 text-indigo-500"></i>
                SECURE STATE PERSISTED
             </div>
             <button 
                onClick={onClose}
                className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                Close Window
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingUploadsModal;
