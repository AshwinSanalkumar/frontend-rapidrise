import React from 'react';
import { useNavigate } from 'react-router-dom';

const FileCard = ({ file, onShare, view }) => {
  const navigate = useNavigate();
  const isList = view === 'list';

  // Strategy for File Icons and Colors
  const getFileConfig = (type) => {
    const configs = {
      image: { icon: 'fa-file-image', color: 'text-blue-500', bg: 'bg-blue-50' },
      pdf: { icon: 'fa-file-pdf', color: 'text-red-500', bg: 'bg-red-50' },
      excel: { icon: 'fa-file-excel', color: 'text-emerald-500', bg: 'bg-emerald-50' },
      word: { icon: 'fa-file-word', color: 'text-indigo-500', bg: 'bg-indigo-50' },
      zip: { icon: 'fa-file-archive', color: 'text-amber-500', bg: 'bg-amber-50' },
      default: { icon: 'fa-file', color: 'text-gray-400', bg: 'bg-gray-50' }
    };
    return configs[type] || configs.default;
  };

  const config = getFileConfig(file.type);

  // Navigation to your viewing page
  const handleView = () => {
    // Assuming your route is something like /view/:id
    navigate(`/file-details`);
  };

  return (
    <div 
      onClick={handleView}
      className={`file-card bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group cursor-pointer
        ${isList 
          ? 'flex flex-row items-center !py-4 !px-6 !rounded-[1.25rem]' 
          : 'flex flex-col rounded-[2.5rem]'}`}
    >
      {/* File Preview Container */}
      <div className={`relative overflow-hidden flex-shrink-0 transition-colors duration-300
        ${isList 
          ? 'w-[60px] h-[45px] rounded-lg mr-6' 
          : 'h-32 w-full rounded-[1.5rem] mb-4'}
        ${file.type === 'image' ? 'bg-gray-50 dark:bg-gray-900/50' : `dark:bg-gray-900/30 ${config.bg.replace('bg-', 'bg-opacity-20 bg-')}`} `}
      >
        {file.type === 'image' && file.preview ? (
          <img 
            src={file.preview} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            alt={file.name} 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
             <i className={`fas ${config.icon} ${config.color} ${isList ? 'text-xl' : 'text-3xl'} group-hover:rotate-12 transition-transform duration-300`}></i>
          </div>
        )}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
      </div>

      {/* File Details */}
      <div className={`${isList ? 'flex flex-1 items-center' : ''}`}>
        <h3 className={`font-bold text-gray-800 dark:text-gray-100 truncate px-1 ${isList ? 'mr-auto text-base' : 'text-sm'}`}>
          {file.name}
        </h3>
        
        <p className={`text-xs text-gray-400 px-1 font-medium ${isList ? 'mt-0 mr-8 min-w-[150px]' : 'mt-1'}`}>
          {file.date} • {file.size}
        </p>

        {/* Status and Action Button */}
        <div className={`flex items-center justify-between px-1 
          ${isList ? 'mt-0 pt-0 border-t-0 space-x-6' : 'mt-6 pt-4 border-t border-gray-50 dark:border-gray-700'}`}>
          
          <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md whitespace-nowrap tracking-wider
            ${file.status === 'PRIVATE' 
              ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
              : 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'}`}>
            {file.status}
          </span>

          <button 
            onClick={(e) => { 
              e.stopPropagation(); // Prevents the 'view' redirect when clicking share
              onShare(file.name); 
            }}
            className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition whitespace-nowrap flex items-center"
          >
            <i className="fas fa-share-alt mr-2"></i> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;