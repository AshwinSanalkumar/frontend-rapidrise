import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchFiles } from '../../services/fileService';

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const requests = [
    { id: 1, status: 'pending' }, 
    { id: 2, status: 'approved' }
  ];

  // 2. Logic to check for any pending items
  const hasPending = requests.some(req => req.status === 'pending');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch files for search suggestions
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const data = await fetchFiles();
        setFiles(data.files || []);
      } catch (error) {
        console.error('Failed to load files for navbar:', error);
      }
    };
    if (user) loadFiles();
  }, [user]);


  // LIVE SEARCH LOGIC (Suggestions)
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); 
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, files]);

  // Click Outside Logic
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/files?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (name) => {
    navigate(`/files?search=${encodeURIComponent(name)}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <nav className="glass sticky top-0 z-50 px-4 md:px-6 py-4 md:py-6 flex items-center justify-between transition-all duration-300">
      {/* LEFT: LOGO & MOBILE TOGGLE SECTION */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Hamburger Menu (Mobile Only) */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 active:scale-95 transition-all"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>

        <Link to="/dashboard" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 md:w-10 md:h-10 gradient-bg rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-share-nodes text-white text-sm md:text-xl"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
              NEXUS<span className="text-indigo-500">SHARE</span>
            </span>
            <span className="hidden xs:block text-[6px] md:text-[7px] font-black tracking-[0.2em] md:tracking-[0.3em] text-gray-400 uppercase leading-none mt-1">
              Verified Protocol
            </span>
          </div>
        </Link>
      </div>

      {/* RIGHT: TOOLS & PROFILE */}
      <div className="flex items-center gap-6">
        
        {/* SEARCH BAR SECTION */}
        <div className="relative" ref={searchRef}>
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800/50 rounded-full px-4 py-2 border border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all">
            <i className="fas fa-search text-gray-400 mr-2"></i>
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              className="bg-transparent border-none outline-none text-sm w-64 dark:text-gray-200"
            />
          </div>

          {/* LIVE POPUP - Designed to match your Glassmorphism style */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-3 glass rounded-2xl shadow-2xl py-2 border border-gray-100 dark:border-gray-800  animate-in fade-in zoom-in duration-200 overflow-hidden">
              <p className="px-4 py-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">Suggestions</p>
              {suggestions.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleSelectSuggestion(file.name)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-left"
                >
                  <i className="fas fa-file text-indigo-500 text-xs"></i>
                  <span className="truncate font-medium">{file.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all"
        >
          <i className={isDark ? "fas fa-sun text-yellow-400" : "fas fa-moon text-indigo-600"}></i>
        </button>
        <Link 
          to="/received-request" 
          className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all group"
        >
          <i className="fas fa-inbox text-indigo-600"></i>
          
          {/* Notification Red Dot - Only shows if requests.length > 0 */}
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
              {/* Outer Ping Animation */}
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              {/* Inner Static Dot */}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </Link>
        {/* PROFILE SECTION */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 border-l pl-6 border-gray-200 dark:border-gray-700 hover:opacity-80 transition-all"
          >
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border-2 border-white dark:border-gray-800 shadow-sm">
              {user ? (user.first_name ? user.first_name[0] : user.email[0].toUpperCase()) : 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold dark:text-white leading-none">{user?.first_name || 'User'}</p>
              <p className="text-[8px] text-gray-500 dark:text-gray-400 tracking-wider">{user?.email || 'email@example.com'}</p>
            </div>
          
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-52 glass rounded-2xl shadow-xl py-2 border border-gray-100 dark:border-gray-800 z-[100] animate-in fade-in zoom-in duration-200">
              <Link 
                to="/profile" 
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                <i className="fas fa-user-circle text-gray-400"></i>
                Profile Settings
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
              <button 
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left font-medium"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;