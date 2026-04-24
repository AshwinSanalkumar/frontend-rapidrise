import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../common/ToastContent';
import { createShareLink } from '../../services/shareService';

const ShareModal = ({ isOpen, onClose, file, onSuccess }) => {
  const { showToast } = useToast();
  
  // States
  const [emails, setEmails] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [expiry, setExpiry] = useState("5m");
  const [customDuration, setCustomDuration] = useState(60);
  
  const inputRef = useRef(null);

  // Helper to determine file icon based on extension
  const getFileIcon = (name) => {
    const ext = name?.split('.')?.pop()?.toLowerCase();
    if (['jpg', 'png', 'jpeg', 'gif'].includes(ext)) return 'fa-file-image text-blue-500';
    if (ext === 'pdf') return 'fa-file-pdf text-rose-500';
    if (['zip', 'rar', '7z'].includes(ext)) return 'fa-file-archive text-amber-500';
    return 'fa-file-alt text-indigo-500';
  };

  const fileName = file?.name || "unnamed_file";

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

    if (!file?.id) {
      showToast("File data is incomplete", "error");
      return;
    }

    setLoading(true);
    try {
      // Map expiry to minutes
      let duration_minutes = 60;
      if (expiry === "5m") duration_minutes = 5;
      else if (expiry === "1h") duration_minutes = 60;
      else if (expiry === "24h") duration_minutes = 1440;
      else if (expiry === "custom") duration_minutes = parseInt(customDuration) || 60;

      await createShareLink(file.id, {
        emails: finalEmails,
        message,
        duration_minutes: duration_minutes
      });

      setLoading(false);
      setSent(true);
      showToast(`Shared ${fileName} successfully!`, 'success');
      
      setTimeout(() => {
        setSent(false);
        onClose();
        setEmails([]);
        setMessage("");
        setCurrentInput("");
      }, 1500);
      if (onSuccess) onSuccess();
    } catch (error) {
      setLoading(false);
      console.error('Share failed:', error);
      showToast(error.response?.data?.error || "Failed to generate shared link", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Secure Multi-Share</h3>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">End-to-End Encrypted</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-rose-500 transition">
            <i className="fas fa-times-circle text-2xl"></i>
          </button>
        </div>

        <div className="p-8">
          {/* File Preview Card - NEW FEATURE */}
          <div className="mb-8 p-4 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-700 flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-2xl">
              <i className={`fas ${getFileIcon(fileName)}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{fileName}</h4>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Ready to transmit • Secure Vault Asset</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recipients */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">* Recipients</label>
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl min-h-[56px] focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                {emails.map((email, index) => (
                  <span key={index} className="flex items-center bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                    {email}
                    <button onClick={() => removeEmail(index)} className="ml-2 hover:text-rose-500"><i className="fas fa-times"></i></button>
                  </span>
                ))}
                <input 
                  ref={inputRef}
                  type="text" 
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={addEmail}
                  placeholder={emails.length === 0 ? "Enter email..." : ""}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm dark:text-white p-1" 
                />
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Personal Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include a short note..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all h-20 resize-none"
              />
            </div>
            
            {/* Expiry Select */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Link Expiry</label>
                <select 
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="5m">5 Minutes (Highest Security)</option>
                  <option value="1h">1 Hour (Standard)</option>
                  <option value="24h">24 Hours</option>
                  <option value="custom">Custom Duration...</option>
                </select>
              </div>

              {expiry === "custom" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Duration (Minutes)</label>
                  <input 
                    type="number"
                    min="1"
                    max="43200" // 30 days
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="Enter minutes..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || sent}
            className={`w-full mt-8 py-4 rounded-2xl shadow-lg transition flex items-center justify-center font-bold text-white active:scale-[0.98] ${sent ? 'bg-emerald-500' : 'gradient-bg hover:opacity-90'}`}
          >
            {loading ? (
              <i className="fas fa-circle-notch fa-spin text-xl"></i>
            ) : sent ? (
              <><i className="fas fa-check-circle mr-2"></i> Sent Successfully!</>
            ) : (
              <><span>Share with {emails.length || 1} user{emails.length !== 1 ? 's' : ''}</span><i className="fas fa-paper-plane ml-2"></i></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;