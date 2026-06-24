import React from 'react';
import { QrCode, MessageSquare, Megaphone, MonitorSmartphone } from 'lucide-react';

export default function AdminBoothMaterial() {
  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#0a0f1e] min-h-screen text-slate-100 font-sans">
      <div className="text-center mb-12">
        <h1 className="font-['Be_Vietnam_Pro'] text-4xl font-black mb-4">Tài Liệu Trưng Bày (Booth Material)</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Sử dụng cho các sự kiện Techfest, Startup Pitching, và Demo Day</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-slate-900 to-[#0f172a] p-8 rounded-[24px] border border-slate-800 shadow-xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-100">
            <QrCode className="text-blue-500 w-8 h-8" /> Mã QR Trải Nghiệm (Demo)
          </h2>
          <div className="flex items-center gap-8 bg-white p-8 rounded-2xl">
            <div className="w-40 h-40 border-4 border-blue-600 rounded-xl flex items-center justify-center font-bold text-slate-800 bg-slate-50">
              [QR CODE MOCKUP]
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Quét để dùng thử BrandFlow</h3>
              <p className="text-slate-600 mb-4 text-sm">Nhận ngay một bản kế hoạch Marketing hoàn chỉnh trong 5 phút. Điền thông tin cơ bản về sản phẩm của bạn trên điện thoại.</p>
              <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-mono text-sm inline-block font-bold border border-blue-200">
                app.brandflow.vn/demo
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-[#0f172a] p-8 rounded-[24px] border border-slate-800 shadow-xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-100">
            <MessageSquare className="text-emerald-500 w-8 h-8" /> Elevator Pitch
          </h2>
          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-800/30">
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Với Nhà Đầu Tư (30s)</div>
              <p className="italic text-slate-300 text-sm leading-relaxed">"BrandFlow là AI Strategy Engine tự động hoá toàn bộ khâu lập kế hoạch marketing cho SME Việt Nam. Chúng tôi thay thế công việc 4 tuần của agency bằng 1 luồng xử lý 10 phút, kiểm soát chặt chẽ hallucination bằng Math Engine riêng."</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-800/30">
              <div className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">Với Khách Hàng SME (30s)</div>
              <p className="italic text-slate-300 text-sm leading-relaxed">"Bạn đang tốn chục triệu thuê agency nhưng không ra đơn? BrandFlow đóng vai trò như một Giám đốc Marketing AI, giúp bạn ra kế hoạch chi tiết tới từng đồng ngân sách và kịch bản content, hoàn toàn tự động."</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-[#0f172a] p-8 rounded-[24px] border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-100">
          <MonitorSmartphone className="text-rose-500 w-8 h-8" /> Standee / Poster Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-800/30 text-center">
            <div className="font-['Be_Vietnam_Pro'] text-5xl font-black text-blue-500 mb-2">10 Phút</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Thay vì 4 tuần agency</div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-800/30 text-center">
            <div className="font-['Be_Vietnam_Pro'] text-5xl font-black text-emerald-500 mb-2">100%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Chính xác ngân sách VNĐ</div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-800/30 text-center">
            <div className="font-['Be_Vietnam_Pro'] text-5xl font-black text-purple-500 mb-2">19</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Framework Marketing chuẩn</div>
          </div>
        </div>
      </div>

    </div>
  );
}
