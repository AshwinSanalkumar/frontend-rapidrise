import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '../../components/common/ToastContent'; 
import DeleteModal from '../../components/modals/DeleteModal';
import { Link } from 'react-router-dom';
import { fetchSharedLinks, revokeShareLink } from '../../services/shareService';
import { formatDateTime } from '../../utils/dateUtils';
import ShareAuditModal from '../../components/modals/ShareAuditModal';

const SharedLinksManagement = () => {
  const { showToast } = useToast(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); 
  const [selectedAccess, setSelectedAccess] = useState(null);
  const [viewShare, setViewShare] = useState(null);

  const [allShares, setAllShares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadShares = async (page = 1, search = '', status = '') => {
    setIsLoading(true);
    try {
      const response = await fetchSharedLinks(page, search, status);
      setAllShares(Array.isArray(response) ? response : (response.results || []));
      setTotalCount(response.count || (Array.isArray(response) ? response.length : 0));
    } catch (err) {
      showToast("Failed to load shared links", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShares(currentPage, searchQuery, statusFilter);
  }, [currentPage, searchQuery, statusFilter]);

  const totalPages = Math.ceil(totalCount / 10);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const confirmRevoke = async () => {
    try {
      await revokeShareLink(selectedAccess.token);
      showToast(`Access revoked successfully`, "success");
      loadShares(); // Refresh list
    } catch (err) {
      showToast("Failed to revoke access", "error");
    } finally {
      setSelectedAccess(null);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>

        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
                  <Link to="/dashboard" className="hover:text-indigo-600 transition text-gray-500">Dashboard</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200">Shared Links</span>
        </nav>
      </div>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Access Control</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Tracking engagement for {allShares.length} shared assets.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-48">
             <i className="fas fa-filter absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
             <select 
               value={statusFilter}
               onChange={(e) => handleStatusChange(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 appearance-none shadow-sm cursor-pointer"
             >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="accessed">Accessed</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
             </select>
          </div>

          <div className="relative w-full md:w-80">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Search activity..." 
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="px-8 py-5">File & Recipient</th>
                <th className="px-8 py-5">Engagement</th>
                <th className="px-8 py-5">Shared at</th>
                <th className="px-8 py-5">Expires at</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Syncing Records...</p>
                  </td>
                </tr>
              ) : allShares.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-medium">
                    {searchQuery ? `No matches found for "${searchQuery}"` : "No active shares found."}
                  </td>
                </tr>
              ) : allShares.map((share) => (
                <tr 
                  key={share.token} 
                  onClick={() => setViewShare(share)}
                  className={`hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors group cursor-pointer ${share.is_revoked ? 'opacity-50 grayscale' : ''}`}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full bg-gray-500  dark:bg-pink-500/50 flex items-center justify-center text-[11px] font-bold text-white dark:text-white shrink-0`}>
                        {(share.receipient_email || 'Public')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{share.display_name || share.file_name}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{share.receipient_email || 'Public Link'}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${share.is_revoked ? 'bg-rose-500' : share.is_expired ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {share.is_revoked ? 'Revoked' : share.is_expired ? 'Expired' : 'Active'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {share.is_accessed ? 'Accessed' : 'Not yet used'}
                      </p>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(share.created_at)}
                  </td>
                  <td className="px-8 py-5 text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(share.expires_at)}
                  </td>

                  <td className="px-8 py-5">
                    {share.is_expired ? (
                      <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-600 dark:bg-amber-900/20">
                        Expired
                      </span>
                    ) : share.is_accessed ? (
                      <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20">
                        Accessed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20">
                        Sent
                      </span>
                    )}
                  </td>

                  <td className="px-8 py-5 text-right space-x-2">
                    {!share.is_revoked && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedAccess(share); }}
                        className="text-gray-300 hover:text-rose-500 transition-colors p-2"
                        title="Revoke Access"
                      >
                        <i className="fas fa-user-minus text-xs"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {!isLoading && totalCount > 0 && (
          <div className="bg-white dark:bg-gray-800 border-t border-gray-50 dark:border-gray-700 px-8 py-5 flex items-center justify-between">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing {allShares.length} of {totalCount} Records
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentPage === 1 ? 'text-gray-200 border-gray-100 dark:border-gray-800 cursor-not-allowed' : 'border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-600 hover:border-indigo-500 active:scale-95'}`}
              >
                <i className="fas fa-chevron-left text-xs"></i>
              </button>

              <div className="flex items-center px-4">
                <span className="text-xs font-black text-indigo-600">Page {currentPage}</span>
                <span className="text-[10px] text-gray-400 font-bold mx-1">of</span>
                <span className="text-xs font-black text-gray-900 dark:text-white">{totalPages || 1}</span>
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentPage >= totalPages ? 'text-gray-200 border-gray-100 dark:border-gray-800 cursor-not-allowed' : 'border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-600 hover:border-indigo-500 active:scale-95'}`}
              >
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteModal 
        isOpen={!!selectedAccess}
        onClose={() => setSelectedAccess(null)}
        onDelete={confirmRevoke}
        title="Revoke Access?"
        message={`Remove access to this link? The recipient will no longer be able to use it.`}
        confirmText="Revoke Now"
        variant="warning"
      />

      <ShareAuditModal 
        isOpen={!!viewShare}
        onClose={() => setViewShare(null)}
        share={viewShare}
      />
    </main>
  );
};

export default SharedLinksManagement;