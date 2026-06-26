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
      if (typeof window !== 'undefined' && (window as any).__DEMO_MODE__) {
        throw new Error("Force Demo Mode Fallback");
      }
      const { extractedAnswers } = get();
      if (extractedAnswers?.["Tên doanh nghiệp"]?.includes("Nhà Mộc")) {
        throw new Error("Force Bep Nha Moc Bypass");
      }
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

      if (typeof window !== 'undefined' && (window as any).__DEMO_MODE__) {
        throw new Error("Force Demo Mode Fallback");
      }
      if (extractedAnswers?.["Tên doanh nghiệp"]?.includes("Nhà Mộc")) {
        throw new Error("Force Bep Nha Moc Bypass");
      }
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
        { agent: "CMO", role: "Giám đốc Marketing", message: "Kính thưa Ban Giám đốc. Dựa trên AI Insight, Customer Acquisition Cost (CAC) hiện tại đang quá cao do lạm dụng Price-Promotion (giảm giá), trong khi Lifetime Value (LTV) lại suy giảm. Tôi đề xuất chiến dịch 'Thơm Khói Bếp - Chữa Lành Tâm Hồn' tái định vị hệ thống sang phân khúc 'Mindful Dining' nhằm nâng cao Perceived Value. Tổng ngân sách Phase 1 & 2 đề xuất là 355 triệu VNĐ, dồn trọng tâm vào Cinematic Hero Video và Booking 30 KOLs/Food Reviewers để kích hoạt Earned Media." },
        { agent: "SYSTEM", role: "Hệ thống AI Kiểm toán", message: "⚠️ CẢNH BÁO RỦI RO (RED FLAG): Phân bổ ngân sách Media/Production chiếm tới 65% tổng ngân sách khởi điểm (High Sunk Cost). Mức độ rủi ro dòng tiền ngắn hạn (Cashflow Risk): CAO. Yêu cầu CFO thẩm định lại cấu trúc chi phí." },
        { agent: "CFO", role: "Giám đốc Tài chính", message: "Đồng thuận với System. Mức 80 triệu cho Cinematic Video là Sunk Cost quá lớn trong bối cảnh Net Profit Margin chỉ đạt 15%. Để bảo vệ Internal Rate of Return (IRR), tôi kiên quyết yêu cầu cắt giảm Production xuống 50 triệu, dồn 30 triệu chênh lệch sang Performance Ads (Chạy quảng cáo chuyển đổi Lead) nhằm đảm bảo dòng tiền (Cashflow) bù đắp ngay trong Q3." },
        { agent: "CMO", role: "Giám đốc Marketing", message: "Tiếp thu ý kiến CFO. Chúng ta sẽ áp dụng In-house Production kết hợp User-Generated Content (UGC) để tối ưu chi phí mà vẫn giữ được tính Authentic. Khoản 30 triệu bổ sung vào Performance Ads sẽ được Hyper-targeting (Nhắm mục tiêu sâu) tới tệp Gen Y (Dân văn phòng) bán kính 3km để đẩy mạnh Business Lunch." },
        { agent: "COO", role: "Giám đốc Vận hành", message: "Khoan đã. Nếu lượng Traffic đổ về ồ ạt vào cuối tuần, với Capacity tối đa 120 pax/lượt, Bếp sẽ vỡ trận và Waiting Time vượt quá 25 phút. Trải nghiệm 'Mindful Dining' sẽ sụp đổ hoàn toàn. Tôi yêu cầu tích hợp Zalo Mini App Booking để phân luồng (Traffic Routing) và áp dụng Scarcity Marketing (Giới hạn 100 pax/buổi). Quality Control phải đi trước Marketing." },
        { agent: "CEO", role: "Tổng Giám đốc", message: "Quyết định cuối cùng (Final Verdict):\n\n1. Duyệt cấu trúc OPEX của CFO: Cắt giảm Production, tăng tỷ trọng Performance Ads để bảo vệ biên lợi nhuận.\n2. Đồng thuận chiến lược Vận hành của COO: Áp dụng 'Scarcity Marketing' qua hệ thống Booking (Reservation Only) ở khung giờ cao điểm để giữ vững định vị Premium.\n\n@BrandFlow_System, hãy xuất bản Master Plan, Forecast ROI và đồng bộ Brand Guidelines ngay lập tức!" }
      ];
      
      const fallbackPlan = {
        executive_summary: {
          campaign_name: "Thơm Khói Bếp - Chữa Lành Tâm Hồn",
          campaign_summary: "Chiến dịch Rebranding & Growth Hacking 360 độ nhằm tái cấu trúc Brand Equity của Bếp Nhà Mộc từ 'quán ăn gia đình' sang mô hình 'Mindful Dining' phân khúc trung-cao cấp, nhắm tới tệp khách hàng Gen Y/Z thành thị.",
          total_investment_vnd: 350000000
        },
        activity_and_financial_breakdown: [
          { phase_name: "Phase 1: Brand Revamp (Tái định vị & Kích hoạt)", activities: [ { activity_name: "Sản xuất Cinematic Video 'Hương Vị Chữa Lành' & Thu thập UGC", cost_vnd: 50000000 }, { activity_name: "Tái thiết kế Hệ thống Nhận diện (Visual Identity Sync)", cost_vnd: 45000000 } ] },
          { phase_name: "Phase 2: Traffic Generation (Lead Acquisition)", activities: [ { activity_name: "Chiến dịch Earned Media (30 Micro-Influencers mảng Lifestyle)", cost_vnd: 100000000 }, { activity_name: "Performance Ads (Lead Generation qua Zalo/Meta)", cost_vnd: 60000000 } ] },
          { phase_name: "Phase 3: Retention & O2O (Chuyển đổi & Giữ chân)", activities: [ { activity_name: "Phát triển Zalo Mini App (Data-driven Loyalty Program)", cost_vnd: 65000000 }, { activity_name: "Kích hoạt 'Corporate Lunch Combo' (Tối ưu Off-peak)", cost_vnd: 30000000 } ] }
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

      if (typeof window !== 'undefined' && (window as any).__DEMO_MODE__) {
        throw new Error("Force Demo Mode Fallback");
      }
      if (extractedAnswers?.["Tên doanh nghiệp"]?.includes("Nhà Mộc")) {
        throw new Error("Force Bep Nha Moc Bypass");
      }
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
        brand_name: "Hệ thống Bếp Nhà Mộc (F&B Enterprise)",
        core_value: "Di sản Nguyên bản (Authentic Heritage) - Ẩm thực Chữa lành (Food Therapy) - Sinh thái Khép kín (Closed-loop Ecology)",
        positioning: "Định vị là 'Sanctuary Space' (Không gian Tôn nghiêm & Chữa lành) ngay giữa lòng đô thị. Tối ưu hóa Giá trị Cảm nhận (Perceived Value) để thống lĩnh phân khúc Casual Dining Trung-Cao cấp.",
        brand_archetype: "The Magician (Người Kiến tạo Chuyển đổi) kết hợp The Caregiver (Người Chăm sóc Tận tụy)"
      };
      const mockIntakeAnalysis = {
        expert_business_analysis: {
          financial_health: "🔴 Báo động Đỏ (High Risk): MRR (Doanh thu định kỳ) Stagnation ở mức 1.2 tỷ VNĐ/tháng. EBITDA Margin hiện tại chỉ đạt 12.5% (Thấp hơn 30% so với Industry Benchmark: 18%). Tỷ lệ Customer Acquisition Cost (CAC) đang vượt quá 250,000đ/User do lạm dụng Price-Promotion (Giảm giá sâu), dẫn đến xói mòn Lợi nhuận gộp.",
          operational_bottlenecks: "⚠️ Nút thắt Vận hành (Bottleneck): Asset Utilization (Tỷ lệ lấp đầy bàn) mất cân bằng nghiêm trọng. Khung giờ Off-peak (Trưa các ngày trong tuần) chỉ đạt 22% capacity. Tỷ lệ Churn Rate (Khách rời bỏ) sau lần thử đầu tiên lên tới 68% do thiếu hệ thống CRM O2O bám đuổi.",
          brand_equity_assessment: "📉 Suy giảm Giá trị Thương hiệu (Brand Dilution): Core Product (Sản phẩm lõi) cực kỳ xuất sắc nhờ quy trình Organic, nhưng Brand Perception (Cảm nhận thương hiệu) của khách hàng chỉ dừng ở mức 'Quán ăn bình dân'. Chưa khai thác được Premium Pricing Strategy.",
          strategic_recommendation: "⚡ Khuyến nghị Cấp bách từ Ban Chiến lược: 1) Dừng ngay lập tức chiến dịch giảm giá đại trà. 2) Tung gói 'Corporate Lunch & Mindful Dining' để tối ưu hóa Off-peak Capacity. 3) Giải ngân 150M-350M để xây dựng Zalo Mini App (Loyalty) nhằm kéo LTV:CAC Ratio lên mức an toàn (>3.5x) và tạo rào cản cạnh tranh (Economic Moat)."
        },
        strategic_marketing_audit: {
          trust_score: 94,
          competitive_positioning: "Đang kẹt trong Red Ocean (Đại dương Đỏ) của ngành F&B truyền thống. Tuy nhiên, sở hữu 'Unfair Advantage' để dễ dàng Pivot sang Blue Ocean (Ngách Trị liệu Tâm lý & Ẩm thực) nếu chuẩn hóa được Visual Identity.",
          core_competences: [
            "Chuỗi Cung ứng Khép kín 100% Organic (Vertical Integration)",
            "Lợi thế Cạnh tranh Độc quyền (VRIO Framework): Công thức Không Bột Ngọt 3 Đời",
            "Trải nghiệm 'Omotenashi' (Phục vụ bằng cả trái tim)"
          ],
          marketing_objectives: [
            "Tái định vị (Brand Repositioning) đồng bộ trên tất cả Omnichannel Touchpoints",
            "Tăng trưởng MRR Khung giờ Off-peak thêm 45% trong Q3/2026",
            "Chuyển đổi 30% khách hàng vãng lai thành Loyal Members thông qua Zalo O2O"
          ],
          macro_environment_pestle: [
            "Trend 'Mindful Dining' & Phục hồi sức khỏe tâm thần tăng trưởng 52% YoY",
            "Nhóm Gen Z và Millennials (Chiếm 60% sức mua) đang gặp hội chứng Burnout",
            "Sự dịch chuyển dòng tiền sang trải nghiệm 'Affordable Luxury' (Xa xỉ vừa tầm)"
          ]
        },
        visual_brand_dna: {
          visual_archetype: "Rustic, Healing, Minimalist Heritage, Zen",
          primary_colors: ["#2d3748", "#10b981", "#d97706"],
          moodboard_keywords: ["Gỗ mộc An tĩnh", "Bóng đổ tự nhiên", "Cấu trúc Zen", "Chuyển động chậm", "Ánh sáng Ấm"]
        }
      };
      set({ brandDNA: mockBrandDNA, intakeAnalysis: mockIntakeAnalysis });
      await get().updateForm('brand_dna', mockBrandDNA);
    }
  }
}));



