import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LinkStatus from '../../components/common/LinkStatus'; // We will use this for error states

const SharedFileView = () => {
  const { shareId } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, active, expired, revoked
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    // Simulate Decryption & Validation Logic
    const validateAccess = () => {
      setTimeout(() => {
        // Mocking a successful response
        // In a real scenario, you'd check the 5-minute expiry timestamp here
        setFileData({
          name: 'Core_System_Architecture.png',
          size: '3.2 MB',
          type: 'image/png',
          owner: 'Senior Dev Team',
          previewUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop',
          expiresIn: '04:52'
        });
        setStatus('active'); 
        
        // Example: If link was > 5 mins old, you'd setStatus('expired')
      }, 2000);
    };

    validateAccess();
  }, [shareId]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <i className="fas fa-shield-alt absolute inset-0 flex items-center justify-center text-indigo-500 text-2xl"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Decrypting Secure Link</h2>
        <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-[0.4em]">Zero-Knowledge Handshake</p>
      </div>
    );
  }

  // Handle Error States
  if (status === 'expired' || status === 'revoked') {
    return <LinkStatus type={status} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl overflow-hidden border border-white dark:border-gray-700 flex flex-col lg:row-span-1 lg:flex-row">
        
        {/* Left: Preview Section */}
        <div className="lg:w-2/3 bg-gray-100 dark:bg-gray-900 relative min-h-[400px] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700">
          {fileData.type.startsWith('image/') ? (
            <img 
              src={fileData.previewUrl} 
              alt="Secure Preview" 
              className="w-full h-full object-cover select-none"
              onContextMenu={(e) => e.preventDefault()} // Basic protection
            />
          ) : (
            <div className="text-center p-12">
              <i className="fas fa-file-shield text-8xl text-indigo-500/20 mb-6"></i>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Encrypted Preview Only</p>
            </div>
          )}
          
          <div className="absolute top-8 left-8">
            <div className="bg-black/20 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Verified Secure Asset
            </div>
          </div>
        </div>

        {/* Right: Info & Action Section */}
        <div className="lg:w-1/3 p-8 md:p-12 flex flex-col justify-between bg-white dark:bg-gray-800">
          <div>
            <div className="mb-10">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] block mb-2">Secure Transfer</span>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white break-words leading-tight">
                {fileData.name}
              </h1>
            </div>

            <div className="space-y-5 mb-10">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase text-[10px]">Size</span>
                <span className="font-black text-gray-800 dark:text-gray-200">{fileData.size}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase text-[10px]">Owner</span>
                <span className="font-black text-gray-800 dark:text-gray-200">{fileData.owner}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <span className="font-bold text-rose-500 uppercase text-[10px]">Time Left</span>
                <span className="font-black text-rose-600 dark:text-rose-400">{fileData.expiresIn}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full py-5 gradient-bg text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3">
              <i className="fas fa-download"></i>
              <span>Secure Download</span>
            </button>
            <p className="text-[9px] text-gray-400 text-center font-medium leading-relaxed uppercase tracking-tighter">
              Download hash verified. Transmission is encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedFileView;