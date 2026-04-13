"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
 const { theme, setTheme } = useTheme();
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 setMounted(true);
 }, []);

 if (!mounted) {
 return <div className="w-10 h-10" />; // skeleton
 }

 return (
 <button
 onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
 className="p-2 rounded-full border border-linear-border bg-linear-surface text-linear-text-muted hover:text-foreground transition-colors"
 aria-label="Toggle theme"
 >
 {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
 </button>
 );
}
