import React from 'react';

export const AnalyticsCard = () => (
  <div className="bg-gray-900 p-10 rounded-[3rem] flex flex-col justify-between group overflow-hidden relative">
    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-white mb-2">Link Analytics</h3>
      <p className="text-gray-400 text-sm">Deep insights into how your files are being consumed.</p>
    </div>
    <div className="mt-8 flex items-end space-x-2 h-24 relative z-10">
      {[12, 20, 16, 24, 10].map((h, i) => (
        <div key={i} className={`w-full bg-indigo-500/${(i+1)*20} h-${h} rounded-t-lg group-hover:h-${h+4} transition-all duration-500`}></div>
      ))}
    </div>
    <div className="absolute bottom-[-20px] left-[-20px] text-white/5 transform group-hover:rotate-12 transition duration-700">
      <i className="fas fa-chart-area text-[10rem]"></i>
    </div>
  </div>
);

export const DeviceCard = () => (
  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800/50 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-10">
    <div className="flex-1">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cross-Platform Sync</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Access your secure vault from any device. Your encryption keys stay with you.</p>
    </div>
    <div className="flex-1 flex justify-center items-center space-x-8">
      {['mobile-alt', 'desktop', 'tablet-alt'].map((icon, i) => (
        <div key={i} className={`flex flex-col items-center ${i === 1 ? 'scale-125' : 'opacity-40 hover:opacity-100'} transition duration-300`}>
          <i className={`fas fa-${icon} text-4xl ${i === 1 ? 'text-indigo-600' : 'text-gray-400 dark:text-white'} mb-2`}></i>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${i === 1 ? 'text-indigo-600' : 'dark:text-gray-400'}`}>
            {icon.split('-')[0]}
          </span>
        </div>
      ))}
    </div>
  </div>
);