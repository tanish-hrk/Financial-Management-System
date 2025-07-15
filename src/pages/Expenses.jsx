import React, { useEffect, useState } from 'react';
import { Plus, Filter, Download, Search, Calendar, Tag, Edit, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { expenseService } from '../services/api.js';
import toast from 'react-hot-toast';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    date: '',
    status: 'pending',
  });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);
      setError(null);
      try {
        const data = await expenseService.getExpenses();
        setExpenses(data);
      } catch (err) {
        setError(err.message || 'Failed to load expenses');
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editId) {
        const updated = await expenseService.updateExpense(editId, {
          ...form,
          amount: Number(form.amount),
        });
        setExpenses(expenses.map(exp => (exp.id === editId || exp._id === editId ? updated : exp)));
        toast.success('Expense updated!');
      } else {
        const newExpense = await expenseService.createExpense({
          ...form,
          amount: Number(form.amount),
        });
        setExpenses([newExpense, ...expenses]);
        toast.success('Expense created!');
      }
      setShowForm(false);
      setEditId(null);
      setForm({ title: '', description: '', amount: '', category: '', date: '', status: 'pending' });
    } catch (err) {
      toast.error(err.message || 'Failed to save expense');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditId(expense.id || expense._id);
    setForm({
      title: expense.title,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date ? expense.date.slice(0, 10) : '',
      status: expense.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await expenseService.deleteExpense(id);
      setExpenses(expenses.filter(exp => (exp.id || exp._id) !== id));
      setDeleteId(null);
      toast.success('Expense deleted!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete expense');
    } finally {
      setDeleteLoading(false);
    }
  };

  const categories = ['All', 'Food & Dining', 'Transportation', 'Office', 'Meals & Entertainment', 'Software'];
  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-blue-100 text-blue-800',
      'Transportation': 'bg-green-100 text-green-800',
      'Office': 'bg-purple-100 text-purple-800',
      'Meals & Entertainment': 'bg-pink-100 text-pink-800',
      'Software': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Optionally filter expenses by search/category/status
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category?.toLowerCase() === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || expense.status?.toLowerCase() === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">Track and manage your business expenses</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            onClick={() => setShowForm((v) => !v)}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            onClick={() => {
              setShowForm((v) => !v);
              setEditId(null);
              setForm({ title: '', description: '', amount: '', category: '', date: '', status: 'pending' });
            }}
          >
            <Plus className="h-4 w-4" />
            <span>{editId ? 'Cancel Edit' : 'Add Expense'}</span>
          </motion.button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4 max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-lg">{editId ? 'Edit Expense' : 'New Expense'}</span>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setShowForm(false); setForm({ title: '', description: '', amount: '', category: '', date: '', status: 'pending' }); }} className="text-gray-400 hover:text-gray-700"><X /></button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input name="description" value={form.description} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input name="amount" type="number" value={form.amount} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input name="category" value={form.category} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input name="date" type="date" value={form.date} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button type="submit" disabled={formLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {formLoading ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save Changes' : 'Add Expense')}
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {statuses.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {loading && <div className="text-center text-gray-500">Loading expenses...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Expense List */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredExpenses.length === 0 && (
              <div className="p-6 text-center text-gray-500">No expenses found.</div>
            )}
            {filteredExpenses.map((expense, index) => {
              const id = expense.id || expense._id;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{expense.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                        <button onClick={() => handleEdit(expense)} className="p-2 rounded hover:bg-blue-100 text-blue-600"><Edit size={16} /></button>
                        <button onClick={() => setDeleteId(id)} className="p-2 rounded hover:bg-red-100 text-red-600"><Trash2 size={16} /></button>
                      </div>
                      <p className="text-sm text-gray-600">{expense.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                        {expense.receipt && (
                          <span className="text-green-600">✓ Receipt attached</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600">-${expense.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  {/* Delete confirmation dialog */}
                  {deleteId === id && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded p-4 flex items-center justify-between">
                      <span>Are you sure you want to delete this expense?</span>
                      <div className="space-x-2">
                        <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded bg-gray-200 text-gray-700">Cancel</button>
                        <button onClick={() => handleDelete(id)} disabled={deleteLoading} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                          {deleteLoading ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Expenses;