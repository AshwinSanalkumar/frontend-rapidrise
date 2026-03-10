import React from 'react';

const SharedLinkRow = ({ link, onRevoke, onCopy }) => {
  return (
    <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition group">
      <td className="px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-500">
            <i className={`fas ${link.type === 'pdf' ? 'fa-file-pdf' : 'fa-file'}`}></i>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{link.name}</p>
            <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">{link.url}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
          <i className="far fa-clock mr-2 text-orange-400"></i> {link.timeLeft}
        </div>
      </td>
      <td className="px-8 py-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
        {link.views} clicks
      </td>
      <td className="px-8 py-6">
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-[10px] font-bold uppercase">
          {link.status}
        </span>
      </td>
      <td className="px-8 py-6 text-right">
        <button 
          onClick={onCopy}
          className="text-gray-400 hover:text-indigo-600 mr-4 transition"
        >
          <i className="fas fa-copy"></i>
        </button>
        <button 
          onClick={onRevoke}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  );
};

export default SharedLinkRow;