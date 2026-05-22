"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Activity, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [funnelStats, setFunnelStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchAuditData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('brandflow_token');
      const isAdmin = localStorage.getItem('brandflow_is_admin');
      
      if (!token || isAdmin !== 'true') {
        router.push('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [summaryRes, visitorsRes, funnelRes] = await Promise.all([
        fetch('/api/v1/audit/visitors/summary', { headers }),
        fetch('/api/v1/audit/visitors?limit=50', { headers }),
        fetch('/api/v1/audit/funnel-stats', { headers })
      ]);

      if (!summaryRes.ok || !visitorsRes.ok || !funnelRes.ok) {
        throw new Error('Bạn không có quyền truy cập hoặc phiên đăng nhập đã hết hạn.');
      }

      const summaryData = await summaryRes.json();
      const visitorsData = await visitorsRes.json();
      const funnelData = await funnelRes.json();

      setSummary(summaryData.data);
      setVisitors(visitorsData.data);
      setFunnelStats(funnelData.data || []);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Shield className="w-8 h-8 text-amber-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-400">
              Quản Trị Hệ Thống
            </span>
          </h1>
          <p className="text-linear-text-muted mt-2">Theo dõi lưu lượng truy cập và Audit Logs</p>
        </div>
        <button 
          onClick={fetchAuditData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-linear-surface border border-linear-border rounded-lg hover:bg-linear-surface/80 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          {error}
        </div>
      ) : loading && !summary ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-linear-surface border border-linear-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 text-linear-text-muted mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-sm">Tổng Số Khách</span>
              </div>
              <div className="text-4xl font-black">{summary?.total_unique_visitors || 0}</div>
            </div>
            
            <div className="bg-linear-surface border border-linear-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 text-linear-text-muted mb-4">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-sm">Truy Cập Hôm Nay</span>
              </div>
              <div className="text-4xl font-black">{summary?.active_today || 0}</div>
            </div>

            <div className="bg-linear-surface border border-linear-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 text-linear-text-muted mb-4">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-sm">Trạng Thái SOC 2</span>
              </div>
              <div className="text-2xl font-black text-emerald-500 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                Đang Giám Sát
              </div>
            </div>
          </div>

          <div className="bg-linear-surface border border-linear-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-linear-border flex items-center justify-between bg-black/10">
              <h2 className="text-xl font-bold">50 Phiên Truy Cập Gần Nhất</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-black/20 text-linear-text-muted">
                  <tr>
                    <th className="px-6 py-4">Visitor IP / Key</th>
                    <th className="px-6 py-4">User Agent</th>
                    <th className="px-6 py-4">Lượt Truy Cập</th>
                    <th className="px-6 py-4">Gần Nhất</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-linear-border">
                  {visitors.map((v, idx) => (
                    <tr key={idx} className="hover:bg-black/10 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{v.visitor_key}</td>
                      <td className="px-6 py-4 truncate max-w-[200px]" title={v.user_agent}>
                        {v.user_agent || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-semibold">
                          {v.visit_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-linear-text-muted whitespace-nowrap">
                        {v.last_seen ? new Date(v.last_seen + 'Z').toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                  {visitors.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-linear-text-muted">
                        Chưa có dữ liệu truy cập
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-linear-surface border border-linear-border rounded-2xl shadow-sm overflow-hidden mt-8">
            <div className="p-6 border-b border-linear-border flex items-center justify-between bg-black/10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                Thống Kê Phễu Chức Năng (Funnel Stats)
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {funnelStats.map((stat, idx) => {
                  const maxUsage = Math.max(...funnelStats.map((s) => s.usage_count));
                  const percentage = Math.round((stat.usage_count / maxUsage) * 100);
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="font-mono text-blue-400">{stat.path}</span>
                        <span>{stat.usage_count} lượt</span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="bg-gradient-to-r from-amber-500 to-orange-400 h-3 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
                {funnelStats.length === 0 && (
                  <div className="text-center py-6 text-linear-text-muted">Chưa có dữ liệu thống kê phễu</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
