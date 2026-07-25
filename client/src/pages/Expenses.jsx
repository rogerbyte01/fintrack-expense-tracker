import React, { useState, useEffect } from 'react';
import api from '../api/api';
import TransactionForm from '../components/TransactionForm';
import Toast from '../components/Toast';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [toast, setToast] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions');
      // Filter expenses
      const filtered = res.data.filter(tx => tx.type === 'expense');
      setExpenses(filtered);
    } catch (err) {
      setToast({ message: 'Failed to fetch expense logs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingExpense) {
        await api.put(`/transactions/${editingExpense._id}`, { ...formData, type: 'expense' });
        setToast({ message: 'Expense updated successfully', type: 'success' });
      } else {
        await api.post('/transactions', { ...formData, type: 'expense' });
        setToast({ message: 'Expense added successfully', type: 'success' });
      }
      setShowForm(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense entry?')) {
      try {
        await api.delete(`/transactions/${id}`);
        setToast({ message: 'Expense entry deleted', type: 'success' });
        fetchExpenses();
      } catch (err) {
        setToast({ message: err.message, type: 'error' });
      }
    }
  };

  const getPaymentMethod = (category) => {
    const mapping = {
      bills: 'ACH Transfer',
      shopping: 'Credit Card',
      food: 'Debit Card',
      transport: 'Uber Business',
      entertainment: 'Apple Pay'
    };
    return mapping[category.toLowerCase()] || 'Credit Card';
  };

  // Filter logic
  const filteredExpenses = expenses.filter(tx => {
    const txMonth = tx.date.slice(0, 7); // YYYY-MM
    const matchCategory = categoryFilter === 'all' || tx.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchMonth = monthFilter === 'all' || txMonth === monthFilter;
    const matchPayment = paymentFilter === 'all' || getPaymentMethod(tx.category).toLowerCase().replace(' ', '') === paymentFilter.toLowerCase();
    return matchCategory && matchMonth && matchPayment;
  });

  // Extract unique months for filter dropdown
  const uniqueMonths = [...new Set(expenses.map(tx => tx.date.slice(0, 7)))].sort().reverse();

  return (
    <div className="max-w-7xl mx-auto pb-20 md:pb-0 text-[var(--text-primary)]">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Expense Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Audit, categorize, and control corporate and personal spending outputs.</p>
        </div>
        <button 
          onClick={() => { setEditingExpense(null); setShowForm(true); }}
          className="btn-primary self-start sm:self-center"
        >
          + Add Expense
        </button>
      </div>

      {/* Filter controls */}
      <div className="glass-card mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-sm"
          >
            <option value="all">All Categories</option>
            <option value="food">Food & Groceries</option>
            <option value="transport">Transport</option>
            <option value="shopping">Shopping</option>
            <option value="bills">Bills & Rent</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Month</label>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full text-sm"
          >
            <option value="all">All Months</option>
            {uniqueMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Payment Method</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full text-sm"
          >
            <option value="all">All Payment Methods</option>
            <option value="creditcard">Credit Card</option>
            <option value="debitcard">Debit Card</option>
            <option value="achtransfer">ACH Transfer</option>
            <option value="applepay">Apple Pay</option>
            <option value="uberbusiness">Uber Business</option>
          </select>
        </div>
      </div>

      {/* Premium Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card animate-pulse h-36"></div>
          ))}
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center py-16 glass-card border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No expense logs found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Create expense entries to track where your money goes.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
            Log First Expense
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredExpenses.map((tx, index) => (
            <div 
              key={tx._id}
              className="glass-card flex flex-col justify-between h-40 relative group animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Top Details */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tx.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 capitalize">
                      {tx.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Edit/Delete group */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingExpense(tx); setShowForm(true); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-[var(--border-color)]"
                    title="Edit"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(tx._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-[var(--border-color)]"
                    title="Delete"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Bottom Values */}
              <div className="flex justify-between items-end mt-4 pt-3 border-t border-dashed border-[var(--border-color)]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Payment Method</span>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{getPaymentMethod(tx.category)}</p>
                </div>
                <div className="text-xl font-extrabold text-slate-800 dark:text-white">
                  -₹{tx.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating mobile button */}
      <button
        onClick={() => { setEditingExpense(null); setShowForm(true); }}
        className="md:hidden fixed bottom-20 right-6 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all duration-200 z-50"
        title="Add Expense"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Form Modal */}
      {showForm && (
        <TransactionForm 
          onSubmit={handleSave}
          editingTransaction={editingExpense}
          forceType="expense"
          onCancel={() => { setShowForm(false); setEditingExpense(null); }}
        />
      )}
    </div>
  );
};

export default Expenses;
