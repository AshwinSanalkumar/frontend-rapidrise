import React, { useState, useMemo } from 'react';
import { useToast } from '../../components/common/ToastContent'; 
import DeleteModal from '../../components/modals/DeleteModal';

const SharedLinksManagement = () => {
  const { showToast } = useToast(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccess, setSelectedAccess] = useState(null);

  // Expanded Mock data with Analytics
  const [allShares, setAllShares] = useState([
    { 
      id: 1, 
      fileName: 'Q4_Revenue.xlsx', 
      name: 'Sarah Chen', 
      email: 'sarah@co.com', 
      access: 'View Only', 
      openedCount: 12, 
      lastOpened: '2 mins ago', 
      status: 'Active',
      color: 'bg-indigo-500' 
    },
    { 
      id: 2, 
      fileName: 'Brand_Identity.fig', 
      name: 'External Agency', 
      email: 'agency@studio.io', 
      access: 'View Only', 
      openedCount: 0, 
      lastOpened: 'Never', 
      status: 'Pending',
      color: 'bg-amber-500' 
    },
    { 
      id: 3, 
      fileName: 'Project_Alpha.zip', 
      name: 'Marcus Thorne', 
      email: 'marcus@co.com', 
      access: 'Can Edit', 
      openedCount: 45, 
      lastOpened: '1 hour ago', 
      status: 'Active',
      color: 'bg-emerald-500' 
    },
  ]);

  const filteredShares = useMemo(() => {
    return allShares.filter(share => 
      share.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      share.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allShares]);

  const handleCopyLink = (fileName) => {
    showToast(`Shared link for ${fileName} copied to clipboard!`, "success");
  };

  const confirmRevoke = () => {
    setAllShares(prev => prev.filter(s => s.id !== selectedAccess.id));
    showToast(`Access revoked for ${selectedAccess.name}`, "success");
    setSelectedAccess(null);
  };

  return (
    <main className="flex-1 p-8 lg:p-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Access Control</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Tracking engagement for {allShares.length} shared assets.</p>
        </div>

        <div className="relative w-full md:w-80">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Search activity..." 
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="px-8 py-5">File & Recipient</th>
                <th className="px-8 py-5">Engagement</th>
                <th className="px-8 py-5">Last Activity</th>
                <th className="px-8 py-5">Permission</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredShares.map((share) => (
                <tr key={share.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors group">
                  {/* Column 1: Asset & User Info combined to save space */}
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full ${share.color} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                        {share.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{share.fileName}</p>
                        <p className="text-[11px] text-gray-400 font-medium">Shared with {share.name}</p>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Status & Click Count */}
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${share.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{share.openedCount} views</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Status: {share.status}</p>
                    </div>
                  </td>

                  {/* Column 3: Relative Time */}
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      <i className="far fa-clock text-xs"></i>
                      <span className="text-xs font-medium">{share.lastOpened}</span>
                    </div>
                  </td>

                  {/* Column 4: Permission Badge */}
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                      share.access === 'Can Edit' 
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' 
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                    }`}>
                      {share.access}
                    </span>
                  </td>

                  {/* Column 5: Actions */}
                  <td className="px-8 py-5 text-right space-x-2">
                    <button 
                      onClick={() => handleCopyLink(share.fileName)}
                      className="text-gray-300 hover:text-indigo-500 transition-colors p-2"
                      title="Copy Link"
                    >
                      <i className="fas fa-link text-xs"></i>
                    </button>
                    <button 
                      onClick={() => setSelectedAccess(share)}
                      className="text-gray-300 hover:text-rose-500 transition-colors p-2"
                      title="Revoke Access"
                    >
                      <i className="fas fa-user-minus text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal 
        isOpen={!!selectedAccess}
        onClose={() => setSelectedAccess(null)}
        onDelete={confirmRevoke}
        title="Revoke Access?"
        message={`Remove ${selectedAccess?.name}'s access to ${selectedAccess?.fileName}? They will no longer be able to use the shared link.`}
        confirmText="Revoke Now"
        variant="warning"
      />
    </main>
  );
};

export default SharedLinksManagement;