import React from 'react';
import { LayoutDashboard, BarChart3, Briefcase, Presentation, LogOut } from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { id: 'admin_analytics', label: 'Command Center', icon: LayoutDashboard },
  { id: 'admin_pitch_deck', label: 'Investor Pitch Deck', icon: Presentation },
  { id: 'admin_business_model', label: 'Business Model', icon: Briefcase },
  { id: 'admin_booth', label: 'Booth Material', icon: BarChart3 },
];

export default function AdminSidebar({ currentView, onNavigate, onLogout }) {
  return (
    <div className="w-64 bg-[#0a0f1e] text-slate-300 h-screen fixed border-r border-slate-800 flex flex-col z-20 transition-colors duration-300 shadow-xl shadow-blue-900/10">
      {/* Brand area */}
      <div className="p-6">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('admin_analytics'); }} className="flex items-center gap-3 decoration-transparent">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <span className="text-xl font-black text-white leading-none tracking-tighter">B</span>
          </div>
          <div>
            <span className="font-['Be_Vietnam_Pro'] font-bold text-lg text-slate-100 tracking-tight block leading-tight">Command Center</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">BrandFlow</span>
          </div>
        </a>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Investor & Analytics
        </div>
        
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive 
                  ? 'bg-blue-600/15 text-blue-400 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.2)]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User area */}
      <div className="p-4 border-t border-slate-800 bg-[#0f1526]">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">Administrator</p>
            <p className="text-xs text-rose-400 truncate font-mono">Super Admin</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
