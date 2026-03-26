import React from 'react';
import { Home, Search, Bell, Settings, User, Plus } from 'lucide-react';

export default function Header({ onNewProjectClick }) {
  return (
    <header className="flex items-center justify-between px-8 py-6 sticky top-0 z-10 bg-[#0B1437]/90 backdrop-blur-md">
      <div>
        <div className="flex items-center text-sm text-[#A0AEC0] mb-1">
          <Home className="w-4 h-4 mr-2" />
          <span>/</span>
          <span className="mx-2 hover:text-white cursor-pointer transition-colors">BrandFlow</span>
          <span>/</span>
          <span className="mx-2 hover:text-white cursor-pointer transition-colors">Tổng quan</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Bảng điều khiển BrandFlow</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="bg-[#111C44] text-white text-sm rounded-full pl-10 pr-6 py-2.5 w-[240px] border-none focus:ring-2 focus:ring-[#0075FF] outline-none placeholder-[#A0AEC0]"
          />
        </div>
        
        <button 
          onClick={onNewProjectClick}
          className="bg-[#0075FF] hover:bg-[#0055c4] shadow-[0_4px_15px_rgba(0,117,255,0.4)] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm dự án mới
        </button>

        <div className="flex items-center text-white cursor-pointer hover:text-[#0075FF] transition-colors">
          <User className="w-5 h-5 mr-2" />
          <span className="text-sm font-semibold">Đăng nhập</span>
        </div>
        
        <Settings className="w-5 h-5 text-[#A0AEC0] cursor-pointer hover:text-white transition-colors" />
        <Bell className="w-5 h-5 text-[#A0AEC0] cursor-pointer hover:text-white transition-colors" />
      </div>
    </header>
  );
}
