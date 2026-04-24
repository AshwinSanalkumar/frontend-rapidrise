import React, { useState, useEffect } from 'react';
import { fetchSharedLinks } from '../../services/shareService';
import ShareAuditModal from '../modals/ShareAuditModal';

const FileSpecCard = ({ file, onShare, refreshTrigger }) => {
  const [shares, setShares] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShare, setSelectedShare] = useState(null);

  useEffect(() => {
    if (file?.id) {
      const loadShares = async () => {
        setIsLoading(true);
        try {
          const response = await fetchSharedLinks(1, '', '', file.id);
          setShares(Array.isArray(response) ? response : (response.results || []));
        } catch (err) {
          console.error("Failed to load file shares", err);
        } finally {
          setIsLoading(false);
        }
      };
      loadShares();
    }
  }, [file?.id, refreshTrigger]);

  const getExtension = (filename) => {
    return filename?.split('.').pop()?.toUpperCase() || 'N/A';
  };

  return (
    <div className="w-full xl:w-80 space-y-4">
      {/* Specs Section */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">File Specs</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Size</span>
            <span className="text-gray-800 dark:text-white font-bold text-xs">
              {file.size || '0 Bytes'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Extension</span>
            <span className="text-gray-800 dark:text-white font-bold text-xs">
              {getExtension(file.filename)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Status</span>
            <span className={`px-2 py-0.5 ${file.is_deleted ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'} text-[9px] font-bold rounded-md`}>
              {file.is_deleted ? 'In Trash' : 'Active'}
            </span>
          </div>
        </div>
        <button 
          onClick={onShare}
          className="w-full mt-6 gradient-bg text-white text-sm font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          Share File
        </button>
      </div>

      {/* Shared With Section */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col max-h-64">
        <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 shrink-0">Shared With</h2>
        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 pb-2">
          {isLoading ? (
            <div className="flex justify-center py-2">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : shares.length === 0 ? (
            <p className="text-[10px] text-gray-400 text-center py-1 italic font-medium">No active shares</p>
          ) : (
            shares.map((share, idx) => (
              <div 
                key={share.token || idx} 
                className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 -mx-2 rounded-xl transition-all"
                onClick={() => setSelectedShare(share)}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[9px] font-bold text-indigo-600 uppercase shrink-0">
                    {(share.receipient_email || 'PL')[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-white truncate">
                      {share.receipient_email || 'Public Link'}
                    </p>
                    <p className="text-[9px] text-gray-400">
                      {share.is_revoked ? 'Revoked' : share.is_expired ? 'Expired' : 'Can View'}
                    </p>
                  </div>
                </div>
                <i className="fas fa-history text-[9px] text-gray-300 group-hover:text-indigo-400 shrink-0 ml-2 transition-colors"></i>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Share Detail Modal */}
      <ShareAuditModal 
        isOpen={!!selectedShare} 
        onClose={() => setSelectedShare(null)} 
        share={selectedShare} 
      />
    </div>
  );
};

export default FileSpecCard;