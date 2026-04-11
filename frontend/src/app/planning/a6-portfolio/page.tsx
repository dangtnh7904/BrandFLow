import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import VisualDashboards from '@/components/b2b/VisualDashboards';

export default function PageA6Portfolio() {
  return (
    <B2BPageTemplate
      title="Ma trận Định vị & Trọng tâm"
      description="Đánh giá các danh mục sản phẩm/dịch vụ dựa trên tiêu chí Sức hấp dẫn Thị trường và Năng lực Cạnh tranh."
    >
      <div className="space-y-6">
        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-md">
          <p className="text-sm text-orange-300">
            <strong>Chiến lược Đầu tư:</strong> Sản phẩm ở góc trên cùng bên phải yêu cầu dòng vốn đầu tư (Invest/Grow). Sản phẩm ở khu vực dưới cùng bên trái nằm trong diện xem xét thoái vốn dự phòng (Harvest/Divest).
          </p>
        </div>
        
        <div className="max-w-4xl">
           <VisualDashboards />
        </div>
      </div>
    </B2BPageTemplate>
  );
}
