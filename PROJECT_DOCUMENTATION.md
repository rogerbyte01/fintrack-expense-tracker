# 📘 FinTrack — Complete Project Reference & Interview Guide

This document contains **all information, technical specifications, architecture decisions, API contracts, database schemas, and Q&A** for the **FinTrack Full-Stack MERN Expense Tracker & Finance Manager**. Use this guide to answer any question about the project during interviews, vivas, code reviews, or presentations.

---

## 📋 Table of Contents
1. [Executive Summary & Purpose](#1-executive-summary--purpose)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Database Schemas & Data Models](#3-database-schemas--data-models)
4. [Backend API Specifications](#4-backend-api-specifications)
5. [Frontend Structure & UI Design System](#5-frontend-structure--ui-design-system)
6. [Key Engineering Decisions](#6-key-engineering-decisions)
7. [Comprehensive Interview / Viva Q&A](#7-comprehensive-interview--viva-qa)
8. [Setup, Execution & Deployment Guide](#8-setup-execution--deployment-guide)

---

## 1. Executive Summary & Purpose

* **Project Name**: FinTrack
* **Domain**: Personal Finance Management / FinTech Web Application
* **Problem Addressed**: Many people struggle to track daily micro-expenses, balance income vs spending, and stick to category-wise monthly budgets without visual feedback.
* **Solution**: A fast, full-stack MERN application featuring:
  * Real-time dashboard summaries (Total Income, Total Expenses, Net Balance).
  * Data visualizations (Doughnut charts for expense category breakdown, Bar charts for income vs expense trends over time).
  * Full CRUD (Create, Read, Update, Delete) management for transactions and category budget limits.
  * Category-based monthly budget progress bars with visual warning thresholds (Green <75%, Amber 75-100%, Red >100% exceeded).
  * Detailed monthly financial summaries and top 5 ranked spending categories.

---

## 2. Tech Stack & Architecture

### 🛠️ Technology Breakdown

| Layer | Technology | Role / Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (Vite) | Fast component-based UI, virtual DOM rendering, seamless state updates |
| **Styling & Theme** | Tailwind CSS 3 | Utility-first CSS, dark theme, glassmorphism cards, micro-animations |
| **Data Visualization** | Chart.js + react-chartjs-2 | Interactive, responsive HTML5 canvas charts (Doughnut & Bar) |
| **Client Routing** | React Router DOM v6 | Single-Page Application (SPA) client-side routing |
| **HTTP Client** | Axios | Async API requests with centralized interceptors & error handling |
| **Backend Runtime** | Node.js + Express.js | Non-blocking, event-driven REST API server |
| **Database** | MongoDB + Mongoose ODM | Flexible NoSQL document database with schema validation |
| **Input Validation** | express-validator | Server-side request body validation middleware |
| **Deployment Target** | Vercel | Serverless Functions for backend API + static CDN hosting for Vite frontend |

### 🏗️ Data Flow Architecture

```
[ User Browser (React 18 SPA) ]
       │
       │ Axios HTTP Requests (/api/*)
       ▼
[ Vite Dev Proxy / Vercel Serverless Rewrites ]
       │
       │ Routes to Express Middleware
       ▼
[ Express API Router (server.js & routes/*.js) ]
       │
       │ express-validator Validation
       ▼
[ Mongoose ODM Models (Transaction & Budget) ]
       │
       │ MongoDB Native Driver / Wire Protocol
       ▼
[ MongoDB Atlas Database (Cloud Database) ]
```

---

## 3. Database Schemas & Data Models

The application uses two primary Mongoose schemas stored in MongoDB:

### 3.1 Transaction Model (`server/models/Transaction.js`)

Represents an individual financial movement (Income or Expense).

```javascript
const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});
```

* **Key Schema Features**:
  * Enforces `type` to strictly be either `'income'` or `'expense'`.
  * `amount` must be a positive number (`min: 0.01`).
  * `date` defaults to current timestamp if omitted.

---

### 3.2 Budget Model (`server/models/Budget.js`)

Represents a monthly spending limit assigned to a specific expense category.

```javascript
const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    set: v => v.toLowerCase() // Always stores category in lowercase for consistent matching
  },
  monthlyLimit: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});
```

* **Key Schema Features**:
  * `unique: true` on `category` guarantees only one budget limit exists per category.
  * Custom setter (`set: v => v.toLowerCase()`) normalizes casing to prevent duplication (e.g. `'Food'` vs `'food'`).

---

## 4. Backend API Specifications

Base URL: `/api`

### 4.1 Transactions API (`/api/transactions`)

| Method | Endpoint | Query Parameters | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/transactions` | `?month=YYYY-MM`, `?type=`, `?category=` | Returns array of transactions sorted by date descending | `200 OK`, `500` |
| **POST** | `/api/transactions` | None | Creates a new transaction after validating fields | `201 Created`, `400 Bad Request`, `500` |
| **PUT** | `/api/transactions/:id` | None | Updates transaction by ID after validation | `200 OK`, `400`, `404 Not Found`, `500` |
| **DELETE** | `/api/transactions/:id` | None | Deletes transaction by ID | `200 OK`, `404`, `500` |

### 4.2 Budgets API (`/api/budgets`)

| Method | Endpoint | Description | Behavior | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/budgets` | Get all category budgets | Returns array of all budget limits | `200 OK`, `500` |
| **POST** | `/api/budgets` | Upsert category budget | If budget for category exists, updates `monthlyLimit`; otherwise creates new budget | `201 Created`, `400`, `500` |
| **PUT** | `/api/budgets/:id` | Update budget limit | Updates limit for given budget ID | `200 OK`, `400`, `404`, `500` |
| **DELETE** | `/api/budgets/:id` | Delete budget | Removes category budget limit | `200 OK`, `404`, `500` |

### 4.3 Summary API (`/api/summary`)

| Method | Endpoint | Required Query Param | Response Object |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/summary` | `?month=YYYY-MM` | `{ totalIncome, totalExpenses, savings, topCategories, budgetStatus }` |

* **MongoDB Aggregation Pipeline**:
  * Uses `$match` to filter transactions within the month's date range (`$gte: startDate, $lt: endDate`).
  * Uses `$group` to aggregate total income vs total expense.
  * Uses `$group` with `$sort` and `$limit: 5` to identify top 5 highest spending categories.
  * Merges total spending per category with `Budget` records to return `spent` vs `monthlyLimit` comparison.

---

## 5. Frontend Structure & UI Design System

### 📁 Directory Layout (`client/src/`)

```
src/
├── api/
│   └── api.js              # Axios instance configured with baseURL='/api' & interceptors
├── components/
│   ├── Sidebar.jsx         # Responsive Desktop Sidebar + Mobile Bottom Navigation
│   ├── SummaryCards.jsx    # Metric cards for Income, Expenses, Balance
│   ├── TransactionForm.jsx # Add/Edit Transaction Modal with validation
│   ├── TransactionList.jsx # Responsive table list with hover actions (Edit/Delete)
│   ├── PieChart.jsx        # Chart.js Doughnut chart component
│   ├── BarChart.jsx        # Chart.js Bar chart component (Income vs Expenses trend)
│   ├── BudgetCard.jsx      # Progress bar card with warning logic
│   ├── BudgetForm.jsx      # Add/Edit Budget Modal
│   ├── MonthPicker.jsx     # Dropdown for selecting past 12 months
│   └── Toast.jsx           # Animated slide-in notification toast
├── pages/
│   ├── Dashboard.jsx       # Overview page with metrics & charts
│   ├── Transactions.jsx    # Transaction CRUD list & category/type filters
│   ├── Budgets.jsx         # Budget limits management & progress monitoring
│   └── MonthlySummary.jsx  # Detailed monthly breakdown & top spending ranks
├── App.jsx                 # Client layout wrapper & React Router config
├── main.jsx                # React 18 root entry point
└── index.css               # Global Tailwind directives & glassmorphism utilities
```

### 🎨 Visual Design System

* **Color Palette**:
  * **Background**: Slate 900 (`#0f172a`)
  * **Card Container**: Slate 800 (`#1e293b`) with backdrop blur (`glass-card`)
  * **Positive / Income**: Emerald (`#10b981`)
  * **Negative / Expense**: Rose (`#f43f5e`)
  * **Warning / Warning Level**: Amber (`#f59e0b`)
* **Typography**: Inter (Google Fonts)
* **Animations**: Fade-in on mount, slide-up for cards, slide-in for notification toasts.

---

## 6. Key Engineering Decisions

1. **Serverless Connection Reuse (Vercel Compatibility)**:
   In traditional Express apps, `mongoose.connect()` is called once on server start. In serverless environments like Vercel, functions spin up on demand. `server/config/db.js` checks `mongoose.connection.readyState === 1` before connecting, reusing existing connections across warm invocations.

2. **Vite API Proxying in Development**:
   In `vite.config.js`, requests starting with `/api` are proxied to `http://127.0.0.1:5000`. This completely eliminates CORS issues during development without needing hardcoded hostnames in frontend code.

3. **Case Normalization for Budget Matching**:
   Mongoose converts budget categories to lowercase on save. When calculating spending per category on the frontend or backend, transaction categories are normalized (`category.toLowerCase()`) so that `'Food'`, `'FOOD'`, and `'food'` correctly match the budget limit.

4. **Automated Demo Data Seeding**:
   If the database is clean on first startup, `seedDataIfEmpty()` automatically populates initial demo income/expense records and budgets, ensuring immediate visual feedback.

5. **Client-Side Fallback for Summary**:
   If network conditions delay the `/api/summary` aggregation endpoint, `MonthlySummary.jsx` includes a client-side aggregation fallback using raw transaction data, ensuring high app resilience.

---

## 7. Comprehensive Interview / Viva Q&A

### Q1: What is the architecture of this application?
> **Answer**: FinTrack follows a full-stack MERN (MongoDB, Express.js, React, Node.js) single-page application (SPA) architecture. The React frontend handles the presentation layer and renders dynamic Chart.js visualizations. The Node/Express backend exposes a REST API that performs data validation and communicates with MongoDB Atlas via Mongoose ODM.

---

### Q2: How does the application calculate the monthly summary and top spending categories?
> **Answer**: The backend implements MongoDB Aggregation Pipelines in `server/routes/summary.js`.
> 1. It filters transactions for the requested month using `$match` on date range (`$gte` start of month, `$lt` start of next month).
> 2. It calculates income vs expense using `$group` by `type` and `$sum` on `amount`.
> 3. It computes top spending categories by grouping expenses by `category`, sorting by total descending (`$sort: { total: -1 }`), and limiting to the top 5 results (`$limit: 5`).

---

### Q3: How do you handle input validation to prevent invalid data?
> **Answer**: Validation is applied on both client and server sides:
> - **Client-side**: HTML5 input constraints (`min="0.01"`, `required`), form submit handlers that verify positive numerical inputs, and controlled state bindings.
> - **Server-side**: `express-validator` middleware rules in backend routes. If validation fails, the server responds with a `400 Bad Request` and structured error messages, preventing malformed data from reaching MongoDB.

---

### Q4: How does the budget warning system determine when a limit is near or exceeded?
> **Answer**: In `BudgetCard.jsx` and `MonthlySummary.jsx`, the percentage spent is computed as `(spent / monthlyLimit) * 100`.
> - **< 75%**: Displayed with a green (`bg-emerald-500`) progress bar.
> - **75% - 99%**: Displayed with an amber (`bg-amber-500`) progress bar and a "Nearing limit" warning.
> - **≥ 100%**: Displayed with a red (`bg-rose-500`) progress bar and a "Limit exceeded!" alert.

---

### Q5: How is Vercel serverless deployment configured for this MERN app?
> **Answer**: 
> 1. `vercel.json` configures build command `npm run vercel-build` which builds the React frontend to `client/dist`.
> 2. `api/index.js` exports the Express `app` instance as a Vercel Serverless Function handler.
> 3. Rewrites route any `/api/*` request to the serverless function, and all other routes (`/*`) to `client/dist/index.html` for React Router SPA navigation.
> 4. `config/db.js` caches `mongoose.connection.readyState` to avoid creating unnecessary database connections per serverless invocation.

---

### Q6: Why did you use Chart.js instead of other charting libraries?
> **Answer**: Chart.js (via `react-chartjs-2`) offers lightweight, hardware-accelerated HTML5 Canvas rendering. It delivers high-performance chart animations without slowing down the DOM, supports flexible custom styling/tooltips matching our dark theme, and handles screen responsiveness cleanly out of the box.

---

### Q7: How do you prevent CORS errors during local development?
> **Answer**: In `client/vite.config.js`, a development proxy is configured under `server.proxy` mapping `/api` to `http://127.0.0.1:5000`. Axios calls use relative paths (`baseURL: '/api'`), allowing the browser to send requests to the same origin (`localhost:5173`), while Vite forwards them behind the scenes to Express.

---

### Q8: What database optimizations are present in the Mongoose models?
> **Answer**: 
> - **Field Trimming & Normalization**: Strings are trimmed of whitespace and categories are converted to lowercase in `Budget` model to prevent duplicate entries.
> - **Enum Restrictions**: Transaction `type` is limited to `'income'` or `'expense'`.
> - **Index Constraints**: `category` in `Budget` has `unique: true` index to optimize search speeds and guarantee uniqueness.

---

### Q9: How would you add Authentication to this project if required?
> **Answer**: 
> 1. Create a `User` model with password hashing via `bcryptjs`.
> 2. Add `/api/auth/signup` and `/api/auth/login` endpoints returning JSON Web Tokens (JWT).
> 3. Add `user` ObjectId reference to `Transaction` and `Budget` schemas.
> 4. Add an authentication middleware in Express to verify JWT `Authorization: Bearer <token>` header on incoming requests and attach `req.user` to scope queries by user.

---

### Q10: How does the application handle responsiveness for mobile devices?
> **Answer**: Tailwind CSS responsive breakpoints (`md:`, `lg:`, `xl:`) are used throughout:
> - **Desktop**: Fixed 64-unit left sidebar (`Sidebar.jsx`) and multi-column grid layouts for summary cards and charts.
> - **Mobile**: Sidebar transforms into a fixed glassmorphism bottom navigation bar with compact icons, grids collapse to single-column layouts, and modal overlays adjust padding for mobile screens.

---

## 8. Setup, Execution & Deployment Guide

### 🚀 Running Locally

#### 1. Backend Server
```bash
cd server
npm install
npm run dev
# Server starts on http://localhost:5000
```

#### 2. Frontend Application
```bash
cd client
npm install
npm run dev
# App opens on http://localhost:5173
```

---

### 🌐 Environment Variables Setup (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense-tracker?appName=Cluster0
```

---

### ☁️ Deploying to Vercel

#### Method 1: GitHub Integration (Recommended)
1. Push project repository to GitHub.
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your repository.
3. Add Environment Variable `MONGO_URI` in Vercel settings.
4. Click **Deploy**.

#### Method 2: Vercel CLI
```bash
npx vercel env add MONGO_URI
npx vercel --prod
```

---

*FinTrack Reference Guide — Created for project presentation, code review & interview readiness.*
