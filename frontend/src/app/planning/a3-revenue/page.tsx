import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import VisualDashboards from '@/components/b2b/VisualDashboards';
import FinancialDataGrid from '@/components/b2b/FinancialDataGrid';

export default function PageA3Revenue() {
  return (
    <B2BPageTemplate
      title="Dự phóng Doanh thu & Chỉ số Tài chính"
      description="Tính toán và trực quan hóa kỳ vọng P&L cùng với tăng trưởng biên lợi nhuận gộp trong dài hạn."
    >
      <div className="space-y-6">
        <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-r-md">
          <p className="text-sm text-emerald-300">
            <strong>Mục tiêu Tài chính:</strong> Các biểu đồ dưới đây mô phỏng đầu ra của toán cốt lõi. Số liệu dự phóng được tính toán dựa trên các tham số cơ sở của Năm t0.
          </p>
        </div>
        
        <FinancialDataGrid />
        
        <div className="mt-8 border-t border-white/10 pt-8">
           <VisualDashboards />
        </div>
      </div>
    </B2BPageTemplate>
  );
}
