import React from 'react';

const UploadConfirmModal = ({ files, isOpen, onClose, onRemove, onConfirm }) => {
  if (!isOpen) return null;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-10 py-8 flex justify-between items-center border-b border-gray-50 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Confirm Upload</h3>
            <p className="text-xs text-gray-400 font-medium">Review the {files.length} file(s) you're about to encrypt.</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-red-500 transition">
            <i className="fas fa-times-circle text-2xl"></i>
          </button>
        </div>
        
        <div className="p-10">
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2 mb-8 custom-scrollbar">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-500"><i className="fas fa-file"></i></div>
                  <div className="max-w-[280px]">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-tight">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <button onClick={() => onRemove(index)} className="text-gray-300 hover:text-red-500 transition px-2">
                  <i className="fas fa-trash-alt text-sm"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8 px-6 bg-indigo-50/50 dark:bg-indigo-900/20 py-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Selection</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{files.length} file(s)</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-indigo-400">Payload Size</p>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formatBytes(totalSize)}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button onClick={onClose} className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition">
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-[2] gradient-bg text-white font-bold py-4 rounded-2xl shadow-xl hover:opacity-90 transition active:scale-95 flex items-center justify-center"
            >
              <i className="fas fa-shield-alt mr-2"></i> Secure & Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadConfirmModal;