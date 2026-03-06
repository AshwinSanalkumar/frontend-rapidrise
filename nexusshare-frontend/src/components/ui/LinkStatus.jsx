import React from 'react';
import { useNavigate } from 'react-router-dom';

const LinkStatus = ({ type = "expired" }) => {
  const navigate = useNavigate();

  const configs = {
    expired: {
      title: "Link Expired",
      desc: "This secure link was set to auto-destruct after 5 minutes for maximum privacy. The access window has closed.",
      icon: "fa-hourglass-end",
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20"
    },
    revoked: {
      title: "Access Revoked",
      desc: "The file owner has manually terminated this sharing session or the file has been deleted from the vault.",
      icon: "fa-user-slash",
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/20"
    }
  };

  const active = configs[type];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[3rem] p-12 shadow-2xl border border-gray-100 dark:border-gray-700 text-center">
        
        <div className={`${active.bg} w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8`}>
          <i className={`fas ${active.icon} ${active.color} text-3xl`}></i>
        </div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          {active.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10">
          {active.desc}
        </p>

        <button 
          onClick={() => navigate('/')}
          className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl hover:opacity-90 transition shadow-lg"
        >
          Return to Dashboard
        </button>

        <div className="mt-12 flex items-center justify-center space-x-2 opacity-20">
          <div className="h-[1px] w-8 bg-gray-400"></div>
          <i className="fas fa-lock text-[10px]"></i>
          <div className="h-[1px] w-8 bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export default LinkStatus;