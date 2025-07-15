import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import Expenses from './pages/Expenses';
import Login from './pages/Login';
import Register from './pages/Register';

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="transactions" element={<div className="p-6">Transactions Page (Coming Soon)</div>} />
            <Route path="reports" element={<div className="p-6">Reports Page (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-6">Settings Page (Coming Soon)</div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;