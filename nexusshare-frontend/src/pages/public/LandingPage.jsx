import React from 'react';
import { Link } from 'react-router-dom';
import LandingNav from '../../components/layout/LandingNav';

const LandingN = () => {
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
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter">
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
                    <span className="text-red-500 animate-pulse">Destruct in 05:00</span>
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
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-indigo-500/30 transition-all group">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 transition-transform group-hover:scale-110">
              <i className="fas fa-bolt-lightning text-xl"></i>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Ephemeral Links</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Create links that exist for minutes, not days. Once accessed or expired, they vanish from existence.
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
      </section>

      {/* Tech Footer */}
      <footer className="py-20 px-6 border-t border-gray-100 dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-share-nodes text-white text-xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">NexusShare</span>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-8">
              {['twitter', 'github', 'linkedin'].map((s) => (
                <a key={s} href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                  <i className={`fab fa-${s} text-xl`}></i>
                </a>
              ))}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">© 2026 Nexus Protocol. Secure Node Active.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingN;