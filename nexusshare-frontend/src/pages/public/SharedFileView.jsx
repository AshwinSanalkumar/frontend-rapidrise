import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LinkStatus from '../../components/common/LinkStatus';
import { getPublicShareUrl } from '../../services/shareService';
import { useToast } from '../../components/common/ToastContent';
import apiClient from '../../api/apiClient';
import { formatDateTime } from '../../utils/dateUtils';
import { getFileConfig } from '../../utils/fileUtils';

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
        const response = await apiClient.get(`file/shared/${shareId}/`, {
          params: { metadata: true }
        });
        
        const fileInfo = response.data;
        const contentType = fileInfo.type || 'application/octet-stream';
        const filename = fileInfo.name || 'Protected Asset';
        const publicUrl = getPublicShareUrl(shareId);
        
        const downloadLimit = parseInt(response.headers['x-download-limit'] || 0);
        const downloadCount = parseInt(response.headers['x-download-count'] || 0);

        const hasBrowserPreview = (
          contentType === 'image' || contentType.startsWith('image/') ||
          contentType === 'video' || contentType.startsWith('video/') ||
          contentType === 'audio' || contentType.startsWith('audio/') ||
          contentType === 'pdf' || contentType === 'application/pdf' ||
          filename.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mp3|wav|m4a|pdf)$/i)
        );

        const expiresAtStr = response.headers['x-expires-at'];
        let formattedExpiry = 'Never';
        if (expiresAtStr) {
          formattedExpiry = formatDateTime(expiresAtStr);
        }

        const sizeInMb = fileInfo.size ? `${(parseInt(fileInfo.size) / (1024 * 1024)).toFixed(2)} MB` : 'Encrypted';

        setFileData({
          name: filename,
          size: sizeInMb,
          type: contentType,
          owner: 'Restricted Access',
          previewUrl: fileInfo.preview || publicUrl,
          expiresIn: formattedExpiry,
          downloadLimit: downloadLimit,
          downloadCount: downloadCount
        });
        setStatus('active');

        if (!hasBrowserPreview) {
          apiClient.get(`file/shared/${shareId}/?track=true`).catch(() => {});
        }

        if (downloadLimit === 0) {
          showToast("Heads up: This is a preview-only link", "info");
        }
      } catch (error) {
        const errorMsg = error.response?.data?.error?.toLowerCase() || '';
        
        if (error.response?.status === 410 || errorMsg.includes('expired')) {
          setStatus('expired');
        } else if (errorMsg.includes('revoked') || error.response?.status === 404) {
          setStatus('revoked');
        } else if (error.response?.status === 403) {
          setStatus('denied');
          showToast(error.response.data?.error || "Access restricted", "error");
        } else {
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
  }, [shareId, showToast]);

  const handleVerify = (e) => {
    e.preventDefault();
    setStatus('verifying_id');

    setTimeout(() => {
      if (email.toLowerCase().trim() === AUTHORIZED_EMAIL) {
        setStatus('active');
      } else {
        setStatus('denied');
      }
    }, 1200);
  };

  const handleDownloadClick = async (e) => {
    e.preventDefault();

    if (fileData.downloadLimit > 0 && fileData.downloadCount >= fileData.downloadLimit) {
      showToast("Download limit reached for this link.", "error");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await apiClient.get(`file/shared/${shareId}/?download=true`, {
        responseType: 'blob',
      });

      const newDownloadCount = parseInt(response.headers['x-download-count']);
      if (!isNaN(newDownloadCount)) {
        setFileData(prev => ({ ...prev, downloadCount: newDownloadCount }));
      }

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
    
    const mimeType = (fileData.type || '').toLowerCase();
    const fileName = (fileData.name || '').toLowerCase();
    
    const isImage = mimeType === 'image' || mimeType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
    const isPDF = mimeType === 'pdf' || mimeType === 'application/pdf' || fileName.endsWith('.pdf');
    const isExcel = mimeType === 'excel' || mimeType.includes('spreadsheet') || mimeType.includes('excel') || fileName.match(/\.(xls|xlsx)$/i);
    const isVideo = mimeType === 'video' || mimeType.startsWith('video/') || fileName.match(/\.(mp4|mpeg|ogg|webm|mov)$/i);
    const isAudio = mimeType === 'audio' || mimeType.startsWith('audio/') || mimeType === 'audio/x-m4a' || fileName.match(/\.(mp3|wav|ogg|m4a)$/i);
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
          scrolling="no"
          style={{ overflow: 'hidden' }}
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
          <div className="w-24 h-24 bg-indigo-500/10 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl">
            <i className="fas fa-music text-4xl"></i>
          </div>
          <div className="text-center mb-8">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-1">Streaming Audio</p>
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

    // Determine file type key for getFileConfig
    const typeKey = isPDF ? 'pdf' : isExcel ? 'excel' : isVideo ? 'video' : isAudio ? 'audio' : isImage ? 'image' : 'default';
    const fileConfig = getFileConfig(typeKey);
    const typeLabel = isPDF ? 'PDF Document' : isExcel ? 'Spreadsheet' : isVideo ? 'Video File' : isAudio ? 'Audio File' : isImage ? 'Image File' : 'Secure File';

    return (
      <div className={`flex flex-col items-center justify-center w-full h-full p-10 text-center ${isModal ? '' : 'min-h-[300px]'}`}>
        {/* Large Icon Block */}
        <div className={`relative flex items-center justify-center rounded-[2rem] shadow-2xl mb-8
          ${isModal ? 'w-44 h-44' : 'w-32 h-32'}
          ${fileConfig.bg} dark:bg-white/5`}>
          <i className={`fas ${fileConfig.icon} ${fileConfig.color} ${isModal ? 'text-8xl' : 'text-5xl'}`}></i>
          {/* Subtle decorative ring */}
          <div className={`absolute inset-0 rounded-[2rem] border-2 border-current opacity-10 ${fileConfig.color}`}></div>
        </div>

        {/* File Type Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-4">
          <i className={`fas ${fileConfig.icon} text-[10px] ${fileConfig.color}`}></i>
          <span className={`text-[10px] font-black uppercase tracking-widest ${fileConfig.color}`}>{typeLabel}</span>
        </div>

        {/* Filename */}
        <p className="text-sm font-black text-gray-700 dark:text-gray-300 tracking-tight max-w-[200px] truncate mb-3">
          {fileData.name}
        </p>

        {/* Preview unavailable notice */}
        <div className="flex items-center gap-2 text-gray-400">
          <i className="fas fa-eye-slash text-xs"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">Preview Unavailable</span>
        </div>
      </div>
    );
  };

  // --- RENDERING STATES ---

  if (status === 'expired' || status === 'revoked') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-lg 
            ${status === 'expired' ? 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-500/20' : 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/20'}`}>
            <i className={`fas ${status === 'expired' ? 'fa-clock' : 'fa-ban'}`}></i>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
            {status === 'expired' ? 'Link Expired' : 'Access Revoked'}
          </h2>
          <p className="text-xs text-gray-500 font-medium mb-8 uppercase tracking-widest leading-relaxed">
            {status === 'expired' 
              ? 'This secure transmission has reached its time limit and is no longer accessible.'
              : 'The owner has manually terminated this session. Access is permanently denied.'}
          </p>

          <button onClick={() => window.location.reload()} className="w-full py-4 bg-gray-50 text-gray-700 font-black rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-100 transition-all text-sm uppercase tracking-widest">
            Check Again
          </button>
        </div>
      </div>
    );
  }

  if (status === 'verifying' || status === 'verifying_id') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <i className="fas fa-id-badge absolute inset-0 flex items-center justify-center text-indigo-600 text-2xl"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight uppercase tracking-tighter">Checking Credentials</h2>
        <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-[0.4em]">Matching ACL Record...</p>
      </div>
    );
  }

  // BOX CONTAINER GATEKEEPER (LIGHT MODE PRESERVED)
  if (status === 'gatekeeper' || status === 'denied') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-lg shadow-indigo-500/20">
            <i className="fas fa-user-shield"></i>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Access Locked</h2>
          <p className="text-xs text-gray-500 font-medium mb-8 uppercase tracking-widest leading-relaxed">
            This asset is restricted or unavailable. <br /> Check your link or permissions.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                required
                placeholder="email@company.com"
                className={`w-full px-6 py-4 bg-gray-50 border ${status === 'denied' ? 'border-rose-500 animate-shake' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-center text-gray-800`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {status === 'denied' && (
              <div className="bg-rose-50 py-2 px-4 rounded-lg border border-rose-100">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider">
                  Access Limitation Detected
                </p>
              </div>
            )}

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-black rounded-2xl shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
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

  // --- ACTIVE BOX VIEW REDESIGN (LIGHT MODE PRESERVED) ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 flex items-center justify-center relative">
      {isEnlarged && (
        <div className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button onClick={() => setIsEnlarged(false)} className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10">
            <i className="fas fa-times text-xl"></i>
          </button>
          <div className="animate-in zoom-in duration-500">{renderFilePreview(true)}</div>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row animate-in zoom-in duration-500">
        <div className={`lg:w-[60%] bg-gray-100 relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center group overflow-hidden
          ${(fileData?.type?.startsWith('video/') || fileData?.type === 'video') ? 'aspect-video' : ''}
          ${(fileData?.type === 'pdf' || fileData?.type === 'application/pdf' || fileData?.name?.toLowerCase().endsWith('.pdf')) ? 'w-full' : ''}`}>
          {renderFilePreview()}
          <button onClick={() => setIsEnlarged(true)} className="absolute bottom-8 right-8 w-14 h-14 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-700 shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 border border-gray-200/60">
            <i className="fas fa-expand-alt text-xl"></i>
          </button>
        </div>

        <div className="lg:w-[40%] p-8 md:p-10 flex flex-col justify-between bg-white">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <i className="fa-brands fa-cloudversify text-2xl text-indigo-600"></i>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">NexusShare</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
              </div>
            </div>

            {/* File name */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Secure Asset</p>
              <h1 className="text-xl font-black text-gray-900 leading-tight break-all tracking-tight">{fileData.name}</h1>
              <p className="text-[10px] font-bold text-gray-400 mt-1.5">{fileData.size}</p>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <i className="fas fa-arrow-down-to-line text-xs"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Downloads</p>
                  <p className="text-xs font-black text-gray-800 uppercase tracking-tight mt-0.5">
                    {fileData.downloadLimit > 0
                      ? `${fileData.downloadCount} of ${fileData.downloadLimit} used`
                      : fileData.downloadLimit === 0
                      ? 'Preview Only'
                      : 'Unlimited Access'}
                  </p>
                </div>
                {fileData.downloadLimit > 0 && (
                  <div className="w-16 shrink-0">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${Math.min((fileData.downloadCount / fileData.downloadLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                  <i className="fas fa-hourglass-end text-xs"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Expires</p>
                  <p className="text-xs font-black text-rose-600 tracking-tight mt-0.5 truncate">{fileData.expiresIn}</p>
                </div>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="space-y-3 mt-8">
            {fileData.downloadLimit !== 0 ? (
              <button
                onClick={handleDownloadClick}
                disabled={isLimitReached || isDownloading}
                className={`w-full py-5 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-sm
                  ${isLimitReached
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    : isDownloading
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-75 cursor-wait'
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                {isDownloading
                  ? <><i className="fas fa-spinner animate-spin"></i><span>Downloading...</span></>
                  : isLimitReached
                  ? <><i className="fas fa-lock"></i><span>Limit Reached</span></>
                  : <><i className="fas fa-download"></i><span>Download File</span></>}
              </button>
            ) : (
              <div className="w-full py-5 bg-gray-50 text-gray-400 font-black rounded-2xl border border-dashed border-gray-200 flex items-center justify-center gap-3 text-sm cursor-not-allowed">
                <i className="fas fa-eye"></i>
                <span>Preview Only Mode</span>
              </div>
            )}
            <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest">
              Secured by NexusShare Protocol
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedFileView;