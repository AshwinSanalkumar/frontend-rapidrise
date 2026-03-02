import React from 'react';

const Pagination = ({ currentPage, totalFiles, filesPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalFiles / filesPerPage);
  const startFile = (currentPage - 1) * filesPerPage + 1;
  const endFile = Math.min(currentPage * filesPerPage, totalFiles);

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 px-8 py-5 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="text-sm text-gray-400 font-medium mb-4 sm:mb-0">
        Showing <span className="text-gray-900 dark:text-white font-bold">{startFile}-{endFile}</span> of <span className="text-gray-900 dark:text-white font-bold">{totalFiles}</span> files
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-chevron-left text-xs"></i>
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition ${
              currentPage === index + 1 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
        >
          <i className="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;