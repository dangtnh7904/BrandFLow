"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';
import { Target, TrendingUp, ShieldAlert, PieChart, Users } from 'lucide-react';

export default function PageA0Overview() {
  const { localData, saveStatus } = useAutoSaveForm('a0-overview', { });
  return (
    <>
      <B2BPageTemplate
      saveStatus={saveStatus}
        title="Tổng quan Phần A: Chiến Lược (Strategy)"
        description="Chào mừng bạn đến với giai đoạn nền tảng nhất của lộ trình. Phần này giúp định hình bức tranh lớn trước khi hành động."
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-background to-linear-surface border-b border-linear-border rounded-xl p-8 text-cyan-400 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <h2 className="text-2xl font-bold mb-3 relative z-10">Mục tiêu của Phần A là gì?</h2>
             <p className="text-linear-text-muted leading-relaxed max-w-3xl relative z-10 text-lg">
               Chúng ta sẽ cùng nhau trả lời 3 câu hỏi lớn nhất: <br/>
               <strong>1. Chúng ta là ai?</strong> (Sứ mệnh)<br/>
               <strong>2. Chúng ta đang đứng ở đâu?</strong> (Hiệu suất & SWOT)<br/>
               <strong>3. Chúng ta muốn đi tới đâu?</strong> (Mục tiêu & Ngân sách)
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Đích đến rõ ràng</h3>
                <p className="text-sm text-linear-text-muted">Form A.1 sẽ giúp bạn xác định Sứ mệnh, ngăn chặn việc kinh doanh lan man.</p>
             </div>
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Nhìn lại 3 năm</h3>
                <p className="text-sm text-linear-text-muted">Form A.2 & A.3 bóc tách hiệu suất quá khứ làm bàn đạp cho tương lai.</p>
             </div>
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Trận đồ Cạnh tranh</h3>
                <p className="text-sm text-linear-text-muted">Giúp bạn biết đâu là tử huyệt của đối thủ thông qua Ma trận SWOT và Market Map.</p>
             </div>
          </div>
          
          <div className="bg-linear-surface/30 backdrop-blur-sm border border-linear-border rounded-xl p-6 flex items-center justify-between">
             <div>
               <h3 className="font-bold text-foreground text-lg mb-1">Bạn đã sẵn sàng chưa?</h3>
               <p className="text-linear-text-muted text-sm">Quá trình này có thể tốn khoảng 30 phút. Bạn có thể sử dụng AI Assistant ở góc phải để phân tích nhanh.</p>
             </div>
             <WizardNavigation nextLink="/planning/a1-mission" nextLabel="Bắt đầu A.1 Tuyên bố Sứ mệnh" />
          </div>
        </div>
      </B2BPageTemplate>
      
      <MascotChatbot 
        formName="Tổng quan Phần A"
        purpose="Tôi đứng đây để đảm bảo bạn khởi đầu suôn sẻ! Tính năng 'Tổng quan' này giúp bạn nắm được bản đồ tư duy trước khi lạc vào mê hồn trận của Planning."
        sections={[
          { title: 'Phần này khó cỡ nào?', explanation: 'Bình thường! Đa phần là các câu hỏi giúp bạn nhìn nhận lại việc kinh doanh. Dữ liệu tài chính sẽ có Mẫu AI điền giúp.' },
          { title: 'Tôi chưa có đủ số liệu?', explanation: 'Không sao cả! Lập kế hoạch là nghệ thuật dự phóng. Chỗ nào thiếu, bạn cứ đưa ra Giả định (Assumptions) nhé!' }
        ]}
      />
    </>
  );
}
