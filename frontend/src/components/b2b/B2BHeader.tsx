"use client";

import React from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';

export default function B2BHeader() {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center flex-1">
        <div className="relative w-64">
           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
           <input 
             type="text" 
             placeholder="Search forms..." 
             className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
           />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-slate-500 hover:text-slate-700 transition-colors relative">
           <Bell className="w-5 h-5" />
           <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="text-slate-500 hover:text-slate-700 transition-colors">
           <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center cursor-pointer">
           <User className="w-4 h-4 text-slate-600" />
        </div>
      </div>
    </header>
  );
}
