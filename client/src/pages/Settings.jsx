import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Download, Monitor, Moon, Sun, DollarSign, Settings as SettingsIcon, Package } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
  const { theme, setTheme, currency, setCurrency, lowStockThreshold, setLowStockThreshold } = useSettings();

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get('/api/products');
      if (response.data.success) {
        const products = response.data.data;
        const headers = ['Name', 'SKU', 'Category', 'Price', 'Quantity', 'Status'];
        const csvRows = [headers.join(',')];

        products.forEach(p => {
          const status = p.quantity === 0 ? 'Out of Stock' : (p.quantity <= p.minStock ? 'Low Stock' : 'In Stock');
          const row = [
            `"${p.name}"`,
            p.sku,
            p.category?.name || 'Uncategorized',
            p.price,
            p.quantity,
            status
          ];
          csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
        a.click();
      }
    } catch (error) {
      console.error('Failed to export CSV', error);
      alert('Failed to export data');
    }
  };

  return (
    <div className="animate-fade-in p-2 sm:p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl border border-indigo-500/20">
          <SettingsIcon className="text-indigo-400" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Global Settings</h1>
          <p className="text-slate-400 text-sm">Manage application preferences and data exports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        
        {/* Appearance Settings */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Monitor size={18} className="text-indigo-400" />
            Appearance
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Theme</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    theme === 'light' 
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-[inset_0_0_15px_rgba(99,102,241,0.1)]' 
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <Sun size={18} />
                  Classic Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    theme === 'dark' 
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-[inset_0_0_15px_rgba(99,102,241,0.1)]' 
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <Moon size={18} />
                  Futuristic Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Regional & Financial */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-400" />
            Regional & Financial
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Currency Display</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field w-full cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center] bg-[size:16px]"
              >
                <option value="PHP">Philippine Peso (₱)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Preferences */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Package size={18} className="text-rose-400" />
            Inventory Rules
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Global Low Stock Threshold</label>
              <p className="text-xs text-slate-500 mb-3">Items dropping below this quantity will trigger a global alert if they don't have a specific minimum stock set.</p>
              <input 
                type="number" 
                min="0"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                className="input-field max-w-[200px]"
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Download size={18} className="text-blue-400" />
            Data Management
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Export Inventory</label>
              <p className="text-xs text-slate-500 mb-4">Download a complete CSV snapshot of the current product inventory.</p>
              <button onClick={handleDownloadCSV} className="btn-primary flex items-center gap-2">
                <Download size={16} />
                Download CSV
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
