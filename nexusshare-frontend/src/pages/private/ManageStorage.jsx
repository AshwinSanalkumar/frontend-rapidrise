import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/common/ToastContent';

const ManageStorage = () => {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('All');

  // Mock storage data
  const [storageData] = useState({
    total: 1,
    used: 0.65,
    categories: [
      { name: 'Images', size: '2.4 GB', color: 'bg-blue-500', percentage: 33 },
      { name: 'Documents', size: '3.1 GB', color: 'bg-indigo-500', percentage: 43 },
      { name: 'Media', size: '1.2 GB', color: 'bg-purple-500', percentage: 17 },
      { name: 'Others', size: '0.5 GB', color: 'bg-gray-400', percentage: 7 },
    ]
  });

  // Expanded Mock Large Files Data to support filtering
  const [largeFiles, setLargeFiles] = useState([
    { id: 1, name: 'Main_Database_Backup.sql', size: '1.2 GB', date: 'Mar 01, 2026', type: 'Database', category: 'Others' },
    { id: 2, name: 'Project_Raw_Footage.mp4', size: '850 MB', date: 'Feb 28, 2026', type: 'Video', category: 'Media' },
    { id: 3, name: 'System_Archive_Final.zip', size: '420 MB', date: 'Feb 20, 2026', type: 'Archive', category: 'Others' },
    { id: 4, name: 'Brand_Assets_4K.psd', size: '310 MB', date: 'Feb 15, 2026', type: 'Design', category: 'Images' },
    { id: 5, name: 'Legal_Contract_Draft.pdf', size: '120 MB', date: 'Feb 10, 2026', type: 'Document', category: 'Documents' },
  ]);

  const usedPercentage = (storageData.used / storageData.total) * 100;

  // Logic: Filter files based on clicked category
  const filteredFiles = useMemo(() => {
    if (activeCategory === 'All') return largeFiles;
    return largeFiles.filter(file => file.category === activeCategory);
  }, [activeCategory, largeFiles]);

  const handleDeleteLargeFile = (id, name) => {
    setLargeFiles(largeFiles.filter(file => file.id !== id));
    showToast(`${name} deleted to free up space`, 'success');
  };

  const handleCleanUp = (type) => {
    showToast(`Scanning and cleaning ${type}...`, 'info');
    setTimeout(() => {
      showToast(`${type} optimization complete!`, 'success');
    }, 1500);
  };

  return (
    <main className="flex-1 p-8 lg:p-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <Link to="/Dashboard" className="hover:text-indigo-600 transition">Dashboard</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200">Storage</span>
        </nav>
      </div>

      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Vault Analyzer</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Deep-clean your storage and manage large assets.</p>
        </div>
        <div className="flex items-center space-x-3">
          {activeCategory !== 'All' && (
            <button 
              onClick={() => setActiveCategory('All')}
              className="px-3 py-2 text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 transition"
            >
              Reset Filter
            </button>
          )}
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
             <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Status: {usedPercentage > 90 ? 'Critical' : 'Healthy'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-1">Storage Distribution</span>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                  {storageData.used} <span className="text-lg text-gray-400 font-bold">/ {storageData.total} GB</span>
                </h2>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold ${usedPercentage > 80 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {usedPercentage.toFixed(1)}% Capacity
                </span>
              </div>
            </div>

            {/* Clickable Progress Bar */}
            <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex mb-8 cursor-pointer">
              {storageData.categories.map((cat, idx) => (
                <div 
                  key={idx} 
                  style={{ width: `${cat.percentage}%` }} 
                  className={`${cat.color} h-full transition-all duration-300 hover:brightness-125 ${activeCategory !== 'All' && activeCategory !== cat.name ? 'opacity-30' : 'opacity-100'}`}
                  onClick={() => setActiveCategory(cat.name)}
                  title={`View ${cat.name} files`}
                />
              ))}
            </div>

            {/* Clickable Legend Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {storageData.categories.map((cat, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all ${activeCategory === cat.name ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200' : 'bg-gray-50 dark:bg-gray-900/50 border-transparent hover:border-gray-200'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{cat.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{cat.size}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Large Files Management - Filtered */}
          <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {activeCategory === 'All' ? 'Large Files Discovery' : `${activeCategory} Assets`}
              </h3>
              <span className="text-[10px] font-bold bg-rose-50 dark:bg-rose-900/20 text-rose-500 px-3 py-1 rounded-full uppercase tracking-wider">
                {filteredFiles.length} Items
              </span>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700 min-h-[100px]">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <div key={file.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{file.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{file.type} • Added {file.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <span className="text-sm font-black text-gray-700 dark:text-gray-300">{file.size}</span>
                      <button 
                        onClick={() => handleDeleteLargeFile(file.id, file.name)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-400 text-sm font-medium italic">
                  No large {activeCategory.toLowerCase()} found.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Optimization Hub - Design Maintained */}
        <div className="space-y-6">
{/* Replace the Insights section in ManageStorage.jsx with this */}
<section className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 group">
  <div className="flex justify-between items-start mb-4">
    <h3 className="text-xl font-bold">Storage Insights</h3>
    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
      <i className="fas fa-sparkles text-sm"></i>
    </div>
  </div>
  <div className="space-y-4">
    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
      <p className="text-xs text-white/60 mb-1 font-bold uppercase tracking-wider">Potential Savings</p>
      <p className="text-2xl font-black">2.4 GB</p>
    </div>
    <p className="text-sm text-indigo-100 leading-relaxed font-medium">
      NexusShare found <span className="font-bold text-white">14 duplicate assets</span> taking up unnecessary space in your vault.
    </p>
    <Link 
      to="/storage/duplicates"
      className="w-full py-4 bg-white text-indigo-600 font-bold rounded-xl hover:shadow-lg transition active:scale-95 flex items-center justify-center group"
    >
      Manage Duplicates
      <i className="fas fa-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform"></i>
    </Link>
  </div>
</section>

          <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Cleanup</h3>
             <div className="space-y-3">
                <button onClick={() => handleCleanUp('Temporary Cache')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 transition group">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-broom text-amber-500"></i>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">System Cache</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400">124 MB</span>
                </button>
                <button onClick={() => handleCleanUp('Vault Trash')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 transition group">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-trash text-rose-500"></i>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Empty Trash</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400">2.1 GB</span>
                </button>
             </div>
          </section>

          <section className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem]">
            <div className="flex items-center space-x-3 mb-2">
              <i className="fas fa-shield-check text-emerald-500"></i>
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Privacy Report</h4>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80 font-medium leading-relaxed">
              All cleanup operations are performed locally. No file metadata is ever exposed to the cloud during optimization.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ManageStorage;