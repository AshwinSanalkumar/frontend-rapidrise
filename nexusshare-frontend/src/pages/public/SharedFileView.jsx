import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LinkStatus from '../../components/common/LinkStatus';
import { getPublicShareUrl } from '../../services/shareService';
import { useToast } from '../../components/common/ToastContent';
import apiClient from '../../api/apiClient';

const SharedFileView = () => {
  const { shareId } = useParams();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('verifying');
  const [fileData, setFileData] = useState(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const AUTHORIZED_EMAIL = "ashwin@example.com";

  useEffect(() => {
    const checkLinkValidity = async () => {
      try {
        // Fetch metadata using HEAD to get MIME type and real filename without downloading
        const response = await apiClient.head(`file/shared/${shareId}/`);
        const contentType = response.headers['content-type'] || 'application/octet-stream';
        
        // Try to extract real filename from content-disposition
        let filename = 'Protected Asset';
        const disposition = response.headers['content-disposition'];
        if (disposition && disposition.includes('filename=')) {
          filename = disposition.split('filename=')[1].replace(/"/g, '');
        }

        const publicUrl = getPublicShareUrl(shareId);
        const downloadLimit = parseInt(response.headers['x-download-limit']);
        const downloadCount = parseInt(response.headers['x-download-count']);

        // Determine if file has an in-browser preview (image, pdf, video, audio)
        const hasBrowserPreview = (
          contentType.startsWith('image/') ||
          contentType.startsWith('video/') ||
          contentType.startsWith('audio/') ||
          contentType === 'application/pdf' ||
          filename.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mp3|wav|m4a|pdf)$/i)
        );

        setFileData({
          name: filename,
          size: response.headers['content-length'] ? `${(parseInt(response.headers['content-length']) / (1024 * 1024)).toFixed(2)} MB` : 'Encrypted',
          type: contentType,
          owner: 'Restricted Access',
          previewUrl: publicUrl,
          expiresIn: 'Single Access',
          downloadLimit: downloadLimit,
          downloadCount: downloadCount,
          accessCount: parseInt(response.headers['x-access-count'])
        });
        setStatus('active');

        // For non-previewable files the browser only fires HEAD (no GET for preview),
        // so we fire a lightweight ?track=true ping to register the access count.
        if (!hasBrowserPreview) {
          apiClient.get(`file/shared/${shareId}/?track=true`).catch(() => {});
        }

        // If it's a preview only link, let the user know immediately
        if (downloadLimit === 0) {
          showToast("Heads up: This is a preview-only link", "info");
        }
      } catch (error) {
        if (error.response?.status === 410) {
          setStatus('expired');
        } else if (error.response?.status === 404) {
          setStatus('revoked');
        } else if (error.response?.status === 403) {
          // Download limit reached or other restriction
          setStatus('denied');
          showToast(error.response.data?.error || "Access restricted", "error");
        } else {
          // Fallback to basic info if HEAD fails but link exists
          const publicUrl = getPublicShareUrl(shareId);
          setFileData({
            name: 'Protected Asset',
            size: 'Encrypted',
            type: 'application/octet-stream',
            owner: 'Restricted Access',
            previewUrl: publicUrl,
            expiresIn: 'Single Access'
          });
          setStatus('active');
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
        // Keep existing fileData and just unlock
        setStatus('active');
      } else {
        setStatus('denied');
      }
    }, 1200);
  };

  const handleDownloadClick = async (e) => {
    e.preventDefault();

    // Always check the freshest local state
    if (fileData.downloadLimit > 0 && fileData.downloadCount >= fileData.downloadLimit) {
      showToast("Download limit reached for this link.", "error");
      return;
    }

    setIsDownloading(true);
    try {
      // Fetch the actual file as a blob via apiClient so we can catch errors properly
      const response = await apiClient.get(`file/shared/${shareId}/?download=true`, {
        responseType: 'blob',
      });

      // Sync download count from server response headers
      const newDownloadCount = parseInt(response.headers['x-download-count']);
      if (!isNaN(newDownloadCount)) {
        setFileData(prev => ({ ...prev, downloadCount: newDownloadCount }));
      }

      // Trigger a real in-browser file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileData.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast("Download started", "success");
    } catch (err) {
      const msg = err.response?.data?.error || "Download limit reached for this link.";
      showToast(msg, "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const renderFilePreview = (isModal = false) => {
    if (!fileData) return null;
    
    // Categorize MIME types with extension fallbacks for robustness
    const mimeType = (fileData.type || '').toLowerCase();
    const fileName = (fileData.name || '').toLowerCase();
    
    const isImage = mimeType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|gif|webp|svg|m4a)$/i);
    const isPDF = mimeType === 'application/pdf' || fileName.endsWith('.pdf');
    const isExcel = mimeType.includes('spreadsheet') || mimeType.includes('excel') || fileName.match(/\.(xls|xlsx)$/i);
    const isVideo = mimeType.startsWith('video/') || fileName.match(/\.(mp4|mpeg|ogg|webm|mov)$/i);
    const isAudio = mimeType.startsWith('audio/') || fileName.match(/\.(mp3|wav|ogg)$/i);
    const previewUrl = fileData.previewUrl;

    if (isImage && previewUrl) {
      return (
        <img
          src={previewUrl}
          className={`${isModal ? 'max-h-[85vh] max-w-[90vw] rounded-3xl' : 'w-full h-full object-contain'} transition-all duration-500 select-none`}
          alt="Preview"
          onContextMenu={(e) => e.preventDefault()}
        />
      );
    }

    if (isPDF && previewUrl) {
      return (
        <iframe
          src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className={`${isModal ? 'w-[90vw] h-[85vh] rounded-3xl' : 'w-full h-full'} border-0`}
          title="PDF Preview"
        />
      );
    }

    if (isVideo && previewUrl) {
      return (
        <div className={`w-full h-full flex items-center justify-center ${!isModal ? 'aspect-video' : ''}`}>
          <video 
            src={previewUrl} 
            controls 
            playsInline
            crossOrigin="anonymous"
            className={`${isModal ? 'max-h-[85vh] max-w-[90vw] rounded-3xl' : 'w-full h-full'} outline-none shadow-2xl`}
          >
            <source src={previewUrl} type={mimeType} />
          </video>
        </div>
      );
    }

    if (isAudio && previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center p-12 w-full animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-indigo-500/10 text-indigo-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl">
            <i className="fas fa-music text-4xl"></i>
          </div>
          <div className="text-center mb-8">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Streaming Audio</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{fileData.name}</p>
          </div>
          <audio 
            src={previewUrl} 
            controls 
            crossOrigin="anonymous"
            className="w-full max-w-md"
          >
            <source src={previewUrl} type={mimeType} />
          </audio>
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-center justify-center p-12 text-center ${isModal ? 'scale-125' : ''}`}>
        <div className={`rounded-[2rem] flex items-center justify-center mb-4 shadow-2xl
          ${isModal ? 'w-40 h-40' : 'w-24 h-24'}
          ${isPDF ? 'bg-rose-500/10 text-rose-500' : isExcel ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
          <i className={`fas ${isPDF ? 'fa-file-pdf' : isExcel ? 'fa-file-excel' : 'fa-file-lines'} ${isModal ? 'text-7xl' : 'text-4xl'}`}></i>
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
          {isPDF ? 'PDF Document' : isExcel ? 'Spreadsheet' : isVideo ? 'Video Clip' : isAudio ? 'Audio Stream' : 'Secure File'}
        </p>
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

          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Access Locked</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-8 uppercase tracking-widest leading-relaxed">
            This asset is restricted or unavailable. <br /> Check your link or permissions.
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
                  Access Limitation Detected
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

  const isLimitReached = fileData.downloadLimit > 0 && fileData.downloadCount >= fileData.downloadLimit;

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

      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl overflow-hidden border border-white dark:border-gray-700 flex flex-col lg:flex-row animate-in zoom-in duration-500">
        <div className={`lg:w-[60%] bg-gray-100 dark:bg-gray-900 relative min-h-[400px] flex items-center justify-center group overflow-hidden
          ${fileData?.type?.startsWith('video/') ? 'aspect-video' : ''}`}>
          {renderFilePreview()}
          <div className="absolute top-8 left-8">
            <div className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Session Integrity Verified
            </div>
          </div>
          <button onClick={() => setIsEnlarged(true)} className="absolute bottom-8 right-8 w-14 h-14 glass rounded-2xl flex items-center justify-center text-gray-700 dark:text-white shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 border border-white/20">
            <i className="fas fa-expand-alt text-xl"></i>
          </button>
        </div>

        <div className="lg:w-[40%] p-8 md:p-10 flex flex-col justify-between bg-white dark:bg-gray-800">
          <div>
            <div className="mb-10 text-center lg:text-left">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] block mb-2">Secure Link Active</span>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight break-words">{fileData.name}</h1>
            </div>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                <span className="font-bold text-gray-400 uppercase text-[10px]">Usage Tracked</span>
                <span className="font-black dark:text-white uppercase text-xs">
                   {fileData.downloadLimit > 0 ? `${fileData.downloadCount}/${fileData.downloadLimit} DL` : 'Unlimited'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-rose-50 dark:bg-rose-900/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                <span className="font-bold text-rose-500 uppercase text-[10px]">Expires in</span>
                <span className="font-black text-rose-600 dark:text-rose-400 font-mono tracking-tighter">{fileData.expiresIn}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {fileData.downloadLimit !== 0 ? (
              <button
                onClick={handleDownloadClick}
                disabled={isLimitReached || isDownloading}
                className={`w-full py-5 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-3
                  ${isLimitReached
                    ? 'bg-gray-400 cursor-not-allowed grayscale'
                    : isDownloading
                    ? 'gradient-bg opacity-70 cursor-wait'
                    : 'gradient-bg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                {isDownloading
                  ? <><i className="fas fa-spinner animate-spin"></i><span>Downloading...</span></>
                  : isLimitReached
                  ? <><i className="fas fa-lock"></i><span>Download Limit Reached</span></>
                  : <><i className="fas fa-download"></i><span>Download File</span></>}
              </button>
            ) : (
              <div className="w-full py-5 bg-gray-100 dark:bg-gray-900/50 text-gray-400 font-black rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center space-x-3 cursor-not-allowed">
                <i className="fas fa-eye"></i>
                <span>Preview Only Mode</span>
              </div>
            )}
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