import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { sendReactivationOTP, verifyReactivationOTP } from '../../services/authService';

const STEPS = { PROMPT: 'PROMPT', SENDING: 'SENDING', OTP_INPUT: 'OTP_INPUT', SUCCESS: 'SUCCESS', FAILED: 'FAILED' };

const ReactivateAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expect email to be passed in navigation state from Login
  const email = location.state?.email;

  const [step, setStep] = useState(STEPS.PROMPT);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If no email was passed in state, immediately redirect back to login
  if (!email) {
    navigate('/login');
    return null;
  }

  const handleSendOTP = async () => {
    setStep(STEPS.SENDING);
    setError('');
    try {
      await sendReactivationOTP(email);
      setStep(STEPS.OTP_INPUT);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
      setStep(STEPS.PROMPT);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await verifyReactivationOTP(email, otp);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid OTP. Reactivation failed.';
      setError(msg);
      setStep(STEPS.FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/login');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col items-center justify-center p-6 font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <i className="fas fa-user-lock text-2xl"></i>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Account Disabled</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">{email}</p>
          </div>

          <div className="space-y-6">

            {/* STEP: PROMPT */}
            {step === STEPS.PROMPT && (
              <div className="space-y-5">
                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-4 rounded-2xl text-sm leading-relaxed border border-amber-100 dark:border-amber-500/20">
                  <p className="font-bold mb-2"><i className="fas fa-exclamation-circle mr-2"></i>Account Disabled</p>
                  <p className="opacity-90">To reactivate your account, we will send a verification OTP to your registered email address.</p>
                </div>
                {error && (
                  <div className="text-[10px] text-red-500 font-bold uppercase tracking-tight animate-pulse ml-1">{error}</div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={handleClose} className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                  <button onClick={handleSendOTP} className="flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP: SENDING */}
            {step === STEPS.SENDING && (
              <div className="flex flex-col items-center py-8 space-y-4">
                <i className="fas fa-circle-notch fa-spin text-3xl text-indigo-500"></i>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sending OTP...</p>
              </div>
            )}

            {/* STEP: OTP INPUT */}
            {step === STEPS.OTP_INPUT && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-2xl text-sm border border-green-100 dark:border-green-500/20">
                  <p><i className="fas fa-check-circle mr-2"></i>OTP sent to <strong>{email}</strong>. Check your inbox.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder="••••••"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-center text-2xl font-bold tracking-[0.5em] dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    autoFocus
                  />
                </div>
                {error && (
                  <div className="text-[10px] text-red-500 font-bold uppercase tracking-tight animate-pulse ml-1">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full px-6 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center"
                >
                  {isLoading ? <><i className="fas fa-circle-notch fa-spin mr-2"></i>Verifying...</> : 'Verify & Reactivate'}
                </button>
              </form>
            )}

            {/* STEP: SUCCESS */}
            {step === STEPS.SUCCESS && (
              <div className="flex flex-col items-center py-8 space-y-5">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-2xl text-green-600"></i>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">Account Reactivated!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">You can now log in again.</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Back to Login
                </button>
              </div>
            )}

            {/* STEP: FAILED */}
            {step === STEPS.FAILED && (
              <div className="flex flex-col items-center py-8 space-y-5">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <i className="fas fa-times text-2xl text-red-600"></i>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">Reactivation Failed</h3>
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error || 'Invalid OTP.'}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactivateAccount;
