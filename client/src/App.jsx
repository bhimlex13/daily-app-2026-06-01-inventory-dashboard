import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import POS from './pages/POS';

import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Settings from './pages/Settings';

const App = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="pos" element={<POS />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
