import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/ToastContent'; 
import ActionButton from '../../components/common/ActionButton';
import FileSpecCard from '../../components/elements/FileSpecCard';
import ShareModal from '../../components/modals/ShareModal';
import DeleteModal from '../../components/modals/DeleteModal';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchFileDetail, updateFile, deleteFile } from '../../services/fileService';

const FileDetailsPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    const loadFile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchFileDetail(id);
        setFileData({
          ...data,
          description: data.description || '',
          time: new Date(data.uploadedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          status: data.status || 'PRIVATE',
        });
      } catch (err) {
        setError('Could not load file. It may have been deleted or you may not have access.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadFile();
  }, [id]);

  // Guard: use the actual filename (with extension) for splitting
  const nameForEdit = fileData ? (fileData.name || fileData.name) : '';
  const lastDotIndex = nameForEdit.lastIndexOf('.');
  const namePart = lastDotIndex > 0 ? nameForEdit.substring(0, lastDotIndex) : nameForEdit;
  const extPart  = lastDotIndex > 0 ? nameForEdit.substring(lastDotIndex) : '';

  // --- PREVIEW LOGIC ---
  const renderPreviewContent = (isModal = false) => {
    if (!fileData) return null;
    const mimeType = fileData.type || '';
    const isImage = mimeType === 'image';
    const isPDF   = mimeType === 'pdf';
    const isExcel = mimeType === 'excel';

    if (isImage && fileData.preview) {
      return (
        <img 
          src={fileData.preview} 
          className={`${isModal ? 'max-h-[85vh] max-w-[90vw] rounded-3xl' : 'w-full h-full object-contain'} transition-all duration-500 select-none`} 
          alt="Preview" 
          onContextMenu={(e) => e.preventDefault()}
        />
      );
    }

    if (isPDF && fileData.preview) {
      return (
        <iframe
          src={`${fileData.preview}#toolbar=0&navpanes=0&scrollbar=0`}
          className={`${isModal ? 'w-[90vw] h-[85vh] rounded-3xl' : 'w-full h-full'} border-0`}
          title="PDF Preview"
        />
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
          {isPDF ? 'PDF Document' : isExcel ? 'Spreadsheet' : 'Secure File'}
        </p>
      </div>
    );
  };

  const handleSaveEdit = async () => {
    if (!namePart.trim()) {
      showToast("File name cannot be empty", "error");
      return;
    }
    setIsSaving(true);
    try {
      // The backend expects display_name and description
      const updatedApiData = await updateFile(id, {
        display_name: namePart + extPart,
        description: fileData.description
      });
      
      // Update local state with the mapped server response
      const data = await fetchFileDetail(id); // Re-fetch to get consistent mapping or just map return value
      setFileData({
        ...data,
        description: data.description || '',
        time: new Date(data.uploadedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        status: data.status || 'PRIVATE',
      });

      setIsEditing(false);
      showToast("File details updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update file:", err);
      showToast(err.response?.data?.error || "Failed to update file details", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    showToast(`Downloading ${fileData?.name}...`);
    if (fileData?.preview) {
      window.open(fileData.preview, '_blank');
    }
  };

  const handleDeleteAction = async () => {
    try {
      await deleteFile(id);
      setIsDeleteModalOpen(false);
      showToast("File moved to trash", "success");
      navigate('/files');
    } catch (err) {
      console.error("Failed to delete file:", err);
      showToast(err.response?.data?.error || "Failed to delete file", "error");
    }
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading File...</p>
        </div>
      </main>
    );
  }

  // --- ERROR STATE ---
  if (error || !fileData) {
    return (
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">File Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button onClick={() => navigate('/files')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition">
            Back to My Files
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      
      {/* --- ENLARGED VIEW MODAL --- */}
      {isEnlarged && (
        <div className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsEnlarged(false)}
            className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 transition-all"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          <div className="animate-in zoom-in duration-500">
            {renderPreviewContent(true)}
          </div>
        </div>
      )}

            <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
                            <Link to="/files" className="hover:text-indigo-600 transition text-gray-500">My Files</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200">File Details</span>
        </nav>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            {/* PREVIEW CONTAINER */}
            <div className="relative w-full aspect-video bg-gray-50 dark:bg-gray-900 rounded-[2rem] overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-800 group">
              {renderPreviewContent()}
              
              <button 
                onClick={() => setIsEnlarged(true)}
                className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-white/40 transition border border-white/20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 duration-300 shadow-xl"
              >
                <span className='text-gray-900 dark:text-white text-center'>
                <i className="fas fa-expand-arrows-alt mr-2"></i>Fullscreen Preview
              </span>
              </button>
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1 w-full">
                {isEditing ? (
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest ml-1">File Name</label>
                    <div className="flex items-center w-full bg-gray-50 dark:bg-gray-900 border-2 border-indigo-500 rounded-xl px-4 py-2 transition-all">
                      <input
                        type="text"
                        defaultValue={namePart}
                        onChange={(e) => setFileData({ ...fileData, name: e.target.value + extPart })}
                        className="bg-transparent border-none outline-none flex-1 text-2xl font-bold text-gray-900 dark:text-white py-1"
                        autoFocus
                      />
                      <span className="text-2xl font-bold text-gray-400 dark:text-gray-500 select-none ml-2">{extPart}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none capitalize">{fileData.name}</h3>
                    {fileData.filename && (
                      <p className="text-xs text-gray-400 font-mono mt-1 px-1 opacity-70">{fileData.filename}</p>
                    )}
                  </>
                )}
                <p className="text-gray-400 font-medium mt-2 text-sm uppercase tracking-wider">Added on {fileData.date} • {fileData.time}</p>
              </div>

              <div className="flex space-x-3 shrink-0">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition">Cancel</button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="gradient-bg text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition active:scale-95 flex items-center min-w-[100px] justify-center"
                    >
                      {isSaving ? <i className="fas fa-circle-notch fa-spin"></i> : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <>
                    <ActionButton icon="fa-edit" title="Update" onClick={() => setIsEditing(true)} />
                    <ActionButton icon="fa-download" title="Download" onClick={handleDownload} />
                    <ActionButton icon="fa-trash-alt" title="Delete" variant="danger" onClick={() => setIsDeleteModalOpen(true)} />
                  </>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-sm font-black text-indigo-500 uppercase tracking-[0.2em] mb-4 flex items-center">
              <i className="fas fa-align-left mr-2"></i> Description
            </h2>
            {isEditing ? (
              <textarea
                value={fileData.description}
                onChange={(e) => setFileData({ ...fileData, description: e.target.value })}
                className="w-full p-5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 resize-none"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {fileData.description || "No description provided for this asset."}
              </p>
           
            )}
            
          </section>
        </div>

        <div className="w-full xl:w-96">
          <FileSpecCard file={fileData} onShare={() => setIsShareModalOpen(true)} />
        </div>
      </div>

      <ShareModal isOpen={isShareModalOpen} fileName={fileData.name} onClose={() => setIsShareModalOpen(false)} />
      <DeleteModal 
      isOpen={isDeleteModalOpen} 
      fileName={fileData.name} 
      message={`This will move "${fileData.name}" to the trash.`}
      onClose={() => setIsDeleteModalOpen(false)} 
      onDelete={handleDeleteAction} />
    </main>
  );
};

export default FileDetailsPage;