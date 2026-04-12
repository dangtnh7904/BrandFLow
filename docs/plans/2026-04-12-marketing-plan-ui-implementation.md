# Marketing Plan UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build out the static UI components and page layouts for all 23 Marketing Strategy forms across Phase A, Phase B, and Phase C within the Next.js app, following the designated clean, light-mode, pastel-table stylistic guidelines. State and API integration are excluded.

**Architecture:** We will first rewrite `B2BSidebar.tsx` to include the full list of 23 forms navigating to their respective routes in `app/planning/*`. Then, we will create/update the pages under `app/planning/` using existing generic UI wrappers (like `B2BPageTemplate.tsx`) alongside newly styled UI components (Cards, Alerts, DataGrids with pastel columns).

**Tech Stack:** Next.js (App router), React, Tailwind CSS, Lucide React (icons).

---

### Task 1: Rebuild the Sidebar Navigation

**Files:**
- Modify: `frontend/src/components/b2b/B2BSidebar.tsx`

**Step 1: Write the failing test / visual verification**
Run: `npm run dev`
Expected: Wait for Next.js to start. Go to `http://localhost:3000/planning/a1-mission`. The sidebar should visually display the OLD menu items lacking all 23 forms.

**Step 2: Write minimal implementation**
Update `B2BSidebar.tsx` to map out Phase A, Phase B, and Phase C menu items exactly as scoped (e.g. A.1 Tuyên bố Sứ mệnh -> `/planning/a1-mission`, B.1 Mục tiêu Vận hành -> `/planning/b1-objectives`, etc.). Ensure styling uses the active/inactive generic logic already present. Update paths uniformly.

**Step 3: Run test to verify it passes**
Run: `npm run dev` again (or hot reload).
Expected: The sidebar correctly expands displaying all 19 links under Phase A, B, and C. Clicking them routes to existing/new paths.

**Step 4: Commit**
```bash
cd frontend && git add src/components/b2b/B2BSidebar.tsx
git commit -m "feat(ui): update side menu to include all 23 marketing forms"
```

---

### Task 5: Document Completion
Since UI creation spans many files, we will recursively apply similar tasks to Phase B and Phase C in subsequent sessions.
Update `docs/ProjectDocs/progress.md`.
