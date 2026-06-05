import { create } from 'zustand';
import { BEP_NHA_MOC_FORMS_MOCK } from './bep_nha_moc_forms_mock';

const PROJECT_NAME = "BrandFlow Strategy Plan";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Hàm lấy User ID an toàn từ LocalStorage
const getUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('brandflow_user_id') || "";
  }
  return "";
};

// Hàm lấy Auth Headers (JWT Token)
const getAuthHeaders = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('brandflow_token');
    if (token) return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

// Hàm xử lý 401 — Token hết hạn → redirect về Login
const handleUnauthorized = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('brandflow_token');
    localStorage.removeItem('brandflow_user_id');
    window.location.href = '/login';
  }
};

interface FormStore {
  forms: Record<string, any>;
  projectId: string | null;
  isLoading: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  initialized: boolean;

  loadAllForms: () => Promise<void>;
  updateForm: (formKey: string, data: any) => Promise<void>;
  initializeProject: () => Promise<void>;
  
  marketResearchStatus: 'idle' | 'running' | 'done' | 'error';
  marketResearchData: any;
  runMarketResearch: (industry: string) => Promise<void>;
  extractedAnswers: Record<string, any>;
  setExtractedAnswers: (answers: Record<string, any>) => void;
  wizardAnswers: Record<string, any>;
  setWizardAnswer: (key: string, value: any) => void;
  setWizardAnswers: (answers: Record<string, any>) => void;
  
  debateLogs: any[];
  tacticsPlan: any;
  runDebateAndPlanning: () => Promise<void>;

  brandDNA: any;
  setBrandDNA: (dna: any) => void;
  intakeAnalysis: any;
  setIntakeAnalysis: (data: any) => void;
  rawIngestedContent: string;
  appendRawIngestedContent: (text: string) => void;
  generateAndSaveDNA: (documentContent?: string) => Promise<void>;

  // Vietnam Market — Business Intent
  businessIntent: {
    mode: 'budget_first' | 'idea_first' | null;
    budget?: number;
    idea?: string;
    businessGoal: string;
    timeline: string;
  };
  setBusinessIntent: (intent: Partial<FormStore['businessIntent']>) => void;
}

export const useFormStore = create<FormStore>((set, get) => ({
  forms: {},
  projectId: null,
  isLoading: true,
  saveStatus: 'idle',
  initialized: false,
  marketResearchStatus: 'idle',
  marketResearchData: null,
  extractedAnswers: {},
  wizardAnswers: {},
  debateLogs: [],
  tacticsPlan: null,
  brandDNA: null,
  intakeAnalysis: null,
  rawIngestedContent: "",
  businessIntent: { mode: null, businessGoal: '', timeline: '3_months' },

  setExtractedAnswers: (answers) => set({ extractedAnswers: answers }),
  setWizardAnswer: (key, value) => set((state) => ({ wizardAnswers: { ...state.wizardAnswers, [key]: value } })),
  setWizardAnswers: (answers) => set((state) => ({ wizardAnswers: { ...state.wizardAnswers, ...answers } })),
  setBrandDNA: (dna) => set({ brandDNA: dna }),
  setIntakeAnalysis: (data) => set({ intakeAnalysis: data }),
  appendRawIngestedContent: (text) => set((state) => ({ rawIngestedContent: state.rawIngestedContent + "\n" + text })),
  setBusinessIntent: (intent) => set((state) => ({ businessIntent: { ...state.businessIntent, ...intent } })),

  initializeProject: async () => {
    if (get().initialized) return;
    
    const tokenUserId = getUserId();
    const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
    
    if (!tokenUserId || !token) {
      if (typeof window !== 'undefined') window.location.href = '/login';
      return;
    }

    set({ initialized: true });

    try {
      // List projects của user, tìm project đã có
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const listRes = await fetch(`${API_URL}/api/v1/forms/projects`, {
        headers: { ...getAuthHeaders() },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      let projectId: string | null = null;

      if (listRes.ok) {
        const projects = await listRes.json();
        if (projects.length > 0) {
          projectId = projects[0].id;
        }
      } else if (listRes.status === 401) {
        handleUnauthorized();
        return;
      }

      // 3. Nếu chưa có project nào, tạo mới
      if (!projectId) {
        const createController = new AbortController();
        const createTimeoutId = setTimeout(() => createController.abort(), 1500);
        const createRes = await fetch(`${API_URL}/api/v1/forms/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({
            name: PROJECT_NAME,
            industry: "General",
          }),
          signal: createController.signal
        });
        clearTimeout(createTimeoutId);
        if (createRes.ok) {
          const newProject = await createRes.json();
          projectId = newProject.id;
        }
      }

      if (projectId) {
        set({ projectId });
        // 4. Load forms đã lưu trước đó
        await get().loadAllForms();
      } else {
        console.warn("⚠️ Không thể kết nối Backend FastAPI. Đang chạy trong CHẾ ĐỘ DEMO (Offline Mode).");
        set({ 
          projectId: 'demo-mock-project-id', 
          saveStatus: 'idle', 
          isLoading: false,
          forms: BEP_NHA_MOC_FORMS_MOCK
        });
      }
    } catch (e) {
      console.warn("⚠️ Lỗi khởi tạo DB (Backend có thể chưa chạy). Đang chạy trong CHẾ ĐỘ DEMO (Offline Mode).", e);
      set({ 
        projectId: 'demo-mock-project-id', 
        saveStatus: 'idle', 
        isLoading: false,
        forms: BEP_NHA_MOC_FORMS_MOCK
      });
    }
  },

  loadAllForms: async () => {
    const { projectId } = get();
    if (!projectId) return;

    set({ isLoading: true });
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const res = await fetch(`${API_URL}/api/v1/forms/projects/${projectId}/forms`, {
        headers: { ...getAuthHeaders() },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        // Start with empty data as the default
        const mappedForms: Record<string, any> = {};
        // Override with user's saved data from DB if any exists
        for (const [key, value] of Object.entries(json.forms || {})) {
          mappedForms[key] = (value as any).data;
        }
        set({ forms: mappedForms });
      } else if (res.status === 401) {
        handleUnauthorized();
        return;
      } else {
        set({ forms: BEP_NHA_MOC_FORMS_MOCK });
      }
    } catch (e) {
      console.error("Failed to load forms:", e);
      set({ forms: BEP_NHA_MOC_FORMS_MOCK });
    } finally {
      set({ isLoading: false });
    }
  },

  updateForm: async (formKey: string, newData: any) => {
    const { projectId } = get();
    if (!projectId) {
      set({ saveStatus: 'error' });
      return;
    }

    // 1. Optimistic UI update
    set((state) => ({
      forms: { ...state.forms, [formKey]: newData },
      saveStatus: 'saving'
    }));

    // 2. Persist to Supabase via FastAPI
    try {
      const res = await fetch(`${API_URL}/api/v1/forms/projects/${projectId}/forms/${formKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ data: newData })
      });
      if (res.ok) {
        set({ saveStatus: 'saved' });
        setTimeout(() => set({ saveStatus: 'idle' }), 2000);
      } else if (res.status === 401) {
        handleUnauthorized();
        return;
      } else {
        const errText = await res.text();
        console.error("Save API error:", res.status, errText);
        set({ saveStatus: 'error' });
      }
    } catch (e) {
      set({ saveStatus: 'error' });
      console.error("Save failed:", e);
    }
  },

  runMarketResearch: async (industry: string) => {
    set({ marketResearchStatus: 'running' });
    try {
      // Giữ một chút delay tối thiểu để UI chạy animation cho đẹp
      const minWait = new Promise(resolve => setTimeout(resolve, 2000));
      
      const { brandDNA } = get();

      // Gọi API thật (chuyển sang POST để gửi brand_dna)
      const apiCall = fetch(`${API_URL}/api/v1/research/market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ industry, brand_dna: brandDNA })
      });
      
      const [, res] = await Promise.all([minWait, apiCall]);
      
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }
      
      const realData = await res.json();
      
      set({ marketResearchStatus: 'done', marketResearchData: realData });
      await get().updateForm('market_research', realData);
    } catch (e) {
      console.error("Market research failed. Fallback to mock data.", e);
      
      // Fallback an toàn nếu backend chưa chạy hoặc lỗi
      const mockData = {
        tam_sam_som: {
          TAM: "30.000 Tỷ VNĐ", SAM: "5.000 Tỷ VNĐ", SOM: "10 Tỷ VNĐ", CAGR: "25%"
        },
        market_gap: "Phân khúc F&B bình dân đang bão hòa. Tuy nhiên, có một khoảng trống lớn (Market Gap) cho mô hình 'Mindful Dining' (Ẩm thực chữa lành) kết hợp không gian hoài niệm mộc mạc dành cho dân văn phòng và Gen Z.",
        competitors: [
          { name: "Chuỗi Cơm Niêu Truyền Thống", strengths: "Hệ thống rộng, độ nhận diện cao", pain_points: "Ồn ào, dịch vụ công nghiệp, thiếu không gian thư giãn (Aesthetic)" },
          { name: "Nhà Hàng Chay Cao Cấp", strengths: "Lành mạnh, yên tĩnh", pain_points: "Mức giá quá cao, kén khách, thực đơn thiếu sự đậm đà của bữa cơm gia đình" }
        ]
      };
      set({ marketResearchStatus: 'done', marketResearchData: mockData });
      await get().updateForm('market_research', mockData);
    }
  },

  runDebateAndPlanning: async () => {
    try {
      const { wizardAnswers, brandDNA, intakeAnalysis, extractedAnswers, businessIntent } = get();
      const rawText = "Lập kế hoạch chiến lược theo form";
      const budgetRaw = wizardAnswers.budget ? String(wizardAnswers.budget).replace(/\D/g, '') : "0";
      const budget = budgetRaw ? parseInt(budgetRaw, 10) : 0;
      
      const payload = {
        raw_text: rawText, 
        comprehensive_form: wizardAnswers,
        tenant_id: getUserId() || "anonymous",
        budget: businessIntent.mode === 'budget_first' && businessIntent.budget ? businessIntent.budget : budget,
        brand_dna: brandDNA,
        business_intent: businessIntent
      };

      const res = await fetch(`${API_URL}/api/v1/planning/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      if (data.status === 'success' || data.plan) {
        set({ 
          debateLogs: data.agent_logs || [],
          tacticsPlan: data.plan || null
        });
      }
    } catch (error) {
      console.error("Debate API failed:", error);
      const fallbackLogs = [
        { agent: "CMO", role: "Giám đốc Marketing", message: "Chào các vị lãnh đạo và khách hàng! Giám đốc Marketing xin phép trình bày tóm tắt kế hoạch 'Thơm Khói Bếp - Chữa Lành Tâm Hồn'.\n\nChiến dịch sẽ đi qua 3 giai đoạn: Khơi Hương (Teasing), Tỏa Trà (Traffic), và Lưu Phai (Loyalty). Trọng tâm lớn nhất nằm ở tháng 6, chúng ta sẽ mạnh tay book 3 Mega-TikToker tới thưởng trà và làm video review. Mức đầu tư cho riêng hạng mục KOL này là 30 triệu đồng. Tổng ngân sách tôi xin duyệt là 355,000,000 VND. Mọi người có ý kiến gì không?" },
        { agent: "SYSTEM", role: "Hệ thống Kiểm toán", message: "Cảnh báo tự động: Hệ thống ghi nhận ngân sách Marketing đề xuất đã cao hơn so với hạn mức hiện tại. Cần các sếp và đại diện khách hàng vào phiên tòa phản biện để điều chỉnh lại cấu trúc vốn." },
        { agent: "CFO", message: "> \"Tổng ngân sách 350 triệu VNĐ cho 1 quý là một khoản đầu tư đáng kể đối với một SME quy mô doanh thu 1.2 tỷ/tháng. Tôi đánh giá cao việc có ngân sách cho Performance Marketing để thu dòng tiền ngay (60 triệu). Tuy nhiên, 80 triệu cho Brand Film ở Giai đoạn 1 là rủi ro dòng tiền lớn (Sunk cost) khi chưa thấy chuyển đổi. Tôi đề nghị chia nhỏ ngân sách Media ra: 40 triệu cho Video Hero (chất lượng cao) và 40 triệu dùng để boost Ads cho video đó, thay vì dồn hết vào sản xuất.\"" },
        { agent: "CMO", message: "> \"CFO có lý về dòng tiền. Nhưng bài toán của Bếp Nhà Mộc hiện tại là 'Perceived Value' (Giá trị cảm nhận) đang quá thấp. Nếu không có một cú 'Big Bang' về mặt hình ảnh (Hero Video) đủ chất lượng 'Cinematic' để đánh vào cảm xúc, chúng ta không thể thuyết phục khách hàng Gen Y/Z trả mức giá cao hơn 15% cho menu mới. Tuy nhiên, tôi đồng ý phương án cắt giảm chi phí sản xuất xuống 50 triệu bằng cách tận dụng nguồn lực In-house của Agency, và dành 30 triệu để phân phối (Distribution) trên TikTok/Reels.\"" },
        { agent: "COO", message: "> \"Các anh lo chạy Marketing kéo khách tới đông (Traffic Generation), nhưng tôi lo hệ thống vận hành sập. Nhà bếp hiện tại chỉ chịu tải được 120 khách/cùng thời điểm. Nếu KOLs làm clip viral, cuối tuần lượng khách đổ về có thể vượt 200. Trải nghiệm tồi sẽ giết chết thương hiệu nhanh hơn cả việc không làm Marketing. Tôi yêu cầu tích hợp tính năng 'Quản lý đặt bàn Real-time' vào Zalo Mini App ngay từ Giai đoạn 2, giới hạn Booking để giữ chất lượng 'Mindful Dining', không để quán ồn ào như cái chợ.\"" },
        { agent: "CEO", message: "> \"Tuyệt vời, một phiên tranh biện sâu sắc. Quyết định như sau:\n> 1. Đồng ý phương án của CMO/CFO: Tối ưu chi phí sản xuất Brand Film xuống 50M, dành 30M đẩy Ads.\n> 2. Ưu tiên của COO là hoàn toàn chính xác. Trải nghiệm 'chữa lành' không thể ồn ào. Chúng ta sẽ áp dụng chiến lược 'Scarcity Marketing' (Marketing khan hiếm) - chỉ nhận tối đa 100 khách/buổi thông qua Booking Zalo Mini App. Điều này vừa giải quyết bài toán vận hành, vừa đẩy định vị thương hiệu lên mức 'Độc quyền' (Exclusive).\n> BrandFlow, hãy chốt bản kế hoạch này và chuyển qua Design Studio triển khai Visuals!\"" }
      ];
      
      const fallbackPlan = {
        executive_summary: {
          campaign_name: "Thơm Khói Bếp - Chữa Lành Tâm Hồn",
          campaign_summary: "Chiến dịch Rebranding và Tăng trưởng 360 độ nhằm tái định vị Bếp Nhà Mộc từ 'quán ăn gia đình bình dân' lên phân khúc 'Mindful Dining' tầm trung-cao.",
          total_investment_vnd: 350000000
        },
        activity_and_financial_breakdown: [
          { phase_name: "Giai đoạn 1: Nhen Lửa (Rebranding Launch & Teasing)", activities: [ { activity_name: "Sản xuất Cinematic Brand Film: 'Hương Vị Chữa Lành'", cost_vnd: 80000000 }, { activity_name: "Đồng bộ hóa Nhận diện Thị giác (Visual Identity Sync)", cost_vnd: 45000000 } ] },
          { phase_name: "Giai đoạn 2: Bùng Vị (Traffic Generation & Menu Launch)", activities: [ { activity_name: "Chiến dịch 'Taste the Memories' với 30 Micro-Influencers", cost_vnd: 100000000 }, { activity_name: "Performance Marketing (Booking Lead Gen)", cost_vnd: 60000000 } ] },
          { phase_name: "Giai đoạn 3: Giữ Lửa (Loyalty & Optimization)", activities: [ { activity_name: "Xây dựng Zalo Mini App Loyalty", cost_vnd: 35000000 }, { activity_name: "Triển khai Business Lunch Combo (Trưa Văn Phòng Cao Cấp)", cost_vnd: 30000000 } ] }
        ]
      };

      set({ debateLogs: fallbackLogs, tacticsPlan: fallbackPlan });
    }
  },

  generateAndSaveDNA: async (documentContent: string = "") => {
    try {
      const { wizardAnswers, rawIngestedContent, extractedAnswers } = get();
      
      let combinedContent = documentContent + "\n" + rawIngestedContent;
      if (extractedAnswers?.strategic_marketing_audit) {
         combinedContent += "\n\n--- HỆ THỐNG ĐÃ PHÂN TÍCH FILE THÀNH CÔNG VÀ RÚT RA CÁC INSIGHT SAU ---\n" + JSON.stringify(extractedAnswers.strategic_marketing_audit, null, 2);
      }

      const payload = {
        form_data: wizardAnswers,
        document_content: combinedContent,
        tenant_id: getUserId() || "anonymous"
      };

      const res = await fetch(`${API_URL}/api/v1/research/extract-dna`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success' && result.data) {
          set({ brandDNA: result.data, intakeAnalysis: result.intake_analysis });
          // Optional: persist to Supabase or update form
          await get().updateForm('brand_dna', result.data);
          console.log("✅ [Store] Brand DNA extracted and saved:", result.data);
        }
      } else {
        console.error("Failed to extract DNA:", res.status);
        throw new Error("API not ok");
      }
    } catch (e) {
      console.error("Error calling extract-dna API. Fallback to Mock Data:", e);
      const mockBrandDNA = {
        brand_name: "Bếp Nhà Mộc",
        core_value: "Mộc mạc (Rustic), Gắn kết (Connection), Lành sạch (Wholesome)",
        positioning: "Nơi chữa lành tâm hồn thị dân thông qua trải nghiệm Ẩm thực Việt di sản, trong không gian nhà gỗ mộc mạc và nguyên liệu 100% hữu cơ.",
        brand_archetype: "The Caregiver (Người chăm sóc) & The Creator (Người sáng tạo)"
      };
      const mockIntakeAnalysis = {
        expert_business_analysis: {
          financial_health: "Cảnh báo Đỏ (Red Flag): Doanh thu đi ngang ở mức 1.2 tỷ/tháng trong 18 tháng qua. Biên lợi nhuận ròng chỉ đạt 15%.",
          strategic_recommendation: "Bắt buộc phải Rebranding lên phân khúc 'Mindful Dining' (Ẩm thực chữa lành) tầm trung-cao."
        }
      };
      set({ brandDNA: mockBrandDNA, intakeAnalysis: mockIntakeAnalysis });
      await get().updateForm('brand_dna', mockBrandDNA);
    }
  }
}));
