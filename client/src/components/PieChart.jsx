import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 glass-card">
        No expense data for this period
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        data: data.map(d => d.total),
        backgroundColor: [
          '#f43f5e', // rose-500
          '#f59e0b', // amber-500
          '#10b981', // emerald-500
          '#3b82f6', // blue-500
          '#8b5cf6', // violet-500
          '#ec4899', // pink-500
          '#06b6d4', // cyan-500
          '#64748b', // slate-500
        ],
        borderColor: '#1e293b', // slate-800
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1', // slate-300
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => ` ₹${context.raw.toLocaleString()}`
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className="h-64 relative">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
