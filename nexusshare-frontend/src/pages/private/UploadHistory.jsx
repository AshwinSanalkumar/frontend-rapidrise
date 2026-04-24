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
    const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'upload', 'share'

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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Activity History</h1>
                        <p className="text-gray-500 dark:text-gray-400">Track your file lifecycle and distribution across the timeline.</p>
                    </div>
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
                            const rawActivities = uploadData[day] || [];
                            const hasUpload = rawActivities.some(a => a.type === 'upload');
                            const hasShare = rawActivities.some(a => a.type === 'share');
                            const isToday = isCurrentMonth && day === todayDay;
                            const isSelected = selectedDay?.day === day;

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay({ day, files: rawActivities })}
                                    className="relative group aspect-square flex items-center justify-center outline-none"
                                >
                                    <div className={`w-12 h-12 flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all border-2
                                        
                                        ${isSelected ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600' : ''}
                                        ${isToday && !isSelected ? 'border-green-500 text-green-600 shadow-sm' : ''}
                                        ${!isToday && !isSelected ? 'border-transparent' : ''}
                                        
                                        ${(hasUpload || hasShare) && !isSelected ? 'bg-gray-100 dark:bg-gray-700/50' : ''}
                                        ${!hasUpload && !hasShare && !isSelected && !isToday ? 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
                                    `}>
                                        <span className={isSelected ? 'text-indigo-600' : 'text-gray-700 dark:text-gray-200'}>{day}</span>
                                        
                                        {/* Activity Indicators */}
                                        <div className="flex space-x-1 mt-1">
                                            {hasUpload && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-indigo-500 shadow-sm shadow-indigo-200'}`}></div>}
                                            {hasShare && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-600' : 'bg-amber-500 shadow-sm shadow-amber-200'}`}></div>}
                                        </div>
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
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-indigo-200 uppercase font-black tracking-widest mb-1">Uploads</p>
                                    <span className="text-2xl font-black">{globalStats.total_uploads}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-indigo-200 uppercase font-black tracking-widest mb-1">Shares</p>
                                    <span className="text-2xl font-black">{globalStats.total_shares || 0}</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                    <span className="flex items-center"><div className="w-2 h-2 bg-white rounded-full mr-2"></div> Uploads ({monthName})</span>
                                    <span>{monthStats.upload_count}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                    <span className="flex items-center"><div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div> Shares ({monthName})</span>
                                    <span>{monthStats.share_count}</span>
                                </div>
                                <div className="pt-2 flex justify-between text-[10px] text-indigo-300 uppercase font-bold border-t border-white/10">
                                    <span>Monthly volume</span>
                                    <span>{formatSize(monthStats.total_size)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Day Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm h-[280px] flex flex-col">
                        {selectedDay ? (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-800 dark:text-white text-xs uppercase">
                                        {monthName} {selectedDay.day}
                                    </h3>
                                    <div className="flex bg-gray-100 dark:bg-gray-700/50 p-0.5 rounded-lg border border-gray-200 dark:border-gray-600">
                                        {[
                                            { id: 'all', icon: 'fa-list' },
                                            { id: 'upload', icon: 'fa-cloud-upload-alt' },
                                            { id: 'share', icon: 'fa-share-nodes' }
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => setTypeFilter(type.id)}
                                                className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${typeFilter === type.id ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                                title={type.id.charAt(0).toUpperCase() + type.id.slice(1)}
                                            >
                                                <i className={`fas ${type.icon} text-[10px]`}></i>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                                    {selectedDay.files
                                        .filter(event => typeFilter === 'all' || event.type === typeFilter)
                                        .length > 0 ? (
                                        selectedDay.files
                                            .filter(event => typeFilter === 'all' || event.type === typeFilter)
                                            .map((event, idx) => (
                                            <div 
                                                key={idx} 
                                                className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all group"
                                            >
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center mr-3 shrink-0 ${event.type === 'upload' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    <i className={`fas ${event.type === 'upload' ? 'fa-cloud-upload-alt' : 'fa-share-nodes'} text-[10px]`}></i>
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-[10px] font-bold text-gray-700 dark:text-gray-200 truncate">{event.name}</p>
                                                    <p className="text-[8px] text-gray-400 uppercase font-medium">
                                                        {event.type === 'upload' ? `Uploaded ${event.time} • ${formatSize(event.size)}` : `Shared with ${event.recipient} at ${event.time}`}
                                                    </p>
                                                </div>
                                                {event.type === 'upload' && (
                                                    <Link to={`/files/details/${event.id}`} className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <i className="fas fa-external-link-alt text-gray-400 hover:text-indigo-600 text-[10px]"></i>
                                                    </Link>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center opacity-40">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-center text-gray-500">Silence...</p>
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
                            <span className="text-xs text-gray-500 font-bold">Today</span>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                            <span className="text-xs text-gray-500 font-bold">Upload Event</span>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                            <span className="text-xs text-gray-500 font-bold">Share Event</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UploadHistory;