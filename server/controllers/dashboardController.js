const connectDB = require('../db');
const { ObjectId } = require('mongodb');

exports.getStats = async (req, res) => {
  const db = await connectDB();
  const userId = new ObjectId(req.user.id);

  // Budgets
  const budgets = await db.collection('budgets').find({ user_id: req.user.id }).toArray();
  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);

  // Expenses
  const expenses = await db.collection('expenses').find({ user_id: req.user.id }).toArray();
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Income (from transactions)
  const incomeAgg = await db.collection('transactions').aggregate([
    { $match: { user_id: req.user.id, type: 'income' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]).toArray();
  const totalIncome = incomeAgg[0]?.total || 0;

  // Budget Utilization
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) : 0;

  // Monthly Trend (last 6 months)
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyTrend = await db.collection('transactions').aggregate([
    { $match: { user_id: req.user.id, date: { $gte: sixMonthsAgo.toISOString() } } },
    { $addFields: {
      year: { $year: { $toDate: '$date' } },
      month: { $month: { $toDate: '$date' } }
    }},
    { $group: {
      _id: { year: '$year', month: '$month', type: '$type' },
      total: { $sum: '$amount' }
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]).toArray();

  // Category Breakdown (expenses)
  const categoryBreakdown = await db.collection('expenses').aggregate([
    { $match: { user_id: req.user.id } },
    { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    { $sort: { spent: -1 } }
  ]).toArray();

  // Recent Transactions
  const recentTransactions = await db.collection('transactions')
    .find({ user_id: req.user.id })
    .sort({ date: -1 })
    .limit(5)
    .toArray();

  res.json({
    totalBudget,
    totalSpent,
    totalIncome,
    budgetUtilization,
    monthlyTrend,
    categoryBreakdown,
    recentTransactions
  });
}; 