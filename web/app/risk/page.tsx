"use client";

import Link from "next/link";
import { ShieldAlert, Building2, Layers, MapPin } from "lucide-react";

const HIGH_RISK_INTERVENTION_QUEUE = [
  { code: "612786", name: "Udhampur-Srinagar-Baramulla Rail Link", ministry: "Ministry of Railways", sector: "Railways", state: "Jammu and Kashmir", riskScore: 84, probability: "84.2%", progress: 65.5, topFactor: "High expenditure vs physical gap", action: "Audit Required" },
  { code: "701107", name: "Mumbai-Ahmedabad High Speed Rail Corridor", ministry: "Ministry of Railways", sector: "Railways", state: "Gujarat", riskScore: 78, probability: "78.2%", progress: 42.0, topFactor: "Land acquisition delay & cost expansion", action: "Audit Required" },
  { code: "682941", name: "Bhanupali-Bilaspur-Beri New Line", ministry: "Ministry of Railways", sector: "Railways", state: "Himachal Pradesh", riskScore: 75, probability: "75.1%", progress: 38.5, topFactor: "Severe cost growth (6.4x original)", action: "Audit Required" },
  { code: "541290", name: "NTPC Telangana Super Thermal Power", ministry: "Ministry of Power", sector: "Power", state: "Telangana", riskScore: 71, probability: "71.4%", progress: 89.0, topFactor: "Financial disbursement acceleration", action: "Audit Required" },
  { code: "619044", name: "Delhi-Vadodara Expressway Greenfield Project", ministry: "MoRTH", sector: "Road Transport", state: "Rajasthan", riskScore: 68, probability: "68.0%", progress: 74.2, topFactor: "Scope expansion & structure delay", action: "Audit Required" },
];

export default function RiskIntelligencePage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h1 className="text-base font-bold text-slate-900">Risk Intelligence & Early-Warning Triage</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritization matrix for high-risk central sector infrastructure projects flagged by Random Forest v2.0 (Threshold 0.45).
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 bg-red-50 text-red-700 rounded border border-red-200 font-semibold">
            450 High-Risk Alerts
          </div>
          <div className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-semibold">
            2-Month Horizon
          </div>
        </div>
      </div>

      {/* Grid: Ministry & State Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk by Ministry */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-blue-600 mr-2" />
            High Risk Concentration by Ministry
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Ministry of Railways</span>
              <span className="font-bold text-red-600 font-mono">115 High Risk (27.3%)</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Road Transport & Highways</span>
              <span className="font-bold text-red-600 font-mono">182 High Risk (22.4%)</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Ministry of Power</span>
              <span className="font-bold text-red-600 font-mono">34 High Risk (30.3%)</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Petroleum & Natural Gas</span>
              <span className="font-bold text-red-600 font-mono">28 High Risk (19.3%)</span>
            </div>
          </div>
        </div>

        {/* Risk by Sector */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-blue-600 mr-2" />
            Risk Distribution by Sector
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Railways</span>
              <span className="font-bold text-slate-900 font-mono">420 Total | 115 High Risk</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Road Transport</span>
              <span className="font-bold text-slate-900 font-mono">812 Total | 182 High Risk</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Water Resources</span>
              <span className="font-bold text-slate-900 font-mono">85 Total | 24 High Risk</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Coal</span>
              <span className="font-bold text-slate-900 font-mono">98 Total | 19 High Risk</span>
            </div>
          </div>
        </div>

        {/* Risk by State */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-blue-600 mr-2" />
            Top State Risk Concentrations
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Jammu & Kashmir</span>
              <span className="font-bold text-red-600 font-mono">48.5% High Risk Rate</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Himachal Pradesh</span>
              <span className="font-bold text-red-600 font-mono">42.1% High Risk Rate</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Maharashtra</span>
              <span className="font-bold text-slate-800 font-mono">28.4% High Risk Rate</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-800">Gujarat</span>
              <span className="font-bold text-slate-800 font-mono">24.2% High Risk Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Queue Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Immediate Technical Audit & Intervention Candidates</h3>
            <p className="text-xs text-slate-500">Sorted by statistical early-warning risk score (Random Forest v2.0).</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3">Ministry & Sector</th>
                <th className="px-4 py-3 text-center">Risk Score</th>
                <th className="px-4 py-3 text-center">Probability</th>
                <th className="px-4 py-3">Primary Risk Factor</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {HIGH_RISK_INTERVENTION_QUEUE.map((item) => (
                <tr key={item.code} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{item.code}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{item.ministry}</div>
                    <div className="text-[10px] text-slate-400">{item.sector}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
                      {item.riskScore} / 100
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">{item.probability}</td>
                  <td className="px-4 py-3 text-slate-700">{item.topFactor}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/projects/${item.code}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-xs"
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
