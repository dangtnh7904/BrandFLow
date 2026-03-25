import React from 'react';
import { UploadCloud, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';

export default function ScreenUpload({ onGenerate }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-slate-900 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Briefcase className="text-blue-400" />
              <span className="font-bold text-xl tracking-wide">BrandFlow AI</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">Khởi Tạo Chiến Dịch B2B</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Xin chào! Cung cấp tài liệu và yêu cầu của bạn, AI Agents của chúng tôi sẽ tự động tranh luận và chốt phương án tối ưu ROI nhất.</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-2">Automated Roles</span>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-emerald-400"/> CMO (Growth Planner)</li>
              <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-rose-400"/> CFO (Risk Controller)</li>
            </ul>
          </div>
        </div>
        
        <div className="md:w-2/3 p-8 flex flex-col justify-center">
          
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-2">Tên Chiến Dịch</label>
            <input 
              type="text" 
              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              defaultValue="Hương Viên Trà Quán: Tìm Lại Sự Tĩnh Tại Sau Dịp Tết"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-2">Tài Liệu Cốt Lõi (Guideline/Brief)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer">
              <UploadCloud size={32} className="text-blue-500 mb-2" />
              <p className="text-sm font-medium text-slate-700">Kéo thả hoặc nhấn để Upload</p>
              <p className="text-xs mt-1 text-slate-400">PDF, DOCX (Max 10MB)</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Mô Tả Chuyên Sâu & Yêu Cầu Của Bạn</label>
            <textarea 
              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              rows="4" 
              placeholder="Điền các luồng yêu cầu, nhóm đối tượng, hoặc mô tả chi tiết chiến dịch..."
              defaultValue={"Ngân sách: 20 triệu VNĐ.\nKhách hàng: Người hướng nội, độc lập tài chính, thích tĩnh lặng.\nGiọng văn: Chậm rãi, thiền vị, trị liệu. Tuyệt đối không giật tít thương mại."}
            />
          </div>

          <button 
            onClick={onGenerate}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-lg hover:shadow-blue-500/30"
          >
            Giao Việc Cho Agents <ArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
