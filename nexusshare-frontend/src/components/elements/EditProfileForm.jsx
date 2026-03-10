import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfileForm = ({ onSave, isSaving, isSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'Ashwin',
    lastName: '',
    email: 'ashwin@example.com'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
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
            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-8 border-t border-gray-50 dark:border-gray-700 flex justify-end items-center space-x-6">
        <button 
          type="button" 
          onClick={() => navigate('/profile')} 
          className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
        >
          Cancel
        </button>
        
        <button 
          type="submit" 
          disabled={isSaving || isSuccess}
          className={`font-bold py-4 px-10 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center min-w-[190px] justify-center ${
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