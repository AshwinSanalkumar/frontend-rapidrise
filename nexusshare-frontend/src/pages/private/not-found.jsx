import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col transition-colors duration-300">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg text-center">

          <div className="auth-card p-12 relative overflow-hidden bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
            {/* Decorative Blur Element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 gradient-bg opacity-10 rounded-full blur-3xl"></div>

            <h1 className="text-9xl font-extrabold gradient-text leading-none mb-4">404</h1>

            <div className="w-20 h-1.5 gradient-bg mx-auto rounded-full mb-8"></div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Oops! Lost in the cloud?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-xs mx-auto leading-relaxed">
              The page you're looking for has been moved, deleted, or never existed in our vault.
            </p>

            <div className="space-y-4">
              {/* SPA-friendly link to Home/Dashboard */}
              <Link
                to="/dashboard"
                className="block w-full gradient-bg text-white font-bold py-4 rounded-2xl shadow-lg hover:opacity-90 transition transform active:scale-[0.98] flex items-center justify-center"
              >
                <i className="fas fa-home mr-2"></i> Return to Dashboard
              </Link>

              {/* Back button using navigate(-1) */}
              <button
                onClick={() => navigate(-1)}
                className="w-full py-4 text-sm font-bold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center justify-center"
              >
                <i className="fas fa-arrow-left mr-2"></i> Go Back
              </button>
            </div>
          </div>

          <p className="mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            NexusShare Security Protocol &copy; 2026
          </p>
        </div>
      </main>
    </div>
  );
};

export default NotFound;