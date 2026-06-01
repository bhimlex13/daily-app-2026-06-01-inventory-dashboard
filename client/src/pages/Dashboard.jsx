import React, { useState, useEffect } from 'react';
import { fetchDashboard } from '../api';
import { useSettings } from '../contexts/SettingsContext';
import { Package, AlertTriangle, DollarSign, TrendingUp, Archive, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-[#1e293b] border border-slate-800/60 rounded-2xl p-6 transition-all hover:bg-[#1e293b]/80 hover:border-slate-700/50">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-100">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp size={16} className="text-emerald-400 mr-1" />
        <span className="text-emerald-400 font-medium">{trend}</span>
        <span className="text-slate-500 ml-2">vs last month</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useSettings();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchDashboard();
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!data) return <div className="text-slate-400">Error loading dashboard</div>;

  const { overview, categoryStats, stockDistribution, lowStockItems } = data;

  const barChartData = {
    labels: categoryStats.map(c => c.name),
    datasets: [
      {
        label: 'Total Value ($)',
        data: categoryStats.map(c => c.totalValue),
        backgroundColor: categoryStats.map(c => c.color || '#6366f1'),
        borderRadius: 6,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6
      }
    },
    scales: {
      y: {
        grid: { color: '#334155', drawBorder: false },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  const doughnutData = {
    labels: stockDistribution.map(s => s._id),
    datasets: [
      {
        data: stockDistribution.map(s => s.count),
        backgroundColor: stockDistribution.map(s => 
          s._id === 'in-stock' ? '#10b981' : 
          s._id === 'low-stock' ? '#f59e0b' : '#ef4444'
        ),
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20, usePointStyle: true } }
    },
    cutout: '75%'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back, here's your inventory status.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={overview.totalProducts} 
          icon={Package} 
          color="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20" 
          trend="+12%"
        />
        <StatCard 
          title="Total Value" 
          value={formatCurrency(overview.totalValue)} 
          icon={DollarSign} 
          color="bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20" 
          trend="+5.4%"
        />
        <StatCard 
          title="Low Stock Items" 
          value={overview.lowStockProducts} 
          icon={AlertTriangle} 
          color="bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20" 
        />
        <StatCard 
          title="Out of Stock" 
          value={overview.outOfStockProducts} 
          icon={Archive} 
          color="bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/20" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] border border-slate-800/60 rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <Activity size={18} className="text-indigo-400" />
              Inventory Value by Category
            </h3>
          </div>
          <div className="h-[300px]">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-800/60 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
            <Archive size={18} className="text-indigo-400" />
            Stock Distribution
          </h3>
          <div className="h-[250px] relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-3xl font-bold text-slate-200">{overview.totalProducts}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="bg-[#1e293b] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
          <AlertTriangle size={18} className="text-rose-400" />
          Low Stock Alerts
        </h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th className="!text-right">Qty</th>
                <th className="!text-right">Min Stock</th>
                <th className="!text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No low stock items. All good!
                  </td>
                </tr>
              ) : (
                lowStockItems.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm overflow-hidden"
                          style={{ backgroundColor: item.image ? 'transparent' : (item.category?.color || '#334155') }}
                        >
                          {item.image ? (
                            <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-400 font-mono text-sm">{item.sku}</td>
                    <td className="text-right">
                      <span className="text-slate-200 font-medium">{item.quantity}</span>
                    </td>
                    <td className="text-right text-slate-400">{item.minStock}</td>
                    <td className="text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        item.status === 'out-of-stock' 
                          ? 'badge-out-of-stock' 
                          : 'badge-low-stock'
                      }`}>
                        {item.status.replace('-', ' ')}
                      </span>
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

export default Dashboard;
