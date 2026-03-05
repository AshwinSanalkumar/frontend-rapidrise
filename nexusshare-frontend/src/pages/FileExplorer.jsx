import React, { useState } from 'react';
import FolderCard from '../components/ui/FolderCard';
import ViewToggle from '../components/ui/ViewToggle'; 
import { useToast } from '../components/ui/ToastContent';

const FileExplorer = () => {
  const { showToast } = useToast();
  const [view, setView] = useState('grid');
  const [folders, setFolders] = useState([
    { id: 1, name: 'Product Specs', files: 12, size: '1.2 GB', color: 'text-amber-400' },
    { id: 2, name: 'Company Logos', files: 45, size: '400 MB', color: 'text-indigo-400' },
    { id: 3, name: 'Shared Designs', files: 8, size: '2.4 GB', color: 'text-emerald-400' },
  ]);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  
  // Form States
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null); // Stores {id, name}

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder = {
      id: Date.now(),
      name: newFolderName,
      files: 0,
      size: '0 KB',
      color: 'text-gray-400'
    };
    setFolders([...folders, newFolder]);
    setIsCreateModalOpen(false);
    setNewFolderName("");
    showToast(`Folder "${newFolderName}" created successfully!`);
  };

  // --- NEW: Rename Logic ---
  const handleRenameFolder = () => {
    if (!editingFolder.name.trim()) return;

    setFolders(folders.map(folder => 
      folder.id === editingFolder.id 
        ? { ...folder, name: editingFolder.name } 
        : folder
    ));
    
    showToast(`Renamed to "${editingFolder.name}"`, "success");
    setIsRenameModalOpen(false);
    setEditingFolder(null);
  };

  const handleDelete = (id, name) => {
    setFolders(folders.filter(f => f.id !== id));
    showToast(`Deleted ${name}`, "success");
  };

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6 font-medium">
        <span className="text-gray-600 dark:text-gray-200">Organise your files</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Assets</h1>
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

      <div className={view === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-12" 
        : "flex flex-col gap-4 mb-12"
      }>
        {folders.map(folder => (
          <FolderCard 
            key={folder.id}
            name={folder.name}
            fileCount={folder.files}
            size={folder.size}
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