import React from 'react';
import FileRow from '../components/explorer/FileRow';

const FolderDetail = () => {
  const files = [
    {
      id: 1,
      name: 'architecture_v1.pdf',
      subtitle: 'System Blueprint',
      modified: 'Oct 12, 2025',
      size: '2.4 MB',
      iconClass: 'fas fa-file-pdf',
      colorClass: 'bg-red-50 text-red-500'
    },
    {
      id: 2,
      name: 'dashboard_mockup.png',
      subtitle: 'Image Preview',
      modified: 'Oct 15, 2025',
      size: '850 KB',
      imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'schema_config.json',
      subtitle: '{ "env": "prod" ... }',
      modified: 'Oct 18, 2025',
      size: '12 KB',
      iconClass: 'fas fa-file-code',
      colorClass: 'bg-amber-50 text-amber-500'
    }
  ];

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => window.history.back()} 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <a href="/explore" className="hover:text-indigo-600 transition">Assets</a>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200">Product Specs</span>
        </nav>
      </div>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Product Specs</h1>
          <p className="text-gray-500 mt-2">Managing assets within this directory.</p>
        </div>
        <button className="gradient-bg text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:opacity-90 transition active:scale-95">
          <i className="fas fa-upload mr-2"></i> Add Files
        </button>
      </div>

      {/* Files Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-8 py-5">Name & Preview</th>
                <th className="px-8 py-5">Modified</th>
                <th className="px-8 py-5">Size</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {files.map((file) => (
                <FileRow key={file.id} {...file} />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State Logic (Optional but good for promotion) */}
        {files.length === 0 && (
          <div className="py-20 text-center">
            <i className="fas fa-folder-open text-gray-200 dark:text-gray-700 text-6xl mb-4"></i>
            <p className="text-gray-400 font-medium">No files found in this directory.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default FolderDetail;