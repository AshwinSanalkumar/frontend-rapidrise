import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchWorkstationDetail, exportWorkstation, updateWorkstation, fetchWorkstationVersions, restoreWorkstationVersion, deleteWorkstationVersion } from '../../services/workstationService';
import { generateWorkstationPDF } from '../../utils/exportUtils';
import { useToast } from '../../components/common/ToastContent';
import { createYjsProvider } from '../../utils/yjsProvider';
import TiptapEditor, { ReadOnlyEditor } from '../../components/elements/TiptapEditor';
import * as Y from 'yjs';

const WorkstationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  
  const [ station, setStation ] = useState(null);
  const [ activeUsers, setActiveUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ isSaving, setIsSaving ] = useState(false);
  const [ isExporting, setIsExporting ] = useState(false);
  const [ versions, setVersions ] = useState([]);
  const [ showVersions, setShowVersions ] = useState(false);
  const [ isRestoring, setIsRestoring ] = useState(false);
  const [ previewVersion, setPreviewVersion ] = useState(null); // version id being previewed
  
  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const dbContentRef = useRef("");
  
  // Track sync status in a ref for the async loadData function to check immediately
  const isSyncedRef = useRef(false);

  useEffect(() => {
    // 1. Initialize Yjs
    const { ydoc, provider } = createYjsProvider(id);
    providerRef.current = provider;
    ydocRef.current = ydoc;

    const isYjsSnapshot = (content) => typeof content === 'string' && content.startsWith('yjs:');

    const tryInit = (content) => {
      if (hasInitializedRef.current || !content) return;
      const fragment = ydoc.getXmlFragment("prosemirror");

      // If remote/collab state already exists, never seed from DB again.
      if (fragment.length > 0) {
        hasInitializedRef.current = true;
        return;
      }

      if (content.startsWith('yjs:')) {
        try {
          const base64State = content.replace(/^yjs:/, '');
          const binaryString = atob(base64State);
          const update = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
          Y.applyUpdate(ydoc, update);
          hasInitializedRef.current = true;
        } catch (error) {
          console.error('Failed to restore Yjs content from DB:', error);
        }
        return;
      }

      const paragraph = new Y.XmlElement("paragraph");
      paragraph.insert(0, [new Y.XmlText(content)]);
      fragment.insert(0, [paragraph]);
      hasInitializedRef.current = true;
    };

    // 2. Fetch DB content
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchWorkstationDetail(id);
        setStation(data);
        dbContentRef.current = data.content;

        // Fast path: Yjs snapshots are safe to apply immediately and are idempotent.
        if (isYjsSnapshot(data.content)) {
          tryInit(data.content);
        }
      } catch (error) {
        showToast("Failed to load workstation");
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // 3. Sync Handler: Coordination point
    const handleSync = (isSynced) => {
      if (!isSynced) return;
      isSyncedRef.current = true;
      if (dbContentRef.current) {
        tryInit(dbContentRef.current);
      }
    };

    provider.on('sync', handleSync);

    // Fallback: only seed plain text when realtime is unavailable.
    const initTimeout = setTimeout(() => {
      const isRealtimeUnavailable = !provider.wsconnected && !provider.synced;
      if (
        !hasInitializedRef.current &&
        dbContentRef.current &&
        !isYjsSnapshot(dbContentRef.current) &&
        isRealtimeUnavailable
      ) {
        tryInit(dbContentRef.current);
      }
    }, 2000);

    // Presence Awareness
    provider.awareness.on('change', () => {
      const states = provider.awareness.getStates();
      const usersByEmail = new Map();
      states.forEach((state) => {
        if (state.user?.email) {
          usersByEmail.set(state.user.email, {
            email: state.user.email,
            name: state.user.name || state.user.email,
            color: state.user.color || '#4299e1',
          });
        }
      });
      setActiveUsers(Array.from(usersByEmail.values()));
    });

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.email) {
      const colors = ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#38b2ac', '#4299e1', '#667eea', '#9f7aea', '#ed64a6'];
      const colorIndex = currentUser.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
      const userColor = colors[colorIndex];

      provider.awareness.setLocalStateField('user', {
        email: currentUser.email,
        name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email,
        color: userColor
      });
    }

    return () => {
      clearTimeout(initTimeout);
      provider.off('sync', handleSync);
      provider.destroy();
      ydoc.destroy();
      hasInitializedRef.current = false;
    };
  }, [id]);



  const handleManualSave = async () => {
    try {
      setIsSaving(true);
      if (!ydocRef.current) return;
      const stateUpdate = Y.encodeStateAsUpdate(ydocRef.current);
      const binaryString = Array.from(stateUpdate).map(b => String.fromCharCode(b)).join('');
      const base64State = "yjs:" + btoa(binaryString);
      await updateWorkstation(id, { content: base64State });
      showToast("Workstation saved successfully");
    } catch (error) {
      showToast("Failed to save workstation");
    } finally {
      setIsSaving(false);
    }
  };

  const loadVersions = async () => {
    if (!showVersions) {
      try {
        const v = await fetchWorkstationVersions(id);
        setVersions(v);
        setShowVersions(true);
      } catch (error) {
        showToast("Failed to load versions");
      }
    } else {
      setShowVersions(false);
    }
  };

  const handleRestore = async (versionId) => {
    try {
      setIsRestoring(true);
      const updated = await restoreWorkstationVersion(id, versionId);
      showToast("Version restored. Reloading editor...");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      showToast("Failed to restore version");
      setIsRestoring(false);
    }
  };

  const handleDeleteVersion = async (versionId) => {
    try {
      const result = await deleteWorkstationVersion(id, versionId);
      setVersions(prev => prev.filter(v => v.id !== versionId));
      if (previewVersion === versionId) setPreviewVersion(null);

      if (result?.rolled_back) {
        showToast("Latest version deleted — rolled back to previous version. Reloading...");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast("Version deleted");
      }
    } catch (error) {
      showToast(error?.response?.data?.error || "Failed to delete version");
    }
  };

  const getPlainTextFromYDoc = () => {
    if (!ydocRef.current) return '';

    const fragment = ydocRef.current.getXmlFragment('prosemirror');

    const readNode = (node) => {
      if (!node) return '';

      if (node instanceof Y.XmlText) {
        return node.toString();
      }

      if (node instanceof Y.XmlElement || node instanceof Y.XmlFragment) {
        const childrenText = node.toArray().map(readNode).join('');
        const nodeName = node.nodeName || '';
        if (nodeName === 'paragraph' || nodeName === 'heading' || nodeName === 'blockquote' || nodeName === 'listItem') {
          return `${childrenText}\n`;
        }
        return childrenText;
      }

      return '';
    };

    return readNode(fragment).replace(/\n{3,}/g, '\n\n').trim();
  };

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      showToast(`Generating ${format.toUpperCase()}...`);
      if (format === 'pdf') {
        const contentForPdf = getPlainTextFromYDoc() || dbContentRef.current || '';
        generateWorkstationPDF(station, contentForPdf);
      } else {
        await exportWorkstation(id, format);
      }
      showToast("Export completed");
    } catch (error) {
      showToast(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm"
            >
              <i className="fas fa-arrow-left"></i>
            </button>

            <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
              <Link to="/workstation" className="hover:text-indigo-600 transition text-gray-500">Workstations</Link>
              <i className="fas fa-chevron-right text-[10px]"></i>
              <span className="text-gray-800 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{station?.title}</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <i className="fas fa-file-pdf text-red-500"></i> Export PDF
            </button>
            <button 
              onClick={() => handleExport('docx')}
              disabled={isExporting}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <i className="fas fa-file-word text-blue-500"></i> Export Word
            </button>
            <button 
              onClick={handleManualSave}
              disabled={isSaving}
              className={`px-6 py-2 ${isSaving ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'} text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/10 transition flex items-center gap-2`}
            >
              <i className={`fas ${isSaving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i> {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {station?.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {activeUsers.length } Active Now
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="flex items-center -space-x-2">
              {activeUsers.length === 0 ? (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  No one is editing
                </p>
              ) : (
                activeUsers.map((user) => (
                  <div
                    key={user.email}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] text-white font-bold"
                    style={{ backgroundColor: user.color }}
                    title={user.name}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {showVersions ? (
               <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden p-8 h-[65vh] overflow-y-auto custom-scrollbar">
                 <h2 className="text-xl font-black text-gray-800 dark:text-white mb-6">Version History</h2>
                 {versions.length === 0 ? <p className="text-gray-500 font-medium text-sm">No versions saved yet. Click save to create the first version snapshot.</p> : (
                   <div className="space-y-3">
                     {versions.map((ver, idx) => {
                       const isPreviewing = previewVersion === ver.id;
                       const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                       const canDelete =
                         station?.ownerEmail === currentUser.email ||
                         ver.saved_by_email === currentUser.email;
                       return (
                         <div key={ver.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                           {/* Row header */}
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 dark:bg-gray-900 gap-4">
                             <div>
                               <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                 {new Date(ver.created_at).toLocaleString(undefined, {
                                   weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                 })}
                               </p>
                               <p className="text-xs text-gray-500 mt-1 font-medium">Saved by {ver.saved_by_name}</p>
                               {idx === 0 && <span className="inline-block mt-2 px-2 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-md">Current / Latest</span>}
                             </div>
                             <div className="flex items-center gap-2 flex-shrink-0">
                               <button
                                 onClick={() => setPreviewVersion(isPreviewing ? null : ver.id)}
                                 className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all whitespace-nowrap shadow-sm"
                               >
                                 <i className={`fas ${isPreviewing ? 'fa-eye-slash' : 'fa-eye'} mr-1.5`}></i>
                                 {isPreviewing ? 'Close' : 'Preview'}
                               </button>
                               <button
                                 onClick={() => handleRestore(ver.id)}
                                 disabled={isRestoring || idx === 0}
                                 className={`px-4 py-2 ${idx === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/20'} rounded-xl text-[10px] uppercase tracking-widest font-black transition-all whitespace-nowrap`}
                               >
                                 <i className="fas fa-rotate-left mr-1.5"></i>
                                 {isRestoring ? 'Restoring...' : 'Restore'}
                               </button>
                               {canDelete && (
                                 <button
                                   onClick={() => handleDeleteVersion(ver.id)}
                                   title="Delete this version"
                                   className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 dark:border-red-500/30 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all flex-shrink-0"
                                 >
                                   <i className="fas fa-trash-alt text-[11px]"></i>
                                 </button>
                               )}
                             </div>
                           </div>
                           {/* Inline preview panel */}
                           {isPreviewing && (
                             <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
                               <div className="px-6 pt-3 pb-1 flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Read-only preview</span>
                               </div>
                               <ReadOnlyEditor content={ver.content} />
                             </div>
                           )}
                         </div>
                       );
                     })}
                   </div>
                 )}
               </div>
            ) : (
              <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
                {ydocRef.current && (
                  <TiptapEditor 
                    ydoc={ydocRef.current} 
                    provider={providerRef.current} 
                  />
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-900 dark:border-gray-800">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                Collaborators
              </h3>
              <div className="space-y-4">
                {station?.members.map(member => (
                  <UserItem 
                    key={member.id} 
                    name={member.name} 
                    role={member.role} 
                    color={member.role === 'OWNER' ? 'indigo' : 'gray'} 
                    isOnline={activeUsers.some((user) => user.email === member.email) || member.email === station.ownerEmail}
                  />
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
                Project Settings
              </button>
              <button 
                onClick={loadVersions}
                className="w-full mt-3 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
                {showVersions ? "Close Version History" : "Version History"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserItem = ({ name, role, color, isOnline }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-xl ${
        color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-gray-100 dark:bg-white/5 text-gray-400'
      } flex items-center justify-center text-[10px] font-black`}>
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-800 dark:text-white leading-none mb-1">{name}</p>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{role}</p>
      </div>
    </div>
    <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
  </div>
);

export default WorkstationPage;