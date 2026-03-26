import React, { useRef } from 'react';
import { 
  Briefcase, Target, DollarSign, Sparkles, Users, AlertTriangle, XCircle, Map, ShieldAlert, BarChart3, History, PenTool, Send, ArrowLeft
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export const CAT_CONFIG = {
  MUST_HAVE: { label: 'BẮT BUỘC LÕI', color: '#10B981', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  SHOULD_HAVE: { label: 'NÊN CÓ', color: '#F59E0B', bg: 'bg-amber-500/20', text: 'text-amber-400' },
  COULD_HAVE: { label: 'RỦI RO TÀI CHÍNH', color: '#EF4444', bg: 'bg-rose-500/20', text: 'text-rose-400' }
};

export default function ScreenDashboard({ 
  campaignData, budgetData, chartHistory, iteration, 
  onRestart, onRemoveActivity, onImproveFeedback 
}) {
  const feedbackInputRef = useRef(null);

  const submitFeedback = () => {
    if(feedbackInputRef.current) {
      onImproveFeedback(feedbackInputRef.current.value);
    }
  };

  const execSum = campaignData.executive_summary;
  const targetAud = campaignData.target_audience_and_brand_voice.target_audience;
  const brandVoice = campaignData.target_audience_and_brand_voice.brand_voice;
  const breakdown = campaignData.activity_and_financial_breakdown;
  const phasedExec = campaignData.phased_execution;

  const groupedPhases = breakdown.map(b => {
    const p = phasedExec.find(x => x.phase_id === b.phase_id);
    return {
      name: p ? p.phase_name : b.phase_id,
      duration: p ? p.duration : '',
      acts: b.activities
    };
  });

  const kpiGrowthData = [
    { name: 'Trước CĐ', khachMoi: 20, tuongTac: 150 },
    { name: 'Tháng 4 (P1)', khachMoi: 120, tuongTac: 900 },
    { name: 'Tháng 5 (P2)', khachMoi: 350, tuongTac: 2500 },
  ];

  return (
    <div className="h-full bg-transparent font-sans pb-16">
      <div className="bg-[#111C44] border-b border-[#1B254B] px-8 py-4 mb-8 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
        <div className="flex items-center space-x-5">
          <button onClick={onRestart} className="hover:bg-[#1B254B] p-2 rounded-lg transition-colors flex items-center text-[#A0AEC0] hover:text-white">
            <ArrowLeft size={18} className="mr-2"/> Quay Lại
          </button>
          <div className="h-6 w-px bg-[#1B254B]"></div>
          <div className="flex items-center">
            <span className="font-bold tracking-wide text-white">BrandFlow Executive <span className="text-xs bg-[#0075FF]/20 text-[#0075FF] ml-2 px-2 py-0.5 rounded-full border border-[#0075FF]/30">VER {iteration}</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Target & Roadmap */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-[#111C44] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">{execSum.campaign_name}</h1>
            <p className="text-[#A0AEC0] mt-3 mb-4 max-w-2xl text-sm leading-relaxed border-l-4 border-[#0075FF] pl-3">
               {execSum.campaign_summary}
            </p>
            <div className="bg-[#0B1437] border border-[#1B254B] p-4 rounded-xl inline-block mt-2">
               <div className="text-[11px] font-black text-[#0075FF] uppercase tracking-widest mb-1">MỤC TIÊU LÕI</div>
               <div className="text-sm font-semibold text-white">{execSum.core_objectives}</div>
            </div>
          </div>

          {/* Top Metrics */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-[#111C44] p-6 rounded-[20px] border-none shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
              <div className="text-[11px] font-black uppercase text-emerald-400 tracking-widest mb-2 flex items-center"><DollarSign size={14} className="mr-1 "/> Tổng Ngân Sách Phân Bổ</div>
              <div className="text-3xl font-black text-white">{(budgetData.reduce((s,a)=>s+a.value,0)/1000000).toLocaleString()}<span className="text-xl ml-1 font-bold text-[#A0AEC0]">Triệu</span></div>
              <div className="text-xs font-medium text-[#A0AEC0] mt-2">Ngân sách gốc: {(execSum.total_budget_vnd/1000000).toLocaleString()} Triệu</div>
            </div>
            <div className="bg-[#111C44] p-6 rounded-[20px] border-none shadow-[0_4px_24px_rgba(0,0,0,0.1)] bg-gradient-to-br from-[#1860F5] to-[#111C44] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0075FF] blur-3xl opacity-20 rounded-full translate-x-10 -translate-y-10"></div>
              <div className="text-[11px] font-black uppercase text-[#88b6ff] tracking-widest mb-2 flex items-center relative z-10"><Sparkles size={14} className="mr-1 "/> Mô hình MoSCoW</div>
              <div className="text-2xl font-black tracking-tighter w-full leading-tight mt-1 relative z-10 text-white">Tối ưu hóa<br/>Phân bổ Ngân Sách</div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-[#111C44] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="bg-[#0B1437] px-6 py-4 border-b border-[#1B254B] flex items-center">
              <Users size={18} className="text-[#A0AEC0] mr-2" />
              <h3 className="font-black text-white uppercase tracking-widest text-xs">Phân Tích Khách Hàng & Chất Giọng</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0B1437] border border-[#1B254B] p-5 rounded-2xl relative overflow-hidden group hover:border-[#0075FF]/30 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0075FF] opacity-[0.05] rounded-full blur-2xl group-hover:opacity-10 transition-opacity transform translate-x-1/4 -translate-y-1/4"></div>
                <div className="flex items-center mb-4 relative z-10">
                  <div className="bg-[#0075FF]/20 p-2.5 rounded-xl text-[#0075FF] mr-3">
                    <Users size={18}/>
                  </div>
                  <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Nhân khẩu & Lối sống</h4>
                </div>
                <p className="text-sm font-medium text-[#A0AEC0] leading-relaxed relative z-10">
                  {targetAud}
                </p>
              </div>

              <div className="bg-[#0B1437] border border-[#1B254B] p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-[0.05] rounded-full blur-2xl group-hover:opacity-10 transition-opacity transform translate-x-1/4 -translate-y-1/4"></div>
                <div className="flex items-center mb-4 relative z-10">
                  <div className="bg-emerald-500/20 p-2.5 rounded-xl text-emerald-400 mr-3">
                    <AlertTriangle size={18}/>
                  </div>
                  <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Giọng Điệu Thương Hiệu</h4>
                </div>
                <p className="font-mono text-sm font-medium text-[#A0AEC0] leading-relaxed relative z-10">
                  {brandVoice}
                </p>
              </div>
            </div>
          </div>

          {/* Editable Roadmap List GROUPED BY PHASE */}
          <div className="bg-[#111C44] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden relative">
            <div className="bg-[#0B1437] px-6 py-4 border-b border-[#1B254B] flex items-center justify-between">
              <div className="flex items-center">
                <span className="bg-[#0075FF]/20 text-[#0075FF] p-1.5 rounded-lg mr-2"><Map size={16}/></span>
                <h3 className="font-black text-white uppercase tracking-widest text-xs">Lộ Trình Từng Giai Đoạn (Chi Phí & Hoạt Động)</h3>
              </div>
            </div>
            
            <div className="p-6">
              {groupedPhases.length === 0 ? (
                <div className="text-center py-10 text-[#A0AEC0]">Roadmap đã trống.</div>
              ) : (
                <div className="relative pl-6">
                  <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-[#1B254B]"></div>
                  
                  {groupedPhases.map((phaseGroup, pIdx) => (
                    <div key={pIdx} className="mb-10 relative">
                      <div className="flex items-center mb-4">
                         <div className="absolute -left-[35px] w-6 h-6 rounded-full bg-[#0075FF] border-4 border-[#111C44] shadow flex items-center justify-center text-white text-xs font-bold">●</div>
                         <h4 className="font-black text-lg text-white">{phaseGroup.name}</h4>
                         <span className="ml-3 text-[10px] font-bold bg-[#1B254B] text-[#A0AEC0] px-3 py-1 rounded-full uppercase tracking-wider">{phaseGroup.duration}</span>
                      </div>
                      
                      {phaseGroup.acts.length === 0 && (
                        <div className="ml-2 mt-2 text-sm text-[#A0AEC0] italic border border-dashed border-[#1B254B] p-4 rounded-xl bg-[#0B1437]">
                          Không có hoạt động nào trong Phase này.
                        </div>
                      )}

                      <div className="space-y-3">
                        {phaseGroup.acts.map(act => (
                          <div key={act.id} className="group flex items-center justify-between p-4 border border-[#1B254B] rounded-xl hover:border-[#0075FF] transition-all bg-[#0B1437] relative ml-2">
                            <div className="flex-1 w-full pr-12">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <h4 className="font-bold text-white text-[15px]">{act.activity_name}</h4>
                                <span className="text-sm font-black text-white">{act.cost_vnd.toLocaleString()} đ</span>
                              </div>
                              <div className="flex items-center text-xs flex-wrap gap-y-2">
                                <span className={`${CAT_CONFIG[act.moscow_tag].bg} ${CAT_CONFIG[act.moscow_tag].text} px-2 py-0.5 rounded font-black tracking-wider border border-${CAT_CONFIG[act.moscow_tag].text}/20`}>
                                  {CAT_CONFIG[act.moscow_tag].label}
                               </span>
                                <span className="mx-2 text-[#1B254B]">•</span>
                                <span className="text-[#A0AEC0] font-medium block leading-relaxed max-w-2xl">{act.description}</span>
                              </div>
                              <div className="mt-3 text-[#0075FF] font-medium text-xs flex items-center bg-[#0075FF]/10 inline-flex px-2 py-1 rounded">
                                <Target size={12} className="mr-1.5"/> KPI: {act.kpi_commitment}
                              </div>
                            </div>
                            <button 
                              onClick={() => onRemoveActivity(act.id)}
                              className="absolute right-4 bg-rose-500/20 text-rose-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white border border-rose-500/30"
                              title="Gạch Bỏ Hạng Mục Này"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

           {/* Feedback Input Section */}
           <div className="bg-[#0B1437] rounded-[20px] border border-[#1B254B] p-6 flex items-start shadow-inner">
            <div className="bg-[#0075FF] p-3 rounded-xl text-white mr-4 shadow-sm"><PenTool size={20}/></div>
            <div className="flex-1 w-full">
              <h4 className="font-bold text-white mb-2">Không hài lòng? Viết Feedback để AI lên lại Plan</h4>
              <div className="flex">
                <input 
                  type="text"
                  ref={feedbackInputRef}
                  placeholder="Nhập yêu cầu. VD: Nhấn mạnh vào Workshop trải nghiệm trực tiếp..."
                  className="flex-1 bg-[#111C44] border border-[#1B254B] text-white p-3 rounded-l-xl text-sm outline-none focus:ring-2 focus:ring-[#0075FF] shadow-sm placeholder-[#A0AEC0]"
                />
                <button onClick={submitFeedback} className="bg-[#0075FF] hover:bg-[#0055c4] text-white font-bold px-6 py-3 rounded-r-xl transition-colors flex items-center shadow-sm whitespace-nowrap">
                  Gửi Yêu Cầu <Send size={16} className="ml-2"/>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: MoSCoW Budget & History */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-rose-500/10 rounded-[20px] border border-rose-500/20 p-6 flex items-start shadow-sm">
            <ShieldAlert className="text-rose-400 shrink-0 mt-0.5 mr-3" size={20} />
            <div>
               <h4 className="text-rose-400 font-black text-sm mb-1 uppercase tracking-wider">Lệnh Khóa Tiền Từ CFO</h4>
               <p className="text-xs text-[#A0AEC0] leading-relaxed font-semibold">Bơm ngân sách tối đa vào lượng MUST_HAVE. Các khoản COULD_HAVE sẽ là đối tượng đầu tiên bị CFO cắt rủi ro nếu chiến dịch cần huy động vốn khẩn cấp.</p>
            </div>
          </div>

          <div className="bg-[#111C44] rounded-[20px] border border-[#1B254B] shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative border-t-8 border-t-[#0075FF]">
            <div className="px-6 py-5 border-b border-[#1B254B] flex justify-between items-center bg-[#111C44]">
              <h3 className="font-black text-white uppercase tracking-widest text-sm">Cơ Cấu MoSCoW</h3>
              <BarChart3 size={16} className="text-[#0075FF]" />
            </div>
            
            <div className="p-6 relative bg-[#111C44]">
               <div className="h-56 w-full relative">
                {budgetData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={budgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                        {budgetData.map((entry, index) => <Cell key={`cell-${index}`} fill={CAT_CONFIG[entry.cat].color} />)}
                      </Pie>
                      <RechartsTooltip formatter={(val) => val.toLocaleString() + ' đ'} contentStyle={{backgroundColor: '#0B1437', borderColor: '#1B254B', color: 'white'}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-[#A0AEC0] font-bold">Rỗng Ngân Sách</div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-white tracking-tighter">{(budgetData.reduce((s,a)=>s+a.value,0)/1000000)}Tr</span>
                  <span className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-widest mt-0.5">Tiền Phân Bổ</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {budgetData.map((item, idx) => (
                   <div key={idx} className={`flex justify-between items-center ${CAT_CONFIG[item.cat].bg} p-3 rounded-lg border border-${CAT_CONFIG[item.cat].text}/20`}>
                     <span className={`font-medium ${CAT_CONFIG[item.cat].text} text-[11px] truncate mr-2`}>{item.name}</span>
                     <span className={`font-black ${CAT_CONFIG[item.cat].text} text-sm shrink-0`}>{(item.value/1000000).toLocaleString()} Tr đ</span>
                   </div>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Projection Chart */}
          <div className="bg-[#111C44] rounded-[20px] border border-[#1B254B] shadow-[0_4px_24px_rgba(0,0,0,0.1)] p-6">
            <h3 className="font-black text-white uppercase tracking-widest text-sm mb-6 flex items-center">
              <Target size={16} className="text-emerald-400 mr-2" /> Dự Phóng Tăng Trưởng KPI
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpiGrowthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1B254B" vertical={false} />
                  <XAxis dataKey="name" stroke="#A0AEC0" tick={{fontSize: 10}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#A0AEC0" tick={{fontSize: 10}} axisLine={false} tickLine={false} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{backgroundColor: '#0B1437', borderColor: '#1B254B', color: 'white', borderRadius: '8px'}}
                    itemStyle={{fontSize: 12}}
                    labelStyle={{fontSize: 12, fontWeight: 'bold', color: '#A0AEC0', marginBottom: '4px'}}
                  />
                  <Legend wrapperStyle={{fontSize: 11, paddingTop: '10px'}} iconType="circle" />
                  <Line type="monotone" dataKey="khachMoi" name="Khách Mới (Người)" stroke="#10B981" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#111C44'}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="tuongTac" name="Tương Tác (Lượt)" stroke="#0075FF" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#111C44'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {chartHistory.length > 0 && (
             <div className="bg-[#111C44] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-[#1B254B]">
               <h3 className="font-bold text-white mb-4 flex items-center text-sm uppercase tracking-wider"><History size={16} className="mr-2 text-[#0075FF]"/> Lịch Sử Sửa Đổi</h3>
               <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                 {[...chartHistory].reverse().map((hist, idx) => (
                    <div key={idx} className="bg-[#0B1437] border border-[#1B254B] p-3 rounded-xl flex items-center hover:bg-[#1B254B] transition-colors">
                      <div className="w-10 h-10 shrink-0 mr-3">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={hist.data} cx="50%" cy="50%" innerRadius={10} outerRadius={18} dataKey="value" stroke="none">
                                {hist.data.map((entry, i) => <Cell key={i} fill={CAT_CONFIG[entry.cat].color} />)}
                              </Pie>
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="flex-1">
                         <span className="font-black text-white text-[11px] uppercase block">Lần Cải Thiện Số {hist.v}</span>
                         <span className="text-[10px] font-medium text-[#A0AEC0]">Ngân sách: {(hist.data.reduce((s,a)=>s+a.value,0)/1000000)} Triệu VND</span>
                      </div>
                    </div>
                 ))}
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
