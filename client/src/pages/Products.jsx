import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api';
import { Search, Plus, Filter, Package, Trash2, Edit2 } from 'lucide-react';
import ProductFormModal from '../components/ProductFormModal';
import { useSettings } from '../contexts/SettingsContext';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { formatCurrency, lowStockThreshold } = useSettings();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts({ limit: 50 }); // Fetch top 50 for demo
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await deleteProduct(id);
        if (response.data.success) {
          setProducts(products.filter(p => p._id !== id));
        }
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingProduct) {
        const response = await updateProduct(editingProduct._id, formData);
        if (response.data.success) {
          setProducts(products.map(p => p._id === editingProduct._id ? response.data.data : p));
        }
      } else {
        const response = await createProduct(formData);
        if (response.data.success) {
          setProducts([response.data.data, ...products]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save product', error);
      alert(error.response?.data?.message || 'Failed to save product');
      throw error;
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 flex flex-col h-full min-h-[80vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Products</h1>
          <p className="text-slate-400">Manage your inventory items and stock levels.</p>
        </div>
        <button 
          onClick={handleAddProduct}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-[#1e293b]/40 backdrop-blur-md border border-slate-800/60 rounded-2xl overflow-hidden flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800/60 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/20">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="input-field pl-10 py-2.5 sm:text-sm"
              placeholder="Search by name or SKU..."
            />
          </div>
          <button className="btn-ghost flex items-center gap-2 py-2.5 text-sm">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="data-table min-w-[800px]">
            <thead className="bg-[#1e293b]/90 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th className="!text-right">Price</th>
                <th className="!text-right">Stock</th>
                <th className="!text-center">Status</th>
                <th className="!text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(product => (
                  <tr key={product._id} className="group">
                    <td>
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0"
                          style={{ backgroundColor: product.category?.color || '#334155' }}
                        >
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-400 font-mono text-sm">{product.sku}</td>
                    <td className="text-right text-slate-300 font-medium">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="text-right">
                      <span className="text-slate-200">{product.quantity}</span>
                    </td>
                    <td className="text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        product.status === 'in-stock' ? 'badge-in-stock' :
                        product.status === 'out-of-stock' ? 'badge-out-of-stock' :
                        'badge-low-stock'
                      }`}>
                        {product.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="text-right">
                      <button onClick={() => handleEditProduct(product)} className="inline-flex items-center justify-center text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors mr-2 p-2 rounded-lg hover:bg-indigo-500/10">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="inline-flex items-center justify-center text-slate-400 hover:text-rose-400 text-sm font-medium transition-colors p-2 rounded-lg hover:bg-rose-500/10">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-800/60 flex items-center justify-between text-sm text-slate-400 bg-slate-900/20">
          <div>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Previous
            </button>
            <span className="px-2 font-medium">Page {currentPage} of {Math.max(totalPages, 1)}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit}
        initialData={editingProduct}
      />
    </div>
  );
};

export default Products;
