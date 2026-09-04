import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "PRODECHX — MoSPI PAIMANA Infrastructure Platform",
  description: "Enterprise early-warning risk monitoring system for Indian central sector infrastructure projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <Sidebar />
        <Header />
        <main className="pl-64 pt-16 min-h-screen">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
