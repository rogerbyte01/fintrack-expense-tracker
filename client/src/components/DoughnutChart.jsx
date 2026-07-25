import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ budgets }) => {
  const totalLimit = budgets.reduce((acc, b) => acc + (b.monthlyLimit || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent || 0), 0);
  const remaining = Math.max(totalLimit - totalSpent, 0);

  if (totalLimit === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-sm">
        No active budgets to calculate utilization
      </div>
    );
  }

  const chartData = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [totalSpent, remaining],
        backgroundColor: [
          '#14B8A6', // Teal Success/Accent
          '#E2E8F0', // slate-200 in light mode
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  // Adjust remaining color for dark mode dynamically (or use neutral slate-800)
  const isDark = document.documentElement.classList.contains('dark');
  chartData.datasets[0].backgroundColor[1] = isDark ? '#1E293B' : '#E2E8F0';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => ` ₹${context.raw.toLocaleString()}`
        }
      }
    },
    cutout: '75%',
  };

  return (
    <div className="h-64 relative flex items-center justify-center">
      <div className="w-full h-full">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
          {((totalSpent / totalLimit) * 100).toFixed(0)}%
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-0.5">
          Utilized
        </span>
      </div>
    </div>
  );
};

export default DoughnutChart;
