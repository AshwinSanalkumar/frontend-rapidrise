import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { fetchFiles } from '../../services/fileService';
import FileCard from '../../components/elements/FIleCard';
import ShareModal from '../../components/modals/ShareModal';
import Pagination from '../../components/common/Pagination';
import ViewToggle from '../../components/common/ViewToggle';

const MyFiles = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [view, setView] = useState('grid');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 8;

  // Fetch files from API
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFiles();
        setFiles(data);
      } catch (error) {
        console.error('Failed to load files:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFiles();
  }, []);

  // Extract search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('search') || '';

  // Reset to first page whenever search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter logic
  const filteredData = useMemo(() => {
    if (!searchTerm) return files;
    const term = searchTerm.toLowerCase().trim();
    return files.filter(file =>
      file.name.toLowerCase().includes(term) ||
      (file.subtitle && file.subtitle.toLowerCase().includes(term))
    );
  }, [searchTerm, files]);

  // Pagination logic on filtered data
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredData.slice(indexOfFirstFile, indexOfLastFile);

  const openModal = (name) => {
    setSelectedFile(name);
    setIsModalOpen(true);
  };

  const clearSearch = () => {
    navigate('/files');
  };

  return (
    <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>

        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <Link to="/dashboard" className="hover:text-indigo-600 transition text-gray-500">Dashboard</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200">My Files</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {searchTerm ? `Results for "${searchTerm}"` : 'My Files'}
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
            {searchTerm ? `Found ${filteredData.length} matching items` : 'Select a file to generate a secure sharing link.'}
          </p>
        </div>

        {/* Actions Container: Request Button + View Toggle */}
        <div className="flex items-center gap-3">
          <Link to="/send-request"

            className="gradient-bg text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition active:scale-95 flex items-center gap-2"
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
            />
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white dark:bg-gray-800/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-gray-400 text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No files found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-1">
              We couldn't find anything matching "{searchTerm}". Try checking your spelling or use different keywords.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Container */}
      {filteredData.length > filesPerPage && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalFiles={filteredData.length}
            filesPerPage={filesPerPage}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </div>
      )}

      <ShareModal
        isOpen={isModalOpen}
        fileName={selectedFile}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default MyFiles;