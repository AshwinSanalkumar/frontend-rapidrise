import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateWorkstationModal from '../../components/modals/CreateWorkStationModal';
import DeleteModal from '../../components/modals/DeleteModal';
import { fetchWorkstations, fetchInvites, respondToInvite, deleteWorkstation } from '../../services/workstationService';
import { Link } from 'react-router-dom';
import { fetchMe } from '../../services/authService';
import { useToast } from '../../components/common/ToastContent';
import Pagination from '../../components/common/Pagination';

const WorkstationDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stations, setStations] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'invites'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalOwnedCount, setTotalOwnedCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const isLimitReached = totalOwnedCount >= 10;

  useEffect(() => {
    loadData(currentPage);
    fetchCurrentUser();
  }, [currentPage]);

  const fetchCurrentUser = async () => {
    try {
      const user = await fetchMe();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const loadData = async (page = 1) => {
    try {
      setLoading(true);
      const [stationsData, invitesData] = await Promise.all([
        fetchWorkstations(page),
        fetchInvites()
      ]);
      
      if (stationsData.results) {
        setStations(stationsData.results);
        setTotalCount(stationsData.count);
        setTotalOwnedCount(stationsData.owned_count || 0);
        setTotalPages(Math.ceil(stationsData.count / 8)); // Updated to match StandardPagination's 8
      } else {
        setStations(stationsData);
        setTotalCount(stationsData.length);
        // If not paginated, we filter manually
        const owned = stationsData.filter(s => s.owner === currentUser?.id).length;
        setTotalOwnedCount(owned);
      }
      
      setInvites(invitesData);
    } catch (error) {
      showToast("Failed to load workstations", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (inviteId, action) => {
    try {
      await respondToInvite(inviteId, action);
      showToast(`Invite ${action.toLowerCase()}ed`);
      loadData();
    } catch (error) {
      showToast("Failed to respond to invite");
    }
  };

  const handleDelete = (e, stationId) => {
    e.stopPropagation(); 
    setStationToDelete(stationId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!stationToDelete) return;
    
    setIsDeleting(true);
    try {
      const deletedStation = stations.find(s => s.id === stationToDelete);
      const wasOwner = deletedStation && currentUser && deletedStation.owner === currentUser.id;
      
      await deleteWorkstation(stationToDelete);
      showToast("Workstation deleted successfully", "success");
      
      setStations(stations.filter(s => s.id !== stationToDelete));
      if (wasOwner) {
        setTotalOwnedCount(prev => Math.max(0, prev - 1));
      }
      
      setIsDeleteModalOpen(false);
      setStationToDelete(null);
      
      // If we deleted the last item on a page and we're not on page 1, go back
      if (stations.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        loadData(currentPage);
      }
    } catch (error) {
      showToast("Failed to delete workstation", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>

        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
                  <Link to="/dashboard" className="hover:text-indigo-600 transition text-gray-500">Dashboard</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 dark:text-gray-200">Shared Links</span>
        </nav>
      </div>
      {/* HEADER SECTION */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Work Stations<span className="text-indigo-500">.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your collaborative engineering environments.
          </p>
        </div>

        <button 
          onClick={() => {
            if (isLimitReached) {
              showToast("Limit reached: 10 workstations maximum. Delete one to continue.", "error");
              return;
            }
            setIsModalOpen(true);
          }}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 ${
            isLimitReached 
            ? 'bg-gray-400 dark:bg-gray-700 text-white cursor-not-allowed opacity-50 grayscale' 
            : 'bg-indigo-500 text-white shadow-indigo-500/20 hover:bg-indigo-600'
          }`}
        >
          <i className="fas fa-plus text-[8px]"></i>
          Create Work Station
        </button>
      </div>

      {/* DASHBOARD TABS */}
<div className="max-w-6xl mx-auto mb-8 border-b border-gray-200 dark:border-gray-800">
  <div className="flex gap-8">
    {[
      { id: 'active', label: 'Active Workspaces', count: stations.length },
      { id: 'invites', label: 'Pending Invites', count: invites.length }
    ].map((tab) => {
      const isActive = activeTab === tab.id;
      
      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="relative pb-4 flex items-center gap-2.5 group transition-all duration-200 ease-out outline-none"
        >
          {/* Label */}
          <span className={`text-sm font-semibold tracking-wider transition-colors duration-200 ${
            isActive 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
          }`}>
            {tab.label}
          </span>


          {/* Active Sliding Underline Indicator */}
          {isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-[0_1px_8px_rgba(79,70,229,0.4)]" />
          )}
        </button>
      );
    })}
  </div>
</div>
<div className="max-w-6xl mx-auto">
  {loading ? (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : activeTab === 'active' ? (
    <div className="space-y-6">
      
      {stations.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No active workstations found</p>
        </div>
      ) : (
        /* 4-COLUMN GRID WRAPPER */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {stations.map((station) => (
            <div 
              key={station.id}
              onClick={() => navigate(`/workstation/${station.id}`)}
              className="group flex flex-col justify-between bg-white dark:bg-gray-800 backdrop-blur-sm p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer active:scale-[0.99]"
            >
              {/* Card Header: Icon & Identification */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                    <i className="fas fa-laptop text-sm"></i>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-500 transition-colors truncate">
                      {station.title}
                    </h3>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight italic block truncate mt-0.5">
                      {station.template} Module
                    </span>
                  </div>
                </div>

                {/* Arrow indicator top right */}
                <div className="w-8 h-8 shrink-0 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 flex items-center justify-center">
                  <i className="fas fa-chevron-right text-[10px]"></i>
                </div>
              </div>

              {/* Card Footer: Contributors, Activity, and Actions */}
              <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Contributors Stack */}
                <div className="flex -space-x-2">
                  {station.members.slice(0, 3).map((member) => (
                    <div 
                      key={member.id} 
                      className="w-7 h-7 rounded-lg border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[8px] font-bold text-gray-400 shadow-sm" 
                      title={member.name}
                    >
                      {member.name.charAt(0)}
                    </div>
                  ))}
                  {station.memberCount > 3 && (
                    <div className="w-7 h-7 rounded-lg border-2 border-white dark:border-gray-900 bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                      +{station.memberCount - 3}
                    </div>
                  )}
                </div>

                {/* Timestamp & Danger Action Area */}
                <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest tabular-nums">
                    {new Date(station.updatedAt).toLocaleDateString()}
                  </span>

                  {currentUser && station.owner === currentUser.id && (
                    <button 
                      onClick={(e) => handleDelete(e, station.id)}
                      className="w-8 h-8 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center group/btn"
                      title="Delete Workstation"
                    >
                      <i className="fas fa-trash-alt text-[10px]"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deploy Button */}
      <button 
        onClick={() => {
          if (isLimitReached) {
            showToast("Limit reached: 10 workstations maximum. Delete one to continue.", "error");
            return;
          }
          setIsModalOpen(true);
        }}
        className={`w-full py-6 rounded-3xl border-2 border-dashed flex items-center justify-center gap-3 transition-all group ${
          isLimitReached
          ? 'border-gray-200 dark:border-gray-800 text-gray-300 cursor-not-allowed opacity-50 grayscale'
          : 'border-gray-100 dark:border-white/5 text-gray-400 hover:border-indigo-500/50 hover:bg-indigo-500/5'
        }`}
      >
        <i className="fas fa-plus text-[10px] group-hover:scale-125 transition-transform"></i>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deploy New Environment</span>
      </button>

      {/* PAGINATION CONTROLS */}
      <Pagination 
        currentPage={currentPage}
        totalFiles={totalCount}
        filesPerPage={8}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  ) : (
    /* INVITES TAB */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invites.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No pending invitations</p>
              </div>
            ) : (
              invites.map((invite) => (
                <div key={invite.id} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <i className="fas fa-envelope-open-text text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-800 dark:text-white leading-none mb-1">{invite.workstation_title}</h3>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">From {invite.inviter_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 px-2">
                    <i className="fas fa-user-shield text-indigo-500/50"></i>
                    Role: <span className="text-gray-800 dark:text-gray-200">{invite.role}</span>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleRespond(invite.id, 'ACCEPT')}
                      className="flex-1 py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleRespond(invite.id, 'REJECT')}
                      className="flex-1 py-3 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <CreateWorkstationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreated={loadData}
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={confirmDelete}
        isLoading={isDeleting}
        title="Delete Workstation?"
        message="This will permanently delete this workstation and all its version history. This action cannot be undone."
      />
    </main>
  );
};

export default WorkstationDashboard;