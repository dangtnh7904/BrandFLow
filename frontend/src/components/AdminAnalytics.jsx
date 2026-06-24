import React, { useState, useEffect } from 'react';
import { RefreshCcw, Activity, Users, Eye, Clock } from 'lucide-react';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Gọi API Audit từ backend
      const res = await fetch('http://localhost:8000/api/v1/audit/visitors/summary?token=brandflow-local-audit-token');
      if (!res.ok) throw new Error('Không thể tải dữ liệu Analytics');
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-100 bg-[#0a0f1e] min-h-screen font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black font-['Be_Vietnam_Pro'] tracking-tight">Real-time Analytics</h1>
        <button 
          onClick={fetchData} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl transition-all border border-blue-500/20 disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-[20px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Users className="w-5 h-5" /></div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Visitors</h3>
          </div>
          <p className="text-4xl font-black text-blue-400 mt-2">{data ? data.total_unique_visitors : '...'}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-[20px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Eye className="w-5 h-5" /></div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Visits</h3>
          </div>
          <p className="text-4xl font-black text-emerald-400 mt-2">{data ? data.total_visits : '...'}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-[20px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><Activity className="w-5 h-5" /></div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Avg Session</h3>
          </div>
          <p className="text-4xl font-black text-amber-400 mt-2">{data ? '2m 14s' : '...'}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-[20px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Clock className="w-5 h-5" /></div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Now</h3>
          </div>
          <p className="text-4xl font-black text-purple-400 mt-2">
            {data && data.recent_activity ? data.recent_activity.length : '0'}
          </p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[20px] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-100">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">Visitor ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">Endpoint</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data && data.recent_activity ? data.recent_activity.map((act, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-300">{act.visitor_id.substring(0,8)}...</td>
                  <td className="px-6 py-4 text-sm text-blue-400">{act.endpoint}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      act.status_code < 400 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {act.status_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(act.timestamp).toLocaleString('vi-VN')}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    {loading ? 'Đang tải dữ liệu...' : 'Chưa có dữ liệu'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
