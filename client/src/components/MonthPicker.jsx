const MonthPicker = ({ selectedMonth, onChange }) => {
  // Generate last 12 months including current
  const generateMonths = () => {
    const months = [];
    const date = new Date();
    date.setDate(1); // Set to 1st to avoid end-of-month shifting issues
    
    for (let i = 0; i < 12; i++) {
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      months.push({ value: monthStr, label });
      
      // Go back one month
      date.setMonth(date.getMonth() - 1);
    }
    return months;
  };

  const months = generateMonths();

  return (
    <div className="relative">
      <select
        value={selectedMonth}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-slate-800/80 border border-slate-700 text-slate-200 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:border-emerald-500 shadow-sm cursor-pointer"
      >
        {months.map(m => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
        📅
      </div>
    </div>
  );
};

export default MonthPicker;
