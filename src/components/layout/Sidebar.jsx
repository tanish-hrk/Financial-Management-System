import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Receipt, 
  BarChart3, 
  Settings, 
  CreditCard,
  Target,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Budgets', href: '/budgets', icon: Target },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col"
    >
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">FinanceHub</h2>
            <p className="text-xs text-gray-500">Manage your finances</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Pro Features</h3>
              <p className="text-xs text-gray-500">Upgrade for advanced analytics</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-3 bg-blue-600 text-white text-xs font-medium py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Upgrade Now
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;