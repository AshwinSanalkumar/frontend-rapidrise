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
  const [showCalendar, setShowCalendar] = useState(false);

  // Calendar Helper States
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      showToast('Please meet all password requirements', 'error');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (formData.dob) {
        if (calculateAge(formData.dob) < 15) {
            showToast('You must be at least 15 years old to register.', 'error');
            return;
        }
    } else {
        showToast('Birth date is required.', 'error');
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
                <input type="text" name="last_name"  placeholder="Last name" value={formData.last_name} onChange={handleChange} className="input-clean w-full px-4 py-3 rounded-xl text-sm border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email / Username</label>
              <input type="email" name="email" required placeholder="example@gmail.com" value={formData.email} onChange={handleChange} className="input-clean w-full px-4 py-3 rounded-xl text-sm border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
            </div>

            <div className="space-y-1.5 relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Birth Date</label>
              <div 
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-4 py-3 rounded-xl text-sm border dark:bg-slate-800 dark:border-slate-700 dark:text-white cursor-pointer flex justify-between items-center transition-all hover:border-indigo-500"
              >
                <span className={formData.dob ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
                  {formData.dob ? new Date(formData.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select your birth date'}
                </span>
                <i className="fas fa-calendar-alt text-indigo-500 opacity-60"></i>
              </div>

              {showCalendar && (
                <div className="absolute top-full left-0 mt-2 w-full max-w-[260px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <button type="button" onClick={() => {
                        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
                        else { setCurrentMonth(currentMonth - 1); }
                    }} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition">
                        <i className="fas fa-chevron-left text-[10px]"></i>
                    </button>
                    <div className="flex space-x-1">
                        <select 
                            value={currentMonth} 
                            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                            className="text-[10px] font-bold bg-transparent dark:text-white focus:outline-none cursor-pointer"
                        >
                            {months.map((m, i) => <option key={m} value={i} className="dark:bg-slate-900">{m}</option>)}
                        </select>
                        <select 
                            value={currentYear} 
                            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                            className="text-[10px] font-bold bg-transparent dark:text-white focus:outline-none cursor-pointer"
                        >
                            {Array.from({length: 100}, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y} className="dark:bg-slate-900">{y}</option>)}
                        </select>
                    </div>
                    <button type="button" onClick={() => {
                        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
                        else { setCurrentMonth(currentMonth + 1); }
                    }} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition">
                        <i className="fas fa-chevron-right text-[10px]"></i>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-[9px] font-black text-slate-300 dark:text-slate-600 text-center uppercase py-0.5">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-0.5">
                    {Array(firstDayOfMonth(currentMonth, currentYear)).fill(null).map((_, i) => (
                        <div key={`empty-${i}`} className="p-1"></div>
                    ))}
                    {Array.from({length: daysInMonth(currentMonth, currentYear)}, (_, i) => i + 1).map(day => {
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isSelected = formData.dob === dateStr;
                        const isToday = new Date().toISOString().split('T')[0] === dateStr;

                        return (
                            <div 
                                key={day} 
                                onClick={() => {
                                    setFormData({...formData, dob: dateStr});
                                    setShowCalendar(false);
                                }}
                                className={`p-1.5 text-[10px] font-bold text-center rounded-lg cursor-pointer transition-all ${
                                    isSelected 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : isToday
                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                {day}
                            </div>
                        );
                    })}
                  </div>
                </div>
              )}
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