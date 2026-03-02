import React, { useState } from 'react';
import ActionButton from '../components/ui/ActionButton';
import FileSpecCard from '../components/ui/FileSpecCard'; // Changed from FileSpecItem
import ShareModal from '../components/ui/ShareModal';
import DeleteModal from '../components/ui/DeleteModal';

const FileDetailsPage = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fileInfo = {
    name: "Project_Final_Logo.png",
    date: "Feb 25, 2026",
    time: "10:54 AM",
    size: "1.8 MB",
    extension: ".PNG",
    status: "SECURED",
    preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
  };

  const handleDeleteAction = () => {
    console.log("File Deleted");
    setIsDeleteModalOpen(false);
    // window.location.href = '/myfiles'; 
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {/* Navigation */}
      <button 
        onClick={() => window.history.back()} 
        className="flex items-center text-sm font-bold text-gray-400 hover:text-indigo-600 transition mb-6 group"
      >
        <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> 
        Back to My Files
      </button>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="relative w-full aspect-video bg-gray-50 dark:bg-gray-900 rounded-[2rem] overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-800">
              <img src={fileInfo.preview} className="w-full h-full object-cover" alt="Preview" />
              <button className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/40 transition">
                <i className="fas fa-expand-arrows-alt mr-2"></i> Fullscreen
              </button>
            </div>
            
            <div className="mt-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{fileInfo.name}</h1>
                <p className="text-gray-400 font-medium">Added on {fileInfo.date} • {fileInfo.time}</p>
              </div>
              <div className="flex space-x-3">
                <ActionButton icon="fa-edit" title="Update" onClick={() => {}} />
                <ActionButton icon="fa-download" title="Download" onClick={() => {}} />
                <ActionButton 
                  icon="fa-trash-alt" 
                  title="Delete" 
                  variant="danger" 
                  onClick={() => setIsDeleteModalOpen(true)} 
                />
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Description</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Final vector asset for rebranding. Includes dark and light variations.
            </p>
          </section>
        </div>

        {/* Right Column */}
        <div className="w-full xl:w-96">
          <FileSpecCard 
            file={fileInfo} 
            onShare={() => setIsShareModalOpen(true)} 
          />
        </div>
      </div>

      {/* Modals - Ensure props match the component definitions */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        fileName={fileInfo.name} 
        onClose={() => setIsShareModalOpen(false)} 
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        fileName={fileInfo.name} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onDelete={handleDeleteAction}
      />
    </main>
  );
};

export default FileDetailsPage;