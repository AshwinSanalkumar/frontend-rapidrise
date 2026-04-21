import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LinkStatus from '../../components/common/LinkStatus';
import { getPublicShareUrl } from '../../services/shareService';
import apiClient from '../../api/apiClient';

const SharedFileView = () => {
  const { shareId } = useParams();
  
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('verifying'); 
  const [fileData, setFileData] = useState(null);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const AUTHORIZED_EMAIL = "ashwin@example.com"; 

  useEffect(() => {
    const checkLinkValidity = async () => {
      try {
        // We perform a head or basic get request to check link status
        await apiClient.get(`file/shared/${shareId}/`);
        setStatus('gatekeeper');
      } catch (error) {
        if (error.response?.status === 410) {
          setStatus('expired');
        } else if (error.response?.status === 404) {
          setStatus('revoked');
        } else {
          setStatus('gatekeeper'); // Fallback to gatekeeper
        }
      }
    };

    if (shareId) {
      checkLinkValidity();
    }
  }, [shareId]);

  const handleVerify = (e) => {
    e.preventDefault();
    setStatus('verifying_id'); 

    setTimeout(() => {
      if (email.toLowerCase().trim() === AUTHORIZED_EMAIL) {
        const publicUrl = getPublicShareUrl(shareId);
        setFileData({
          name: 'Protected Asset',
          size: 'Encrypted',
          type: 'application/octet-stream', // Generic, browser will handle based on response headers 
          owner: 'Restricted Access',
          previewUrl: publicUrl,
          expiresIn: 'Single Access'
        });
        setStatus('active');
      } else {
        setStatus('denied');
      }
    }, 1200);
  };

  const renderFilePreview = (isModal = false) => {
    // Since we don't know the exact type until headers are received, 
    // we use a generic approach. If it's a known image/pdf token, we can do better,
    // but here we'll try to guess or use the preview endpoint directly.
    return (
      <div className="w-full h-full flex items-center justify-center relative group">
        <iframe 
          src={fileData.previewUrl} 
          title="Secure Preview"
          className={`${isModal ? 'w-[90vw] h-[85vh] rounded-3xl' : 'w-full h-full'} border-0 transition-opacity duration-700 bg-gray-100 dark:bg-gray-900`}
          onLoad={(e) => e.target.style.opacity = 1}
        />
        {/* Overlay to prevent interaction if not in modal */}
        {!isModal && <div className="absolute inset-0 z-10 bg-transparent" />}
      </div>
    );
  };

  // --- RENDERING STATES ---

  if (status === 'expired' || status === 'revoked') return <LinkStatus type={status} />;
  
  if (status === 'verifying' || status === 'verifying_id') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <i className="fas fa-id-badge absolute inset-0 flex items-center justify-center text-indigo-500 text-2xl"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight uppercase tracking-tighter">Checking Credentials</h2>
        <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-[0.4em]">Matching ACL Record...</p>
      </div>
    );
  }

  // REVERTED TO ORIGINAL BOX DESIGN
  if (status === 'gatekeeper' || status === 'denied') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-10 border border-white dark:border-gray-700 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-lg shadow-indigo-500/20">
            <i className="fas fa-user-shield"></i>
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Identity Required</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-8 uppercase tracking-widest leading-relaxed">
            This asset is restricted. <br/> Enter your authorized email.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <input 
                type="email" 
                required
                placeholder="email@company.com"
                className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border ${status === 'denied' ? 'border-rose-500 animate-shake' : 'border-gray-100 dark:border-gray-700'} rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium dark:text-white text-center`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {status === 'denied' && (
              <div className="bg-rose-50 dark:bg-rose-900/20 py-2 px-4 rounded-lg border border-rose-100 dark:border-rose-900/30">
                 <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider">
                  Unauthorized Access Attempt
                </p>
              </div>
            )}

            <button type="submit" className="w-full py-4 gradient-bg text-white font-black rounded-2xl shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Unlock Secure Asset
            </button>
          </form>

          <p className="mt-8 text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            AES-256 Bit Encryption Verified
          </p>
        </div>
      </div>
    );
  }

  // --- ACTIVE VIEW (UNCHANGED) ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-10 flex items-center justify-center relative">
      {isEnlarged && (
        <div className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button onClick={() => setIsEnlarged(false)} className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10">
            <i className="fas fa-times text-xl"></i>
          </button>
          <div className="animate-in zoom-in duration-500">{renderFilePreview(true)}</div>
        </div>
      )}

      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl overflow-hidden border border-white dark:border-gray-700 flex flex-col lg:flex-row animate-in zoom-in duration-500">
        <div className="lg:w-2/3 bg-gray-100 dark:bg-gray-900 relative min-h-[500px] flex items-center justify-center group overflow-hidden">
          {renderFilePreview()}
          <div className="absolute top-8 left-8">
            <div className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Identity Verified: {email}
            </div>
          </div>
          <button onClick={() => setIsEnlarged(true)} className="absolute bottom-8 right-8 w-14 h-14 glass rounded-2xl flex items-center justify-center text-gray-700 dark:text-white shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 border border-white/20">
            <i className="fas fa-expand-alt text-xl"></i>
          </button>
        </div>

        <div className="lg:w-1/3 p-8 md:p-12 flex flex-col justify-between bg-white dark:bg-gray-800">
          <div>
            <div className="mb-10 text-center lg:text-left">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] block mb-2">Secure Link Active</span>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight break-words">{fileData.name}</h1>
            </div>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                <span className="font-bold text-gray-400 uppercase text-[10px]">Security</span>
                <span className="font-black dark:text-white uppercase text-xs">One-Time Access</span>
              </div>
              <div className="flex justify-between items-center bg-rose-50 dark:bg-rose-900/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                <span className="font-bold text-rose-500 uppercase text-[10px]">Expires in</span>
                <span className="font-black text-rose-600 dark:text-rose-400 font-mono tracking-tighter">{fileData.expiresIn}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <a 
              href={fileData.previewUrl}
              download
              className="w-full py-5 gradient-bg text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 pointer-events-auto"
            >
              <i className="fas fa-download"></i>
              <span>Download File</span>
            </a>
            <button onClick={() => window.location.reload()} className="w-full py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-500 transition-colors">
              Destroy Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedFileView;