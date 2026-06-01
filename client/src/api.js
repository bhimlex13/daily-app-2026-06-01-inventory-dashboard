import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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
