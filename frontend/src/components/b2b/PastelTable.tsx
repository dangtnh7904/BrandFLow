import React from 'react';
import clsx from 'clsx';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string; // e.g. 'bg-purple-50 dark:bg-purple-500/10' for a whole column
  headerClassName?: string;
}

interface PastelTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  footerContent?: React.ReactNode;
}

export default function PastelTable<T>({ columns, data, footerContent }: PastelTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-linear-border bg-background shadow-lg backdrop-blur-xl">
      <table className="w-full text-sm text-left">
        <thead className="bg-linear-surface text-cyan-400 border-b border-linear-border uppercase tracking-widest text-[11px]">
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
        <tbody className="divide-y divide-linear-border/50">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="group hover:bg-linear-surface/40 transition-colors">
              {columns.map((col, colIndex) => (
                <td 
                  key={colIndex} 
                  className={clsx(
                    "px-4 py-3.5 transition-colors",
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.className || "text-foreground"
                  )}
                >
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footerContent && (
          <tfoot className="bg-linear-surface text-cyan-300 font-semibold border-t border-linear-border">
            {footerContent}
          </tfoot>
        )}
      </table>
    </div>
  );
}
