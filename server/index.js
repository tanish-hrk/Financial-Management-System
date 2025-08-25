require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budgets');
const expenseRoutes = require('./routes/expenses');
const transactionRoutes = require('./routes/transactions');
const reportRoutes = require('./routes/reports');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// CORS configuration: allow specific origins (frontend on Vercel and local dev)
const allowedOriginsEnv = process.env.CORS_ORIGINS || '';
const allowedOrigins = allowedOriginsEnv
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);

const defaultAllowed = [
	'http://localhost:5173',
	'https://localhost:5173',
	// Deployed frontend (adjust or add more as needed)
	'https://fms-xi.vercel.app',
];

const corsOptions = {
	origin: function (origin, callback) {
		// Allow non-browser or same-origin requests with no origin header
		if (!origin) return callback(null, true);
		const list = allowedOrigins.length ? allowedOrigins : defaultAllowed;
		if (list.includes(origin) || /\.vercel\.app$/.test(origin)) {
			return callback(null, true);
		}
		return callback(new Error('Not allowed by CORS'));
	},
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: false,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
