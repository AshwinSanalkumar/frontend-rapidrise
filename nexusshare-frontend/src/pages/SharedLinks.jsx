import React, { useState } from 'react';
import SharedLinkRow from '../components/ui/SharedLinkRow';
import { useToast } from '../components/ui/ToastContent'; // Import the hook

const SharedLinks = () => {
  const { showToast } = useToast(); // Use the global toast function
  const [links, setLinks] = useState([
    {
      id: 1,
      name: 'Q4_Performance_Report.pdf',
      url: 'nexus.share/s/a7f2-k9m1',
      type: 'pdf',
      timeLeft: '42m 12s',
      views: 12,
      status: 'Active'
    }
  ]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Link copied to clipboard!");
  };

  const handleRevoke = (id) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
    showToast("Access link has been revoked successfully.", "success");
  };

  return (
    <main className="flex-1 p-8 lg:p-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Active Shared Links</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor and revoke access to your shared assets.</p>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {links.length} Active Links
        </p>
      </header>

      {links.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Shared Resource</th>
                  <th className="px-8 py-5">Time Remaining</th>
                  <th className="px-8 py-5">Views</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {links.map((link) => (
                  <SharedLinkRow 
                    key={link.id} 
                    link={link} 
                    onRevoke={() => handleRevoke(link.id)}
                    onCopy={() => copyToClipboard(link.url)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
              <i className="fas fa-link text-5xl text-indigo-200 dark:text-indigo-800 animate-pulse"></i>
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">No active links found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-10 leading-relaxed">
            You haven't generated any secure sharing links yet.
          </p>
          <button className="gradient-bg text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-indigo-200 transition-all flex items-center group">
            <span>Go to My Files</span>
            <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      )}

      {/* Security Info Box - Keeping your specified 5 min / 1 hour logic */}
      <div className="mt-8 p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm">
            <i className="fas fa-shield-alt text-lg"></i>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Security Enforcement</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Default link expiry is 1 hour. Use "Vault Mode" for 5-minute link expiration.</p>
          </div>
        </div>
        <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Manage Security</button>
      </div>
    </main>
  );
};

export default SharedLinks;