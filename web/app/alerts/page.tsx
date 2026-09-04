"use client";

import Link from "next/link";
import { Bell, AlertTriangle } from "lucide-react";

const ALERTS_DATA = [
  { code: "612786", name: "Udhampur-Srinagar-Baramulla Rail Link", type: "HIGH_RISK", severity: "HIGH", detected: "April 2026", status: "ACTIVE", description: "Predicted 2-month cost overrun probability 84.2% (Threshold 0.45 exceeded)" },
  { code: "701107", name: "Mumbai-Ahmedabad High Speed Rail Corridor", type: "HIGH_RISK", severity: "HIGH", detected: "April 2026", status: "ACTIVE", description: "Predicted 2-month cost overrun probability 78.2% (Threshold 0.45 exceeded)" },
  { code: "682941", name: "Bhanupali-Bilaspur-Beri New Line Project", type: "COST_WARNING", severity: "HIGH", detected: "April 2026", status: "ACTIVE", description: "Approved revised cost ₹6,753 Cr exceeds original ₹1,047.5 Cr by >600%" },
  { code: "589102", name: "Polavaram Irrigation Project Head Works", type: "PHYSICAL_FINANCIAL_GAP", severity: "MEDIUM", detected: "April 2026", status: "UNDER_REVIEW", description: "Physical progress (78.4%) leads financial disbursement (38.5%) by 39.9%" },
  { code: "541290", name: "NTPC Telangana Super Thermal Power Project", type: "HIGH_RISK", severity: "HIGH", detected: "April 2026", status: "ACTIVE", description: "Predicted 2-month cost overrun probability 71.4%" },
  { code: "619044", name: "Delhi-Vadodara Expressway Greenfield Highway", type: "LOW_PROGRESS", severity: "MEDIUM", detected: "April 2026", status: "ACTIVE", description: "Slow physical progress velocity relative to expenditure disbursement rate" },
];

export default function AlertsPage() {
  return (
    <div className="space-y-6 transition-all duration-300">
      {/* Top Banner */}
      <div className="glass-card p-5 rounded-2xl flex items-center justify-between border-t-4 border-t-rose-500 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/20">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">Early Warning Alerts Center</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Actionable early-warning risk alerts generated from validated Random Forest v2.0 predictions and data quality rules.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="px-3.5 py-1.5 bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-300 dark:border-rose-800 font-mono font-bold shadow-sm">
            6 Critical Alert Types Active
          </span>
        </div>
      </div>

      {/* Alerts Data Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center">
            <AlertTriangle className="w-4 h-4 text-rose-500 mr-2" />
            Active Portfolio Warning Register
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sorted by Severity & Detection Date</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200/80 dark:border-slate-800/80">
              <tr>
                <th className="px-4 py-3.5">Code</th>
                <th className="px-4 py-3.5">Project Name</th>
                <th className="px-4 py-3.5">Alert Type</th>
                <th className="px-4 py-3.5">Severity</th>
                <th className="px-4 py-3.5">Detected</th>
                <th className="px-4 py-3.5">Alert Description</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 font-medium">
              {ALERTS_DATA.map((alert) => (
                <tr key={alert.code} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{alert.code}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">{alert.name}</td>
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">{alert.type}</td>
                  <td className="px-4 py-3.5">
                    {alert.severity === "HIGH" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-gradient-to-r from-rose-500/15 to-red-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10">
                        HIGH
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10">
                        MEDIUM
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{alert.detected}</td>
                  <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 max-w-sm">{alert.description}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/projects/${alert.code}`}
                      className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition border border-blue-200 dark:border-blue-800"
                    >
                      Audit &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

