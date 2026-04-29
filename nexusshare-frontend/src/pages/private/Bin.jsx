import React, { useState, useEffect } from 'react';
import TrashTable from '../../components/elements/TrashTable';
import DeleteModal from '../../components/modals/DeleteModal';
import { useToast } from '../../components/common/ToastContent';
import { fetchDeletedFiles, restoreFile, deleteFilePermanently, restoreAllFiles, emptyTrash } from '../../services/fileService';

const Bin = () => {
  const { showToast } = useToast();
  const [deletedItems, setDeletedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isEmptying, setIsEmptying] = useState(false);

  useEffect(() => {
    const loadDeletedItems = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDeletedFiles();
        setDeletedItems(data.files || []);
      } catch (error) {
        console.error('Failed to load deleted items:', error);
        showToast('Error loading deleted items', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadDeletedItems();
  }, []); 


  const handleRestore = (id) => {
    const item = deletedItems.find(i => i.id === id);
    if (!item) return;
    setDeletedItems(deletedItems.filter(i => i.id !== id));
    restoreFile(item.id);
    showToast(`${item.name} restored successfully!`, 'success');
  };

  const handleDeletePermanently = (id) => {
    const item = deletedItems.find(i => i.id === id);
    if (item) {
      setDeleteTarget({ type: 'single', item });
    }
  };

  const handleEmptyTrashClick = () => {
    if (deletedItems.length > 0) {
      setDeleteTarget({ type: 'all' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'single') {
        const item = deleteTarget.item;
        await deleteFilePermanently(item.id);
        setDeletedItems(prev => prev.filter(i => i.id !== item.id));
        showToast("Item purged from vault.", "success");
        setDeleteTarget(null);
      } else if (deleteTarget.type === 'all') {
        setIsEmptying(true);
        await emptyTrash();
        setDeletedItems([]);
        showToast("Vault trash emptied.", "success");
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error('Operation failed:', error);
      showToast(error.response?.data?.error || "Operation failed", "error");
    } finally {
      setIsEmptying(false);
    }
  };

  const restoreAll = async () => {
    if (deletedItems.length === 0) return;
    
    setIsLoading(true);
    try {
      await restoreAllFiles();
      setDeletedItems([]);
      showToast("All items restored to original paths.", "success");
    } catch (error) {
      console.error('Failed to restore items:', error);
      showToast(error.response?.data?.error || "Failed to restore items", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
           <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <span className="text-gray-800 dark:text-gray-200">Bin</span>
        </nav>
      </div>

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
                  onClick={handleEmptyTrashClick} 
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
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scanning Trash...</p>
            </div>
          ) : (
            <TrashTable 
              items={deletedItems} 
              onRestore={handleRestore} 
              onDeletePermanently={handleDeletePermanently}
              isEmpty={deletedItems.length === 0}
            />
          )}
        </div>

        {/* Security Footnote */}
        <div className="mt-8 flex items-center justify-center space-x-2 opacity-30">
          <i className="fas fa-shield-alt text-[10px]"></i>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Secure Deletion Protocol Active</span>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onDelete={handleConfirmDelete}
        title={deleteTarget?.type === 'all' ? "Empty entirely?" : "Delete Permanently?"}
        message={deleteTarget?.type === 'all' 
          ? "This will wipe all items in the bin. This cannot be undone." 
          : `This will permanently delete "${deleteTarget?.item?.name}". This cannot be undone.`}
        confirmText={deleteTarget?.type === 'all' ? "Empty Bin" : "Delete"}
        variant="danger"
        icon="fas fa-trash-alt"
        isLoading={deleteTarget?.type === 'all' ? isEmptying : false}
      />
    </main>
  );
};

export default Bin;