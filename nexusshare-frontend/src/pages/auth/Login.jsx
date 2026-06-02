import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastContent';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login(formData);
    
    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else if (result.code === 'requires_reactivation') {
      navigate('/reactivate', { state: { email: result.email } });
    } else {
      setError(result.message);
      showToast(result.message, "error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Branding & Security Info */}
        <div className="hidden lg:flex p-16 flex-col justify-between relative overflow-hidden bg-gray-50/50 dark:bg-[#0b0c10] border-r border-gray-100 dark:border-white/5">
          {/* Soft Ambient Glows (Matches Landing Page) */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-[80%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center space-x-3 mb-16 group">
              <div >
                <i className="fa-brands fa-cloudversify text-2xl"></i>
              </div>
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">NexusShare</span>
            </Link>
            
            <div className="space-y-6">
             
              
              <h1 className="text-6xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter">
                Access <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">The Vault.</span>
              </h1>

              <p className="text-gray-500 dark:text-gray-400 max-w-xs font-medium leading-relaxed">
                Re-enter your secure session to manage your disappearing digital footprint.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            {/* Visual Architecture - Matches Landing Page Feature Cards */}
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white dark:border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
                  <i className="fas fa-fingerprint text-xl"></i>
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight">Identity Verified</h4>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <span>Safe Sharing</span>
                  <span className="text-emerald-500">100% SECURE</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[85%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-20 flex flex-col justify-center bg-white dark:bg-slate-900">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Login</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Welcome back to your secure workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                required 
                placeholder="example@gmail.com" 
                value={formData.email}
                onChange={handleChange}
                className="input-clean w-full px-5 py-4 rounded-2xl text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" title="Links valid for 5 mins" className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase transition hover:underline">
                  forgot password
                </Link>
              </div>
              <div className="relative"
               onPaste={(e) => e.target.name === 'password' && e.preventDefault()}
                onCopy={(e) => e.target.name === 'password' && e.preventDefault()}
                onCut={(e) => e.target.name === 'password' && e.preventDefault()}
                onDragStart={(e) => e.target.name === 'password' && e.preventDefault()}
                onDrop={(e) => e.target.name === 'password' && e.preventDefault()}>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  className="input-clean w-full px-5 pr-12 py-4 rounded-2xl text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-[10px] text-red-500 font-bold uppercase tracking-tight animate-pulse ml-1">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center group shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <i className="fas fa-circle-notch fa-spin text-lg"></i>
              ) : (
                <>
                  <span>Login to Nexus</span>
                  <i className="fas fa-chevron-right ml-3 text-[10px] opacity-70 group-hover:translate-x-1 transition-transform"></i>
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            New User? <Link to="/register" className="text-indigo-600 hover:underline">Register Account</Link>
          </p><br />
          <p className=" text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            <Link to="/" className="text-indigo-600 hover:underline">Back to Landing Page</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;