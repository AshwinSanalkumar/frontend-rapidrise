import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import GlobalFileDrop from './GlobalFileDrop';
import { fetchFiles } from '../../services/fileService';
import FileCard from '../elements/FIleCard';
import ShareModal from '../modals/ShareModal';
import Pagination from './Pagination';
import ViewToggle from './ViewToggle';

/**
 * A reusable file browser component used by MyFiles, Favorites, etc.
 * 
 * @param {string} title - Page title.
 * @param {string} subtitle - Page subtitle.
 * @param {function} initialFilter - Optional filter function for the initial data (e.g. f => f.isFavorite).
 * @param {object} emptyState - Config for when no files are found.
 * @param {string} emptyState.icon - FontAwesome icon class.
 * @param {string} emptyState.title - Empty state title.
 * @param {string} emptyState.message - Empty state message.
 */
const FileBrowser = ({ 
  title, 
  subtitle, 
  showFavoritesOnly = false,
  initialFilter = () => true, 
  emptyState = {
    icon: 'fa-search',
    title: 'No files found',
    message: "We couldn't find anything matching your search. Try checking your spelling or use different keywords."
  }
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [view, setView] = useState('grid');
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(pageParam);
  const filesPerPage = 8;
  // Extract search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('search') || '';

  // Fetch files from API when page, searchTerm, or a upload event happens
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFiles(currentPage, searchTerm, showFavoritesOnly); 
        setFiles(data.files.filter(initialFilter));
        setTotalFiles(data.count);
      } catch (error) {
        console.error('Failed to load files:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFiles();

    // Listen for global upload events to refresh the list
    const handleUploadEvent = () => loadFiles();
    window.addEventListener('file-uploaded', handleUploadEvent);

    return () => {
      window.removeEventListener('file-uploaded', handleUploadEvent);
    };

  }, [currentPage, searchTerm, showFavoritesOnly]);

  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('page');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchTerm]);

  // Sync state with URL manually if needed (e.g. back button)
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [searchParams]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNumber);
    setSearchParams(newParams);
  };

  // Handle local favorite toggle to keep UI in sync
  const handleToggleFavorite = (fileId, isFavorite) => {
    setFiles(prev => {
      const updated = prev.map(f => f.id === fileId ? { ...f, isFavorite } : f)
      return updated;
    });
  };

  // Server-side search and pagination means files ARE the currentFiles
  const currentFiles = files;

  const openModal = (file) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const clearSearch = () => {
    navigate(location.pathname);
  };

  return (
    <GlobalFileDrop>
      <main className="flex-1 p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>

        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <Link to="/dashboard" className="hover:text-indigo-600 transition text-gray-500">Dashboard</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200">{title}</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 sm:gap-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {searchTerm ? `Results for "${searchTerm}"` : title}
            </h1>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="text-xs font-bold text-indigo-500 hover:underline bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full"
              >
                Clear Search
              </button>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {searchTerm ? `Found ${totalFiles} matching items` : subtitle}
          </p>
        </div>

        {/* Actions Container */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          <Link to="/send-request"
            className="flex-1 sm:flex-none gradient-bg text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <i className="fas fa-file-import"></i>
            Request File
          </Link>
          <ViewToggle view={view} setView={setView} />
        </div>
      </div>

      {/* Files Grid/List */}
      <div className={view === 'grid'
        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
        : "flex flex-col gap-4"
      }>
        {isLoading ? (
          <div className="col-span-full py-24 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Accessing Vault...</p>
          </div>
        ) : currentFiles.length > 0 ? (
          currentFiles.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onShare={openModal}
              view={view}
              onToggleFavorite={handleToggleFavorite}
              currentPage={currentPage}
            />
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white dark:bg-gray-800/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className={`fas ${emptyState.icon} text-gray-400 text-xl`}></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{emptyState.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-1">
              {emptyState.message}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Container */}
      {totalFiles > filesPerPage && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalFiles={totalFiles}
            filesPerPage={filesPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <ShareModal
        isOpen={isModalOpen}
        file={selectedFile}
        onClose={() => setIsModalOpen(false)}
      />
      </main>
    </GlobalFileDrop>
  );
};

export default FileBrowser;
