import React, { useRef, useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, AlertCircle, FileJson } from 'lucide-react';

const MOSCOW_COLORS = {
  MUST_HAVE:   { bg: '#065f46', border: '#10B981', text: '#6ee7b7', label: 'BẮT BUỘC' },
  SHOULD_HAVE: { bg: '#78350f', border: '#F59E0B', text: '#fcd34d', label: 'NÊN CÓ' },
  COULD_HAVE:  { bg: '#7f1d1d', border: '#EF4444', text: '#fca5a5', label: 'CÓ THỂ CẮT' },
};

export default function KanbanPdfExporter({ campaignData, budgetData, iteration }) {
  const kanbanRef = useRef(null);
  const [exportError, setExportError] = useState(null);

  const execSum = campaignData?.executive_summary || {};
  const breakdown = campaignData?.activity_and_financial_breakdown || [];
  const phasedExec = campaignData?.phased_execution || [];

  const groupedPhases = breakdown.map(b => {
    const p = phasedExec.find(x => x.phase_id === b.phase_id);
    return {
      name: p ? p.phase_name : b.phase_id,
      duration: p ? p.duration : '',
      acts: b.activities || [],
    };
  });

  const totalBudget = budgetData ? budgetData.reduce((s, a) => s + a.value, 0) : 0;
  const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleExportPdf = useCallback(async () => {
    const el = kanbanRef.current;
    if (!el) return;

    setExportError(null);
    el.style.display = 'block';

    await new Promise(r => setTimeout(r, 300));

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0B1437',
        logging: false,
        windowWidth: 1400,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgW = canvas.width;
      const imgH = canvas.height;

      const pdfW = 297;
      const pdfH = (imgH * pdfW) / imgW;

      const pdf = new jsPDF({
        orientation: pdfH > 420 ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [pdfW, Math.max(pdfH, 210)],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);

      const safeName = (execSum.campaign_name || 'BrandFlow').replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF ]/g, '').trim().replace(/\s+/g, '_');
      pdf.save(`${safeName}_Kanban_v${iteration}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      setExportError('Trình duyệt không hỗ trợ tạo PDF hoặc bị thiếu tài nguyên. Vui lòng bấm JSON Fallback để tải toàn bộ kế hoạch.');
    } finally {
      el.style.display = 'none';
    }
  }, [campaignData, iteration, execSum]);

  const handleExportJson = useCallback(() => {
    try {
      const safeName = (execSum.campaign_name || 'BrandFlow').replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF ]/g, '').trim().replace(/\s+/g, '_');
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(campaignData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${safeName}_Kanban_v${iteration}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setExportError(null);
    } catch (err) {
      console.error('JSON export error', err);
      setExportError('Đã có lỗi khi xuất JSON.');
    }
  }, [campaignData, iteration, execSum]);

  return (
    <div className="flex flex-col items-end gap-3 z-10">
      {/* Export Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleExportJson}
          className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-[#0075FF]/40 hover:bg-indigo-600 shadow-[0_4px_15px_rgba(79,70,229,0.3)]/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg hover:shadow-[#0075FF]/20 transition-all w-full sm:w-auto justify-center"
        >
          <FileJson size={16} /> JSON Fallback
        </button>

        <button
          onClick={handleExportPdf}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-[1.03] w-full sm:w-auto justify-center"
        >
          <Download size={16} />
          Xuất PDF Kanban
        </button>
      </div>

      {exportError && (
        <div className="text-rose-400 border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 rounded-lg text-xs flex items-start gap-2 shadow-sm animate-fadeIn max-w-[350px]">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium text-[11px]">{exportError}</span>
        </div>
      )}

      {/* Hidden Kanban Layout for PDF Rendering */}
      <div
        ref={kanbanRef}
        style={{
          display: 'none',
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '1400px',
          fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
          background: '#0B1437',
          color: '#fff',
          padding: '40px',
          zIndex: -1,
        }}
      >
        {/* === HEADER === */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          borderBottom: '3px solid #0075FF', paddingBottom: '24px', marginBottom: '32px',
        }}>
          <div>
            <div style={{ fontSize: '14px', color: '#0075FF', fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
              BRANDFLOW STRATEGY REPORT
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', lineHeight: 1.2, maxWidth: '800px' }}>
              {execSum.campaign_name || 'Chiến Dịch Marketing'}
            </div>
            <div style={{ fontSize: '14px', color: '#A0AEC0', marginTop: '12px', maxWidth: '700px', lineHeight: 1.6 }}>
              {execSum.campaign_summary || ''}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              background: 'linear-gradient(135deg, #0075FF, #38bdf8)',
              color: '#fff', fontWeight: 900, fontSize: '28px',
              padding: '16px 28px', borderRadius: '16px', marginBottom: '8px',
            }}>
              {(totalBudget / 1000000).toLocaleString()}
              <span style={{ fontSize: '14px', fontWeight: 600, marginLeft: '4px' }}>Triệu VNĐ</span>
            </div>
            <div style={{ fontSize: '11px', color: '#A0AEC0', letterSpacing: '2px' }}>
              NGÂN SÁCH TỔNG | VER.{iteration} | {today}
            </div>
          </div>
        </div>

        {/* === MoSCoW LEGEND === */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
          {Object.entries(MOSCOW_COLORS).map(([key, val]) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: val.bg, border: `2px solid ${val.border}`,
              padding: '8px 16px', borderRadius: '10px',
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: val.border }}></div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: val.text, letterSpacing: '1px' }}>{val.label}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#A0AEC0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 700 }}>MỤC TIÊU:</span>
            <span style={{ color: '#fff' }}>{execSum.core_objectives || 'N/A'}</span>
          </div>
        </div>

        {/* === KANBAN BOARD === */}
        <div style={{
          display: 'flex', gap: '20px', alignItems: 'flex-start',
        }}>
          {groupedPhases.map((phase, pIdx) => {
            const phaseCost = phase.acts.reduce((s, a) => s + (a.cost_vnd || 0), 0);
            return (
              <div key={pIdx} style={{
                flex: '1 1 0',
                minWidth: 0,
                background: '#111C44',
                borderRadius: '16px',
                border: '1px solid #1B254B',
                overflow: 'hidden',
              }}>
                {/* Column Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #1B254B, #111C44)',
                  padding: '18px 20px',
                  borderBottom: '2px solid #0075FF',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {phase.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#A0AEC0', fontWeight: 600 }}>{phase.duration}</span>
                    <span style={{
                      fontSize: '12px', fontWeight: 900, color: '#0075FF',
                      background: '#0075FF20', padding: '4px 10px', borderRadius: '8px',
                    }}>
                      {(phaseCost / 1000000).toLocaleString()}Tr
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div style={{ padding: '12px' }}>
                  {phase.acts.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#A0AEC0', fontSize: '12px', fontStyle: 'italic' }}>
                      Không có hoạt động
                    </div>
                  ) : (
                    phase.acts.map((act, aIdx) => {
                      const mc = MOSCOW_COLORS[act.moscow_tag] || MOSCOW_COLORS.SHOULD_HAVE;
                      return (
                        <div key={aIdx} style={{
                          background: '#0B1437',
                          border: `1px solid ${mc.border}40`,
                          borderLeft: `4px solid ${mc.border}`,
                          borderRadius: '12px',
                          padding: '14px 16px',
                          marginBottom: '10px',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', lineHeight: 1.4, maxWidth: '70%' }}>
                              {act.activity_name}
                            </div>
                            <div style={{
                              fontSize: '12px', fontWeight: 900, color: mc.text,
                              background: mc.bg, padding: '3px 8px', borderRadius: '6px',
                              border: `1px solid ${mc.border}60`, flexShrink: 0,
                            }}>
                              {mc.label}
                            </div>
                          </div>
                          <div style={{ fontSize: '11px', color: '#A0AEC0', lineHeight: 1.5, marginBottom: '10px' }}>
                            {act.description}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1B254B', paddingTop: '8px' }}>
                            <div style={{ fontSize: '11px', color: '#0075FF', fontWeight: 700 }}>
                              📊 {act.kpi_commitment}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                              {(act.cost_vnd || 0).toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* === FOOTER === */}
        <div style={{
          marginTop: '32px', paddingTop: '20px',
          borderTop: '1px solid #1B254B',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: '11px', color: '#A0AEC0' }}>
            Xuất bởi <span style={{ color: '#0075FF', fontWeight: 800 }}>BrandFlow AI Strategy Engine</span> • Phiên bản {iteration} • {today}
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {Object.entries(MOSCOW_COLORS).map(([key, val]) => {
              const sum = breakdown.reduce((s, ph) =>
                s + (ph.activities || []).filter(a => a.moscow_tag === key).reduce((ss, a) => ss + (a.cost_vnd || 0), 0)
              , 0);
              return sum > 0 ? (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: val.border }}></div>
                  <span style={{ fontSize: '11px', color: val.text, fontWeight: 700 }}>
                    {val.label}: {(sum / 1000000).toLocaleString()}Tr
                  </span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
