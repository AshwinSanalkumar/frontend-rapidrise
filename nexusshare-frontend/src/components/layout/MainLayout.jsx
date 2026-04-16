import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const { isDark } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on navigation (optional, but usually better UX)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="bg-gray-50 dark:bg-[#0f172a] min-h-screen flex flex-col transition-colors duration-300">
      <div className="sticky top-0 z-50 w-full">
        <Navbar 
          onToggleSidebar={toggleSidebar}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={closeSidebar}
          ></div>
        )}

        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        
        <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-none px-0">
            <Outlet context={{ isSidebarOpen, toggleSidebar }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;