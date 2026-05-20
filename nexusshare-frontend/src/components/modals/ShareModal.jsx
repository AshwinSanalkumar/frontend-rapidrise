import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../common/ToastContent';
import { createShareLink } from '../../services/shareService';
import { createBulkShareLink } from '../../services/shareService';

const ShareModal = ({ isOpen, onClose, file, onSuccess }) => {
  const { showToast } = useToast();

  // States
  const [emails, setEmails] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [message, setMessage] = useState("");

  const [expiry, setExpiry] = useState("5m");
  const [customDuration, setCustomDuration] = useState(60);
  const [downloadLimit, setDownloadLimit] = useState(5);
  const [isPreviewOnly, setIsPreviewOnly] = useState(false);

  const inputRef = useRef(null);

  // Helper to determine file icon based on extension
  const getFileIcon = (name) => {
    const ext = name?.split('.')?.pop()?.toLowerCase();
    if (['jpg', 'png', 'jpeg', 'gif'].includes(ext)) return 'fa-file-image text-blue-500';
    if (ext === 'pdf') return 'fa-file-pdf text-rose-500';
    if (['zip', 'rar', '7z'].includes(ext)) return 'fa-file-archive text-amber-500';
    return 'fa-file-alt text-indigo-500';
  };

  const isBulk = Array.isArray(file);
  const fileName = isBulk ? `${file.length} Files Selected` : (file?.name || "unnamed_file");

  const getCanPreview = () => {
    if (isBulk) return false;
    const ext = fileName?.split('.')?.pop()?.toLowerCase();
    const previewableExts = ['jpg', 'jpeg', 'png', 'm4a', 'gif', 'webp', 'mp4', 'webm', 'ogg', 'mp3', 'wav', 'pdf'];
    return previewableExts.includes(ext);
  };

  const canPreview = getCanPreview();

  useEffect(() => {
    if (!canPreview && isPreviewOnly) {
      setIsPreviewOnly(false);
    }
  }, [canPreview]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const addEmail = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = currentInput.trim().replace(',', '');
      if (!val) return;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showToast("Please enter a valid email address", "error");
        return;
      }

      if (emails.includes(val)) {
        showToast("Email already added", "info");
        return;
      }

      setEmails([...emails, val]);
      setCurrentInput("");
    } else if (e.key === 'Backspace' && !currentInput && emails.length > 0) {
      const updated = [...emails];
      updated.pop();
      setEmails(updated);
    }
  };

  const removeEmail = (index) => setEmails(emails.filter((_, i) => i !== index));

  const handleGenerate = async () => {
    // Collect all unique emails (including what's in the input field if it's a valid email)
    let finalEmails = [...emails];
    if (currentInput.trim()) {
      const val = currentInput.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(val) && !finalEmails.includes(val)) {
        finalEmails.push(val);
      } else if (!emailRegex.test(val)) {
        showToast("Please finish entering a valid email or clear the input", "error");
        return;
      }
    }

    if (finalEmails.length === 0) {
      showToast("Please add at least one recipient", "error");
      return;
    }

    if (!isBulk && !file?.id) {
      showToast("File data is incomplete", "error");
      return;
    }
    if (isBulk && file.length === 0) {
      showToast("No files selected", "error");
      return;
    }

    const shareId = `share-${Date.now()}`;

    // Dispatch initial progress state
    window.dispatchEvent(new CustomEvent('upload-progress', {
      detail: { id: shareId, name: `Sharing ${fileName}...`, progress: 45, status: 'uploading' }
    }));

    const executeShare = async () => {
      try {
        let duration_minutes = 60;
        if (expiry === "5m") duration_minutes = 5;
        else if (expiry === "1h") duration_minutes = 60;
        else if (expiry === "24h") duration_minutes = 1440;
        else if (expiry === "custom") duration_minutes = parseInt(customDuration) || 60;

        if (isBulk) {
          await createBulkShareLink({
            file_ids: file.map(f => f.id),
            emails: finalEmails,
            message,
            duration_minutes: duration_minutes,
            download_limit: isPreviewOnly ? 0 : parseInt(downloadLimit)
          });
        } else {
          await createShareLink(file.id, {
            emails: finalEmails,
            message,
            duration_minutes: duration_minutes,
            download_limit: isPreviewOnly ? 0 : parseInt(downloadLimit)
          });
        }

        window.dispatchEvent(new CustomEvent('upload-progress', {
          detail: { id: shareId, name: `Shared ${fileName}`, progress: 100, status: 'completed' }
        }));
        showToast(`Shared ${fileName} successfully!`, 'success');

      } catch (error) {
        console.error('Share failed:', error);
        window.dispatchEvent(new CustomEvent('upload-progress', {
          detail: { id: shareId, name: `Failed to share`, progress: 0, status: 'removed' }
        }));
        showToast(error.response?.data?.error || "Failed to generate shared link", "error");
      }
    };

    executeShare();

    onClose();
    if (onSuccess) onSuccess();
    setEmails([]);
    setMessage("");
    setCurrentInput("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-7 py-5 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/10">
          <div>
            <h3 className="text-lg font-extrabold text-gray-800 dark:text-white leading-tight">Transmit Assets</h3>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.15em]">Secure Transfer Session</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-rose-500 transition-colors">
            <i className="fas fa-times-circle text-xl"></i>
          </button>
        </div>

        <div className="p-7">
          {/* Balanced File Preview */}
          <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-xl">
              <i className={`fas ${getFileIcon(fileName)}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{fileName}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Ready for Secure Transfer</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Recipients */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">* Recipients</label>
                {emails.length > 0 && <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-lg">{emails.length} Emails Added</span>}
              </div>
              <div className="flex flex-wrap gap-2 p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl min-h-[48px] focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                {emails.map((email, index) => (
                  <span key={index} className="flex items-center bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                    {email}
                    <button onClick={() => removeEmail(index)} className="ml-2 hover:text-rose-500 transition-colors"><i className="fas fa-times"></i></button>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={addEmail}
                  placeholder={emails.length === 0 ? "Enter recipient email..." : ""}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm dark:text-white p-1"
                />
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Encryption Memo</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include an optional personal note..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all h-20 resize-none"
              />
            </div>

            {/* Settings Row */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Link Expiry</label>
                  <select
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="5m">5 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="24h">24 Hours</option>
                    <option value="custom">Custom...</option>
                  </select>
                </div>

                {!isPreviewOnly ? (
                  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                    <label className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-1 mb-2 block">Download Limit</label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={downloadLimit}
                      onChange={(e) => setDownloadLimit(e.target.value)}
                      className="w-full px-4 py-2.5 bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center pb-2">
                    <span className="text-xs font-black text-rose-500 uppercase tracking-tight animate-pulse">Preview Lock Active</span>
                  </div>
                )}
              </div>

              {expiry === "custom" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <input
                    type="number"
                    min="1"
                    max="43200"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="Enter custom minutes..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              )}

              {/* Conditional Preview Only for supported types */}
              {canPreview && (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/50 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isPreviewOnly ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      <i className={`fas ${isPreviewOnly ? 'fa-eye-slash' : 'fa-download'}`}></i>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight block">Preview Only Mode</label>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Recipients will only be able to preview files</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPreviewOnly(!isPreviewOnly)}
                    className={`w-10 h-5 rounded-full transition-all duration-300 relative ${isPreviewOnly ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${isPreviewOnly ? 'left-5.5' : 'left-0.5'}`} style={{ left: isPreviewOnly ? 'calc(100% - 1.125rem)' : '0.125rem' }}></div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full mt-7 py-4 rounded-xl shadow-lg transition flex items-center justify-center font-black text-sm text-white active:scale-[0.98] gradient-bg hover:opacity-90"
          >
            <span>Transmit to {emails.length || 1} User{emails.length !== 1 ? 's' : ''}</span><i className="fas fa-paper-plane ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;