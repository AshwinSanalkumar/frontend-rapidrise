import React, { useState } from 'react';
import TrashTable from '../components/ui/TrashTable';
import { useToast } from '../components/ui/ToastContent';

const Bin = () => {
  const { showToast } = useToast();
  
  // Mock data for the bin
  const [deletedItems, setDeletedItems] = useState([
    { 
      id: 1, 
      name: 'Q4_Report_Draft.pdf', 
      path: '/Documents/Reports', 
      deletedDate: 'Oct 24, 2026', 
      size: '2.4 MB', 
      icon: 'fa-file-pdf', 
      color: 'text-red-400' 
    },
    { 
      id: 2, 
      name: 'Old_Assets_Folder', 
      path: '/Projects', 
      deletedDate: 'Oct 22, 2026', 
      size: '145 MB', 
      icon: 'fa-folder', 
      color: 'text-amber-400' 
    }
  ]);

  const handleRestore = (id) => {
    const item = deletedItems.find(i => i.id === id);
    if (!item) return;
    setDeletedItems(deletedItems.filter(i => i.id !== id));
    showToast(`${item.name} restored successfully!`, 'success');
  };

  const handleDeletePermanently = (id) => {
    const item = deletedItems.find(i => i.id === id);
    if (window.confirm(`Delete "${item?.name}" permanently? This cannot be undone.`)) {
      setDeletedItems(deletedItems.filter(i => i.id !== id));
      showToast("Item purged from vault.", "error");
    }
  };

  const emptyTrash = () => {
    if (window.confirm("Empty entire trash? All data will be permanently wiped.")) {
      setDeletedItems([]);
      showToast("Vault trash emptied.", "info");
    }
  };

  const restoreAll = () => {
    setDeletedItems([]);
    showToast("All items restored to original paths.", "success");
  };

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-gray-50/50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recycle Bin</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Items are automatically purged after <span className="text-indigo-500 font-bold">30 days</span>.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {deletedItems.length > 0 && (
              <>
                <button 
                  onClick={emptyTrash} 
                  className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all"
                >
                  Empty Bin
                </button>
                <button 
                  onClick={restoreAll} 
                  className="gradient-bg text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:opacity-90 transition active:scale-95"
                >
                  Restore All
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content Table Area */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <TrashTable 
            items={deletedItems} 
            onRestore={handleRestore} 
            onDeletePermanently={handleDeletePermanently}
            isEmpty={deletedItems.length === 0}
          />
        </div>

        {/* Security Footnote */}
        <div className="mt-8 flex items-center justify-center space-x-2 opacity-30">
          <i className="fas fa-shield-alt text-[10px]"></i>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Secure Deletion Protocol Active</span>
        </div>
      </div>
    </main>
  );
};

export default Bin;