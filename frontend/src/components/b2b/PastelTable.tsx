import React from 'react';
import clsx from 'clsx';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string; // e.g. 'bg-purple-50' for a whole column
  headerClassName?: string;
}

interface PastelTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  footerContent?: React.ReactNode;
}

export default function PastelTable<T>({ columns, data, footerContent }: PastelTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#a6a6a6] text-white">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={clsx(
                  "px-4 py-3 font-medium",
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.headerClassName
                )}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/50">
          {(!data || data.length === 0) ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Chưa có dữ liệu</p>
                  <p className="text-xs text-slate-400">Hãy bắt đầu nhập dữ liệu cho form này</p>
                </div>
              </td>
            </tr>
          ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="group">
              {columns.map((col, colIndex) => (
                <td 
                  key={colIndex} 
                  className={clsx(
                    "px-4 py-3.5 transition-colors",
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.className || "bg-white group-hover:bg-slate-50/50 text-slate-600"
                  )}
                >
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))
          )}
        </tbody>
        {footerContent && (
          <tfoot className="bg-[#8b8b8b] text-white font-semibold">
            {footerContent}
          </tfoot>
        )}
      </table>
    </div>
  );
}
