import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FilePreview = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!file || !file.type) return;

    setHasError(false);
    setPreviewUrl(null);

    let isMounted = true;
    let objectUrl = null;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isMounted && e.target.result) {
          setPreviewUrl(e.target.result);
        }
      };
      reader.onerror = () => {
        if (isMounted) setHasError(true);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/') || file.type === 'application/pdf') {
      objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (previewUrl && !hasError) {
    if (file.type.startsWith('image/')) {
      return (
        <img 
          src={previewUrl} 
          alt="preview" 
          className="w-14 h-14 rounded-[1rem] object-cover shrink-0 shadow-sm border border-gray-100 dark:border-gray-700" 
          onError={() => setHasError(true)}
        />
      );
    } else if (file.type.startsWith('video/')) {
      return (
        <video 
          src={previewUrl} 
          className="w-14 h-14 rounded-[1rem] object-cover shrink-0 shadow-sm border border-gray-100 dark:border-gray-700"
          onError={() => setHasError(true)}
        />
      );
    } else if (file.type === 'application/pdf') {
      return (
        <div className="w-14 h-14 rounded-[1rem] shrink-0 overflow-hidden bg-white dark:bg-gray-800 flex items-start justify-center shadow-sm border border-gray-100 dark:border-gray-700">
          <Document 
            file={previewUrl} 
            loading={<i className="fas fa-circle-notch fa-spin text-gray-400 text-xs mt-4"></i>}
            onLoadError={() => setHasError(true)}
            error={null}
            className="w-full h-full"
          >
            <Page
              pageNumber={1}
              width={56}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="w-full h-full [&>canvas]:!w-full [&>canvas]:!h-full [&>canvas]:!object-cover [&>canvas]:!object-top"
            />
          </Document>
        </div>
      );
    }
  }

  return (
    <div className="w-14 h-14 flex shrink-0 items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 rounded-[1rem] text-indigo-500 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
      <i className="fas fa-file text-xl"></i>
    </div>
  );
};

const UploadConfirmModal = ({ files, isOpen, isUploading, onClose, onRemove, onConfirm }) => {
  const [descriptions, setDescriptions] = useState({});

  if (!isOpen) return null;

  const handleDescriptionChange = (index, value) => {
    setDescriptions(prev => ({ ...prev, [index]: value }));
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-10 py-8 flex justify-between items-center border-b border-gray-50 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Confirm Upload</h3>
            <p className="text-xs text-gray-400 font-medium">Review and add details to your {files.length} file(s).</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-red-500 transition">
            <i className="fas fa-times-circle text-2xl"></i>
          </button>
        </div>
        
        <div className="p-10">
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-8 custom-scrollbar">
            {files.map((file, index) => (
              <div key={index} className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-3xl border border-gray-100 dark:border-gray-700 transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center space-x-4">
                    <FilePreview file={file} />
                    <div className="max-w-[300px]">
                      <p className="text-base font-bold text-gray-800 dark:text-gray-200 truncate leading-tight">{file.name}</p>
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => onRemove(index)} disabled={isUploading} className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-300 hover:text-red-500 hover:bg-red-50 transition shadow-sm disabled:opacity-30 disabled:cursor-not-allowed">
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
                <input 
                  type="text"
                  placeholder="Add an optional brief description..."
                  value={descriptions[index] || ''}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm placeholder:font-medium"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8 px-6 bg-indigo-50/50 dark:bg-indigo-900/20 py-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Selection</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{files.length} file(s)</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-indigo-400">Total Payload</p>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formatBytes(totalSize)}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={() => onConfirm(files, descriptions)}
              className="flex-[2] gradient-bg text-white font-bold py-4 rounded-2xl shadow-xl hover:opacity-90 transition active:scale-95 flex items-center justify-center"
            >
              <i className="fas fa-shield-alt mr-2"></i>
              Secure & Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadConfirmModal;