import React, { useState } from 'react';
import { useToast } from '../common/ToastContent';
import { importRequestFile } from '../../services/requestService';

const ActiveDropzoneModal = ({ isOpen, onClose, requestData, onImportSuccess }) => {
  const { showToast } = useToast();
  const [importingId, setImportingId] = useState(null);

  if (!isOpen || !requestData) return null;

  const handleImport = async (fileId) => {
    setImportingId(fileId);
    try {
      await importRequestFile(requestData.id, fileId);
      showToast("File successfully imported to your cloud", "success");
      if (onImportSuccess) onImportSuccess();
    } catch (error) {
      showToast(error.response?.data?.error || "Failed to import file", "error");
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Drop-zone Details</h2>
            <p className="text-xs text-gray-400 font-bold mt-1">
              Recipient: <span className="text-indigo-500">{requestData.recipient_email}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <i className="fas fa-times text-gray-400"></i>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between mb-4">
               <div>
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Note attached</p>
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{requestData.note || 'No note provided'}</p>
               </div>
               <div className="text-right">
                 <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    requestData.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-700' :
                    requestData.status === 'declined' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                 }`}>
                   {requestData.status}
                 </span>
               </div>
             </div>
          </div>

          {requestData.status === 'fulfilled' && requestData.files && requestData.files.length > 0 && (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Files Delivered</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {requestData.files.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:border-indigo-200 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[200px]">{file.display_name || file.filename}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{file.size_readable || 'Unknown size'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                           const previewUrl = file.content?.startsWith('http') 
                               ? file.content 
                               : `http://localhost:8000${file.content}`;
                           window.open(previewUrl, '_blank');
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-500 hover:text-indigo-600 rounded-xl transition-all"
                        title="Preview File"
                      >
                        <i className="fas fa-eye"></i>
                      </button>

                      <button 
                        onClick={() => handleImport(file.id)}
                        disabled={importingId === file.id}
                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                      >
                        {importingId === file.id ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <>
                            <i className="fas fa-cloud-download-alt"></i>
                            Import
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {requestData.status === 'pending' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <i className="fas fa-clock text-2xl"></i>
              </div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-white">Waiting for {requestData.recipient_email}</h3>
              <p className="text-xs text-gray-500 mt-1">They have not fulfilled this request yet.</p>
            </div>
          )}

          {requestData.status === 'declined' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-times-circle text-2xl"></i>
              </div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-white">Request Declined</h3>
              <p className="text-xs text-gray-500 mt-1">The recipient declined to send the files.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ActiveDropzoneModal;
