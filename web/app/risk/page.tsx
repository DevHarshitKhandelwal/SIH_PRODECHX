"use client";

import Link from "next/link";
import { ShieldAlert, Building2, Layers, MapPin, Zap } from "lucide-react";

const HIGH_RISK_INTERVENTION_QUEUE = [
  { code: "612786", name: "Udhampur-Srinagar-Baramulla Rail Link", ministry: "Ministry of Railways", sector: "Railways", state: "Jammu and Kashmir", riskScore: 84, probability: "84.2%", progress: 65.5, topFactor: "High expenditure vs physical progress gap (+18.4% SHAP)", action: "Audit Required" },
  { code: "701107", name: "Mumbai-Ahmedabad High Speed Rail Corridor", ministry: "Ministry of Railways", sector: "Railways", state: "Gujarat", riskScore: 78, probability: "78.2%", progress: 42.0, topFactor: "Land acquisition delay & cost expansion (+14.2% SHAP)", action: "Audit Required" },
  { code: "682941", name: "Bhanupali-Bilaspur-Beri New Line", ministry: "Ministry of Railways", sector: "Railways", state: "Himachal Pradesh", riskScore: 75, probability: "75.1%", progress: 38.5, topFactor: "Severe cost growth (6.4x original sanctioned cost)", action: "Audit Required" },
  { code: "541290", name: "NTPC Telangana Super Thermal Power", ministry: "Ministry of Power", sector: "Power", state: "Telangana", riskScore: 71, probability: "71.4%", progress: 89.0, topFactor: "Financial disbursement acceleration vs completion gap", action: "Audit Required" },
  { code: "619044", name: "Delhi-Vadodara Expressway Greenfield Project", ministry: "MoRTH", sector: "Road Transport", state: "Rajasthan", riskScore: 68, probability: "68.0%", progress: 74.2, topFactor: "Scope expansion & structure construction delay", action: "Audit Required" },
];

export default function RiskIntelligencePage() {
  return (
    <div className="space-y-6 transition-all duration-300">
      {/* Top Banner */}
      <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-t-4 border-t-rose-500 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/20 flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">Risk Intelligence & Early-Warning Triage</h1>
              <span className="px-2.5 py-0.5 bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 font-mono text-[10px] font-bold rounded-full border border-rose-300 dark:border-rose-800">
                ACTIVE TRIAGE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prioritization matrix for high-risk central sector infrastructure projects flagged by Random Forest v2.0 (Threshold 0.45).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-2 bg-gradient-to-r from-rose-500/15 to-red-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/30 font-mono font-bold shadow-sm flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            450 High-Risk Alerts
          </div>
          <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 font-mono font-bold">
            2-Month Horizon
          </div>
        </div>
      </div>

      {/* Grid: Ministry & State Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk by Ministry */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-200/80 dark:border-slate-800/80 pb-3 tracking-tight">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            High Risk Concentration by Ministry
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Ministry of Railways</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">115 High Risk (27.3%)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Road Transport & Highways</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">182 High Risk (22.4%)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Ministry of Power</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">34 High Risk (30.3%)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Petroleum & Natural Gas</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">28 High Risk (19.3%)</span>
            </div>
          </div>
        </div>

        {/* Risk by Sector */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-200/80 dark:border-slate-800/80 pb-3 tracking-tight">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            Risk Distribution by Sector
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Railways</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">420 Total | <span className="text-rose-600 dark:text-rose-400">115 High Risk</span></span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Road Transport</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">812 Total | <span className="text-rose-600 dark:text-rose-400">182 High Risk</span></span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Water Resources</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">85 Total | <span className="text-rose-600 dark:text-rose-400">24 High Risk</span></span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Coal</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">98 Total | <span className="text-rose-600 dark:text-rose-400">19 High Risk</span></span>
            </div>
          </div>
        </div>

        {/* Risk by State */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-200/80 dark:border-slate-800/80 pb-3 tracking-tight">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            Top State Risk Concentrations
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Jammu & Kashmir</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">48.5% High Risk Rate</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Himachal Pradesh</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">42.1% High Risk Rate</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Maharashtra</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">28.4% High Risk Rate</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Gujarat</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">24.2% High Risk Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Queue Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Immediate Technical Audit & Intervention Candidates</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sorted by statistical early-warning risk score (Random Forest v2.0).</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200/80 dark:border-slate-800/80">
              <tr>
                <th className="px-4 py-3.5">Code</th>
                <th className="px-4 py-3.5">Project Name</th>
                <th className="px-4 py-3.5">Ministry & Sector</th>
                <th className="px-4 py-3.5 text-center">Risk Score</th>
                <th className="px-4 py-3.5 text-center">Probability</th>
                <th className="px-4 py-3.5">Primary SHAP Risk Factor</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 font-medium">
              {HIGH_RISK_INTERVENTION_QUEUE.map((item) => (
                <tr key={item.code} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{item.code}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">{item.name}</td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{item.ministry}</div>
                    <div className="text-[10px] text-slate-400">{item.sector}</div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono bg-gradient-to-r from-rose-500/15 to-red-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10">
                      {item.riskScore} / 100
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-900 dark:text-white text-xs">{item.probability}</td>
                  <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">{item.topFactor}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/projects/${item.code}`}
                      className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition border border-blue-200 dark:border-blue-800"
                    >
                      Audit Details &rarr;
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

