import React, { useState, useEffect } from 'react';

const GlobalUploadProgress = () => {
  const [uploads, setUploads] = useState({});

  useEffect(() => {
    const handleProgress = (e) => {
      const { id, name, progress, status } = e.detail;
      
      setUploads(prev => {
        const updated = { ...prev };
        if (status === 'removed') {
          delete updated[id];
        } else {
          updated[id] = { name, progress, status };
        }
        return updated;
      });

      if (status === 'completed') {
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

  const uploadList = Object.entries(uploads);
  if (uploadList.length === 0) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[999] w-full max-w-sm px-4 pointer-events-none">
      <div className="flex flex-col gap-3">
        {uploadList.map(([id, upload]) => (
          <div 
            key={id} 
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 dark:border-gray-700/50 p-4 flex items-center space-x-4 animate-in fade-in slide-in-from-top-8 duration-500 pointer-events-auto"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              {upload.status === 'completed' ? (
                <div className="text-emerald-500 animate-in zoom-in duration-500">
                  <i className="fas fa-check-circle text-xl"></i>
                </div>
              ) : (
                <div className="text-indigo-500 relative">
                    <i className="fas fa-cloud-upload-alt text-lg"></i>
                    <div className="absolute -inset-1 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate pr-4">
                  {upload.status === 'completed' ? 'Upload Complete' : upload.name}
                </span>
                <span className="text-[10px] font-black text-indigo-500 tabular-nums">
                  {upload.progress}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out ${
                    upload.status === 'completed' ? 'bg-emerald-500' : 'gradient-bg'
                  }`}
                  style={{ width: `${upload.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalUploadProgress;
