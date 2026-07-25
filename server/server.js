const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// --------------- Middleware ---------------

app.use(cors());
app.use(express.json());

// Ensure DB is connected for serverless invocations
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// --------------- API Routes ---------------

app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/summary', require('./routes/summary'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Expense Tracker API is running 🔄' });
});

// --------------- 404 Handler ---------------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --------------- Global Error Handler ---------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Export Express app for Vercel Serverless Functions
module.exports = app;

// --------------- Start Server locally ---------------
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Expense Tracker API running on http://localhost:${PORT}`);
  });
}
