import React, { useState } from 'react';
import { UploadCloud, Briefcase, CheckCircle, ArrowRight, FileText, X, DollarSign } from 'lucide-react';

export default function ScreenUpload({ onGenerate }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [budget, setBudget] = useState("");
  const [userRequest, setUserRequest] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSummary, setExtractedSummary] = useState(null);

  const handleExtractSummary = async () => {
    if (selectedFiles.length === 0) {
      alert("Vui lòng tải lên ít nhất một tài liệu trước khi phân tích.");
      return;
    }
    setIsExtracting(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(f => formData.append("files", f));
      
      const res = await fetch("http://localhost:8000/api/v1/onboarding/extract-summary", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.status === "success") {
        setExtractedSummary(data.data);
      } else {
        alert("Có lỗi xảy ra: " + (data.detail || data.message));
      }
    } catch (err) {
      alert("Không kết nối được với máy chủ: " + err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove, e) => {
    e.preventDefault();
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const MIN_BUDGET = 1000000; // 1 triệu VND

  const handleGenerateClick = () => {
    if (selectedFiles.length === 0 || campaignName.trim() === "") {
      alert("Vui lòng tải lên tài liệu và nhập tên chiến dịch trước khi giao việc cho Agent.");
      return;
    }
    const budgetNum = parseInt(budget);
    if (!budget || isNaN(budgetNum) || budgetNum < MIN_BUDGET) {
      alert(`⚠️ Ngân sách không hợp lệ!\n\nVui lòng nhập ngân sách tối thiểu ${MIN_BUDGET.toLocaleString()} VNĐ (1 triệu).`);
      return;
    }
    onGenerate(selectedFiles, urlInput, campaignName, userRequest, budgetNum);
  };

  return (
    <div className="h-full bg-transparent flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full bg-[#111C44] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-[#0B1437] p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Briefcase className="text-[#0075FF]" />
              <span className="font-bold text-xl tracking-wide text-white">BrandFlow AI</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-white">Khởi Tạo Chiến Dịch B2B</h1>
            <p className="text-[#A0AEC0] text-sm leading-relaxed mb-6">Xin chào! Cung cấp tài liệu và yêu cầu của bạn, AI Agents của chúng tôi sẽ tự động tranh luận và chốt phương án tối ưu ROI nhất.</p>
          </div>
          <div className="bg-[#111C44] rounded-xl p-4 border border-[#1B254B]">
            <span className="text-xs text-[#0075FF] font-bold uppercase tracking-wider block mb-2">Automated Roles</span>
            <ul className="text-sm text-[#A0AEC0] space-y-2">
              <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-emerald-400"/> CMO (Growth Planner)</li>
              <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-rose-400"/> CFO (Risk Controller)</li>
            </ul>
          </div>
        </div>
        
        <div className="md:w-2/3 p-8 flex flex-col justify-center">
          
          <div className="mb-5">
            <label className="block text-sm font-bold text-[#A0AEC0] mb-2">Tên Chiến Dịch</label>
            <input 
              type="text" 
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full bg-[#0B1437] border border-[#1B254B] text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0075FF] outline-none placeholder-[#A0AEC0]" 
              placeholder="Nhập tên chiến dịch của bạn..."
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-[#A0AEC0] mb-2">Ngân Sách Chiến Dịch (VNĐ) <span className="text-rose-400">*</span></label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0075FF]"><DollarSign size={18}/></div>
              <input 
                type="number" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="1000000"
                step="1000000"
                className="w-full bg-[#0B1437] border border-[#1B254B] text-white rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-[#0075FF] outline-none placeholder-[#A0AEC0] font-bold" 
                placeholder="VD: 15000000 (tối thiểu 1,000,000)"
              />
              {budget && parseInt(budget) >= 1000000 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">
                  ≈ {(parseInt(budget)/1000000).toLocaleString()} Triệu
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#A0AEC0] mt-1.5">Tối thiểu 1,000,000 VNĐ (1 triệu). AI sẽ phân bổ ngân sách tối ưu theo mô hình MoSCoW.</p>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-[#A0AEC0] mb-2">Tài Liệu Cốt Lõi (Guideline/Brief)</label>
            {/* Vùng Drop/Select luôn hiển thị */}
            <label className="border-2 border-dashed border-[#1B254B] rounded-xl p-6 flex flex-col items-center justify-center text-[#A0AEC0] hover:bg-[#1B254B]/50 hover:border-[#0075FF] transition-colors cursor-pointer relative overflow-hidden bg-[#0B1437] mb-4">
              <input type="file" multiple className="absolute opacity-0 w-full h-full cursor-pointer top-0 left-0" onChange={handleFileChange} />
              <UploadCloud size={32} className="text-[#0075FF] mb-2" />
              <p className="text-sm font-medium text-white">Kéo thả hoặc nhấn để Upload tài liệu</p>
              <p className="text-xs mt-1 text-[#A0AEC0]">Quét chọn nhiều file PDF, DOCX (Max 10MB)</p>
            </label>

            {/* Danh sách file hiển thị */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="border border-[#1B254B] bg-[#0B1437] rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="bg-[#111C44] p-2 rounded-lg shrink-0 flex items-center justify-center">
                        <FileText className="text-[#0075FF] w-4 h-4" />
                      </div>
                      <div className="truncate pr-4">
                        <p className="text-sm font-bold text-white truncate">{file.name}</p>
                        <p className="text-xs text-[#A0AEC0] font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={(e) => removeFile(idx, e)} className="text-[#A0AEC0] hover:text-rose-500 shrink-0 p-1.5 hover:bg-[#111C44] rounded-full transition-colors" title="Xóa file">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedFiles.length > 0 && (
              <button 
                onClick={handleExtractSummary}
                disabled={isExtracting}
                className="w-full mt-4 mb-2 py-3 bg-[#111C44] border border-[#0075FF] hover:bg-[#0075FF]/10 text-[#0075FF] rounded-xl font-bold text-sm flex items-center justify-center transition-all"
              >
                {isExtracting ? "Đang phân tích tài liệu bằng AI..." : "Phân tích & Tóm tắt Nhanh Tài liệu (Tùy chọn)"}
              </button>
            )}

            {extractedSummary && (
              <div className="mt-4 mb-6 bg-[#0B1437] border border-emerald-500/30 rounded-xl p-4 shadow-[0_4px_15px_rgba(16,185,129,0.1)]">
                <div className="flex items-center mb-4">
                  <CheckCircle className="text-emerald-400 w-5 h-5 mr-2" />
                  <h3 className="text-white font-bold text-[15px] tracking-wide">Brand DNA Đã Trích Xuất</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#111C44] rounded-lg p-3">
                      <span className="text-[11px] text-[#A0AEC0] uppercase font-bold block mb-1">Tên Thương hiệu / Doanh nghiệp</span>
                      <span className="text-sm text-white font-medium">{extractedSummary.company_name}</span>
                    </div>
                    <div className="bg-[#111C44] rounded-lg p-3">
                      <span className="text-[11px] text-[#A0AEC0] uppercase font-bold block mb-1">Ngành nghề (Industry)</span>
                      <span className="text-sm text-cyan-400 font-medium">{extractedSummary.industry}</span>
                    </div>
                  </div>
                  <div className="bg-[#111C44] rounded-lg p-3">
                    <span className="text-[11px] text-[#A0AEC0] uppercase font-bold block mb-1">Khách hàng Mục tiêu (Target Audience)</span>
                    <span className="text-[13px] text-slate-300 leading-relaxed block">{extractedSummary.target_audience}</span>
                  </div>
                  <div className="bg-[#111C44] rounded-lg p-3">
                    <span className="text-[11px] text-[#A0AEC0] uppercase font-bold block mb-1">Điểm bán hàng độc nhất (Core USPs)</span>
                    <ul className="list-disc pl-4 text-[13px] text-slate-300 space-y-1">
                      {extractedSummary.core_usps && extractedSummary.core_usps.map((usp, i) => <li key={i}>{usp}</li>)}
                    </ul>
                  </div>
                  <div className="bg-[#111C44] rounded-lg p-3">
                    <span className="text-[11px] text-[#A0AEC0] uppercase font-bold block mb-1">Sản phẩm/Dịch vụ chính</span>
                    <ul className="list-disc pl-4 text-[13px] text-slate-300 space-y-1">
                      {extractedSummary.key_products && extractedSummary.key_products.map((kp, i) => <li key={i}>{kp}</li>)}
                    </ul>
                  </div>
                  <div className="bg-[#111C44] rounded-lg p-3">
                    <span className="text-[11px] text-[#A0AEC0] uppercase font-bold block mb-1">Giọng văn (Tone of Voice)</span>
                    <span className="text-[13px] text-purple-400 font-medium block">{extractedSummary.tone_of_voice}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Component nhập Website URL */}
            <div className="mt-4">
              <label className="block text-sm font-bold text-[#A0AEC0] mb-2">Đính kèm Link Website (URL)</label>
              <input 
                type="url" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-[#0B1437] border border-[#1B254B] text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0075FF] outline-none placeholder-[#A0AEC0]" 
                placeholder="Dán đường dẫn bài viết hoặc tên miền website tham khảo..."
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-[#A0AEC0] mb-2">Mô Tả Chuyên Sâu & Yêu Cầu Của Bạn</label>
            <textarea 
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
              className="w-full bg-[#0B1437] border border-[#1B254B] text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0075FF] outline-none placeholder-[#A0AEC0]" 
              rows="4" 
              placeholder="Mô tả chi tiết chiến dịch, nhóm đối tượng, yêu cầu đặc biệt... VD: 'Tập trung quảng bá trên Facebook cho giới trẻ 18-25 tuổi, ưu tiên video ngắn'"
            />
          </div>

          <button 
            onClick={handleGenerateClick}
            className="w-full py-4 bg-[#0075FF] hover:bg-[#0055c4] text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-[0_4px_15px_rgba(0,117,255,0.4)]"
          >
            Giao Việc Cho Agents <ArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
