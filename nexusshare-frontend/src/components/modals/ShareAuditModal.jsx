import React, { useState } from 'react';
import { formatDateTime } from '../../utils/dateUtils';
import { revokeShareLink } from '../../services/shareService';

const ShareAuditModal = ({ isOpen, onClose, share, onRevoke }) => {
  const [isRevoking, setIsRevoking] = useState(false);
  const [isRevoked, setIsRevoked] = useState(false);

  if (!isOpen || !share) return null;

  const isActive = !share.is_revoked && !share.is_expired && !isRevoked;

  const handleRevoke = async () => {
    if (!isActive || isRevoking) return;
    setIsRevoking(true);
    try {
      await revokeShareLink(share.token);
      setIsRevoked(true);
      if (onRevoke) onRevoke(share.token);
    } catch (err) {
      console.error('Failed to revoke link:', err);
    } finally {
      setIsRevoking(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-gray-950/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[1rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Share Details</h3>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5">Shared Link </p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-rose-500 transition">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-indigo-500 text-xl mr-4 shrink-0">
                <i className="fas fa-envelope-open-text"></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Recipient</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{share.recipient_email || 'Public Accessibility Link'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50/50 dark:bg-gray-700/20 rounded-2xl border border-transparent">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">File Name</p>
                <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{share.display_name || share.file_name}</p>
              </div>
              <div className="p-4 bg-gray-50/50 dark:bg-gray-700/20 rounded-2xl border border-transparent">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Size</p>
                <p className="text-xs font-bold text-gray-800 dark:text-white">{share.file_size || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-3 px-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-400 font-medium">Transmission Time</span>
                <span className="text-gray-700 dark:text-gray-200 font-bold">{formatDateTime(share.created_at)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-400 font-medium">Security Status</span>
                <span className={`font-black uppercase tracking-widest text-[9px] ${(share.is_revoked || isRevoked) ? 'text-rose-500' : share.is_expired ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {(share.is_revoked || isRevoked) ? 'Revoked' : share.is_expired ? 'Expired' : 'Active Access'}
                </span>
              </div>
            </div>

            <div className="p-5 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[1.5rem] border border-indigo-50/50 dark:border-indigo-500/10">
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">Message </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {share.message || "No contextual message was attached to this transmission."}
              </p>
            </div>
          </div>

          {(share.is_revoked || isRevoked) ? (
            <button
              disabled
              className="w-full mt-8 py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl cursor-not-allowed border border-rose-100 dark:border-rose-800/30 transition-all"
            >
              <i className="fas fa-ban mr-2"></i> Already Revoked
            </button>
          ) : share.is_expired ? (
            <button
              disabled
              className="w-full mt-8 py-4 bg-amber-50 dark:bg-amber-900/20 text-amber-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl cursor-not-allowed border border-amber-100 dark:border-amber-800/30 transition-all"
            >
              <i className="fas fa-clock mr-2"></i> Link Expired
            </button>
          ) : (
            <button
              onClick={handleRevoke}
              disabled={isRevoking}
              className="w-full mt-8 py-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl border border-gray-200 dark:border-gray-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 dark:hover:border-rose-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRevoking
                ? <><i className="fas fa-spinner fa-spin mr-2"></i> Revoking...</>
                : <><i className="fas fa-ban mr-2"></i> Revoke Access</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareAuditModal;
