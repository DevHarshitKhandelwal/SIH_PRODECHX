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
  X,
  Sparkles
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
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`w-64 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl text-slate-100 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800/80 z-50 transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center font-black text-white tracking-widest text-xs shadow-lg shadow-blue-500/25 border border-blue-400/30">
              PX
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <h1 className="font-black text-base tracking-tight text-white leading-none">
                  PRODECHX
                </h1>
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase mt-1">
                MoSPI PAIMANA Platform
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Main Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-transparent text-blue-400 border-l-4 border-blue-500 font-bold shadow-md shadow-blue-500/5"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white hover:translate-x-1"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-300"}`} />
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Model & System Status Widget */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">ML Risk Engine</span>
            <span className="inline-flex items-center text-emerald-400 font-mono text-[10px] font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse shadow-sm shadow-emerald-400"></span>
              ONLINE
            </span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/90 shadow-inner">
            <div className="text-white font-bold tracking-tight">prodechx-rf-v2.0</div>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span>Threshold: <strong className="text-blue-400">0.45</strong></span>
              <span>Horizon: <strong className="text-blue-400">2mo</strong></span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

