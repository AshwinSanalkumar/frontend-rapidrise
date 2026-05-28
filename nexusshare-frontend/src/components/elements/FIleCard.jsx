import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import { useToast } from '../common/ToastContent'; // Using your custom toast hook
import { toggleFileFavorite } from '../../services/fileService';
import { getFileConfig } from '../../utils/fileUtils';

const FileCard = ({ file, onShare, onDelete, view, onToggleFavorite, currentPage, enableMultiSelect, isSelected, onRowSelect }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isList = view === 'list';

  // Local state for immediate UI feedback
  const [isFavorite, setIsFavorite] = useState(file.isFavorite || false);

  // Sync local state with prop updates (e.g. after refresh or parent state update)
  useEffect(() => {
    setIsFavorite(file.isFavorite || false);
  }, [file.isFavorite]);


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
    navigate(`/files/details/${file.id}`, { state: { fromPage: currentPage } });
  };

  const renderPreview = (sizeClass = 'w-full h-full') => (
    <div className={`relative overflow-hidden flex-shrink-0 transition-colors duration-300 rounded-lg ${sizeClass}
      ${(file.type === 'image' || file.type === 'video') ? 'bg-gray-50 dark:bg-gray-900/50' : `dark:bg-gray-900/30 ${config.bg.replace('bg-', 'bg-opacity-20 bg-')}`} `}
    >
      {file.type === 'image' && file.preview ? (
        <img
          src={file.preview}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={file.name}
        />
      ) : file.type === 'video' && file.preview ? (
        <div className="w-full h-full relative group/vid">
           <video 
              src={`${file.preview}#t=0.5`} 
              preload="metadata"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
           />
           <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-80 border border-white/30">
                 <i className="fas fa-play text-white text-[8px] ml-0.5"></i>
              </div>
           </div>
        </div>
      ) : file.type === 'pdf' && file.preview ? (
        <div className="w-full h-full flex items-start justify-center overflow-hidden bg-white dark:bg-gray-800">
          <Document
            file={file.preview}
            loading={<i className="fas fa-circle-notch fa-spin text-gray-400 text-xs text-center"></i>}
            className="w-full h-full"
            error={
              <i className={`fas ${config.icon} ${config.color} ${isList ? 'text-xl' : 'text-3xl'} group-hover:rotate-12 transition-transform duration-300`}></i>
            }
          >
            <Page
              pageNumber={1}
              width={isList ? 60 : 250}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="w-full h-full [&>canvas]:!w-full [&>canvas]:!h-full [&>canvas]:!object-cover [&>canvas]:!object-top"
            />
          </Document>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <i className={`fas ${config.icon} ${config.color} ${isList ? 'text-xl' : 'text-3xl'} group-hover:rotate-12 transition-transform duration-300`}></i>
        </div>
      )}
    </div>
  );

  if (isList) {
    return (
      <tr 
        onClick={handleView}
        className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors group cursor-pointer border-b border-gray-50 dark:border-gray-800/50 last:border-0"
      >
        {enableMultiSelect && (
          <td className="pl-8 py-4">
            <button
               onClick={(e) => { e.stopPropagation(); onRowSelect(); }}
               className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300
                 ${isSelected
                   ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                   : 'bg-gray-100 dark:bg-gray-700 text-gray-400 opacity-60 group-hover:opacity-100'}`}
            >
               <i className={`fas fa-check text-[10px] ${isSelected ? 'opacity-100' : 'opacity-0'}`}></i>
            </button>
          </td>
        )}
        <td className="px-8 py-4">
          <div className="flex items-center space-x-4">
             {renderPreview('w-12 h-10')}
             <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[250px] leading-tight mb-0.5">{file.name}</p>
                <div className="flex md:hidden items-center space-x-2 text-[10px] text-gray-400 font-medium">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.date}</span>
                </div>
             </div>
          </div>
        </td>
        <td className="hidden md:table-cell px-8 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">
           {file.size}
        </td>
        <td className="hidden md:table-cell px-8 py-4 text-xs font-medium text-gray-500 dark:text-gray-400">
           {file.date}
        </td>
        <td className="px-8 py-4 text-right">
           <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md
             ${file.status === 'PRIVATE' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'}`}>
             {file.status}
           </span>
        </td>
        <td className="px-8 py-4 text-right">
           <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={handleToggleFavorite} className={`transition-colors ${isFavorite ? 'text-rose-500' : 'text-gray-300 hover:text-rose-500'}`}>
                    <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-xs`}></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(file); }} className="text-gray-300 hover:text-red-500 transition-colors">
                    <i className="fas fa-trash-alt text-xs"></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onShare(file); }} className="text-gray-300 hover:text-indigo-500 transition-colors">
                    <i className="fas fa-share-alt text-xs"></i>
                </button>
           </div>
        </td>
      </tr>
    );
  }

  return (
    <div
      onClick={handleView}
      className={`file-card bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group cursor-pointer relative
        rounded-[2.5rem] flex flex-col`}
    >
      {/* Selection Button - Top Left */}
      {enableMultiSelect && !isList && (
        <button
          onClick={(e) => { e.stopPropagation(); onRowSelect(); }}
          className={`absolute top-6 left-6 z-20 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-md 
            ${isSelected
              ? 'bg-indigo-500 text-white border-transparent shadow-lg shadow-indigo-500/40'
              : 'bg-white/10 text-gray-400 hover:text-indigo-500 hover:bg-white border-white'}`}
        >
          <i className={`fas fa-check text-xs dark:text-white text-black  ${isSelected ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}></i>
        </button>
      )}

      {/* Favorite Button - Top Right Overlay for Grid View */}
      {!isList && (
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-6 right-6 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md 
            ${isFavorite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-white/10 text-gray-400 hover:text-rose-500 hover:bg-white'}`}
        >
          <i className={`${isFavorite ? ' fas' : 'dark:text-white text-black far'} fa-heart text-xs  `}></i>
        </button>
      )}

      {/* File Preview Container */}
      {renderPreview(isList ? 'w-[60px] h-[45px] rounded-lg mr-6' : 'h-32 w-full rounded-[1.5rem] mb-4')}

      {/* File Details */}
      <div className={`${isList ? 'flex flex-1 items-center' : ''}`}>
        
        {enableMultiSelect && isList && (
            <button
              onClick={(e) => { e.stopPropagation(); onRowSelect(); }}
              className={`mr-4 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300
                ${isSelected
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <i className={`fas fa-check text-[10px] ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 hover:opacity-50'}`}></i>
            </button>
        )}

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

          <span className={`text-[11px] font-extrabold px-2.5 py-1.5 rounded-md whitespace-nowrap tracking-wider
            ${file.status === 'PRIVATE'
              ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'}`}>
            {file.status}
          </span>

          <div className="flex items-center space-x-5">
            {/* Favorite Button for List View */}
            {isList && (
              <button
                onClick={handleToggleFavorite}
                className={`text-sm transition-colors duration-200 ${isFavorite ? 'text-rose-500' : 'text-gray-300 hover:text-rose-500'}`}
              >
                <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(file);
              }}
              className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition whitespace-nowrap flex items-center"
            >
              <i className="fas fa-trash-alt text-red-500 mr-2 text-base"></i>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(file);
              }}
              className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition whitespace-nowrap flex items-center"
            >
              <i className="fas fa-share-alt mr-2 text-base"></i> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;