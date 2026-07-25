# FinTrack — Project Documentation

This document covers the complete technical details of the FinTrack expense tracker project — architecture, database schemas, API specs, frontend structure, and common questions.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Database Schemas](#3-database-schemas)
4. [API Endpoints](#4-api-endpoints)
5. [Frontend Structure](#5-frontend-structure)
6. [Design Decisions](#6-design-decisions)
7. [Common Questions & Answers](#7-common-questions--answers)
8. [How to Run & Deploy](#8-how-to-run--deploy)

---

## 1. Project Overview

**FinTrack** is a personal finance management web application built using the MERN stack. It lets users:

- Log income and expense transactions with categories and dates
- View a dashboard with total income, expenses, and balance
- Visualize spending patterns using Chart.js (doughnut chart by category, bar chart for trends)
- Set monthly budget limits per category and track progress with color-coded progress bars
- View monthly summaries showing income vs expenses, savings, and top spending categories

---

## 2. Tech Stack & Architecture

| Layer | Technology | Why I Used It |
| :--- | :--- | :--- |
| Frontend | React 18 + Vite | Component-based UI with fast hot-reload during development |
| Styling | Tailwind CSS 3 | Quick styling with utility classes, easy responsive design |
| Charts | Chart.js + react-chartjs-2 | Lightweight canvas-based charts that work well with React |
| Routing | React Router DOM v6 | Client-side page navigation without full reloads |
| HTTP | Axios | Cleaner API calls than fetch, supports interceptors for error handling |
| Backend | Node.js + Express.js | JavaScript on both client and server, fast to build REST APIs |
| Database | MongoDB + Mongoose | Flexible document structure, good for storing varied transaction data |
| Validation | express-validator | Validates request body fields before they reach the database |
| Hosting | Vercel | Free deployment with serverless function support for the Express API |

### How Data Flows

```
Browser (React SPA)
    ↓ Axios calls to /api/*
Vite Dev Proxy (dev) / Vercel Rewrites (prod)
    ↓
Express.js API Server
    ↓ express-validator checks
Mongoose Models
    ↓
MongoDB Atlas (cloud database)
```

---

## 3. Database Schemas

### Transaction Model (`server/models/Transaction.js`)

Stores each income or expense entry.

| Field | Type | Constraints |
|-------|------|------------|
| title | String | Required, trimmed, max 100 chars |
| amount | Number | Required, minimum 0.01 |
| category | String | Required, trimmed |
| date | Date | Required, defaults to current date |
| type | String | Required, must be `'income'` or `'expense'` (enum) |

Mongoose `timestamps: true` automatically adds `createdAt` and `updatedAt`.

### Budget Model (`server/models/Budget.js`)

Stores monthly spending limits per category.

| Field | Type | Constraints |
|-------|------|------------|
| category | String | Required, unique, stored in lowercase (custom setter) |
| monthlyLimit | Number | Required, minimum 1 |

The `category` field uses `set: v => v.toLowerCase()` so "Food" and "food" are treated as the same category. The `unique` constraint prevents duplicate budgets for the same category.

---

## 4. API Endpoints

### Transactions (`/api/transactions`)

- **GET /** — Returns all transactions, sorted by date (newest first). Supports filters:
  - `?month=2026-07` — filter by month
  - `?type=expense` — filter by income/expense
  - `?category=Food` — filter by category
- **POST /** — Creates a new transaction. Validates title, amount (>0), type, category, and optional date.
- **PUT /:id** — Updates a transaction by its MongoDB `_id`.
- **DELETE /:id** — Deletes a transaction by its `_id`.

### Budgets (`/api/budgets`)

- **GET /** — Returns all budget limits.
- **POST /** — Creates a new budget. If a budget for that category already exists, it updates the limit instead (upsert pattern).
- **PUT /:id** — Updates the `monthlyLimit` for a specific budget.
- **DELETE /:id** — Removes a budget.

### Summary (`/api/summary`)

- **GET /?month=YYYY-MM** — Uses MongoDB aggregation pipelines to calculate:
  - `totalIncome` and `totalExpenses` (grouped by type using `$group` and `$sum`)
  - `savings` (income minus expenses)
  - `topCategories` (top 5 expense categories using `$sort` and `$limit`)
  - `budgetStatus` (compares actual spending per category against budget limits)

---

## 5. Frontend Structure

### Pages

| Page | Route | What It Does |
|------|-------|-------------|
| Dashboard | `/` | Shows summary cards (income, expenses, balance) + doughnut chart + bar chart |
| Transactions | `/transactions` | Lists all transactions with month/type filters, add/edit/delete modals |
| Budgets | `/budgets` | Manage budget limits, shows progress bars with color-coded warnings |
| Monthly Summary | `/summary` | Pick a month, see detailed breakdown with top categories and budget status |

### Key Components

| Component | Purpose |
|-----------|---------|
| Sidebar | Navigation — desktop sidebar, mobile bottom nav bar |
| SummaryCards | Three cards showing income, expenses, and balance |
| TransactionForm | Modal form for adding/editing transactions |
| TransactionList | Displays transaction cards with edit/delete buttons |
| PieChart | Chart.js Doughnut chart — expense breakdown by category |
| BarChart | Chart.js Bar chart — income vs expenses over last 6 months |
| BudgetCard | Shows budget limit, amount spent, progress bar with warning colors |
| BudgetForm | Modal for creating/editing budget limits |
| MonthPicker | Dropdown to select from last 12 months |
| Toast | Notification popup for success/error messages |

### UI Design

- Dark theme using Tailwind's slate color palette
- Cards use a glass effect (backdrop-blur + semi-transparent background)
- Color coding: green for income, red/rose for expenses, amber for budget warnings
- Inter font from Google Fonts
- Responsive layout — sidebar on desktop, bottom navigation on mobile

---

## 6. Design Decisions

1. **Serverless-friendly database connection**: Since Vercel runs each API call as a separate serverless function, I cache the MongoDB connection using `mongoose.connection.readyState` to avoid reconnecting on every request.

2. **Vite proxy for development**: Instead of dealing with CORS, I configured Vite to proxy all `/api` requests to the Express server running on port 5000. The frontend code just uses relative URLs like `/api/transactions`.

3. **Lowercase budget categories**: Budget categories are stored in lowercase using a Mongoose setter. When calculating spending, transaction categories are also lowered to lowercase so "Food" and "food" match correctly.

4. **Demo data seeding**: On first startup with an empty database, the app automatically creates sample transactions and budgets so the dashboard isn't blank.

5. **Client-side summary fallback**: The Monthly Summary page first tries the server-side aggregation API. If it fails, it falls back to calculating totals from raw transaction data on the client side.

---

## 7. Common Questions & Answers

**Q: What is the architecture of this application?**
It's a MERN stack SPA. React handles the frontend UI and Chart.js renders the visualizations. Express.js serves as the REST API backend with Mongoose connecting to MongoDB Atlas for data storage.

**Q: How does the monthly summary work?**
The `/api/summary` route uses MongoDB aggregation pipelines — `$match` filters transactions by date range, `$group` calculates totals by type, and another pipeline groups expenses by category, sorts them, and returns the top 5.

**Q: How is input validation handled?**
On the server side, `express-validator` middleware checks every POST/PUT request — it validates that title is a non-empty string, amount is a positive number, type is either 'income' or 'expense', etc. If validation fails, it returns a 400 error with specific messages. On the client side, HTML5 form validation and controlled React state prevent obviously bad inputs.

**Q: How do the budget warnings work?**
The app calculates `(spent / monthlyLimit) * 100` for each budget category. Below 75% shows a green progress bar. Between 75-99% shows amber with a "Nearing limit" message. At 100% or above, it turns red with "Limit exceeded!".

**Q: How is Vercel deployment set up?**
`vercel.json` defines rewrite rules — `/api/*` routes go to a serverless function (`api/index.js` which exports the Express app), and all other routes serve the React build from `client/dist`. The `MONGO_URI` is set as an environment variable in Vercel's dashboard.

**Q: Why Chart.js?**
It renders charts on HTML5 Canvas which is performant. The `react-chartjs-2` wrapper makes it easy to use as a React component. It supports tooltips, legends, and responsive sizing out of the box.

**Q: How does the app handle CORS?**
In development, Vite's built-in proxy forwards `/api` requests to the Express server, so both frontend and API appear to be on the same origin. In production on Vercel, everything is on the same domain anyway, so CORS isn't an issue.

**Q: What optimizations are in the Mongoose schemas?**
String fields use `trim: true` to remove whitespace. The Budget model has a `unique` index on `category` to prevent duplicates and uses a lowercase setter for consistent matching. Transaction `type` uses `enum` to restrict values.

**Q: How would you add user authentication?**
I'd create a User model with `bcryptjs` for password hashing, add login/signup API routes that issue JWTs, add a middleware that verifies the JWT on protected routes, and add a `user` reference field to Transaction and Budget schemas to scope data per user.

**Q: How is the app responsive?**
Tailwind CSS breakpoints — on larger screens (`md:` and above) there's a fixed sidebar for navigation. On mobile, the sidebar hides and a bottom navigation bar appears. Grid layouts switch from multi-column to single-column on small screens.

---

## 8. How to Run & Deploy

### Running Locally

```bash
# Terminal 1 — Backend
cd server
npm install
npm run dev    # starts on http://localhost:5000

# Terminal 2 — Frontend
cd client
npm install
npm run dev    # starts on http://localhost:5173
```

### Environment Variables (`server/.env`)

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense-tracker
```

### Deploying to Vercel

1. Push the code to GitHub
2. Go to vercel.com/new and import the repository
3. Set build command to `npm run vercel-build` and output directory to `client/dist`
4. Add `MONGO_URI` as an environment variable
5. Click Deploy

**Live URL**: https://fintrack-expense-tracker-wine.vercel.app/
