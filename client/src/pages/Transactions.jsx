import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../api';
import { useSettings } from '../contexts/SettingsContext';
import { Receipt, Search, Filter, Calendar } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { formatCurrency } = useSettings();

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetchTransactions();
        if (response.data.success) {
          setTransactions(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);

  return (
    <div className="space-y-6 flex flex-col h-full min-h-[80vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Transaction History</h1>
          <p className="text-slate-400">View and manage past sales and receipts.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-[#1e293b] border border-slate-800/60 rounded-xl p-4 flex flex-col min-w-[150px]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Sales</span>
            <span className="text-2xl font-bold text-emerald-400">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="bg-[#1e293b] border border-slate-800/60 rounded-xl p-4 flex flex-col min-w-[150px]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Orders</span>
            <span className="text-2xl font-bold text-indigo-400">{transactions.length}</span>
          </div>
        </div>
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
              placeholder="Search by Transaction ID or Customer..."
            />
          </div>
          <button className="btn-ghost flex items-center gap-2 py-2.5 text-sm">
            <Filter size={16} />
            More Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="data-table min-w-[900px]">
            <thead className="bg-[#1e293b] sticky top-0 z-10">
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment</th>
                <th className="!text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(transaction => (
                  <tr key={transaction._id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                          <Receipt size={16} />
                        </div>
                        <span className="text-slate-300 font-mono text-sm">{transaction._id.substring(18)}</span>
                      </div>
                    </td>
                    <td className="text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(transaction.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="text-slate-300 font-medium">
                      {transaction.customerName}
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-200">{transaction.items.length} unique item(s)</span>
                        <span className="text-xs text-slate-500 line-clamp-1 max-w-[200px]" title={transaction.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}>
                          {transaction.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        transaction.paymentMethod === 'card' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {transaction.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-right text-emerald-400 font-bold text-lg">
                      {formatCurrency(transaction.totalAmount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
