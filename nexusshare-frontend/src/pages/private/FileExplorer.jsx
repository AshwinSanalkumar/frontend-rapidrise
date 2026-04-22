import React, { useState, useEffect } from 'react';
import FolderCard from '../../components/elements/FolderCard';
import ViewToggle from '../../components/common/ViewToggle'; 
import { useToast } from '../../components/common/ToastContent';
import { fetchFolders, createFolder, renameFolder, deleteFolder } from '../../services/folderService';

const FileExplorer = () => {
  const { showToast } = useToast();
  const [view, setView] = useState('grid');
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  
  // Form States
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null); // Stores {id, name}

  // Fetch folders from API
  useEffect(() => {
    const loadFolders = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFolders();
        setFolders(data.folders || []);
      } catch (error) {
        console.error('Failed to load folders:', error);
        showToast("Failed to load your folders. Please try again later.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const created = await createFolder(newFolderName.trim());
      setFolders(prev => [...prev, created]);
      setIsCreateModalOpen(false);
      setNewFolderName("");
      showToast(`Folder "${newFolderName}" created successfully!`, "success");
    } catch (error) {
      showToast("Failed to create folder.", "error");
    }
  };

  const handleRenameFolder = async () => {
    if (!editingFolder.name.trim()) return;

    try {
      const updated = await renameFolder(editingFolder.id, editingFolder.name.trim());
      setFolders(prev => prev.map(folder => 
        folder.id === editingFolder.id ? { ...folder, ...updated } : folder
      ));
      
      showToast(`Renamed to "${editingFolder.name}"`, "success");
      setIsRenameModalOpen(false);
      setEditingFolder(null);
    } catch (error) {
      showToast("Failed to rename folder.", "error");
    }
  };
  
  const formatFileSize = (bytes) => {
    const size = Number(bytes) || 0;
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleDelete = async (id, name) => {
    try {
      await deleteFolder(id);
      setFolders(prev => prev.filter(f => f.id !== id));
      showToast(`Deleted ${name}`, "success");
    } catch (error) {
      showToast(`Failed to delete ${name}.`, "error");
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <span className="text-gray-800 dark:text-gray-200">File Explorer</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Assets</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Organise your files.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition text-sm"
          >
            <i className="fas fa-folder-plus mr-2"></i> New Folder
          </button>
          <ViewToggle view={view} setView={setView} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Assets...</p>
        </div>
      ) : folders.length > 0 ? (
        <div className={view === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-12" 
          : "flex flex-col gap-4 mb-12"
        }>
          {folders.map(folder => (
            <FolderCard 
              key={folder.id}
              id={folder.id}
              name={folder.name}
              fileCount={folder.filesCount}
              size={formatFileSize(folder.size)}
              colorClass={folder.color}
              view={view}
              onRename={() => {
                setEditingFolder({ id: folder.id, name: folder.name });
                setIsRenameModalOpen(true);
              }}
              onDelete={() => handleDelete(folder.id, folder.name)}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white dark:bg-gray-800/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-700 mx-auto">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <i className="fas fa-folder-open text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No assets yet</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">
            Create your first folder to start organizing your files professionally.
          </p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gradient-bg text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition"
          >
            Create My First Folder
          </button>
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-500">
                  <i className="fas fa-folder-plus text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">New Folder</h3>
                  <p className="text-xs text-gray-400">Create a new workspace.</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Folder Name</label>
                <input 
                  type="text" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter name..." 
                  className="w-full px-5 py-4 rounded-2xl text-sm mb-6 bg-gray-50 dark:bg-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
              </div>
              <div className="flex space-x-3 justify-end">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition">Cancel</button>
                <button onClick={handleCreateFolder} className="gradient-bg text-white font-bold px-8 py-3 rounded-xl shadow-lg transition active:scale-95 text-sm">
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {isRenameModalOpen && editingFolder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-500">
                  <i className="fas fa-edit text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Rename Folder</h3>
                  <p className="text-xs text-gray-400">Updating workspace identification.</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Name</label>
                <input 
                  type="text" 
                  value={editingFolder.name}
                  onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                  placeholder="Enter name..." 
                  className="w-full px-5 py-4 rounded-2xl text-sm mb-6 bg-gray-50 dark:bg-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder()}
                />
              </div>
              <div className="flex space-x-3 justify-end">
                <button 
                  onClick={() => {
                    setIsRenameModalOpen(false);
                    setEditingFolder(null);
                  }} 
                  className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition"
                >
                  Cancel
                </button>
                <button onClick={handleRenameFolder} className="gradient-bg text-white font-bold px-8 py-3 rounded-xl shadow-lg transition active:scale-95 text-sm">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default FileExplorer;