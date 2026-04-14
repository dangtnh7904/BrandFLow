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
    
    if (!isCustom) {
       const predefined = sections.find(s => s.title === question);
       if (predefined) {
           setAiResponse(predefined.explanation);
           return;
       }
    }

    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Bạn là trợ lý Mascot AI vô cùng thông thái và thân thiện, hướng dẫn lập kế hoạch B2B Marketing. Người dùng đang ở biểu mẫu: "${formName}" (Mục đích: ${purpose}). Nhiệm vụ của bạn là giải thích các thuật ngữ chuyên ngành Marketing/Tài chính do người dùng hỏi bằng ngôn ngữ siêu bình dân. Luôn phải cung cấp 1 ví dụ thực tế.`
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
        setAiResponse(`⚠️ **Lỗi API:** ${errorMsg}`);
      }
    } catch (err: any) {
      setAiResponse(`Kho lưu trữ bị ngắt kết nối. Lỗi hệ thống: ${err.message}`);
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
            className="mb-4 bg-background/95 backdrop-blur-xl border border-linear-border rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] w-[360px] overflow-hidden relative flex flex-col max-h-[500px]"
          >
            {/* Mascot Chatbot Header */}
            <div className="bg-gradient-to-r from-background to-linear-surface border-b border-linear-border p-3 text-cyan-400 flex justify-between items-center shrink-0">
              <span className="font-bold text-sm tracking-wide flex items-center">
                 <Bot className="w-4 h-4 mr-1.5" /> AI Kỹ Sư Trưởng
              </span>
              <button onClick={() => setIsOpen(false)} className="text-linear-text-muted hover:text-cyan-400 hover:bg-linear-surface p-1 rounded transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Chat Content */}
            <div className="p-4 bg-transparent flex-1 overflow-y-auto">
               {!activeExplain ? (
                 <>
                   <p className="text-linear-text-muted text-sm leading-relaxed mb-3">
                     Xin chào! Bạn đang ở Form <strong>{formName}</strong>. 
                     <br/><br/>
                     <span className="text-cyan-400 font-medium">{purpose}</span>
                   </p>
                   
                   {sections.length > 0 && (
                     <>
                       <div className="text-xs text-linear-text-muted font-bold uppercase mt-4 mb-2">💡 Khởi chạy phân tích</div>
                       <div className="space-y-1.5 mb-4">
                         {sections.map((sec, idx) => (
                           <button 
                             key={idx}
                             onClick={() => handleAskAI(sec.title, false)}
                             className="w-full text-left bg-linear-surface/30 border border-linear-border hover:border-cyan-500/50 hover:bg-cyan-500/10 text-foreground px-3 py-2 rounded-lg text-sm transition font-medium flex items-center justify-between group"
                           >
                             {sec.title}
                             <MessageCircleQuestion className="w-3.5 h-3.5 text-linear-text-muted group-hover:text-cyan-400" />
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
                     className="text-cyan-400/80 font-semibold text-xs hover:text-cyan-400 mb-3 self-start inline-block"
                   >
                     ← Quay lại Dashboard
                   </button>
                   
                   {/* User Message (Right Side) */}
                   <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-2xl rounded-tr-sm text-cyan-50 mb-2 font-medium self-end max-w-[85%] shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]">
                      {activeExplain}
                   </div>

                   {/* AI Message (Left Side) */}
                   <div className="flex items-start gap-2 mt-4 self-start w-full">
                     <div className="w-8 h-8 rounded-full bg-background border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.5)] flex items-center justify-center shrink-0 text-cyan-400 mt-1">
                        <Bot className="w-4 h-4" />
                     </div>
                     <div className="bg-linear-surface/80 backdrop-blur-md border border-linear-border p-3.5 rounded-2xl rounded-tl-sm text-foreground leading-relaxed shadow-sm flex-1 overflow-hidden [&>p]:mb-2 [&>strong]:text-cyan-300">
                        {isLoadingAI ? (
                           <div className="flex items-center text-cyan-400 py-2 font-medium">
                             <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Retrieving Data...
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
               <form onSubmit={handleCustomSubmit} className="p-3 bg-background/90 border-t border-linear-border shrink-0 flex items-center backdrop-blur-md">
                 <input 
                   type="text" 
                   value={customQuestion}
                   onChange={e => setCustomQuestion(e.target.value)}
                   placeholder="Query terminal..." 
                   className="flex-1 bg-linear-surface border border-linear-border text-foreground placeholder:text-linear-text-muted text-sm px-3 py-2 rounded-l-lg outline-none focus:border-cyan-500 transition"
                 />
                 <button type="submit" disabled={!customQuestion.trim()} className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/50 border-l-0 disabled:opacity-50 px-3 py-2 rounded-r-lg transition">
                    <Send className="w-4 h-4" />
                 </button>
               </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cyber Avatar Bubble */}
      <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         onClick={() => setIsOpen(!isOpen)}
         className="w-16 h-16 rounded-full bg-background shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center text-cyan-400 border-2 border-cyan-500/50 relative overflow-hidden"
      >
        <Bot className="w-8 h-8 relative z-10" />
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ ease: "linear", duration: 8, repeat: Infinity }}
           className="absolute inset-0 border-[2px] border-dashed border-cyan-400/50 rounded-full"
        />
      </motion.button>
    </div>
  );
}
