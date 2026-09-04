"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-red-600" />
            <h1 className="text-base font-bold text-slate-900">Early Warning Alerts Center</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Actionable early-warning risk alerts generated from validated Random Forest v2.0 predictions and data quality rules.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded border border-red-200">
            6 Critical Alert Types Active
          </span>
        </div>
      </div>

      {/* Alerts Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Portfolio Warning Register</h3>
          <span className="text-xs text-slate-500">Sorted by Severity & Detection Date</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3">Alert Type</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Detected</th>
                <th className="px-4 py-3">Alert Description</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {ALERTS_DATA.map((alert) => (
                <tr key={alert.code} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{alert.code}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">{alert.name}</td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">{alert.type}</td>
                  <td className="px-4 py-3">
                    {alert.severity === "HIGH" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                        HIGH
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        MEDIUM
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{alert.detected}</td>
                  <td className="px-4 py-3 text-slate-700 max-w-sm">{alert.description}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/projects/${alert.code}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-xs"
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
