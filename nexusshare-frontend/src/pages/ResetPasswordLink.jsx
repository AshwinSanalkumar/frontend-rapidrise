import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/ui/ToastContent';

const ResetPasswordLink = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Added back state for confirm eye
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired] = useState(false); 

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleReset = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      showToast("Vault credentials updated!", "success");
    }, 1500);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 font-['Plus_Jakarta_Sans']">
      
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
          
          {isExpired ? (
            /* --- STATE: EXPIRED --- */
            <div className="text-center space-y-6 animate-in zoom-in">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <i className="fas fa-hourglass-end text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Link Expired</h3>
              <Link to="/forgot-password" size="lg" className="block w-full gradient-bg text-white font-bold py-4 rounded-2xl text-center">Request New Link</Link>
            </div>
          ) : !isSuccess ? (
            /* --- STATE: ACTIVE FORM --- */
            <>
              <div className="text-center mb-10">
                {/* Fixed Logo Box: Ensure fa-shield-halved or fa-shield-check is used */}
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
                  <i className="fas fa-shield-halved text-2xl"></i>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Secure Reset</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">Link verified. Create a new secure password.</p>
              </div>

              <form onSubmit={handleReset} className="space-y-6">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPass ? "text" : "password"}
                      required 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition pr-12"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition">
                      <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Confirm New Password - Eye Restored */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirm ? "text" : "password"}
                      required 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition pr-12"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition">
                      <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  type="submit" 
                  className="w-full gradient-bg text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 hover:opacity-90 transition transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? <><i className="fas fa-circle-notch fa-spin mr-2"></i> Updating...</> : 'Save New Password'}
                </button>
              </form>
            </>
          ) : (
            /* --- STATE: SUCCESS --- */
            <div className="text-center space-y-6 animate-in zoom-in">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100 dark:border-emerald-500/20">
                <i className="fas fa-lock-open text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Password Changed!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium px-4">Your account credentials have been successfully updated.</p>
              <button onClick={() => navigate('/login')} className="w-full gradient-bg text-white font-bold py-4 rounded-2xl shadow-lg hover:opacity-90 transition active:scale-95">Login Now</button>
            </div>
          )}

          <div className="mt-8 text-center border-t border-gray-50 dark:border-gray-700/50 pt-8">
            <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition flex items-center justify-center group">
              <i className="fas fa-arrow-left mr-2 text-xs group-hover:-translate-x-1 transition-transform"></i> 
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordLink;