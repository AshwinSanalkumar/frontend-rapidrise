import React, { useState } from 'react';
import { useToast } from '../../components/common/ToastContent';

const SendFileModal = ({ isOpen, onClose, requestData, onConfirm }) => {
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!selectedFile) {
      return showToast("Please select a file to fulfill this request", "error");
    }

    setIsSending(true);
    
    // Simulate the secure transfer process
    setTimeout(() => {
      onConfirm(); // Updates the parent table status
      setIsSending(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Send Requested File</h2>
            <p className="text-[10px] text-gray-400 font-black  tracking-widest mt-1">
              Recipient: <span className="text-indigo-500">{requestData?.sender}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <i className="fas fa-times text-gray-400"></i>
          </button>
        </div>

        <div className="space-y-6">
          {/* File Selection Zone */}
          <div className="group relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] p-8 transition-all hover:border-indigo-500/50 bg-gray-50/50 dark:bg-gray-900/50 text-center">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <i className="fas fa-file-export text-xl"></i>
            </div>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {selectedFile ? selectedFile.name : "Click or drag file to upload"}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Secure Nexus Transfer</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSend}
              disabled={isSending}
              className="flex-[2] bg-indigo-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {isSending ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> 
                  Send Asset
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendFileModal;