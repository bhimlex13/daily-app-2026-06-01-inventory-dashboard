import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { fetchCategories } from '../api';

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
    minStock: 10,
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          sku: initialData.sku || '',
          category: initialData.category?._id || initialData.category || '',
          price: initialData.price || '',
          quantity: initialData.quantity || '',
          minStock: initialData.minStock || 10,
          description: initialData.description || ''
        });
        setImagePreview(initialData.image ? `http://localhost:5000${initialData.image}` : '');
        setImageFile(null);
      } else {
        setFormData({
          name: '',
          sku: '',
          category: '',
          price: '',
          quantity: '',
          minStock: 10,
          description: ''
        });
        setImagePreview('');
        setImageFile(null);
      }
    }
  }, [isOpen, initialData]);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('sku', formData.sku);
    payload.append('category', formData.category);
    payload.append('price', parseFloat(formData.price));
    payload.append('quantity', parseInt(formData.quantity, 10));
    payload.append('minStock', parseInt(formData.minStock, 10));
    payload.append('description', formData.description);
    
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      await onSubmit(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0 transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-[#1e293b] border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in glass-card">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-100">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Wireless Keyboard"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">SKU *</label>
              <input
                type="text"
                name="sku"
                required
                value={formData.sku}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. ELEC-005"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Price ($) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Current Stock *</label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="input-field"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Minimum Stock Level</label>
              <input
                type="number"
                name="minStock"
                required
                min="0"
                value={formData.minStock}
                onChange={handleChange}
                className="input-field"
                placeholder="10"
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-slate-400">Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Brief product description..."
              ></textarea>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-slate-400">Product Image</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-700/60 flex items-center justify-center bg-slate-900/20 overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={24} className="text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer btn-ghost inline-flex items-center gap-2">
                    <Upload size={16} />
                    Choose Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <p className="text-xs text-slate-500 mt-2">JPEG, PNG or WebP up to 5MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary min-w-[120px]">
              {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
