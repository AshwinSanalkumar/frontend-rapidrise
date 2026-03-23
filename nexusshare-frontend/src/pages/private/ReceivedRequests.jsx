import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/common/ToastContent';
import SendFileModal from '../../components/modals/SendFileModal';

const ReceivedRequests = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');

  // NEW: Added states for the modal
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Dummy data
  const [requests, setRequests] = useState([
    { id: 1, sender: "alex.design@gmail.com", type: "Internal", date: "Mar 22, 2026", status: "pending", message: "Need branding assets" },
    { id: 2, sender: "Guest_8829", type: "Public", date: "Mar 21, 2026", status: "pending", message: "Project review access" },
    { id: 3, sender: "sarah.manager@nexus.com", type: "Internal", date: "Mar 19, 2026", status: "approved", message: "Final Q1 Reports" },
  ]);

  const handleAction = (id, action) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'declined' } : req
    ));
    showToast(`Request ${action === 'approve' ? 'Approved' : 'Declined'}`);
  };

  // NEW: Function to trigger modal
  const openSendModal = (req) => {
    setSelectedRequest(req);
    setIsSendModalOpen(true);
  };

  const filteredRequests = requests.filter(req => 
    activeTab === 'pending' ? req.status === 'pending' : req.status !== 'pending'
  );

  return (
    <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <Link to="/dashboard" className="hover:text-indigo-600 transition">Dashboard</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200">Received Requests</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Inbound Requests</h1>
        
        <div className="flex bg-gray-200/50 dark:bg-gray-800 p-1 rounded-2xl border border-gray-200 dark:border-gray-700 mt-4 md:mt-0">
          {['pending', 'history'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-indigo-500 shadow-sm' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-700/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sender</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/30">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{req.sender}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{req.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${req.type === 'Internal' ? 'bg-indigo-50 text-indigo-500 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                        {req.type}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] italic">"{req.message}"</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleAction(req.id, 'decline')} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"><i className="fas fa-times"></i></button>
                          
                          {/* CHANGED: Now calls openSendModal instead of handleAction directly */}
                          <button onClick={() => openSendModal(req)} className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
                            <i className="fas fa-check"></i>
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-black uppercase tracking-widest ${req.status === 'approved' ? 'text-emerald-500' : 'text-gray-400'}`}>
                          {req.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-gray-700">
              <i className="fas fa-inbox text-gray-300 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Clean Slate</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-2 text-sm">
              {activeTab === 'pending' 
                ? "You've processed all incoming requests. Check back later for new ones." 
                : "No request history found in your logs."}
            </p>
          </div>
        )}
      </div>

      {/* NEW: Modal Component added at bottom */}
      <SendFileModal 
        isOpen={isSendModalOpen} 
        onClose={() => setIsSendModalOpen(false)} 
        requestData={selectedRequest}
        onConfirm={() => handleAction(selectedRequest.id, 'approve')}
      />
    </main>
  );
};

export default ReceivedRequests;