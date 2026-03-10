import React, { useState, useMemo } from 'react';
import FileRow from '../../components/elements/FileRow';
import DeleteModal from '../../components/modals/DeleteModal';
import { useToast } from '../../components/common/ToastContent';

const Recents = () => {
  const { showToast } = useToast();
  const [fileToDelete, setFileToDelete] = useState(null);

  // Mock data with "lastAccessed" timestamps
  const [recentFiles, setRecentFiles] = useState([
    { id: 1, name: 'Project_Alpha_v2.fig', subtitle: 'Design System', modified: '2 mins ago', size: '42 MB', iconClass: 'fab fa-figma', colorClass: 'text-purple-500', bgClass: 'bg-purple-50 dark:bg-purple-900/20', timeframe: 'Today' },
    { id: 2, name: 'API_Documentation.pdf', subtitle: 'Technical Specs', modified: '1 hour ago', size: '1.2 MB', iconClass: 'fas fa-file-pdf', colorClass: 'text-red-500', bgClass: 'bg-red-50 dark:bg-red-900/20', timeframe: 'Today' },
    { id: 3, name: 'Q1_Financials.xlsx', subtitle: 'Spreadsheet', modified: 'Yesterday', size: '850 KB', iconClass: 'fas fa-file-excel', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-50 dark:bg-emerald-900/20', timeframe: 'Yesterday' },
    { id: 4, name: 'Team_Sync_Recording.mp4', subtitle: 'Video Meeting', modified: 'Yesterday', size: '156 MB', iconClass: 'fas fa-video', colorClass: 'text-blue-500', bgClass: 'bg-blue-50 dark:bg-blue-900/20', timeframe: 'Yesterday' },
    { id: 5, name: 'Deployment_Script.sh', subtitle: 'Shell Script', modified: '3 days ago', size: '4 KB', iconClass: 'fas fa-terminal', colorClass: 'text-gray-600', bgClass: 'bg-gray-100 dark:bg-gray-800', timeframe: 'Earlier this Week' },
  ]);

  // Grouping logic for the UI
  const groupedFiles = useMemo(() => {
    return recentFiles.reduce((groups, file) => {
      const timeframe = file.timeframe;
      if (!groups[timeframe]) groups[timeframe] = [];
      groups[timeframe].push(file);
      return groups;
    }, {});
  }, [recentFiles]);

  const confirmDelete = () => {
    setRecentFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
    showToast(`${fileToDelete.name} removed from recents`, "success");
    setFileToDelete(null);
  };

  return (
    <main className="flex-1 p-8 lg:p-12 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header section with activity pulse */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Live Activity</p>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recent Activity</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Continue where you left off with your latest assets.</p>
        </div>

        <button 
          onClick={() => showToast("Activity history cleared", "info")}
          className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl text-xs hover:text-indigo-600 transition shadow-sm active:scale-95"
        >
          Clear History
        </button>
      </header>

      {/* Grouped Content */}
      <div className="space-y-10">
        {Object.entries(groupedFiles).map(([timeframe, files]) => (
          <section key={timeframe} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">
              {timeframe}
            </h3>
            
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {files.map(file => (
                    <FileRow 
                      key={file.id} 
                      {...file} 
                      onDelete={(id, name) => setFileToDelete({id, name})}
                      onShare={(id, name) => showToast(`Link ready for ${name}`, "success")}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      {/* Empty State if no files exist */}
      {recentFiles.length === 0 && (
        <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
          <i className="fas fa-clock-rotate-left text-4xl text-gray-200 mb-4"></i>
          <p className="text-gray-400 font-medium">No recent activity found.</p>
        </div>
      )}

      {/* Modal for Deletion Confirmation */}
      <DeleteModal 
        isOpen={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        onDelete={confirmDelete}
        title="Remove from Recents?"
        message={`This will hide "${fileToDelete?.name}" from this list, but the file will remain safely in your vault.`}
        confirmText="Remove"
      />
    </main>
  );
};

export default Recents;