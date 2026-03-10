import React, { useState } from 'react';
import { useToast } from '../../components/common/ToastContent'; 
import ActionButton from '../../components/common/ActionButton';
import FileSpecCard from '../../components/elements/FileSpecCard';
import ShareModal from '../../components/modals/ShareModal';
import DeleteModal from '../../components/modals/DeleteModal';

const FileDetailsPage = () => {
  const { showToast } = useToast();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false); // State for enlarged view

  const [fileData, setFileData] = useState({
    name: "Project_Final_Logo.png",
    description: "Final vector asset for rebranding. Includes dark and light variations.",
    date: "Feb 25, 2026",
    time: "10:54 AM",
    size: "1.8 MB",
    extension: ".PNG",
    type: "application/pdf", // Added type for logic detection
    status: "SECURED",
    preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
  });

  const lastDotIndex = fileData.name.lastIndexOf('.');
  const namePart = fileData.name.substring(0, lastDotIndex);
  const extPart = fileData.name.substring(lastDotIndex);

  // --- PREVIEW LOGIC (SOLID Helper) ---
  const renderPreviewContent = (isModal = false) => {
    const isImage = fileData.type.startsWith('image/');
    const isPDF = fileData.type.includes('pdf');
    const isExcel = fileData.type.includes('excel') || fileData.type.includes('spreadsheet');

    if (isImage) {
      return (
        <img 
          src={fileData.preview} 
          className={`${isModal ? 'max-h-[85vh] max-w-[90vw] rounded-3xl' : 'w-full h-full object-cover'} transition-all duration-500 select-none`} 
          alt="Preview" 
          onContextMenu={(e) => e.preventDefault()}
        />
      );
    }

    return (
      <div className={`flex flex-col items-center justify-center p-12 text-center ${isModal ? 'scale-125' : ''}`}>
        <div className={`rounded-[2rem] flex items-center justify-center mb-4 shadow-2xl animate-in zoom-in
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

  const handleSaveEdit = () => {
    if (!namePart.trim()) {
      showToast("File name cannot be empty", "error");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      showToast("File details updated successfully!");
    }, 800);
  };

  const handleDownload = () => {
    showToast(`Downloading ${fileData.name}...`);
  };

  const handleDeleteAction = () => {
    setIsDeleteModalOpen(false);
    showToast("File moved to trash", "success");
  };

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

      <button
        onClick={() => window.history.back()}
        className="flex items-center text-sm font-bold text-gray-400 hover:text-indigo-600 transition mb-6 group"
      >
        <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
        Go Ba ck
      </button>

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
                <i className="fas fa-expand-arrows-alt mr-2"></i> Fullscreen Preview
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
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">{fileData.name}</h1>
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
      <DeleteModal isOpen={isDeleteModalOpen} fileName={fileData.name} onClose={() => setIsDeleteModalOpen(false)} onDelete={handleDeleteAction} />
    </main>
  );
};

export default FileDetailsPage;