import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, MessageCircleQuestion, Send, Loader2 } from 'lucide-react';

interface AISectionExplainer {
  title: string;
  explanation: string;
}

interface MascotChatbotProps {
  formName: string;
  purpose: string;
  sections: AISectionExplainer[];
}

export default function MascotChatbot({ formName, purpose, sections }: MascotChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeExplain, setActiveExplain] = useState<string | null>(null);
  
  // AI Dynamic Chat State
  const [customQuestion, setCustomQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Mascot jumps up automatically after a short delay when entering a new form
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [formName]);

  const handleAskAI = async (question: string, isCustom = false) => {
    setActiveExplain(question);
    setAiResponse(null);
    
    // If it's a predefined section, we show the local explanation immediately, 
    // but the user can still trigger a deeper AI search if they want.
    if (!isCustom) {
       const predefined = sections.find(s => s.title === question);
       if (predefined) {
           setAiResponse(predefined.explanation);
           return;
       }
    }

    // Call Real AI via backend (OpenAI / Groq)
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Bạn là trợ lý Mascot AI vô cùng thông thái và thân thiện, hướng dẫn lập kế hoạch B2B Marketing. Người dùng đang ở biểu mẫu: "${formName}" (Mục đích: ${purpose}). Nhiệm vụ của bạn là giải thích các thuật ngữ chuyên ngành Marketing/Tài chính do người dùng hỏi bằng ngôn ngữ siêu bình dân (như giải thích cho một người không biết gì về kinh tế). Luôn phải cung cấp 1 ví dụ thực tế hoặc so sánh thú vị để họ dễ hiểu.`
            },
            {
              role: "user",
              content: `Hãy giải thích cho tôi: ${question}`
            }
          ]
        })
      });

      const data = await res.json();
      if (res.ok && data.choices && data.choices[0]) {
        setAiResponse(data.choices[0].message.content);
      } else {
        const errorMsg = data.error?.message || data.error || "Không lấy được phản hồi rành mạch từ máy chủ AI.";
        setAiResponse(`⚠️ **Lỗi API:** ${errorMsg}\n\n*Nếu bạn thấy lỗi 401/Invalid Token thì đổi Key mới. Nếu lỗi Quota/429 thì tức là Key đã cạn tiền hoặc hết lượt gọi.*`);
      }
    } catch (err: any) {
      setAiResponse(`Bíp bíp! Kết nối AI đang bị trục trặc. Lỗi hệ thống: ${err.message}`);
    }
    setIsLoadingAI(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    const q = customQuestion;
    setCustomQuestion("");
    handleAskAI(q, true);
  };

  useEffect(() => {
    if (aiResponse && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResponse]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end flex-col">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
            className="mb-4 bg-white border border-emerald-200 rounded-2xl shadow-xl w-[360px] overflow-hidden relative flex flex-col max-h-[500px]"
          >
            {/* Mascot Chatbot Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 text-white flex justify-between items-center shrink-0">
              <span className="font-bold text-sm tracking-wide flex items-center">
                 <Bot className="w-4 h-4 mr-1.5" /> Trợ lý Mascot (AI-Powered)
              </span>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Chat Content */}
            <div className="p-4 bg-slate-50 flex-1 overflow-y-auto">
               {!activeExplain ? (
                 <>
                   <p className="text-slate-700 text-sm leading-relaxed mb-3">
                     Xin chào! Bạn đang ở Form <strong>{formName}</strong>. 
                     <br/><br/>
                     <span className="text-emerald-700 font-medium">{purpose}</span>
                   </p>
                   
                   {sections.length > 0 && (
                     <>
                       <div className="text-xs text-slate-500 font-bold uppercase mt-4 mb-2">💡 Gợi ý giải thích nhanh</div>
                       <div className="space-y-1.5 mb-4">
                         {sections.map((sec, idx) => (
                           <button 
                             key={idx}
                             onClick={() => handleAskAI(sec.title, false)}
                             className="w-full text-left bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-700 px-3 py-2 rounded-lg text-sm transition font-medium flex items-center justify-between group"
                           >
                             {sec.title}
                             <MessageCircleQuestion className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500" />
                           </button>
                         ))}
                       </div>
                     </>
                   )}
                 </>
               ) : (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="text-sm pb-4 flex flex-col"
                 >
                   <button 
                     onClick={() => setActiveExplain(null)}
                     className="text-emerald-600 font-semibold text-xs hover:underline mb-3 self-start inline-block"
                   >
                     ← Quay lại
                   </button>
                   
                   {/* User Message (Right Side) */}
                   <div className="bg-slate-200 p-3 rounded-2xl rounded-tr-sm text-slate-900 mb-2 font-medium self-end max-w-[85%] shadow-sm">
                      {activeExplain}
                   </div>

                   {/* AI Message (Left Side) */}
                   <div className="flex items-start gap-2 mt-4 self-start w-full">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shrink-0 text-white mt-1 shadow-sm">
                        <Bot className="w-4 h-4" />
                     </div>
                     <div className="bg-white border border-emerald-200 p-3.5 rounded-2xl rounded-tl-sm text-slate-800 leading-relaxed shadow-sm flex-1 overflow-hidden [&>p]:mb-2 [&>strong]:text-emerald-700">
                        {isLoadingAI ? (
                           <div className="flex items-center text-emerald-600 py-2 font-medium">
                             <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang suy nghĩ...
                           </div>
                        ) : (
                           <div className="break-words" dangerouslySetInnerHTML={{ __html: aiResponse?.replace(/\n/g, '<br/>') || '' }} />
                        )}
                     </div>
                   </div>
                   <div ref={bottomRef} className="h-4" />
                 </motion.div>
               )}
            </div>

            {/* Custom AI Query Input */}
            {activeExplain && !isLoadingAI && (
               <form onSubmit={handleCustomSubmit} className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center">
                 <input 
                   type="text" 
                   value={customQuestion}
                   onChange={e => setCustomQuestion(e.target.value)}
                   placeholder="Hỏi thuật ngữ khác (VD: COGS)..." 
                   className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm px-3 py-2 rounded-l-lg outline-none focus:border-emerald-400 focus:bg-white transition"
                 />
                 <button type="submit" disabled={!customQuestion.trim()} className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-3 py-2 rounded-r-lg transition">
                    <Send className="w-4 h-4" />
                 </button>
               </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Avatar Bubble */}
      <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         onClick={() => setIsOpen(!isOpen)}
         className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg flex items-center justify-center text-white border-4 border-white relative overflow-hidden"
      >
        <Bot className="w-8 h-8 relative z-10" />
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ ease: "linear", duration: 8, repeat: Infinity }}
           className="absolute inset-0 border-[3px] border-dashed border-white/30 rounded-full"
        />
      </motion.button>
    </div>
  );
}
