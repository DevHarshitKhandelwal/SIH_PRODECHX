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
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm transition-colors duration-500">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight line-clamp-1">{title}</h2>
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
            placeholder="Search projects..."
            className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 lg:w-56 transition"
          />
        </div>

        {/* Data Freshness Indicator */}
        <div className="flex items-center space-x-1 text-[11px] sm:text-xs bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 hidden xs:inline" />
          <span><span className="hidden sm:inline">Report: </span><strong className="text-slate-900 dark:text-white">Apr–Jun &apos;26</strong></span>
        </div>

        {/* Smooth Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-500 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 transition-transform duration-500 rotate-0 hover:rotate-90 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-500 rotate-0 hover:-rotate-45 text-slate-700" />
          )}
        </button>

        {/* Auditor Profile & Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 rounded-full bg-slate-800 dark:bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
            AU
          </div>
          <div className="text-left hidden xl:block">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              {user ? user.name : "MoSPI Auditor"}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mr-0.5" />
              Verified User
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
