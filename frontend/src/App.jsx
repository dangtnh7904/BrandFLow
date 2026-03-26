import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import ScreenUpload from './components/ScreenUpload';
import ScreenSimulation from './components/ScreenSimulation';
import ScreenDashboard from './components/ScreenDashboard';

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
  const [campaignData, setCampaignData] = useState(initialCampaignData);
  const [chartHistory, setChartHistory] = useState([]);

  const handleGenerate = () => {
    setCurrentView('simulation');
    setIteration(1);
    setFeedback('');
    setCampaignData(initialCampaignData);
    setChartHistory([]);
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

  const handleImproveFeedback = (userFeedback) => {
    setChartHistory(prev => [...prev, { v: iteration, data: getBudgetData(campaignData) }]);
    setFeedback(userFeedback);
    setIteration(prev => prev + 1);
    setCurrentView('simulation');
    
    if (userFeedback) {
      setTimeout(() => {
        setCampaignData(prev => {
          const newBreakdown = prev.activity_and_financial_breakdown.map(phase => ({
            ...phase,
            activities: phase.activities.filter(a => a.moscow_tag !== 'COULD_HAVE')
          }));
          return { ...prev, activity_and_financial_breakdown: newBreakdown };
        });
      }, 500);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B1437] font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header onNewProjectClick={() => setCurrentView('upload')} />
        <main className="flex-1 overflow-y-auto w-full">
          {currentView === 'dashboard' && <DashboardOverview />}
          
          {currentView === 'upload' && (
            <ScreenUpload onGenerate={handleGenerate} />
          )}

          {currentView === 'simulation' && (
            <ScreenSimulation 
              iteration={iteration} 
              feedback={feedback} 
              onComplete={() => setCurrentView('result')} 
            />
          )}

          {currentView === 'result' && (
            <ScreenDashboard 
              campaignData={campaignData}
              budgetData={getBudgetData(campaignData)}
              chartHistory={chartHistory}
              iteration={iteration}
              onRestart={() => setCurrentView('dashboard')}
              onRemoveActivity={handleRemoveActivity}
              onImproveFeedback={handleImproveFeedback}
            />
          )}
        </main>
      </div>
    </div>
  );
}
