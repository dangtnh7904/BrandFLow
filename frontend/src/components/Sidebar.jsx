import React from 'react';
import { LayoutDashboard, FileText, CheckSquare, Database, Network, HelpCircle, Star, PlusCircle } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, group: 'main' },
  { id: 'upload', label: 'Tạo Kế hoạch mới', icon: PlusCircle, group: 'planning' },
  { id: 'result', label: 'Kế hoạch Marketing', icon: FileText, group: 'planning' },
  { id: 'knowledge', label: 'Cơ sở tri thức', icon: Database, group: 'system' },
  { id: 'agents', label: 'Mạng lưới AI Agent', icon: Network, group: 'system' },
];

export default function Sidebar({ currentView, onNavigate }) {
  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 min-h-screen border-r border-slate-200 dark:border-zinc-800 flex flex-col py-8 fixed left-0 top-0 transition-colors duration-300">
      <div className="flex items-center justify-center mb-10 px-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-slate-800 dark:text-white flex items-center justify-center font-bold text-lg mr-3 shadow-md">
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-black tracking-widest text-slate-900 dark:text-slate-800 dark:text-white">BRANDFLOW</h2>
      </div>

      <nav className="flex-1 px-4">
        {/* Dashboard */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className={`rounded-xl flex items-center px-4 py-3 mb-8 cursor-pointer transition-transform hover:scale-[1.02] ${currentView === 'dashboard' ? 'bg-indigo-600 shadow-[0_4px_15px_rgba(79,70,229,0.3)]' : 'hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
        >
          <div className={`${currentView === 'dashboard' ? 'bg-white/20' : 'bg-slate-100 dark:bg-zinc-800'} p-2 rounded-lg mr-3`}>
            <LayoutDashboard className={`w-5 h-5 ${currentView === 'dashboard' ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-zinc-400'}`} />
          </div>
          <span className={`font-bold ${currentView === 'dashboard' ? 'text-slate-800 dark:text-white' : 'text-slate-700 dark:text-zinc-300'}`}>Tổng quan</span>
        </div>

        <div className="mb-6">
          <h3 className="text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest px-4 mb-4">LẬP KẾ HOẠCH</h3>
          <ul className="space-y-2">
            {NAV_ITEMS.filter(n => n.group === 'planning').map(item => (
              <li 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center px-4 py-2.5 cursor-pointer rounded-lg transition-colors group ${currentView === item.id ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}
              >
                <div className={`${currentView === item.id ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-slate-100 dark:bg-zinc-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10'} p-2 rounded-lg mr-3 transition-colors`}>
                  <item.icon className={`w-4 h-4 ${currentView === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                </div>
                <span className="font-semibold text-sm">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest px-4 mb-4">HỆ THỐNG</h3>
          <ul className="space-y-2">
            {NAV_ITEMS.filter(n => n.group === 'system').map(item => (
              <li 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center px-4 py-2.5 cursor-pointer rounded-lg transition-colors group ${currentView === item.id ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}
              >
                <div className={`${currentView === item.id ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-slate-100 dark:bg-zinc-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10'} p-2 rounded-lg mr-3 transition-colors`}>
                  <item.icon className={`w-4 h-4 ${currentView === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                </div>
                <span className="font-semibold text-sm">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="px-4 mt-auto">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[24px] p-6 text-slate-800 dark:text-white relative overflow-hidden shadow-lg">
          <div className="w-32 h-32 bg-white/20 blur-3xl rounded-full absolute top-0 -left-10 transform -translate-y-10"></div>
          
          <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative z-10 border border-white/30">
            <Star className="w-5 h-5 fill-white text-slate-800 dark:text-white" />
          </div>
          <h4 className="font-bold text-lg mb-1 relative z-10">Cần hỗ trợ?</h4>
          <p className="text-xs text-slate-800 dark:text-white/90 mb-4 relative z-10">Xem tài liệu hướng dẫn</p>
          <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-xs font-bold transition-colors relative z-10">
            TÀI LIỆU
          </button>
        </div>
      </div>
    </aside>
  );
}
