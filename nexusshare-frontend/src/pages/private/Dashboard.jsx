import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UploadConfirmModal from '../../components/modals/UploadConfirmModel';
import { fetchFiles, uploadFiles, } from '../../services/fileService';
import { useToast } from '../../components/common/ToastContent';
import { fetchSharedLinks } from '../../services/shareService';
import { fetchMe } from '../../services/authService';

const Dashboard = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalSharedFiles, setTotalSharedFiles] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hiddenInputRef = useRef(null);

  useEffect(() => { 
    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([loadFiles(), loadShared(), loadUser()]);
      setIsLoading(false);
    };
    loadInitialData();
  }, []);
  
  useEffect(() => {
    const handleUploadEvent = () => loadFiles();
    window.addEventListener('file-uploaded', handleUploadEvent);
    return () => window.removeEventListener('file-uploaded', handleUploadEvent);
  }, []);

  const loadFiles = async () => {
    try {
      const data = await fetchFiles();
      setFiles(data.files || []);
      setTotalFiles(data.count || 0);
    } catch (error) { console.error(error); }
  };

  const loadShared = async () => {
    try {
      const data = await fetchSharedLinks(1, '', 'active', '');
      setTotalSharedFiles(data.count || 0);
    } catch (error) { console.error(error); }
  };

  const loadUser = async () => {
    try {
      const data = await fetchMe();
      setUserData(data);
    } catch (error) { console.error(error); }
  };

  const handleFiles = (e) => {
    e.preventDefault();
    const filesArray = Array.from(e.target.files || e.dataTransfer.files);
    if (filesArray.length > 0) {
      setStagedFiles((prev) => [...prev, ...filesArray]);
      setIsModalOpen(true);
    }
    if (e.target.value) e.target.value = null;
  };

  const handleFinalUpload = async (filesToUpload, descriptions) => {
    setIsUploading(true);
    try {
      const { successes, failures } = await uploadFiles(filesToUpload, descriptions);
      if (successes.length > 0) {
        showToast(`${successes.length} file(s) uploaded successfully!`, 'success');
        window.dispatchEvent(new CustomEvent('file-uploaded'));
        navigate('/files');
      }
       if (failures.length > 0) {
        showToast(`${failures.length} file(s) failed to upload.`, 'error');
      }
      setIsModalOpen(false);
      setStagedFiles([]);
    } catch (error) { 
        showToast(`Upload failed. Please try again.`, 'error');
    } 
    finally { setIsUploading(false); }
  };

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-gray-900">
      
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Hello, {userData?.full_name || '...'}</h1>
        <p className="text-gray-500 dark:text-gray-400">System Overview. Here is what's happening in your vault.</p>
      </header>

      {/* Top Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
        <div className="xl:col-span-9 space-y-8">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFiles}
            onClick={() => hiddenInputRef.current.click()}
            className="h-52 border-2 border-dashed border-indigo-200 dark:border-gray-700 rounded-[3rem] bg-white dark:bg-gray-800/40 flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer group hover:bg-indigo-50/30 dark:hover:bg-gray-800 hover:border-indigo-400 w-full"
          >
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i className="fas fa-cloud-arrow-up text-2xl text-indigo-500 group-hover:text-indigo-600"></i>
            </div>
            <h3 className="text-lg font-black text-gray-800 dark:text-white">Quick Drop Zone</h3>
            <p className="text-gray-400 text-sm mt-1">Drag assets here for immediate vault encryption.</p>
            <input type="file" multiple className="hidden" ref={hiddenInputRef} onChange={handleFiles} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-between min-h-[180px]">
              <h3 className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Storage</h3>
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-auto" viewBox="0 0 200 120">
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className="text-slate-100 dark:text-slate-900" />
                  <path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke="#6366f1" 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * (Math.min(100, Math.round(((userData?.consumed_storage || 0) / (userData?.storage_limit_bytes || 1024*1024*1024)) * 100))) / 100)} 
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                  <span className="text-xl font-black text-gray-800 dark:text-white">
                    {Math.min(100, Math.round(((userData?.consumed_storage || 0) / (userData?.storage_limit_bytes || 1024*1024*1024)) * 100))}%
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                {((userData?.consumed_storage || 0) / (1024*1024)).toFixed(2)} MB / {((userData?.storage_limit_bytes || 1024*1024*1024) / (1024*1024*1024)).toFixed(0)} GB
              </p>
            </div>

            <Link to="/files" className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:rotate-6 transition-transform">
                <i className="fas fa-file-shield text-base"></i>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-none">{isLoading ? '..' : totalFiles}</h3>
                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mt-2">Vault Assets</p>
              </div>
            </Link>

            <Link to="/shared" className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between group">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:rotate-6 transition-transform">
                <i className="fas fa-link text-base"></i>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-none">{isLoading ? '..' : totalSharedFiles}</h3>
                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mt-2">Shared Links</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-3 space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-4">Content Mix</p>
            <div className="h-1.5 w-full flex rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mb-6">
              <div className="h-full bg-indigo-500" style={{ width: '45%' }}></div>
              <div className="h-full bg-purple-500" style={{ width: '30%' }}></div>
              <div className="h-full bg-emerald-500" style={{ width: '25%' }}></div>
            </div>
            <div className="space-y-3">
              {['Docs', 'Images', 'Media'].map((type, i) => (
                <div key={type} className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  <div className="flex items-center">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${['bg-indigo-500', 'bg-purple-500', 'bg-emerald-500'][i]}`}></span>{type}
                  </div>
                  <span className="text-gray-900 dark:text-white">{[45, 30, 25][i]}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="gradient-bg p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-4 flex items-center"><i className="fas fa-shield-alt mr-2"></i> Security Status</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Default link expiry is active. Links will expire after 5 minutes unless specified.</p>
              <div className="flex items-center space-x-3 bg-white/20 p-2 rounded-2xl">
                <i className="far fa-clock"></i>
                <span className="font-bold text-sm">5 Minute Expiry Policy</span>
              </div>
            </div>
            <i className="fas fa-fingerprint absolute -right-4 -bottom-4 text-white/10 text-9xl"></i>
          </div>
        </div>
      </div>

      {/* COMPACT FULL-WIDTH RECENTS WITH DYNAMIC ICONS */}
      <div className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm w-full">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</h3>
          <Link to="/files" className="text-[9px] font-black text-indigo-600 hover:underline uppercase">
            Manage Vault <i className="fas fa-arrow-right scale-75 ml-1"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {files.slice(0, 5).map(file => {
            const iconMap = {
              pdf: { icon: 'fa-file-pdf', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
              image: { icon: 'fa-file-image', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              excel: { icon: 'fa-file-excel', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              word: { icon: 'fa-file-word', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
              zip: { icon: 'fa-file-archive', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              default: { icon: 'fa-file', color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800' }
            };
            const config = iconMap[file.type] || iconMap.default;

            return (
              <Link key={file.id} to={`/files/details/${file.id}`} className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/40 transition-all group flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 transition-colors ${config.bg}`}>
                  <i className={`fas ${config.icon} text-lg ${config.color}`}></i>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100 truncate">{file.name}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{file.date}</p>
                </div>
              </Link>
            );
          })}
          {files.length === 0 && <p className="col-span-full text-center text-gray-400 text-[11px] py-4 italic">No recent activity found.</p>}
        </div>
      </div>

      <UploadConfirmModal
        isOpen={isModalOpen}
        files={stagedFiles}
        isUploading={isUploading}
        onClose={() => { if (!isUploading) { setIsModalOpen(false); setStagedFiles([]); } }}
        onRemove={(i) => setStagedFiles(stagedFiles.filter((_, idx) => idx !== i))}
        onConfirm={handleFinalUpload}
      />
    </main>
  );
};

export default Dashboard;