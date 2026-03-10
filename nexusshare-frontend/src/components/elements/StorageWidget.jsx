import React from 'react';

const StorageWidget = () => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
    <h3 className="font-bold text-gray-800 dark:text-white mb-8">Storage Consumption</h3>
    <div className="storage-circle-container">
      <svg className="circle-svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="storageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <circle className="circle-bg" cx="80" cy="80" r="70" />
        <circle className="circle-progress" cx="80" cy="80" r="70" style={{ strokeDashoffset: 154 }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-gray-800 dark:text-white">65%</span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Used</span>
      </div>
    </div>
    <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-gray-400 font-extrabold uppercase">Total Capacity</p>
        <p className="text-sm font-black text-gray-800 dark:text-white">0.65 GB / 1.0 GB</p>
      </div>
      <button className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-indigo-600 transition">
        <i className="fas fa-expand-alt"></i>
      </button>
    </div>
  </div>
);

export default StorageWidget;