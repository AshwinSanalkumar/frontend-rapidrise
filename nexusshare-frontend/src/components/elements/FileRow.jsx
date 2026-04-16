import React from 'react';
import { useNavigate } from 'react-router-dom';

const FileRow = ({ id, name, subtitle, modified, size, iconClass, colorClass, bgClass, imageUrl, type, onShare, onDelete }) => {
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
          <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 overflow-hidden group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
            {type === 'image' && imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover opacity-90" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${bgClass || 'bg-gray-100'} ${colorClass || 'text-gray-400'}`}>
                <i className={`${iconClass || 'fas fa-file'} text-xl group-hover:rotate-12 transition-transform duration-300`}></i>
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-700 dark:text-gray-200">{name}</p>
            <p className={`text-[10px] uppercase font-extrabold ${type === 'image' && imageUrl ? 'text-blue-500' : 'text-gray-400'}`}>
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