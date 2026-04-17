import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchUploadHistory } from '../../services/fileService';

const UploadHistory = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [uploadData, setUploadData] = useState({});
    const [monthStats, setMonthStats] = useState({ count: 0, total_size: 0 });
    const [globalStats, setGlobalStats] = useState({ total_uploads: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // Backend expects 1-12
            const response = await fetchUploadHistory(year, month);
            
            setUploadData(response.history);
            setMonthStats(response.month_stats);
            setGlobalStats(response.global_stats);

            // Update selectedDay if it's currently set for this month
            if (selectedDay) {
                const updatedFiles = response.history[selectedDay.day] || [];
                setSelectedDay({ day: selectedDay.day, files: updatedFiles });
            }
        } catch (error) {
            console.error('Error loading upload history:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentDate, selectedDay?.day]);

    useEffect(() => {
        loadData();
    }, [currentDate.getMonth(), currentDate.getFullYear()]);

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
    <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Upload History</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your vault activity across the timeline.</p>
                </div>
                <Link to="/dashboard" className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">
                    Back to Dashboard
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Calendar Card - RESTORED TO FULL SIZE */}
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

                    <div className="grid grid-cols-7 gap-4 relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 z-10 flex items-center justify-center rounded-2xl">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        )}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">
                                {day}
                            </div>
                        ))}

                        {blanks.map(b => <div key={`blank-${b}`} />)}


                        {days.map(day => {
                            const files = uploadData[day] || [];
                            const hasUpload = files.length > 0;
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
        
        /* 1. Selected State Priority */
        ${isSelected ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600' : ''}
        
        /* 2. Today State - Persistent Border */
        ${isToday && !isSelected ? 'border-green-500 text-green-600 shadow-sm' : ''}
        ${isToday && isSelected ? 'border-green-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600' : ''}
        ${!isToday && !isSelected ? 'border-transparent' : ''}
        
        /* 3. Upload State - Background Fill */
        ${hasUpload && !isSelected
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-105'
                                            : ''}
          
        /* 4. Empty/Default State */
        ${!hasUpload && !isSelected && !isToday ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
      `}>
                                        {day}
                                    </div>

                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white">
                        <h3 className="font-bold text-lg mb-2">Activity Summary</h3>
                        <p className="text-indigo-100 text-sm mb-6 uppercase tracking-tight font-medium">Monthly Performance</p>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Total Uploads</span>
                                <span className="font-bold">{globalStats.total_uploads} Files</span>
                            </div>
                            <div className="w-full bg-white/20 h-1 rounded-full">
                                <div 
                                    className="bg-white h-full rounded-full transition-all duration-500" 
                                    style={{ width: globalStats.total_uploads > 0 ? `${Math.min((monthStats.count / globalStats.total_uploads) * 100, 100)}%` : '0%' }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-indigo-200 uppercase font-bold">
                                <span>In {monthName}</span>
                                <span>{monthStats.count} Uploads</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-indigo-300 uppercase font-bold">
                                <span>Data Volume</span>
                                <span>{formatSize(monthStats.total_size)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Day Details - REDUCED HEIGHT & ADDED SCROLL */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm h-[220px] flex flex-col">
                        {selectedDay ? (
                            <>
                                <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-xs uppercase flex justify-between items-center">
                                    <span>{monthName} {selectedDay.day}</span>
                                    {selectedDay.files.length > 0 && (
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                                            {selectedDay.files.length} Files
                                        </span>
                                    )}
                                </h3>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                                    {selectedDay.files.length > 0 ? (
                                        selectedDay.files.map((file, idx) => (
                                            <Link 
                                                key={idx} 
                                                to={`/files/details/${file.id}`}
                                                className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer group"
                                            >
                                                <i className="fas fa-file-pdf text-indigo-500 text-[10px] mr-2"></i>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-[10px] font-bold text-gray-700 dark:text-gray-200 truncate group-hover:text-indigo-600 transition-colors">{file.name}</p>
                                                    <p className="text-[8px] text-gray-400 uppercase">{file.time} • {formatSize(file.size)}</p>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center opacity-40">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-center">No uploads found</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                <i className="far fa-hand-point-left text-xl mb-2"></i>
                                <p className="text-[9px] font-bold uppercase tracking-widest">Select a day</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-sm uppercase tracking-wider">Quick Legend</h3>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-4 h-4 rounded border-2 border-green-400"></div>
                            <span className="text-sm text-gray-500">Today</span>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-4 h-4 rounded bg-indigo-600"></div>
                            <span className="text-sm text-gray-500">Upload Event</span>
                        </div>
                        

                    </div>
                </div>
            </div>
        </main>
    );
};

export default UploadHistory;