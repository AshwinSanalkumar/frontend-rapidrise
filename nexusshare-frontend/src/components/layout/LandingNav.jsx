import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link

const LandingNav = () => {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  return (
    <nav className="fixed w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-[2rem] px-6 py-3 border border-white/20 dark:border-gray-800 shadow-xl flex justify-between items-center">
        
        {/* Logo - Link to Home */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="gradient-bg p-1.5 rounded-lg">
            <i className="fas fa-cloud-upload-alt text-white text-lg"></i>
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

          <button onClick={toggleTheme} className="text-gray-400 hover:text-indigo-600 transition">
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
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