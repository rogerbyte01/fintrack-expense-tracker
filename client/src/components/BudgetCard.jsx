const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { category, monthlyLimit, spent = 0 } = budget;
  
  const percent = Math.min((spent / monthlyLimit) * 100, 100);
  
  let progressColor = 'bg-emerald-500';
  let warningText = null;
  
  if (percent >= 100) {
    progressColor = 'bg-rose-500';
    warningText = 'Limit exceeded!';
  } else if (percent >= 75) {
    progressColor = 'bg-amber-500';
    warningText = 'Nearing limit';
  }

  return (
    <div className="glass-card animate-slide-up group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{category}</h3>
          <p className="text-sm text-slate-400">Monthly Budget</p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(budget)}
            className="p-1.5 text-slate-400 hover:text-emerald-400 bg-slate-800 hover:bg-emerald-500/10 rounded-lg transition-colors"
          >
            ✏️
          </button>
          <button 
            onClick={() => onDelete(budget._id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="mb-2 flex justify-between items-end">
        <div className="text-2xl font-bold text-slate-200">
          ₹{spent.toLocaleString()}
          <span className="text-sm font-normal text-slate-500 ml-1">/ ₹{monthlyLimit.toLocaleString()}</span>
        </div>
        <div className="text-sm font-medium text-slate-400">
          {percent.toFixed(0)}%
        </div>
      </div>

      <div className="h-2.5 w-full bg-slate-700/50 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${progressColor}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      {warningText && (
        <p className={`text-xs mt-2 ${percent >= 100 ? 'text-rose-400' : 'text-amber-400'}`}>
          ⚠️ {warningText}
        </p>
      )}
    </div>
  );
};

export default BudgetCard;
