import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 glass-card">
        No transaction data available
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: data.map(d => d.income),
        backgroundColor: '#10b981', // emerald-500
        borderRadius: 4,
      },
      {
        label: 'Expense',
        data: data.map(d => d.expense),
        backgroundColor: '#f43f5e', // rose-500
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: {
            family: "'Inter', sans-serif",
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ₹${context.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: '#334155', // slate-700
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8', // slate-400
          callback: (value) => `₹${value}`
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
        }
      }
    }
  };

  return (
    <div className="h-64 relative">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
