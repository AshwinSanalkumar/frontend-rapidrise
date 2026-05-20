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
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Share Details</h3>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5">Shared Link </p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-rose-500 transition">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-indigo-500 text-base mr-3 shrink-0">
                <i className="fas fa-envelope-open-text"></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Recipient</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{share.receipient_email|| 'Public Accessibility Link'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-gray-50/50 dark:bg-gray-700/20 rounded-xl border border-transparent">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">File Name</p>
                <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{share.display_name || share.file_name}</p>
              </div>
              <div className="p-2.5 bg-gray-50/50 dark:bg-gray-700/20 rounded-xl border border-transparent">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Size</p>
                <p className="text-xs font-bold text-gray-800 dark:text-white">{share.file_size || 'N/A'}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-center">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Views</p>
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{share.access_count ?? 0}</p>
              </div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30 text-center">
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">Downloads</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{share.download_count ?? 0}</p>
              </div>
              <div className={`p-2 rounded-xl border text-center ${share.download_limit === 0 ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/30' : 'bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700'}`}>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Limit</p>
                <p className={`text-lg font-black ${share.download_limit === 0 ? 'text-rose-500' : 'text-gray-700 dark:text-gray-200'}`}>
                  {share.download_limit === 0 ? <i className="fas fa-eye text-sm"></i> : (share.download_limit ?? '∞')}
                </p>
              </div>
            </div>

            {share.download_limit === 0 && (
              <div className="flex items-center space-x-3 px-4 py-3 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center text-xs shrink-0">
                  <i className="fas fa-eye-slash"></i>
                </div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Preview Only — Downloads Disabled</p>
              </div>
            )}

            <div className="space-y-3 px-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-400 font-medium">Transmission Time</span>
                <span className="text-gray-700 dark:text-gray-200 font-bold">{formatDateTime(share.created_at)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-400 font-medium">Expires at</span>
                <span className="text-gray-700 dark:text-gray-200 font-bold">{formatDateTime(share.expires_at)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-400 font-medium">Security Status</span>
                <span className={`font-black uppercase tracking-widest text-[9px] ${(share.is_revoked || isRevoked) ? 'text-rose-500' : share.is_expired ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {(share.is_revoked || isRevoked) ? 'Revoked' : share.is_expired ? 'Expired' : 'Active Access'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl border border-indigo-50/50 dark:border-indigo-500/10">
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Message </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {share.message || "No contextual message was attached to this transmission."}
              </p>
            </div>
          </div>

          {(share.is_revoked || isRevoked) ? (
            <button
              disabled
              className="w-full mt-5 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl cursor-not-allowed border border-rose-100 dark:border-rose-800/30 transition-all"
            >
              <i className="fas fa-ban mr-2"></i> Already Revoked
            </button>
          ) : share.is_expired ? (
            <button
              disabled
              className="w-full mt-5 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl cursor-not-allowed border border-amber-100 dark:border-amber-800/30 transition-all"
            >
              <i className="fas fa-clock mr-2"></i> Link Expired
            </button>
          ) : (
            <button
              onClick={handleRevoke}
              disabled={isRevoking}
              className="w-full mt-5 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 dark:hover:border-rose-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
