"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const isLandingPage = pathname === "/";

 if (isLandingPage) {
 return <main className="w-full h-full min-h-screen">{children}</main>;
 }

 return (
 <div className="flex bg-linear-bg text-white h-screen overflow-hidden w-full">
 <Sidebar />
 <main className="flex-1 overflow-y-auto w-full relative">
 {children}
 </main>
 </div>
 );
}
