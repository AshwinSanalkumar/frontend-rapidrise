import React, { useState } from 'react';

const AnalyticsPage = () => {
  const [view, setView] = useState('daily');

  // Dates logic for the demo
  const today = new Date();
  const lastUpdated = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const dataSets = {
    daily: [
      { label: 'Mar 07', value: 65 }, { label: 'Mar 08', value: 40 }, { label: 'Mar 09', value: 85 }, 
      { label: 'Mar 10', value: 50 }, { label: 'Mar 11', value: 95 }, { label: 'Mar 12', value: 30 }, { label: 'Mar 13', value: 70 }
    ],
    weekly: [
      { label: 'Feb 16 - 22', value: 45 }, { label: 'Feb 23 - 01', value: 75 }, 
      { label: 'Mar 02 - 08', value: 60 }, { label: 'Mar 09 - 15', value: 90 }
    ],
    monthly: [
      { label: 'Oct 2025', value: 80 }, { label: 'Nov 2025', value: 55 }, { label: 'Dec 2025', value: 95 }, 
      { label: 'Jan 2026', value: 40 }, { label: 'Feb 2026', value: 65 }, { label: 'Mar 2026', value: 85 }
    ]
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-all">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. HEADER WITH TIMESTAMP */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">System Analytics</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                Last Synchronized: {lastUpdated} Today
              </p>
            </div>
          </div>
          <button className="px-5 py-2.5 gradient-bg text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
            <i className="fas fa-sync-alt mr-2 text-[10px]"></i> Refresh
          </button>
        </div>

        {/* 2. TOP METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Bandwidth', val: '2.4 TB', icon: 'fa-bolt', color: 'text-amber-500' },
            { label: 'Files Shared', val: '12,840', icon: 'fa-share-nodes', color: 'text-indigo-500' },
            { label: 'Active Links', val: '142', icon: 'fa-link', color: 'text-emerald-500' },
            { label: 'Storage Used', val: '84%', icon: 'fa-database', color: 'text-rose-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 ${stat.color}`}>
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md tracking-tighter">SECURE</span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.val}</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 3. CHART DESIGN WITH DATES */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transfer Activity</h3>
              <div className="flex bg-gray-100 dark:bg-gray-900/80 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                {['daily', 'weekly', 'monthly'].map((type) => (
                  <button key={type} onClick={() => setView(type)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === type ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-400'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Background Area */}
            <div className="relative h-64 w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]">
              <div className="absolute inset-0 flex items-end justify-around px-4">
                {dataSets[view].map((item, i) => (
                  <div key={i} className="flex flex-col items-center group h-full justify-end w-full">
                    <div 
                      className="w-2 md:w-3 gradient-bg rounded-full relative group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-500"
                      style={{ height: `${item.value}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        {item.value} GB
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 mt-4 uppercase tracking-tighter whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. DEVICE BREAKDOWN */}
          <div className="bg-white dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Traffic Sources</h3>
            <div className="space-y-6 flex-1">
              {[
                { name: 'Desktop App', pct: 65, color: 'bg-indigo-500' },
                { name: 'Mobile Web', pct: 25, color: 'bg-purple-500' },
                { name: 'External API', pct: 10, color: 'bg-slate-400' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                    <span className="text-gray-500">{item.name}</span>
                    <span className="dark:text-white">{item.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. STORAGE ALERT */}
            <div className="mt-8 p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
              <div className="flex gap-3">
                <i className="fas fa-circle-exclamation text-rose-500 mt-1"></i>
                <div>
                  <p className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-widest">Storage Warning</p>
                  <p className="text-[10px] text-rose-600 dark:text-rose-300/80 mt-1 font-medium leading-tight">Approaching 1GB Limit. Please upgrade soon.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;