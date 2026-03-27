import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import ScreenUpload from './components/ScreenUpload';
import ScreenSimulation from './components/ScreenSimulation';
import ScreenDashboard from './components/ScreenDashboard';
import { Database, Network } from 'lucide-react';

const initialCampaignData = {
  executive_summary: {
    campaign_name: "Hương Viên Trà Quán: Tìm Lại Sự Tĩnh Tại Sau Dịp Tết",
    campaign_summary:
      'Chiến dịch "Tìm Lại Sự Tĩnh Tại" tập trung khai thác xu hướng sống chậm sau dịp Tết Nguyên Đán, chuyển đổi mô hình từ chờ đợi khách hàng thụ động sang chủ động lan tỏa giá trị chữa lành thông qua mạng xã hội và workshop.',
    core_objectives:
      "Tăng trưởng 20% lượng khách mới, đạt tỷ lệ quay lại 40% và tăng 15% doanh thu tổng thể trong Quý 2/2026.",
    total_budget_vnd: 20000000,
  },
  target_audience_and_brand_voice: {
    target_audience:
      "Người trưởng thành, thu nhập ổn định, mang lối sống hướng nội. Họ đang gặp áp lực công việc đô thị, khao khát tìm kiếm một không gian tĩnh tại tuyệt đối để tái cân bằng cảm xúc",
    brand_voice:
      "Đậm chất thơ, thiền vị, mang tính chữa lành và chân thực. Tuyệt đối không dùng thông điệp 'đại hạ giá' hay quảng cáo ồn ào.",
  },
  phased_execution: [
    {
      phase_id: "phase_1",
      phase_name: "Khơi Gợi & Lan Tỏa (Awareness)",
      duration: "Tháng 4/2026",
    },
    {
      phase_id: "phase_2",
      phase_name: "Trải Nghiệm & Gắn Kết (Engagement & Retention)",
      duration: "Tháng 5/2026",
    },
  ],
  activity_and_financial_breakdown: [
    {
      phase_id: "phase_1",
      activities: [
        {
          id: 1,
          activity_name: "Local Targeted Facebook Ads",
          description:
            "Chạy quảng cáo Facebook bán kính gần xung quanh quán. Sử dụng chuỗi bài viết kể chuyện trà đạo và hình ảnh không không gian tĩnh lặng vàng ấm để khơi gợi cảm xúc bình yên.",
          cost_vnd: 8000000,
          kpi_commitment:
            "Tăng 30% lượng người theo dõi và tương tác tự nhiên trên Fanpage.",
          moscow_tag: "MUST_HAVE",
        },
        {
          id: 2,
          activity_name: "Sản xuất hình ảnh/Video ngắn",
          description:
            "Tự sản xuất hoặc thuê chụp các góc kiến trúc mộc mạc và quay video ngắn hướng dẫn nghệ thuật pha trà làm tư liệu truyền thông trực quan.",
          cost_vnd: 2000000,
          kpi_commitment:
            "Tối thiểu 10 hình ảnh chất lượng cao và 3 video ngắn.",
          moscow_tag: "SHOULD_HAVE",
        },
      ],
    },
    {
      phase_id: "phase_2",
      activities: [
        {
          id: 3,
          activity_name: "Workshop: Tìm lại sự tĩnh tại",
          description:
            "Tổ chức sự kiện thưởng trà cuối tuần quy mô nhỏ, mời chuyên gia trà đạo đến giao lưu nhằm khẳng định định vị chuyên gia và tạo tư liệu truyền thông tự nhiên.",
          cost_vnd: 7000000,
          kpi_commitment:
            "Kín 100% chỗ ngồi dự kiến, gia tăng niềm tin và sự gắn kết với thương hiệu.",
          moscow_tag: "MUST_HAVE",
        },
        {
          id: 4,
          activity_name: "Chương trình kích cầu: Thêm bạn thêm vui",
          description:
            "Tặng kèm mứt truyền thống cho khách hàng đặt bàn nhóm từ ba người trở lên vào các khung giờ vắng để tận dụng tiếp thị truyền miệng.",
          cost_vnd: 3000000,
          kpi_commitment: "Tăng tối thiểu 15% số lượng hóa đơn đi theo nhóm.",
          moscow_tag: "COULD_HAVE",
        },
      ],
    },
  ],
};

