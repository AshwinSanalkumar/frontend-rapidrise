import React, { useEffect } from 'react';

const Pagination = ({ currentPage, totalFiles, filesPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalFiles / filesPerPage);
  
  // Safety check: if total pages decrease, reset to last available page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [totalPages, currentPage, onPageChange]);

  const startFile = totalFiles === 0 ? 0 : (currentPage - 1) * filesPerPage + 1;
  const endFile = Math.min(currentPage * filesPerPage, totalFiles);

  const handlePageClick = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Better UX
  };

  if (totalPages <= 1) return null; // Don't show if there's only one page

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 px-8 py-5 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm animate-in fade-in slide-in-from-bottom-2">
      <div className="text-sm text-gray-400 font-medium mb-4 sm:mb-0">
        Showing <span className="text-gray-900 dark:text-white font-bold">{startFile}-{endFile}</span> of <span className="text-gray-900 dark:text-white font-bold">{totalFiles}</span> files
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
        >
          <i className="fas fa-chevron-left text-[10px]"></i>
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 active:scale-90 ${
              currentPage === index + 1 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button 
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700 text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition disabled:opacity-30 active:scale-90"
        >
          <i className="fas fa-chevron-right text-[10px]"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;