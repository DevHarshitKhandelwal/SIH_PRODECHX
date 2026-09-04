"use client";

import { Search, Calendar, ShieldCheck, Menu, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";
import { useAuth } from "../auth/AuthContext";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onToggleMobileMenu?: () => void;
}

export default function Header({ 
  title = "Executive Portfolio Overview", 
  subtitle = "Central Sector Infrastructure Monitoring & Risk Analytics",
  onToggleMobileMenu
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-between px-4 sm:px-6 shadow-md shadow-slate-900/5 transition-all duration-300">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 focus:outline-none transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">{title}</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right: Global Controls & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search projects by code, ministry..."
            className="pl-9 pr-4 py-1.5 bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 w-36 lg:w-60 transition-all duration-200 shadow-inner"
          />
        </div>

        {/* Data Freshness Indicator */}
        <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 px-3 py-1.5 rounded-xl border border-blue-200/60 dark:border-blue-800/60 font-semibold text-slate-800 dark:text-slate-200 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 hidden xs:inline" />
          <span><span className="hidden sm:inline text-slate-500 dark:text-slate-400">PAIMANA Report: </span><strong className="text-blue-600 dark:text-blue-400 font-mono">Apr–Jun &apos;26</strong></span>
        </div>

        {/* Smooth Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-amber-500 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-amber-500/10"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 transition-transform duration-500 rotate-0 hover:rotate-90 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-500 rotate-0 hover:-rotate-45 text-slate-700" />
          )}
        </button>

        {/* Auditor Profile & Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-blue-500/20 ring-2 ring-blue-500/30">
            AU
          </div>
          <div className="text-left hidden xl:block">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {user ? user.name : "MoSPI Auditor"}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-500 mr-0.5" />
              Verified User
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

