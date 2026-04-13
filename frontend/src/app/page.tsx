import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import MetricsBanner from '@/components/landing/MetricsBanner';
import ServicesBento from '@/components/landing/ServicesBento';
import PricingSection from '@/components/landing/PricingSection';

export default function LandingPage() {
 return (
 <div className="min-h-screen bg-linear-bg selection:bg-purple-500/30">
 <Navbar />
 
 <main>
 <HeroSection />
 <MetricsBanner />
 <ServicesBento />
 
 {/* Why Us / Approach Section */}
 <section id="about" className="py-24 max-w-7xl mx-auto px-6 border-t ultra-thin-border border-b">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
 <div>
 <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
 Không có "nhân sự<br/> full-stack".
 </h2>
 <p className="text-linear-text-muted text-lg mb-6 leading-relaxed">
 Tại sao phải phụ thuộc vào một cá nhân xử lý từ Content, SEO đến Ads trong khi bạn có thể sử dụng sức mạnh tính toán song song của hàng loạt Model ngôn ngữ?
 </p>
 <p className="text-linear-text-muted text-lg leading-relaxed">
 Mỗi chiến lược đều được thẩm định bởi "Math Engine" chống ảo giác tài chính, đảm bảo ngân sách quảng cáo của bạn luôn được kiểm soát tuyệt đối bằng dữ liệu thực.
 </p>
 </div>
 <div className="bento-card min-h-[300px] flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-transparent">
 <div className="p-8 text-center border ultra-thin-border rounded-2xl bg-linear-surface/80 backdrop-blur-sm">
 <h4 className="text-foreground font-bold mb-2">Đấu tranh Phản biện (Strategic Debate)</h4>
 <p className="text-sm text-linear-text-muted">Các AI Agents bắt buộc phải tranh luận chéo về tính khả thi của ngân sách trước khi giải ngân.</p>
 </div>
 </div>
 </div>
 </section>

 <PricingSection />
 </main>

 <footer className="py-12 border-t ultra-thin-border bg-linear-surface/20 text-center">
 <p className="text-linear-text-muted text-sm">&copy; 2026 BrandFlow AI Platform. All rights reserved.</p>
 </footer>
 </div>
 );
}
