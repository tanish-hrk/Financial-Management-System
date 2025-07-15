import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Target, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, changeType, icon, color }) => {
  const changeIcon = changeType === 'positive' ? TrendingUp : changeType === 'negative' ? TrendingDown : null;
  const changeColor = changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${changeColor}`}>
              {changeIcon && <changeIcon className="h-4 w-4 mr-1" />}
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Budget',
      value: '$12,450',
      change: '+8.2% from last month',
      changeType: 'positive',
      icon: <Target className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Total Spent',
      value: '$8,325',
      change: '+12.5% from last month',
      changeType: 'negative',
      icon: <CreditCard className="h-6 w-6 text-red-600" />,
      color: 'bg-red-50',
    },
    {
      title: 'Available Budget',
      value: '$4,125',
      change: '+4.2% from last month',
      changeType: 'positive',
      icon: <Wallet className="h-6 w-6 text-green-600" />,
      color: 'bg-green-50',
    },
    {
      title: 'Monthly Income',
      value: '$15,750',
      change: '+2.8% from last month',
      changeType: 'positive',
      icon: <DollarSign className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;