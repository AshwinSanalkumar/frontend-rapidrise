import React, { useState } from 'react';
import SharedLinkRow from '../../components/elements/SharedLinkRow';
import DeleteModal from '../../components/modals/DeleteModal'; // Reusing the same styled modal
import { useToast } from '../../components/common/ToastContent';

const SharedLinks = () => {
  const { showToast } = useToast();

  // State for link management
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

  // State for the Revoke Modal
  const [linkToRevoke, setLinkToRevoke] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Link copied to clipboard!", "success");
  };

  const handleRevokeClick = (link) => {
    setLinkToRevoke(link);
  };

  const confirmRevoke = () => {
    if (linkToRevoke) {
      setLinks((prev) => prev.filter((l) => l.id !== linkToRevoke.id));
      showToast("Access link has been revoked successfully.", "success");
      setLinkToRevoke(null);
    }
  };

  return (
    <main className="flex-1 p-8 lg:p-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Active Shared Links</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Monitor and revoke access to your shared assets.</p>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
          {links.length} Active Links
        </p>
      </header>

      {links.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-6">Shared Resource</th>
                  <th className="px-8 py-6">Time Remaining</th>
                  <th className="px-8 py-6">Views</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {links.map((link) => (
                  <SharedLinkRow
                    key={link.id}
                    link={link}
                    onRevoke={() => handleRevokeClick(link)} // Trigger modal
                    onCopy={() => copyToClipboard(link.url)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-500">
          <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-8">
            <i className="fas fa-link-slash text-5xl text-indigo-200 dark:text-indigo-800"></i>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">No active links found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-10 leading-relaxed font-medium">
            You haven't generated any secure sharing links yet.
          </p>
          <button className="gradient-bg text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all flex items-center group">
            <span>Go to My Files</span>
            <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      <DeleteModal
        isOpen={!!linkToRevoke}
        onClose={() => setLinkToRevoke(null)}
        onDelete={confirmRevoke}

        // Customizing for Revoke action
        title="Revoke Link?"
        message={`This will disable access for "${linkToRevoke?.name}". This action is effective immediately.`}
        confirmText="Revoke Access"
        icon="fas fa-link-slash"
        variant="warning" // Uses the indigo theme instead of red
      />
    </main>
  );
};

export default SharedLinks;