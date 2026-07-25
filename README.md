# 💰 FinTrack — Expense Tracker & Finance Manager

A full-stack **MERN** expense tracker application with dashboard visualizations, budget management, and monthly summaries.

![FinTrack Banner](https://img.shields.io/badge/FinTrack-Expense%20Tracker-10b981?style=for-the-badge&logo=react&logoColor=white)

---

## ✨ Features

- 📊 **Dashboard** — Overview with total income, expenses, balance summary cards
- 💸 **Transactions** — Add, edit, delete income/expense transactions with categories
- 🎯 **Budgets** — Set monthly spending limits per category with progress bars & warnings
- 📅 **Monthly Summary** — Detailed breakdown of any month's financials with top spending categories
- 📈 **Charts** — Doughnut chart for expense breakdown, bar chart for income vs expenses over time
- 🔍 **Filtering** — Filter transactions by month and type (income/expense)
- 📱 **Responsive** — Desktop sidebar + mobile bottom navigation
- 🎨 **Premium Dark UI** — Glassmorphism, smooth animations, emerald/rose color system

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS 3, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **HTTP Client** | Axios |
| **Validation** | express-validator |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fintrack.git
cd fintrack
```

### 2. Set Up the Backend

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run dev
```

The API will start on `http://localhost:5000`.

### 3. Set Up the Frontend

```bash
cd client
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

### 4. Running Both Concurrently

Open **two terminals** and run:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

> **Tip**: The Vite dev server is configured to proxy `/api` requests to `http://localhost:5000`, so no CORS issues in development.

---

## 🔑 Environment Variables

### Server (`/server/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | — |

### Client

No environment variables required — the Vite proxy handles API routing automatically.

---

## 📁 Project Structure

```
fintrack/
├── client/                    # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js         # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    # Navigation sidebar / mobile bottom nav
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── PieChart.jsx   # Chart.js doughnut chart
│   │   │   ├── BarChart.jsx   # Chart.js bar chart
│   │   │   ├── BudgetCard.jsx # Budget progress card
│   │   │   ├── BudgetForm.jsx
│   │   │   ├── MonthPicker.jsx
│   │   │   └── Toast.jsx      # Notification component
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Budgets.jsx
│   │   │   └── MonthlySummary.jsx
│   │   ├── App.jsx            # Root component with routes
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles (Tailwind)
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── Transaction.js     # Transaction schema
│   │   └── Budget.js          # Budget schema
│   ├── routes/
│   │   ├── transactions.js    # Transaction CRUD
│   │   ├── budgets.js         # Budget CRUD
│   │   └── summary.js         # Monthly aggregation
│   ├── server.js              # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📡 API Endpoints

### Transactions (`/api/transactions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List transactions (filter: `?month=YYYY-MM`, `?type=`, `?category=`) |
| POST | `/` | Create transaction |
| PUT | `/:id` | Update transaction |
| DELETE | `/:id` | Delete transaction |

### Budgets (`/api/budgets`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all budgets |
| POST | `/` | Create/upsert budget |
| PUT | `/:id` | Update budget limit |
| DELETE | `/:id` | Delete budget |

### Summary (`/api/summary`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/?month=YYYY-MM` | Monthly summary with income, expenses, savings, top categories, budget status |

---

## 🎨 Design

- **Theme**: Dark (slate-900 base) with glassmorphism cards
- **Accent Colors**: Emerald (income), Rose (expenses), Amber (warnings)
- **Typography**: Inter (Google Fonts)
- **Effects**: Backdrop blur, gradient accents, staggered slide-up animations
- **Responsive**: Sidebar on desktop, bottom navigation on mobile

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for personal finance management
</p>
