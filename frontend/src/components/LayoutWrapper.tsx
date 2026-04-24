"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import AmbientParticles from "./AmbientParticles";
import NodeNetworkCanvas from "./landing/NodeNetworkCanvas";
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const isLandingPage = pathname === "/";

  const CommonBackground = (
    <>
      <div className="fixed top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-400/20 dark:bg-cyan-500/15 rounded-full blur-[150px] transition-colors duration-500 pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-400/20 dark:bg-blue-600/15 rounded-full blur-[150px] transition-colors duration-500 pointer-events-none z-0" />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80 dark:opacity-100">
        <NodeNetworkCanvas />
      </div>
    </>
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = đang kiểm tra

  useEffect(() => {
    const token = localStorage.getItem("brandflow_token");
    setIsAuthenticated(!!token);

    // Nếu chưa đăng nhập mà đang cố vào trang nội bộ → đá về login
    if (!token && !isPublicRoute) {
      window.location.href = "/login";
    }
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
  <div className="flex text-foreground h-screen w-full relative overflow-hidden bg-slate-50 dark:bg-[#0B1120]">
    {CommonBackground}

    {/* LỚP GIAO DIỆN (UI LAYER) */}
    <div className="z-20 shrink-0 border-r border-linear-border/50 bg-white/70 dark:bg-[#0B1120]/40 backdrop-blur-xl transition-colors duration-500">
      <Sidebar />
    </div>
    
    <main className="flex-1 overflow-y-auto w-full relative z-10">
      {children}
    </main>
  </div>
  );
}
