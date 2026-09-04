"use client";

import { Search, Calendar, ShieldCheck } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title = "Executive Portfolio Overview", subtitle = "Central Sector Infrastructure Monitoring & Risk Analytics" }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-6 shadow-sm">
      {/* Page Title & Breadcrumb */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      </div>

      {/* Global Controls & Status */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search projects by code or name..."
            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64 transition"
          />
        </div>

        {/* Data Freshness Indicator */}
        <div className="flex items-center space-x-1.5 text-xs bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 font-medium text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Report Period: <strong className="text-slate-900">April – June 2026</strong></span>
        </div>

        {/* Auditor Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
            AU
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold text-slate-800 leading-tight">MoSPI Auditor</div>
            <div className="text-[10px] text-slate-500 flex items-center font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-600 mr-0.5" />
              Verified User
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
