import React, { useState, useEffect } from 'react';
import api from '../api/api';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import DoughnutChart from '../components/DoughnutChart';
import Toast from '../components/Toast';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [data, setData] = useState({
    pieData: [],
    barData: [],
    lineData: [],
    budgets: []
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [txRes, bRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/budgets')
      ]);

      const txs = txRes.data;
      const budgets = bRes.data;

      // Group totals
      const categoryMap = {};
      const monthMap = {};
      const currentMonthStr = new Date().toISOString().slice(0, 7);

      txs.forEach(tx => {
        if (tx.type === 'expense') {
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

      // Pie chart
      const pieData = Object.keys(categoryMap).map(cat => ({
        category: cat,
        total: categoryMap[cat]
      })).sort((a, b) => b.total - a.total);

      // Trends
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

      setData({
        pieData,
        barData: formattedTrendData,
        lineData: formattedTrendData,
        budgets: budgetsWithSpent
      });

    } catch (err) {
      setToast({ message: 'Failed to synchronize analytics data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 md:pb-0 text-[var(--text-primary)]">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Financial Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Audit cash flows, category spending breakdowns, and budget utilitzations.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow */}
        <div className="glass-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight uppercase tracking-wider text-xs">Income vs Expense Trends</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Historical bar chart comparison of inflows vs outflows over the past 6 months.</p>
          </div>
          <BarChart data={data.barData} />
        </div>

        {/* Categories */}
        <div className="glass-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight uppercase tracking-wider text-xs">Category Breakdown</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Categorized expenses showing where capital output is highest.</p>
          </div>
          <PieChart data={data.pieData} />
        </div>

        {/* Line: Spending Trend */}
        <div className="glass-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight uppercase tracking-wider text-xs">Monthly Expense Velocity</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Line chart tracing actual expenses to evaluate spending changes.</p>
          </div>
          <LineChart data={data.lineData} />
        </div>

        {/* Doughnut: Budget Utilization */}
        <div className="glass-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight uppercase tracking-wider text-xs">Total Budget Utilization</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Total limits compared to actual spending with warning thresholds.</p>
          </div>
          <DoughnutChart budgets={data.budgets} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
