import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PublicUploadHistory = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Mock database: Normal uploads and External "Pull" requests
  const [uploadData, setUploadData] = useState({
    2: [
      { name: 'Invoice_Feb.pdf', size: '1.2MB', time: '14:20', type: 'internal' },
      { name: 'Contract_Draft.pdf', size: '2.4MB', time: '16:45', type: 'internal' }
    ],
    12: [
      { name: 'Client_ID.png', size: '3.1MB', time: '11:30', type: 'request-fulfilled', from: 'mark@client.com' }
    ],
    15: [
      { name: 'Pending Request', status: 'awaiting', type: 'request-pending', from: 'legal@firm.com' }
    ],
    26: [{ name: 'Tax_Return.pdf', size: '2.2MB', time: '13:05', type: 'internal' }]
  });

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    setSelectedDay(null);
  };

  const todayDate = new Date();
  const isCurrentMonth = currentDate.getMonth() === todayDate.getMonth() && currentDate.getFullYear() === todayDate.getFullYear();
  const todayDay = todayDate.getDate();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Vault Audit</h1>
          <p className="text-gray-500 dark:text-gray-400">Review internal uploads and external pull requests.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowRequestModal(true)}
            className="text-sm font-bold text-white bg-indigo-600 px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
          >
            Request a File
          </button>
          <Link to="/dashboard" className="text-sm font-bold text-gray-600 bg-white border border-gray-200 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Calendar Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-gray-800 dark:text-white">{monthName} {year}</h2>
            <div className="flex space-x-2">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <i className="fas fa-chevron-left text-gray-400"></i>
              </button>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">{day}</div>
            ))}
            
            {blanks.map(b => <div key={`blank-${b}`} />)}

            {days.map(day => {
              const files = uploadData[day] || [];
              const hasInternal = files.some(f => f.type === 'internal' || f.type === 'request-fulfilled');
              const hasPending = files.some(f => f.type === 'request-pending');
              const isToday = isCurrentMonth && day === todayDay;
              const isSelected = selectedDay?.day === day;

              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDay({ day, files })}
                  className="relative group aspect-square flex items-center justify-center outline-none"
                >
                  <div className={`
                    w-12 h-12 flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all border-2
                    ${isSelected ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600' : ''}
                    ${isToday && !isSelected ? 'border-indigo-400 text-indigo-600' : ''}
                    ${!isToday && !isSelected ? 'border-transparent' : ''}
                    ${hasInternal && !isSelected ? 'bg-indigo-600 text-white shadow-lg scale-105' : ''}
                    ${hasPending && !hasInternal && !isSelected ? 'border-dashed border-indigo-300 text-indigo-400 bg-indigo-50/50' : ''}
                    ${!hasInternal && !hasPending && !isSelected && !isToday ? 'text-gray-400 hover:bg-gray-50' : ''}
                  `}>
                    {day}
                  </div>
                  {hasInternal && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Day Details & File Viewer */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm h-[350px] flex flex-col">
            {selectedDay ? (
              <>
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-xs uppercase flex justify-between items-center">
                  <span>{monthName} {selectedDay.day} Activity</span>
                </h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
                  {selectedDay.files.length > 0 ? (
                    selectedDay.files.map((file, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border flex items-center transition-all ${
                        file.type.includes('request') ? 'bg-indigo-50/50 border-indigo-100' : 'bg-gray-50 border-transparent'
                      }`}>
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
                          <i className={`fas ${file.type === 'request-pending' ? 'fa-clock text-amber-500' : 'fa-file-alt text-indigo-500'} text-xs`}></i>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[11px] font-bold text-gray-800 truncate">{file.name}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">
                            {file.type === 'request-fulfilled' ? `Inbound from ${file.from}` : 
                             file.type === 'request-pending' ? `Awaiting: ${file.from}` : `${file.time} • ${file.size}`}
                          </p>
                        </div>
                        {file.type !== 'request-pending' && (
                          <button className="ml-2 text-gray-300 hover:text-indigo-600">
                            <i className="fas fa-external-link-alt text-[10px]"></i>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-xs">No logs for this date</div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 text-center">
                <i className="fas fa-fingerprint text-3xl mb-3"></i>
                <p className="text-[10px] font-black uppercase tracking-widest px-4">Select a calendar date to view audit logs</p>
              </div>
            )}
          </div>

          {/* Unique Contribution Legend */}
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-[10px] uppercase tracking-widest">Audit Key</h3>
             <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                  <span className="text-xs text-gray-500 font-medium">Internal Upload</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-indigo-300"></div>
                  <span className="text-xs text-gray-500 font-medium">Pending Pull Request</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-xs text-gray-500 font-medium">Verified Secure</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PublicUploadHistory;