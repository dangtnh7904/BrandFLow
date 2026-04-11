import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import TacticalGantt from '@/components/b2b/TacticalGantt';

export default function PageB7Gantt() {
  return (
    <B2BPageTemplate
      title="Bảng tiến độ chiến lược (12-Month Gantt)"
      description="Biểu đồ tiến độ thực thi vi mô minh họa tất cả các điểm chạm vận hành trong suốt năm tài chính."
    >
      <div className="space-y-6">
        <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-r-md">
          <p className="text-sm text-emerald-300">
            <strong>Kiểm tra Vận hành:</strong> Đảm bảo tất cả các điểm chạm chiến thuật được ánh xạ bên dưới có tương ứng trực tiếp với ngân sách đã được phê duyệt trong Bảng Kế hoạch Hành động (B3).
          </p>
        </div>
        
        <TacticalGantt />
      </div>
    </B2BPageTemplate>
  );
}
