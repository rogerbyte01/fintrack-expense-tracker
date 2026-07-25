# FinTrack — Expense Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) web application for tracking personal income and expenses, setting category budgets, and viewing monthly financial summaries with charts.

---

## Features

- **Dashboard** — View total income, total expenses, and net balance at a glance
- **Transactions** — Add, edit, and delete income/expense entries with category and date
- **Budgets** — Set monthly spending limits per category; progress bars show how much is spent vs the limit
- **Monthly Summary** — Pick any month to see income vs expenses vs savings, plus top spending categories
- **Charts** — Doughnut chart for category-wise expense breakdown, bar chart for income vs expense trends
- **Filters** — Filter transactions by month and type (income/expense)
- **Responsive** — Works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Chart.js (react-chartjs-2) |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| HTTP Client | Axios |
| Validation | express-validator |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/rogerbyte01/fintrack-expense-tracker.git
cd fintrack-expense-tracker
```

### 2. Setup Backend

```bash
cd server
cp .env.example .env
# Edit .env and add your MongoDB connection string
npm install
npm run dev
```

Server runs on `http://localhost:5000`.

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

App opens at `http://localhost:5173`.

### 4. Run Both Together

Open two terminals:

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

The Vite dev server proxies `/api` requests to the backend, so no CORS setup needed.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |

---

## Project Structure

```
fintrack-expense-tracker/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/api.js         # Axios instance
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── PieChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   ├── BudgetCard.jsx
│   │   │   ├── BudgetForm.jsx
│   │   │   ├── MonthPicker.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/             # Page-level components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Budgets.jsx
│   │   │   └── MonthlySummary.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/db.js           # MongoDB connection
│   ├── models/
│   │   ├── Transaction.js
│   │   └── Budget.js
│   ├── routes/
│   │   ├── transactions.js    # CRUD endpoints
│   │   ├── budgets.js         # Budget endpoints
│   │   └── summary.js        # Monthly aggregation
│   ├── server.js
│   └── package.json
│
├── api/index.js               # Vercel serverless entry
├── vercel.json                # Deployment config
└── package.json               # Root build scripts
```

---

## API Endpoints

### Transactions — `/api/transactions`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all transactions (supports `?month=YYYY-MM`, `?type=`, `?category=`) |
| POST | `/` | Create a new transaction |
| PUT | `/:id` | Update a transaction |
| DELETE | `/:id` | Delete a transaction |

### Budgets — `/api/budgets`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all budgets |
| POST | `/` | Create or update a budget (upsert by category) |
| PUT | `/:id` | Update budget limit |
| DELETE | `/:id` | Delete a budget |

### Summary — `/api/summary`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/?month=YYYY-MM` | Get monthly totals, savings, top categories, budget status |

---

## Deployment

Deployed on Vercel: [fintrack-expense-tracker-wine.vercel.app](https://fintrack-expense-tracker-wine.vercel.app/)

To deploy your own:
1. Push to GitHub
2. Import repo on [vercel.com/new](https://vercel.com/new)
3. Set build command: `npm run vercel-build`, output: `client/dist`
4. Add `MONGO_URI` environment variable
5. Deploy
