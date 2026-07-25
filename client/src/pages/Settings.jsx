import React, { useState } from 'react';
import Toast from '../components/Toast';

const Settings = () => {
  const [toast, setToast] = useState(null);
  const [preferences, setPreferences] = useState({
    theme: localStorage.getItem('theme') || 'dark',
    emailAlerts: true,
    weeklyReport: false,
    threshold: 80
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('theme', preferences.theme);
    
    // Trigger global body dark class sync
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setToast({ message: 'Settings saved successfully', type: 'success' });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-0 text-[var(--text-primary)]">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure layout, notification preferences, and application themes.</p>
      </div>

      <div className="glass-card max-w-2xl">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">Preferences</h4>
        
        <form onSubmit={handleSave} className="space-y-6">
          {/* Theme Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Theme</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  preferences.theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600 dark:text-indigo-400'
                    : 'border-[var(--border-color)] hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
                Light
              </button>
              <button
                type="button"
                onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  preferences.theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600 dark:text-indigo-400'
                    : 'border-[var(--border-color)] hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark
              </button>
            </div>
          </div>

          <hr className="border-[var(--border-color)]" />

          {/* Email notifications */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Notifications</label>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-bold">Budget Alerts</h5>
                <p className="text-xs text-slate-400 mt-0.5">Receive warnings when limits exceed warning levels.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailAlerts}
                onChange={(e) => setPreferences({ ...preferences, emailAlerts: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-bold">Weekly Performance Summary</h5>
                <p className="text-xs text-slate-400 mt-0.5">Summary statements tracing spending velocities.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.weeklyReport}
                onChange={(e) => setPreferences({ ...preferences, weeklyReport: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>

          <hr className="border-[var(--border-color)]" />

          {/* Budget Limit Warning */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Budget Alert Threshold ({preferences.threshold}%)</label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={preferences.threshold}
              onChange={(e) => setPreferences({ ...preferences, threshold: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-2">
              <span>50% Limit</span>
              <span>80% Recommended</span>
              <span>100% Strict</span>
            </div>
          </div>

          <button type="submit" className="btn-primary text-xs w-full sm:w-auto">Save Preferences</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
