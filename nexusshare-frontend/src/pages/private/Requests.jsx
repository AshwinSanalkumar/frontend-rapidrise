import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createFileRequest, fetchSentRequests, deleteRequest } from '../../services/requestService';
import { useToast } from '../../components/common/ToastContent';
import DeleteModal from '../../components/modals/DeleteModal';
import ActiveDropzoneModal from '../../components/modals/ActiveDropzoneModal';

const FileRequestPage = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [fileNote, setFileNote] = useState('');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetFile, setTargetFile] = useState(null);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSentRequests();
      setRequests(data);
    } catch (error) {
      showToast("Failed to load requests", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const newReq = await createFileRequest({ email, note: fileNote });
      setRequests([newReq, ...requests]);
      setEmail('');
      setFileNote('');
      showToast(`Secure request generated and sent to ${email}`, "success");
    } catch (error) {
      if (error.response?.status === 404) {
        showToast("User not found.", "error");
      } else {
        showToast(error.response?.data?.error || "Failed to create request", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDropzone = (req) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };



  const handleDeleteRequest = (e, req) => {
    e.stopPropagation();
    setTargetFile(req);
  };

  const confirmDelete = async () => {
    try {
      if (!targetFile) return;
      await deleteRequest(targetFile.id);
      setRequests(requests.filter(r => r.id !== targetFile.id));
      showToast("Drop zone deleted successfully", "success");
      setTargetFile(null);
    } catch (error) {
      showToast("Failed to delete drop zone", "error");
      setTargetFile(null);
    }
  };


  const totalPages = Math.ceil(requests.length / limit);
  const currentRequests = requests.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <Link to="/dashboard" className="hover:text-indigo-600 transition">Dashboard</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200">Request Files</span>
        </nav>
      </div>
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">File Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">Generate secure inbound drop-zones for platform users.</p>
        </div>
        <Link to="/received-request" className="text-sm font-bold text-indigo-600 bg-white shadow-sm px-6 py-3 rounded-2xl border border-gray-100 hover:bg-indigo-50 transition-all">
          View Inbound Requests
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Creation Panel */}
        <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-700 shadow-xl self-start sticky top-8">
          <div className="mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
              <i className="fas fa-paper-plane text-white"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white">New File Request</h2>
            <p className="text-sm text-gray-400 mt-1">Request files securely from other registered users.</p>
          </div>

          <form onSubmit={handleRequest} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Recipient Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="registered.user@nexus.com"
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
            <button 
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none transform active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : "Generate Secure Link"}
            </button>
          </form>
        </section>

        {/* Live Tracking List */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Active Drop-zones</h3>
          <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <i className="fas fa-spinner fa-spin text-indigo-500 text-2xl"></i>
                </div>
            ) : requests.length > 0 ? (
              currentRequests.map((req) => (
              <div 
                key={req.id} 
                onClick={() => openDropzone(req)}
                className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      req.status === 'fulfilled' ? 'bg-emerald-50 text-emerald-500' : 
                      req.status === 'declined' ? 'bg-rose-50 text-rose-500' : 
                      'bg-amber-50 text-amber-500 group-hover:scale-110 transition-transform'}`}>
                    <i className={`fas ${
                        req.status === 'fulfilled' ? 'fa-check-circle' : 
                        req.status === 'declined' ? 'fa-times-circle' : 'fa-clock'}`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">{req.recipient_email}</h4>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{req.note}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      req.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-700' : 
                      req.status === 'declined' ? 'bg-rose-100 text-rose-700' : 
                      'bg-gray-100 text-gray-500'}`}>
                    {req.status}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={(e) => handleDeleteRequest(e, req)}
                      className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center transition-colors"
                      title="Delete Drop Zone"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                    <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap">Click to view</p>
                  </div>
                </div>
              </div>
              ))

            ) : (
                <div className="text-center py-12">
                   <p className="text-gray-400 font-medium">No drop-zones generated yet.</p>
                </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-2 mt-4">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="text-xs font-bold text-gray-500 hover:text-indigo-600 disabled:opacity-50 transition-colors"
              >
                <i className="fas fa-chevron-left mr-1"></i> Previous
              </button>
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Page {currentPage} of {totalPages}</span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="text-xs font-bold text-gray-500 hover:text-indigo-600 disabled:opacity-50 transition-colors"
              >
                Next <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
          )}
        </section>
      </div>

      <ActiveDropzoneModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        requestData={selectedRequest}
      />
      <DeleteModal 
        isOpen={!!targetFile}
        onClose={() => setTargetFile(null)}
        onDelete={confirmDelete}
        title="Delete Drop Zone?"
        message={`Are you sure you want to delete the drop zone generated for ${targetFile?.recipient_email}? This cannot be undone.`}
        confirmText="Delete Drop Zone"
      />
    </main>
  );
};

export default FileRequestPage;