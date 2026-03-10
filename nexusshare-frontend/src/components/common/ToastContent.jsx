import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* GLOBAL TOAST UI - Fixed to the bottom right of the screen */}
      <div className="fixed bottom-8 right-8 z-[200] space-y-4">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="toast-animate flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 pr-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 min-w-[300px]"
          >
            <div className={`flex-shrink-0 ${toast.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
              <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl`}></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook for easy access
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};