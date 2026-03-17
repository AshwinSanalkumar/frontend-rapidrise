import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteModal from '../../components/modals/DeleteModal';
import { useToast } from '../../components/common/ToastContent';

const DuplicateManager = () => {
  const { showToast } = useToast();
  const [targetFile, setTargetFile] = useState(null);

  // Mock data: Grouped duplicates
  const [duplicateGroups, setDuplicateGroups] = useState([
    {
      id: "group-1",
      fileName: "architecture_v1_final.pdf",
      size: "2.4 MB",
      instances: [
        { id: 101, path: "/root/projects/archived", date: "Jan 12, 2026", isOriginal: true },
        { id: 102, path: "/root/backups/temp", date: "Feb 01, 2026", isOriginal: false },
      ]
    },
    {
      id: "group-2",
      fileName: "hero_background_4k.jpg",
      size: "12.8 MB",
      instances: [
        { id: 201, path: "/root/images/raw", date: "Dec 05, 2025", isOriginal: true },
        { id: 202, path: "/root/assets/web/unused", date: "Feb 28, 2026", isOriginal: false },
        { id: 203, path: "/root/desktop/imports", date: "Mar 02, 2026", isOriginal: false },
      ]
    }
  ]);

  const handleDeleteRequest = (file, instance) => {
    setTargetFile({ ...instance, name: file.fileName, groupId: file.id });
  };

  const confirmDelete = () => {
    setDuplicateGroups(prev => prev.map(group => {
      if (group.id === targetFile.groupId) {
        return { ...group, instances: group.instances.filter(i => i.id !== targetFile.id) };
      }
      return group;
    }).filter(group => group.instances.length > 1)); // Remove group if no duplicates left

    showToast(`Removed duplicate from ${targetFile.path}`, "success");
    setTargetFile(null);
  };

  return (
 <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
<div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
                                    <Link to="/dashboard" className="hover:text-indigo-600 transition text-gray-500">Dashboard</Link>
                  <i className="fas fa-chevron-right text-[10px]"></i> 
                  <Link to="/storage" className="hover:text-indigo-600 transition text-gray-500">Manage Storage</Link>
                  <i className="fas fa-chevron-right text-[10px]"></i> 
          <span className="text-gray-800 dark:text-gray-200">Duplicates</span>
        </nav>
      </div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center">
            <i className="fas fa-clone text-rose-500 mr-4"></i>
            Duplicate Finder
          </h1>
          <p className="text-gray-400 font-medium mt-1">Clean up redundant assets to save 2.4 GB</p>
        </div>


      </header>
      <div className="space-y-6">
        {duplicateGroups.map((group) => (
          <div key={group.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-8 py-5 bg-gray-50/50 dark:bg-gray-700/30 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-lg text-xs">
                  <i className="fas fa-copy"></i>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">{group.fileName}</h3>
              </div>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{group.size} per file</span>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {group.instances.map((instance) => (
                <div key={instance.id} className="px-8 py-5 flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{instance.path}</p>
                        {instance.isOriginal && (
                          <span className="text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-2 py-0.5 rounded-full uppercase">Keep</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Modified: {instance.date}</p>
                    </div>
                  </div>
                  
                  {!instance.isOriginal && (
                    <button 
                      onClick={() => handleDeleteRequest(group, instance)}
                      className="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900"
                    >
                      Delete Duplicate
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <DeleteModal 
        isOpen={!!targetFile}
        onClose={() => setTargetFile(null)}
        onDelete={confirmDelete}
        title="Delete Duplicate?"
        message={`Are you sure you want to remove the copy located in ${targetFile?.path}? This cannot be undone.`}
        confirmText="Remove Copy"
      />
    </main>
  );
};

export default DuplicateManager;