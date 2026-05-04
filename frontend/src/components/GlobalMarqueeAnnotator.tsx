"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, X, Send, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function GlobalMarqueeAnnotator() {
  const [isMarqueeMode, setIsMarqueeMode] = useState(false);
  const [marqueeStart, setMarqueeStart] = useState<{x: number, y: number} | null>(null);
  const [marqueeEnd, setMarqueeEnd] = useState<{x: number, y: number} | null>(null);
  const [selectionBox, setSelectionBox] = useState<{x: number, y: number, w: number, h: number} | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [capturedImageBase64, setCapturedImageBase64] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [revisingMarquee, setRevisingMarquee] = useState(false);
  
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lắng nghe phím ESC để tắt chế độ
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMarqueeMode) {
        cancelMarquee();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMarqueeMode]);

  const cancelMarquee = () => {
    setIsMarqueeMode(false);
    setMarqueeStart(null);
    setMarqueeEnd(null);
    setSelectionBox(null);
    setShowCommentBox(false);
    setCommentInput("");
    setCapturedImageBase64(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMarqueeMode || showCommentBox) return;
    const x = e.clientX;
    const y = e.clientY;
    setMarqueeStart({x, y});
    setMarqueeEnd({x, y});
    setSelectionBox(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMarqueeMode || !marqueeStart || showCommentBox) return;
    const x = e.clientX;
    const y = e.clientY;
    setMarqueeEnd({x, y});
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMarqueeMode || !marqueeStart || showCommentBox) return;
    const x = e.clientX;
    const y = e.clientY;
    
    const minX = Math.min(marqueeStart.x, x);
    const minY = Math.min(marqueeStart.y, y);
    const width = Math.abs(x - marqueeStart.x);
    const height = Math.abs(y - marqueeStart.y);
    
    if (width > 30 && height > 30) {
      setSelectionBox({x: minX, y: minY, w: width, h: height});
      setShowCommentBox(true);
      
      // Chụp màn hình bằng html2canvas
      import('html2canvas').then(html2canvas => {
        // Chụp toàn bộ document.body nhưng crop lại
        html2canvas.default(document.body, {
          x: minX + window.scrollX,
          y: minY + window.scrollY,
          width: width,
          height: height,
          useCORS: true,
          backgroundColor: null,
          ignoreElements: (element) => {
              // Bỏ qua lớp phủ annotator khi chụp ảnh
              return element.id === 'marquee-annotator-overlay';
          }
        }).then(canvas => {
          setCapturedImageBase64(canvas.toDataURL("image/png"));
        }).catch(err => {
            console.error("Lỗi chụp ảnh:", err);
        });
      });
    } else {
      setMarqueeStart(null);
      setMarqueeEnd(null);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!commentInput.trim() || !selectionBox) return;
    try {
      setRevisingMarquee(true);
      // Giả lập gọi API Backend (Multimodal Agent)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Hiển thị thông báo thành công (Có thể thay bằng toast)
      alert("Đã gửi yêu cầu chỉnh sửa cho AI thành công! Hệ thống đã ghi nhận ảnh chụp vùng: " + selectionBox.w + "x" + selectionBox.h);
      
      cancelMarquee();
    } catch (err: any) {
      console.error(err);
    } finally {
      setRevisingMarquee(false);
    }
  };

  return (
    <>
      {/* Nút bật/tắt toàn cục góc dưới trái */}
      <div className="fixed bottom-6 left-6 z-[9999] print-hide">
         <button 
           onClick={() => isMarqueeMode ? cancelMarquee() : setIsMarqueeMode(true)}
           className={`group flex items-center justify-center p-3 rounded-full shadow-2xl transition-all duration-300 border ${
             isMarqueeMode 
              ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
              : 'bg-slate-900/80 hover:bg-slate-900 text-cyan-400 border-cyan-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]'
           }`}
           title="Công cụ Khoanh Vùng Sửa (Marquee Selection)"
         >
            {isMarqueeMode ? <X className="w-5 h-5" /> : <MousePointer2 className="w-5 h-5" />}
            
            {/* Tooltip */}
            <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {isMarqueeMode ? 'Tắt Khoanh Vùng (ESC)' : 'AI Khoanh Vùng Sửa'}
            </span>
         </button>
      </div>

      {/* Lớp Overlay bao phủ toàn màn hình */}
      {isMarqueeMode && (
        <div 
          id="marquee-annotator-overlay"
          ref={overlayRef}
          className="fixed inset-0 z-[9998] cursor-crosshair"
          style={{ background: marqueeStart && marqueeEnd ? 'transparent' : 'rgba(0,0,0,0.15)' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Box Đang Vẽ */}
          {marqueeStart && marqueeEnd && (
             <div 
               className="absolute border-2 border-dashed border-cyan-400 bg-cyan-400/10 pointer-events-none backdrop-blur-[1px]"
               style={{
                  left: Math.min(marqueeStart.x, marqueeEnd.x),
                  top: Math.min(marqueeStart.y, marqueeEnd.y),
                  width: Math.abs(marqueeEnd.x - marqueeStart.x),
                  height: Math.abs(marqueeEnd.y - marqueeStart.y)
               }}
             />
          )}

          {/* Popup Comment Box */}
          <AnimatePresence>
             {showCommentBox && selectionBox && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 10 }}
                 className="absolute z-[9999] bg-slate-900 border border-cyan-500/50 p-3 rounded-xl flex flex-col shadow-2xl w-80 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                 style={{
                   // Cố gắng đặt box ở bên dưới vùng chọn, nếu quá lố thì đẩy lên trên
                   left: Math.min(selectionBox.x, window.innerWidth - 320 - 20),
                   top: selectionBox.y + selectionBox.h + 10 > window.innerHeight - 200 
                        ? selectionBox.y - 150 
                        : selectionBox.y + selectionBox.h + 10
                 }}
                 onMouseDown={e => e.stopPropagation()} // Ngăn việc nhấp vào box bị tính là vẽ box mới
                 onClick={e => e.stopPropagation()}
               >
                 <div className="text-[10px] font-bold text-cyan-400 mb-2 flex items-center justify-between">
                    <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Vùng chọn đã khóa</span>
                    <button onClick={cancelMarquee} className="text-slate-400 hover:text-white"><X className="w-3 h-3"/></button>
                 </div>
                 
                 {capturedImageBase64 ? (
                   <div className="w-full h-24 mb-3 rounded bg-black/50 overflow-hidden border border-slate-700 relative">
                     <img src={capturedImageBase64} className="w-full h-full object-contain" alt="Captured Region" />
                   </div>
                 ) : (
                   <div className="w-full h-24 mb-3 rounded bg-slate-800/50 border border-slate-700 flex items-center justify-center">
                     <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin" />
                   </div>
                 )}

                 <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                   <input 
                     type="text"
                     placeholder="Ví dụ: Đổi màu này, sửa chữ này..."
                     className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none px-2 font-medium placeholder-slate-500"
                     value={commentInput}
                     onChange={e => setCommentInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleSubmitFeedback()}
                     autoFocus
                   />
                   <button 
                     className="w-8 h-8 flex items-center justify-center bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition disabled:opacity-50"
                     onClick={handleSubmitFeedback}
                     disabled={revisingMarquee || !capturedImageBase64}
                   >
                     {revisingMarquee ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                   </button>
                 </div>
               </motion.div>
             )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
