import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import VisualDashboards from '@/components/b2b/VisualDashboards';

export default function PageC2Matrix() {
  return (
    <B2BPageTemplate
      title="Ma trận Tổng hợp HQ"
      description="Dashboard cấp cao tổng hợp các chỉ số danh mục đầu tư và doanh thu trên toàn bộ hệ sinh thái của tập đoàn."
    >
      <div className="space-y-6">
        <div className="bg-indigo-500/10 border-l-4 border-indigo-500 p-4 rounded-r-md">
          <p className="text-sm text-indigo-300">
            <strong>HQ Visualizer:</strong> Các biểu đồ phân tán và Dashboard ở cấp độ này tóm tắt các chỉ số tổng hợp toàn diện nhất từ tầng vận hành bên dưới.
          </p>
        </div>
        
        <VisualDashboards />
      </div>
    </B2BPageTemplate>
  );
}
