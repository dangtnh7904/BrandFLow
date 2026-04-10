import React from 'react';
import { Home, Search, Bell, Settings, User, Plus, Moon, Sun } from 'lucide-react';

const VIEW_LABELS = {
  dashboard: 'Tổng quan',
  upload: 'Tạo Kế hoạch mới',
  simulation: 'Mô phỏng AI',
  result: 'Kế hoạch Marketing',
  knowledge: 'Cơ sở tri thức',
  agents: 'Mạng lưới AI Agent',
};

export default function Header({ currentView, onNewProjectClick, onNavigate, isDarkMode, toggleTheme }) {
  return (
    <header className="flex items-center justify-between px-8 py-6 sticky top-0 z-10 bg-slate-50/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-300">
      <div>
        <div className="flex items-center text-sm text-slate-500 dark:text-zinc-400 mb-1">
          <Home className="w-4 h-4 mr-2" />
          <span>/</span>
          <span onClick={() => onNavigate('dashboard')} className="mx-2 hover:text-indigo-600 dark:hover:text-slate-800 dark:text-white cursor-pointer transition-colors">BrandFlow</span>
          <span>/</span>
          <span className="mx-2 text-slate-900 dark:text-slate-800 dark:text-white font-semibold">{VIEW_LABELS[currentView] || 'Tổng quan'}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-800 dark:text-white tracking-tight">Bảng điều khiển BrandFlow</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-800 dark:text-white text-sm rounded-full pl-10 pr-6 py-2.5 w-[240px] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none placeholder-slate-400 dark:placeholder-zinc-500 transition-colors"
          />
        </div>
        
        <button 
          onClick={onNewProjectClick}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-[0_4px_15px_rgba(79,70,229,0.3)] text-slate-800 dark:text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm dự án mới
        </button>

        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center text-slate-700 dark:text-slate-800 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <User className="w-5 h-5 mr-2" />
          <span className="text-sm font-semibold">Đăng nhập</span>
        </div>
        
        <Settings className="w-5 h-5 text-slate-500 dark:text-zinc-400 cursor-pointer hover:text-slate-800 dark:hover:text-slate-800 dark:text-white transition-colors" />
        <Bell className="w-5 h-5 text-slate-500 dark:text-zinc-400 cursor-pointer hover:text-slate-800 dark:hover:text-slate-800 dark:text-white transition-colors" />
      </div>
    </header>
  );
}
