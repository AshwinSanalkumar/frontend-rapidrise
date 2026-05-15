import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../components/common/ToastContent';
import { useParams } from 'react-router-dom';
import {resetPassword} from '../../services/authService';

const ResetPasswordLink = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Added back state for confirm eye
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
const [isExpired, setIsExpired] = useState(false); 
  const { uid, token } = useParams();

  const validations = {
    lowercase: /[a-z]/.test(formData.password),
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*()]/.test(formData.password),
    length: formData.password.length >= 8
  };

  const isPasswordValid = Object.values(validations).every(Boolean);

  const validationMessage = (() => {
    if (!validations.lowercase) return 'Requires lowercase (a-z)';
    if (!validations.uppercase) return 'Requires uppercase (A-Z)';
    if (!validations.number) return 'Requires number (0-9)';
    if (!validations.special) return 'Requires special (!@#)';
    if (!validations.length) return 'Requires 8+ chars';
    return 'Password is secure';
  })();

const handleReset = async (e) => {

  e.preventDefault();

  if (!isPasswordValid) {
    showToast("Please meet all password requirements!", "error");
    return;
  }

  if (formData.password !== formData.confirmPassword) {

    showToast(
      "Passwords do not match!",
      "error"
    );

    return;
  }

  setIsLoading(true);

  try {

    await resetPassword(
      uid,
      token,
      formData.password
    );

    setIsSuccess(true);

    showToast(
      "Vault credentials updated!",
      "success"
    );

  } catch (error) {

    const errorMessage =
      error?.response?.data?.error;

    if (
  errorMessage ===
  "Token expired or invalid"
) {

  setIsExpired(true);

  showToast(
    "Reset link expired",
    "error"
  );

}else {

      showToast(
        errorMessage ||
        "Something went wrong",
        "error"
      );

    }

  } finally {

    setIsLoading(false);

  }
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
                  {formData.password && (
                    <div className={`mt-1 text-[8.5px] font-bold uppercase tracking-wider ${!isPasswordValid ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {!isPasswordValid ? (
                         <><i className="fas fa-exclamation-triangle mr-1"></i> {validationMessage}</>
                      ) : (
                         <><i className="fas fa-check-circle mr-1"></i> {validationMessage}</>
                      )}
                    </div>
                  )}
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