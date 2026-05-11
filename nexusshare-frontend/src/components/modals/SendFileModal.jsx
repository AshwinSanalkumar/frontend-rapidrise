import React, { useState } from 'react';
import { useToast } from '../../components/common/ToastContent';
import { fulfillRequest } from '../../services/requestService';

const SendFileModal = ({ isOpen, onClose, requestData, onConfirm }) => {
  const { showToast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (selectedFiles.length === 0) {
      return showToast("Please select at least one file to fulfill this request", "error");
    }

    setIsSending(true);
    
    try {
      const formData = new FormData();
      // Append each selected file under the key 'files' expected by the backend
      Array.from(selectedFiles).forEach(file => {
          formData.append('files', file);
      });
      
      await fulfillRequest(requestData.id, formData);
      showToast("Files sent successfully!", "success");
      onConfirm(); // Updates the parent table status
      onClose();
      setSelectedFiles([]);
    } catch (error) {
      showToast(error.response?.data?.error || "Failed to send files", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e) => {
      setSelectedFiles(e.target.files);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Send Requested Files</h2>
            <p className="text-[10px] text-gray-400 font-black tracking-widest mt-1">
              Recipient: <span className="text-indigo-500">{requestData?.sender_email}</span>
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
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <i className="fas fa-file-export text-xl"></i>
            </div>
            
            {selectedFiles.length > 0 ? (
                <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar px-2">
                    {Array.from(selectedFiles).map((f, i) => (
                       <p key={i} className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{f.name}</p>
                    ))}
                    <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest mt-2">{selectedFiles.length} file(s) selected</p>
                </div>
            ) : (
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Click or drag files to upload</p>
            )}
            
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">Secure Nexus Transfer</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Requester Note</p>
             <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{requestData?.note || 'No note provided'}"</p>
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
              disabled={isSending || selectedFiles.length === 0}
              className="flex-[2] bg-indigo-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {isSending ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> 
                  Send Assets
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