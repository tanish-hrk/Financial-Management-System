import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Receipt, 
  BarChart3, 
  Settings, 
  CreditCard,
  Target,
  FileText,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Base API URL from environment (Vite) with local fallback
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Budgets', href: '/budgets', icon: Target },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const [profile, setProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) return;
  const res = await fetch(`${BASE_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    }
    fetchProfile();
  }, []);

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

      {/* User Profile Card */}
      <div
        className="p-4 border-t border-gray-200 flex items-center space-x-3 mt-auto cursor-pointer hover:bg-blue-50 transition"
        onClick={() => profile && navigate('/profile')}
        title="View Profile"
      >
        {profile ? (
          <>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
              {profile.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{profile.full_name}</div>
              <div className="text-xs text-gray-500 truncate">{profile.email}</div>
            </div>
          </>
        ) : (
          <div className="text-xs text-gray-400">Not logged in</div>
        )}
      </div>
      {/* Logout Button */}
      {profile && (
        <button
          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          Logout
        </button>
      )}

      {/* Profile Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowEdit(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Profile</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const full_name = form.full_name.value;
                const email = form.email.value;
                try {
                  const res = await fetch(`${BASE_API_URL}/users/me`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ full_name, email }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || 'Failed to update profile');
                  setProfile(data);
                  toast.success('Profile updated!');
                  setShowEdit(false);
                } catch (err) {
                  toast.error(err.message || 'Failed to update profile');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  name="full_name"
                  defaultValue={profile.full_name}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={profile.email}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
              >
                Save Changes
              </button>
            </form>
            <div className="border-t my-4"></div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const oldPassword = form.oldPassword.value;
                const newPassword = form.newPassword.value;
                try {
                  const res = await fetch(`${BASE_API_URL}/users/me/password`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ oldPassword, newPassword }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || 'Failed to change password');
                  toast.success('Password changed!');
                  form.reset();
                } catch (err) {
                  toast.error(err.message || 'Failed to change password');
                }
              }}
              className="space-y-4"
            >
              <div className="font-semibold text-lg mb-2">Change Password</div>
              <div>
                <label className="block text-sm font-medium mb-1">Old Password</label>
                <input
                  name="oldPassword"
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;