const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// GET / - Monthly summary
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required (YYYY-MM)' });
    }

    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const matchDate = { $gte: startDate, $lt: endDate };

    // Calculate total income and expenses
    const totals = await Transaction.aggregate([
      { $match: { date: matchDate } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    totals.forEach(t => {
      if (t._id === 'income') totalIncome = t.total;
      if (t._id === 'expense') totalExpenses = t.total;
    });

    const savings = totalIncome - totalExpenses;

    // Top 5 spending categories
    const topCategories = await Transaction.aggregate([
      { $match: { date: matchDate, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    // Budget status
    const categorySpending = await Transaction.aggregate([
      { $match: { date: matchDate, type: 'expense' } },
      { $group: { _id: { $toLower: '$category' }, spent: { $sum: '$amount' } } }
    ]);

    const budgets = await Budget.find();
    
    const budgetStatus = budgets.map(budget => {
      const spending = categorySpending.find(c => c._id === budget.category);
      return {
        category: budget.category,
        monthlyLimit: budget.monthlyLimit,
        spent: spending ? spending.spent : 0
      };
    });

    res.json({
      totalIncome,
      totalExpenses,
      savings,
      topCategories,
      budgetStatus
    });

  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

module.exports = router;
