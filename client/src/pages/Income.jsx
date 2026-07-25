import React, { useState, useEffect } from 'react';
import api from '../api/api';
import TransactionForm from '../components/TransactionForm';
import Toast from '../components/Toast';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [toast, setToast] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions');
      // Filter only income type
      const filtered = res.data.filter(tx => tx.type === 'income');
      setIncomes(filtered);
    } catch (err) {
      setToast({ message: 'Failed to fetch income logs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingIncome) {
        await api.put(`/transactions/${editingIncome._id}`, { ...formData, type: 'income' });
        setToast({ message: 'Income entry updated successfully', type: 'success' });
      } else {
        await api.post('/transactions', { ...formData, type: 'income' });
        setToast({ message: 'Income entry added successfully', type: 'success' });
      }
      setShowForm(false);
      setEditingIncome(null);
      fetchIncomes();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await api.delete(`/transactions/${id}`);
        setToast({ message: 'Income entry removed', type: 'success' });
        fetchIncomes();
      } catch (err) {
        setToast({ message: err.message, type: 'error' });
      }
    }
  };

  // Filter & sort logic
  const filteredIncomes = incomes
    .filter(tx => {
      const matchSearch = tx.title.toLowerCase().includes(search.toLowerCase()) || 
                          tx.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'all' || tx.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });

  const getPaymentMethod = (category) => {
    const mapping = {
      salary: 'Direct Deposit',
      freelance: 'Stripe Payout',
      investment: 'Brokerage Wire',
      gift: 'Interac Transfer'
    };
    return mapping[category.toLowerCase()] || 'Wire Transfer';
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 md:pb-0 text-[var(--text-primary)]">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Income Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and audit your salary, freelance earnings, and investments.</p>
        </div>
        <button 
          onClick={() => { setEditingIncome(null); setShowForm(true); }}
          className="btn-primary self-start sm:self-center"
        >
          + Add Income
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-card mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Search Description</label>
          <input
            type="text"
            placeholder="Search descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-sm"
          >
            <option value="all">All Categories</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="investment">Investment</option>
            <option value="gift">Gift</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>

        <div className="h-full flex items-end pt-4 sm:pt-0">
          <span className="text-xs font-semibold text-slate-400">
            Showing {filteredIncomes.length} entries
          </span>
        </div>
      </div>

      {/* Modern Data Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card animate-pulse h-20"></div>
          ))}
        </div>
      ) : filteredIncomes.length === 0 ? (
        <div className="text-center py-16 glass-card border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No income entries found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Create income transactions to track your cash inflows.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
            Log First Income
          </button>
        </div>
      ) : (
        <div className="glass-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Description</th>
                  <th className="pb-3 font-bold">Category</th>
                  <th className="pb-3 font-bold">Payout Method</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Amount</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800/40">
                {filteredIncomes.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all duration-150">
                    <td className="py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 font-bold text-slate-800 dark:text-slate-100">{tx.title}</td>
                    <td className="py-4">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 capitalize">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {getPaymentMethod(tx.category)}
                    </td>
                    <td className="py-4">
                      <span className="badge-completed">Completed</span>
                    </td>
                    <td className="py-4 text-right font-extrabold text-emerald-500">
                      +₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => { setEditingIncome(tx); setShowForm(true); }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-[var(--border-color)]"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(tx._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-[var(--border-color)]"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Floating Action Button on mobile */}
      <button
        onClick={() => { setEditingIncome(null); setShowForm(true); }}
        className="md:hidden fixed bottom-20 right-6 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all duration-200 z-50"
        title="Add Income"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Form Modal */}
      {showForm && (
        <TransactionForm 
          onSubmit={handleSave}
          editingTransaction={editingIncome}
          forceType="income"
          onCancel={() => { setShowForm(false); setEditingIncome(null); }}
        />
      )}
    </div>
  );
};

export default Income;
