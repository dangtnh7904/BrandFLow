"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

// Danh sách các trang KHÔNG cần đăng nhập (public routes)
const PUBLIC_ROUTES = ["/", "/login"];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isLandingPage = pathname === "/";
  const isLoginPage = pathname === "/login";

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
    return <main className="w-full h-full min-h-screen">{children}</main>;
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
    <div className="flex bg-linear-bg text-white h-screen overflow-hidden w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full relative">
        {children}
      </main>
    </div>
  );
}
