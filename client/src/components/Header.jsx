import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, Settings as SettingsIcon, LogOut, AlertTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Header = ({ setIsMobileOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState([]);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    // Fetch low stock alerts
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('/api/products');
        if (response.data.success) {
          const lowStock = response.data.data.filter(p => p.quantity <= p.minStock);
          setAlerts(lowStock);
        }
      } catch (err) {
        console.error("Failed to fetch alerts");
      }
    };
    fetchAlerts();

    // Click outside handler
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-[#1e293b]/50 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-10">
      <div className="flex-1 flex items-center gap-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Menu size={24} />
        </button>
        <form onSubmit={handleSearch} className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 sm:text-sm"
            placeholder="Search inventory (Press Enter)..."
          />
        </form>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Bell size={20} />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                <h3 className="font-semibold text-slate-200">Alerts ({alerts.length})</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-4 text-slate-400 text-sm text-center">No new alerts.</div>
                ) : (
                  alerts.map(alert => (
                    <div key={alert._id} className="p-3 border-b border-slate-700/50 hover:bg-slate-700/30 flex items-start gap-3">
                      <AlertTriangle size={16} className={alert.quantity === 0 ? "text-rose-400 mt-0.5" : "text-amber-400 mt-0.5"} />
                      <div>
                        <p className="text-sm font-medium text-slate-200">{alert.name}</p>
                        <p className="text-xs text-slate-400">
                          {alert.quantity === 0 ? 'Out of stock' : `Low stock: ${alert.quantity} remaining`}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white cursor-pointer ring-2 ring-slate-800 hover:ring-indigo-500 transition-all"
          >
            <User size={16} />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-slate-700">
                <p className="text-sm font-medium text-white">{user?.username || 'Admin User'}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role || 'Administrator'}</p>
              </div>
              <div className="py-1">
                <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors">
                  <SettingsIcon size={16} />
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
