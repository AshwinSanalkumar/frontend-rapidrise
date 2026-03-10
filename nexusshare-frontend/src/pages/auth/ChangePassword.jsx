import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Internal Sub-component: PasswordField
 * Keeps the main component DRY and manages its own visibility state.
 */
const PasswordField = ({ label, value, onChange, showToggle = true }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative">
        <input 
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required 
          className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all"
        />
        {showToggle && (
          <button 
            type="button" 
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <i className={`fas ${isVisible ? 'fa-eye-slash' : 'fa-eye'} w-5`}></i>
          </button>
        )}
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [form, setForm] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: ''
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    
    // Validation Logic
    if (form.newPass !== form.confirmPass) {
      alert("New passwords do not match!");
      return;
    }

    setIsUpdating(true);

    // Simulate API Call & Encryption
    setTimeout(() => {
      setIsUpdating(false);
      setIsSuccess(true);
      
      // Auto-redirect back to profile
      setTimeout(() => navigate('/profile'), 1000);
    }, 1200);
  };

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-xl mx-auto">
        
        {/* Navigation Header */}
        <header className="mb-10">
          <Link 
            to="/profile" 
            className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center mb-4 hover:underline group"
          >
            <i className="fas fa-arrow-left mr-2 transition-transform group-hover:-translate-x-1"></i> 
            Back to Profile
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Security Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Update your vault credentials and encryption keys.
          </p>
        </header>

        {/* Change Password Card */}
        <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-all">
          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="space-y-6">
              
              <PasswordField 
                label="Current Password" 
                value={form.currentPass}
                onChange={(val) => setForm({...form, currentPass: val})}
              />

              <hr className="border-gray-100 dark:border-gray-700" />

              <PasswordField 
                label="New Password" 
                value={form.newPass}
                onChange={(val) => setForm({...form, newPass: val})}
              />

              <PasswordField 
                label="Confirm New Password" 
                value={form.confirmPass}
                onChange={(val) => setForm({...form, confirmPass: val})}
              />
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isUpdating || isSuccess}
                className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center ${
                  isSuccess 
                    ? 'bg-emerald-500 text-white shadow-emerald-100 dark:shadow-none' 
                    : 'gradient-bg text-white hover:opacity-90 hover:shadow-indigo-200 dark:hover:shadow-none'
                }`}
              >
                {isUpdating ? (
                  <><i className="fas fa-circle-notch fa-spin mr-2"></i> Encrypting...</>
                ) : isSuccess ? (
                  <><i className="fas fa-check mr-2"></i> Password Updated</>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 px-6 leading-relaxed">
          <i className="fas fa-info-circle mr-1"></i>
          For your security, changing your password will terminate all other active sessions across your devices.
        </p>
      </div>
    </main>
  );
};

export default ChangePassword;