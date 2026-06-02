import React from 'react';
import { Link } from 'react-router-dom';
import LandingNav from '../../components/layout/LandingNav';

const LandingPage = () => {
  return (
    <div className="bg-gray-50/50 dark:bg-[#0b0c10] transition-colors duration-500 overflow-x-hidden min-h-screen">
      
      {/* Soft Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full"></div>
      </div>

      <LandingNav />

      {/* Hero Section: The "Neo-Split" Design */}
      <section className="relative pt-48 pb-24 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-8">
            <div className="inline-block">
              <span className="px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] shadow-sm">
                Next-Gen File Sharing
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter">
              Disappear <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Without Trace.</span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl font-medium leading-relaxed">
              Experience absolute privacy. Encrypted local storage combined with automated self-destruction. Your files, your rules, zero footprint.
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <Link 
                to="/register" 
                className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Initiate Vault
              </Link>
              <Link 
                to="/login" 
                className="px-10 py-5 bg-white dark:bg-white/5 text-gray-900 dark:text-white font-black rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
              >
                Access System
              </Link>
            </div>
          </div>

          {/* Visual Canvas: The "Floating Architecture" */}
          <div className="flex-1 relative w-full max-w-xl">
            <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white dark:border-white/10 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Encryption Active</span>
                </div>

                <div className="p-6 rounded-3xl bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:rotate-6">
                    <i className="fas fa-file-shield text-2xl"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-800 dark:text-white">Confidential_Report.pdf</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">2.4 MB • AES-256</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-black text-gray-500 uppercase tracking-widest">
                    <span>Expiry Protocol</span>
                    <span className="text-red-500 animate-pulse">Destruct in 01:00:00</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[65%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Background Decorative Element */}
            <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-indigo-600/10 rounded-[3rem] rotate-6"></div>
          </div>
        </div>
      </section>
      
      {/* Feature Modules: Modular Grid */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-indigo-500/30 transition-all group">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 transition-transform group-hover:scale-110">
              <i className="fas fa-bolt-lightning text-xl"></i>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Ephemeral Links</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Create links that exist for Hours, not days. Once accessed or expired, they vanish from existence.
            </p>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-purple-500/30 transition-all group">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 mb-8 transition-transform group-hover:scale-110">
              <i className="fas fa-microchip text-xl"></i>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Local Encryption</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Data is encrypted in your browser before upload. We never see your files, and neither can anyone else.
            </p>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 transition-transform group-hover:scale-110">
              <i className="fas fa-chart-pie text-xl"></i>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Live Auditing</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Real-time monitoring of your shared assets. Know exactly when your data is accessed and by whom.
            </p>
          </div>

        </div>

        {/* Small Info Cards: Secondary Features */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          
          <button 
            onClick={() => document.getElementById('requests').scrollIntoView({ behavior: 'smooth' })}
            className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-purple-500/30 transition-all group text-left"
          >
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 mb-5 transition-transform group-hover:scale-110">
              <i className="fas fa-paper-plane text-base"></i>
            </div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Request Files</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Solicit encrypted assets directly into your vault from any NexusShare user.
            </p>
          </button>

          <button 
            onClick={() => document.getElementById('workstation').scrollIntoView({ behavior: 'smooth' })}
            className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-indigo-500/30 transition-all group text-left"
          >
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 mb-5 transition-transform group-hover:scale-110">
              <i className="fas fa-laptop-code text-base"></i>
            </div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Workstation</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Deploy real-time sync environments for multi-user collaboration.
            </p>
          </button>

          <button 
            onClick={() => document.getElementById('calendar').scrollIntoView({ behavior: 'smooth' })}
            className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-emerald-500/30 transition-all group text-left"
          >
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 mb-5 transition-transform group-hover:scale-110">
              <i className="fas fa-calendar-day text-base"></i>
            </div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Calendar Log</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Visualize your entire file history and share timeline on a dynamic grid.
            </p>
          </button>

          <button 
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-blue-500/30 transition-all group text-left"
          >
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mb-5 transition-transform group-hover:scale-110">
              <i className="fas fa-link text-base"></i>
            </div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Secure Links</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Advanced link protocols with download limits and granular access controls.
            </p>
          </button>

        </div>
      </section>

      {/* Collaborative Workstations Section - System Match Design */}
      <section id="workstation" className="py-24 px-6 relative z-10 bg-white/30 dark:bg-white/[0.02] border-y border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          
          <div className="flex-1 order-2 lg:order-1">
            {/* MATCHING SYSTEM EDITOR - Authentic Preview */}
            <div className="w-full max-w-lg bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden relative group">
              {/* Header Bar */}
              <div className="px-6 py-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Workstation_Delta</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center">
                    <i className="fas fa-file-pdf text-[9px] text-red-500"></i>
                  </div>
                  <div className="px-3 h-7 rounded-lg bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-indigo-500/20">
                    Save
                  </div>
                </div>
              </div>

              {/* Editor Content Area */}
              <div className="p-8 min-h-[220px] relative">
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Nexsus-Share.pdf</h3>
                  <div className="space-y-2">
                    <div className="h-1.5 w-3/4 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                    <div className="h-1.5 w-1/2 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                    <div className="h-1.5 w-2/3 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                    <div className="h-1.5 w-[85%] bg-gray-100 dark:bg-white/5 rounded-full"></div>
                  </div>
                </div>

                {/* AUTHENTIC CURSOR 1 (Matching WorkstationPage.jsx) */}
                <div className="absolute top-[45%] left-[55%] pointer-events-none z-50 animate-in fade-in slide-in-from-bottom-2 duration-700">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-indigo-500">
                    <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="currentColor" stroke="white" strokeWidth="1.5" />
                  </svg>
                  <div className="ml-2 px-1.5 py-0.5 bg-indigo-500 rounded-md text-[7px] font-black uppercase tracking-tighter text-white whitespace-nowrap shadow-sm border border-white/20">
                    Sarah Connor
                  </div>
                </div>

                {/* AUTHENTIC CURSOR 2 */}
                <div className="absolute top-[68%] left-[22%] pointer-events-none z-50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                    <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="currentColor" stroke="white" strokeWidth="1.5" />
                  </svg>
                  <div className="ml-2 px-1.5 py-0.5 bg-purple-500 rounded-md text-[7px] font-black uppercase tracking-tighter text-white whitespace-nowrap shadow-sm border border-white/20">
                    Max Sterling
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="bg-gray-50/50 dark:bg-black/20 px-6 py-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[5px] text-white font-black">SC</div>
                    <div className="w-5 h-5 rounded-full bg-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[5px] text-white font-black">MS</div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[5px] text-white font-black">RJ</div>
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest tabular-nums">3 Active Now</span>
                </div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Secure Sync
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 order-1 lg:order-2 space-y-6">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-laptop-code"></i>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
              Real-time <br />
              <span className="text-indigo-500">Workstations.</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Experience the power of real-time multi-user editing. Deploy synchronized workstations for your team with built-in version control and secure execution environments.
            </p>
            <ul className="space-y-3">
              {[
                { icon: 'fa-users', text: 'Live Multi-Cursor Editing' },
                { icon: 'fa-history', text: 'Granular Version Snapshots' },
                { icon: 'fa-shield-halved', text: 'Isolated Sandbox Environment' }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <i className={`fas ${item.icon} text-[10px] text-indigo-500`}></i>
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* NEW: File Requests Section */}
      <section id="requests" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-6">
             <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-paper-plane"></i>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
              Effortless <br />
              <span className="text-purple-500">File Requests.</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Collaborate across the platform with precision. Send encrypted file requests to other NexusShare users and have assets delivered directly to your secure vault.
            </p>
            <ul className="space-y-3">
              {[
                { icon: 'fa-envelope-open-text', text: 'Request Files from Any User' },
                { icon: 'fa-clock', text: '24-Hour Auto-Expiry on Requests' },
                { icon: 'fa-box-archive', text: 'Fulfilled Files Land in Your Vault' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <i className={`fas ${item.icon} text-[10px] text-purple-500`}></i>
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 w-full flex justify-center">
            {/* FILE REQUEST CARD INTERFACE */}
            <div className="w-full max-sm bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6">
                <i className="fas fa-share-nodes text-purple-500/10 text-6xl"></i>
              </div>
              <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-2">Request Active</h4>

              
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-gray-50/50 dark:bg-white/[0.02] border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center flex-col py-12 transition-all group-hover:border-purple-500/50 group-hover:bg-purple-500/[0.02]">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-white/5 flex items-center justify-center mb-4 shadow-sm">
                    <i className="fas fa-cloud-arrow-up text-2xl text-gray-300 dark:text-gray-600 group-hover:text-purple-500 group-hover:scale-110 transition-all"></i>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Drop Files Here</span>
                </div>
                <button disabled className="w-full py-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] cursor-not-allowed border border-purple-500/10">
                  Awaiting Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Activity Calendar Section */}
      <section id="calendar" className="py-24 px-6 relative z-10 bg-white/30 dark:bg-white/[0.02] border-y border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">

          {/* Calendar Visual Card */}
          <div className="flex-1 w-full flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-sm bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight">June 2026</span>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <i className="fas fa-chevron-left text-[9px] text-emerald-600"></i>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <i className="fas fa-chevron-right text-[9px] text-emerald-600"></i>
                  </div>
                </div>
              </div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <div key={i} className="text-[9px] font-black text-gray-400 uppercase py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {[
                  null, null, null, '1', '2', '3', '4',
                  '5', '6', '7', '8', '9', '10', '11',
                  '12', '13', '14', '15', '16', '17', '18',
                  '19', '20', '21', '22', '23', '24', '25',
                  '26', '27', '28', '29', '30', null, null,
                ].map((d, i) => {
                  const active = ['3','8','11','15','22','28'].includes(d);
                  const today = d === '1';
                  return (
                    <div key={i} className={`text-[10px] font-black rounded-xl py-1.5 ${
                      !d ? '' :
                      today ? 'bg-indigo-600 text-white' :
                      active ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                      'text-gray-500 dark:text-gray-500'
                    }`}>{d || ''}</div>
                  );
                })}
              </div>
              <div className="mt-5 flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Upload Day</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 order-1 lg:order-2 space-y-6">
            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-calendar-days"></i>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
              Your Activity, <br />
              <span className="text-emerald-500">At a Glance.</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Never lose track of what you've shared or uploaded. The built-in activity calendar visualizes your entire file history — uploads, shares, and requests — month by month.
            </p>
            <ul className="space-y-3">
              {[
                { icon: 'fa-calendar-check', text: 'Month-by-Month Upload History' },
                { icon: 'fa-chart-line', text: 'Daily & Weekly Activity Snapshots' },
                { icon: 'fa-link', text: 'Share Event Timeline Included' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <i className={`fas ${item.icon} text-[10px] text-emerald-500`}></i>
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tech Footer */}
      <footer className="py-12 md:py-20 px-6 border-t border-gray-100 dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div >
              <i className="fa-brands fa-cloudversify text-4xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">NexusShare</span>
          </div>

         <div className="flex flex-col items-center md:items-end space-y-4">
  <a className="text-[10px] font-black text-gray-500 hover:text-indigo-600 transition-all  tracking-[0.2em] bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-2.5">
    <i className="fas fa-envelope text-[11px]"></i>
    FOR QUERIES: admin.nexusshare@gmail.com
  </a>

  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
    © 2026 Nexus Share. Protected. Private. Reliable.
  </p>
</div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-indigo-600 shadow-2xl z-[100] hover:scale-110 active:scale-95 transition-all group"
      >
        <i className="fas fa-chevron-up text-sm group-hover:-translate-y-1 transition-transform"></i>
      </button>
    </div>
  );
};

export default LandingPage;