import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#6366f1',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        color: initialData.color || '#6366f1',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        color: '#6366f1',
        description: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 modal-overlay" onClick={onClose}></div>
      <div className="glass-card w-full max-w-md relative z-10 overflow-hidden animate-fade-in shadow-2xl shadow-indigo-900/20">
        
        <div className="p-6 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">
            {initialData ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field py-2.5"
                  required
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Color</label>
                <div className="h-11 rounded-lg border border-slate-700 overflow-hidden relative cursor-pointer">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field py-2.5 resize-none h-24"
              ></textarea>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800/60 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-ghost py-2.5"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary py-2.5 shadow-lg shadow-indigo-500/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (initialData ? 'Update Category' : 'Create Category')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryFormModal;
