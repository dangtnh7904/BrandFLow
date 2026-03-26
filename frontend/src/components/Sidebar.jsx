import React from 'react';
import { LayoutDashboard, FileText, CheckSquare, Database, Network, HelpCircle, Star } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#111C44] min-h-screen border-r border-[#1B254B]/50 flex flex-col py-8 fixed left-0 top-0">
      <div className="flex items-center justify-center mb-10 px-8">
        <div className="w-8 h-8 rounded-lg bg-white text-[#111C44] flex items-center justify-center font-bold text-lg mr-3 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-black tracking-widest text-white">BRANDFLOW</h2>
      </div>

      <nav className="flex-1 px-4">
        {/* Active Route */}
        <div className="bg-gradient-to-r from-[#0075FF] to-[#0055c4] rounded-xl flex items-center px-4 py-3 mb-8 cursor-pointer shadow-[0_4px_15px_rgba(0,117,255,0.4)] transition-transform hover:scale-[1.02]">
          <div className="bg-white/20 p-2 rounded-lg mr-3">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold">Tổng quan</span>
        </div>

        <div className="mb-6">
          <h3 className="text-[#A0AEC0] text-xs font-bold uppercase tracking-widest px-4 mb-4">LẬP KẾ HOẠCH</h3>
          <ul className="space-y-2">
            <li className="flex items-center px-4 py-2.5 text-[#A0AEC0] hover:text-white cursor-pointer rounded-lg hover:bg-[#1B254B] transition-colors group">
              <div className="bg-[#1B254B] group-hover:bg-[#0075FF] p-2 rounded-lg mr-3 transition-colors">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Kế hoạch Marketing</span>
            </li>
            <li className="flex items-center px-4 py-2.5 text-[#A0AEC0] hover:text-white cursor-pointer rounded-lg hover:bg-[#1B254B] transition-colors group">
              <div className="bg-[#1B254B] group-hover:bg-[#0075FF] p-2 rounded-lg mr-3 transition-colors">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Phê duyệt (HITL)</span>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-[#A0AEC0] text-xs font-bold uppercase tracking-widest px-4 mb-4">HỆ THỐNG</h3>
          <ul className="space-y-2">
            <li className="flex items-center px-4 py-2.5 text-[#A0AEC0] hover:text-white cursor-pointer rounded-lg hover:bg-[#1B254B] transition-colors group">
              <div className="bg-[#1B254B] group-hover:bg-[#0075FF] p-2 rounded-lg mr-3 transition-colors">
                <Database className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Cơ sở tri thức</span>
            </li>
            <li className="flex items-center px-4 py-2.5 text-[#A0AEC0] hover:text-white cursor-pointer rounded-lg hover:bg-[#1B254B] transition-colors group">
              <div className="bg-[#1B254B] group-hover:bg-[#0075FF] p-2 rounded-lg mr-3 transition-colors">
                <Network className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Mạng lưới AI Agent</span>
            </li>
          </ul>
        </div>
      </nav>

      <div className="px-4 mt-auto">
        <div className="bg-gradient-to-br from-[#0075FF] to-[#3B82F6] rounded-[24px] p-6 text-white relative overflow-hidden shadow-[0_10px_20px_rgba(0,117,255,0.3)]">
          <div className="w-32 h-32 bg-white/20 blur-3xl rounded-full absolute top-0 -left-10 transform -translate-y-10"></div>
          
          <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative z-10 border border-white/30">
            <Star className="w-5 h-5 fill-white text-white" />
          </div>
          <h4 className="font-bold text-lg mb-1 relative z-10">Cần hỗ trợ?</h4>
          <p className="text-xs text-white/90 mb-4 relative z-10">Xem tài liệu hướng dẫn</p>
          <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-xs font-bold transition-colors relative z-10">
            TÀI LIỆU
          </button>
        </div>
      </div>
    </aside>
  );
}
