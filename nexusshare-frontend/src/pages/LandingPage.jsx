import React from 'react';
import LandingNav from '../components/layout/LandingNav';
import { AnalyticsCard, DeviceCard } from '../components/ui/LandingFeatureCard';

const Landing = () => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden min-h-screen">
      {/* Background Shapes */}
      <div className="hero-shape w-96 h-96 bg-indigo-500 top-[-10%] left-[-10%] rounded-full absolute filter blur-[80px] opacity-40 z-0"></div>
      <div className="hero-shape w-96 h-96 bg-purple-500 bottom-[10%] right-[-10%] rounded-full absolute filter blur-[80px] opacity-40 z-0"></div>

      <LandingNav />

      {/* Hero Section */}
      <section className="pt-44 pb-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-widest mb-6 inline-block">
            Secure. Ephemeral. Encrypted.
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-8">
            Share files with <span className="gradient-text">Absolute Privacy</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The most secure way to share sensitive documents. Upload your files, set an expiry timer, and share a link that disappears forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-5 gradient-bg text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition transform active:scale-95">
              Start Sharing
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-bold rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition active:scale-95">
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Expiry Card */}
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800/50 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <i className="fas fa-bolt text-xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ultra-Fast Expiry Links</h3>
              <p className="text-gray-500 dark:text-gray-400">Set links to expire in as little as 5 minutes. Perfect for one-time credential sharing or sensitive API keys.</p>
            </div>
            <div className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-inner border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400">Expiring in:</span>
                <span className="text-red-500">04:59s</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-3">
                <div className="h-full bg-red-500 w-3/4 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Encryption Card */}
          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white flex flex-col justify-between">
            <h3 className="text-3xl font-bold mb-4">Zero-Knowledge Encryption</h3>
            <p className="opacity-80 mb-8 text-sm">We can't see your files. No one can. Your data is encrypted locally before it ever reaches our servers.</p>
            <div className="flex justify-center">
              <i className="fas fa-shield-alt text-9xl opacity-20"></i>
            </div>
          </div>

          <AnalyticsCard />
          <DeviceCard />
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="gradient-bg p-1.5 rounded-lg">
              <i className="fas fa-cloud-upload-alt text-white"></i>
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-white">NexusShare</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 NexusShare.</p>
          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-indigo-600 transition"><i className="fab fa-twitter text-lg"></i></a>
            <a href="#" className="hover:text-indigo-600 transition"><i className="fab fa-github text-lg"></i></a>
            <a href="#" className="hover:text-indigo-600 transition"><i className="fab fa-linkedin text-lg"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;