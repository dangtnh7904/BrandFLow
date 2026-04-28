"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { PlayCircle, Clock, ShieldCheck } from 'lucide-react';

export default function PageB0Overview() {
  const { localData, saveStatus } = useAutoSaveForm('b0-overview', { });
  return (
    <>
      <B2BPageTemplate
      saveStatus={saveStatus}
        title="Tổng quan Phần B: Vận Hành (Operations)"
        description="Chào mừng bạn đến với chiến trường thực sự. Nơi mà các tuyên bố hoa mỹ ở Phần A biến thành KPIs cụ thể."
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-background to-linear-surface border-b border-linear-border rounded-xl p-8 text-blue-400 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <h2 className="text-2xl font-bold mb-3 relative z-10">Mục tiêu của Phần B là gì?</h2>
             <p className="text-linear-text-muted leading-relaxed max-w-3xl relative z-10 text-lg">
               Chúng ta sẽ triển khai cụ thể: <br/>
               <strong>1. Phải làm GÌ?</strong> (Mục tiêu 1 năm)<br/>
               <strong>2. Ai làm và BAO GIỜ xong?</strong> (Kế hoạch hành động & Gantt)<br/>
               <strong>3. Điều gì sẽ TỆ ĐI?</strong> (Kế hoạch dự phòng)
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-full flex items-center justify-center mb-4">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Thực thi ngay</h3>
                <p className="text-sm text-linear-text-muted">Chuyển hóa Chiến lược thành các Tactic nhỏ lẻ phân bổ ngân sách xuống từng Team.</p>
             </div>
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Kiểm soát tiến độ</h3>
                <p className="text-sm text-linear-text-muted">Xây dựng Task list và mốc thời hạn với Tactical Gantt Chart.</p>
             </div>
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Quản trị rủi ro</h3>
                <p className="text-sm text-linear-text-muted">Chuẩn bị sẵn "Phao cứu sinh" cho công việc nếu lỡ như thị trường biến động.</p>
             </div>
          </div>
          
          <div className="bg-linear-surface/30 backdrop-blur-sm border border-linear-border rounded-xl p-6 flex items-center justify-between">
             <WizardNavigation prevLink="/planning/a9-budget" prevLabel="Về A.9 Ngân sách" nextLink="/planning/b1-objectives" nextLabel="Tiếp tục: B.1 Mục tiêu Vận hành" />
          </div>
        </div>
      </B2BPageTemplate>
      
          </>
  );
}
