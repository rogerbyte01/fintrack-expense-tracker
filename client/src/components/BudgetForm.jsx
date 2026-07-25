import { useState, useEffect } from 'react';

const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

const BudgetForm = ({ onSubmit, editingBudget, onCancel }) => {
  const [formData, setFormData] = useState({
    category: expenseCategories[0],
    monthlyLimit: '',
  });

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category,
        monthlyLimit: editingBudget.monthlyLimit
      });
    }
  }, [editingBudget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.monthlyLimit || formData.monthlyLimit <= 0) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl animate-slide-up">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editingBudget ? 'Edit Budget' : 'Set Budget'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full"
              disabled={!!editingBudget} // Don't allow changing category of existing budget easily
            >
              {expenseCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Monthly Limit (₹)</label>
            <input
              type="number"
              name="monthlyLimit"
              value={formData.monthlyLimit}
              onChange={handleChange}
              required
              min="1"
              className="w-full"
              placeholder="e.g., 5000"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingBudget ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
