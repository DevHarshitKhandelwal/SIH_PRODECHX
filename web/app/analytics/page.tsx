"use client";

import { BarChart3, IndianRupee, PieChart as PieIcon, Activity } from "lucide-react";
import { formatIndianNumber } from "../../lib/formatters";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter
} from "recharts";

const SECTOR_BUDGET_DATA = [
  { sector: "Road Transport", costCr: 1250000, expCr: 580000, count: 812 },
  { sector: "Railways", costCr: 980000, expCr: 490000, count: 420 },
  { sector: "Petroleum", costCr: 320000, expCr: 180000, count: 145 },
  { sector: "Power", costCr: 280000, expCr: 145000, count: 112 },
  { sector: "Coal", costCr: 95000, expCr: 42000, count: 98 },
  { sector: "Water Resources", costCr: 62000, expCr: 24000, count: 85 },
];

const PHYSICAL_VS_FINANCIAL_SAMPLE = [
  { name: "USBRL Project", physical: 65.5, financial: 88.4, cost: 37012 },
  { name: "Bullet Train", physical: 42.0, financial: 54.2, cost: 160000 },
  { name: "Delhi Expressway", physical: 74.2, financial: 78.9, cost: 38500 },
  { name: "Barmer Refinery", physical: 70.1, financial: 70.2, cost: 72937 },
  { name: "Polavaram Irrigation", physical: 78.4, financial: 38.5, cost: 55548 },
  { name: "NTPC Telangana", physical: 89.0, financial: 92.4, cost: 11843 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 transition-all duration-300">
      {/* Top Banner */}
      <div className="glass-card p-5 rounded-2xl flex items-center justify-between border-t-4 border-t-blue-500 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">Portfolio Financial & Physical Analytics</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Empirical distribution analysis across 2,231 central sector infrastructure projects (MoSPI PAIMANA Master Dataset).
            </p>
          </div>
        </div>
      </div>

      {/* Grid 1: Sector Budget Allocation vs Expenditure */}
      <div className="glass-card p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center tracking-tight">
            <IndianRupee className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            Sanctioned Budget vs Cumulative Expenditure by Sector (₹ Cr)
          </h3>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SECTOR_BUDGET_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
              <XAxis dataKey="sector" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any) => [`₹${formatIndianNumber(Number(val || 0))} Cr`, "Amount"]}
                contentStyle={{ 
                  backgroundColor: "rgba(15, 23, 42, 0.9)", 
                  borderColor: "rgba(51, 65, 85, 0.8)",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px"
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Bar dataKey="costCr" name="Sanctioned Budget (Cr)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expCr" name="Cumulative Expenditure (Cr)" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid 2: Physical Progress vs Financial Disbursement Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800/80 pb-3 flex items-center tracking-tight">
            <Activity className="w-4 h-4 text-blue-500 mr-2" />
            Physical Progress % vs Financial Disbursement % Gap Analysis
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis type="number" dataKey="physical" name="Physical Progress %" unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis type="number" dataKey="financial" name="Financial Exp %" unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip 
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{ 
                    backgroundColor: "rgba(15, 23, 42, 0.9)", 
                    borderColor: "rgba(51, 65, 85, 0.8)",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontSize: "12px"
                  }}
                />
                <Scatter name="Projects" data={PHYSICAL_VS_FINANCIAL_SAMPLE} fill="#6366f1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800/80 pb-3 flex items-center tracking-tight">
            <PieIcon className="w-4 h-4 text-blue-500 mr-2" />
            Analytics Summary & Data Quality Metrics
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Portfolio Average Physical Completion</div>
              <div className="text-xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">58.4%</div>
            </div>
            <div className="p-3.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Average Financial Disbursement Rate</div>
              <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">47.3%</div>
            </div>
            <div className="p-3.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Average Physical-Financial Gap</div>
              <div className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">+11.1%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

