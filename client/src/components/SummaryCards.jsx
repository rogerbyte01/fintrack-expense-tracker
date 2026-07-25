const SummaryCards = ({ income, expenses, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 font-medium">Total Income</h3>
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <span className="text-emerald-400 text-xl">📈</span>
          </div>
        </div>
        <div className="text-3xl font-bold text-emerald-400">
          ₹{income?.toLocaleString() || 0}
        </div>
      </div>

      <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 font-medium">Total Expenses</h3>
          <div className="p-2 bg-rose-500/10 rounded-lg">
            <span className="text-rose-400 text-xl">📉</span>
          </div>
        </div>
        <div className="text-3xl font-bold text-rose-400">
          ₹{expenses?.toLocaleString() || 0}
        </div>
      </div>

      <div className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 font-medium">Balance</h3>
          <div className={`p-2 rounded-lg ${balance >= 0 ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
            <span className="text-xl">💰</span>
          </div>
        </div>
        <div className={`text-3xl font-bold ${balance >= 0 ? 'text-white' : 'text-amber-400'}`}>
          ₹{balance?.toLocaleString() || 0}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
