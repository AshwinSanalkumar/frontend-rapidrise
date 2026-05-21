import React, { useState } from 'react';
import { deactivateAccount } from '../../services/profileService';
import { useToast } from '../common/ToastContent';

const DeactivateAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (!isOpen) return null;

  const handleDeactivate = async (e) => {
    e.preventDefault();
    if (!password) {
      showToast("Password is required to deactivate account.", "error");
      return;
    }

    setIsLoading(true);
    try {
      await deactivateAccount(password);
      showToast("Account deactivated successfully. Logging out...", "success");
      onSuccess();
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to deactivate account.";
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Deactivate Account</h2>
              <p className="text-sm text-red-500/80 dark:text-red-400/80 mt-1 font-medium">
                Proceed with extreme caution.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleDeactivate} className="p-6">
          <div className="mb-6 space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm leading-relaxed border border-red-100 dark:border-red-500/20">
              <p className="font-bold mb-2"><i className="fas fa-exclamation-triangle mr-2"></i> What happens next?</p>
              <ul className="list-disc list-inside space-y-1 opacity-90">
                <li>Your account will be deactivated for 30 days.</li>
                <li>You will not be visible across the platform.</li>
                <li>After 30 days, your account will be <strong>permanently deleted</strong>, clearing all your stored files.</li>
                <li>To reverse this, simply login again before the 30 days expire.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Confirm your Password
              </label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required 
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all pr-12"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <><i className="fas fa-circle-notch fa-spin mr-2"></i> Processing...</>
              ) : (
                'Deactivate'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeactivateAccountModal;
