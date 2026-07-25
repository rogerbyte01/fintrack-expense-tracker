const TransactionList = ({ transactions, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="glass-card animate-pulse h-20"></div>
        ))}
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="text-center py-12 glass-card border-dashed">
        <p className="text-slate-400">No transactions found for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx, index) => (
        <div 
          key={tx._id} 
          className="glass-card flex items-center justify-between p-4 group animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <span className="text-xl">{tx.type === 'income' ? '↓' : '↑'}</span>
            </div>
            <div>
              <h4 className="font-medium text-white">{tx.title}</h4>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">{new Date(tx.date).toLocaleDateString()}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="text-slate-300 px-2 py-0.5 rounded-full bg-slate-800 text-xs border border-slate-700">
                  {tx.category}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(tx)}
                className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                title="Edit"
              >
                ✏️
              </button>
              <button 
                onClick={() => onDelete(tx._id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
