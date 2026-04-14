import React from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
}

export default function SaveIndicator({ status }: SaveIndicatorProps) {
  return (
    <div className="flex items-center space-x-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-linear-border rounded-full text-xs font-semibold shrink-0">
      {status === 'saving' && <><Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" /><span className="text-blue-600 dark:text-blue-400">Đang lưu lên DB...</span></>}
      {status === 'saved' && <><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /><span className="text-cyan-400">Đã lưu tự động</span></>}
      {status === 'idle' && <><Save className="w-3.5 h-3.5 text-linear-text-muted" /><span className="text-linear-text-muted">Đang đồng bộ</span></>}
      {status === 'error' && <><span className="text-rose-600 dark:text-rose-400">Lỗi kết nối Server</span></>}
    </div>
  );
}
