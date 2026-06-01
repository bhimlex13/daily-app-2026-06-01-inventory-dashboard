import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../api';
import { Search, Plus, Trash2, Edit2, Tags, Package } from 'lucide-react';
import CategoryFormModal from '../components/CategoryFormModal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetchCategories();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Products within it may lose their grouping.')) {
      try {
        const response = await deleteCategory(id);
        if (response.data.success) {
          setCategories(categories.filter(c => c._id !== id));
        }
      } catch (error) {
        console.error('Failed to delete category', error);
        alert(error.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingCategory) {
        const response = await updateCategory(editingCategory._id, formData);
        if (response.data.success) {
          setCategories(categories.map(c => c._id === editingCategory._id ? response.data.data : c));
        }
      } else {
        const response = await createCategory(formData);
        if (response.data.success) {
          setCategories([...categories, response.data.data]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save category', error);
      alert(error.response?.data?.message || 'Failed to save category');
      throw error;
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col h-full min-h-[80vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Categories</h1>
          <p className="text-slate-400">Manage product categories and organizational tags.</p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="bg-[#1e293b] border border-slate-800/60 rounded-2xl overflow-hidden flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800/60 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/20">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 py-2.5 sm:text-sm"
              placeholder="Search categories by name..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center">
              <Tags size={48} className="opacity-20 mb-4" />
              <p>No categories found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map(category => (
                <div key={category._id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/60 transition-colors group relative">
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0"
                        style={{ backgroundColor: category.color || '#334155' }}
                      >
                        <Package size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-100">{category.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{category.productCount || 0} products associated</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-6 line-clamp-2 h-10">
                    {category.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                    <button 
                      onClick={() => handleEditCategory(category)} 
                      className="flex-1 btn-ghost py-2 flex items-center justify-center gap-2 text-xs"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category._id)} 
                      className="flex-1 btn-ghost py-2 text-rose-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 flex items-center justify-center gap-2 text-xs"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <CategoryFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit}
        initialData={editingCategory}
      />
    </div>
  );
};

export default Categories;
