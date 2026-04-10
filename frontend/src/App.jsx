import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import ScreenUpload from './components/ScreenUpload';
import ScreenSimulation from './components/ScreenSimulation';
import ScreenDashboard from './components/ScreenDashboard';
import { Database, Network } from 'lucide-react';

const getBudgetData = (data) => {
  if (!data || !data.math_engine_allocations) return [];
  const palette = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#EF4444', '#14B8A6'];
  return data.math_engine_allocations.map((item, idx) => ({
    name: item["Hạng mục"].length > 15 ? item["Hạng mục"].substring(0, 15) + '...' : item["Hạng mục"],
    value: item["Ngân sách dự kiến (VNĐ)"],
    fill: palette[idx % palette.length]
  }));
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
  const [tenantId, setTenantId] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let tId = localStorage.getItem('brandflow_tenant_id');
    if (!tId) {
        tId = 'tenant_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem('brandflow_tenant_id', tId);
    }
    setTenantId(tId);

    // Init Theme
    const savedTheme = localStorage.getItem('brandflow_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
    } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
        const next = !prev;
        if (next) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('brandflow_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('brandflow_theme', 'light');
        }
        return next;
    });
  };

  const handleFallbackToMock = () => {
    setGenerateError('');
    setIsGenerating(false);
    setCurrentView('result');
  };

  const handleGenerate = async (files, url, name, requestText, budgetNum, compForm) => {
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
        formData.append("tenant_id", tenantId);
        files.forEach(f => formData.append("files", f));
        const upRes = await fetch("http://localhost:8000/api/v1/onboarding/upload", { method: "POST", body: formData });
        if (!upRes.ok) throw new Error(`Upload fail.`);
      }

      const rawText = `Name: ${name || 'N/A'}. Budget: ${budgetNum}. Req: ${requestText || ''}. Industry: ${compForm?.industry || 'General'}`;
      const payload = {
        raw_text: rawText,
        budget: budgetNum,
        comprehensive_form: compForm,
        tenant_id: tenantId
      };

      const res = await fetch("http://localhost:8000/api/v1/planning/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("API call failed.");
      
      const result = await res.json();
      
      if (result.status === "success" && result.plan) {
         setCampaignData(result.plan);
         setAgentLogs(result.agent_logs || []);
      } else {
         throw new Error(result.message || "Lỗi tạo kế hoạch.");
      }
    } catch(err) {
      setGenerateError(err.message || "Lỗi kết nối Backend");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveFeedback = async (userFeedback) => {
    if (!userFeedback) return;
    setChartHistory(prev => [...prev, { v: iteration, data: getBudgetData(campaignData) }]);
    setFeedback(userFeedback);
    setIteration(prev => prev + 1);
    setCurrentView('simulation');
    setIsGenerating(true);
    
    const currentPlan = campaignData;
    setCampaignData(null);
    setAgentLogs(null);
    setGenerateError('');

    try {
      const payload = {
         previous_plan: currentPlan,
         budget: 100000000, 
         feedback: userFeedback,
         tenant_id: tenantId
      };
      const res = await fetch("http://localhost:8000/api/v1/planning/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      
      if (result.status === "success" && result.plan) {
         setCampaignData(result.plan);
         setAgentLogs(result.agent_logs || []);
      } else {
         throw new Error("Lỗi cập nhật kế hoạch.");
      }
    } catch(err) {
      setGenerateError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 ml-64 flex flex-col">
        <Header 
            currentView={currentView} 
            onNewProjectClick={() => setCurrentView('upload')} 
            onNavigate={setCurrentView} 
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
        />
        <main className="flex-1 overflow-y-auto w-full">
          {currentView === 'dashboard' && <DashboardOverview />}
          {currentView === 'upload' && <ScreenUpload onGenerate={handleGenerate} />}
          {currentView === 'simulation' && (
            <ScreenSimulation 
              iteration={iteration} 
              feedback={feedback} 
              isReady={!!campaignData}
              error={generateError}
              agentLogs={agentLogs}
              onComplete={() => setCurrentView('result')}
              onFallback={handleFallbackToMock}
              onRetry={() => setCurrentView('upload')}
            />
          )}

          {currentView === 'result' && campaignData && (
            <ScreenDashboard 
              campaignData={campaignData}
              budgetData={getBudgetData(campaignData)}
              chartHistory={chartHistory}
              iteration={iteration}
              onRestart={() => setCurrentView('dashboard')}
              onImproveFeedback={handleImproveFeedback}
            />
          )}
          
          {currentView === 'agents' && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[20px] p-10 text-center shadow-sm">
                <Network className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 mb-2">Network AI Agents</h2>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
