import React from 'react';

const TrashTable = ({ items, onRestore, onDeletePermanently, isEmpty }) => {
  if (isEmpty) {
    return (
      <div className="p-20 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <i className="fas fa-trash-restore text-3xl"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Trash is empty</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-sm">
          Deleted files and folders will appear here for 30 days before they are gone forever.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deleted Date</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Size</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition group">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <i className={`fas ${item.icon} ${item.color} text-xl mr-3`}></i>
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium tracking-tight">Original: {item.path}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                {item.deletedDate}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.size}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end space-x-1">
                  <button 
                    onClick={() => onRestore(item.id)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition" 
                    title="Restore"
                  >
                    <i className="fas fa-undo-alt text-xs"></i>
                  </button>
                  <button 
                    onClick={() => onDeletePermanently(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition" 
                    title="Delete Permanently"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrashTable;