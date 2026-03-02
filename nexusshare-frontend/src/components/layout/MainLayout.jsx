import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

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
    <div className="bg-gray-50 dark:bg-[#0f172a] min-h-screen flex flex-col transition-colors duration-300">
      <div className="sticky top-0 z-40 w-full">
        <Navbar isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
      </div>
      <div className="flex flex-1 overflow-hidden">

        <Sidebar />
        <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto custom-scrollbar p-6 lg:p-12">
          <div className="w-full max-w-none px-0"> 
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;