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
}

export const useFormStore = create<FormStore>((set, get) => ({
  forms: {},
  projectId: null,
  isLoading: true,
  saveStatus: 'idle',
  initialized: false,

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
        console.error("LỖI KẾT NỐI: Không thể tạo hoặc tìm project. (Khả năng cao do Máy chủ Backend Python/FastAPI chưa được bật. Vui lòng tắt terminal hiện tại và chạy file start_fullstack.bat để bật cả 2 server cùng lúc)");
        set({ saveStatus: 'error', isLoading: false });
      }
    } catch (e) {
      console.error("Lỗi khởi tạo DB:", e);
      set({ saveStatus: 'error', isLoading: false });
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
  }
}));
