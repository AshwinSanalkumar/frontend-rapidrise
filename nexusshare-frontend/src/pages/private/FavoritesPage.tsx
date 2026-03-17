import React, { useState, useMemo } from 'react';
import FileCard from '../../components/elements/FIleCard';
import ShareModal from '../../components/modals/ShareModal'; // Import your modal
import { useToast } from '../../components/common/ToastContent';
import ViewToggle from '../../components/common/ViewToggle';

const FavoritesPage = () => {
  const { showToast } = useToast();
  const [view, setView] = useState('grid');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const [files, setFiles] = useState([
    { id: 1, name: "Project_Final_Logo.png", date: "Feb 25, 2026", size: "1.8 MB", type: "image", status: "SECURED", isFavorite: true, preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Q1_Financial_Report.pdf", date: "Feb 20, 2026", size: "4.2 MB", type: "pdf", status: "PRIVATE", isFavorite: true },
    { id: 3, name: "Brand_Guidelines.pdf", date: "Feb 15, 2026", size: "12.5 MB", type: "pdf", status: "SECURED", isFavorite: true },
    { id: 3, name: "Brand_Guidelines.pdf", date: "Feb 15, 2026", size: "12.5 MB", type: "pdf", status: "SECURED", isFavorite: true },
    { id: 3, name: "Brand_Guidelines.pdf", date: "Feb 15, 2026", size: "12.5 MB", type: "pdf", status: "SECURED", isFavorite: true },
    { id: 3, name: "Brand_Guidelines.pdf", date: "Feb 15, 2026", size: "12.5 MB", type: "pdf", status: "SECURED", isFavorite: true },
  ]);

  const favoriteFiles = useMemo(() => files.filter(f => f.isFavorite), [files]);

  // Explicitly typing the parameter as a string
  const handleShareTrigger = (fileName: string): void => {
    setSelectedFileName(fileName);
    setIsShareModalOpen(true);
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <span className="text-gray-800 dark:text-gray-200">Favorites</span>
        </nav>
      </div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center">
            <i className="fas fa-heart text-rose-500 mr-4"></i>
            Favorites
          </h1>
          <p className="text-gray-400 font-medium mt-1">Access your most important secured files instantly.</p>
        </div>

        <ViewToggle view={view} setView={setView} />
      </header>

      {favoriteFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <i className="far fa-heart text-4xl text-gray-300"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No favorites yet</h3>
        </div>
      ) : (
        <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
          {favoriteFiles.map(file => (
            <FileCard
              key={file.id}
              file={file}
              view={view}
              onShare={handleShareTrigger} // Pass the trigger here
            />
          ))}
        </div>
      )}

      {/* 2. Global Modal Component */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        fileName={selectedFileName}
      />


    </main>
  );
};

export default FavoritesPage;