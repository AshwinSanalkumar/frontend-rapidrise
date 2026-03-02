import React, { useState } from 'react';
import TrashTable from '../components/ui/TrashTable';
import { useToast } from '../components/ui/ToastContent';

const RecentlyDeleted = () => {
  const { showToast } = useToast();
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
    setDeletedItems(deletedItems.filter(i => i.id !== id));
    showToast(`${item.name} restored successfully!`);
  };

  const handleDeletePermanently = (id) => {
    if (window.confirm("Delete this item permanently?")) {
      setDeletedItems(deletedItems.filter(i => i.id !== id));
      showToast("Item deleted permanently.", "error");
    }
  };

  const emptyTrash = () => {
    if (window.confirm("Empty entire trash? This cannot be undone.")) {
      setDeletedItems([]);
      showToast("Trash emptied.", "info");
    }
  };

  const restoreAll = () => {
    setDeletedItems([]);
    showToast("All items restored to original locations.");
  };

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-gray-50/50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Recently Deleted</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Items in trash will be permanently deleted after 30 days.
            </p>
          </div>
          
          <div className="flex space-x-3">
            {deletedItems.length > 0 && (
              <>
                <button 
                  onClick={emptyTrash} 
                  className="px-5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition"
                >
                  Empty Trash
                </button>
                <button 
                  onClick={restoreAll} 
                  className="gradient-bg text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition active:scale-95"
                >
                  Restore All
                </button>
              </>
            )}
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <TrashTable 
            items={deletedItems} 
            onRestore={handleRestore} 
            onDeletePermanently={handleDeletePermanently}
            isEmpty={deletedItems.length === 0}
          />
        </div>
      </div>
    </main>
  );
};

export default RecentlyDeleted;