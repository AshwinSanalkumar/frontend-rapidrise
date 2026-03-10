import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditProfileForm from '../../components/elements/EditProfileForm';

const EditProfile = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = (formData) => {
    setIsSaving(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccess(true);
      
      // Redirect back to profile after showing success state
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    }, 1200);
  };

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <Link to="/profile" className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center mb-4 hover:underline group">
            <i className="fas fa-arrow-left mr-2 transition-transform group-hover:-translate-x-1"></i> 
            Back to Profile
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Edit Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Update your account details below.</p>
        </header>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-all">
          <EditProfileForm 
            onSave={handleSave} 
            isSaving={isSaving} 
            isSuccess={isSuccess} 
          />
        </div>
      </div>
    </main>
  );
};

export default EditProfile;