import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import TacticalGantt from '@/components/b2b/TacticalGantt';

export default function PageB3Action() {
  return (
    <B2BPageTemplate
      title="Kế hoạch Hành động"
      description="Thiết lập mục tiêu chiến thuật rõ ràng, chỉ định người phụ trách và quản lý ngân sách bao trùm."
    >
      <div className="space-y-6">
        <div className="bg-slate-500/10 border-l-4 border-slate-500 p-4 rounded-r-md">
          <p className="text-sm text-slate-300">
            <strong>Quy tắc Thực thi:</strong> Mỗi chiến thuật phải có người chịu trách nhiệm rõ ràng và giới hạn ngân sách (budget cap). Danh sách này được liên kết trực tiếp với tiến độ B7 Gantt.
          </p>
        </div>
        
        <div className="opacity-95">
           {/* Reusing the Matrix from TacticalGantt Blueprint */}
           <TacticalGantt />
        </div>
      </div>
    </B2BPageTemplate>
  );
}
