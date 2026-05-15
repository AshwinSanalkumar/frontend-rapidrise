import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastContent';  

const EditProfileForm = ({ onSave, isSaving, isSuccess }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    dob: user?.dob || ''
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(user?.dob || new Date()).getMonth());
  const [currentYear, setCurrentYear] = useState(new Date(user?.dob || new Date()).getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

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

  useEffect(() => {
    if (user) {
        setFormData({
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            email: user.email || '',
            dob: user.dob || ''
        });
        if (user.dob) {
            setCurrentMonth(new Date(user.dob).getMonth());
            setCurrentYear(new Date(user.dob).getFullYear());
        }
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.dob && calculateAge(formData.dob) < 15) {
        showToast("You must be at least 15 years old.","error"); // Or use a toast if available in this scope, but EditProfile has it. We can just pass the error back or handle it here.
        return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* First Name */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
          <input 
            type="text" 
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
          <input 
            type="text" 
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all"
          />
        </div>

        {/* DOB */}
        <div className="space-y-2 relative">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
          <div 
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white cursor-pointer flex justify-between items-center transition-all hover:border-indigo-500"
          >
            <span>
              {formData.dob ? new Date(formData.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select birth date'}
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
                <div className="flex space-x-1 text-slate-900 dark:text-white">
                    <select 
                        value={currentMonth} 
                        onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                        className="text-[10px] font-bold bg-transparent focus:outline-none cursor-pointer"
                    >
                        {months.map((m, i) => <option key={m} value={i} className="dark:bg-slate-900">{m}</option>)}
                    </select>
                    <select 
                        value={currentYear} 
                        onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                        className="text-[10px] font-bold bg-transparent focus:outline-none cursor-pointer"
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

        {/* Email */}
        <div className="space-y-2 md:col-span-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
          <input 
            type="email" 
            disabled
            value={formData.email}
            required
            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-gray-500 cursor-not-allowed outline-none transition-all"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-8 border-t border-gray-50 dark:border-gray-700 flex flex-col sm:flex-row justify-end items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <button 
          type="button" 
          onClick={() => navigate('/profile')} 
          className="w-full sm:w-auto text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-center"
        >
          Cancel
        </button>
        
        <button 
          type="submit" 
          disabled={isSaving || isSuccess}
          className={`w-full sm:w-auto font-bold py-4 px-10 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${
            isSuccess ? 'bg-emerald-500 text-white shadow-emerald-200' : 'gradient-bg text-white hover:opacity-90'
          }`}
        >
          {isSaving ? (
            <><i className="fas fa-circle-notch fa-spin mr-2"></i> Saving...</>
          ) : isSuccess ? (
            <><i className="fas fa-check mr-2"></i> Success!</>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;