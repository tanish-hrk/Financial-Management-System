const API_URL = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const budgetService = {
  async getBudgets() {
    const res = await fetch(`${API_URL}/budgets`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!res.ok) throw new Error('Failed to fetch budgets');
    return await res.json();
  },

  async createBudget(budget) {
    const res = await fetch(`${API_URL}/budgets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(budget),
    });
    if (!res.ok) throw new Error('Failed to create budget');
    return await res.json();
  },

  async updateBudget(id, updates) {
    const res = await fetch(`${API_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update budget');
    return await res.json();
  },

  async deleteBudget(id) {
    const res = await fetch(`${API_URL}/budgets/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!res.ok) throw new Error('Failed to delete budget');
    return true;
  },
};

// You can add similar services for expenses, transactions, etc.

export const expenseService = {
  async getExpenses() {
    try {
      const res = await fetch(`${API_URL}/expenses`, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch expenses');
      return await res.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch expenses');
    }
  },

  async createExpense(expense) {
    try {
      const res = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(expense),
      });
      if (!res.ok) throw new Error('Failed to create expense');
      return await res.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to create expense');
    }
  },

  async updateExpense(id, updates) {
    try {
      const res = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update expense');
      return await res.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to update expense');
    }
  },

  async deleteExpense(id) {
    try {
      const res = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error('Failed to delete expense');
      return true;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete expense');
    }
  }
};

export const dashboardService = {
  async getDashboardStats() {
    try {
      const res = await fetch(`${API_URL}/dashboard/stats`, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return await res.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalBudget: 0,
        totalSpent: 0,
        totalIncome: 0,
        budgetUtilization: 0,
        monthlyTrend: [],
        categoryBreakdown: [],
        recentTransactions: []
      };
    }
  }
};

export const transactionService = {
  async getTransactions() {
    const res = await fetch(`${API_URL}/transactions`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },
  async createTransaction(data) {
    const res = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return res.json();
  },
  async updateTransaction(id, data) {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update transaction');
    return res.json();
  },
  async deleteTransaction(id) {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
    return res.json();
  },
};