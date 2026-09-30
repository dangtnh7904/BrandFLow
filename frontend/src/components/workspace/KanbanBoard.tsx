"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Kanban, Plus, GripVertical, Clock, DollarSign,
  CheckCircle2, Circle, Loader2, AlertTriangle,
  ChevronDown, Filter, LayoutGrid, ArrowRight
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

type MoSCoWTag = 'MUST_HAVE' | 'SHOULD_HAVE' | 'COULD_HAVE';
type ColumnId = 'todo' | 'in_progress' | 'done';

interface TaskCard {
  id: string;
  title: string;
  description: string;
  budget_vnd: number;
  moscow_tag: MoSCoWTag;
  channel: string;
  kpi: string;
  agent_owner: string;
  column: ColumnId;
  timeline: string;
}

// ═══════════════════════════════════════════════════════════════════
// MOCK DATA (Replace with real data from store in production)
// ═══════════════════════════════════════════════════════════════════

const MOCK_TASKS: TaskCard[] = [
  {
    id: 'task-1',
    title: 'Facebook Ads — Awareness Campaign',
    description: 'Chạy quảng cáo nhận diện thương hiệu trên Facebook & Instagram với 3 tệp khách hàng.',
    budget_vnd: 25_000_000,
    moscow_tag: 'MUST_HAVE',
    channel: 'Promotion',
    kpi: '500 leads / tháng, CPL ≤ 25,000đ',
    agent_owner: '@CMO',
    column: 'todo',
    timeline: 'M1-M2',
  },
  {
    id: 'task-2',
    title: 'Zalo OA — Loyalty Program',
    description: 'Thiết lập Zalo Mini App cho chương trình tích điểm & CSKH tự động.',
    budget_vnd: 15_000_000,
    moscow_tag: 'SHOULD_HAVE',
    channel: 'Process',
    kpi: '200 followers / tháng, Retention +15%',
    agent_owner: '@TechLead',
    column: 'todo',
    timeline: 'M1-M3',
  },
  {
    id: 'task-3',
    title: 'Hero Video Production',
    description: 'Sản xuất video thương hiệu 60s cho TikTok & YouTube.',
    budget_vnd: 50_000_000,
    moscow_tag: 'MUST_HAVE',
    channel: 'Promotion',
    kpi: '100K views, Engagement Rate > 5%',
    agent_owner: '@CreativeDir',
    column: 'in_progress',
    timeline: 'M1',
  },
  {
    id: 'task-4',
    title: 'KOL Micro-Influencer Seeding',
    description: 'Booking 10 Micro-KOLs (50K-200K followers) cho campaign seeding.',
    budget_vnd: 30_000_000,
    moscow_tag: 'SHOULD_HAVE',
    channel: 'People',
    kpi: '50K reach / KOL, ER > 3%',
    agent_owner: '@PRManager',
    column: 'todo',
    timeline: 'M2-M3',
  },
  {
    id: 'task-5',
    title: 'SEO Content Hub Setup',
    description: 'Xây dựng 20 bài viết SEO chuẩn E-E-A-T cho website.',
    budget_vnd: 10_000_000,
    moscow_tag: 'COULD_HAVE',
    channel: 'Place',
    kpi: 'Top 10 Google cho 5 keywords, Organic Traffic +30%',
    agent_owner: '@ContentTeam',
    column: 'done',
    timeline: 'M1-M2',
  },
  {
    id: 'task-6',
    title: 'Email Nurture Sequence',
    description: 'Thiết lập 5-email automation sequence cho lead nurturing.',
    budget_vnd: 5_000_000,
    moscow_tag: 'COULD_HAVE',
    channel: 'Promotion',
    kpi: 'Open Rate > 25%, CTR > 5%',
    agent_owner: '@GrowthHacker',
    column: 'in_progress',
    timeline: 'M2',
  },
];

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

const formatVND = (amount: number): string => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toString();
};

