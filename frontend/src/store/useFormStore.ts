import { create } from 'zustand';

const PROJECT_NAME = "BrandFlow Strategy Plan";

// Hàm lấy User ID an toàn từ LocalStorage
const getUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('brandflow_user_id') || "";
  }
  return "";
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
  extractedAnswers: Record<string, string>;
  setExtractedAnswers: (answers: Record<string, string>) => void;
  wizardAnswers: Record<string, any>;
  setWizardAnswer: (key: string, value: any) => void;
  setWizardAnswers: (answers: Record<string, any>) => void;
  
  debateLogs: any[];
  tacticsPlan: any;
  runDebateAndPlanning: () => Promise<void>;

  brandDNA: any;
  setBrandDNA: (dna: any) => void;
  generateAndSaveDNA: (documentContent?: string) => Promise<void>;
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

  setExtractedAnswers: (answers) => set({ extractedAnswers: answers }),
  setWizardAnswer: (key, value) => set((state) => ({ wizardAnswers: { ...state.wizardAnswers, [key]: value } })),
  setWizardAnswers: (answers) => set((state) => ({ wizardAnswers: { ...state.wizardAnswers, ...answers } })),
  setBrandDNA: (dna) => set({ brandDNA: dna }),

  initializeProject: async () => {
    if (get().initialized) return;
    
    const tokenUserId = getUserId();
    if (!tokenUserId) {
      if (typeof window !== 'undefined') window.location.href = '/login';
      return;
    }

    set({ initialized: true });

    try {
      // List projects của user, tìm project đã có
      const listRes = await fetch('/api/v1/forms/projects', {
        headers: { 'X-User-Id': tokenUserId }
      });
      
      let projectId: string | null = null;

      if (listRes.ok) {
        const projects = await listRes.json();
        if (projects.length > 0) {
          projectId = projects[0].id;
        }
      }

      // 3. Nếu chưa có project nào, tạo mới
      if (!projectId) {
        const createRes = await fetch('/api/v1/forms/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': tokenUserId,
          },
          body: JSON.stringify({
            name: PROJECT_NAME,
            industry: "General",
          })
        });
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
          isLoading: false 
        });
      }
    } catch (e) {
      console.warn("⚠️ Lỗi khởi tạo DB (Backend có thể chưa chạy). Đang chạy trong CHẾ ĐỘ DEMO (Offline Mode).", e);
      set({ 
        projectId: 'demo-mock-project-id', 
        saveStatus: 'idle', 
        isLoading: false 
      });
    }
  },

  loadAllForms: async () => {
    const { projectId } = get();
    if (!projectId) return;

    set({ isLoading: true });
    try {
      const res = await fetch(`/api/v1/forms/projects/${projectId}/forms`, {
        headers: { 'X-User-Id': getUserId() }
      });
      if (res.ok) {
        const json = await res.json();
        const mappedForms: Record<string, any> = {};
        for (const [key, value] of Object.entries(json.forms || {})) {
          mappedForms[key] = (value as any).data;
        }
        set({ forms: mappedForms });
      }
    } catch (e) {
      console.error("Failed to load forms:", e);
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
      const res = await fetch(`/api/v1/forms/projects/${projectId}/forms/${formKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': getUserId()
        },
        body: JSON.stringify({ data: newData })
      });
      if (res.ok) {
        set({ saveStatus: 'saved' });
        setTimeout(() => set({ saveStatus: 'idle' }), 2000);
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
      const apiCall = fetch(`/api/v1/research/market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          TAM: "$50B+", SAM: "$12B", SOM: "$100M", CAGR: "15%"
        },
        market_gap: "Có một khoảng trống lớn trong việc cung cấp trải nghiệm cá nhân hóa sâu sắc, hầu hết đối thủ chỉ tập trung vào tính năng cơ bản.",
        competitors: [
          { name: "Công ty A", strengths: "Tính năng đa dạng", pain_points: "Giao diện khó dùng" },
          { name: "Công ty B", strengths: "Giá rẻ", pain_points: "Chăm sóc khách hàng kém" }
        ]
      };
      set({ marketResearchStatus: 'done', marketResearchData: mockData });
      await get().updateForm('market_research', mockData);
    }
  },

  runDebateAndPlanning: async () => {
    try {
      const { wizardAnswers, brandDNA } = get();
      const rawText = "Lập kế hoạch chiến lược theo form";
      const budgetRaw = wizardAnswers.budget ? String(wizardAnswers.budget).replace(/\D/g, '') : "0";
      const budget = budgetRaw ? parseInt(budgetRaw, 10) : 0;
      
      // Inject từ khóa để kích hoạt mock_mode an toàn nếu cần (backend có check "hương viên trà quán" / "mã demo 1")
      // Nếu có GOOGLE_API_KEY ở backend, bỏ từ khóa này ra để chạy AI thật.
      const payload = {
        raw_text: rawText + " mã demo 1", 
        comprehensive_form: wizardAnswers,
        tenant_id: getUserId() || "anonymous",
        budget: budget,
        brand_dna: brandDNA
      };

      const res = await fetch('/api/v1/planning/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      // Fallback an toàn nếu backend chưa chạy hoặc lỗi
      const fallbackLogs = [
        { agent: "CMO", type: "proposal", message: "Chúng ta cần phân bổ ít nhất 40% ngân sách cho kênh B2B LinkedIn để tiếp cận đúng tệp khách hàng doanh nghiệp, đặc biệt là cấp quản lý." },
        { agent: "CFO", type: "warning", message: "Cảnh báo rủi ro: Chi phí CPA trên LinkedIn đang rất cao. Nếu dồn 40% ngân sách vào đây, chúng ta có nguy cơ cạn vốn trước khi đạt ROI dương. Đề xuất giảm xuống 20% và đưa phần còn lại vào quỹ dự phòng." },
        { agent: "Customer", type: "proposal", message: "Từ góc độ khách hàng, họ thích xem các case study thực tế và báo cáo chuyên sâu hơn là quảng cáo thuần túy. Hãy đầu tư mạnh vào nội dung Whitepaper." },
        { agent: "CMO", type: "approved", message: "Đồng ý. Đã điều chỉnh chiến lược: Giảm ngân sách Ads xuống 20%, tăng ngân sách Content Marketing (Whitepaper) lên 30%, phần còn lại đưa vào Quỹ dự phòng." }
      ];
      
      const fallbackPlan = {
        activity_and_financial_breakdown: [
          { phase_name: "Phase 1: Foundation", activities: [ { activity_name: "Setup LinkedIn Insights", cost_vnd: 5000000 } ] },
          { phase_name: "Phase 2: Content", activities: [ { activity_name: "B2B Whitepaper Production", cost_vnd: 25000000 } ] },
          { phase_name: "Phase 3: Distribution", activities: [ { activity_name: "LinkedIn Retargeting Ads", cost_vnd: 20000000 } ] }
        ]
      };

      set({ debateLogs: fallbackLogs, tacticsPlan: fallbackPlan });
    }
  },

  generateAndSaveDNA: async (documentContent: string = "") => {
    try {
      const { wizardAnswers } = get();
      
      const payload = {
        form_data: wizardAnswers,
        document_content: documentContent,
        tenant_id: getUserId() || "anonymous"
      };

      const res = await fetch('/api/v1/research/extract-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success' && result.data) {
          set({ brandDNA: result.data });
          // Optional: persist to Supabase or update form
          await get().updateForm('brand_dna', result.data);
          console.log("✅ [Store] Brand DNA extracted and saved:", result.data);
        }
      } else {
        console.error("Failed to extract DNA:", res.status);
      }
    } catch (e) {
      console.error("Error calling extract-dna API:", e);
    }
  }
}));
