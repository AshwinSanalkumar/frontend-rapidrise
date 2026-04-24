import React, { useState, useEffect } from 'react';
import { fetchFiles } from '../../services/fileService';

const NexusShareSelector = ({ onClose, onImport }) => {
  const [cloudAssets, setCloudAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Reset and reload when search changes
  useEffect(() => {
    setCurrentPage(1);
    loadAssets(1, true);
  }, [searchQuery]);

  const loadAssets = async (page, reset = false) => {
    if (reset) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response = await fetchFiles(page, searchQuery);
      const filesList = response.files || [];
      
      const mapped = filesList.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        icon: f.type === 'image' ? 'fa-file-image' : 'fa-file',
        color: f.type === 'image' ? 'text-blue-500' : 'text-indigo-500'
      }));

      setCloudAssets(prev => reset ? mapped : [...prev, ...mapped]);
      setHasMore(!!response.next);
    } catch (error) {
      console.error('Failed to load cloud assets:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadAssets(nextPage);
    }
  };

  // Filter assets based on search (Client-side redundant if server-side is used, but keeping for safety/instant feedback if cached)
  const filteredAssets = cloudAssets;

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFinalImport = () => {
    // Pass only the selected IDs to the callback
    onImport(selectedIds);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/20 flex flex-col max-h-[85vh] animate-in zoom-in duration-200 overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Nexus Share</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Select assets from your cloud vault</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <i className="fas fa-times text-gray-400"></i>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input 
              type="text"
              placeholder="Search your cloud assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
            />
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar bg-gray-50/30 dark:bg-gray-900/10">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Opening vault...</p>
            </div>
          ) : filteredAssets.length > 0 ? (
            <>
              {filteredAssets.map((asset) => (
                <div 
                  key={asset.id}
                  onClick={() => toggleSelection(asset.id)}
                  className={`group flex items-center p-4 rounded-[1.5rem] border-2 transition-all cursor-pointer ${
                    selectedIds.includes(asset.id) 
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' 
                    : 'border-transparent bg-white dark:bg-gray-800 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-gray-50 dark:bg-gray-900 group-hover:scale-110 transition-transform`}>
                    <i className={`fas ${asset.icon} ${asset.color} text-xl`}></i>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{asset.name}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{asset.size}</p>
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedIds.includes(asset.id) 
                    ? 'bg-indigo-500 border-indigo-500 text-white' 
                    : 'border-gray-200 dark:border-gray-600 text-transparent'
                  }`}>
                    <i className="fas fa-check text-[10px]"></i>
                  </div>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-500 transition-all font-bold text-xs uppercase tracking-widest"
                >
                  {isLoadingMore ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                  ) : (
                    'Load More Assets'
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <i className="fas fa-search text-gray-200 text-4xl mb-4"></i>
              <p className="text-gray-400 text-sm font-medium">No assets match your search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
          <div>
            <span className="text-lg font-black text-gray-900 dark:text-white">{selectedIds.length}</span>
            <span className="ml-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Items Selected</span>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleFinalImport}
              disabled={selectedIds.length === 0}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl ${
                selectedIds.length > 0 
                ? 'gradient-bg text-white shadow-indigo-500/20 active:scale-95' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexusShareSelector;