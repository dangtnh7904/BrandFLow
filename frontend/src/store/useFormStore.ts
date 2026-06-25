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
        { agent: "CMO", role: "Giám đốc Marketing", message: "Chào các vị lãnh đạo. Tôi xin trình bày bản chiến lược tái định vị 'Thơm Khói Bếp - Chữa Lành Tâm Hồn'. Dựa trên AI Insight, CAC (Chi phí thu hút khách hàng mới) của chúng ta đang quá cao do lạm dụng giảm giá, trong khi LTV (Giá trị vòng đời) lại thấp. Chiến dịch này sẽ đánh thẳng vào phân khúc 'Mindful Dining' để nâng Perceived Value (Giá trị cảm nhận). Đề xuất ngân sách Phase 1 & 2 là 355 triệu VNĐ, tập trung vào Cinematic Hero Video và Booking 30 KOLs/Food Reviewer mảng Lifestyle để kích hoạt luồng thảo luận." },
        { agent: "SYSTEM", role: "Hệ thống Kiểm toán", message: "⚠️ CẢNH BÁO ROI: Phân bổ ngân sách Media chiếm tới 65% tổng ngân sách khởi điểm. Mức độ rủi ro dòng tiền: CAO. Yêu cầu CFO và COO tham gia điều phối." },
        { agent: "CFO", role: "Giám đốc Tài chính", message: "Tôi đồng ý cần một chiến dịch Rebranding mạnh tay, nhưng mức 80 triệu cho Cinematic Video là Sunk Cost (Chi phí chìm) quá lớn trong bối cảnh biên lợi nhuận chỉ 15%. Để tối ưu IRR (Tỷ suất hoàn vốn nội bộ), tôi yêu cầu cắt giảm ngân sách Production xuống 50 triệu, dồn 30 triệu chênh lệch sang Performance Ads (Chạy quảng cáo chuyển đổi) để đảm bảo có dòng tiền ngắn hạn bù đắp." },
        { agent: "CMO", role: "Giám đốc Marketing", message: "Chấp nhận điều chỉnh của CFO. Chúng ta sẽ áp dụng phương án In-house Production kết hợp User-Generated Content (UGC) để tiết kiệm chi phí mà vẫn giữ được tính Authentic (Chân thực) của thương hiệu. 30 triệu bổ sung vào Performance Ads sẽ nhắm mục tiêu (Targeting) tới tệp khách hàng văn phòng (Gen Y) bán kính 3km để đẩy mạnh Business Lunch." },
        { agent: "COO", role: "Giám đốc Vận hành", message: "Khoan đã. Nếu các anh đổ Traffic ồ ạt vào cuối tuần, với capacity (công suất) tối đa 120 pax/lượt, bếp sẽ vỡ trận và thời gian chờ (Waiting time) vượt quá 25 phút. Trải nghiệm 'chữa lành' sẽ biến thành thảm họa. Tôi yêu cầu tích hợp Zalo Mini App Booking để phân luồng khách hàng (Traffic Routing) và giới hạn 100 pax/buổi. Chất lượng dịch vụ phải đi trước chiến dịch Marketing." },
        { agent: "CEO", role: "Tổng Giám đốc", message: "Quyết định cuối cùng (Final Verdict):\n\n1. Duyệt cấu trúc ngân sách mới của CFO: Giảm Production, tăng Performance Ads để đảm bảo Cashflow.\n2. Đồng thuận tuyệt đối với COO: Triển khai mô hình 'Scarcity Marketing' (Khan hiếm) qua hệ thống Booking bắt buộc (Reservation Only) ở khung giờ cao điểm để giữ vững định vị 'Healing F&B'.\n\n@BrandFlow_Agent, hãy xuất bản Master Plan và đồng bộ Brand Guidelines ngay lập tức!" }
      ];
      
      const fallbackPlan = {
        executive_summary: {
          campaign_name: "Thơm Khói Bếp - Chữa Lành Tâm Hồn",
          campaign_summary: "Chiến dịch Rebranding & Growth Hacking 360 độ nhằm tái định vị Bếp Nhà Mộc từ 'quán ăn gia đình' sang mô hình 'Mindful Dining' trung-cao cấp, nhắm tới tệp khách hàng Gen Y/Z thành thị.",
          total_investment_vnd: 350000000
        },
        activity_and_financial_breakdown: [
          { phase_name: "Phase 1: Brand Revamp (Tái định vị & Kích hoạt)", activities: [ { activity_name: "Sản xuất Cinematic Video 'Hương Vị Chữa Lành' & UGC", cost_vnd: 50000000 }, { activity_name: "Tái thiết kế Hệ thống Nhận diện Thị giác (Visual Identity Sync)", cost_vnd: 45000000 } ] },
          { phase_name: "Phase 2: Traffic Generation (Bùng nổ Thảo luận)", activities: [ { activity_name: "Chiến dịch KOC/KOL Review (30 Micro-Influencers mảng Lifestyle)", cost_vnd: 100000000 }, { activity_name: "Performance Ads (Lead Generation Booking)", cost_vnd: 60000000 } ] },
          { phase_name: "Phase 3: Retention & O2O (Chuyển đổi & Giữ chân)", activities: [ { activity_name: "Xây dựng hệ thống Zalo Mini App & Loyalty Program", cost_vnd: 65000000 }, { activity_name: "Triển khai 'Corporate Lunch Combo' lấp đầy Off-peak", cost_vnd: 30000000 } ] }
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
        core_value: "Di sản (Heritage) - Mộc mạc (Rustic) - Lành sạch (Wholesome)",
        positioning: "Không gian chữa lành tâm hồn thị dân qua trải nghiệm Ẩm thực Việt di sản nguyên bản, 100% nguyên liệu hữu cơ và không bột ngọt.",
        brand_archetype: "The Caregiver (Người chăm sóc) & The Magician (Người kiến tạo sự an yên)"
      };
      const mockIntakeAnalysis = {
        expert_business_analysis: {
          financial_health: "🔴 Báo động (Red Flag): Doanh thu đi ngang 1.2 tỷ VNĐ/tháng (18 tháng qua). Biên lợi nhuận ròng 15% (dưới mức TB ngành 22%). Chỉ số CAC cao bất thường (250,000đ/New User) do lạm dụng Promotion Tactics.",
          strategic_recommendation: "⚡ Khuyến nghị chiến lược (Urgent): Tái định vị (Rebranding) toàn diện từ 'Quán nhậu bình dân' sang mô hình 'Mindful Dining' tầm trung-cao. Khai thác tệp Gen Y/Z (thu nhập khá) để tối ưu hóa LTV."
        },
        strategic_marketing_audit: {
          trust_score: 82,
          competitive_positioning: "Nền tảng sản phẩm xuất sắc nhưng đang bị mắc kẹt ở phân khúc bình dân (Red Ocean). Tiềm năng lớn để độc chiếm ngách 'Healing F&B' (Blue Ocean) nếu cải tổ Visual Identity.",
          core_competences: [
            "Hệ sinh thái cung ứng khép kín 100% Organic",
            "Công thức di sản 3 đời (Cam kết No MSG)",
            "Kiến trúc không gian nhà gỗ cổ bản địa có giá trị check-in cao"
          ],
          marketing_objectives: [
            "Tái định vị (Rebranding) & Nâng cấp Brand Identity",
            "Tăng tỷ lệ lấp đầy (Occupancy Rate) khung giờ off-peak bằng Corporate Lunch",
            "Tối ưu CAC (Customer Acquisition Cost) xuống dưới 150,000đ thông qua Viral Organic"
          ],
          macro_environment_pestle: [
            "Trend 'Mindful Dining' & 'Eat Clean' tăng 45% YoY",
            "Nhu cầu không gian chữa lành (Healing Space) của thị dân",
            "Mô hình O2O (Online-to-Offline) qua Zalo Mini App bùng nổ"
          ]
        },
        visual_brand_dna: {
          visual_archetype: "Rustic, Healing, Minimalist Heritage",
          primary_colors: ["#8B5A2B", "#556B2F", "#F5DEB3"],
          moodboard_keywords: ["Gỗ mộc", "Thiên nhiên", "An tĩnh", "Di sản", "Thủ công"]
        }
      };
      set({ brandDNA: mockBrandDNA, intakeAnalysis: mockIntakeAnalysis });
      await get().updateForm('brand_dna', mockBrandDNA);
    }
  }
}));



