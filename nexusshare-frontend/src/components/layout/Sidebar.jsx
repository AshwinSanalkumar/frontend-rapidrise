import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useToast } from '../ui/ToastContent';
import UploadConfirmModal from '../ui/UploadConfirmModel';

const SidebarLink = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `sidebar-link flex items-center px-4 py-2.5 transition rounded-xl ${
        isActive 
          ? 'active-link font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-r-4 border-indigo-600' 
          : 'text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800'
      }`
    }
  >
    <i className={`fas ${icon} mr-3 text-lg w-6 text-center`}></i>
    <span className="flex-1">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  // States to handle the modal and staging
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);

  // 1. When files are selected from the button
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setStagedFiles(files); // Put files in "waiting" area
      setIsModalOpen(true);  // OPEN THE MODAL (Just like Dashboard)
    }
    event.target.value = null; // Clear input so same file can be picked again
  };

  // 2. Remove file from the Modal list
  const removeStagedFile = (index) => {
    const updated = stagedFiles.filter((_, i) => i !== index);
    setStagedFiles(updated);
    if (updated.length === 0) setIsModalOpen(false);
  };

  // 3. User clicks "Confirm & Secure" in the Modal
  const handleConfirmUpload = () => {
    const newUploads = stagedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      progress: 0
    }));

    setIsModalOpen(false);
    setUploadingFiles(prev => [...prev, ...newUploads]);
    showToast(`Securing ${stagedFiles.length} files...`, "success");

    // Simulate the progress bars in the sidebar
    newUploads.forEach(upload => {
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.floor(Math.random() * 25) + 5;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.id !== upload.id));
          }, 2000);
        }
        setUploadingFiles(prev => prev.map(f => f.id === upload.id ? { ...f, progress: prog } : f));
      }, 500);
    });

    setStagedFiles([]); // Clear staged files after starting upload
  };

  return (
    <>
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 hidden lg:flex flex-col sticky top-[73px] h-[calc(100vh-73px)]">
        
        <div className="px-6 py-6">
          <button 
            onClick={() => fileInputRef.current.click()}
            className="w-full gradient-bg text-white font-bold py-3 rounded-2xl shadow-lg hover:shadow-indigo-200 transition flex items-center justify-center group active:scale-95"
          >
            <i className="fas fa-plus mr-2 group-hover:rotate-90 transition-transform"></i> 
            New Upload
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            multiple 
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          <nav className="space-y-1">
            <SidebarLink to="/dashboard" icon="fa-th-large" label="Dashboard" />
            <SidebarLink to="/files" icon="fa-folder-open" label="My Files" />
            <SidebarLink to="/shared" icon="fa-share-alt" label="Shared Links" />
            <SidebarLink to="/Favorites" icon="fa-heart" label="Favorites" />
            <div className="pt-6">
              <p className="px-4 text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-2">Storage</p>
              <SidebarLink to="/file-explore" icon="fa-compass" label="Explorer" />
              <SidebarLink to="/recent" icon="fa-history" label="Recent" />
            </div>
            <div className="pt-6">
              <p className="px-4 text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-2">System</p>
              <SidebarLink to="/bin" icon="fa-trash-alt" label="Bin" />
            </div>
          </nav>

          {/* ACTIVE UPLOADS LIST (Visible after Modal Confirmation) */}
          {uploadingFiles.length > 0 && (
            <div className="mt-8 px-2 space-y-2">
               <p className="px-4 text-[10px] uppercase tracking-widest text-indigo-500 font-extrabold mb-3">Uploading...</p>
               {uploadingFiles.map(file => (
                 <div key={file.id} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 mx-2">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 truncate pr-2">{file.name}</span>
                      <span className="text-[9px] text-gray-400">{file.progress}%</span>
                   </div>
                   <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${file.progress}%` }}></div>
                   </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Storage Stats Indicator */}
        <div className="p-6 border-t border-gray-50 dark:border-gray-800/50">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-3">Cloud Storage</p>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full gradient-bg w-[65%]"></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 font-medium">0.65 GB of 1 GB</p>
          </div>
        </div>
      </aside>

      {/* --- THE MODAL (Triggered by Button selection) --- */}
      <UploadConfirmModal 
        isOpen={isModalOpen} 
        files={stagedFiles} 
        onClose={() => setIsModalOpen(false)} 
        onRemove={removeStagedFile}
        onConfirm={handleConfirmUpload}
      />
    </>
  );
};

export default Sidebar;