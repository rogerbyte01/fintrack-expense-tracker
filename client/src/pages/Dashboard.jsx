import { useState, useEffect } from 'react';
import api from '../api/api';
import SummaryCards from '../components/SummaryCards';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    transactions: [],
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    pieData: [],
    barData: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all transactions for overview
        const res = await api.get('/transactions');
        const txs = res.data;

        let income = 0;
        let expenses = 0;
        const categoryMap = {};
        const monthMap = {};

        txs.forEach(tx => {
          // Summary cards logic
          if (tx.type === 'income') income += tx.amount;
          else {
            expenses += tx.amount;
            // Pie chart logic (only expenses)
            categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
          }

          // Bar chart logic (group by YYYY-MM)
          const date = new Date(tx.date);
          const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthMap[monthStr]) {
            monthMap[monthStr] = { month: monthStr, income: 0, expense: 0 };
          }
          if (tx.type === 'income') monthMap[monthStr].income += tx.amount;
          else monthMap[monthStr].expense += tx.amount;
        });

        // Format pie data
        const pieData = Object.keys(categoryMap).map(cat => ({
          category: cat,
          total: categoryMap[cat]
        })).sort((a, b) => b.total - a.total);

        // Format and sort bar data (last 6 months)
        const barData = Object.values(monthMap)
          .sort((a, b) => a.month.localeCompare(b.month))
          .slice(-6);
          
        // Format month labels nicely for bar chart
        const formattedBarData = barData.map(d => {
          const [year, m] = d.month.split('-');
          const date = new Date(year, parseInt(m) - 1);
          return {
            ...d,
            month: date.toLocaleString('default', { month: 'short', year: '2-digit' })
          };
        });

        setData({
          transactions: txs,
          totalIncome: income,
          totalExpenses: expenses,
          balance: income - expenses,
          pieData,
          barData: formattedBarData
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 md:pb-0">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back! Here's your financial summary.</p>
      </header>

      <SummaryCards 
        income={data.totalIncome} 
        expenses={data.totalExpenses} 
        balance={data.balance} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="text-lg font-bold mb-6 text-slate-200 tracking-tight">Expense Breakdown</h3>
          <PieChart data={data.pieData} />
        </div>
        
        <div className="glass-card">
          <h3 className="text-lg font-bold mb-6 text-slate-200 tracking-tight">Income vs Expenses (Last 6 Months)</h3>
          <BarChart data={data.barData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
