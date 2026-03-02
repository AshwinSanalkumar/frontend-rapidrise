import React, { useState } from 'react';

const ShareModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
      <div className="glass dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden modal-animate border border-white/20">
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Share Secure Link</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <i className="fas fa-times-circle text-2xl"></i>
          </button>
        </div>
        <div className="p-8">
          <div className="space-y-5">
            <input type="email" placeholder="Recipient Email" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" />
            <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none">
              <option value="1h">1 Hour (Standard)</option>
              <option value="5m">5 Minutes (Highly Secure)</option>
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            className={`w-full mt-8 py-4 rounded-2xl shadow-lg transition flex items-center justify-center font-bold text-white ${sent ? 'bg-emerald-500' : 'gradient-bg hover:opacity-90'}`}
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : sent ? 'Link Sent!' : (
              <><span>Send Secure Link</span><i className="fas fa-paper-plane ml-2"></i></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;