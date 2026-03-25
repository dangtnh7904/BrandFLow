import React, { useRef } from 'react';
import { 
  Briefcase, Target, DollarSign, Sparkles, Users, AlertTriangle, XCircle, Map, ShieldAlert, BarChart3, History, PenTool, Send, ArrowLeft
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const CAT_CONFIG = {
  MUST: { label: 'BẮT BUỘC LÕI', color: '#10B981', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  SHOULD: { label: 'NÊN CÓ', color: '#F59E0B', bg: 'bg-amber-100', text: 'text-amber-800' },
  COULD: { label: 'RỦI RO TÀI CHÍNH', color: '#EF4444', bg: 'bg-rose-100', text: 'text-rose-800' }
};

export default function ScreenDashboard({ 
  activities, budgetData, chartHistory, iteration, 
  onRestart, onRemoveActivity, onImproveFeedback 
}) {
  const feedbackInputRef = useRef(null);

  const submitFeedback = () => {
    if(feedbackInputRef.current) {
      onImproveFeedback(feedbackInputRef.current.value);
    }
  };

  const phasesMap = activities.reduce((acc, obj) => {
    const key = obj.phaseName;
    if (!acc[key]) acc[key] = { name: key, duration: obj.phase, acts: [] };
    acc[key].acts.push(obj);
    return acc;
  }, {});
  const groupedPhases = Object.values(phasesMap);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center space-x-5">
          <button onClick={onRestart} className="hover:bg-slate-800 p-2 rounded-lg transition-colors flex items-center text-slate-300 hover:text-white">
            <ArrowLeft size={18} className="mr-2"/> Quay Lại
          </button>
          <div className="h-6 w-px bg-slate-700"></div>
          <div className="flex items-center">
            <Briefcase className="text-blue-400 mr-2" />
            <span className="font-bold tracking-wide">BrandFlow Executive <span className="text-xs bg-blue-500/20 text-blue-300 ml-2 px-2 py-0.5 rounded-full border border-blue-500/30">VER {iteration}</span></span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-8 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hương Viên Trà Quán</h1>
            <p className="text-slate-500 mt-2 max-w-2xl text-sm leading-relaxed border-l-4 border-blue-500 pl-3">
               Định vị quán thành trạm dừng chân chữa lành tâm hồn, sử dụng nội dung mạng xã hội có chiều sâu và sự kiện workshop để thu hút khách hàng hướng nội sau Tết.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Target & Roadmap */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top Metrics */}
          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center"><Target size={14} className="mr-1 text-blue-500"/> Mục tiêu KH mới</div>
              <div className="text-3xl font-black text-slate-800">20% Mới</div>
              <div className="text-xs font-semibold text-emerald-600 mt-2 block">+15% Tổng Doanh Thu</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[11px] font-black uppercase text-emerald-500 tracking-widest mb-2 flex items-center"><DollarSign size={14} className="mr-1 "/> Tổng Vốn</div>
              <div className="text-3xl font-black text-slate-800">{(budgetData.reduce((s,a)=>s+a.value,0)/1000000).toLocaleString()}<span className="text-xl ml-1 font-bold text-slate-400">Triệu</span></div>
              <div className="text-xs font-medium text-slate-400 mt-2">Ngân sách eo hẹp thực tế</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-indigo-900 to-slate-800 text-white border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-3xl opacity-20 rounded-full translate-x-10 -translate-y-10"></div>
              <div className="text-[11px] font-black uppercase text-blue-400 tracking-widest mb-2 flex items-center"><Sparkles size={14} className="mr-1 "/> Mô hình MoSCoW</div>
              <div className="text-2xl font-black tracking-tighter w-full leading-tight mt-1 text-white">Chốt Cứng 75%<br/>Ngân Sách Lõi</div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center">
              <Users size={18} className="text-slate-700 mr-2" />
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Phân Tích Khách Hàng & Chất Giọng</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Nhân khẩu & Lối sống</h4>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mt-0.5 mr-3 bg-blue-50 p-1.5 rounded-md text-blue-600"><Briefcase size={14}/></div>
                    <span className="text-sm font-semibold text-slate-700 leading-tight">Thu nhập ổn định, hướng nội, yêu văn hóa truyền thống</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-0.5 mr-3 bg-rose-50 p-1.5 rounded-md text-rose-600"><AlertTriangle size={14}/></div>
                    <div>
                      <span className="text-xs font-bold text-rose-600 block mb-0.5">Điểm Đau (Pain Point):</span>
                      <span className="text-sm font-medium text-slate-600 bg-rose-50">Áp lực công việc đô thị bận rộn sau Tết, cần không gian tĩnh lặng. Phục vụ tinh tế.</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Giọng Điệu Thương Hiệu</h4>
                <div className="bg-slate-900 rounded-xl p-5 text-white h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="relative z-10">
                    <p className="font-mono text-sm leading-relaxed text-blue-50 mb-3 tracking-wide border-b border-slate-700 pb-3">
                      "Chậm rãi, chân thành, mang đậm tính thiền vị và chữa lành. Kể chuyện văn hóa."
                    </p>
                    <div className="inline-flex items-center text-rose-300 text-xs rounded-full font-medium">
                      <XCircle size={14} className="mr-1.5" /> Tránh xa ngôn từ chạy sale, giật tít ồn ào.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Roadmap List GROUPED BY PHASE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center">
                <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg mr-2"><Map size={16}/></span>
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Lộ Trình Từng Giai Đoạn (Sắp xếp theo Timeline)</h3>
              </div>
            </div>
            
            <div className="p-6">
              {groupedPhases.length === 0 ? (
                <div className="text-center py-10 text-slate-400">Roadmap đã trống.</div>
              ) : (
                <div className="relative pl-6">
                  <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-slate-200"></div>
                  
                  {groupedPhases.map((phaseGroup, pIdx) => (
                    <div key={pIdx} className="mb-10 relative">
                      <div className="flex items-center mb-4">
                         <div className="absolute -left-[35px] w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow flex items-center justify-center text-white text-xs font-bold">●</div>
                         <h4 className="font-black text-lg text-slate-900">{phaseGroup.name}</h4>
                         <span className="ml-3 text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase tracking-wider">{phaseGroup.duration}</span>
                      </div>
                      <div className="space-y-3">
                        {phaseGroup.acts.map(act => (
                          <div key={act.id} className="group flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all bg-white relative ml-2">
                            <div className="flex-1 w-full pr-12">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <h4 className="font-bold text-slate-800 text-[15px]">{act.name}</h4>
                                <span className="text-sm font-black text-slate-900">{act.cost.toLocaleString()} đ</span>
                              </div>
                              <div className="flex items-center text-xs flex-wrap gap-y-2">
                                <span className={`${CAT_CONFIG[act.cat].bg} ${CAT_CONFIG[act.cat].text} px-2 py-0.5 rounded font-black tracking-wider border border-${CAT_CONFIG[act.cat].text}/20`}>
                                  {CAT_CONFIG[act.cat].label}
                               </span>
                                <span className="mx-2 text-slate-300">•</span>
                                <span className="text-slate-500 font-medium">{act.desc}</span>
                                <span className="mx-2 text-slate-300">•</span>
                                <span className="text-blue-600 font-bold flex items-center"><Target size={12} className="mr-1"/> KPI: {act.kpi}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => onRemoveActivity(act.id)}
                              className="absolute right-4 bg-rose-50 text-rose-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white border border-rose-100"
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
           <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6 flex items-start shadow-inner">
            <div className="bg-indigo-600 p-3 rounded-xl text-white mr-4 shadow-sm"><PenTool size={20}/></div>
            <div className="flex-1 w-full">
              <h4 className="font-bold text-indigo-900 mb-2">Không hài lòng? Viết Feedback để AI lên lại Plan</h4>
              <div className="flex">
                <input 
                  type="text"
                  ref={feedbackInputRef}
                  placeholder="Nhập yêu cầu. VD: Tôi muốn bỏ tiền chạy Workshop, tập trung Ads..."
                  className="flex-1 border border-indigo-200 p-3 rounded-l-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
                <button onClick={submitFeedback} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-r-xl transition-colors flex items-center shadow-sm">
                  Gửi Lệnh Cải Thiện <Send size={16} className="ml-2"/>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: MoSCoW Budget & History */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-rose-50 rounded-2xl border border-rose-100 p-6 flex items-start shadow-sm">
            <ShieldAlert className="text-rose-500 shrink-0 mt-0.5 mr-3" size={20} />
            <div>
               <h4 className="text-rose-800 font-black text-sm mb-1 uppercase tracking-wider">Lệnh Khóa Tiền Từ CFO</h4>
               <p className="text-xs text-rose-700 leading-relaxed font-semibold">Khóa cứng chốt 75% ngân sách vào khối lượng MUST HAVE. Mọi khoản "quà tặng mứt" (COULD HAVE) là khoản chi sẵn sàng gạch bỏ để thế chấp bảo toàn dòng tiền nếu FB Ads tăng giá đầu tháng 4!</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-t-8 border-t-slate-900 shadow-sm overflow-hidden flex flex-col relative">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Cơ Cấu Chi Phí</h3>
              <BarChart3 size={16} className="text-blue-500" />
            </div>
            
            <div className="p-6 relative bg-white">
               <div className="h-56 w-full relative">
                {budgetData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={budgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                        {budgetData.map((entry, index) => <Cell key={`cell-${index}`} fill={CAT_CONFIG[entry.cat].color} />)}
                      </Pie>
                      <Tooltip formatter={(val) => val.toLocaleString() + ' đ'} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">Rỗng Ngân Sách</div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">{(budgetData.reduce((s,a)=>s+a.value,0)/1000000)}Tr</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tổng Tiền Phân Bổ</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {budgetData.map((item, idx) => (
                   <div key={idx} className={`flex justify-between items-center ${CAT_CONFIG[item.cat].bg} p-3 rounded-lg border border-${CAT_CONFIG[item.cat].text}/10`}>
                     <span className={`font-black ${CAT_CONFIG[item.cat].text} text-[11px] tracking-wider`}>{item.name}</span>
                     <span className={`font-black ${CAT_CONFIG[item.cat].text} text-sm`}>{(item.value/1000000).toLocaleString()} Tr đ</span>
                   </div>
                ))}
              </div>
            </div>
          </div>

          {chartHistory.length > 0 && (
             <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center text-sm uppercase tracking-wider"><History size={16} className="mr-2 text-blue-500"/> Lịch Sử Sửa Đổi</h3>
               <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                 {[...chartHistory].reverse().map((hist, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center hover:bg-slate-100 transition-colors">
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
                         <span className="font-black text-slate-900 text-[11px] uppercase block">Lần Cải Thiện Số {hist.v}</span>
                         <span className="text-[10px] font-bold text-slate-500">Ngân sách: {(hist.data.reduce((s,a)=>s+a.value,0)/1000000)} Triệu VND</span>
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
