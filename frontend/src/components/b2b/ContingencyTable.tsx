"use client";

import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContingencyTable() {
 const { language } = useLanguage();

 const RISK_DATA = [
 { id: 1, event: language === 'vi' ? "Chi phí Ads (CAC) tăng vọt > 30%" : "Ad Costs (CAC) surged > 30%", prob: "High", impact: "High", trigger: language === 'vi' ? "CPC > $2.5 trong 3 ngày" : "CPC > $2.5 for 3 days", action: language === 'vi' ? "Chuyển 50% ngân sách sang SEO" : "Shift 50% budget to SEO" },
 { id: 2, event: language === 'vi' ? "Đối thủ ra mắt sản phẩm copy" : "Competitor launches copycat", prob: "Medium", impact: "High", trigger: language === 'vi' ? "Báo cáo nội bộ phát hiện" : "Internal report triggered", action: language === 'vi' ? "Kích hoạt USP Campaign dự phòng" : "Activate contingency USP Campaign" },
 { id: 3, event: language === 'vi' ? "Rớt hạng từ khóa SEO chính" : "Core SEO keywords drop rank", prob: "Low", impact: "Medium", trigger: language === 'vi' ? "Traffic giảm 20% / tuần" : "Traffic drops 20% / week", action: language === 'vi' ? "Push backlink tier 2 & cập nhật nội dung" : "Push tier-2 backlinks & update content" },
 ];

 return (
 <div className="bento-card border border-linear-border bg-linear-surface shadow-sm overflow-hidden p-6 relative">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h3 className="font-bold text-foreground text-lg">B5. Risk Matrix & Contingency</h3>
 <p className="text-sm font-medium text-linear-text-muted">{language === 'vi' ? 'Quản lý rủi ro và các kịch bản kích hoạt dự phòng (Risk Triggers)' : 'Risk Management and Contingency Triggers'}</p>
 </div>
 <div className="flex items-center text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-md text-sm font-bold border border-orange-200">
 <AlertTriangle className="w-4 h-4 mr-2" />
 {language === 'vi' ? 'Phòng thủ Chủ động Active' : 'Active Defense'}
 </div>
 </div>

 <div className="overflow-x-auto mt-4">
 <table className="w-full text-sm text-left border border-linear-border rounded-lg overflow-hidden">
 <thead className="bg-background border-b border-linear-border">
 <tr>
 <th className="py-3 px-4 font-bold text-foreground border-r border-linear-border">{language === 'vi' ? 'Sự kiện Rủi ro' : 'Risk Event'}</th>
 <th className="py-3 px-4 font-bold text-center text-foreground w-28 border-r border-linear-border">{language === 'vi' ? 'Xác suất' : 'Probability'}</th>
 <th className="py-3 px-4 font-bold text-center text-foreground w-28 border-r border-linear-border">{language === 'vi' ? 'Ảnh hưởng' : 'Impact'}</th>
 <th className="py-3 px-4 font-bold text-red-700 dark:text-red-400 border-r border-linear-border bg-red-50 dark:bg-red-500/10">{language === 'vi' ? 'Điểm Kích Hoạt (Trigger Point)' : 'Trigger Point'}</th>
 <th className="py-3 px-4 font-bold border-r border-linear-border bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">{language === 'vi' ? 'Hành động Ứng phó' : 'Contingency Action'}</th>
 </tr>
 </thead>
 <tbody>
 {RISK_DATA.map(row => (
 <tr key={row.id} className="border-b border-linear-border hover:bg-linear-surface/80 transition-colors">
 <td className="py-3 px-4 border-r border-linear-border font-semibold text-foreground">{row.event}</td>
 <td className="py-3 px-4 border-r border-linear-border text-center">
 <span className={`px-2 py-1 rounded text-xs font-bold ${row.prob === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : row.prob === 'Medium' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-green-100 text-green-700'}`}>
 {row.prob}
 </span>
 </td>
 <td className="py-3 px-4 border-r border-linear-border text-center">
 <span className={`px-2 py-1 rounded text-xs font-bold ${row.impact === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : row.impact === 'Medium' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-green-100 text-green-700'}`}>
 {row.impact}
 </span>
 </td>
 <td className="py-3 px-4 border-r border-linear-border text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 font-medium text-sm">{row.trigger}</td>
 <td className="py-3 px-4 border-r border-linear-border text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-bold"><ShieldCheck className="inline-block w-4 h-4 mr-1 mb-0.5" /> {row.action}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
}
