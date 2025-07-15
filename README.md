# Financial Management System

A modern, full-stack web application for managing personal and business finances. This system allows users to track budgets, manage expenses, and gain insights into their financial health with an intuitive dashboard and robust backend.

---

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication.
- **Dashboard**: Visual overview of budgets, expenses, and recent transactions.
- **Budget Management**: Create, edit, and delete budgets by category and period (monthly/yearly).
- **Expense Tracking**: Add, edit, delete, and filter expenses by category, status, and date.
- **Recent Transactions**: View a list of recent financial activities.
- **Responsive UI**: Clean, modern interface built with React and Tailwind CSS.
- **API-first**: RESTful backend with Express and MongoDB.

---

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Framer Motion
- React Hook Form & Yup (validation)
- Recharts (charts)

**Backend:**
- Node.js & Express
- MongoDB
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

---

## Folder Structure

```
Financial-Management-System/
├── server/                # Backend (Express, MongoDB)
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── db.js              # MongoDB connection
│   └── index.js           # Server entry point
├── src/                   # Frontend (React)
│   ├── components/        # UI components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utility libraries
│   ├── pages/             # App pages (Dashboard, Budgets, Expenses, etc.)
│   ├── services/          # API service layer
│   └── main.jsx           # Frontend entry point
├── index.html             # App HTML
├── package.json           # Frontend dependencies
└── README.md              # Project documentation
```

---

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### 1. Clone the repository
```bash
git clone <repo-url>
cd Financial-Management-System
```

### 2. Install dependencies
#### Frontend
```bash
npm install
```
#### Backend
```bash
cd server
npm install
```

### 3. Environment Variables
Create a `.env` file in the `server/` directory:
```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
PORT=5000
```

### 4. Run the application
#### Start the backend server
```bash
cd server
npm start
```
#### Start the frontend (in a new terminal)
```bash
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:5000](http://localhost:5000).

---

## Usage
- Register a new account or log in.
- Create budgets for different categories and periods.
- Add, edit, and delete expenses.
- View dashboard stats, charts, and recent transactions.
- All data is securely stored in MongoDB and scoped to your user account.

---

## API Endpoints (Summary)

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Budgets (protected)
- `GET /api/budgets` — List all budgets
- `POST /api/budgets` — Create a new budget
- `PUT /api/budgets/:id` — Update a budget
- `DELETE /api/budgets/:id` — Delete a budget

### Expenses (protected)
- `GET /api/expenses` — List all expenses
- `POST /api/expenses` — Create a new expense
- `PUT /api/expenses/:id` — Update an expense
- `DELETE /api/expenses/:id` — Delete an expense





