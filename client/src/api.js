import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Products
export const fetchProducts = (params) => api.get('/products', { params });
export const fetchProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
});
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
});
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Dashboard
export const fetchDashboard = () => api.get('/products/dashboard');

// Categories
export const fetchCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Transactions
export const fetchTransactions = () => api.get('/transactions');
export const createTransaction = (data) => api.post('/transactions', data);

export default api;
