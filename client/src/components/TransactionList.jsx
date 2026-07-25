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
      <div className="text-center py-12 glass-card border border-dashed border-slate-700/60 rounded-2xl">
        <svg className="w-12 h-12 text-slate-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
        <p className="text-slate-400 font-medium text-sm">No transactions found for this period.</p>
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
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
              tx.type === 'income' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              {tx.type === 'income' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{tx.title}</h4>
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className="text-slate-400">{new Date(tx.date).toLocaleDateString()}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span className="text-slate-300 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-medium border border-slate-700">
                  {tx.category}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
            </div>
            
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(tx)}
                className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-500/20"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </button>
              <button 
                onClick={() => onDelete(tx._id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-rose-500/20"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
