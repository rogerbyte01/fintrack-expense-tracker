# FinTrack — Complete Project Reference & Documentation

This document covers the complete technical specifications, architecture design, database schemas, step-by-step implementation, business impact, and interview preparation questions for the FinTrack Expense Tracker application.

---

## Table of Contents
1. [Project Overview & Purpose](#1-project-overview--purpose)
2. [Tech Stack & Selection Rationale](#2-tech-stack--selection-rationale)
3. [System Architecture & Data Flow](#3-system-architecture--data-flow)
4. [Database Schemas & Models](#4-database-schemas--models)
5. [Backend API Specifications](#5-backend-api-specifications)
6. [Frontend UI & Design System](#6-frontend-ui--design-system)
7. [Step-by-Step Implementation (How it was built)](#7-step-by-step-implementation-how-it-was-built)
8. [Impact, Effects & Outcomes of having the App](#8-impact-effects--outcomes-of-having-the-app)
9. [Interview & Viva Questions & Answers](#9-interview--viva-questions--answers)
10. [Local Execution & Vercel Deployment](#10-local-execution--vercel-deployment)

---

## 1. Project Overview & Purpose

Managing personal finances is a common challenge due to manual tracking friction and a lack of real-time visual feedback on spending behaviors.

**FinTrack** is a personal finance tracker that simplifies money management by allowing users to log transaction details (income and expenses), set category budget limits, visualize their spending, and receive instant alerts when they approach or exceed their limits.

### Core Goals
- **Real-Time Visibility**: Summary cards showing income, expenses, and net balance.
- **Spending Analytics**: Categorized doughnut charts and 6-month historical bar charts.
- **Budgeting Boundaries**: Visual progress bars mapping spent amounts against limits with alerts.
- **Monthly Audits**: Breakdown of monthly income, expenses, savings, and top 5 categories.

---

## 2. Tech Stack & Selection Rationale

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18 | Declarative component architecture; updates only changed DOM elements for fast performance. |
| **Tooling** | Vite | Faster hot module replacement (HMR) and smaller build bundle sizes than Create React App. |
| **Styling** | Tailwind CSS 3 | Utility-first CSS classes; easy custom responsive layouts without writing separate stylesheets. |
| **Charts** | Chart.js / react-chartjs-2 | Uses HTML5 Canvas for smooth chart rendering and animations. |
| **Routing** | React Router DOM v6 | Handles URL state changes inside the browser without reloading the page. |
| **HTTP Client** | Axios | Simpler syntax than Fetch; handles response interceptors to catch connection errors. |
| **Backend** | Node.js + Express.js | Event-driven, non-blocking model suitable for handling concurrent API traffic. |
| **Database** | MongoDB + Mongoose | Schema-less NoSQL database; Mongoose adds validation, structure, and query helpers. |
| **Validation** | express-validator | Validates request parameters and body contents before storing in the database. |
| **Hosting** | Vercel | Scalable platform that deploys the React client and hosts the Express API as Serverless Functions. |

---

## 3. System Architecture & Data Flow

```
+-------------------------------------------------------------+
|                     Client (Vite React SPA)                 |
|   - App.jsx Layout                                          |
|   - Pages (Dashboard, Transactions, Budgets, Summary)     |
|   - Charts (PieChart, BarChart) & Components               |
+-------------------------------------------------------------+
                                │
                                │ Axios Requests (/api/*)
                                ▼
+-------------------------------------------------------------+
|                 API Routing & Dev Proxy                     |
|   - Development: Vite server proxies /api to Port 5000       |
|   - Production: Vercel routes /api to serverless functions  |
+-------------------------------------------------------------+
                                │
                                ▼
+-------------------------------------------------------------+
|                 Express.js Backend Server                   |
|   - server.js entry point                                   |
|   - express-validator checks request parameters             |
|   - Routes: transactions.js, budgets.js, summary.js         |
+-------------------------------------------------------------+
                                │
                                ▼
+-------------------------------------------------------------+
|                    Database & Data Access                   |
|   - Mongoose Schemas (Transaction, Budget)                  |
|   - MongoDB Atlas Cloud instance                            |
+-------------------------------------------------------------+
```

---

## 4. Database Schemas & Models

The database models are designed to enforce data integrity while keeping data structures lightweight.

### 4.1 Transaction Schema (`server/models/Transaction.js`)
Stores all financial transactions:

- `title`: String (required, trimmed, max 100 characters)
- `amount`: Number (required, minimum 0.01)
- `category`: String (required, trimmed)
- `date`: Date (required, defaults to current date)
- `type`: String (enum: `['income', 'expense']`, required)

*Mongoose automatic timestamps (`timestamps: true`) record `createdAt` and `updatedAt`.*

### 4.2 Budget Schema (`server/models/Budget.js`)
Stores monthly limits for expense categories:

- `category`: String (required, unique, normalized to lowercase via a Mongoose setter)
- `monthlyLimit`: Number (required, minimum 1)

*Storing categories in lowercase avoids duplication (e.g. "Food" and "food" map to the same limit).*

---

## 5. Backend API Specifications

### 5.1 Transactions endpoint (`/api/transactions`)
- **GET /** — Retrieve transactions. Supports query parameters:
  - `?month=YYYY-MM` (e.g. `2026-07`)
  - `?type=expense` (or `income`)
  - `?category=Food`
- **POST /** — Add a new transaction (runs validators for required fields and value ranges).
- **PUT /:id** — Update a transaction by ID.
- **DELETE /:id** — Delete a transaction by ID.

### 5.2 Budgets endpoint (`/api/budgets`)
- **GET /** — Retrieve all budget limits.
- **POST /** — Create or update a budget limit (upsert pattern based on category name).
- **PUT /:id** — Edit a budget limit by ID.
- **DELETE /:id** — Remove a budget by ID.

### 5.3 Summary endpoint (`/api/summary`)
- **GET /?month=YYYY-MM** — Returns monthly totals using MongoDB Aggregation Pipelines:
  - Group by `type` (`income` or `expense`) and sum the amounts.
  - Group by `category`, sort descending, and return the top 5 expense categories.
  - Fetch budgets and match with actual category spending for the selected month to show budget usage.

---

## 6. Frontend UI & Design System

The application uses a **Clean Light Mode** theme built with Tailwind CSS:

- **Primary Colors**: Indigo accent (`bg-indigo-600` / `text-indigo-600`) for primary actions and active states. Slate gray (`bg-slate-50` / `text-slate-800`) for background and text.
- **Alert Colors**: Emerald for income, Rose for expenses/over-budget warning, Amber for nearing-budget warning.
- **Visual Elements**: Clean grid lines, custom SVG icons, and a card design with thin borders (`border-slate-200/70`).
- **Responsive Layout**:
  - **Desktop**: Left navigation sidebar.
  - **Mobile**: Floating bottom navigation bar.

---

## 7. Step-by-Step Implementation (How it was built)

### Milestone 1: Environment Setup
- Initialized Node project in `server/` and installed dependencies (`express`, `mongoose`, `cors`, `dotenv`, `express-validator`).
- Set up a Vite project in `client/` and installed `axios`, `react-router-dom`, `chart.js`, and `react-chartjs-2`.
- Configured Tailwind CSS in the frontend.

### Milestone 2: Backend Models & REST API
- Designed schemas for Transactions and Budgets with field validators.
- Built CRUD routes for transactions and budgets.
- Wrote MongoDB aggregation pipelines in `/api/summary` to group monthly values.
- Wrote connection pooling logic in `config/db.js` to cache connections for serverless execution.

### Milestone 3: React Routing & Global Styles
- Configured client routes (`/`, `/transactions`, `/budgets`, `/summary`) in `App.jsx`.
- Developed `Sidebar` component supporting responsive desktop-sidebar and mobile-bottom-nav states using custom SVGs.
- Established global custom styling classes (light theme cards, animations, inputs, buttons) in `index.css`.

### Milestone 4: Page Construction & Integration
- Developed `Dashboard.jsx`, embedding `SummaryCards`, `PieChart`, and `BarChart` powered by aggregated data.
- Built `Transactions.jsx` showing filtering tabs and transactional listing with full add/edit/delete modals.
- Created `Budgets.jsx` displaying progress bars and threshold limits based on current-month spending.
- Completed `MonthlySummary.jsx` aggregating the financial month and ranking top expense categories.

### Milestone 5: Git & Deployment Pipeline
- Initialized Git, verified files in `.gitignore`, and made 12 commits representing natural progress stages.
- Linked to GitHub and set up Vercel deployment with serverless routing rules in `vercel.json` and a monorepo build script.

---

## 8. Impact, Effects & Outcomes of having the App

Building and using this application leads to several key outcomes:

### 8.1 Cognitive & Behavioral Effects
- **Reduces Tracking Friction**: Clean, simple modals make logging transactions quick and easy.
- **Increases Budget Awareness**: Real-time progress bars visually warn users before they overspend, acting as a soft constraint on impulse buying.
- **Visualizes Financial Trends**: Doughnut and bar charts help users identify which categories consume the largest portions of their income over time.

### 8.2 Technical Outcomes
- **Serverless Scaling**: The Express API runs on Vercel's serverless infrastructure, scaling down to zero when idle to minimize resource usage.
- **Data Integrity**: Enforces strict database rules, preventing duplicate categories and invalid positive numbers on both the client and server.
- **High Portability**: The app can run locally with a single command or deploy globally on Vercel with automatic builds triggered by GitHub commits.

---

## 9. Interview & Viva Questions & Answers

### Q1: What is the overall architecture of this project?
> **Answer**: It is a MERN stack web application. The frontend is a React 18 single-page application (SPA) built using Vite and styled with Tailwind CSS. The backend is a REST API built with Node.js and Express.js, using Mongoose ODM to read and write documents in a MongoDB Atlas database.

### Q2: Why did you use MongoDB instead of a relational database like MySQL?
> **Answer**: MongoDB's document model matches JavaScript object notation, which speeds up development in a full-stack JS environment. Transactions and budgets are structured as documents, making NoSQL a good fit for this application's requirements.

### Q3: How is data aggregated for the monthly summary page?
> **Answer**: The backend uses Mongoose aggregation pipelines. It filters transactions using `$match` for the selected month, groups them by type (`income`/`expense`) using `$group` to calculate totals with `$sum`, and sorts the category aggregates descending with `$sort` and `$limit` to identify the top 5 spending categories.

### Q4: How does the application prevent duplicate budget categories?
> **Answer**: The `Budget` schema defines the `category` field with a `unique: true` constraint. Additionally, it uses a custom Mongoose setter (`set: v => v.toLowerCase()`) to convert all entries to lowercase. When creating a budget, the `/api/budgets` endpoint uses an upsert logic (`findOne` and update), ensuring only one budget limit exists per category.

### Q5: How do the budget warning states work in the UI?
> **Answer**: The app calculates the percentage spent as `(spent / monthlyLimit) * 100`. In the `BudgetCard` component:
> - **Under 75%**: Renders a green progress bar (`bg-emerald-500`).
> - **75% to 99%**: Renders an amber progress bar (`bg-amber-500`) with a warning message.
> - **100% and above**: Renders a red progress bar (`bg-rose-500`) with an over-limit warning.

### Q6: How did you configure Vercel to host both the React frontend and Express API?
> **Answer**: I set up a monorepo build script in the root `package.json` that installs dependencies and builds the React app into `client/dist`. The `vercel.json` file routes all `/api/*` requests to the `api/index.js` file (which exports the Express server), while routing other requests to `index.html` for client-side routing.

### Q7: Why is Mongoose connection caching important in serverless deployments?
> **Answer**: In a serverless environment like Vercel, API endpoints run in containerized functions that spin up on demand. If Mongoose connected on every request, it would quickly hit MongoDB's connection limit and slow down response times. Caching the connection (`mongoose.connection.readyState === 1`) avoids reconnecting during warm container runs.

### Q8: How did you handle CORS issues between the frontend and backend in development?
> **Answer**: I used Vite's dev server proxy option. In `vite.config.js`, any request starting with `/api` is proxied to `http://127.0.0.1:5000`. This allows the browser to send API requests to the same origin (`localhost:5173`) in development, avoiding CORS policy blocks.

### Q9: How does the app handle empty state scenarios?
> **Answer**: The database connection config (`server/config/db.js`) check for empty collections. If `Transaction.countDocuments()` is zero, it automatically seeds initial sample data. In the UI, components like `TransactionList` and `Budgets` display fallback vector SVG empty-state messages when no data is returned.

### Q10: What security and validation checks are implemented?
> **Answer**: We validate fields using `express-validator` in the backend. It sanitizes inputs (trimming whitespace) and validates data types (positive float numbers for amounts, ISO 8601 strings for dates, strict category text). This prevents database errors from invalid inputs.

---

## 10. Local Execution & Vercel Deployment

### Local Setup
1. **Clone & Setup**:
   ```bash
   git clone https://github.com/rogerbyte01/fintrack-expense-tracker.git
   ```
2. **Environment Variables**: Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expense-tracker
   ```
3. **Run Dev Servers**:
   - Backend: In `server/`, run `npm run dev`.
   - Frontend: In `client/`, run `npm run dev`.

### Vercel Deployment
1. Import the repository on Vercel.
2. Select **Other** as the framework preset.
3. Configure build command as `npm run vercel-build` and output directory as `client/dist`.
4. Add the `MONGO_URI` environment variable in Vercel settings and deploy.
