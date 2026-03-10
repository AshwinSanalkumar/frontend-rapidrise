import React from 'react';

const DeleteFolderModal = ({ isOpen, folderName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onCancel}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-white/20 transform animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-500 mb-6 mx-auto">
          <i className="fas fa-trash-alt text-2xl"></i>
        </div>

        <h3 className="text-xl font-black text-gray-900 dark:text-white text-center mb-2">
          Delete Folder?
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm font-medium mb-6 leading-relaxed">
          Are you sure you want to remove <span className="text-gray-900 dark:text-white font-bold">"{folderName}"</span>? 
          <br />
          <span className="text-indigo-500 font-bold mt-2 block">Note: The files inside this folder will not be deleted.</span>
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onCancel}
            className="py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderModal;