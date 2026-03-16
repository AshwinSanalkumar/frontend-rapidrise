import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

const LandingNav = () => {
   const [isDark, setIsDark] = useState(() => {
     const saved = localStorage.getItem('theme');
     return saved === 'dark';
   });

useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <nav className="fixed w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-[2rem] px-6 py-3 border border-white/20 dark:border-gray-800 shadow-xl flex justify-between items-center">
        
        {/* Logo - Link to Home */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i className="fas fa-share-nodes text-white text-xl"></i>
        </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-800 dark:text-white">
            NexusShare
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-600 dark:text-gray-300">
          {/* Internal Anchor Link (Hash remains <a>) */}
          <a href="#features" className="hover:text-indigo-600 transition">Features</a>
          
          {/* Sign In - Link */}
          <Link to="/login" className="hover:text-indigo-600 transition">
            Sign In
          </Link>

          <button 
          onClick={() => setIsDark(!isDark)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all"
        >
          <i className={isDark ? "fas fa-sun text-yellow-400" : "fas fa-moon text-indigo-600"}></i>
        </button>
          
          {/* Register - Link */}
          <Link 
            to="/register" 
            className="gradient-bg text-white px-6 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;