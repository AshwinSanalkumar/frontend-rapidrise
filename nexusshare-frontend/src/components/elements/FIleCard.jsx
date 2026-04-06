import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../common/ToastContent'; // Using your custom toast hook
import { toggleFileFavorite } from '../../services/fileService';

const FileCard = ({ file, onShare, view, onToggleFavorite }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isList = view === 'list';

  // Local state for immediate UI feedback
  const [isFavorite, setIsFavorite] = useState(file.isFavorite || false);

  // Sync local state with prop updates (e.g. after refresh or parent state update)
  useEffect(() => {
    setIsFavorite(file.isFavorite || false);
  }, [file.isFavorite]);

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

  const handleToggleFavorite = async (e) => {
    e.stopPropagation(); // Prevents navigating to file details

    try {
      // Optimistic update
      const newState = !isFavorite;
      setIsFavorite(newState);

      const response = await toggleFileFavorite(file.id);

      // Update with exact state from backend
      if (response && typeof response.is_favorite !== 'undefined') {
        const finalStatus = response.is_favorite;
        setIsFavorite(finalStatus);
        
        // Notify parent to update its state
        if (onToggleFavorite) {
          onToggleFavorite(file.id, finalStatus);
        }
      }

      // Professional feedback via your Toast system
      showToast(
        newState ? `Added ${file.name} to favorites` : `Removed ${file.name} from favorites`,
        newState ? 'success' : 'info'
      );
    } catch (error) {
      // Revert on error
      setIsFavorite(isFavorite);
      showToast(
        `Failed to update favorite status for ${file.name}`,
        'error'
      );
    }
  };

  const handleView = () => {
    navigate(`/files/details/${file.id}`);
  };

  return (
    <div
      onClick={handleView}
      className={`file-card bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group cursor-pointer relative
        ${isList
          ? 'flex flex-row items-center !py-4 !px-6 !rounded-[1.25rem]'
          : 'flex flex-col rounded-[2.5rem]'}`}
    >
      {/* Favorite Button - Top Right Overlay for Grid View */}
      {!isList && (
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-6 right-6 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md 
            ${isFavorite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-white/50 text-gray-400 hover:text-rose-500 hover:bg-white'}`}
        >
          <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-xs`}></i>
        </button>
      )}

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
      </div>

      {/* File Details */}
      <div className={`${isList ? 'flex flex-1 items-center' : ''}`}>
        <div className={`${isList ? 'mr-auto flex flex-col' : ''}`}>
          <h3 className={`font-bold text-gray-800 dark:text-gray-100 truncate px-1 ${isList ? 'text-base' : 'text-sm'}`}>
            {file.name}
          </h3>
          <p className={`text-xs text-gray-400 px-1 font-medium ${isList ? 'mt-0.5' : 'mt-1'}`}>
            {file.date} • {file.size}
          </p>
        </div>

        {/* Status and Action Button */}
        <div className={`flex items-center 
          ${isList ? 'space-x-8' : 'justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-700'}`}>

          <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md whitespace-nowrap tracking-wider
            ${file.status === 'PRIVATE'
              ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'}`}>
            {file.status}
          </span>

          <div className="flex items-center space-x-4">
            {/* Favorite Button for List View */}
            {isList && (
              <button
                onClick={handleToggleFavorite}
                className={`transition-colors duration-200 ${isFavorite ? 'text-rose-500' : 'text-gray-300 hover:text-rose-500'}`}
              >
                <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(file.name);
              }}
              className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition whitespace-nowrap flex items-center"
            >
              <i className="fas fa-share-alt mr-2"></i> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;