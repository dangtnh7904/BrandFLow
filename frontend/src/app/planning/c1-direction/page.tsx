import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import TextBuilderForm from '@/components/b2b/TextBuilderForm';

export default function PageC1Direction() {
  return (
    <B2BPageTemplate
      title="Định hướng Tập đoàn / HQ"
      description="Hợp nhất sứ mệnh và các định hướng chiến lược trên toàn bộ các thương hiệu vệ tinh."
    >
      <div className="space-y-6">
        <div className="bg-indigo-500/10 border-l-4 border-indigo-500 p-4 rounded-r-md">
          <p className="text-sm text-indigo-300">
            <strong>Cấp độ HQ:</strong> Chức năng này đại diện cho chiến lược của công ty mẹ (Parent Group). Các sứ mệnh của thương hiệu con (A1) phải kế thừa và đồng bộ hóa với giá trị gốc này.
          </p>
        </div>
        
        <TextBuilderForm />
      </div>
    </B2BPageTemplate>
  );
}
