import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Transactions', path: '/transactions', icon: '💸' },
    { name: 'Budgets', path: '/budgets', icon: '🎯' },
    { name: 'Monthly Summary', path: '/summary', icon: '📅' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 fixed inset-y-0 glass z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
            💰 FinTrack
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 p-2 pb-safe border-t border-slate-700">
        <nav className="flex justify-around items-center">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-lg ${
                  isActive ? 'text-emerald-400' : 'text-slate-400'
                }`
              }
            >
              <span className="text-xl mb-1">{link.icon}</span>
              <span className="text-[10px] font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
