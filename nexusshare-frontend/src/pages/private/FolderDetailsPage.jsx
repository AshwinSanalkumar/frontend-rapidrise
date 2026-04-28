import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import FileRow from '../../components/elements/FileRow';
import DeleteModal from '../../components/modals/DeleteModal'; 
import { useToast } from '../../components/common/ToastContent';
import NexusShareSelector from '../../components/modals/NexusShareSelector';
import { fetchFolderDetails, uploadFilesToFolder, importFilesToFolder, removeFileFromFolder } from '../../services/folderService';
import GlobalFileDrop from '../../components/common/GlobalFileDrop';


const FolderDetail = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  // State for data
  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for menus and modals
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isNexusModalOpen, setIsNexusModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null); 

  // Fetch folder details from API
  useEffect(() => {
    const loadFolderDetails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFolderDetails(id);
        setFolder(data);
        setFiles(data.files || []);
      } catch (error) {
        console.error('Failed to load folder details:', error);
        showToast("Failed to load folder contents.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadFolderDetails();
  }, [id]);

  // --- Action: File Deletion ---
  const handleDeleteClick = (fileId, name) => {
    setFileToDelete({ id: fileId, name });
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      try {
        // Many-To-Many: Unlink from folder instead of deleting the file entirely
        await removeFileFromFolder(id, fileToDelete.id);
        setFiles(prev => prev.filter(file => file.id !== fileToDelete.id));
        showToast(`Removed ${fileToDelete.name} from this folder`, "success");
      } catch (error) {
        console.error('Removal failed:', error);
        showToast(`Failed to remove ${fileToDelete.name}`, "error");
      } finally {
        setFileToDelete(null);
      }
    }
  };

  // --- Action: Local Upload ---
  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (uploadedFiles.length === 0) return;

    try {
      showToast(`Uploading ${uploadedFiles.length} file(s)...`, "info");
      await uploadFilesToFolder(id, uploadedFiles);
      
      // Refresh folder data to show new files
      const updatedData = await fetchFolderDetails(id);
      setFiles(updatedData.files || []);
      
      showToast(`Successfully uploaded ${uploadedFiles.length} file(s)`, "success");
    } catch (error) {
      console.error('Upload failed:', error);
      showToast("Failed to upload files.", "error");
    } finally {
      setIsOptionsOpen(false);
    }
  };

  // --- Action: Nexus Import ---
  const handleNexusImport = async (selectedFileIds) => {
    try {

      await importFilesToFolder(id, selectedFileIds);
      
      // Refresh folder data to show newly imported files
      const updatedData = await fetchFolderDetails(id);
      setFiles(updatedData.files || []);
      
      setIsNexusModalOpen(false);
      showToast(`Imported ${selectedFileIds.length} assets from Nexus vault`, "success");
    } catch (error) {
      console.error('Import failed:', error);
      showToast("Failed to import assets.", "error");
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-8 lg:p-12 flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Opening Directory...</p>
      </main>
    );
  }

  if (!folder) {
    return (
      <main className="flex-1 p-8 lg:p-12 flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <i className="fas fa-exclamation-triangle text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Folder Not Found</h2>
        <p className="text-gray-500 mb-8">The directory you are looking for might have been moved or deleted.</p>
        <Link to="/assets" className="gradient-bg text-white px-8 py-3 rounded-xl font-bold shadow-lg">Return to Assets</Link>
      </main>
    );
  }

  return (
        <GlobalFileDrop>
    <main className="flex-1 p-4 sm:p-8 lg:p-12 relative">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple className="hidden" />
      
      {/* Header & Breadcrumbs */}
      <div className="flex items-center space-x-4 mb-6 md:mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <Link to="/assets" className="hover:text-indigo-600 transition">Assets</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200 truncate max-w-[150px] sm:max-w-none">{folder.name}</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{folder.name}</h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            className="w-full sm:w-auto gradient-bg text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center"
          >
            <i className="fas fa-plus-circle mr-3"></i> Add Files
            <i className={`fas fa-chevron-down ml-4 text-[10px] transition-transform ${isOptionsOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isOptionsOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <button 
                onClick={() => { setIsOptionsOpen(false); fileInputRef.current.click(); }}
                className="w-full flex items-center px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mr-4 group-hover:scale-110 transition">
                  <i className="fas fa-desktop text-sm"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-tight">Local Storage</p>
                  <p className="text-[10px] text-gray-400">Upload from device</p>
                </div>
              </button>

              <button 
                onClick={() => { setIsOptionsOpen(false); setIsNexusModalOpen(true); }}
                className="w-full flex items-center px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-left group border-t border-gray-50 dark:border-gray-700"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center mr-4 group-hover:scale-110 transition">
                  <i className="fas fa-cloud-download-alt text-sm"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-tight">Nexus Share</p>
                  <p className="text-[10px] text-gray-400">Import from cloud</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Files Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        {files.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px] sm:min-w-0">
              <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-6">Name & Preview</th>
                  <th className="px-8 py-6 hidden sm:table-cell">Modified</th>
                  <th className="px-8 py-6 hidden md:table-cell">Size</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {files.map(file => (
                <FileRow 
                  key={file.id} 
                  id={file.id}
                  name={file.name}
                  subtitle={file.description || file.type}
                  modified={file.date}
                  size={file.size}
                  iconClass={file.type === 'image' ? null : 'fas fa-file'}
                  colorClass="text-indigo-500"
                  bgClass="bg-indigo-50 dark:bg-indigo-900/20"
                  imageUrl={file.preview}
                  type={file.type}
                  onDelete={() => handleDeleteClick(file.id, file.name)} 
                  onShare={(id, name) => showToast(`Link copied for ${name}`, "success")}
                />
              ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <i className="fas fa-file-alt text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No files here yet</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">
              This folder is currently empty. Start adding some assets to keep your workspace organized.
            </p>
            <button 
              onClick={() => fileInputRef.current.click()}
              className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold px-8 py-3 rounded-xl transition hover:bg-indigo-100"
            >
              Upload Files
            </button>
          </div>
        )}
      </div>

      {/* MODAL INTEGRATIONS */}
      {isNexusModalOpen && (
        <NexusShareSelector 
          onClose={() => setIsNexusModalOpen(false)} 
          onImport={handleNexusImport} 
        />
      )}

      {/* Remove Confirmation Modal */}
      <DeleteModal 
        isOpen={!!fileToDelete} 
        onClose={() => setFileToDelete(null)} 
        onDelete={confirmDelete}
        title="Remove from Folder?"
        message={`This will remove "${fileToDelete?.name}" from this folder. The file will still be safe in your main vault and other folders.`}
        confirmText="Remove"
        variant="warning"
        icon="fas fa-folder-minus"
      />
    </main>
    </GlobalFileDrop>
  );
};

export default FolderDetail;