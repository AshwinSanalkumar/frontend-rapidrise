import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

const LandingNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <nav className="fixed w-full z-50 px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-[1.5rem] md:rounded-[2rem] px-4 md:px-6 py-3 border border-white/20 dark:border-gray-800 shadow-xl flex justify-between items-center relative">
        
        {/* Logo - Link to Home */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 md:w-10 md:h-10 gradient-bg rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-share-nodes text-white text-sm md:text-xl"></i>
          </div>
          <span className="text-lg md:text-xl font-extrabold tracking-tight text-gray-800 dark:text-white">
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

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
           <button 
             onClick={() => setIsDark(!isDark)}
             className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all"
           >
             <i className={isDark ? "fas fa-sun text-yellow-400" : "fas fa-moon text-indigo-600"}></i>
           </button>
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="p-2 text-gray-600 dark:text-gray-300"
           >
             <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
           </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-4 glass rounded-3xl border border-white/20 dark:border-gray-800 shadow-2xl p-6 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-600 dark:text-gray-300 px-4">Features</a>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-600 dark:text-gray-300 px-4">Sign In</Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="gradient-bg text-white px-6 py-4 rounded-2xl shadow-lg font-bold text-center">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNav;