"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  ShieldAlert, 
  BarChart3, 
  Bell, 
  FileText,
  Bot,
  X
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Risk Intelligence", href: "/risk", icon: ShieldAlert },
  { label: "Assistant", href: "/assistant", icon: Bot },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Documents", href: "/documents", icon: FileText },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`w-64 bg-slate-900 text-slate-100 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white tracking-wider text-sm shadow">
              PX
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white leading-none">
                PRODECHX
              </h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-1">
                MoSPI PAIMANA Platform
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-md focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            Main Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Model & System Status Widget */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium">ML Model Engine</span>
            <span className="inline-flex items-center text-emerald-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              ACTIVE
            </span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono bg-slate-900 p-2 rounded border border-slate-800">
            prodechx-randomforest-v2.0
            <div className="text-[10px] text-slate-500 mt-0.5">
              Threshold: 0.45 | Horizon: 2mo
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
