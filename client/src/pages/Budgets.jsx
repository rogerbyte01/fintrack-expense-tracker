import { useState, useEffect } from 'react';
import api from '../api/api';
import BudgetCard from '../components/BudgetCard';
import BudgetForm from '../components/BudgetForm';
import Toast from '../components/Toast';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchBudgetsData = async () => {
    try {
      setLoading(true);
      // We need both budgets and current month's transactions to calculate 'spent'
      const [budgetsRes, txRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/transactions')
      ]);

      const currentMonthStr = new Date().toISOString().slice(0, 7);
      
      // Calculate spent per category for current month (lowercase keys to match budget categories)
      const spentMap = {};
      txRes.data.forEach(tx => {
        if (tx.type === 'expense' && tx.date.startsWith(currentMonthStr)) {
          const key = tx.category.toLowerCase();
          spentMap[key] = (spentMap[key] || 0) + tx.amount;
        }
      });

      // Combine budget data with spent data
      const budgetsWithSpent = budgetsRes.data.map(b => ({
        ...b,
        spent: spentMap[b.category] || 0
      }));

      setBudgets(budgetsWithSpent);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetsData();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingBudget) {
        await api.put(`/budgets/${editingBudget._id}`, formData);
        setToast({ message: 'Budget updated successfully', type: 'success' });
      } else {
        await api.post('/budgets', formData);
        setToast({ message: 'Budget created successfully', type: 'success' });
      }
      setShowForm(false);
      setEditingBudget(null);
      fetchBudgetsData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        setToast({ message: 'Budget deleted', type: 'success' });
        fetchBudgetsData();
      } catch (err) {
        setToast({ message: err.message, type: 'error' });
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Budgets</h1>
          <p className="text-slate-400">Track your spending limits for the current month.</p>
        </div>
        
        <button 
          onClick={() => { setEditingBudget(null); setShowForm(true); }}
          className="btn-primary whitespace-nowrap"
        >
          + Set Budget
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="glass-card animate-pulse h-32"></div>
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-16 glass-card border-dashed">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-medium text-white mb-2">No budgets set</h3>
          <p className="text-slate-400 mb-6">Create budgets to keep your spending in check.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Create First Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {budgets.map((budget, index) => (
            <div key={budget._id} style={{ animationDelay: `${index * 0.1}s` }}>
              <BudgetCard 
                budget={budget} 
                onEdit={(b) => { setEditingBudget(b); setShowForm(true); }}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BudgetForm 
          onSubmit={handleSave}
          editingBudget={editingBudget}
          onCancel={() => { setShowForm(false); setEditingBudget(null); }}
        />
      )}
    </div>
  );
};

export default Budgets;
