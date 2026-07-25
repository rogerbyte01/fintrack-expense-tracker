import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import MonthlySummary from './pages/MonthlySummary';

function App() {
  return (
    <div className="relative flex min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Ambient gradient glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-rose-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <Sidebar />
      <main className="relative flex-1 ml-0 md:ml-64 p-4 md:p-8 z-10 animate-fade-in">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/summary" element={<MonthlySummary />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
