import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use React Router

const FolderCard = ({ id, name, fileCount, size, colorClass, onRename, onDelete, view }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isList = view === 'list';

  // Navigation handler
  const handleFolderClick = () => {
    // Navigate to the folder detail page using the folder name or ID
    // Example: /folder/Product-Specs
    navigate('/folder-detail');
  };

  // --- LIST VIEW ---
  if (isList) {
    return (
      <div 
        onClick={handleFolderClick}
        className="group flex items-center bg-white dark:bg-gray-800 p-3 px-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer w-full relative"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-opacity-10 ${colorClass.replace('text', 'bg')} ${colorClass}`}>
          <i className="fas fa-folder text-lg"></i>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">{name}</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{fileCount} Files • {size}</p>
        </div>

        <div className="relative ml-4">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); // Prevents navigating when clicking the menu button
              setIsMenuOpen(!isMenuOpen); 
            }}
            className="text-gray-300 hover:text-gray-500 p-2 transition-colors"
          >
            <i className="fas fa-ellipsis-h"></i>
          </button>
          
          {isMenuOpen && <DropdownMenu onRename={onRename} onDelete={onDelete} close={() => setIsMenuOpen(false)} />}
        </div>
      </div>
    );
  }

  // --- GRID VIEW ---
  return (
    <div 
      onClick={handleFolderClick}
      className="folder-card bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl group relative transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-opacity-10 ${colorClass.replace('text', 'bg')} ${colorClass} group-hover:scale-110 transition-transform`}>
          <i className="fas fa-folder text-2xl"></i>
        </div>
        
        <div className="relative">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); // Prevents navigating when clicking the menu button
              setIsMenuOpen(!isMenuOpen); 
            }}
            className="text-gray-300 hover:text-gray-500 p-2"
          >
            <i className="fas fa-ellipsis-v"></i>
          </button>
          
          {isMenuOpen && <DropdownMenu onRename={onRename} onDelete={onDelete} close={() => setIsMenuOpen(false)} />}
        </div>
      </div>

      <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate mb-1">{name}</h3>
      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.15em]">
        {fileCount} files • {size}
      </p>
    </div>
  );
};

// Reusable Dropdown
const DropdownMenu = ({ onRename, onDelete, close }) => (
  <div 
    onClick={(e) => e.stopPropagation()} // Prevents navigating when clicking inside the menu
    className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-600 z-30 overflow-hidden shadow-indigo-500/10"
  >
    <button 
      onClick={(e) => { e.stopPropagation(); onRename(); close(); }}
      className="w-full text-left px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-600 transition flex items-center"
    >
      <i className="fas fa-edit mr-3 opacity-50"></i> Rename
    </button>
    <button 
      onClick={(e) => { e.stopPropagation(); onDelete(); close(); }}
      className="w-full text-left px-4 py-3 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-black flex items-center border-t border-gray-50 dark:border-gray-600"
    >
      <i className="fas fa-trash-alt mr-3"></i> Delete
    </button>
  </div>
);

export default FolderCard;