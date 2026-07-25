const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Budget = require('../models/Budget');

const validateBudget = [
  body('category').isString().trim().notEmpty().withMessage('Category is required'),
  body('monthlyLimit').isFloat({ min: 1 }).withMessage('Monthly limit must be a positive number')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET / - List all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// POST / - Create budget
router.post('/', validateBudget, handleValidationErrors, async (req, res) => {
  try {
    const { category, monthlyLimit } = req.body;
    const categoryLower = category.toLowerCase();

    let budget = await Budget.findOne({ category: categoryLower });
    if (budget) {
      budget.monthlyLimit = monthlyLimit;
      await budget.save();
    } else {
      budget = new Budget({ category: categoryLower, monthlyLimit });
      await budget.save();
    }
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// PUT /:id - Update budget
router.put('/:id', [body('monthlyLimit').isFloat({ min: 1 }).withMessage('Monthly limit must be a positive number')], handleValidationErrors, async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, { monthlyLimit: req.body.monthlyLimit }, { new: true, runValidators: true });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// DELETE /:id - Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

module.exports = router;
