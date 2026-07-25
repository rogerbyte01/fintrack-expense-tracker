import React, { useState, useEffect } from 'react';
import api from '../api/api';
import SummaryCards from '../components/SummaryCards';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import DoughnutChart from '../components/DoughnutChart';
import TransactionForm from '../components/TransactionForm';
import BudgetForm from '../components/BudgetForm';
import Toast from '../components/Toast';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showTxForm, setShowTxForm] = useState(false);
  const [forceTxType, setForceTxType] = useState(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [toast, setToast] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    transactions: [],
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savings: 0,
    budgetRemaining: 0,
    pieData: [],
    barData: [],
    lineData: [],
    budgets: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, bRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/budgets')
      ]);

      const txs = txRes.data;
      const budgets = bRes.data;

      // Group totals
      let totalIncome = 0;
      let totalExpenses = 0;
      const categoryMap = {};
      const monthMap = {};

      // Current month string
      const currentMonthStr = new Date().toISOString().slice(0, 7);

      txs.forEach(tx => {
        if (tx.type === 'income') {
          totalIncome += tx.amount;
        } else {
          totalExpenses += tx.amount;
          categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
        }

        // Monthly trends
        const date = new Date(tx.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { month: monthKey, income: 0, expense: 0 };
        }
        if (tx.type === 'income') monthMap[monthKey].income += tx.amount;
        else monthMap[monthKey].expense += tx.amount;
      });

      // Map spent in budgets
      const budgetMap = {};
      txs.forEach(tx => {
        if (tx.type === 'expense' && tx.date.startsWith(currentMonthStr)) {
          const key = tx.category.toLowerCase();
          budgetMap[key] = (budgetMap[key] || 0) + tx.amount;
        }
      });

      const budgetsWithSpent = budgets.map(b => ({
        ...b,
        spent: budgetMap[b.category] || 0
      }));

      const totalBudgetLimit = budgetsWithSpent.reduce((acc, b) => acc + b.monthlyLimit, 0);
      const totalBudgetSpent = budgetsWithSpent.reduce((acc, b) => acc + b.spent, 0);
      const budgetRemaining = Math.max(totalBudgetLimit - totalBudgetSpent, 0);

      // Pie chart
      const pieData = Object.keys(categoryMap).map(cat => ({
        category: cat,
        total: categoryMap[cat]
      })).sort((a, b) => b.total - a.total);

      // Bar and Line trends
      const trendData = Object.values(monthMap)
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6);

      const formattedTrendData = trendData.map(d => {
        const [year, m] = d.month.split('-');
        const date = new Date(year, parseInt(m) - 1);
        return {
          ...d,
          month: date.toLocaleString('default', { month: 'short' })
        };
      });

      setDashboardData({
        transactions: txs.slice(0, 5), // Keep top 5 for table
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        savings: Math.max(totalIncome - totalExpenses, 0),
        budgetRemaining,
        pieData,
        barData: formattedTrendData,
        lineData: formattedTrendData,
        budgets: budgetsWithSpent
      });

    } catch (err) {
      setToast({ message: 'Failed to sync dashboard data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTx = async (formData) => {
    try {
      await api.post('/transactions', formData);
      setToast({ message: 'Transaction created successfully!', type: 'success' });
      setShowTxForm(false);
      fetchData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleCreateBudget = async (formData) => {
    try {
      await api.post('/budgets', formData);
      setToast({ message: 'Budget target updated!', type: 'success' });
      setShowBudgetForm(false);
      fetchData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const triggerDownloadReport = () => {
    window.print();
  };

  // Maps categories to payment methods for enterprise details
  const getPaymentMethod = (category) => {
    const mapping = {
      salary: 'Direct Deposit',
      freelance: 'Stripe Payout',
      bills: 'ACH Transfer',
      shopping: 'Credit Card',
      food: 'Debit Card',
      transport: 'Uber Business',
      entertainment: 'Apple Pay'
    };
    return mapping[category.toLowerCase()] || 'Credit Card';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = [
    { title: 'Current Balance', amount: `₹${dashboardData.balance.toLocaleString()}`, trend: '+14.2%', isUp: true, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
    )},
    { title: 'Monthly Income', amount: `₹${dashboardData.totalIncome.toLocaleString()}`, trend: '+8.3%', isUp: true, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    )},
    { title: 'Monthly Expense', amount: `₹${dashboardData.totalExpenses.toLocaleString()}`, trend: '-3.1%', isUp: false, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
    )},
    { title: 'Savings', amount: `₹${dashboardData.savings.toLocaleString()}`, trend: '+5.6%', isUp: true, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { title: 'Budget Remaining', amount: `₹${dashboardData.budgetRemaining.toLocaleString()}`, trend: 'Active Limits', isUp: true, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    )},
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 md:pb-0 text-[var(--text-primary)]">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header and Quick Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-[var(--border-color)] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Financial Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor cash flows, active budgets, and transactional metrics.</p>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => { setForceTxType('income'); setShowTxForm(true); }}
            className="btn-secondary text-xs"
          >
            + Add Income
          </button>
          <button 
            onClick={() => { setForceTxType('expense'); setShowTxForm(true); }}
            className="btn-secondary text-xs"
          >
            + Add Expense
          </button>
          <button 
            onClick={() => setShowBudgetForm(true)}
            className="btn-secondary text-xs"
          >
            + Create Budget
          </button>
          <button 
            onClick={triggerDownloadReport}
            className="btn-primary text-xs"
          >
            Download Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card flex flex-col justify-between h-36">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.title}</span>
              <div className={`p-2 rounded-xl border ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                {stat.amount}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  stat.isUp ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400'
                }`}>
                  {stat.trend}
                </span>
                <span className="text-[10px] text-slate-400">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie: Expense Category */}
        <div className="glass-card">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 tracking-tight uppercase tracking-wider text-xs">Expense by Category</h3>
          <PieChart data={dashboardData.pieData} />
        </div>

        {/* Bar: Income vs Expense */}
        <div className="glass-card">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 tracking-tight uppercase tracking-wider text-xs">Income vs Expense</h3>
          <BarChart data={dashboardData.barData} />
        </div>

        {/* Line: Spending Trend */}
        <div className="glass-card">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 tracking-tight uppercase tracking-wider text-xs">Monthly Spending Trend</h3>
          <LineChart data={dashboardData.lineData} />
        </div>

        {/* Doughnut: Budget Utilization */}
        <div className="glass-card">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 tracking-tight uppercase tracking-wider text-xs">Budget Utilization</h3>
          <DoughnutChart budgets={dashboardData.budgets} />
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="glass-card">
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 tracking-tight uppercase tracking-wider text-xs">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="pb-3 font-bold">Date</th>
                <th className="pb-3 font-bold">Description</th>
                <th className="pb-3 font-bold">Category</th>
                <th className="pb-3 font-bold">Payment Method</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800/40">
              {dashboardData.transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all duration-150">
                  <td className="py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 font-bold text-slate-800 dark:text-slate-100">{tx.title}</td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 capitalize">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {getPaymentMethod(tx.category)}
                  </td>
                  <td className="py-4">
                    <span className="badge-completed">Completed</span>
                  </td>
                  <td className={`py-4 text-right font-extrabold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forms Modals */}
      {showTxForm && (
        <TransactionForm 
          onSubmit={handleAddTx}
          forceType={forceTxType}
          onCancel={() => { setShowTxForm(false); setForceTxType(null); }}
        />
      )}

      {showBudgetForm && (
        <BudgetForm 
          onSubmit={handleCreateBudget}
          onCancel={() => setShowBudgetForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
