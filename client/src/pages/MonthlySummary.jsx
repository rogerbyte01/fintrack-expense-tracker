import { useState, useEffect } from 'react';
import api from '../api/api';
import MonthPicker from '../components/MonthPicker';
import SummaryCards from '../components/SummaryCards';

const MonthlySummary = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        // The endpoint is /api/summary?month=YYYY-MM
        const res = await api.get(`/summary?month=${selectedMonth}`);
        setSummary(res.data);
      } catch (err) {
        // If 404, it might mean the backend doesn't have data or the endpoint isn't implemented properly yet
        // Let's create a fallback calculation if the endpoint fails
        if (err.message.includes('404')) {
          try {
            await calculateFallbackSummary();
          } catch (fallbackErr) {
            setError('Failed to fetch summary data');
          }
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    // Fallback in case /api/summary is not fully working on backend
    const calculateFallbackSummary = async () => {
      const [txRes, bRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/budgets')
      ]);

      const monthTxs = txRes.data.filter(tx => tx.date.startsWith(selectedMonth));
      
      let totalIncome = 0;
      let totalExpenses = 0;
      const catMap = {};

      monthTxs.forEach(tx => {
        if (tx.type === 'income') totalIncome += tx.amount;
        else {
          totalExpenses += tx.amount;
          catMap[tx.category] = (catMap[tx.category] || 0) + tx.amount;
        }
      });

      const topCategories = Object.keys(catMap)
        .map(cat => ({ _id: cat, total: catMap[cat] }))
        .sort((a, b) => b.total - a.total);

      const budgetStatus = bRes.data.map(b => ({
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        spent: catMap[b.category] || 0
      }));

      setSummary({
        totalIncome,
        totalExpenses,
        savings: totalIncome - totalExpenses,
        topCategories,
        budgetStatus
      });
    };

    fetchSummary();
  }, [selectedMonth]);

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Monthly Summary</h1>
          <p className="text-slate-400">Detailed breakdown of your financial month.</p>
        </div>
        
        <MonthPicker selectedMonth={selectedMonth} onChange={setSelectedMonth} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="glass-card text-center py-12 text-rose-400">
          {error}
        </div>
      ) : summary ? (
        <div className="space-y-8 animate-fade-in">
          <SummaryCards 
            income={summary.totalIncome}
            expenses={summary.totalExpenses}
            balance={summary.savings}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categories */}
            <div className="glass-card">
              <h3 className="text-lg font-medium mb-6 text-slate-200">Top Spending Categories</h3>
              
              {summary.topCategories?.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No expenses this month</p>
              ) : (
                <div className="space-y-4">
                  {summary.topCategories?.slice(0, 5).map((cat, i) => (
                    <div key={cat._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono">{i + 1}.</span>
                        <span className="text-slate-300">{cat._id}</span>
                      </div>
                      <span className="font-medium text-rose-400">₹{cat.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Budget Status */}
            <div className="glass-card">
              <h3 className="text-lg font-medium mb-6 text-slate-200">Budget Status</h3>
              
              {summary.budgetStatus?.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No budgets set</p>
              ) : (
                <div className="space-y-5">
                  {summary.budgetStatus?.map(budget => {
                    const percent = Math.min((budget.spent / budget.monthlyLimit) * 100, 100);
                    let colorClass = 'bg-emerald-500';
                    if (percent >= 100) colorClass = 'bg-rose-500';
                    else if (percent >= 75) colorClass = 'bg-amber-500';

                    return (
                      <div key={budget.category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{budget.category}</span>
                          <span className="text-slate-400">
                            <span className="text-slate-200">₹{budget.spent.toLocaleString()}</span> / ₹{budget.monthlyLimit.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${colorClass}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MonthlySummary;
