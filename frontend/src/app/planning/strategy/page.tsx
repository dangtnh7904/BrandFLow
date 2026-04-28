"use client";

import React, { useEffect, useState } from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import { useLanguage } from '@/contexts/LanguageContext';

export default function StrategyPage() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for demo effect
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <B2BPageTemplate
      title="4. Chiến lược Marketing (Marketing Strategy)"
      description="Chiến lược phân khúc, lựa chọn thị trường mục tiêu, định vị và giá trị đề xuất."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Phần trung tâm của kế hoạch: Xác định doanh nghiệp phục vụ ai và tạo ra giá trị khác biệt gì để cạnh tranh.
        </InstructionAlert>
        
        {loading ? (
          <div className="bento-card p-6 min-h-[400px] flex items-center justify-center border border-emerald-100 bg-white/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-emerald-700 font-medium animate-pulse">Đang tổng hợp dữ liệu chiến lược từ AI Agents...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Value Proposition Header */}
            <div className="bento-card p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform translate-x-4 -translate-y-4">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-emerald-400 font-bold tracking-wider text-xs uppercase mb-3">Core Value Proposition</h3>
              <h2 className="text-3xl font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                &quot;Giải pháp quản trị toàn diện, tối ưu hóa quy trình với công nghệ AI tiên phong&quot;
              </h2>
              <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
                Chiến lược tập trung vào định vị thương hiệu như một đối tác công nghệ chiến lược (Strategic Tech Partner), không chỉ cung cấp phần mềm mà còn đồng hành chuyển đổi số cùng doanh nghiệp B2B tầm trung và lớn.
              </p>
            </div>

            {/* 5P Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: 'Product (Sản phẩm)', 
                  icon: '🚀',
                  color: 'from-blue-50 to-indigo-50',
                  border: 'border-blue-100',
                  textColor: 'text-blue-900',
                  desc: 'Hệ sinh thái SaaS tích hợp module AI dự báo, khả năng tùy biến cao cho từng ngành thù lao (Customize-to-fit) thay vì One-size-fits-all.'
                },
                { 
                  title: 'Price (Giá cả)', 
                  icon: '💎',
                  color: 'from-emerald-50 to-teal-50',
                  border: 'border-emerald-100',
                  textColor: 'text-emerald-900',
                  desc: 'Mô hình định giá Value-based Pricing kết hợp Subscription theo Tier (Basic, Pro, Enterprise) để tối đa hóa LTV.'
                },
                { 
                  title: 'Place (Phân phối)', 
                  icon: '🌍',
                  color: 'from-purple-50 to-fuchsia-50',
                  border: 'border-purple-100',
                  textColor: 'text-purple-900',
                  desc: 'Bán hàng trực tiếp (Direct Sales) qua đội ngũ Enterprise AE và mở rộng mạng lưới đối tác tích hợp (Channel Partners).'
                },
                { 
                  title: 'Promotion (Xúc tiến)', 
                  icon: '🎯',
                  color: 'from-rose-50 to-orange-50',
                  border: 'border-rose-100',
                  textColor: 'text-rose-900',
                  desc: 'Chiến lược Account-Based Marketing (ABM) nhắm mục tiêu vào C-level, kết hợp content chuyên sâu (Whitepapers, Webinars).'
                },
                { 
                  title: 'People (Con người)', 
                  icon: '🤝',
                  color: 'from-cyan-50 to-sky-50',
                  border: 'border-cyan-100',
                  textColor: 'text-cyan-900',
                  desc: 'Đội ngũ Customer Success Manager (CSM) được đào tạo chuyên sâu về nghiệp vụ khách hàng để đảm bảo Retention > 95%.'
                },
                { 
                  title: 'Process (Quy trình)', 
                  icon: '⚙️',
                  color: 'from-slate-50 to-gray-50',
                  border: 'border-slate-200',
                  textColor: 'text-slate-800',
                  desc: 'Quy trình Onboarding tự động hóa 80% qua AI bot, 20% cá nhân hóa bởi chuyên gia. SLA hỗ trợ kỹ thuật < 2h.'
                }
              ].map((p, i) => (
                <div key={i} className={`bento-card p-6 bg-gradient-to-br ${p.color} border ${p.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl bg-white p-2 rounded-lg shadow-sm">{p.icon}</span>
                    <h4 className={`font-bold ${p.textColor}`}>{p.title}</h4>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Target Audience & Positioning */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bento-card p-6 bg-white border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-blue-500">📊</span> Phân khúc Khách hàng Trọng tâm
                </h4>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-800">Tier 1: Doanh nghiệp Sản xuất lớn</span>
                      <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">60% Ngân sách</span>
                    </div>
                    <p className="text-xs text-slate-500">Quy mô &gt;500 nhân sự, đau đầu vì quy trình rời rạc, cần hệ thống AI để dự báo chuỗi cung ứng.</p>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-800">Tier 2: Chuỗi Bán lẻ (Retail)</span>
                      <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">40% Ngân sách</span>
                    </div>
                    <p className="text-xs text-slate-500">Hệ thống siêu thị, cần quản trị dữ liệu khách hàng (CDP) và cá nhân hóa trải nghiệm.</p>
                  </div>
                </div>
              </div>

              <div className="bento-card p-6 bg-white border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-purple-500">🏆</span> Định vị Cạnh tranh (Competitive Positioning)
                </h4>
                <div className="relative pt-8 pb-4">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-rose-200 via-slate-200 to-emerald-400"></div>
                  <div className="absolute top-1/2 left-0 w-3 h-3 rounded-full bg-rose-400 transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-slate-400 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-sm"></div>
                  <div className="absolute top-1/2 right-0 w-5 h-5 rounded-full bg-emerald-500 transform -translate-y-1/2 border-2 border-white shadow-md shadow-emerald-200"></div>
                  
                  <div className="flex justify-between mt-4 text-xs font-medium">
                    <div className="text-rose-600 max-w-[80px] text-left">Công cụ rời rạc (Đối thủ A)</div>
                    <div className="text-slate-500 text-center">Phần mềm quản trị cơ bản</div>
                    <div className="text-emerald-700 max-w-[100px] text-right font-bold">Hệ sinh thái AI tích hợp (Chúng ta)</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-6 leading-relaxed bg-slate-50 p-3 rounded-lg">
                  Thay vì cạnh tranh về giá (Race to the bottom), chúng ta cạnh tranh bằng **giá trị tư vấn** và **khả năng tích hợp AI**, biến rào cản chi phí thành khoản đầu tư mang lại ROI rõ ràng.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
               <button className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-md">
                 Lưu &amp; Chuyển sang Ngân sách <span aria-hidden="true">→</span>
               </button>
            </div>
          </div>
        )}
      </div>
    </B2BPageTemplate>
  );
}
