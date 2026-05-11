import React, { useState, useEffect } from 'react';
import { fetchStorageStats, fetchUploadHistory, fetchStorageTrends } from '../../services/fileService';

const AnalyticsPage = () => {
  const [view, setView] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [storageData, setStorageData] = useState({
    total: 0,
    used: 0,
    trash_size: '0 MB',
    categories: []
  });
  const [trendData, setTrendData] = useState({ monthly: [], daily: [], weekly: [] });
  const [globalStats, setGlobalStats] = useState({
    total_uploads: 0,
    total_shares: 0,
    active_links: 0
  });

  // Dates logic for the demo
  const today = new Date();
  const lastUpdated = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [stats, history, trends] = await Promise.all([
        fetchStorageStats(),
        fetchUploadHistory(today.getFullYear(), today.getMonth() + 1),
        fetchStorageTrends()
      ]);
      setStorageData(stats);
      setTrendData(trends);
      setGlobalStats({
        total_uploads: history.global_stats?.total_uploads || 0,
        total_shares: history.global_stats?.total_shares || 0,
        active_links: history.global_stats?.active_links || 0
      });
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const usedPercentage = storageData.total ? (storageData.used / (storageData.total*1024)) * 100 : 0;

  return (
    <div className="flex-1 p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-all">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. HEADER WITH TIMESTAMP */}
        <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition shadow-sm">
          <i className="fas fa-arrow-left"></i>
        </button>
        <nav className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
          <span className="text-gray-800 dark:text-gray-200">Analytics</span>
        </nav>
      </div>
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center">
                  System Analytics
                </h1>
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
          <button onClick={loadAnalytics} disabled={loading} className="px-5 py-2.5 gradient-bg text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all disabled:opacity-50">
            <i className={`fas fa-sync-alt mr-2 text-[10px] ${loading ? 'animate-spin' : ''}`}></i> {loading ? 'Syncing...' : 'Refresh'}
          </button>
        </div>

        {/* 2. TOP METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Vault Capacity', val: `${storageData.total} GB`, icon: 'fa-database', color: 'text-indigo-500' },
            { label: 'Total Files', val: globalStats.total_uploads.toLocaleString(), icon: 'fa-file-lines', color: 'text-amber-500' },
            { label: 'Active Links', val: globalStats.active_links.toLocaleString(), icon: 'fa-link', color: 'text-emerald-500' },
            { label: 'Storage Used', val: `${usedPercentage.toFixed(1)}%`, icon: 'fa-chart-pie', color: 'text-rose-500' },
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
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {view === 'daily' ? 'Upload Volume' : view === 'weekly' ? 'Batch Activity' : 'Storage History'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    {view === 'monthly' ? 'Percent of vault capacity used' : 'Volume of data synchronized'}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">
                    {(() => {
                      const data = trendData[view] || [];
                      if (data.length === 0) return '';
                      return `${data[0].label} - ${data[data.length - 1].label}`;
                    })()}
                  </p>
                </div>
              </div>
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
                {(trendData[view] || []).map((item, i) => {
                  // Normalize height: For MB/Files we need a scale. For storage (%) it's 0-100.
                  const maxVal = Math.max(...trendData[view].map(d => d.value), 10);
                  const displayHeight = view === 'monthly' ? item.value : (item.value / maxVal * 80);

                  return (
                    <div key={i} className="flex flex-col items-center group h-full justify-end w-full relative">
                      <div 
                        className={`w-3 md:w-5 rounded-t-lg relative transition-all duration-700 bg-gradient-to-t ${view === 'monthly' ? 'from-indigo-600 to-purple-500' : 'from-emerald-500 to-teal-400'} group-hover:brightness-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]`}
                        style={{ height: `${Math.max(displayHeight, 5)}%` }}
                      >
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30">
                          <div className="bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl flex flex-col items-center whitespace-nowrap">
                            <span>{item.value.toFixed(view === 'weekly' ? 0 : 1)} {item.unit || '%'}</span>
                            <div className="w-2 h-2 bg-gray-900 rotate-45 -mb-2 mt-1"></div>
                          </div>
                        </div>
                      </div>
                      <div className="h-8 flex items-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. DEVICE BREAKDOWN */}
          <div className="bg-white dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Content Mix</h3>
            <div className="space-y-6 flex-1">
              {storageData.categories.length > 0 ? (
                storageData.categories.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                      <span className="text-gray-500">{item.name}</span>
                      <span className="dark:text-white">{item.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                   <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-gray-300 mb-2">
                     <i className="fas fa-box-open"></i>
                   </div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Content Found</p>
                </div>
              )}
            </div>

            {/* 5. RECLAIMABLE SPACE */}
            <div className="mt-8 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
              <div className="flex gap-3">
                <i className="fas fa-broom text-indigo-500 mt-1"></i>
                <div>
                  <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Reclaimable Space</p>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-300/80 mt-1 font-medium leading-tight">You can free up <span className="font-bold text-indigo-600 dark:text-indigo-400">{storageData.trash_size}</span> by emptying your trash.</p>
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