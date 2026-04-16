import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/common/ToastContent';

const ForgotPassword = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleRecovery = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      showToast("Recovery link sent to your email!", "success");
    }, 1500);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-6 font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      
      {/* Recovery Card */}
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
          
          {!isSubmitted ? (
            <>
              <div className="text-center mb-10">
                {/* Branding Icon */}
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <i className="fas fa-paper-plane text-2xl"></i>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recovery</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
                  Enter your email and we'll send a secure link to reset your vault.
                </p>
              </div>

              <form onSubmit={handleRecovery} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com" 
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition pl-12"
                    />
                    <i className="fas fa-envelope absolute left-5 top-5 text-gray-400 text-sm"></i>
                  </div>
                </div>

                {/* Expiration Notice - 5 Minute Constraint */}
                <div className="flex items-center space-x-3 px-4 py-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                  <i className="fas fa-shield-alt text-indigo-500 text-xs"></i>
                  <p className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold leading-tight uppercase tracking-wider">
                    Link valid for 5 minutes only
                  </p>
                </div>

                <button 
                  disabled={isLoading}
                  type="submit" 
                  className="w-full gradient-bg text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 hover:opacity-90 transition transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? (
                    <><i className="fas fa-circle-notch fa-spin mr-2"></i> Sending...</>
                  ) : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            /* Success State View */
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <i className="fas fa-check text-2xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Check your Inbox</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  Recovery instructions sent to <br/>
                  <span className="text-gray-900 dark:text-white font-bold">{email}</span>.
                </p>
              </div>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline active:opacity-70 transition"
              >
                Didn't get the email? Try again
              </button>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 text-center border-t border-gray-50 dark:border-gray-700/50 pt-8">
            <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition flex items-center justify-center group">
              <i className="fas fa-arrow-left mr-2 text-xs group-hover:-translate-x-1 transition-transform"></i> 
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;