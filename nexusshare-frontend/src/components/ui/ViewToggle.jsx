import React from 'react';

const ViewToggle = ({ view, setView }) => {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
      <button 
        onClick={() => setView('grid')} 
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
          view === 'grid' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm scale-100' 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 scale-95'
        }`}
      >
        <i className="fas fa-th-large"></i>
      </button>
      
      <button 
        onClick={() => setView('list')} 
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
          view === 'list' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm scale-100' 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 scale-95'
        }`}
      >
        <i className="fas fa-list"></i>
      </button>
    </div>
  );
};

export default ViewToggle;