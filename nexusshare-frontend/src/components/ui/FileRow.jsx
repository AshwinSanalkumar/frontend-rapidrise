import React, { useState } from 'react';

const FileRow = ({ id, name, subtitle, modified, size, iconClass, colorClass, bgClass, imageUrl, onShare, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
      <td className="px-8 py-6">
        <div className="flex items-center space-x-4">
          {imageUrl ? (
            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-100 dark:border-gray-600">
              <img src={imageUrl} alt="preview" className="w-full h-full object-cover opacity-80" />
            </div>
          ) : (
            <div className={`p-3 ${bgClass} rounded-xl ${colorClass}`}>
              <i className={iconClass}></i>
            </div>
          )}
          <div>
            <p className="font-bold text-gray-700 dark:text-gray-200">{name}</p>
            <p className={`text-[10px] uppercase font-extrabold ${imageUrl ? 'text-blue-500' : 'text-gray-400'}`}>
              {subtitle}
            </p>
          </div>
        </div>
      </td>
      <td className="px-8 py-6 text-sm text-gray-500 dark:text-gray-400">{modified}</td>
      <td className="px-8 py-6 text-sm text-gray-500 dark:text-gray-400">{size}</td>
      
      {/* Reverted to exact original alignment and spacing */}
      <td className="px-8 py-6 text-right space-x-3 text-gray-300">
        <button 
          onClick={(e) => { e.stopPropagation(); onShare(id, name); }}
          className="hover:text-indigo-600 transition-colors"
        >
          <i className="fas fa-link"></i>
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (confirmDelete) {
              onDelete(id, name);
            } else {
              setConfirmDelete(true);
              setTimeout(() => setConfirmDelete(false), 3000);
            }
          }}
          className={`transition-colors ${confirmDelete ? 'text-red-600 font-bold text-[10px] uppercase tracking-tighter' : 'hover:text-red-500'}`}
        >
          {confirmDelete ? "Confirm?" : <i className="fas fa-trash"></i>}
        </button>
      </td>
    </tr>
  );
};

export default FileRow;