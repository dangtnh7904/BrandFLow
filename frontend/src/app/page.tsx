import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import MetricsBanner from '@/components/landing/MetricsBanner';
import ServicesBento from '@/components/landing/ServicesBento';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
import { Terminal, BrainCircuit, LineChart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent selection:bg-cyan-500/30 selection:text-cyan-50">
      <Navbar />
      
      <main>
        <HeroSection />
        <MetricsBanner />
        <ServicesBento />
        
        {/* Why Us / Approach Section */}
        <section id="about" className="py-24 max-w-7xl mx-auto px-6 relative overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
                Không có khái niệm <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">"nhân sự full-stack".</span>
              </h2>
              <p className="text-linear-text-muted text-lg mb-6 leading-relaxed">
                Tại sao phải phụ thuộc vào một cá nhân xử lý từ Content, SEO đến Ads phân mảnh, trong khi bạn có thể sử dụng sức mạnh tính toán song song của hàng loạt Model ngôn ngữ?
              </p>
              <p className="text-linear-text-muted text-lg leading-relaxed">
                Tính năng độc quyền: Mỗi chiến lược chi tiêu đều bị thẩm định bởi "Math Engine" để chống lại ảo giác AI (Hallucination), đảm bảo ngân sách quảng cáo của bạn được kiểm soát tuyệt đối.
              </p>
            </div>
            
            {/* The Mini Debate UI */}
            <div className="w-full relative perspective-[1000px]">
              <div className="bento-card bg-slate-900/90 dark:bg-[#0B1120]/90 backdrop-blur-xl border border-slate-700/50 dark:border-slate-800 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest">Debate Kernel</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                </div>

                {/* Chat Log */}
                <div className="space-y-4 font-mono text-[11px] sm:text-xs">
                  
                  {/* Message 1 */}
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                      <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-cyan-400 font-bold mb-1">Marketing Agent</div>
                      <div className="text-slate-300 bg-slate-800/50 p-2.5 rounded-lg rounded-tl-none border border-slate-700/50">
                        Đề xuất tăng 20M VNĐ cho chiến dịch Facebook Ads tập trung vào tệp Lookalike (Thu mua khách mới).
                      </div>
                    </div>
                  </div>

                  {/* Message 2 */}
                  <div className="flex gap-3 items-start justify-end mt-4">
                    <div className="text-right">
                      <div className="text-blue-400 font-bold mb-1">Math Engine</div>
                      <div className="text-slate-300 bg-blue-900/20 p-2.5 rounded-lg rounded-tr-none border border-blue-500/30 text-left">
                        <span className="text-red-400 font-bold">X Phủ quyết.</span> Dựa trên lịch sử T-3, tệp LAL đang bị bão hòa (Frequency &gt; 3.5). Lợi nhuận gộp cận biên (Contribution Margin) dự phóng chỉ đạt 12% nếu tiếp tục nạp. Đề nghị luân chuyển sang SEO/AEO.
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                      <LineChart className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                  </div>

                  {/* System Action */}
                  <div className="pt-2 text-center">
                    <span className="inline-block px-3 py-1 bg-slate-800/50 rounded-full text-[10px] text-slate-400 border border-slate-700/50">
                      Ngân sách được điều hướng tự động. Hệ thống an toàn.
                    </span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
