import React, { useState } from 'react';
import { useToast } from '../common/ToastContent';
import { updateMemberRole, removeMember, deleteWorkstation } from '../../services/workstationService';
import { useNavigate } from 'react-router-dom';

const ProjectSettingsModal = ({ isOpen, onClose, station, onUpdate }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !station) return null;

  // Separate owner from collaborators
  const ownerMember = station.members.find(m => m.role === 'OWNER');
  const collaborators = station.members.filter(m => m.role !== 'OWNER');

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await updateMemberRole(station.id, memberId, newRole);
      showToast("Role updated successfully");
      onUpdate();
    } catch (error) {
      showToast("Failed to update role");
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from this workstation?`)) return;
    try {
      await removeMember(station.id, memberId);
      showToast("Collaborator removed");
      onUpdate();
    } catch (error) {
      showToast("Failed to remove collaborator");
    }
  };

  const handleDeleteWorkstation = async () => {
    if (!window.confirm("CRITICAL: This will permanently delete the workstation and all its versions. This cannot be undone.")) return;
    try {
      setIsDeleting(true);
      await deleteWorkstation(station.id);
      showToast("Workstation deleted");
      onClose();
      navigate('/workstation');
    } catch (error) {
      showToast("Failed to delete workstation");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transform animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Project Settings</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Manage Collaboration & Access</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {/* Owner Section (read-only) */}
          {ownerMember && (
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Owner</h3>
              <div className="flex items-center gap-3 bg-indigo-50/60 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-500/20">
                  {ownerMember.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800 dark:text-white leading-none mb-1">{ownerMember.name}</p>
                  <p className="text-[9px] text-gray-400 font-medium">{ownerMember.email}</p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-1 rounded-lg">Owner</span>
              </div>
            </div>
          )}

          {/* Collaborators Section */}
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Collaborators</h3>
            <div className="space-y-3">
              {collaborators.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-6 font-medium italic">No collaborators added yet.</p>
              ) : (
                collaborators.map(member => (
                  <div key={member.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-white leading-none mb-1">{member.name}</p>
                        <p className="text-[9px] text-gray-400 font-medium">{member.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <select 
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-500 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      >
                        <option value="EDITOR">Editor</option>
                        <option value="VIEWER">Viewer</option>
                      </select>
                      <button 
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-all text-gray-400"
                        title="Remove collaborator"
                      >
                        <i className="fas fa-user-minus text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* Danger Zone */}
          <div>
            <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4">Danger Zone</h3>
            <div className="p-6 bg-red-50/50 dark:bg-red-500/5 rounded-[2rem] border border-red-100 dark:border-red-500/20">
              <p className="text-[10px] text-red-600 dark:text-red-400 font-bold mb-4 leading-relaxed">
                Permanently delete this workstation and all its saved versions. This action <strong>cannot be undone</strong>.
              </p>
              <button 
                onClick={handleDeleteWorkstation}
                disabled={isDeleting}
                className="px-6 py-3 bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                <i className="fas fa-trash-alt"></i>
                {isDeleting ? 'Deleting...' : 'Delete Workstation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsModal;
