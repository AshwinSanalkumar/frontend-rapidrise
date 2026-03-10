import React, { useState } from 'react';
import { filesData } from '../../dummydata/filesData';
import FileCard from '../../components/elements/FIleCard';
import ShareModal from '../../components/modals/ShareModal';
import Pagination from '../../components/common/Pagination';
import ViewToggle from '../../components/common/ViewToggle'; // 1. Import the reusable toggle

const MyFiles = () => {
  const [view, setView] = useState('grid');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 8; 

  // Calculate current files to display
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filesData.slice(indexOfFirstFile, indexOfLastFile);

  const openModal = (name) => {
    setSelectedFile(name);
    setIsModalOpen(true);
  };

  return (
    <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Files</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select a file to generate a secure sharing link.</p>
        </div>
        
        {/* 2. REPLACED raw button HTML with reusable ViewToggle */}
        <ViewToggle view={view} setView={setView} />
      </div>

    {/* Files Container - FIXED */}
<div className={view === 'grid' 
  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6" 
  : "flex flex-col gap-4"
}>
  {/* Change filesData.map to currentFiles.map below */}
  {currentFiles.map(file => (
    <FileCard 
      key={file.id} 
      file={file} 
      onShare={openModal} 
      view={view} 
    />
  ))}
</div>

      {/* Pagination Component */}
      <Pagination 
        currentPage={currentPage}
        totalFiles={filesData.length}
        filesPerPage={filesPerPage}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />

      <ShareModal 
        isOpen={isModalOpen} 
        fileName={selectedFile} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
};

export default MyFiles;