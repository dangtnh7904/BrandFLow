import React from 'react';
import { ClipboardList, Wallet, Cpu, ClipboardCheck, MoreHorizontal } from 'lucide-react';

const TOP_CARDS = [
  { id: 1, title: 'Kế hoạch đang chạy', value: '12', trend: '+2', trendColor: 'text-emerald-400', icon: ClipboardList, bg: 'bg-[#1860F5]' },
  { id: 2, title: 'Ngân sách quản lý', value: '$45K', trend: '+15%', trendColor: 'text-emerald-400', icon: Wallet, bg: 'bg-[#1860F5]' },
  { id: 3, title: 'Quy tắc đã học', value: '128', trend: '+12%', trendColor: 'text-emerald-400', icon: Cpu, bg: 'bg-[#1860F5]' },
  { id: 4, title: 'Chờ phê duyệt', value: '5', trend: '-1', trendColor: 'text-indigo-600 dark:text-indigo-400', icon: ClipboardCheck, bg: 'bg-[#1860F5]' },
];

const CAMPAIGNS = [
  { id: 1, name: 'Summer Sale 2026', iconBg: 'bg-indigo-600 shadow-[0_4px_15px_rgba(79,70,229,0.3)]', goal: 'Thu hút khách mua', status: 'Đã duyệt', statusDot: 'bg-indigo-600 shadow-[0_4px_15px_rgba(79,70,229,0.3)]', budget: '$15,000', date: '23/04/26', agents: 'MasterPlanner, CFO' },
  { id: 2, name: 'Tet Holiday Promo', iconBg: 'bg-indigo-600 shadow-[0_4px_15px_rgba(79,70,229,0.3)]', goal: 'Nhận diện thương hiệu', status: 'Chờ duyệt (HITL)', statusDot: 'bg-amber-400', budget: '$8,500', date: '11/01/26', agents: 'MasterPlanner' },
  { id: 3, name: 'Loyalty Program Revamp', iconBg: 'bg-red-500', goal: 'Giữ chân khách hàng', status: 'CFO Từ chối', statusDot: 'bg-red-500', budget: '$25,000', date: '19/09/25', agents: 'CFO, Learner' },
  { id: 4, name: 'New Product Launch', iconBg: 'bg-indigo-600 shadow-[0_4px_15px_rgba(79,70,229,0.3)]', goal: 'Thu hút khách mua', status: 'Đã duyệt', statusDot: 'bg-indigo-600 shadow-[0_4px_15px_rgba(79,70,229,0.3)]', budget: '$50,000', date: '24/12/25', agents: 'MasterPlanner, CFO' },
];

export default function DashboardOverview() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {TOP_CARDS.map(card => (
          <div key={card.id} className="bg-white dark:bg-zinc-900 rounded-[20px] p-6 shadow-sm border border-slate-200 dark:border-zinc-800 relative overflow-hidden group transition-colors duration-300">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`${card.bg} p-3 rounded-2xl`}>
                <card.icon className="w-6 h-6 text-slate-800 dark:text-white" />
              </div>
              <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-800 dark:text-white mb-1">{card.value}</h3>
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">{card.title}</p>
                <span className={`text-sm font-bold ${card.trendColor}`}>{card.trend}</span>
              </div>
            </div>
            {/* Subtle background glow */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${card.bg} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[20px] p-6 shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800">
                  <th className="pb-4 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">TÊN CHIẾN DỊCH</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">MỤC TIÊU</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">TRẠNG THÁI</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">NGÂN SÁCH</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">NGÀY TẠO</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">AGENTS</th>
                </tr>
              </thead>
              <tbody>
                {CAMPAIGNS.map((camp, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-zinc-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-5 flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${camp.iconBg}`}>
                         <ClipboardList className="w-4 h-4 text-slate-800 dark:text-white" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-800 dark:text-white text-sm">{camp.name}</span>
                    </td>
                    <td className="py-5 text-sm font-medium text-slate-600 dark:text-zinc-400">{camp.goal}</td>
                    <td className="py-5">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${camp.statusDot}`}></span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-800 dark:text-white">{camp.status}</span>
                      </div>
                    </td>
                    <td className="py-5 text-sm font-bold text-slate-800 dark:text-slate-800 dark:text-white">{camp.budget}</td>
                    <td className="py-5 text-sm font-medium text-slate-600 dark:text-zinc-400">{camp.date}</td>
                    <td className="py-5 text-sm font-medium text-slate-600 dark:text-zinc-400">
                       <div className="flex flex-col">
                          {camp.agents.split(', ').map(agent => (
                            <span key={agent} className="leading-tight">{agent}</span>
                          ))}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Allocation Widget */}
        <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-6 shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-800 dark:text-white tracking-tight mb-8">Phân bổ ngân sách</h3>
            
            <div className="space-y-6">
              {/* Progress Item 1 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-800 dark:text-white">Sáng tạo & Nội dung</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-800 dark:text-white">45%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              {/* Progress Item 2 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-800 dark:text-white">Quảng cáo & Truyền thông</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-800 dark:text-white">35%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>

               {/* Progress Item 3 */}
               <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-800 dark:text-white">Vận hành & Công cụ</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-800 dark:text-white">20%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2">
                  <div className="bg-slate-300 dark:bg-zinc-600 h-full rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
              Tác nhân <span className="font-bold text-slate-800 dark:text-slate-800 dark:text-white">CFO</span> tự động tối ưu hóa phân bổ ngân sách cho từng kế hoạch để tuân thủ hạn mức công ty và dữ liệu ROI trong quá khứ.
            </p>
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-slate-800 dark:text-white font-bold text-sm tracking-wide transition-all shadow-[0_4px_15px_rgba(79,70,229,0.3)]">
              ĐIỀU CHỈNH HẠN MỨC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
