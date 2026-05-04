import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchWorkstationDetail, exportWorkstation, updateWorkstation } from '../../services/workstationService';
import { generateWorkstationPDF } from '../../utils/exportUtils';
import { useToast } from '../../components/common/ToastContent';

const WorkstationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  
  const [station, setStation] = useState(null);
  const [content, setContent] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [activeEditor, setActiveEditor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const socketRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    loadWorkstation();
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [id]);

  const loadWorkstation = async () => {
    try {
      setLoading(true);
      const data = await fetchWorkstationDetail(id);
      setStation(data);
      setContent(data.content);
    } catch (error) {
      showToast("Failed to load workstation data");
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//localhost:8000/ws/workstation/${id}/`;
    
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'content_update') {
        setContent(data.content);
        setActiveEditor(data.sender_email || "Someone");
        setTimeout(() => setActiveEditor(null), 2000);
      } else if (data.type === 'presence_update') {
        if (data.action === 'join') {
          setActiveUsers(prev => [...new Set([...prev, data.user])]);
        } else if (data.action === 'leave') {
          setActiveUsers(prev => prev.filter(u => u !== data.user));
        }
      }
    };

    socketRef.current.onclose = (e) => {
      if (e.code === 4003) {
        console.error('WebSocket connection rejected: Permission Denied');
        showToast("You don't have permission to access this workstation.");
        return; // Don't retry if rejected due to permissions
      }
      console.log('WebSocket disconnected. Attempting reconnect...');
      setTimeout(connectWebSocket, 3000);
    };
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'content_update',
          content: newContent
        }));
      }
    }, 500); 
  };

  const handleManualSave = async () => {
    try {
      setIsSaving(true);
      await updateWorkstation(id, { content });
      showToast("Workstation saved successfully");
    } catch (error) {
      showToast("Failed to save workstation");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      showToast(`Generating ${format.toUpperCase()}...`);
      
      if (format === 'pdf') {
        generateWorkstationPDF(station, content);
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
        
        {/* BREADCRUMB & BACK BUTTON */}
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
        
        {/* TOP BAR: Presence Indicator */}
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
            <div className="flex -space-x-2">
              
              {activeUsers.map(u => (
                <div key={u} className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold" title={u}>
                  {u.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            {activeEditor && (
              <>
                <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
                <p className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                  <span className="text-indigo-500">{activeEditor}</span> is editing...
                </p>
              </>
            )}
          </div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* EDITOR SECTION */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* Editor Toolbar */}
              <div className="px-8 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-6">
                <button className="text-gray-400 hover:text-indigo-500 transition"><i className="fas fa-bold"></i></button>
                <button className="text-gray-400 hover:text-indigo-500 transition"><i className="fas fa-italic"></i></button>
                <button className="text-gray-400 hover:text-indigo-500 transition"><i className="fas fa-link"></i></button>
                <div className="h-4 w-[1px] bg-gray-100 dark:bg-gray-800"></div>
                <button className="text-gray-400 hover:text-indigo-500 transition"><i className="fas fa-list"></i></button>
              </div>

              <textarea
                className="w-full h-[65vh] p-10 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none resize-none text-lg leading-relaxed placeholder-gray-300 custom-scrollbar"
                placeholder="Start typing your ideas here..."
                value={content}
                onChange={handleContentChange}
              />
            </div>
          </div>

          {/* SIDEBAR */}
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
                    isOnline={activeUsers.includes(member.email) || member.email === station.ownerEmail}
                  />
                ))}
              </div>
              
              <button className="w-full mt-8 py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
                Project Settings
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