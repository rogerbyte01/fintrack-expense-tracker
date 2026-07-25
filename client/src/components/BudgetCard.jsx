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

  // Capitalize category name for presentation
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="glass-card animate-slide-up group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{categoryName}</h3>
          <p className="text-xs text-slate-400">Monthly Budget</p>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(budget)}
            className="p-1.5 text-slate-400 hover:text-emerald-400 bg-slate-800/80 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 border border-slate-700/60 hover:border-emerald-500/20"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(budget._id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10 rounded-lg transition-all duration-200 border border-slate-700/60 hover:border-rose-500/20"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-2.5 flex justify-between items-end">
        <div className="text-2xl font-bold text-slate-100">
          ₹{spent.toLocaleString()}
          <span className="text-xs font-normal text-slate-500 ml-1.5">/ ₹{monthlyLimit.toLocaleString()}</span>
        </div>
        <div className="text-xs font-bold text-slate-400">
          {percent.toFixed(0)}%
        </div>
      </div>

      <div className="h-2.5 w-full bg-slate-700/40 rounded-full overflow-hidden mb-1">
        <div 
          className={`h-full rounded-full transition-all style-update ${progressColor}`}
          style={{ width: `${percent}%`, transitionDuration: '1000ms' }}
        ></div>
      </div>

      {warningText && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${percent >= 100 ? 'text-rose-400' : 'text-amber-400'}`}>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{warningText}</span>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
