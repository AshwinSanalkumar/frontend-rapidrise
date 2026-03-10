import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import UploadConfirmModal from '../components/ui/UploadConfirmModel';

const Dashboard = () => {
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hiddenInputRef = useRef(null);

  // Logic to handle file selection (Browse or Drop)
  const handleFiles = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files || e.dataTransfer.files);
    if (files.length > 0) {
      setStagedFiles((prev) => [...prev, ...files]);
      setIsModalOpen(true);
    }
    if (e.target.value) e.target.value = null;
  };

  const removeFile = (index) => {
    const updated = stagedFiles.filter((_, i) => i !== index);
    setStagedFiles(updated);
    if (updated.length === 0) setIsModalOpen(false);
  };

  const handleFinalUpload = (files, descriptions) => {
    // This is where you'd connect to your backend API
    console.log("Files:", files, "Descriptions:", descriptions);
    setIsModalOpen(false);
    setStagedFiles([]);
  };

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar relative">
      {/* Header Section */}
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Hello, Ashwin Sanalkumar</h1>
        <p className="text-gray-500 dark:text-gray-400">System Overview. Here is what's happening in your vault.</p>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.01]">
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
              <i className="fas fa-file-alt text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">+5 today</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold">Total Vault Files</p>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mt-1">1,284</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.01]">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold">Content Mix</p>
            <i className="fas fa-chart-pie text-indigo-400 text-sm"></i>
          </div>
          <div className="h-2 w-full flex rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mt-4">
            <div className="h-full bg-indigo-500" style={{ width: '45%' }}></div>
            <div className="h-full bg-purple-500" style={{ width: '30%' }}></div>
            <div className="h-full bg-emerald-500" style={{ width: '15%' }}></div>
            <div className="h-full bg-orange-400" style={{ width: '10%' }}></div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
            <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>Docs</div>
            <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5"></span>Img</div>
            <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>Vid</div>
            <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5"></span>Other</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.01]">
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
              <i className="fas fa-link text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-purple-500 bg-purple-50 dark:bg-purple-500/10 px-2 py-1 rounded-lg">Active</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold">Active Shared Assets</p>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mt-1">42</h3>
        </div>
      </div>

      {/* Main Grid: Staging Area & Storage Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          
          {/* QUICK STAGING AREA (DROP ZONE) */}
          <div 
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-indigo-50/30'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('bg-indigo-50/30')}
            onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('bg-indigo-50/30'); handleFiles(e); }}
            onClick={() => hiddenInputRef.current.click()}
            className="border-2 border-dashed border-indigo-200 dark:border-indigo-900 rounded-[2.5rem] p-16 text-center bg-white dark:bg-gray-800 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group relative"
          >
            <div className="bg-indigo-50 dark:bg-indigo-900/30 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all">
              <i className="fas fa-cloud-upload-alt text-indigo-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Quick Staging Area</h3>
            <p className="text-gray-400 mt-2">Drag files to prepare them for secure sharing.</p>
            <button className="mt-6 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-6 py-2 rounded-full">
              Browse Device
            </button>
            <input type="file" multiple className="hidden" ref={hiddenInputRef} onChange={handleFiles} />
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 dark:text-white text-lg">Recent Activity</h2>
              <button className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">Full History</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-8 py-4">File Name</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition group">
                    <td className="px-8 py-5 flex items-center space-x-4">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-500"><i className="fas fa-file-pdf"></i></div>
                      <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Marketing_Plan.pdf</span>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-bold rounded-full">Encrypted</span>
                    </td>
                    <td className="px-8 py-5 text-right text-xs text-gray-400 font-medium">2 mins ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Storage & Security */}
        <div className="space-y-8">
          {/* Storage Consumption Circle */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-white mb-8">Storage Consumption</h3>
            <div className="relative w-40 h-40 mx-auto">
              <svg className="transform -rotate-90 w-40 h-40" viewBox="0 0 160 160">
                <defs>
                  <linearGradient id="storageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
                <circle className="text-slate-100 dark:text-slate-800 stroke-current" cx="80" cy="80" r="70" strokeWidth="12" fill="none" />
                <circle 
                  cx="80" cy="80" r="70" 
                  strokeWidth="12" 
                  fill="none" 
                  stroke="url(#storageGradient)"
                  strokeDasharray="440" 
                  strokeDashoffset="154" 
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-gray-800 dark:text-white">65%</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Used</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase">Total Capacity</p>
                <p className="text-sm font-black text-gray-800 dark:text-white">0.65 GB / 1.0 GB</p>
              </div>
              <Link to="/storage" className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-indigo-600 transition">
                <i className="fas fa-expand-alt"></i>
              </Link>
            </div>
          </div>

          {/* Security Status Banner */}
          <div className="gradient-bg p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-4 flex items-center"><i className="fas fa-shield-alt mr-2"></i> Security Status</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Default link expiry is active. Links will expire after 5 minutes unless specified.</p>
              <div className="flex items-center space-x-3 bg-white/20 p-4 rounded-2xl">
                <i className="far fa-clock"></i>
                <span className="font-bold text-sm">5 Minute Expiry Policy</span>
              </div>
            </div>
            <i className="fas fa-fingerprint absolute -right-4 -bottom-4 text-white/10 text-9xl"></i>
          </div>
        </div>
      </div>

      {/* Upload Confirmation Modal */}
      <UploadConfirmModal 
        isOpen={isModalOpen}
        files={stagedFiles}
        onClose={() => {
          setIsModalOpen(false);
          setStagedFiles([]);
        }}
        onRemove={removeFile}
        onConfirm={handleFinalUpload}
      />
    </main>
  );
};

export default Dashboard;