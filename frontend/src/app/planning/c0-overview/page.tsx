"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';
import { Building2, Network, BarChart3 } from 'lucide-react';

export default function PageC0Overview() {
  const { localData, saveStatus } = useAutoSaveForm('c0-overview', { });
  return (
    <>
      <B2BPageTemplate
      saveStatus={saveStatus}
        title="Tổng quan Phần C: Hợp nhất (Summary HQ)"
        description="Chào mừng Ban điều hành cấp cao. Nơi quy tụ kết quả làm việc của tất cả các SBU về một mối."
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-background to-linear-surface border-b border-linear-border rounded-xl p-8 text-indigo-400 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <h2 className="text-2xl font-bold mb-3 relative z-10">Mục tiêu của Phần C là gì?</h2>
             <p className="text-linear-text-muted leading-relaxed max-w-3xl relative z-10 text-lg">
               Đứng ở góc nhìn Tập đoàn/Tổng công ty (HQ): <br/>
               <strong>1. Chia tiền/nguồn lực thế nào?</strong> (Dựa vào BCG Matrix)<br/>
               <strong>2. Các lỗi hệ thống chung?</strong> (Vấn đề chéo của SBU)<br/>
               <strong>3. Giám sát từ xa?</strong> (Dashboard Điều hành)
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Tầm nhìn HQ</h3>
                <p className="text-sm text-linear-text-muted">Giới hạn định hướng vĩ mô bao trùm mọi nhãn hiệu trực thuộc.</p>
             </div>
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-full flex items-center justify-center mb-4">
                  <Network className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Giải quyết Cộng hưởng</h3>
                <p className="text-sm text-linear-text-muted">Đôi khi vấn đề kho bãi của SBU này lại là dư thừa của SBU kia.</p>
             </div>
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Executive Dashboard</h3>
                <p className="text-sm text-linear-text-muted">Xem nhanh chỉ số sức khỏe của mọi SBU chỉ với 1 bảng gộp duy nhất.</p>
             </div>
          </div>
          
          <div className="bg-linear-surface/30 backdrop-blur-sm border border-linear-border rounded-xl p-6 flex items-center justify-between">
             <WizardNavigation prevLink="/planning/b6-gantt" prevLabel="Về B.6 Tiến độ" nextLink="/planning/c1-direction" nextLabel="Khởi chạy Dashboard: C.1 Định hướng" />
          </div>
        </div>
      </B2BPageTemplate>
      
      <MascotChatbot 
        formName="Tổng quan Phần C"
        purpose="Chào mừng tới vị trí Chỉ Huy Tối Cao (HQ). Góc nhìn của bạn ở đây không còn là 'Bán đôi giày này thế nào', mà là 'Sân chơi thời trang này đáng để chúng ta ném đi bao nhiêu tiền?'"
        sections={[
          { title: 'SBU nghĩa là gì?', explanation: 'SBU (Strategic Business Unit) là các Đơn vị kinh doanh chiến lược độc lập. Ví dụ Unilever có SBU Dầu gội, có SBU Bột giặt. Ở HQ, bạn nắm quyền sinh sát tất cả các SBU.' },
        ]}
      />
    </>
  );
}
