import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-[#1e293b]/50 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-500" />
          </div>
          <input
            type="text"
            className="input-field pl-10 sm:text-sm"
            placeholder="Search inventory..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white cursor-pointer ring-2 ring-slate-800">
          <User size={16} />
        </div>
      </div>
    </header>
  );
};

export default Header;
