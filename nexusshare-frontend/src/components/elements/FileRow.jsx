import React from 'react';
import { useNavigate } from 'react-router-dom';

const FileRow = ({ id, name, subtitle, modified, size, iconClass, colorClass, bgClass, imageUrl, onShare, onDelete }) => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    // Navigates to the details page for this specific file
    navigate(`/files/details/${id}`);
  };

  return (
    <tr 
      onClick={handleRowClick}
      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition group cursor-pointer"
    >
      <td className="px-8 py-6">
        <div className="flex items-center space-x-4">
          {imageUrl ? (
            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-100 dark:border-gray-600 group-hover:scale-105 transition-transform">
              <img src={imageUrl} alt="preview" className="w-full h-full object-cover opacity-80" />
            </div>
          ) : (
            <div className={`p-3 ${bgClass} rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
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
      
      <td className="px-8 py-6 text-right space-x-3 text-gray-300">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); // Prevents navigation to FileDetails
            onShare(id, name); 
          }}
          className="hover:text-indigo-600 transition-colors p-2 relative z-10"
          title="Share Link"
        >
          <i className="fas fa-link"></i>
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevents navigation to FileDetails
            onDelete(id, name); 
          }}
          className="hover:text-red-500 transition-colors p-2 relative z-10"
          title="Delete File"
        >
          <i className="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default FileRow;