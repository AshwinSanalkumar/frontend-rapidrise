import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastContent';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Visibility states for both password fields
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Reset error when user types
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const result = await register(formData);
    
    setIsLoading(false);
    if (result.success) {
      showToast('Account created successfully! Please sign in.', 'success');
      navigate('/login');
    } else {
      setError(result.message);
      showToast(result.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Branding - Matching Login Design */}
        <div className="hidden lg:flex sidebar-dark p-16 flex-col justify-between relative overflow-hidden security-grid bg-[#0f172a]">
          <div className="relative z-10">
            <Link to="/" className="flex items-center space-x-3 mb-16 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
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
                {[1, 2, 3].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=a${i}`} className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover" alt="User" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">+12</div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
                Join NexusShare to manage high-availability file storage and sharing.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-8 lg:p-14 flex flex-col justify-center bg-white dark:bg-slate-900">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Register</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Create your secure engineering profile.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <input type="text" name="first_name" required placeholder="First name" value={formData.first_name} onChange={handleChange} className="input-clean w-full px-4 py-3 rounded-xl text-sm border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <input type="text" name="last_name" required placeholder="Last name" value={formData.last_name} onChange={handleChange} className="input-clean w-full px-4 py-3 rounded-xl text-sm border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email / Username</label>
              <input type="email" name="email" required placeholder="example@gmail.com" value={formData.email} onChange={handleChange} className="input-clean w-full px-4 py-3 rounded-xl text-sm border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Birth Date</label>
              <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="input-clean w-full px-4 py-3 rounded-xl text-sm border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} name="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} className="input-clean w-full px-4 pr-10 py-3 rounded-xl text-sm border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition">
                    <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} name="confirm_password" required placeholder="••••••••" value={formData.confirm_password} onChange={handleChange} className="input-clean w-full px-4 pr-10 py-3 rounded-xl text-sm border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition">
                    <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-[10px] text-red-500 font-bold uppercase tracking-tight animate-pulse ml-1">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-auth w-full text-white font-bold py-4 rounded-xl flex items-center justify-center group shadow-lg shadow-indigo-500/20 mt-4 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <i className="fas fa-circle-notch fa-spin text-lg"></i>
              ) : (
                <>
                  <span>Create Account</span>
                  <i className="fas fa-arrow-right ml-3 text-[10px] opacity-70 group-hover:translate-x-1 transition-transform"></i>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Existing Member? <Link to="/login" className="text-indigo-600 hover:underline">Sign In</Link>
          </p>

          <p className=" text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            <Link to="/" className="text-indigo-600 hover:underline">Back to Landing Page</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;