const MOSCOW_CONFIG: Record<MoSCoWTag, { label: string; color: string; bg: string; border: string }> = {
  MUST_HAVE: { label: 'Must Have', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  SHOULD_HAVE: { label: 'Should Have', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  COULD_HAVE: { label: 'Could Have', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
};

const COLUMN_CONFIG: Record<ColumnId, { title: string; icon: React.ElementType; accent: string; headerBg: string }> = {
  todo: { title: 'To Do', icon: Circle, accent: 'text-slate-400', headerBg: 'bg-slate-500/5 border-slate-500/15' },
  in_progress: { title: 'In Progress', icon: Loader2, accent: 'text-blue-400', headerBg: 'bg-blue-500/5 border-blue-500/15' },
  done: { title: 'Done', icon: CheckCircle2, accent: 'text-emerald-400', headerBg: 'bg-emerald-500/5 border-emerald-500/15' },
};

// ═══════════════════════════════════════════════════════════════════
// TASK CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════

function TaskCardItem({ task, onMove }: { task: TaskCard; onMove: (id: string, target: ColumnId) => void }) {
  const moscow = MOSCOW_CONFIG[task.moscow_tag];
  const isDone = task.column === 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.15)' }}
      className={`
        group relative p-4 rounded-2xl border transition-all duration-200 cursor-default
        bg-linear-surface/60 dark:bg-slate-800/40 backdrop-blur-sm
        border-linear-border/60 hover:border-linear-border
        ${isDone ? 'opacity-60' : ''}
      `}
    >
      {/* Top row: Channel + MoSCoW */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-linear-text-muted">
          {task.channel}
        </span>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${moscow.color} ${moscow.bg} ${moscow.border}`}>
          {moscow.label}
        </span>
      </div>

      {/* Title */}
      <h4 className={`text-sm font-bold text-foreground mb-1.5 leading-snug ${isDone ? 'line-through opacity-70' : ''}`}>
        {task.title}
      </h4>

      {/* Description */}
      <p className="text-xs text-linear-text-muted leading-relaxed mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Budget + Timeline row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 font-mono">{formatVND(task.budget_vnd)} VND</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-linear-text-muted" />
          <span className="text-[10px] font-semibold text-linear-text-muted font-mono">{task.timeline}</span>
        </div>
      </div>

      {/* KPI */}
      <div className="px-2.5 py-1.5 rounded-lg bg-cyan-500/5 border border-cyan-500/10 mb-3">
        <span className="text-[10px] font-semibold text-cyan-500">KPI: {task.kpi}</span>
      </div>

      {/* Footer: Agent + Move buttons */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-blue-400 font-mono">{task.agent_owner}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.column !== 'todo' && (
            <button
              onClick={() => {
                const prev: ColumnId = task.column === 'done' ? 'in_progress' : 'todo';
                onMove(task.id, prev);
              }}
              className="p-1 rounded-md hover:bg-linear-border/30 text-linear-text-muted hover:text-foreground transition-colors"
              title="Move back"
            >
              <ArrowRight className="w-3 h-3 rotate-180" />
            </button>
          )}
          {task.column !== 'done' && (
            <button
              onClick={() => {
                const next: ColumnId = task.column === 'todo' ? 'in_progress' : 'done';
                onMove(task.id, next);
              }}
              className="p-1 rounded-md hover:bg-emerald-500/10 text-linear-text-muted hover:text-emerald-400 transition-colors"
              title="Move forward"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// KANBAN COLUMN
// ═══════════════════════════════════════════════════════════════════

function KanbanColumn({
  columnId,
  tasks,
  onMoveTask,
}: {
  columnId: ColumnId;
  tasks: TaskCard[];
  onMoveTask: (id: string, target: ColumnId) => void;
}) {
  const config = COLUMN_CONFIG[columnId];
  const ColIcon = config.icon;
  const totalBudget = tasks.reduce((sum, t) => sum + t.budget_vnd, 0);

  return (
    <div className="flex flex-col min-h-[400px]">
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${config.headerBg} mb-4`}>
        <div className="flex items-center gap-2">
          <ColIcon className={`w-4 h-4 ${config.accent} ${columnId === 'in_progress' ? 'animate-spin' : ''}`} style={columnId === 'in_progress' ? { animationDuration: '3s' } : {}} />
          <span className={`text-sm font-bold ${config.accent}`}>{config.title}</span>
          <span className="w-5 h-5 rounded-full bg-linear-border/50 text-[10px] font-bold text-foreground flex items-center justify-center">
            {tasks.length}
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold text-linear-text-muted">
          {formatVND(totalBudget)}
        </span>
      </div>

      {/* Task cards */}
      <div className="flex-1 space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCardItem key={task.id} task={task} onMove={onMoveTask} />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-linear-text-muted/30">
            <LayoutGrid className="w-8 h-8 mb-2" />
            <span className="text-xs font-medium">Không có task</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN KANBAN BOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface KanbanBoardProps {
  initialTasks?: TaskCard[];
}

export default function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<TaskCard[]>(initialTasks || MOCK_TASKS);
  const [filter, setFilter] = useState<MoSCoWTag | 'ALL'>('ALL');

  const moveTask = (taskId: string, targetColumn: ColumnId) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, column: targetColumn } : t
    ));
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'ALL') return tasks;
    return tasks.filter(t => t.moscow_tag === filter);
  }, [tasks, filter]);

  const columns: ColumnId[] = ['todo', 'in_progress', 'done'];

  // Summary stats
  const totalBudget = tasks.reduce((s, t) => s + t.budget_vnd, 0);
  const completedBudget = tasks.filter(t => t.column === 'done').reduce((s, t) => s + t.budget_vnd, 0);
  const mustHaveCount = tasks.filter(t => t.moscow_tag === 'MUST_HAVE').length;

  return (
    <div className="w-full">
      {/* ── Header Bar ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 font-heading">
            <Kanban className="w-6 h-6 text-cyan-500" />
            Kanban Workspace
          </h2>
          <p className="text-sm text-linear-text-muted mt-0.5">
            Quản lý và theo dõi tiến độ thực thi chiến lược Marketing
          </p>
        </div>

        {/* Summary chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <DollarSign className="w-3 h-3" />
            {formatVND(totalBudget)} Tổng
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-500/8 border border-blue-500/15 text-blue-400 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" />
            {formatVND(completedBudget)} Hoàn thành
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" />
            {mustHaveCount} Must-Have
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-linear-text-muted" />
        {(['ALL', 'MUST_HAVE', 'SHOULD_HAVE', 'COULD_HAVE'] as const).map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`
              px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all
              ${filter === tag
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-linear-text-muted hover:text-foreground border border-transparent hover:border-linear-border'
              }
            `}
          >
            {tag === 'ALL' ? 'Tất cả' : MOSCOW_CONFIG[tag].label}
          </button>
        ))}
      </div>

      {/* ── Board Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <KanbanColumn
            key={col}
            columnId={col}
            tasks={filteredTasks.filter(t => t.column === col)}
            onMoveTask={moveTask}
          />
        ))}
      </div>

      {/* ── Budget Progress Bar ── */}
      <div className="mt-8 p-4 rounded-2xl bg-linear-surface/30 border border-linear-border backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-linear-text-muted uppercase tracking-wider">Tiến độ ngân sách</span>
          <span className="text-xs font-mono font-bold text-foreground">
            {formatVND(completedBudget)} / {formatVND(totalBudget)}
          </span>
        </div>
        <div className="h-2 rounded-full bg-linear-border/30 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500"
            initial={{ width: '0%' }}
            animate={{ width: `${totalBudget > 0 ? (completedBudget / totalBudget) * 100 : 0}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
