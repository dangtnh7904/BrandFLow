import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import ScreenUpload from './components/ScreenUpload';
import ScreenSimulation from './components/ScreenSimulation';
import ScreenDashboard from './components/ScreenDashboard';
import { Database, Network } from 'lucide-react';

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

const DEFAULT_REQUEST_TIMEOUT_MS = 30000;
const AI_REQUEST_TIMEOUT_MS = 90000;
const UPLOAD_REQUEST_TIMEOUT_MS = 60000;

const buildTimeoutError = (url, timeoutMs) => {
  let endpoint = url;
  try {
    endpoint = new URL(url).pathname;
  } catch (_) {
  }
  return new Error(`Yeu cau ${endpoint} da qua ${Math.round(timeoutMs / 1000)} giay. Vui long thu lai.`);
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error && error.name === 'AbortError') {
      throw buildTimeoutError(url, timeoutMs);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const parseJsonOrThrow = async (response, fallbackMessage) => {
  let payload = null;

  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }

  if (!response.ok) {
    const detail = payload && payload.detail;
    const detailMessage = typeof detail === 'string'
      ? detail
      : (detail && detail.message) || (payload && payload.message);
    throw new Error(detailMessage || fallbackMessage || `HTTP ${response.status}`);
  }

  return payload || {};
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
        const uploadResponse = await fetchWithTimeout(
          "http://localhost:8000/api/v1/onboarding/upload",
          { method: "POST", body: formData },
          UPLOAD_REQUEST_TIMEOUT_MS
        );
        await parseJsonOrThrow(uploadResponse, "Upload file that bai.");
      }

      if (url) {
        const uploadUrlResponse = await fetchWithTimeout(
          "http://localhost:8000/api/v1/onboarding/upload-url",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls: [url] })
          },
          UPLOAD_REQUEST_TIMEOUT_MS
        );
        await parseJsonOrThrow(uploadUrlResponse, "Upload URL that bai.");
      }

      const rawText = `Tên chiến dịch: ${name || 'N/A'}. Ngân sách: ${budgetNum} VND. Yêu cầu: ${requestText || 'Không mô tả'}`;
      const res = await fetchWithTimeout(
        "http://localhost:8000/api/v1/planning/intake",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ raw_text: rawText, budget: budgetNum })
        },
        AI_REQUEST_TIMEOUT_MS
      );
      const result = await parseJsonOrThrow(res, "Loi tao ke hoach tu Agent.");
      
      if (result.status === "success" && result.plan) {
         setCampaignData(result.plan);
         setAgentLogs(result.agent_logs || []);
      } else {
         throw new Error(result.message || "Lỗi tạo kế hoạch.");
      }
    } catch(err) {
      setGenerateError(err instanceof Error ? err.message : "Da xay ra loi ket noi Backend");
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
      const res = await fetchWithTimeout(
        "http://localhost:8000/api/v1/planning/refine",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        },
        AI_REQUEST_TIMEOUT_MS
      );
      const result = await parseJsonOrThrow(res, "Loi cap nhat ke hoach tu Agent.");
      
      if (result.status === "success" && result.plan) {
         setCampaignData(result.plan);
         setAgentLogs(result.agent_logs || []);
      } else {
         throw new Error("Lỗi cập nhật kế hoạch.");
      }
    } catch(err) {
      setGenerateError(err instanceof Error ? err.message : "Da xay ra loi ket noi Backend khi thuc hien Refine");
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
              onComplete={() => setCurrentView(generateError ? 'upload' : 'result')} 
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
