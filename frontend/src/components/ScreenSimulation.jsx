import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ShieldAlert, Bot, Users, ArrowRight } from 'lucide-react';

export default function ScreenSimulation({ iteration, feedback, isReady, error, onComplete, agentLogs }) {
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState([]);
  const [activeAgent, setActiveAgent] = useState('SYSTEM');
  const [showDoneBtn, setShowDoneBtn] = useState(false);

  // 1. Quản lý Progress Bar (Cố tình kẹt ở 85% nếu chưa load xong API)
  useEffect(() => {
    if (progress >= 100) return;
    
    const timer = setInterval(() => {
      setProgress(p => {
        if (!isReady && p >= 85) return 85; 
        if (isReady && p >= 100) return 100;
        return p + (isReady ? 5 : 1);
      });
    }, 150);
    return () => clearInterval(timer);
  }, [isReady, progress]);

  // 2. Chat Sequence khi đợi API (isReady = false)
  useEffect(() => {
    if (isReady) return; // Nếu API xong thì nhường chỗ cho effect bên dưới
    
    // Xóa state cũ nếu chạy lại
    setMessages([]);
    setProgress(0);
    setShowDoneBtn(false);

    const loadingMsgs = iteration === 1 ? [
      { sender: 'SYSTEM', role: 'Hệ thống', text: 'Đang thiết lập không gian Neural Synergy Chamber...', delay: 500 },
      { sender: 'SYSTEM', role: 'Hệ thống', text: 'Đang trích xuất Brand DNA & Đối chiếu dữ liệu tệp khách hàng từ ChromaDB...', delay: 2000 },
      { sender: 'CMO', role: 'Giám đốc Marketing', text: 'Đang gọi các mô hình AI rà soát nền tảng và thiết kế ý tưởng chủ đạo. Chờ tôi khoảng 5-10 giây...', delay: 4000 },
    ] : [
      { sender: 'SYSTEM', role: 'Hệ thống', text: `Nhận được yêu cầu điều chỉnh từ người dùng: "${feedback}". Đang chạy qua hệ thống kiểm toán...`, delay: 500 },
    ];

    let timers = loadingMsgs.map(msg => 
      setTimeout(() => {
        setMessages(prev => [...prev, msg]);
        setActiveAgent(msg.sender);
      }, msg.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [isReady, iteration, feedback]);

  // 3. Chat Sequence thật sau khi API trả về (agentLogs)
  useEffect(() => {
    if (!isReady) return;
    if (error) {
       setShowDoneBtn(true);
       return;
    }

    let timers = [];
    let delayOffset = 1000;

    if (agentLogs && agentLogs.length > 0) {
        agentLogs.forEach((log) => {
            // Từng log của AI nói sẽ xuất hiện cách nhau một khoảng thời gian
            const msg = {
                sender: log.agent === 'PERSONA' ? 'SYSTEM' : log.agent,
                role: log.role || 'Chuyên gia',
                text: log.message,
            };
            const t = setTimeout(() => {
                setMessages(prev => [...prev, msg]);
                setActiveAgent(msg.sender);
            }, delayOffset);
            timers.push(t);
            delayOffset += 2500;
        });
    }

    // Nút "MỞ BẢN KẾ HOẠCH" sẽ hiện sau khi thảo luận xong
    const finishT = setTimeout(() => {
        setProgress(100);
        setActiveAgent('SYSTEM');
        setMessages(prev => [...prev, { sender: 'SYSTEM', role: 'Hệ thống', text: 'Tất cả lõi đã đồng thuận và kiểm duyệt thành công. Bản kế hoạch đã sẵn sàng phát hành.' }]);
        setShowDoneBtn(true);
    }, delayOffset + 1000);
    timers.push(finishT);

    return () => timers.forEach(clearTimeout);
  }, [isReady, agentLogs, error]);

  const endOfMessagesRef = useRef(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full bg-transparent flex flex-col md:flex-row items-center justify-center p-6 gap-6 font-sans">
      
      {/* Left: Animation Triangle */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h3 className="text-white font-bold text-xl mb-2">Neural Synergy Chamber</h3>
          <p className="text-[#A0AEC0] text-sm">Các lõi đa luồng đang thương thuyết</p>
        </div>
        
        <div className="relative w-64 h-64 mx-auto mb-10">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <polygon points="50,15 15,85 85,85" fill="none" stroke="#1B254B" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
            {activeAgent === 'CMO' && <line x1="15" y1="85" x2="85" y2="85" stroke="#10b981" strokeWidth="3" className="animate-pulse" />}
            {activeAgent === 'CFO' && <line x1="85" y1="85" x2="50" y2="15" stroke="#f59e0b" strokeWidth="3" className="animate-pulse" />}
            {activeAgent === 'SYSTEM' && <line x1="50" y1="15" x2="15" y2="85" stroke="#0075FF" strokeWidth="3" className="animate-pulse" />}
          </svg>
          
          {/* System Node */}
          <div className={`absolute top-0 left-1/2 -ml-8 w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-[#1B254B] shadow-lg transition-all duration-300 ${activeAgent === 'SYSTEM' ? 'bg-[#0075FF] ring-8 ring-[#0075FF]/30 scale-110' : 'bg-[#111C44]'}`}>
            <Bot className="text-white mb-1" size={18}/>
            <span className="text-[10px] font-bold text-white uppercase">SYS</span>
          </div>

          {/* CMO Node */}
          <div className={`absolute bottom-0 left-[-16px] w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-[#1B254B] shadow-lg transition-all duration-300 ${activeAgent === 'CMO' ? 'bg-emerald-500 ring-8 ring-emerald-500/30 scale-110' : 'bg-[#111C44]'}`}>
            <Users className="text-white mb-1" size={18}/>
            <span className="text-[10px] font-bold text-white uppercase">CMO</span>
          </div>

          {/* CFO Node */}
          <div className={`absolute bottom-0 right-[-16px] w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-[#1B254B] shadow-lg transition-all duration-300 ${activeAgent === 'CFO' ? 'bg-amber-500 ring-8 ring-amber-500/30 scale-110' : 'bg-[#111C44]'}`}>
            <ShieldAlert className="text-white mb-1" size={18}/>
            <span className="text-[10px] font-bold text-white uppercase">CFO</span>
          </div>
        </div>

        <div className="w-full max-w-sm px-4">
          <div className="flex justify-between text-xs text-[#A0AEC0] font-mono mb-2 border-b border-[#1B254B] pb-2">
            <span>Synaptic Progress</span>
            <span className="text-[#0075FF]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#111C44] rounded-full overflow-hidden">
             <div className="h-full bg-[#0075FF] transition-all duration-300" style={{width: `${progress}%`}}></div>
          </div>
          {showDoneBtn && (
            <button 
              onClick={onComplete}
              disabled={!isReady && !error}
              className={`mt-8 w-full py-4 text-white rounded-xl font-bold text-md shadow-[0_0_20px_rgba(0,117,255,0.3)] flex items-center justify-center transition-colors ${(!isReady && !error) ? 'bg-gray-600 opacity-50 cursor-not-allowed' : error ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#0075FF] hover:bg-[#0055c4]'}`}
            >
              {error ? `XUẤT HIỆN LỖI: ${error}` : (!isReady ? 'ĐANG CHỜ AI HOÀN TẤT...' : `MỞ BẢN KẾ HOẠCH VER ${iteration} `)} 
              {isReady && !error && <ArrowRight className="ml-2" />}
            </button>
          )}
        </div>
      </div>

      {/* Right: Chat Window */}
      <div className="w-full md:w-2/3 h-[600px] bg-[#111C44] rounded-3xl flex flex-col overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)] relative">
        <div className="bg-[#0B1437] p-5 border-b border-[#1B254B] flex items-center justify-between z-10">
          <h2 className="text-white font-bold flex items-center"><MessageSquare className="mr-3 text-[#0075FF]" size={18}/> Live AI Board</h2>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
            <span className="text-xs text-emerald-400 font-mono uppercase tracking-wider">Online</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex w-full ${msg.sender === 'CMO' ? 'justify-start' : msg.sender === 'CFO' ? 'justify-end' : 'justify-center'}`}>
              <div className={`max-w-[80%] flex ${msg.sender === 'CFO' ? 'flex-row-reverse' : ''}`}>
                {msg.sender !== 'SYSTEM' && (
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg ${msg.sender==='CFO'?'ml-3 bg-amber-500 text-white':'mr-3 bg-emerald-500 text-white'}`}>
                    {msg.sender}
                  </div>
                )}
                <div className={`flex flex-col ${msg.sender === 'CFO'?'items-end': msg.sender==='SYSTEM'?'items-center text-center':''}`}>
                  {msg.sender !== 'SYSTEM' && <span className="text-[10px] text-[#A0AEC0] mb-1 tracking-wide uppercase">{msg.role}</span>}
                  <div className={`p-4 text-sm leading-relaxed rounded-2xl ${
                    msg.sender === 'CMO' ? 'bg-[#1B254B] text-white rounded-tl-sm' : 
                    msg.sender === 'CFO' ? 'bg-[#0B1437] text-white border border-amber-500/20 rounded-tr-sm' : 
                    'bg-[#0B1437] text-[#A0AEC0] italic rounded-full px-6'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} className="h-4" />
        </div>
      </div>
    </div>
  );
}
