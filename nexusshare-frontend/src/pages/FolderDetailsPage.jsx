import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import FileRow from '../components/ui/FileRow';
import DeleteModal from '../components/ui/DeleteModal'; // Import the modal
import { useToast } from '../components/ui/ToastContent';
import NexusShareSelector from '../components/ui/NexusShareSelector';

const FolderDetail = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  // State for menus and modals
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isNexusModalOpen, setIsNexusModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null); // Track file for deletion
  
  const [files, setFiles] = useState([
    { id: 1, name: 'architecture_v1.pdf', subtitle: 'System Blueprint', modified: 'Oct 12, 2025', size: '2.4 MB', iconClass: 'fas fa-file-pdf', colorClass: 'text-red-500', bgClass: 'bg-red-50 dark:bg-red-900/20' },
    { id: 2, name: 'dashboard_mockup.png', subtitle: 'Image Preview', modified: 'Oct 15, 2025', size: '850 KB', imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=100&q=80' },
    { id: 3, name: 'schema_config.json', subtitle: '{ "env": "prod" ... }', modified: 'Oct 18, 2025', size: '12 KB', iconClass: 'fas fa-file-code', colorClass: 'text-amber-500', bgClass: 'bg-amber-50 dark:bg-amber-900/20' }
  ]);

  // --- Helpers: Icon and Formatting ---
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const icons = {
      pdf: { icon: 'fas fa-file-pdf', color: 'text-red-500', bg: 'bg-red-50' },
      jpg: { icon: 'fas fa-file-image', color: 'text-blue-500', bg: 'bg-blue-50' },
      png: { icon: 'fas fa-file-image', color: 'text-blue-500', bg: 'bg-blue-50' },
      default: { icon: 'fas fa-file', color: 'text-gray-400', bg: 'bg-gray-50' }
    };
    return icons[ext] || icons.default;
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // --- Action: File Deletion ---
  const handleDeleteClick = (id, name) => {
    setFileToDelete({ id, name });
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      setFiles(prev => prev.filter(file => file.id !== fileToDelete.id));
      showToast(`Successfully deleted ${fileToDelete.name}`, "success");
      setFileToDelete(null);
    }
  };

  // --- Action: Local Upload ---
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (uploadedFiles.length === 0) return;

    const newEntries = uploadedFiles.map(file => {
      const config = getFileIcon(file.name);
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        subtitle: file.type || 'Local File',
        modified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: formatSize(file.size),
        iconClass: config.icon,
        colorClass: config.color,
        bgClass: `${config.bg} dark:bg-opacity-10`,
        imageUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      };
    });

    setFiles(prev => [...newEntries, ...prev]);
    showToast(`Uploaded ${uploadedFiles.length} file(s)`, "success");
    setIsOptionsOpen(false);
  };

  // --- Action: Nexus Import ---
  const handleNexusImport = (selectedAssets) => {
    setFiles(prev => [...selectedAssets, ...prev]);
    setIsNexusModalOpen(false);
    showToast(`Imported ${selectedAssets.length} assets from Nexus`, "success");
  };

  return (
    <main className="flex-1 p-8 lg:p-12 relative">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple className="hidden" />
      {/* Header & Breadcrumbs */}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <Link to="/file-explore" className="hover:text-indigo-600 transition">Assets</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200">Product Specs</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Product Specs</h1>
          <p className="text-gray-500 mt-2 font-medium">Directory: /root/product-specs</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            className="gradient-bg text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center"
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
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700/30 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-8 py-6">Name & Preview</th>
              <th className="px-8 py-6">Modified</th>
              <th className="px-8 py-6">Size</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {files.map(file => (
              <FileRow 
                key={file.id} 
                {...file} 
                onDelete={() => handleDeleteClick(file.id, file.name)} // Pass delete handler
                onShare={(id, name) => showToast(`Link copied for ${name}`, "success")}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL INTEGRATIONS */}
      {isNexusModalOpen && (
        <NexusShareSelector 
          onClose={() => setIsNexusModalOpen(false)} 
          onImport={handleNexusImport} 
        />
      )}

      {/* Delete Confirmation Modal */}
<DeleteModal 
  isOpen={!!fileToDelete} 
  onClose={() => setFileToDelete(null)} 
  onDelete={confirmDelete}
  // No other props needed, it uses the "Delete" defaults!
/>
    </main>
  );
};

export default FolderDetail;