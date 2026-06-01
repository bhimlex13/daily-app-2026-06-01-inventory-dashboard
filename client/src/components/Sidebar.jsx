import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, Settings, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
];

const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-[#1e293b]/80 backdrop-blur-xl border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3 text-indigo-400 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Package size={18} />
          </div>
          Inventorio
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium shadow-[inset_4px_0_0_0_#6366f1]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon size={18} className="stroke-[2.5px]" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 text-left">
          <LogOut size={18} className="stroke-[2.5px]" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
