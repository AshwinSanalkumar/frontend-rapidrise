import React from 'react';

const BulkActionsBar = ({ 
  selectedCount, 
  onShare, 
  onDelete, 
  onClear 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-6 py-4 rounded-full shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center space-x-6 animate-in slide-in-from-bottom-5">
      <div className="flex items-center space-x-3 text-sm font-bold text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 pr-6">
        <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center text-xs">
          {selectedCount}
        </span>
        <span>Files Selected</span>
      </div>
      
      <button onClick={onShare} className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">
        <i className="fas fa-share-alt mr-2 text-indigo-500"></i> Share All
      </button>
      
      <button onClick={onDelete} className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer">
        <i className="fas fa-trash-alt mr-2 text-rose-500"></i> Delete All
      </button>
      
      <button onClick={onClear} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition ml-2 cursor-pointer">
        <i className="fas fa-times-circle text-lg"></i>
      </button>
    </div>
  );
};

export default BulkActionsBar;
