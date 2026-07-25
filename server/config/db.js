const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB using the URI from environment variables.
 * Reuses existing connection in serverless environments like Vercel.
 */
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    
    // Seed initial data if DB is empty
    await seedDataIfEmpty();
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error(`💡 Tip: Check your MongoDB Atlas Network Access rules (whitelist 0.0.0.0/0 for dev).`);
  }
};

const seedDataIfEmpty = async () => {
  try {
    const Transaction = require('../models/Transaction');
    const Budget = require('../models/Budget');
    
    const count = await Transaction.countDocuments();
    if (count === 0) {
      console.log('🌱 Database empty. Seeding initial transactions and budgets...');
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      await Transaction.insertMany([
        { title: 'Monthly Salary', amount: 75000, category: 'Salary', type: 'income', date: new Date(`${currentMonth}-01`) },
        { title: 'Freelance Project', amount: 15000, category: 'Freelance', type: 'income', date: new Date(`${currentMonth}-05`) },
        { title: 'Apartment Rent & Utilities', amount: 22000, category: 'Bills', type: 'expense', date: new Date(`${currentMonth}-02`) },
        { title: 'Supermarket Groceries', amount: 8500, category: 'Food', type: 'expense', date: new Date(`${currentMonth}-08`) },
        { title: 'Monthly Metro Pass', amount: 3200, category: 'Transport', type: 'expense', date: new Date(`${currentMonth}-10`) },
        { title: 'Movie & Dinner', amount: 4500, category: 'Entertainment', type: 'expense', date: new Date(`${currentMonth}-14`) },
        { title: 'Online Shopping', amount: 6000, category: 'Shopping', type: 'expense', date: new Date(`${currentMonth}-18`) },
      ]);

      const budgetCount = await Budget.countDocuments();
      if (budgetCount === 0) {
        await Budget.insertMany([
          { category: 'food', monthlyLimit: 12000 },
          { category: 'transport', monthlyLimit: 5000 },
          { category: 'shopping', monthlyLimit: 8000 },
          { category: 'bills', monthlyLimit: 25000 },
          { category: 'entertainment', monthlyLimit: 6000 },
        ]);
      }
      console.log('✅ Initial demo seed data created successfully!');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = connectDB;
