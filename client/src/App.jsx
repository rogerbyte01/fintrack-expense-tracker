import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import MonthlySummary from './pages/MonthlySummary';

function App() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 animate-fade-in">
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
