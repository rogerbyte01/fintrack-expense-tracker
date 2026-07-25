import { useState, useEffect } from 'react';

const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];
const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

const TransactionForm = ({ onSubmit, editingTransaction, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: expenseCategories[0],
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        date: new Date(editingTransaction.date).toISOString().split('T')[0]
      });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value };
      // Reset category if type changes to ensure category is valid for new type
      if (name === 'type') {
        updates.category = value === 'income' ? incomeCategories[0] : expenseCategories[0];
      }
      return { ...prev, ...updates };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || formData.amount <= 0) return;
    onSubmit(formData);
  };

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl animate-slide-up">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4 p-1 bg-slate-900 rounded-lg">
            <button
              type="button"
              className={`flex-1 py-2 rounded-md transition-all ${formData.type === 'expense' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:text-white'}`}
              onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-md transition-all ${formData.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
              onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="e.g., Groceries"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className="w-full"
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingTransaction ? 'Update' : 'Add'} {formData.type === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
