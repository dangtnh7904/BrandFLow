import React, { useRef } from 'react';
import { ArrowLeft, Fingerprint, Target, Flag, ShieldAlert, PieChart as PieChartIcon, Send, Bot } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import KanbanPdfExporter from './KanbanPdfExporter';

export default function ScreenDashboard({ 
  campaignData, budgetData, chartHistory, iteration, 
  onRestart, onImproveFeedback 
}) {
  const feedbackInputRef = useRef(null);

  const submitFeedback = () => {
    if(feedbackInputRef.current) {
      onImproveFeedback(feedbackInputRef.current.value);
    }
  };

  const profile = campaignData.master_brand_profile || {};
  const blueprint = campaignData.strategic_blueprint || {};
  const tactical = campaignData.tactical_campaign || {};
  const cfo = campaignData.cfo_feedback || {};

  const totalBudget = budgetData.reduce((s, a) => s + (a.value || 0), 0);

  const createMarkup = (text) => {
    if (!text) return { __html: '' };
    if (window.marked) {
      return { __html: window.marked.parse(text) };
    }
    return { __html: `<pre class="whitespace-pre-wrap text-sm">${text}</pre>` };
  };

  return (
    <div className="min-h-full bg-transparent font-sans pb-16">
      <div className="bg-[#111C44] border-b border-[#1B254B] px-8 py-4 mb-8 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
        <div className="flex items-center space-x-5">
          <button onClick={onRestart} className="hover:bg-[#1B254B] p-2 rounded-lg transition-colors flex items-center text-[#A0AEC0] hover:text-white">
            <ArrowLeft size={18} className="mr-2"/> Trở Về
          </button>
          <div className="h-6 w-px bg-[#1B254B]"></div>
          <div className="flex items-center">
            <span className="font-bold tracking-wide text-white">BrandFlow Executive Report <span className="text-xs bg-[#0075FF]/20 text-[#0075FF] ml-2 px-2 py-0.5 rounded-full border border-[#0075FF]/30">V.{iteration}</span></span>
          </div>
        </div>
        <KanbanPdfExporter campaignData={campaignData} budgetData={budgetData} iteration={iteration} />
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* === CỘT TRÁI (COL-8) === */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* TRỤ 1: BRAND PROFILE */}
          <div className="bg-[#111C44] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden border border-[#1B254B]">
            <div className="bg-[#0B1437] px-6 py-4 flex items-center border-b border-[#1B254B]">
              <Fingerprint className="text-[#0075FF] mr-3" size={20} />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Trụ 1: Master Brand Profile</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0B1437] border border-[#1B254B] p-5 rounded-2xl">
                <div className="text-[12px] font-black text-[#0075FF] uppercase tracking-widest mb-3">Brand DNA & USP</div>
                <p className="text-sm text-[#A0AEC0] leading-relaxed mb-4">
                  <strong className="text-white">DNA:</strong> {profile.brand_dna}
                </p>
                <p className="text-sm text-[#A0AEC0] leading-relaxed">
                  <strong className="text-white">USP:</strong> {profile.usp}
                </p>
              </div>
              <div className="bg-[#0B1437] border border-[#1B254B] p-5 rounded-2xl group hover:border-[#0075FF]/30 transition-all">
                <div className="text-[12px] font-black text-amber-400 uppercase tracking-widest mb-3">Persona Prompt</div>
                <p className="text-sm text-emerald-400 font-mono leading-relaxed bg-[#111C44] p-3 rounded-xl border border-emerald-500/20">
                  {profile.target_persona_prompt}
                </p>
              </div>
            </div>
          </div>

          {/* TRỤ 2: STRATEGIC BLUEPRINT (Markdown) */}
          <div className="bg-[#111C44] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden border border-[#1B254B]">
             <div className="bg-[#0B1437] px-6 py-4 flex items-center border-b border-[#1B254B]">
              <Target className="text-emerald-400 mr-3" size={20} />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Trụ 2: Kế Hoạch Chiến Lược (Strategic)</h2>
            </div>
            <div className="p-6">
                <div className="flex gap-4 mb-6">
                   <div className="bg-[#0B1437] border border-[#1B254B] p-4 rounded-xl flex-1">
                      <div className="text-xs text-[#A0AEC0] uppercase font-bold mb-1">Core Message</div>
                      <div className="text-white font-semibold text-sm">{blueprint.core_message}</div>
                   </div>
                </div>

                <div className="mt-8 bg-white/5 p-6 rounded-xl border border-[#1B254B] prose prose-invert max-w-none text-sm text-[#A0AEC0] marker:text-[#0075FF] prose-headings:text-white prose-a:text-[#0075FF] prose-strong:text-white prose-table:w-full prose-th:bg-[#0B1437] prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-[#1B254B] overflow-x-auto" 
                     dangerouslySetInnerHTML={createMarkup(blueprint.strategic_plan_md)}>
                </div>
            </div>
          </div>

          {/* TRỤ 3: TACTICAL CAMPAIGN (Markdown) */}
          <div className="bg-[#111C44] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden border border-[#1B254B]">
             <div className="bg-[#0B1437] px-6 py-4 flex items-center border-b border-[#1B254B]">
              <Flag className="text-[#F59E0B] mr-3" size={20} />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Trụ 3: Kế Hoạch Vận Hành (Tactical)</h2>
            </div>
            <div className="p-6">
                <div className="bg-white/5 p-6 rounded-xl border border-[#1B254B] prose prose-invert max-w-none text-sm text-[#A0AEC0] marker:text-[#0075FF] prose-headings:text-white prose-table:w-full prose-th:bg-[#0B1437] prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-[#1B254B] overflow-x-auto" 
                     dangerouslySetInnerHTML={createMarkup(tactical.operational_plan_md)}>
                </div>
            </div>
          </div>

        </div>

        {/* === CỘT PHẢI (COL-4) === */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* TRỤ 4: CFO FEEDBACK & MATH BUDGET */}
          <div className={`rounded-[20px] border border-2 p-6 shadow-sm overflow-hidden flex flex-col relative ${cfo.is_approved ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
            <div className="flex items-start mb-4">
               <ShieldAlert className={`${cfo.is_approved ? 'text-emerald-400' : 'text-rose-400'} shrink-0 mt-0.5 mr-3`} size={24} />
               <div>
                  <h4 className={`${cfo.is_approved ? 'text-emerald-400' : 'text-rose-400'} font-black outline-none tracking-widest uppercase`}>
                     CFO {cfo.is_approved ? 'PHÊ DUYỆT' : 'CẢNH BÁO'}
                  </h4>
                  <p className="text-xs text-[#A0AEC0] font-semibold mt-2">{cfo.feedback}</p>
               </div>
            </div>
          </div>

          <div className="bg-[#111C44] rounded-[20px] border border-[#1B254B] shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative border-t-8 border-t-[#0075FF]">
            <div className="px-6 py-5 border-b border-[#1B254B] flex justify-between items-center bg-[#111C44]">
              <h3 className="font-black text-white uppercase tracking-widest text-sm">Cơ Cấu Ngân Sách (%)</h3>
              <PieChartIcon size={16} className="text-[#0075FF]" />
            </div>
            
            <div className="p-6 relative bg-[#111C44]">
               <div className="h-56 w-full relative">
                {budgetData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={budgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                        {budgetData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Pie>
                      <RechartsTooltip formatter={(val) => val.toLocaleString() + ' đ'} contentStyle={{backgroundColor: '#0B1437', borderColor: '#1B254B', color: 'white'}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-[#A0AEC0] font-bold">Rỗng</div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-xl font-black text-white tracking-tighter">{(totalBudget/1000000).toLocaleString()} Tr</span>
                  <span className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-widest mt-0.5">Tiền Phân Bổ</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center bg-rose-500/10 p-3 rounded-lg border border-rose-500/30">
                     <span className="font-medium text-rose-400 text-[11px] truncate mr-2">Trích Quỹ Dự Phòng</span>
                     <span className="font-black text-rose-400 text-sm shrink-0">{cfo.contingency_percent}%</span>
                </div>
                {budgetData.map((item, idx) => (
                   <div key={idx} className={`flex justify-between items-center bg-[#0B1437] p-3 rounded-lg border border-[${item.fill}]/30`}>
                     <div className="flex items-center truncate mr-2">
                         <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: item.fill}}></div>
                         <span className="font-medium text-white text-[11px] truncate">{item.name}</span>
                     </div>
                     <span className="font-black text-white text-sm shrink-0">{(item.value/1000000).toLocaleString()} Tr đ</span>
                   </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#0075FF]/20 to-[#111C44] rounded-[20px] border border-[#0075FF]/30 p-6 flex flex-col shadow-[0_0_30px_rgba(0,117,255,0.15)] relative overflow-hidden group">
            <div className="bg-[#0B1437] p-3 flex items-center justify-center rounded-xl text-[#0075FF] mb-4 shadow-lg border border-[#0075FF]/20 h-12 w-12 shrink-0">
               <Bot size={24}/>
            </div>
            <h4 className="font-black text-white text-lg mb-1 tracking-wide uppercase">AI Tái Cơ Cấu</h4>
            <p className="text-xs text-[#A0AEC0] mb-4">Gửi feedback yêu cầu duyệt lại kế hoạch. (Hoặc test Endpoint Micro-execute riêng trong Postman).</p>
            <div className="flex flex-col w-full gap-2">
              <input 
                type="text"
                ref={feedbackInputRef}
                placeholder="VD: Viết lại Core Message..."
                className="w-full bg-[#0B1437] border border-[#1B254B] text-white px-4 py-3 rounded-xl text-sm outline-none focus:border-[#0075FF]"
              />
              <button onClick={submitFeedback} className="w-full bg-[#0075FF] hover:bg-[#0055c4] text-white font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center shadow-[0_0_15px_rgba(0,117,255,0.4)]">
                Chốt Lệnh <Send size={16} className="ml-2"/>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