const getBudgetData = (data) => {
  const budget = [];
  data.activity_and_financial_breakdown.forEach(phase => {
    phase.activities.forEach(act => {
      budget.push({
        name: act.activity_name.substring(0, 15) + '...',
        value: act.cost_vnd,
        cat: act.moscow_tag
      });
    });
  });
  return budget;
};

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [iteration, setIteration] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [campaignData, setCampaignData] = useState(null);
  const [chartHistory, setChartHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [agentLogs, setAgentLogs] = useState(null);

  const handleGenerate = async (files, url, name, requestText, budgetNum) => {
    setCurrentView('simulation');
    setIteration(1);
    setFeedback('');
    setCampaignData(null);
    setAgentLogs(null);
    setChartHistory([]);
    setIsGenerating(true);
    setGenerateError('');

    try {
      if (files && files.length > 0) {
        const formData = new FormData();
        files.forEach(f => formData.append("files", f));
        await fetch("http://localhost:8000/api/v1/onboarding/upload", { method: "POST", body: formData });
      }

      if (url) {
        await fetch("http://localhost:8000/api/v1/onboarding/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: [url] })
        });
      }

      const rawText = `Tên chiến dịch: ${name || 'N/A'}. Ngân sách: ${budgetNum} VND. Yêu cầu: ${requestText || 'Không mô tả'}`;
      const res = await fetch("http://localhost:8000/api/v1/planning/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText, budget: budgetNum })
      });
      const result = await res.json();
      
      if (result.status === "success" && result.plan) {
         let idCounter = 1;
         let completePlan = result.plan;
         if (completePlan.activity_and_financial_breakdown) {
             completePlan.activity_and_financial_breakdown.forEach(phase => {
                 phase.activities.forEach(act => { act.id = idCounter++; });
             });
         }
         setCampaignData(completePlan);
         setAgentLogs(result.agent_logs || []);
      } else if (result.status === "clarification_needed") {
         alert(result.message || "Thiếu thông tin. Vui lòng bổ sung.");
         setCurrentView('upload');
         setIsGenerating(false);
         return;
      } else {
         throw new Error(result.detail || result.message || "Lỗi tạo kế hoạch từ Agent.");
      }
    } catch(err) {
      setGenerateError(err.message || "Đã xảy ra lỗi kết nối Backend");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveActivity = (id) => {
    setCampaignData(prev => {
      const newBreakdown = prev.activity_and_financial_breakdown.map(phase => ({
        ...phase,
        activities: phase.activities.filter(a => a.id !== id)
      }));
      return { ...prev, activity_and_financial_breakdown: newBreakdown };
    });
  };

  const handleImproveFeedback = async (userFeedback) => {
    if (!userFeedback) return;
    
    setChartHistory(prev => [...prev, { v: iteration, data: getBudgetData(campaignData) }]);
    setFeedback(userFeedback);
    setIteration(prev => prev + 1);
    setCurrentView('simulation');
    
    setIsGenerating(true);
    // Keep a copy to send to API, but clear local state for loading simulation
    const currentPlan = campaignData;
    setCampaignData(null);
    setAgentLogs(null);
    setGenerateError('');

    try {
      const payload = {
         previous_plan: currentPlan,
         budget: currentPlan.executive_summary?.total_budget_vnd || 20000000,
         feedback: userFeedback
      };
      const res = await fetch("http://localhost:8000/api/v1/planning/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      
      if (result.status === "success" && result.plan) {
         let completePlan = result.plan;
         let idCounter = 1;
         if (completePlan.activity_and_financial_breakdown) {
             completePlan.activity_and_financial_breakdown.forEach(phase => {
                 phase.activities.forEach(act => { act.id = idCounter++; });
             });
         }
         setCampaignData(completePlan);
         setAgentLogs(result.agent_logs || []);
      } else {
         throw new Error(result.detail || result.message || "Lỗi cập nhật kế hoạch từ Agent.");
      }
    } catch(err) {
      setGenerateError(err.message || "Đã xảy ra lỗi kết nối Backend khi thực hiện Refine");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateActivity = (id, newFieldValues) => {
    setCampaignData(prev => {
      const newBreakdown = prev.activity_and_financial_breakdown.map(phase => ({
        ...phase,
        activities: phase.activities.map(a => 
          a.id === id ? { ...a, ...newFieldValues } : a
        )
      }));
      return { ...prev, activity_and_financial_breakdown: newBreakdown };
    });
  };

  const handleNavigate = (view) => {
    // Cho phép người dùng nhảy tự do giữa các màn hình
    // Nếu đang ở simulation (AI đang chạy), vẫn cho phép thoát
    setCurrentView(view);
  };

  return (
    <div className="flex min-h-screen bg-[#0B1437] font-sans">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <div className="flex-1 ml-64 flex flex-col">
        <Header currentView={currentView} onNewProjectClick={() => setCurrentView('upload')} onNavigate={handleNavigate} />
        <main className="flex-1 overflow-y-auto w-full">
          {currentView === 'dashboard' && <DashboardOverview />}
          
          {currentView === 'upload' && (
            <ScreenUpload onGenerate={handleGenerate} />
          )}

          {currentView === 'simulation' && (
            <ScreenSimulation 
              iteration={iteration} 
              feedback={feedback} 
              isReady={!!campaignData}
              error={generateError}
              agentLogs={agentLogs}
              onComplete={() => setCurrentView('result')} 
            />
          )}

          {currentView === 'result' && campaignData && (
            <ScreenDashboard 
              campaignData={campaignData}
              budgetData={getBudgetData(campaignData)}
              chartHistory={chartHistory}
              iteration={iteration}
              onRestart={() => setCurrentView('dashboard')}
              onRemoveActivity={handleRemoveActivity}
              onImproveFeedback={handleImproveFeedback}
              onUpdateActivity={handleUpdateActivity}
            />
          )}

          {currentView === 'knowledge' && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="bg-[#111C44] rounded-[20px] p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
                <div className="bg-[#0075FF]/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Database className="w-8 h-8 text-[#0075FF]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Cơ Sở Tri Thức (ChromaDB)</h2>
                <p className="text-[#A0AEC0] text-sm leading-relaxed max-w-lg mx-auto mb-6">
                  Đây là kho lưu trữ các quy tắc thương hiệu, bài học từ các chiến dịch trước, và tài liệu hướng dẫn mà AI Agent của bạn dùng để lập kế hoạch thông minh hơn.
                </p>
                <p className="text-xs text-[#A0AEC0] italic">Tính năng đang được phát triển. Vui lòng quay lại sau.</p>
              </div>
            </div>
          )}

          {currentView === 'agents' && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="bg-[#111C44] rounded-[20px] p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
                <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Network className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Mạng Lưới AI Agent</h2>
                <p className="text-[#A0AEC0] text-sm leading-relaxed max-w-lg mx-auto mb-6">
                  Theo dõi trạng thái hoạt động của các Agent: CMO (MasterPlanner), CFO (Financial Controller), Customer Persona và Learner Agent.
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-[#0B1437] border border-[#1B254B] p-4 rounded-xl">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto mb-2"></div>
                    <p className="text-white font-bold text-sm">CMO</p>
                    <p className="text-[10px] text-[#A0AEC0]">Online</p>
                  </div>
                  <div className="bg-[#0B1437] border border-[#1B254B] p-4 rounded-xl">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto mb-2"></div>
                    <p className="text-white font-bold text-sm">CFO</p>
                    <p className="text-[10px] text-[#A0AEC0]">Online</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
