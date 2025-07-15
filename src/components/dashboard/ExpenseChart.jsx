import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const monthlyData = [
  { month: 'Jan', budget: 5000, spent: 4200, income: 6000 },
  { month: 'Feb', budget: 5200, spent: 4800, income: 6200 },
  { month: 'Mar', budget: 4800, spent: 4100, income: 5800 },
  { month: 'Apr', budget: 5500, spent: 5200, income: 6500 },
  { month: 'May', budget: 5000, spent: 4600, income: 6000 },
  { month: 'Jun', budget: 5300, spent: 4900, income: 6300 },
];

const categoryData = [
  { name: 'Food & Dining', value: 1200, color: '#3B82F6' },
  { name: 'Transportation', value: 800, color: '#10B981' },
  { name: 'Shopping', value: 600, color: '#F59E0B' },
  { name: 'Entertainment', value: 400, color: '#EF4444' },
  { name: 'Utilities', value: 300, color: '#8B5CF6' },
  { name: 'Healthcare', value: 250, color: '#06B6D4' },
];

const ExpenseChart = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Trend Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Budget</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Spent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Income</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="budget" fill="#3B82F6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="spent" fill="#EF4444" radius={[2, 2, 0, 0]} />
            <Bar dataKey="income" fill="#10B981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category Breakdown Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Expense Categories</h3>
        <div className="flex items-center">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="ml-6 space-y-3">
            {categoryData.map((category, index) => (
              <div key={category.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
                  <p className="text-xs text-gray-500">${category.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseChart;