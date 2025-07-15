import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardStats from '../components/dashboard/DashboardStats';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { dashboardService } from '../services/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
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
          <DashboardStats stats={stats} />
          <ExpenseChart stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentTransactions transactions={stats.recentTransactions} />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { title: 'Add Expense', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
                  { title: 'Create Budget', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
                  { title: 'Generate Report', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
                  { title: 'Import Data', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
                ].map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-lg text-left font-medium transition-colors ${action.color}`}
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