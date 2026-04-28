"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "./ThemeToggle";
import AmbientParticles from "./AmbientParticles";
import NodeNetworkCanvas from "./landing/NodeNetworkCanvas";
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const { language, toggleLanguage } = useLanguage();
 const isLandingPage = pathname === "/";
 const isLoginPage = pathname === "/login";
 const isPublicRoute = isLandingPage || isLoginPage;

  const CommonBackground = (
    <div className="print-hide">
      <div className="fixed top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-400/20 dark:bg-cyan-500/15 rounded-full blur-[150px] transition-colors duration-500 pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-400/20 dark:bg-blue-600/15 rounded-full blur-[150px] transition-colors duration-500 pointer-events-none z-0" />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80 dark:opacity-100">
        <NodeNetworkCanvas />
      </div>
    </div>
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = đang kiểm tra
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    let token = localStorage.getItem("brandflow_token");
    let userId = localStorage.getItem("brandflow_user_id");

    // Tự động cấp phát tài khoản Khách (Guest) để dùng thử luôn không cần đăng nhập
    if (!token) {
      token = "guest_token_" + Math.random().toString(36).substring(2);
      userId = "guest_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("brandflow_token", token);
      localStorage.setItem("brandflow_user_id", userId);
      localStorage.setItem("brandflow_email", "guest@brandflow.ai");
    }

    setIsAuthenticated(!!token);

    // Đã bỏ qua logic đá về trang login:
    // if (!token && !isPublicRoute) {
    //   window.location.href = "/login";
    // }
  }, [pathname, isPublicRoute]);

  // Đang kiểm tra trạng thái xác thực → hiển thị Loading
  if (isAuthenticated === null && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-bg">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Landing page → full width, không Sidebar
  if (isLandingPage) {
    return (
      <div className="relative min-h-screen w-full overflow-x-hidden text-foreground bg-slate-50 dark:bg-[#0B1120]">
        {CommonBackground}
        <main className="relative z-10 w-full h-full">{children}</main>
      </div>
    );
  }

  // Login page → full width, không Sidebar
  if (isLoginPage) {
    return <main className="w-full h-full min-h-screen">{children}</main>;
  }

  // Nếu chưa xác thực và không phải public route → không render gì (đang redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Đã đăng nhập → Sidebar + nội dung chính
  return (
  <div className="flex flex-col text-foreground h-screen w-full relative overflow-hidden bg-slate-50 dark:bg-[#0B1120]">
    {CommonBackground}

    {/* Global Header with Menu Button */}
    <header className="h-16 bg-white/70 dark:bg-[#0B1120]/40 backdrop-blur-xl border-b border-linear-border/50 z-40 flex items-center px-4 md:px-6 print-hide transition-colors duration-500 shadow-sm shrink-0">
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="p-2 rounded-lg hover:bg-linear-surface transition-colors text-foreground focus:outline-none flex items-center justify-center border border-transparent hover:border-linear-border"
      >
        <Menu className="w-6 h-6" />
      </button>
      <div className="ml-4 font-bold text-xl tracking-tight hidden sm:block">
        Brand<span className="text-cyan-500">F</span>low
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <div className="flex bg-background/50 rounded-lg p-1 border ultra-thin-border h-10 w-[120px]">
          <button 
            onClick={toggleLanguage}
            className={`flex-1 text-xs font-bold rounded-md transition-all flex items-center justify-center ${language === 'en' ? "bg-linear-surface text-cyan-400 shadow-sm border border-cyan-500/20" : "text-linear-text-muted hover:text-foreground"}`}
          >🇺🇸 EN</button>
          <button 
            onClick={toggleLanguage}
            className={`flex-1 text-xs font-bold rounded-md transition-all flex items-center justify-center ${language === 'vi' ? "bg-linear-surface text-cyan-400 shadow-sm border border-cyan-500/20" : "text-linear-text-muted hover:text-foreground"}`}
          >🇻🇳 VI</button>
        </div>
      </div>
    </header>

    {/* LỚP GIAO DIỆN (UI LAYER) */}
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    
    <main className="flex-1 overflow-y-auto overflow-x-hidden w-full relative z-10 flex flex-col">
      {children}
    </main>
  </div>
  );
}
