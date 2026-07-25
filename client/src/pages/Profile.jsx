import React, { useState, useEffect } from 'react';
import Toast from '../components/Toast';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Rupayan Pal',
    email: 'rupayanpal99@gmail.com',
    role: 'Financial Administrator',
    company: 'FinTrack Corp',
    notifyBudget: true,
    notifyWeekly: false
  });

  const [password, setPassword] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedName = localStorage.getItem('profileName');
    const savedEmail = localStorage.getItem('profileEmail');
    if (savedName || savedEmail) {
      setProfile(prev => ({
        ...prev,
        name: savedName || prev.name,
        email: savedEmail || prev.email
      }));
    }
  }, []);

  const handleProfileSave = (e) => {
    e.preventDefault();
    localStorage.setItem('profileName', profile.name);
    localStorage.setItem('profileEmail', profile.email);
    
    // Dispatch a custom event to notify Navbar avatar to update
    window.dispatchEvent(new Event('profileUpdated'));

    setToast({ message: 'Profile details saved successfully', type: 'success' });
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (password.newPass !== password.confirm) {
      setToast({ message: 'Passwords do not match!', type: 'error' });
      return;
    }
    setToast({ message: 'Password updated successfully', type: 'success' });
    setPassword({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-0 text-[var(--text-primary)]">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Account Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage profile information, settings, and notification configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Summary Avatar */}
        <div className="glass-card flex flex-col items-center justify-center text-center h-fit py-8">
          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg mb-4">
            {profile.name.charAt(0)}
          </div>
          <h3 className="text-lg font-bold">{profile.name}</h3>
          <p className="text-xs text-slate-400 mt-1">{profile.role}</p>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">
            {profile.company}
          </span>
        </div>

        {/* Right Cards: Detailed Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="glass-card">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">Profile Settings</h4>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    className="w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Role</label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full text-sm opacity-60 bg-slate-100 dark:bg-slate-900 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Company</label>
                  <input
                    type="text"
                    value={profile.company}
                    disabled
                    className="w-full text-sm opacity-60 bg-slate-100 dark:bg-slate-900 cursor-not-allowed"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary text-xs">Save Changes</button>
            </form>
          </div>

          {/* Password Reset */}
          <div className="glass-card">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">Change Password</h4>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={password.newPass}
                    onChange={(e) => setPassword({ ...password, newPass: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <button type="submit" className="btn-secondary text-xs border border-slate-200 dark:border-slate-800">Update Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
