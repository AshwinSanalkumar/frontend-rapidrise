import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditProfileForm from '../../components/elements/EditProfileForm';
import { updateProfile } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastContent';

const EditProfile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, setUser } = useAuth(); // Assuming setUser exists to update auth context directly? Wait, if we don't have setUser, we can just rely on the API. But let's check. Actually AuthContext doesn't expose setUser by default. We can just navigate and force a reload if needed, or AuthContext will fetch on next load.
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      await updateProfile({
          first_name: formData.firstName,
          last_name: formData.lastName,
          dob: formData.dob
      });
      setIsSaving(false);
      setIsSuccess(true);
      
      // Update local storage user quickly to prevent stale data UI flashes
      if (user) {
         const updatedUser = { ...user, first_name: formData.firstName, last_name: formData.lastName, dob: formData.dob, full_name: `${formData.firstName} ${formData.lastName}` };
         localStorage.setItem('user', JSON.stringify(updatedUser)); // Not perfectly synced but fast local UX!
         window.dispatchEvent(new Event('storage')); // Simple signal
      }
      
      showToast("Profile updated successfully", "success");
      setTimeout(() => {
        navigate('/profile');
        window.location.reload(); // Refresh context
      }, 1000);
    } catch (error) {
      setIsSaving(false);
      showToast(error.response?.data?.error || "Failed to update profile", "error");
    }
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