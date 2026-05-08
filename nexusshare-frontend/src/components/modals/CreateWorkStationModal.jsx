import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/ToastContent';
import { createWorkstation, searchUsers, sendInvite } from '../../services/workstationService';

const CreateWorkstationModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'private',
    template: 'blank'
  });
  
  const [inviteQuery, setInviteQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (inviteQuery.length > 1) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const results = await searchUsers(inviteQuery);
          // Filter out users already invited or current user (backend excludes current)
          setSearchResults(results.filter(u => !invitedUsers.find(iu => iu.id === u.id)));
        } catch (error) {
          console.error("Search failed", error);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [inviteQuery, invitedUsers]);

  if (!isOpen) return null;

  const handleInviteUser = (user) => {
    setInvitedUsers([...invitedUsers, { ...user, role: 'EDITOR' }]);
    setInviteQuery('');
    setSearchResults([]);
  };

  const handleRemoveInvited = (userId) => {
    setInvitedUsers(invitedUsers.filter(u => u.id !== userId));
  };

  const handleRoleChange = (userId, role) => {
    setInvitedUsers(invitedUsers.map(u => u.id === userId ? { ...u, role } : u));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      showToast(`Initializing ${formData.title}...`);
      
      const workstation = await createWorkstation(formData);
      
      // Send invites
      if (invitedUsers.length > 0) {
        await Promise.all(invitedUsers.map(u => 
          sendInvite(workstation.id, u.id, u.role)
        ));
      }

      showToast("Workstation deployed successfully!");
      if (onCreated) onCreated();
      onClose();
      navigate(`/workstation/${workstation.id}`);
    } catch (error) {
      showToast("Creation failed. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transform animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Create Workstation</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Initialize New Environment</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-8 pb-8 pt-4 custom-scrollbar">
          <form onSubmit={handleCreate} className="space-y-6">
            
            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Project Name</label>
                <input 
                  type="text"
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl px-5 py-3 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="e.g. Nexus Security Protocol"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Scope Details */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Scope Details</label>
                <textarea 
                  rows="2"
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl px-5 py-3 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition resize-none"
                  placeholder="Briefly describe the architectural goals..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* Invite Collaborators */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Invite Collaborators</label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl px-5 py-3 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Search users by name or email..."
                  value={inviteQuery}
                  onChange={(e) => setInviteQuery(e.target.value)}
                />
                
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                    {searchResults.map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleInviteUser(user)}
                        className="w-full px-5 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-white">{user.full_name}</p>
                          <p className="text-[9px] text-gray-400 font-medium">{user.email}</p>
                        </div>
                        <i className="fas fa-plus text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Invited Users List */}
              {invitedUsers.length > 0 && (
                <div className="mt-4 space-y-2">
                  {invitedUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-500/5 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                          {user.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-800 dark:text-white leading-none mb-0.5">{user.full_name}</p>
                          <p className="text-[8px] text-gray-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select 
                          className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest text-indigo-500 focus:ring-0 cursor-pointer"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="EDITOR">Editor</option>
                          <option value="VIEWER">Viewer</option>
                        </select>
                        <button 
                          type="button"
                          onClick={() => handleRemoveInvited(user.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Configuration */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Privacy Configuration</label>
              <div className="flex gap-3">
                {['private', 'public'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, visibility: type})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      formData.visibility === type 
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/10' 
                      : 'bg-transparent text-gray-400 border-gray-100 dark:border-gray-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Base Template</label>
              <div className="grid grid-cols-3 gap-3">
                {['Blank', 'Docs', 'Technical'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({...formData, template: t.toLowerCase()})}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      formData.template === t.toLowerCase() 
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' 
                      : 'border-gray-50 dark:border-gray-800'
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-tighter ${
                      formData.template === t.toLowerCase() ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
                    }`}>{t}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center gap-3 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition"
              >
                Discard
              </button>
              <button 
                type="submit"
                disabled={isCreating}
                className={`flex-[2] py-4 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all ${
                  isCreating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isCreating ? 'Initialising...' : 'Initialize Workspace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkstationModal;