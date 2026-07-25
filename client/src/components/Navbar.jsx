import React, { useState, useEffect } from 'react';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileName, setProfileName] = useState('Rupayan Pal');

  useEffect(() => {
    // Sync profile name from settings if user edits it
    const stored = localStorage.getItem('profileName');
    if (stored) setProfileName(stored);

    const handleProfileUpdate = () => {
      const updated = localStorage.getItem('profileName');
      if (updated) setProfileName(updated);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const notifications = [
    { id: 1, text: 'Groceries budget is at 82% of limit', time: '5m ago', type: 'warning' },
    { id: 2, text: 'Salary transaction logged successfully', time: '1h ago', type: 'success' },
    { id: 3, text: 'Rent budget limit increased by ₹5,000', time: '1d ago', type: 'info' }
  ];

  return (
    <header className="glass-nav sticky top-0 z-40 px-6 py-4 flex items-center justify-between w-full">
      {/* Left: Search Bar & Date */}
      <div className="flex items-center gap-6 flex-1 max-w-md">
        <div className="relative w-full hidden sm:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search transactions, budgets..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/60 focus:bg-white text-sm"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden lg:inline-block">
          {formattedDate}
        </span>
      </div>

      {/* Right: Actions, Notifications, Dark Mode, Profile */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? (
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 py-3">
              <div className="px-3 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Notifications</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-1">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex gap-2 items-start transition-colors">
                    <span className="mt-1 text-xs">
                      {notif.type === 'warning' ? '⚠️' : notif.type === 'success' ? '✅' : 'ℹ️'}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-normal">{notif.text}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
            {profileName.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden md:block">
            {profileName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
