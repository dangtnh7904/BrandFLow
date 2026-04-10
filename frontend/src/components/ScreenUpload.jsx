import React, { useState } from 'react';
import { UploadCloud, Briefcase, CheckCircle, ArrowRight, FileText, X, DollarSign, AlertCircle, ChevronDown, Activity, ShieldAlert, Users, Target } from 'lucide-react';

export default function ScreenUpload({ onGenerate }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [budget, setBudget] = useState("");
  const [userRequest, setUserRequest] = useState("");
  const [industry, setIndustry] = useState("General");
  
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSummary, setExtractedSummary] = useState(null);
  const [extractError, setExtractError] = useState(null);

  // Form State
  const [part1, setPart1] = useState({
    revenue_reason: '',
    growth_driver: '',
    major_events: '',
    assumptions_risks: '',
    in_house_team: ''
  });

  const [part2, setPart2] = useState({});

  const handleExtractSummary = async () => {
    setExtractError(null);
    if (selectedFiles.length === 0) {
      setExtractError("Vui lòng tải lên ít nhất một tài liệu trước khi phân tích.");
      return;
    }
    setIsExtracting(true);
    try {
      const tenantId = localStorage.getItem('brandflow_tenant_id') || 'default_tenant';
      const formData = new FormData();
      formData.append("tenant_id", tenantId);
      selectedFiles.forEach(f => formData.append("files", f));
      
      const res = await fetch("http://localhost:8000/api/v1/onboarding/extract-summary", {
        method: "POST",
        body: formData
      });
      
      if (!res.ok) {
        if (res.status === 413) throw new Error("413: Tệp đính kèm quá lớn.");
        if (res.status === 429) throw new Error("429: Hệ thống máy chủ đang quá tải.");
        throw new Error(`Đã có lỗi xảy ra (Mã lỗi: ${res.status})`);
      }
      
      const data = await res.json();
      if (data.status === "success") {
        setExtractedSummary(data.data);
      } else {
        throw new Error(data.detail || "Không thể phân tích dữ liệu.");
      }
    } catch (err) {
      setExtractError(err.message || "Không kết nối được với máy chủ.");
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

  const MIN_BUDGET = 1000000; 

  const handleGenerateClick = () => {
    if (campaignName.trim() === "") {
      alert("Vui lòng nhập tên chiến dịch trước khi giao việc cho Agent.");
      return;
    }
    const budgetNum = parseInt(budget);
    if (!budget || isNaN(budgetNum) || budgetNum < MIN_BUDGET) {
      alert(`⚠️ Ngân sách không hợp lệ!\n\nVui lòng nhập ngân sách tối thiểu ${MIN_BUDGET.toLocaleString()} VNĐ (1 triệu).`);
      return;
    }
    
    const compForm = {
      industry,
      part1: { ...part1, cash_budget: budgetNum },
      part2
    };

    onGenerate(selectedFiles, urlInput, campaignName, userRequest, budgetNum, compForm);
  };

  const updatePart1 = (field, val) => setPart1(prev => ({...prev, [field]: val}));
  const updatePart2 = (field, val) => setPart2(prev => ({...prev, [field]: val}));

  const renderPart2Questions = () => {
    if (industry === "F&B") {
      return (
        <div className="space-y-4 animate-fade-in-up mt-4 border-t border-slate-200 dark:border-zinc-800 pt-4">
          <h3 className="text-emerald-400 font-bold text-sm uppercase flex items-center"><Target size={16} className="mr-2"/> Lĩnh vực F&B</h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Mô hình thu lợi nhuận lõi & Sản phẩm đinh</label>
            <input type="text" onChange={(e) => updatePart2('revenue_model', e.target.value)} value={part2.revenue_model || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" placeholder="VD: Bán tại quán (Dine-in). Món đinh: Cà phê muối." />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Đánh giá Năng lực Cạnh Tranh (CSFs - Thang 10)</label>
            <textarea onChange={(e) => updatePart2('csfs_score', e.target.value)} value={part2.csfs_score || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" rows="3" placeholder="VD: Hương vị (50%): Mình 8 vs Đối thủ 9, View quán (30%): Mình 9 vs Đối thủ 6, Giá (20%): Mình 7 vs Đối thủ 8" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Vấn đề then chốt (Nỗi đau lớn nhất)</label>
            <input type="text" onChange={(e) => updatePart2('key_issue', e.target.value)} value={part2.key_issue || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" placeholder="VD: Khách đến 1 lần check-in rồi không quay lại, phụ thuộc app." />
          </div>
        </div>
      );
    }
    if (industry === "Tech") {
      return (
        <div className="space-y-4 animate-fade-in-up mt-4 border-t border-slate-200 dark:border-zinc-800 pt-4">
          <h3 className="text-blue-400 font-bold text-sm uppercase flex items-center"><Target size={16} className="mr-2"/> Lĩnh vực Công Nghệ / SaaS</h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Phễu chuyển đổi & Vòng đời bán hàng</label>
            <input type="text" onChange={(e) => updatePart2('sales_funnel', e.target.value)} value={part2.sales_funnel || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" placeholder="VD: Freemium 14 ngày, mất khoảng 3 tháng để chốt sale B2B." />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Đánh giá Năng lực Cạnh Tranh (CSFs - Thang 10)</label>
            <textarea onChange={(e) => updatePart2('csfs_score', e.target.value)} value={part2.csfs_score || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" rows="3" placeholder="VD: Bảo mật (40%): 9 vs 8, Dễ dùng (40%): 7 vs 9, Giá (20%): 8 vs 7" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Rào cản chốt đơn (Key Issues)</label>
            <input type="text" onChange={(e) => updatePart2('key_issue', e.target.value)} value={part2.key_issue || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" placeholder="VD: Khách hàng ngại đổi mới hệ thống, phần mềm đối thủ quen thuộc hơn." />
          </div>
        </div>
      );
    }
    if (industry === "Cosmetics") {
      return (
        <div className="space-y-4 animate-fade-in-up mt-4 border-t border-slate-200 dark:border-zinc-800 pt-4">
          <h3 className="text-pink-400 font-bold text-sm uppercase flex items-center"><Target size={16} className="mr-2"/> Lĩnh vực Mỹ Phẩm / Beauty</h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Nỗi đau giải quyết & Kênh phân phối chính</label>
            <input type="text" onChange={(e) => updatePart2('pain_point_channel', e.target.value)} value={part2.pain_point_channel || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" placeholder="VD: Trị mụn ẩn cho da nhạy cảm. Phân phối qua Shopee Mall." />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Đánh giá Cạnh Tranh & Trust Signals (Thang 10)</label>
            <textarea onChange={(e) => updatePart2('csfs_score', e.target.value)} value={part2.csfs_score || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" rows="3" placeholder="VD: Bao bì đẹp (30%): 8 vs 9, KOLs Recommend (40%): 7 vs 8, Chứng nhận da liễu (30%): 9 vs 7" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Vấn đề đau đầu nhất (Key Issues)</label>
            <input type="text" onChange={(e) => updatePart2('key_issue', e.target.value)} value={part2.key_issue || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" placeholder="VD: Chi phí booking KOLs quá cao ăn mòn lợi nhuận." />
          </div>
        </div>
      );
    }
    if (industry === "Edu") {
      return (
        <div className="space-y-4 animate-fade-in-up mt-4 border-t border-slate-200 dark:border-zinc-800 pt-4">
          <h3 className="text-orange-400 font-bold text-sm uppercase flex items-center"><Target size={16} className="mr-2"/> Lĩnh vực Giáo Dục</h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Người ra quyết định (DMU) & Hoàn cảnh</label>
            <input type="text" onChange={(e) => updatePart2('dmu_context', e.target.value)} value={part2.dmu_context || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" placeholder="VD: Phụ huynh quyết định mua khóa hè kỹ năng sống cho con cấp 2." />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Đánh giá Năng lực Tuyển sinh (CSFs - Thang 10)</label>
            <textarea onChange={(e) => updatePart2('csfs_score', e.target.value)} value={part2.csfs_score || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" rows="3" placeholder="VD: Cam kết đầu ra (40%): 9 vs 8, Giảng viên xịn (30%): 8 vs 9, Giáo trình (30%): 8 vs 8" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Điểm rò rỉ lớn nhất trong Phễu (Key Issues)</label>
            <input type="text" onChange={(e) => updatePart2('key_issue', e.target.value)} value={part2.key_issue || ''} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" placeholder="VD: Học sinh đăng ký học thử đông nhưng tỷ lệ chốt phí quá thấp." />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full bg-transparent flex flex-col items-center justify-center p-4 lg:p-6 font-sans">
      <div className="w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-[20px] shadow-sm overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Info Panel */}
        <div className="lg:w-1/3 bg-slate-50 dark:bg-zinc-950 p-8 text-slate-800 dark:text-white flex flex-col justify-between border-r border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Briefcase className="text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xl tracking-wide text-slate-800 dark:text-white">BrandFlow AI</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-slate-800 dark:text-white">Data Ingestion Center</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">Điền vào bộ câu hỏi chiến lược dưới đây. Dữ liệu này sẽ làm Single Source of Truth cho CFO điều phối vốn và CMO xây dựng kế hoạch.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-slate-200 dark:border-zinc-800">
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block mb-2">Automated Execution</span>
            <ul className="text-sm text-slate-500 dark:text-zinc-400 space-y-3">
              <li className="flex items-start"><CheckCircle size={16} className="mr-2 mt-0.5 text-emerald-400 shrink-0"/> Trích xuất Tài chính & Rủi ro lập Bảng Form 5, Form 12.</li>
              <li className="flex items-start"><CheckCircle size={16} className="mr-2 mt-0.5 text-blue-400 shrink-0"/> Vẽ tự động Ma trận cạnh tranh DPM.</li>
              <li className="flex items-start"><CheckCircle size={16} className="mr-2 mt-0.5 text-rose-400 shrink-0"/> CFO giới hạn chiến dịch theo đúng cấu trúc In-house.</li>
            </ul>
          </div>
        </div>
        
        {/* Right Form Panel */}
        <div className="lg:w-2/3 p-6 lg:p-8 flex flex-col h-full overflow-y-auto max-h-[90vh]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2">Tên Chiến Dịch</label>
              <input type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none placeholder-[#A0AEC0]" placeholder="Ví dụ: Chiến dịch bứt phá Quý 3..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2">Ngành Nghề</label>
              <div className="relative">
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none appearance-none cursor-pointer">
                  <option value="General">General (Khác)</option>
                  <option value="F&B">F&B (Ẩm thực)</option>
                  <option value="Tech">Tech (Công nghệ / SaaS)</option>
                  <option value="Cosmetics">Cosmetics (Mỹ phẩm)</option>
                  <option value="Edu">Education (Giáo dục)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-zinc-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-950 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 mb-5">
            <h2 className="text-slate-800 dark:text-white font-bold mb-4 flex items-center space-x-2"><Activity size={18} className="text-indigo-600 dark:text-indigo-400"/><span>Phần 1: Nền tảng Tài chính & Quản trị rủi ro</span></h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Giải trình biến động: Nguyên nhân chính khiến doanh thu 3 năm qua tăng/giảm là gì?</label>
                <input type="text" value={part1.revenue_reason} onChange={(e) => updatePart1('revenue_reason', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 outline-none" placeholder="VD: Ảnh hưởng suy thoái chung, nhưng bù lại khách cũ mua nhiều." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1">Động lực tăng trưởng (Ma trận Ansoff)</label>
                  <select value={part1.growth_driver} onChange={(e) => updatePart1('growth_driver', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 outline-none cursor-pointer">
                    <option value="">-- Chọn Động Lực --</option>
                    <option value="Thâm nhập (Bán thêm KH cũ)">Thâm nhập thị trường (Bán thêm khách cũ)</option>
                    <option value="Phát triển Sản phẩm (Sản phẩm mới)">Phát triển Sản phẩm mới cho khách cũ</option>
                    <option value="Phát triển Thị trường (Tìm KH mới)">Tìm kiếm tệp Khách hàng mới</option>
                    <option value="Đa dạng hóa (Nhảy qua ngành mới)">Đa dạng hóa (Ngành mới + Sản phẩm mới)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1 flex items-center"><ShieldAlert size={12} className="mr-1 text-rose-400"/> Giả định & Rủi ro sống còn</label>
                  <input type="text" value={part1.assumptions_risks} onChange={(e) => updatePart1('assumptions_risks', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 outline-none" placeholder="VD: Nền tảng không thay đổi thuật toán / đứt chuỗi cung ứng" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1 flex items-center"><DollarSign size={12} className="mr-1 text-emerald-400"/> Ngân sách Marketing Tối đa (VNĐ)</label>
                  <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} min="1000000" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white font-bold rounded p-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 outline-none" placeholder="Giới hạn ví tiền của bạn (VD: 50000000)" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1 flex items-center"><Users size={12} className="mr-1 text-blue-400"/> Đội ngũ In-house hiện có</label>
                  <input type="text" value={part1.in_house_team} onChange={(e) => updatePart1('in_house_team', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded p-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 outline-none border-dashed" placeholder="VD: 1 Designer, 2 Content, thuê ngoài Ads" />
                </div>
              </div>
            </div>

            {/* Gọi Section Ngành đặc thù */}
            {renderPart2Questions()}

          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2">Tài Liệu Đính Kèm Khác</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl">
               <label className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:bg-zinc-800/50 hover:border-[#0075FF] transition-colors cursor-pointer relative overflow-hidden bg-slate-50 dark:bg-zinc-950">
                <input type="file" multiple className="absolute opacity-0 w-full h-full cursor-pointer top-0 left-0" onChange={handleFileChange} />
                <UploadCloud size={24} className="text-indigo-600 dark:text-indigo-400 mb-2" />
                <p className="text-xs font-medium text-slate-800 dark:text-white">Thả file PDF, DOCX (Max 10MB)</p>
              </label>
              <div className="flex flex-col justify-center">
                 <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none" placeholder="Hoặc dán Link Website / Fanpage..." />
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-1 mt-3 max-h-32 overflow-y-auto pr-2">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 rounded flex items-center justify-between p-2">
                    <span className="text-xs text-slate-800 dark:text-white truncate w-4/5">{file.name}</span>
                    <button onClick={(e) => removeFile(idx, e)} className="text-slate-500 dark:text-zinc-400 hover:text-rose-500"><X size={14}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2">Mô tả riêng (Tùy chọn)</label>
            <textarea value={userRequest} onChange={(e) => setUserRequest(e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none placeholder-[#A0AEC0]" rows="2" placeholder="Ghi chú thêm về yêu cầu..." />
          </div>

          <button 
            onClick={handleGenerateClick}
            className="w-full mt-auto py-4 bg-indigo-600 shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:bg-indigo-700 text-slate-800 dark:text-white rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-[0_4px_15px_rgba(0,117,255,0.4)] truncate"
          >
            Kích Hoạt Agent Engine <ArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
