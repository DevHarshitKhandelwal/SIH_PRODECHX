"use client";

import { useState } from "react";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Header onToggleMobileMenu={() => setSidebarOpen((prev) => !prev)} />
        <main className="pl-0 lg:pl-64 pt-16 min-h-screen">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
