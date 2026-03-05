import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Added for SPA navigation

const Navbar = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between transition-all duration-300">
      {/* LEFT: LOGO SECTION */}
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i className="fas fa-share-nodes text-white text-xl"></i>
        </div>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          NexusShare
        </span>
      </Link>

      {/* RIGHT: TOOLS & PROFILE */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800/50 rounded-full px-4 py-2 border border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all">
          <i className="fas fa-search text-gray-400 mr-2"></i>
          <input 
            type="text" 
            placeholder="Search files..." 
            className="bg-transparent border-none outline-none text-sm w-64 dark:text-gray-200"
          />
        </div>

        <button 
          onClick={() => setIsDark(!isDark)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all"
        >
          <i className={isDark ? "fas fa-sun text-yellow-400" : "fas fa-moon text-indigo-600"}></i>
        </button>

        {/* PROFILE SECTION WITH DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 border-l pl-6 border-gray-200 dark:border-gray-700 hover:opacity-80 transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold dark:text-white leading-none">Ashwin</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Standard User</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border-2 border-white dark:border-gray-800 shadow-sm">
              A
            </div>
          </button>

          {/* DROPDOWN MENU */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-52 glass rounded-2xl shadow-xl py-2 border border-gray-100 dark:border-gray-800 z-[100] animate-in fade-in zoom-in duration-200">
              {/* UPDATED: Profile Settings Link */}
              <Link 
                to="/profile" 
                onClick={() => setIsProfileOpen(false)} // Close dropdown on click
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                <i className="fas fa-user-circle text-gray-400"></i>
                Profile Settings
              </Link>
              
              <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
              
              <Link 
                to="/"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left font-medium"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;