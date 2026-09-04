"use client";

import { BarChart3, IndianRupee } from "lucide-react";
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900">Portfolio Financial & Physical Analytics</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical distribution analysis across 2,231 central sector infrastructure projects (MoSPI PAIMANA Master Dataset).
          </p>
        </div>
      </div>

      {/* Grid 1: Sector Budget Allocation vs Expenditure */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <IndianRupee className="w-4 h-4 text-blue-600 mr-2" />
            Sanctioned Budget vs Cumulative Expenditure by Sector (₹ Cr)
          </h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SECTOR_BUDGET_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="sector" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Tooltip formatter={(val: any) => [`₹${formatIndianNumber(Number(val))} Cr`, "Amount"]} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Bar dataKey="costCr" name="Sanctioned Budget (Cr)" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expCr" name="Cumulative Expenditure (Cr)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid 2: Physical Progress vs Financial Disbursement Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Physical Progress % vs Financial Disbursement % Gap Analysis
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="physical" name="Physical Progress %" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="financial" name="Financial Exp %" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Projects" data={PHYSICAL_VS_FINANCIAL_SAMPLE} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Analytics Summary & Data Quality Metrics
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="font-semibold text-slate-800">Portfolio Average Physical Completion</div>
              <div className="text-lg font-bold font-mono text-blue-700 mt-0.5">58.4%</div>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="font-semibold text-slate-800">Average Financial Disbursement Rate</div>
              <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5">47.3%</div>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="font-semibold text-slate-800">Average Physical-Financial Gap</div>
              <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">+11.1%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
