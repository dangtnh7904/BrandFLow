import React, { useState } from 'react';
import ScreenUpload from './components/ScreenUpload';
import ScreenSimulation from './components/ScreenSimulation';
import ScreenDashboard from './components/ScreenDashboard';

const INITIAL_ACTIVITIES = [
  { id: '1', phase: 'Tháng 4/2026', phaseName: 'Khơi Gợi & Lan Tỏa (Awareness)', name: 'Local Targeted Facebook Ads', cat: 'MUST', cost: 8000000, kpi: 'Tăng 30% Reach & Tương tác', desc: 'Chạy ads hình ảnh tĩnh lặng vàng ấm.' },
  { id: '2', phase: 'Tháng 4/2026', phaseName: 'Khơi Gợi & Lan Tỏa (Awareness)', name: 'Sản xuất hình/Video ngắn', cat: 'SHOULD', cost: 2000000, kpi: '10 ảnh & 3 video', desc: 'Quay chụp góc trà mộc mạc.' },
  { id: '3', phase: 'Tháng 5/2026', phaseName: 'Trải Nghiệm & Gắn Kết', name: 'Workshop tĩnh tại', cat: 'MUST', cost: 7000000, kpi: 'Kín 100% bàn', desc: 'Mời chuyên gia trà đạo.' },
  { id: '4', phase: 'Tháng 5/2026', phaseName: 'Trải Nghiệm & Gắn Kết', name: 'Ưu đãi: Thêm bạn thêm vui', cat: 'COULD', cost: 3000000, kpi: '+15% Khách nhóm', desc: 'Tặng mứt nhóm 3+ giờ vắng.' },
];

export const calculateBudget = (acts) => {
  return [
    { name: 'BẮT BUỘC LÕI', cat: 'MUST', value: acts.filter(a=>a.cat==='MUST').reduce((s,a)=>s+a.cost,0) },
    { name: 'NÊN CÓ', cat: 'SHOULD', value: acts.filter(a=>a.cat==='SHOULD').reduce((s,a)=>s+a.cost,0) },
    { name: 'RỦI RO TÀI CHÍNH', cat: 'COULD', value: acts.filter(a=>a.cat==='COULD').reduce((s,a)=>s+a.cost,0) }
  ].filter(b => b.value > 0);
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [activities, setActivities] = useState([...INITIAL_ACTIVITIES]);
  const [chartHistory, setChartHistory] = useState([]);
  const [iteration, setIteration] = useState(1);
  const [feedback, setFeedback] = useState('');
  
  const budgetData = calculateBudget(activities);

  const handleRestart = () => {
    setActivities([...INITIAL_ACTIVITIES]);
    setChartHistory([]);
    setIteration(1);
    setFeedback('');
    setCurrentScreen(1);
  };

  const handleRemoveActivity = (id) => {
    setChartHistory(prev => [...prev, { v: iteration, data: budgetData }]);
    setIteration(i => i + 1);
    setActivities(acts => acts.filter(a => a.id !== id));
  };

  const handleImproveFeedback = (userFeedback) => {
    if (!userFeedback.trim()) return;
    setFeedback(userFeedback);
    setChartHistory(prev => [...prev, { v: iteration, data: budgetData }]);
    setIteration(i => i + 1);
    setCurrentScreen(2);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 selection:bg-blue-200">
      {currentScreen === 1 && <ScreenUpload onGenerate={() => setCurrentScreen(2)} />}
      
      {currentScreen === 2 && (
        <ScreenSimulation 
          iteration={iteration} 
          feedback={feedback} 
          onComplete={() => setCurrentScreen(3)} 
        />
      )}
      
      {currentScreen === 3 && (
        <ScreenDashboard 
          activities={activities}
          budgetData={budgetData}
          chartHistory={chartHistory}
          iteration={iteration}
          onRestart={handleRestart}
          onRemoveActivity={handleRemoveActivity}
          onImproveFeedback={handleImproveFeedback}
        />
      )}
    </div>
  );
}
