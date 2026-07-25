import { useState, useEffect } from 'react';
import api from '../api/api';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import MonthPicker from '../components/MonthPicker';
import Toast from '../components/Toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  
  // Initialize with current month YYYY-MM
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'
  
  const [toast, setToast] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions');
      // Filter by selected month client-side (or could use query params if backend supports)
      const filtered = res.data.filter(tx => tx.date.startsWith(selectedMonth));
      // Sort by date descending
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(filtered);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth]); // Refetch when month changes

  const handleSave = async (formData) => {
    try {
      if (editingTx) {
        await api.put(`/transactions/${editingTx._id}`, formData);
        setToast({ message: 'Transaction updated successfully', type: 'success' });
      } else {
        await api.post('/transactions', formData);
        setToast({ message: 'Transaction added successfully', type: 'success' });
      }
      setShowForm(false);
      setEditingTx(null);
      fetchTransactions();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        setToast({ message: 'Transaction deleted', type: 'success' });
        fetchTransactions();
      } catch (err) {
        setToast({ message: err.message, type: 'error' });
      }
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (typeFilter === 'all') return true;
    return tx.type === typeFilter;
  });

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Transactions</h1>
          <p className="text-slate-400">Manage your income and expenses.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <MonthPicker selectedMonth={selectedMonth} onChange={setSelectedMonth} />
          <button 
            onClick={() => { setEditingTx(null); setShowForm(true); }}
            className="btn-primary whitespace-nowrap"
          >
            + Add New
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-850 rounded-xl mb-6 p-1 flex gap-2 w-fit shadow-sm">
        {['all', 'income', 'expense'].map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-4 py-1.5 rounded-lg capitalize text-sm font-medium transition-all ${
              typeFilter === type 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <TransactionList 
        transactions={filteredTransactions} 
        loading={loading}
        onEdit={(tx) => { setEditingTx(tx); setShowForm(true); }}
        onDelete={handleDelete}
      />

      {showForm && (
        <TransactionForm 
          onSubmit={handleSave}
          editingTransaction={editingTx}
          onCancel={() => { setShowForm(false); setEditingTx(null); }}
        />
      )}
    </div>
  );
};

export default Transactions;
