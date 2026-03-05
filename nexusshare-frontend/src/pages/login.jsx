import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard'); // Redirect to dashboard
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Branding & Security Info */}
        <div className="hidden lg:flex sidebar-dark p-16 flex-col justify-between relative overflow-hidden security-grid bg-[#0f172a]">
          <div className="relative z-10">
            <Link to="/" className="flex items-center space-x-3 mb-16 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <i className="fas fa-layer-group"></i>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">NexusShare</span>
            </Link>
            
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
              Share and <br /> 
              Store files <br /> 
              <span className="text-indigo-400 font-mono tracking-tighter italic text-4xl">Securely.</span>
            </h1>
          </div>

          <div className="relative z-10 bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2rem] backdrop-blur-xl">
            <div className="space-y-6">
              <div className="flex items-center -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover" alt="User" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  +12
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
                Join NexusShare to manage high-availability file storage and sharing.
              </p>
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
              <div className="relative">
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
            New User? <Link to="/register" className="text-indigo-600 hover:underline">Request Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;