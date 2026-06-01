import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, Settings, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 flex-shrink-0 bg-[#1e293b]/80 backdrop-blur-xl border-r border-slate-800 flex flex-col transition-all duration-300
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'} border-b border-slate-800/50`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 text-indigo-400 font-bold text-xl tracking-tight overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
                <Package size={18} />
              </div>
              <span>Inventorio</span>
            </div>
          )}
          <button 
            className="md:hidden text-slate-400 hover:text-slate-200 p-1"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </button>
          <button 
            className={`hidden md:flex text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-800/50 items-center justify-center ${isCollapsed ? 'w-10 h-10' : ''}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          {!isCollapsed && <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Menu</div>}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.name : ""}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-xl transition-all duration-200 outline-none ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400 font-medium shadow-[inset_4px_0_0_0_#6366f1]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon size={18} className="stroke-[2.5px] shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

      <div className="p-3 border-t border-slate-800/50">
        <button 
          onClick={logout}
          title={isCollapsed ? "Logout" : ""}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 w-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 text-left`}
        >
          <LogOut size={18} className="stroke-[2.5px] shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
