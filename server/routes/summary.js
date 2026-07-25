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

    // Calculate previous month's spending for rollover
    const prevStartDate = new Date(startDate);
    prevStartDate.setMonth(prevStartDate.getMonth() - 1);

    const prevCategorySpending = await Transaction.aggregate([
      { $match: { date: { $gte: prevStartDate, $lt: startDate }, type: 'expense' } },
      { $group: { _id: { $toLower: '$category' }, spent: { $sum: '$amount' } } }
    ]);

    // Calculate 3-month lookback average (lookbackStartDate to startDate)
    const lookbackStartDate = new Date(startDate);
    lookbackStartDate.setMonth(lookbackStartDate.getMonth() - 3);

    const lookbackSpending = await Transaction.aggregate([
      { $match: { date: { $gte: lookbackStartDate, $lt: startDate }, type: 'expense' } },
      { $group: { _id: { $toLower: '$category' }, total: { $sum: '$amount' } } }
    ]);

    const budgets = await Budget.find();
    
    const budgetStatus = budgets.map(budget => {
      const spending = categorySpending.find(c => c._id === budget.category);
      const spent = spending ? spending.spent : 0;

      let effectiveLimit = budget.monthlyLimit;
      let prevUnused = 0;

      if (budget.rolloverEnabled) {
        const prevSpending = prevCategorySpending.find(c => c._id === budget.category);
        const prevSpent = prevSpending ? prevSpending.spent : 0;
        prevUnused = Math.max(budget.monthlyLimit - prevSpent, 0);
        effectiveLimit += prevUnused;
      }

      return {
        category: budget.category,
        monthlyLimit: effectiveLimit,
        spent,
        originalLimit: budget.monthlyLimit,
        rolloverEnabled: budget.rolloverEnabled,
        prevUnused
      };
    });

    // Compute Spending Insights
    const insights = [];
    categorySpending.forEach(current => {
      const catKey = current._id;
      const currentSpend = current.spent;

      const lookback = lookbackSpending.find(l => l._id === catKey);
      const totalLookback = lookback ? lookback.total : 0;
      const averageSpend = totalLookback / 3;

      if (averageSpend > 0) {
        const ratio = currentSpend / averageSpend;
        if (ratio > 1.30) {
          const percentAbove = Math.round((ratio - 1) * 100);
          
          const matchingBudget = budgets.find(b => b.category === catKey);
          const displayCategory = matchingBudget ? matchingBudget.category : catKey;

          insights.push({
            category: displayCategory,
            currentSpend,
            averageSpend,
            percentAbove
          });
        }
      }
    });

    res.json({
      totalIncome,
      totalExpenses,
      savings,
      topCategories,
      budgetStatus,
      insights
    });

  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

module.exports = router;
