import React, { useState, useMemo, useEffect } from 'react';
import FileRow from '../../components/elements/FileRow';
import DeleteModal from '../../components/modals/DeleteModal';
import { useToast } from '../../components/common/ToastContent';
import { fetchRecentFiles } from '../../services/fileService';

const Recents = () => {
  const { showToast } = useToast();
  const [fileToDelete, setFileToDelete] = useState(null);

  const [recentFiles, setRecentFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecentFiles = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRecentFiles();
        setRecentFiles(data);
      } catch (err) {
        console.error("Failed to load recent files:", err);
        showToast("Could not load recent activity", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadRecentFiles();

    // Listen for global upload events to refresh the recent files list
    const handleUploadEvent = () => loadRecentFiles();
    window.addEventListener('file-uploaded', handleUploadEvent);
    return () => window.removeEventListener('file-uploaded', handleUploadEvent);
  }, []);

  // Helper to determine the timeframe group
  const getTimeframe = (dateString) => {
    if (!dateString) return "Previously Accessed";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) => 
      d1.getDate() === d2.getDate() && 
      d1.getMonth() === d2.getMonth() && 
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";
    
    // Check if within the last 7 days
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) return "Earlier this Week";
    
    return "Earlier this Month";
  };

  // Format a timestamp as a readable "last accessed" string
  const formatLastAccessed = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    if (isSameDay(date, today)) return `Today at ${timeStr}`;
    if (isSameDay(date, yesterday)) return `Yesterday at ${timeStr}`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ` at ${timeStr}`;
  };

  // Grouping logic — group by last accessed time
  const groupedFiles = useMemo(() => {
    return recentFiles.reduce((groups, file) => {
      const timeframe = getTimeframe(file.lastAccessedAt);
      if (!groups[timeframe]) groups[timeframe] = [];
      groups[timeframe].push(file);
      return groups;
    }, {});
  }, [recentFiles]);

  // Helper for file type styling
  const getFileConfig = (type) => {
    const iconMap = {
      pdf: { icon: 'fa-file-pdf', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
      image: { icon: 'fa-file-image', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
      excel: { icon: 'fa-file-excel', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
      word: { icon: 'fa-file-word', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
      zip: { icon: 'fa-file-archive', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
      default: { icon: 'fa-file', color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800' }
    };
    return iconMap[type] || iconMap.default;
  };

  const confirmDelete = () => {
    setRecentFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
    showToast(`${fileToDelete.name} removed from recents`, "success");
    setFileToDelete(null);
  };

  return (
    <main className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header section with activity pulse */}
       <div className="flex items-center space-x-4 mb-6 md:mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <span className="text-gray-800 dark:text-gray-200">Recents</span>
        </nav>
      </div>
      <header className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recent Activity</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Continue where you left off with your latest assets.</p>
        </div>

        <button 
          onClick={() => showToast("Activity history cleared", "info")}
          className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl text-xs hover:text-indigo-600 transition shadow-sm active:scale-95 text-center"
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
            
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px] sm:min-w-0">
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {files.map(file => {
                    const config = getFileConfig(file.type);
                    const lastAccessed = formatLastAccessed(file.lastAccessedAt);
                    return (
                      <FileRow 
                        key={file.id} 
                        id={file.id}
                        name={file.name}
                        subtitle={
                          lastAccessed
                            ? <span className="flex items-center gap-1 text-indigo-400 dark:text-indigo-300">
                                <i className="fas fa-clock text-[9px]"></i>
                                {lastAccessed}
                              </span>
                            : file.type.toUpperCase()
                        }
                        modified={file.date}
                        size={file.size}
                        iconClass={`fas ${config.icon}`}
                        colorClass={config.color}
                        bgClass={config.bg}
                        imageUrl={file.preview}
                        type={file.type}
                        onDelete={(id, name) => setFileToDelete({id, name})}
                        onShare={(id, name) => showToast(`Link ready for ${name}`, "success")}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
            </div>
          </section>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Fetching Activity...</p>
        </div>
      )}

      {/* Empty State if no files exist */}
      {!isLoading && recentFiles.length === 0 && (
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