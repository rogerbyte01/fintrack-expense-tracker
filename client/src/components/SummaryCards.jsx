const SummaryCards = ({ income, expenses, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Income */}
      <div className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 font-medium text-sm">Total Income</h3>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold tracking-tight text-emerald-400">
          ₹{income?.toLocaleString() || 0}
        </div>
      </div>

      {/* Total Expenses */}
      <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 font-medium text-sm">Total Expenses</h3>
          <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20">
            <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold tracking-tight text-rose-400">
          ₹{expenses?.toLocaleString() || 0}
        </div>
      </div>

      {/* Balance */}
      <div className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 font-medium text-sm">Net Balance</h3>
          <div className={`p-2.5 rounded-xl border ${balance >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            {balance >= 0 ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
        </div>
        <div className={`text-3xl font-bold tracking-tight ${balance >= 0 ? 'text-white' : 'text-amber-400'}`}>
          ₹{balance?.toLocaleString() || 0}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
