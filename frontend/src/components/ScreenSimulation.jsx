import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ShieldAlert, Bot, Users, ArrowRight } from 'lucide-react';

export default function ScreenSimulation({ iteration, feedback, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState([]);
  const [activeAgent, setActiveAgent] = useState('SYSTEM');
  
  const chatSequence = iteration === 1 ? [
    { sender: 'CMO', role: 'MasterPlanner', text: 'Phân tích tệp khách hàng: Người hướng nội, stress sau Tết. Tôi đề xuất đẩy mạnh Workshop và Ads Facebook để kéo Traffic với nội dung chữa lành.', delay: 1000 },
    { sender: 'CFO', role: 'Financial Controller', text: 'Ngân sách chỉ có 20 triệu! Rất eo hẹp. Phải tuân thủ nghiêm ngặt chuẩn MoSCoW. Bắt buộc khóa cứng 15 triệu (75%) cho kênh cốt lõi sinh khách.', delay: 3500 },
    { sender: 'CMO', role: 'MasterPlanner', text: 'Đồng ý. Vậy FB Ads và Workshop Trà đạo là MUST_HAVE. Còn mục ngân sách tặng quà Mứt (3tr)?', delay: 6000 },
    { sender: 'CFO', role: 'Financial Controller', text: 'Quà Mứt nằm ở COULD_HAVE. Chú ý: Nếu rủi ro thâm hụt Ads xảy ra, tôi sẽ cắt bỏ lập tức số tiền mứt này và đổi sang hình thức "mời thêm 1 ly trà mộc" (vốn bằng 0) để bảo toàn dòng tiền.', delay: 8500 },
    { sender: 'SYSTEM', role: 'Workflow Engine', text: 'Lưu phương án bảo vệ dòng tiền. Xuất Kế Hoạch Bản Khởi Tạo...', delay: 11000 }
  ] : [
    { sender: 'SYSTEM', role: 'USER FEEDBACK', text: `Yêu cầu can thiệp từ User: "${feedback}". Đang cấu trúc lại Roadmap...`, delay: 1000 },
    { sender: 'CMO', role: 'MasterPlanner', text: 'Ghi nhận. Đang lập trình lại thông điệp và vị trí thả ngân sách.', delay: 3500 },
    { sender: 'CFO', role: 'Financial Controller', text: 'Đã check hạch toán lại dòng tiền. Biểu đồ rủi ro vẫn trong vùng an toàn.', delay: 6000 },
    { sender: 'SYSTEM', role: 'Workflow Engine', text: 'Tạo tài liệu phiên bản V' + iteration + ' thành công...', delay: 8500 }
  ];

  useEffect(() => {
    let currentProgress = 0;
    const progressTimer = setInterval(() => {
      currentProgress += 1;
      if (currentProgress <= 100) setProgress(currentProgress);
      else clearInterval(progressTimer);
    }, iteration === 1 ? 115 : 90);

    chatSequence.forEach((msg) => {
      setTimeout(() => {
        setMessages(prev => [...prev, msg]);
        setActiveAgent(msg.sender);
      }, msg.delay);
    });

    return () => clearInterval(progressTimer);
  }, [iteration]);

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
          {progress === 100 && (
            <button 
              onClick={onComplete}
              className="mt-8 w-full py-4 bg-[#0075FF] hover:bg-[#0055c4] text-white rounded-xl font-bold text-md shadow-[0_0_20px_rgba(0,117,255,0.3)] flex items-center justify-center transition-colors"
            >
              MỞ BẢN KẾ HOẠCH VER {iteration} <ArrowRight className="ml-2" />
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
