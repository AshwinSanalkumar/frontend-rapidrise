import React from 'react';

const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onDelete, 
  title = "Delete File?", 
  message = "This action cannot be undone. Are you sure you want to remove this permanently?",
  confirmText = "Delete",
  icon = "fas fa-exclamation-triangle",
  variant = "danger" // danger (red) or warning (indigo/amber)
}) => {
  if (!isOpen) return null;

  const colorClasses = variant === "danger" 
    ? "bg-red-50 dark:bg-red-900/30 text-red-500" 
    : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500";

  const btnClasses = variant === "danger"
    ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
    : "gradient-bg hover:opacity-90 shadow-indigo-500/20";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
        <div className="p-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colorClasses}`}>
            <i className={`${icon} text-2xl`}></i>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 px-2 font-medium">
            {message}
          </p>

          <div className="flex space-x-3">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-bold rounded-xl transition hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              onClick={onDelete} 
              className={`flex-1 px-4 py-3 text-white font-bold rounded-xl shadow-lg transition active:scale-95 ${btnClasses}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;