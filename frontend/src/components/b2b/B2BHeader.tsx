"use client";

import React from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';

export default function B2BHeader() {
 return (
 <header className="h-14 bg-linear-surface border-b border-linear-border px-6 flex items-center justify-between shrink-0">
 <div className="flex items-center flex-1">
 <div className="relative w-64">
 <Search className="w-4 h-4 text-linear-text-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
 <input 
 type="text" 
 placeholder="Search forms..." 
 className="w-full pl-9 pr-4 py-1.5 bg-background border border-linear-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
 />
 </div>
 </div>
 
 <div className="flex items-center space-x-4">
 <button className="text-linear-text-muted hover:text-foreground transition-colors relative">
 <Bell className="w-5 h-5" />
 <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
 </button>
 <button className="text-linear-text-muted hover:text-foreground transition-colors">
 <Settings className="w-5 h-5" />
 </button>
 <div className="w-8 h-8 rounded-full bg-slate-200 border border-linear-border flex items-center justify-center cursor-pointer">
 <User className="w-4 h-4 text-linear-text-muted" />
 </div>
 </div>
 </header>
 );
}
