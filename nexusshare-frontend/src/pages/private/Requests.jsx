import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FileRequestPage = () => {
  const [email, setEmail] = useState('');
  const [fileNote, setFileNote] = useState('');
  const [requests, setRequests] = useState([
    { id: 1, email: 'client@company.com', note: 'Q4 Financials', status: 'pending', date: '2026-03-15' },
    { id: 2, email: 'design@studio.io', note: 'Branding Assets', status: 'fulfilled', date: '2026-03-10' },
  ]);

  const handleRequest = (e) => {
    e.preventDefault();
    const newReq = {
      id: Date.now(),
      email,
      note: fileNote,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setRequests([newReq, ...requests]);
    setEmail('');
    setFileNote('');
    alert(`Secure request link generated and "sent" to ${email}`);
  };

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">File Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">Generate secure inbound drop-zones for external users.</p>
        </div>
        <Link to="/public/upload" className="text-sm font-bold text-indigo-600 bg-white shadow-sm px-6 py-3 rounded-2xl border border-gray-100 hover:bg-indigo-50 transition-all">
          View Audit Calendar
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Creation Panel */}
        <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-700 shadow-xl">
          <div className="mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
              <i className="fas fa-paper-plane text-white"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white">New File Request</h2>
            <p className="text-sm text-gray-400 mt-1">The recipient will receive a one-time link to upload files.</p>
          </div>

          <form onSubmit={handleRequest} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Recipient Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@work.com"
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">What do you need?</label>
              <textarea 
                rows="3"
                value={fileNote}
                onChange={(e) => setFileNote(e.target.value)}
                placeholder="e.g. Please upload the signed contract for project X..."
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
              />
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none transform active:scale-[0.98] transition-all">
              Generate Secure Link
            </button>
          </form>
        </section>

        {/* Live Tracking List */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Active Drop-zones</h3>
          <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {requests.map((req) => (
              <div key={req.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${req.status === 'fulfilled' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500 animate-pulse'}`}>
                    <i className={`fas ${req.status === 'fulfilled' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">{req.email}</h4>
                    <p className="text-xs text-gray-500">{req.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${req.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {req.status}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">{req.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default FileRequestPage;