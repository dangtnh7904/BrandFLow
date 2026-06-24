import React from 'react';
import { Target, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminBusinessModel() {
  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#0a0f1e] min-h-screen text-slate-100 font-sans">
      <div className="text-center mb-12">
        <h1 className="font-['Be_Vietnam_Pro'] text-4xl font-black mb-4">Mô Hình Kinh Doanh & Phễu</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">SaaS Freemium — Unit Economics khả thi cho thị trường Việt Nam</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-slate-200">Phễu Khách Hàng (Funnel)</h2>
          <div className="space-y-4">
            {[
              {s:'Nhận biết', n:'100k', c:'Traffic', d:'Nội dung TikTok, Facebook Reels về chiến lược marketing.'},
              {s:'Cân nhắc', n:'5k', c:'Signups', d:'Dùng thử công cụ tạo nội dung miễn phí (Lead magnet).'},
              {s:'Chuyển đổi', n:'500', c:'Paid Users', d:'Nâng cấp PLUS/PRO để dùng toàn bộ Strategy Engine.'},
              {s:'Giữ chân', n:'200', c:'Loyal', d:'Sử dụng hàng ngày để thực thi và đo lường.'}
            ].map((f, i) => (
              <div key={f.s} className="flex border border-slate-800 bg-slate-900/50 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-colors">
                <div className="w-32 bg-slate-800/50 flex flex-col items-center justify-center border-r border-slate-800 p-4 text-center">
                  <span className="font-['Be_Vietnam_Pro'] text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{f.n}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{f.c}</span>
                </div>
                <div className="p-5 flex-1">
                  <h3 className="text-blue-400 font-bold mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-xs flex items-center justify-center">{i+1}</span> {f.s}
                  </h3>
                  <p className="text-sm text-slate-400">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-slate-200">Unit Economics</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-3xl font-black text-blue-400 mb-1">$35</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">ARPU / Tháng</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-3xl font-black text-emerald-400 mb-1">85%</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Gross Margin</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-3xl font-black text-amber-400 mb-1">$15</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">CAC</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-emerald-500/30 bg-emerald-500/5 text-center">
              <div className="text-3xl font-black text-emerald-500 mb-1">10-16x</div>
              <div className="text-xs text-emerald-600/70 uppercase tracking-widest font-bold">LTV / CAC</div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 text-slate-200">Pricing Tiers</h2>
          <div className="space-y-3">
            {[
              {t:'FREE', p:'0đ', d:'Solo founder, công cụ cơ bản.'},
              {t:'PLUS', p:'499K', d:'SME nhỏ, 5 kế hoạch/tháng.'},
              {t:'PRO', p:'1.49M', d:'SME trung bình, full agent network.'}
            ].map(p => (
              <div key={p.t} className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-800/30">
                <div>
                  <span className="font-bold text-slate-200 mr-2">{p.t}</span>
                  <span className="text-sm text-slate-500">{p.d}</span>
                </div>
                <div className="font-['Be_Vietnam_Pro'] font-bold text-blue-400">{p.p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
