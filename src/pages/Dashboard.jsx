import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardStats from '../components/dashboard/DashboardStats';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SavingsProgressWidget from '../components/dashboard/SavingsProgressWidget';
import AlertsWidget from '../components/dashboard/AlertsWidget';
import { dashboardService } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([
    { label: 'Monthly Savings Goal', target: 1000, current: 0 },
    { label: 'Spending Limit', target: 2000, current: 0 },
  ]);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
        // Example: update goals and alerts based on stats
        setGoals([
          { label: 'Monthly Savings Goal', target: 1000, current: (data.totalIncome - data.totalSpent) },
          { label: 'Spending Limit', target: 2000, current: data.totalSpent },
        ]);
        const newAlerts = [];
        if (data.totalSpent > data.totalBudget) newAlerts.push('You are over your total budget!');
        if (data.budgetUtilization > 0.8) newAlerts.push('You have used over 80% of your budget.');
        setAlerts(newAlerts);
        // Show toast for each alert
        newAlerts.forEach(alert => toast.error(alert));
      } catch (err) {
        setError(err.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {loading && <div className="text-center text-gray-500">Loading dashboard...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {!loading && !error && stats && (
        <>
          {/* Stats Row */}
          <div className="mb-6">
            <DashboardStats stats={stats} />
          </div>

          {/* Goals & Alerts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SavingsProgressWidget goals={goals} />
            <AlertsWidget alerts={alerts} />
          </div>

          {/* Chart Row */}
          <div className="mb-6">
            <ExpenseChart stats={stats} />
          </div>

          {/* Transactions & Quick Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentTransactions transactions={stats.recentTransactions} onViewAll={() => navigate('/transactions')} />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full flex flex-col"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3 flex-1">
                {[
                  { title: 'Add Expense', color: 'bg-red-50 text-red-600 hover:bg-red-100', action: () => navigate('/expenses') },
                  { title: 'Create Budget', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100', action: () => navigate('/budgets') },
                  { title: 'Generate Report', color: 'bg-green-50 text-green-600 hover:bg-green-100', action: () => navigate('/reports') },
                  { title: 'Import Data', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100', action: () => alert('Import feature coming soon!') },
                ].map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-lg text-left font-medium transition-colors ${action.color}`}
                    onClick={action.action}
                  >
                    {action.title}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Dashboard;