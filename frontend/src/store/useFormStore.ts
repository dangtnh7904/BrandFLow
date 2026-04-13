import { create } from 'zustand';

// Dev user mặc định - sau này thay bằng JWT auth
const DEV_USER_ID = "user-001";
const PROJECT_NAME = "BrandFlow Strategy Plan";

interface FormStore {
  // Trạng thái
  forms: Record<string, any>;
  projectId: string | null;
  isLoading: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  initialized: boolean;

  // Hành động
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
    // Chỉ chạy 1 lần duy nhất
    if (get().initialized) return;
    set({ initialized: true });

    try {
      // 1. Tạo user trước (upsert)
      await fetch('/api/v1/forms/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': DEV_USER_ID,
        },
        body: JSON.stringify({
          email: "dev@brandflow.vn",
          display_name: "Dev User"
        })
      });

      // 2. List projects của user, tìm project đã có
      const listRes = await fetch('/api/v1/forms/projects', {
        headers: { 'X-User-Id': DEV_USER_ID }
      });
      
      let projectId: string | null = null;

      if (listRes.ok) {
        const projects = await listRes.json();
        if (projects.length > 0) {
          // Dùng project đầu tiên
          projectId = projects[0].id;
        }
      }

      // 3. Nếu chưa có project nào, tạo mới
      if (!projectId) {
        const createRes = await fetch('/api/v1/forms/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': DEV_USER_ID,
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
        headers: { 'X-User-Id': DEV_USER_ID }
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
          'X-User-Id': DEV_USER_ID
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
