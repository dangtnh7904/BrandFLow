import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import ContingencyTable from '@/components/b2b/ContingencyTable';

export default function PageB5Contingency() {
  return (
    <B2BPageTemplate
      title="Kế hoạch Dự phòng rủi ro"
      description="Lập sơ đồ các sự kiện rủi ro, xác định ngưỡng kích hoạt và thiết lập hành động ứng phó."
    >
      <div className="space-y-6">
        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-md">
          <p className="text-sm text-orange-300">
            <strong>Giao thức Rủi ro:</strong> Một khi Điểm Kích Hoạt (Trigger Point) bị vi phạm trong quá trình vận hành, Hành động Dự phòng tương ứng phải được kích hoạt ngay lập tức mà không cần chờ phê duyệt.
          </p>
        </div>
        
        <ContingencyTable />
      </div>
    </B2BPageTemplate>
  );
}
