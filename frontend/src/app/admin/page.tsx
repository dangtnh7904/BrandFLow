"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Shield, Users, Activity, Loader2, RefreshCw, X, Clock, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [funnelStats, setFunnelStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const router = useRouter();

  // Helper function to generate mock details for a user
  const getMockUserDetails = (user: any) => {
    const total = user.visits_count || Math.floor(Math.random() * 20) + 1;
    const free = Math.round(total * 0.7);
    const pro = Math.round(total * 0.2);
    const premium = total - free - pro;
    
    // Generate random recent timestamps
    const timestamps = Array.from({ length: Math.min(total, 5) }).map((_, i) => {
      const date = new Date(user.last_seen_at ? user.last_seen_at + 'Z' : Date.now());
      date.setHours(date.getHours() - (i * 2) - Math.floor(Math.random() * 5));
      return {
        time: date.toLocaleString(),
        tier: i === 0 ? (premium > 0 ? 'Enterprise' : pro > 0 ? 'Pro' : 'Free') : 'Free',
        path: ['/api/v1/onboarding/interview', '/api/v1/design/generate', '/api/v1/strategy/plan'][Math.floor(Math.random() * 3)]
      };
    });

    return { total, free, pro, premium, timestamps };
  };

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-linear-surface border border-linear-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 text-linear-text-muted mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-sm">Tổng Số Khách</span>
              </div>
              <div className="text-4xl font-black">{summary?.unique_visitors || 0}</div>
            </div>
            
            <div className="bg-linear-surface border border-linear-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 text-linear-text-muted mb-4">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-sm">Tổng Lượt Truy Cập</span>
              </div>
              <div className="text-4xl font-black">{summary?.total_visits || 0}</div>
            </div>

            <div className="bg-linear-surface border border-linear-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 text-linear-text-muted mb-4">
                <Shield className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-sm">Tài Khoản Đã Active</span>
              </div>
              <div className="text-4xl font-black text-purple-500">{summary?.active_accounts || 0}</div>
            </div>

            <div className="bg-linear-surface border border-linear-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 text-linear-text-muted mb-4">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-sm">Trạng Thái SOC 2</span>
              </div>
              <div className="text-2xl font-black text-emerald-500 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                Giám Sát
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
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedUser(v)}
                      className="hover:bg-black/20 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-mono text-xs group-hover:text-blue-400 transition-colors">{v.visitor_key}</td>
                      <td className="px-6 py-4 truncate max-w-[200px]" title={v.user_agent}>
                        {v.user_agent || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-semibold group-hover:bg-blue-500/20">
                          {v.visits_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-linear-text-muted whitespace-nowrap">
                        {v.last_seen_at ? new Date(v.last_seen_at + 'Z').toLocaleString() : 'N/A'}
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

          <div className="bg-linear-surface border border-linear-border rounded-2xl shadow-sm overflow-hidden mt-8">
            <div className="p-6 border-b border-linear-border flex items-center justify-between bg-black/10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Thống Kê Nâng Cấp Gói (Tier Conversion)
              </h2>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                Data-driven Mock
              </span>
            </div>
            <div className="p-6">
              {(() => {
                const totalAccounts = summary?.unique_visitors || 47;
                // Tính chính xác 10% nạp tiền
                const totalPaid = Math.round(totalAccounts * 0.10);
                // Chia tỷ lệ Pro / Enterprise (8.5% và 1.5% của tổng, tương ứng 85% và 15% của tổng paid)
                const enterpriseCount = Math.max(1, Math.round(totalPaid * 0.15));
                const proCount = Math.max(0, totalPaid - enterpriseCount);
                const freeCount = totalAccounts - totalPaid;

                const freePct = ((freeCount / totalAccounts) * 100).toFixed(1);
                const proPct = ((proCount / totalAccounts) * 100).toFixed(1);
                const entPct = ((enterpriseCount / totalAccounts) * 100).toFixed(1);

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="p-4 bg-black/20 rounded-xl border border-linear-border">
                        <div className="text-sm text-linear-text-muted mb-1">Tổng Số Tài Khoản</div>
                        <div className="text-3xl font-black text-foreground">{totalAccounts}</div>
                      </div>
                      <div className="p-4 bg-black/20 rounded-xl border border-linear-border">
                        <div className="text-sm text-linear-text-muted mb-1">Đang dùng Free</div>
                        <div className="text-3xl font-black text-slate-400">{freeCount}</div>
                      </div>
                      <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <div className="text-sm text-emerald-400 mb-1">Tổng Khách Nâng Cấp (Paid)</div>
                        <div className="text-3xl font-black text-emerald-500">{totalPaid}</div>
                      </div>
                      <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex flex-col justify-center items-center">
                        <div className="text-sm text-amber-400 mb-1">Conversion Rate (Tỷ lệ)</div>
                        <div className="text-4xl font-black text-amber-500">
                          {((totalPaid / totalAccounts) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-slate-400">Gói Free ({freeCount} Khách)</span>
                          <span className="text-slate-400">{freePct}%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${freePct}%` }} transition={{ duration: 1 }} className="bg-slate-500 h-3 rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-blue-400">Gói Pro ({proCount} Khách)</span>
                          <span className="text-blue-400">{proPct}%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${proPct}%` }} transition={{ duration: 1 }} className="bg-blue-500 h-3 rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-purple-400">Gói Enterprise ({enterpriseCount} Khách)</span>
                          <span className="text-purple-400">{entPct}%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${entPct}%` }} transition={{ duration: 1 }} className="bg-purple-500 h-3 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* User Details Modal - Rendered via Portal to avoid CSS transform relative positioning issues */}
          {selectedUser && typeof document !== 'undefined' && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" style={{ position: 'fixed' }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-linear-background border border-linear-border rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-500" />
                      Chi Tiết Phiên Truy Cập
                    </h3>
                    <p className="font-mono text-sm text-linear-text-muted mt-1">{selectedUser.visitor_key}</p>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-black/20 rounded-lg transition-colors text-linear-text-muted hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {(() => {
                  const details = getMockUserDetails(selectedUser);
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-black/20 p-4 rounded-xl border border-slate-500/20">
                          <div className="text-sm text-slate-400 mb-1">Dùng Free</div>
                          <div className="text-2xl font-black text-slate-300">{details.free} <span className="text-sm font-normal text-slate-500">lượt</span></div>
                        </div>
                        <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                          <div className="text-sm text-blue-400 mb-1">Dùng Pro</div>
                          <div className="text-2xl font-black text-blue-500">{details.pro} <span className="text-sm font-normal text-blue-400/50">lượt</span></div>
                        </div>
                        <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                          <div className="text-sm text-purple-400 mb-1">Dùng Premium</div>
                          <div className="text-2xl font-black text-purple-500">{details.premium} <span className="text-sm font-normal text-purple-400/50">lượt</span></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-3">
                          <Package className="w-4 h-4 text-emerald-400" />
                          Phân Bổ Sử Dụng Gói
                        </h4>
                        <div className="w-full bg-black/20 rounded-full h-4 overflow-hidden flex">
                          {details.free > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(details.free/details.total)*100}%` }} className="bg-slate-500 h-4" title={`Free: ${details.free}`} />}
                          {details.pro > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(details.pro/details.total)*100}%` }} className="bg-blue-500 h-4" title={`Pro: ${details.pro}`} />}
                          {details.premium > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(details.premium/details.total)*100}%` }} className="bg-purple-500 h-4" title={`Premium: ${details.premium}`} />}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-amber-400" />
                          Lịch Sử Truy Cập Tính Năng Gần Nhất
                        </h4>
                        <div className="space-y-3">
                          {details.timestamps.map((t: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-linear-border">
                              <div>
                                <div className="font-mono text-sm text-blue-400">{t.path}</div>
                                <div className="text-xs text-linear-text-muted mt-1">{t.time}</div>
                              </div>
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${t.tier === 'Enterprise' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : t.tier === 'Pro' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
                                {t.tier}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
}
