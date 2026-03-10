import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  // Mock data - easily replaced with API calls later
  const user = {
    name: "Ashwin Sanalkumar",
    email: "ashwin@example.com",
    date_of_birth :"25 February 2004",
    joined: "February 2026",
    initial: "A"
  };

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Your personal information and account settings.</p>
          </div>
          <Link 
            to="/profile/update" 
            className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition flex items-center active:scale-95"
          >
            <i className="fas fa-user-edit mr-2"></i> Edit Profile
          </Link>
        </header>

        <div className="space-y-6">
          {/* Main Info Card */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="h-24 w-24 rounded-[2.5rem] gradient-bg flex items-center justify-center text-white text-3xl font-bold shadow-xl shrink-0">
                {user.initial}
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">{user.name}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">D.O.B</label>
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{user.date_of_birth}</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Member Since</label>
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{user.joined}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm border-l-4 border-l-indigo-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-500">
                  <i className="fas fa-shield-alt text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Security Settings</h3>
                  <p className="text-sm text-gray-500">Manage your password and session security.</p>
                </div>
              </div>
              <Link 
                to="/profile/update/credentials" 
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95"
              >
                Reset Password
              </Link>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
};

export default Profile;