import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ExternalFilePreview = () => {
  const [status, setStatus] = useState('scanning'); 
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 5));
    }, 100);
    setTimeout(() => setStatus('validating'), 1500);
    setTimeout(() => setStatus('ready'), 3000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToVault = () => {
    // Logic to move the file from 'external/temp' to user's 'vault'
    alert("File successfully encrypted and moved to your private vault.");
  };

  return (
    <main className="flex-1 p-8 lg:p-12 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-start transition-colors duration-300">
    
      <div className="max-w-4xl w-full">
        
        {/* Transparent Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <Link to="/history" className="flex items-center group py-2">
            <i className="fas fa-arrow-left text-gray-400 group-hover:text-indigo-600 mr-3 transition-colors"></i>
            <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white transition-colors">
              Back to Audit Logs
            </span>
          </Link>

          <div className="flex items-center px-4 py-1.5 bg-white dark:bg-[#161926] border border-gray-100 dark:border-gray-800 rounded-full shadow-sm">
             <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Security Sandbox
             </span>
          </div>
        </div>

        {/* Main Vault Card */}
        <div className="bg-white dark:bg-[#161926] rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden border border-white dark:border-gray-800 min-h-[500px] flex flex-col transition-all">
          
          {status !== 'ready' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 border-2 border-gray-100 dark:border-gray-800 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
              <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
                {status === 'scanning' ? 'Forensic Analysis' : 'Finalizing Protocol'}
              </h2>
            </div>
          ) : (
            <>
              {/* Header with Two-Action Group */}
              <div className="p-8 flex justify-between items-center border-b border-gray-50 dark:border-gray-800 bg-white/50 dark:bg-[#161926]/50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mr-4 border border-gray-100 dark:border-gray-700">
                    <i className="fas fa-file-pdf text-red-500 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">Client_Tax_ID.pdf</h3>
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center mt-0.5">
                      <i className="fas fa-shield-check mr-1.5"></i> Verified Secure
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all flex items-center">
                    <i className="fas fa-download mr-2"></i> Download
                  </button>
                  <button 
                    onClick={handleAddToVault}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center"
                  >
                    <i className="fas fa-plus-circle mr-2"></i> Add to Vault
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center p-12 bg-gray-50/50 dark:bg-[#0f111a]/50">
                 <div className="text-center opacity-40">
                    <i className="fas fa-lock-alt text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em]">Isolated Preview Buffer</p>
                 </div>
              </div>
            </>
          )}
        </div>

        {/* Info Grid */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          {[
            { label: 'Source IP', val: '192.168.1.44', icon: 'fa-globe' },
            { label: 'Token ID', val: 'REQ_9921_X', icon: 'fa-key' },
            { label: 'Scan Result', val: 'Pass', icon: 'fa-check-double' }
          ].map((item, i) => (
            <div key={i} className="bg-white/60 dark:bg-[#161926]/40 backdrop-blur-sm p-5 rounded-3xl border border-white dark:border-gray-800 shadow-sm group hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
              <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center">
                <i className={`fas ${item.icon} mr-2 opacity-50`}></i> {item.label}
              </p>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.val}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ExternalFilePreview;