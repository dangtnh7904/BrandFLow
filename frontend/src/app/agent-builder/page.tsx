"use client";

import React, { useState } from 'react';
import { Bot, Save, Search, Code, BrainCircuit, Play, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AgentBuilderPage() {
  const [name, setName] = useState('Data Analyst PRO');
  const [role, setRole] = useState('Chuyên gia Phân tích Dữ liệu Khách hàng');
  const [prompt, setPrompt] = useState('Phân tích tệp dữ liệu khách hàng. LUÔN LUÔN viết code Python chạy thống kê chứ không được tự nhẩm tính. Khách hàng là các CMO rất khó tính.');
  const [tools, setTools] = useState({
    web_search: false,
    data_analysis: true,
    niche_knowledge: false
  });

  const [testMessage, setTestMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ role: string, content: string }[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleTool = (tool: keyof typeof tools) => {
    setTools(prev => ({ ...prev, [tool]: !prev[tool] }));
  };

  const handleTestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessage) return;

    setChatLog(prev => [...prev, { role: 'user', content: testMessage }]);
    setTestMessage('');
    setIsTesting(true);

    // Mock response waiting for real API connection
    setTimeout(() => {
      let responseText = "Đã tiếp nhận yêu cầu. ";
      if (tools.data_analysis) {
        responseText += "\n> [System] Đang khởi chạy môi trường Python (Pandas)...\n> [Observation] Đã xử lý 10,000 dòng dữ liệu thành công.\nKết quả phân tích cho thấy tỷ lệ chuyển đổi tăng 12%.";
      } else if (tools.web_search) {
        responseText += "\n> [System] Đang truy cập DuckDuckGo Search...\n> [Observation] Tìm thấy báo cáo từ McKinsey.\n[1] Thị trường đang tăng trưởng 5% (Nguồn: McKinsey 2026).";
      } else {
        responseText += "Tôi không có đủ công cụ (Tools) để thực hiện tác vụ này một cách chính xác nhất.";
      }

      setChatLog(prev => [...prev, { role: 'agent', content: responseText }]);
      setIsTesting(false);
    }, 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      alert("Đã lưu Custom Agent thành công vào hệ thống!");
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Agent Studio</h1>
              <p className="text-slate-500">Thiết kế AI Agent chuyên biệt (Custom Tools) cho C-Level</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Đang lưu..." : "Lưu Agent"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Configuration */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-2">
              <BrainCircuit className="w-5 h-5 text-indigo-500" />
              Cấu hình Đặc vụ (Config)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên Agent</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Vai trò (Role)</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">System Prompt (Quy tắc thép)</label>
                <textarea 
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Nhập các quy tắc khắt khe..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Capabilities (Gắn công cụ cho AI)</label>
                <div className="space-y-3">
                  
                  {/* Tool 1 */}
                  <div 
                    onClick={() => toggleTool('data_analysis')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${tools.data_analysis ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    <div className={`mt-0.5 ${tools.data_analysis ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {tools.data_analysis ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300" />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <Code className="w-4 h-4 text-indigo-500" />
                        Python Data Analyst (Zero Hallucination)
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Ép AI tự viết và chạy code Python (Pandas) ngầm để tính toán chính xác 100% thay vì tự nhẩm tính sai lệch.</p>
                    </div>
                  </div>

                  {/* Tool 2 */}
                  <div 
                    onClick={() => toggleTool('web_search')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${tools.web_search ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    <div className={`mt-0.5 ${tools.web_search ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {tools.web_search ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300" />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <Search className="w-4 h-4 text-emerald-500" />
                        Live Web Search (Fact-checker)
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Cấp quyền cho AI tìm kiếm Internet để lấy số liệu thực tế. Bắt buộc kèm URL trích dẫn.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Right: Test Drive */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-[700px]">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-white text-lg flex items-center gap-2">
                <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
                Test Drive (Chạy Thử)
              </h2>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
              {chatLog.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm">Hãy thử giao việc cho Agent mới của bạn</p>
                </div>
              ) : (
                chatLog.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isTesting && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    Agent đang suy nghĩ (Dùng tools)...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleTestChat} className="relative">
                <input 
                  type="text" 
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Ví dụ: Tính tổng doanh thu theo file Excel..." 
                  className="w-full bg-slate-100 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button 
                  type="submit"
                  disabled={isTesting || !testMessage}
                  className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white rounded-lg px-3 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center transition-colors"
                >
                  <Play className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
