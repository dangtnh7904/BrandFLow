"use client";

import React from 'react';
import { Hexagon, Target, Zap, Shield, Briefcase, Activity, Cpu, Layers, Workflow, Users, CheckCircle2 } from 'lucide-react';

export default function OnePagerPitch() {
  return (
    <div id="print-root" className="min-h-screen bg-slate-100 flex justify-center py-10 font-sans print:py-0 print:bg-white">
      <div className="w-[210mm] h-[297mm] bg-white shadow-2xl print:shadow-none overflow-hidden relative flex flex-col">
        
        {/* HEADER */}
        <header className="bg-slate-900 text-white px-8 py-6 relative overflow-hidden shrink-0 border-b-4 border-blue-500">
          <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-blue-600/30 rounded-full blur-3xl pointer-events-none print:hidden" />
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Hexagon className="w-6 h-6 text-white fill-white/20" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none uppercase">BrandFlow AI</h1>
                <p className="text-cyan-400 font-bold text-[10px] tracking-widest mt-1 uppercase">Hệ sinh thái Marketing tự động hóa Multi-Agent B2B</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Developed by BrandFlow Team</p>
              <p className="text-slate-900 text-[10px] font-black bg-white px-3 py-1 rounded-sm uppercase tracking-widest">System Overview / 2026</p>
            </div>
          </div>
        </header>

        <div className="flex-1 px-8 py-6 grid grid-cols-12 gap-6 text-slate-800">
          
          {/* LEFT COLUMN (7/12) */}
          <div className="col-span-7 flex flex-col gap-5">
            
            {/* PROBLEM & SOLUTION */}
            <section>
              <div className="flex items-center gap-2 mb-2 border-b-2 border-slate-900 pb-1">
                <Target className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-black uppercase text-slate-900 tracking-tight">Thực trạng & Giải pháp (Problem & Solution)</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-rose-100 rounded-bl-full opacity-50"></div>
                  <h3 className="text-[10px] font-bold text-rose-700 uppercase tracking-widest mb-1 relative z-10">Khó khăn của Doanh nghiệp</h3>
                  <ul className="text-[11px] leading-relaxed text-rose-900 relative z-10 space-y-1.5 pl-3 list-disc">
                    <li>Đứt gãy luồng dữ liệu khi dùng quá nhiều công cụ rời rạc (ChatGPT, Canva, Hubspot).</li>
                    <li>Nội dung AI tạo ra quá chung chung, thiếu chiều sâu chiến lược chuyên ngành B2B.</li>
                    <li>Mất hàng tuần để lên kế hoạch marketing.</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-blue-100 rounded-bl-full opacity-50"></div>
                  <h3 className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1 relative z-10">Giải pháp BrandFlow</h3>
                  <ul className="text-[11px] leading-relaxed text-blue-900 relative z-10 space-y-1.5 pl-3 list-disc">
                    <li>Hệ sinh thái duy nhất quy tụ Chiến lược (Strategy), Nội dung (Content) và Thiết kế (Design).</li>
                    <li>Mô phỏng tư duy của Giám đốc Marketing thực thụ qua chuẩn framework McKinsey/Kotler.</li>
                    <li>Rút ngắn Time-to-Market từ 3 tháng xuống 14 ngày.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* PRODUCT ARCHITECTURE */}
            <section>
              <div className="flex items-center gap-2 mb-2 border-b-2 border-slate-900 pb-1">
                <Cpu className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-black uppercase text-slate-900 tracking-tight">Cấu trúc 3 Lõi AI (Core AI Agents)</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-3 items-start bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-sm">A0</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      Strategic Planner Agent <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">McKinsey Framework</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Thông qua Interactive QA, AI tự động phân tích thị trường, lập định vị VRIO, xuất ma trận SWOT, và phân bổ chiến thuật Marketing chuẩn xác với thực tế nguồn lực doanh nghiệp.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-black text-sm">A1</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      Content Lab Pipeline <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">n8n Automation</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Tiếp nhận định hướng cốt lõi (Brand Voice) từ A0, tự động sinh chuỗi bài viết chuyên sâu đa kênh (SEO Blog, LinkedIn, PR) với chất lượng tương đương Senior Copywriter.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center shrink-0 font-black text-sm">A2</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      Design Studio & Prompting <span className="text-[8px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">ComfyUI / Stable Diffusion</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Phân rã ngữ nghĩa bài viết thành Image Prompts, tự động mock-up với layout nhận diện riêng của từng doanh nghiệp. Đảm bảo tính nhất quán thị giác ở mọi điểm chạm.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* COMPETITIVE ADVANTAGES */}
            <section className="mt-auto">
              <div className="flex items-center gap-2 mb-2 border-b-2 border-slate-900 pb-1">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-black uppercase text-slate-900 tracking-tight">Lợi thế Cạnh tranh (Competitive Edge)</h2>
              </div>
              <ul className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 mt-2">
                <li className="flex items-start gap-2 bg-white border border-slate-200 p-2 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Loại bỏ hoàn toàn "Hallucination" nhờ kỹ thuật RAG và Vector Database (ChromaDB).</span>
                </li>
                <li className="flex items-start gap-2 bg-white border border-slate-200 p-2 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Cá nhân hóa theo từng dự án với Context Memory độc lập, không dùng chung prompt mẫu.</span>
                </li>
                <li className="flex items-start gap-2 bg-white border border-slate-200 p-2 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Tự động hóa luồng duyệt bài từ khâu lên kịch bản đến xuất bản thành phẩm.</span>
                </li>
                <li className="flex items-start gap-2 bg-white border border-slate-200 p-2 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Kiến trúc Multi-tenant đảm bảo cách ly dữ liệu tuyệt đối giữa các tổ chức.</span>
                </li>
              </ul>
            </section>

          </div>

          {/* RIGHT COLUMN (5/12) */}
          <div className="col-span-5 flex flex-col gap-5">
            
            {/* SYSTEM PERFORMANCE & TRACTION */}
            <section className="bg-slate-900 rounded-xl p-4 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none print:hidden"></div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2 relative z-10">
                <Activity className="w-4 h-4" /> Hiệu suất Hệ thống (System Metrics)
              </h2>
              
              <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                <div className="bg-white/5 border border-white/10 p-2 rounded text-center">
                  <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-1">Audit Events</div>
                  <div className="text-xl font-black text-white">288</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 rounded text-center">
                  <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-1">Active Accounts</div>
                  <div className="text-xl font-black text-cyan-400">49</div>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-3 relative z-10 space-y-2">
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                  <span className="text-[10px] text-slate-300">Avg. Generation Time</span>
                  <span className="text-[10px] font-bold text-white">&lt; 2.5s / Task</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                  <span className="text-[10px] text-slate-300">AI Accuracy Rating</span>
                  <span className="text-[10px] font-bold text-white">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-300">System Uptime</span>
                  <span className="text-[10px] font-bold text-emerald-400">99.9% (SLA)</span>
                </div>
              </div>
              
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative z-10 mt-1">
                <div className="w-[95%] h-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              </div>
              <p className="text-[8px] text-slate-400 mt-1.5 text-right font-bold uppercase tracking-widest relative z-10">
                Platform Stability Index
              </p>
            </section>

            {/* WORKFLOW PIPELINE */}
            <section>
              <div className="flex items-center gap-2 mb-3 border-b-2 border-slate-900 pb-1">
                <Workflow className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-black uppercase text-slate-900 tracking-tight">Quy trình Vận hành (Workflow)</h2>
              </div>
              <div className="space-y-0 text-[11px]">
                <div className="flex items-stretch">
                  <div className="flex flex-col items-center mr-3">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">1</div>
                    <div className="w-0.5 h-10 bg-slate-200"></div>
                  </div>
                  <div className="pb-3">
                    <h3 className="font-bold text-slate-900 mb-0.5 uppercase text-[10px] tracking-wide">Data Ingestion</h3>
                    <p className="text-slate-600">Tiếp nhận tài liệu đầu vào (PDF, Word) và chuyển đổi thành Vector Context thông qua ChromaDB.</p>
                  </div>
                </div>
                
                <div className="flex items-stretch">
                  <div className="flex flex-col items-center mr-3">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">2</div>
                    <div className="w-0.5 h-10 bg-slate-200"></div>
                  </div>
                  <div className="pb-3">
                    <h3 className="font-bold text-slate-900 mb-0.5 uppercase text-[10px] tracking-wide">Strategic Reasoning</h3>
                    <p className="text-slate-600">LLM (Gemini Flash) phân tích dữ liệu, ứng dụng framework chuyên ngành để tạo ra Master Plan.</p>
                  </div>
                </div>

                <div className="flex items-stretch">
                  <div className="flex flex-col items-center mr-3">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">3</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-0.5 uppercase text-[10px] tracking-wide">Execution & Output</h3>
                    <p className="text-slate-600">Tự động kích hoạt luồng n8n webhook, sinh nội dung và render hình ảnh ComfyUI thành phẩm.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECURITY & COMPLIANCE */}
            <section className="mt-auto bg-slate-50 border border-slate-200 rounded-lg p-3 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-lg"></div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Tiêu chuẩn Doanh nghiệp (Enterprise Ready)
              </h3>
              <div className="space-y-2 pl-2 text-[10px] text-slate-700">
                <div className="flex items-start gap-2 border-b border-slate-200 pb-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 shrink-0"></div>
                  <div>
                    <strong className="block text-slate-900 mb-0.5">Privacy First (Zero Data Retention)</strong>
                    Dữ liệu doanh nghiệp tuyệt đối không được dùng để train LLMs bên thứ ba.
                  </div>
                </div>
                <div className="flex items-start gap-2 border-b border-slate-200 pb-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 shrink-0"></div>
                  <div>
                    <strong className="block text-slate-900 mb-0.5">SOC 2 Type I Compliant (Mocked)</strong>
                    Hệ thống Audit Log ghi nhận toàn bộ truy cập theo Role-Based Access Control (RBAC).
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 shrink-0"></div>
                  <div>
                    <strong className="block text-slate-900 mb-0.5">Rate Limiting & Anti-Abuse</strong>
                    Tự động phòng chống D-DOS, bảo vệ End-point API và giới hạn lưu lượng theo Tier.
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* =======================
            FOOTER
            ======================= */}
        <footer className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex justify-between items-center text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-auto shrink-0">
          <div>© 2026 BrandFlow Team. Proprietary and Confidential.</div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> brandflow.ai</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Developed by BrandFlow</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
