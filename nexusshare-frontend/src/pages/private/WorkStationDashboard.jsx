import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateWorkstationModal from '../../components/modals/CreateWorkStationModal';
import { fetchWorkstations, fetchInvites, respondToInvite, deleteWorkstation } from '../../services/workstationService';
import { Link } from 'react-router-dom';
import { fetchMe } from '../../services/authService';
import { useToast } from '../../components/common/ToastContent';

const WorkstationDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stations, setStations] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'invites'
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await fetchMe();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [stationsData, invitesData] = await Promise.all([
        fetchWorkstations(),
        fetchInvites()
      ]);
      setStations(stationsData);
      setInvites(invitesData);
    } catch (error) {
      showToast("Failed to load workstations");
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

  const handleDelete = async (e, stationId) => {
    e.stopPropagation(); // Don't navigate to the workstation page
    if (!window.confirm("Are you sure you want to delete this workstation? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteWorkstation(stationId);
      showToast("Workstation deleted successfully");
      setStations(stations.filter(s => s.id !== stationId));
    } catch (error) {
      showToast("Failed to delete workstation");
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
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all flex items-center gap-2"
        >
          <i className="fas fa-plus text-[8px]"></i>
          Create Work Station
        </button>
      </div>

      {/* DASHBOARD TABS */}
      <div className="max-w-6xl mx-auto mb-8 flex gap-6 border-b border-gray-800 dark:border-white/5 ">
        {[
          { id: 'active', label: 'Active Workspaces', count: stations.length },
          { id: 'invites', label: 'Pending Invites', count: invites.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 group transition-all ${
              activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${
              activeTab === tab.id ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-6xl mx-auto">
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'active' ? (
          <div className="space-y-4">
            {/* TABLE HEADERS */}
            <div className="hidden md:grid grid-cols-12 px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <div className="col-span-4">Project Identification</div>
              <div className="col-span-2 text-center">Privacy</div>
              <div className="col-span-2 text-center">Contributors</div>
              <div className="col-span-2 text-center">Activity</div>
              <div className="col-span-2 text-right px-4">Actions</div>
            </div>

            {stations.length === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No active workstations found</p>
              </div>
            ) : (
              stations.map((station) => (
                <div 
                  key={station.id}
                  onClick={() => navigate(`/workstation/${station.id}`)}
                  className="group grid grid-cols-1 md:grid-cols-12 items-center bg-white dark:bg-gray-800 backdrop-blur-sm px-8 py-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer active:scale-[0.99]"
                >
                  <div className="col-span-4 flex items-center gap-5">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                      <i className="fas fa-laptop text-sm"></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-500 transition-colors">
                        {station.title}
                      </h3>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight italic text-ellipsis overflow-hidden whitespace-nowrap block max-w-[200px]">
                        {station.template} Module
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-center py-4 md:py-0">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                      station.visibility === 'public' 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' 
                      : 'bg-indigo-500/5 border-indigo-500/20 text-indigo-500'
                    }`}>
                      <span className="text-[9px] font-black uppercase tracking-widest">{station.visibility}</span>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <div className="flex -space-x-2">
                      {station.members.slice(0, 3).map((member, i) => (
                        <div key={member.id} className="w-7 h-7 rounded-lg border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[8px] font-bold text-gray-400 shadow-sm" title={member.name}>
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {station.memberCount > 3 && (
                        <div className="w-7 h-7 rounded-lg border-2 border-white dark:border-gray-900 bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                          +{station.memberCount - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ">
                      {new Date(station.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="col-span-2 flex justify-end gap-2 pr-4">
                    {currentUser && station.owner === currentUser.id && (
                      <button 
                        onClick={(e) => handleDelete(e, station.id)}
                        className="w-8 h-8 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center group/btn"
                        title="Delete Workstation"
                      >
                        <i className="fas fa-trash-alt text-[10px]"></i>
                      </button>
                    )}
                    <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 flex items-center justify-center">
                      <i className="fas fa-chevron-right text-[10px]"></i>
                    </div>
                  </div>
                </div>
              ))
            )}

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-6 rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/5 flex items-center justify-center gap-3 text-gray-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
            >
              <i className="fas fa-plus text-[10px] group-hover:scale-125 transition-transform"></i>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deploy New Environment</span>
            </button>
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
    </main>
  );
};

export default WorkstationDashboard;