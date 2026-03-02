import React from 'react';

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
      <div className="glass dark:bg-gray-800 w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden modal-animate border border-white/20">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
            <i className="fas fa-exclamation-triangle text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete File?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            This action cannot be undone. Are you sure you want to remove this file permanently?
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              onClick={onDelete} 
              className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;