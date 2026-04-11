import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import TextBuilderForm from '@/components/b2b/TextBuilderForm';

export default function PageA1Mission() {
  return (
    <B2BPageTemplate
      title="Sứ mệnh & Định nghĩa"
      description="Xác định tuyên ngôn sứ mệnh cốt lõi, vai trò và các định hướng bao trùm cho doanh nghiệp."
    >
      <div className="space-y-6">
        <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-md">
          <p className="text-sm text-blue-300">
            <strong>Lưu ý Chiến lược:</strong> Tài liệu này đóng vai trò là mỏ neo chính. Tất cả các chiến dịch và chiến thuật tiếp theo phải bám sát vào Năng lực Lõi và Định hướng được xác định ở đây.
          </p>
        </div>
        
        <TextBuilderForm />
      </div>
    </B2BPageTemplate>
  );
}
