import React from 'react';

const FileSpecCard = ({ file, onShare }) => {
  return (
    <div className="w-full xl:w-96 space-y-6">
      {/* Specs Section */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-6">File Specs</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Size</span>
            <span className="text-gray-800 dark:text-white font-bold text-sm">{file.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Extension</span>
            <span className="text-gray-800 dark:text-white font-bold text-sm">{file.extension}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Status</span>
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 text-[10px] font-bold rounded-md">
              {file.status}
            </span>
          </div>
        </div>
        <button 
          onClick={onShare}
          className="w-full mt-8 gradient-bg text-white font-bold py-4 rounded-2xl shadow-lg hover:opacity-90 transition"
        >
          Share File
        </button>
      </div>

      {/* Shared With Section */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-6">Shared With</h2>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] font-bold text-indigo-600">JD</div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">John Doe</p>
                <p className="text-[10px] text-gray-400">Can view</p>
              </div>
            </div>
            <i className="fas fa-ellipsis-h text-gray-300"></i>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-[10px] font-bold text-emerald-600">SM</div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">Sarah Miller</p>
                <p className="text-[10px] text-gray-400">Can edit</p>
              </div>
            </div>
            <i className="fas fa-ellipsis-h text-gray-300"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSpecCard;