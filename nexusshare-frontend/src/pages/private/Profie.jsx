import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user: authUser } = useAuth();

  if (!authUser) return null;

  const formatDate = (dateString, monthFormat = 'long') => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString(undefined, {
          year: 'numeric', month: monthFormat, day: 'numeric'
      });
  };

  const user = {
    name: authUser.full_name || `${authUser.first_name} ${authUser.last_name}`,
    email: authUser.email,
    date_of_birth: formatDate(authUser.dob),
    joined: formatDate(authUser.date_joined, 'short'),
    initial: authUser.first_name ? authUser.first_name[0].toUpperCase() : authUser.email[0].toUpperCase()
  };

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Your personal information and account settings.</p>
          </div>
          <Link 
            to="/profile/update" 
            className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-indigo-700 transition flex items-center active:scale-95"
          >
            <i className="fas fa-user-edit mr-2"></i> Edit Profile
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Identity */}
          <section className="lg:col-span-4 bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
            <div className="h-28 w-28 rounded-[2.5rem] gradient-bg flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-6">
              {user.initial}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">{user.email}</p>
            
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Status</span>
                <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">Active</span>
              </div>
            </div>
          </section>

          {/* Right Panel: Information Grid */}
          <section className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Tile */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{user.name}</p>
              </div>

              {/* DOB Tile */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">D.O.B</label>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{user.date_of_birth}</p>
              </div>

              {/* Email Tile */}
              <div className="md:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{user.email}</p>
              </div>

              {/* Member Since Tile */}
              <div className="md:col-span-2 bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50 flex justify-between items-center">
                <div>
                  <label className="block text-[10px] font-bold text-indigo-400 dark:text-indigo-300 uppercase tracking-widest mb-1">Member Since</label>
                  <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{user.joined}</p>
                </div>
                <i className="fas fa-award text-3xl text-indigo-200 dark:text-indigo-800"></i>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm border-l-4 border-l-indigo-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-500">
                    <i className="fas fa-shield-alt text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">Security Settings</h3>
                    <p className="text-sm text-gray-500 font-medium">Manage your password and session security.</p>
                  </div>
                </div>
                <Link 
                  to="/profile/update/credentials" 
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold px-8 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition active:scale-95"
                >
                  Reset Password
                </Link>
              </div>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
};

export default Profile;