"use client";

import { useState } from "react";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import { AuthProvider } from "../components/auth/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-500">
        <ThemeProvider>
          <AuthProvider>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onToggleMobileMenu={() => setSidebarOpen((prev) => !prev)} />
            <main className="pl-0 lg:pl-64 pt-16 min-h-screen transition-all duration-300">
              <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                {children}
              </div>
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
