"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatIndianNumber } from "../../lib/formatters";
import { Search, Download, FolderKanban, Filter } from "lucide-react";


const MASTER_PROJECTS_SAMPLE = [
  { id: "p1", code: "612786", name: "Udhampur-Srinagar-Baramulla Rail Link Project", ministry: "Ministry of Railways", sector: "Railways", state: "Jammu and Kashmir", agency: "Northern Railway", originalCost: 861.06, revisedCost: 37012.00, expenditure: 32700.00, progress: 65.5, risk: "HIGH", month: "April 2026" },
  { id: "p2", code: "701107", name: "Mumbai-Ahmedabad High Speed Rail Corridor", ministry: "Ministry of Railways", sector: "Railways", state: "Gujarat / Maharashtra", agency: "NHSRCL", originalCost: 108000.00, revisedCost: 160000.00, expenditure: 86700.00, progress: 42.0, risk: "HIGH", month: "April 2026" },
  { id: "p3", code: "682941", name: "Bhanupali-Bilaspur-Beri New Line Project", ministry: "Ministry of Railways", sector: "Railways", state: "Himachal Pradesh", agency: "RVNL", originalCost: 1047.50, revisedCost: 6753.00, expenditure: 4193.00, progress: 38.5, risk: "HIGH", month: "April 2026" },
  { id: "p4", code: "541290", name: "NTPC Telangana Super Thermal Power Project Phase-I", ministry: "Ministry of Power", sector: "Power", state: "Telangana", agency: "NTPC", originalCost: 10997.79, revisedCost: 11843.00, expenditure: 10940.00, progress: 89.0, risk: "HIGH", month: "April 2026" },
  { id: "p5", code: "619044", name: "Delhi-Vadodara Expressway Greenfield Highway", ministry: "MoRTH", sector: "Road Transport & Highways", state: "Rajasthan / Gujarat", agency: "NHAI", originalCost: 32839.00, revisedCost: 38500.00, expenditure: 30376.00, progress: 74.2, risk: "HIGH", month: "April 2026" },
  { id: "p6", code: "491204", name: "Barmer Refinery and Petrochemical Complex", ministry: "Petroleum & Natural Gas", sector: "Petroleum", state: "Rajasthan", agency: "HPCL", originalCost: 43129.00, revisedCost: 72937.00, expenditure: 51200.00, progress: 70.1, risk: "LOW", month: "April 2026" },
  { id: "p7", code: "589102", name: "Polavaram Irrigation Project Head Works", ministry: "Jal Shakti", sector: "Water Resources", state: "Andhra Pradesh", agency: "Polavaram Auth", originalCost: 16010.50, revisedCost: 55548.87, expenditure: 21400.00, progress: 78.4, risk: "LOW", month: "April 2026" },
  { id: "p8", code: "602319", name: "Bangalore Metro Rail Project Phase-2 Expansion", ministry: "Housing & Urban Affairs", sector: "Urban Dev", state: "Karnataka", agency: "BMRCL", originalCost: 26405.14, revisedCost: 30695.00, expenditure: 19800.00, progress: 64.5, risk: "LOW", month: "April 2026" },
  { id: "p9", code: "712903", name: "Dedicated Freight Corridor (Western DFC)", ministry: "Ministry of Railways", sector: "Railways", state: "Multi-State", agency: "DFCCIL", originalCost: 51122.00, revisedCost: 81459.00, expenditure: 74200.00, progress: 91.2, risk: "LOW", month: "April 2026" },
  { id: "p10", code: "641092", name: "Chenab Bridge Arch Structure Railway Project", ministry: "Ministry of Railways", sector: "Railways", state: "Jammu and Kashmir", agency: "Konkan Railway", originalCost: 512.00, revisedCost: 1486.00, expenditure: 1420.00, progress: 98.0, risk: "LOW", month: "April 2026" },
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const filteredProjects = useMemo(() => {
    return MASTER_PROJECTS_SAMPLE.filter((p) => {
      const matchesSearch =
        p.code.includes(searchTerm) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ministry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = sectorFilter === "ALL" || p.sector === sectorFilter;
      const matchesRisk = riskFilter === "ALL" || p.risk === riskFilter;
      return matchesSearch && matchesSector && matchesRisk;
    });
  }, [searchTerm, sectorFilter, riskFilter]);

  const handleExportCSV = () => {
    const headers = "Code,Name,Ministry,Sector,State,OriginalCost,RevisedCost,Expenditure,Progress,Risk\n";
    const rows = filteredProjects
      .map(p => `"${p.code}","${p.name}","${p.ministry}","${p.sector}","${p.state}",${p.originalCost},${p.revisedCost},${p.expenditure},${p.progress},"${p.risk}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PRODECHX_Projects_Master_Export.csv`;
    a.click();
  };

  return (
    <div className="space-y-5 transition-all duration-300">
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-5 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">Projects Master Register</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing <strong className="text-blue-600 dark:text-blue-400 font-mono">{formatIndianNumber(filteredProjects.length)}</strong> of <strong className="font-mono text-slate-800 dark:text-slate-200">2,231</strong> central sector infrastructure projects.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-95"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV Dataset
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by 6-digit code, project name, or ministry..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
          />
        </div>

        <div className="flex items-center space-x-3">
          {/* Sector Filter */}
          <div className="flex items-center space-x-2 bg-slate-100/70 dark:bg-slate-950/70 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
            <Filter className="w-3.5 h-3.5 text-blue-500 ml-1" />
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Sector:</span>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer pr-2"
            >
              <option value="ALL">All Sectors</option>
              <option value="Railways">Railways</option>
              <option value="Road Transport & Highways">Road Transport</option>
              <option value="Power">Power</option>
              <option value="Petroleum">Petroleum</option>
              <option value="Water Resources">Water Resources</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center space-x-2 bg-slate-100/70 dark:bg-slate-950/70 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px] ml-1">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer pr-2"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">HIGH RISK ONLY</option>
              <option value="LOW">LOW RISK ONLY</option>
            </select>
          </div>
        </div>
      </div>

      {/* High Density Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200/80 dark:border-slate-800/80">
              <tr>
                <th className="px-4 py-3.5">Code</th>
                <th className="px-4 py-3.5">Project Name</th>
                <th className="px-4 py-3.5">Ministry & Sector</th>
                <th className="px-4 py-3.5 text-right">Orig. Cost (Cr)</th>
                <th className="px-4 py-3.5 text-right">Rev. Cost (Cr)</th>
                <th className="px-4 py-3.5 text-right">Progress %</th>
                <th className="px-4 py-3.5 text-center">Risk Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 font-medium">
              {filteredProjects.map((p) => (
                <tr key={p.code} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{p.code}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">{p.name}</td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{p.ministry}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 dark:text-slate-300">₹{formatIndianNumber(p.originalCost)}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-900 dark:text-white font-bold">₹{formatIndianNumber(p.revisedCost)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{p.progress}%</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold ${
                      p.risk === "HIGH" 
                        ? "bg-gradient-to-r from-rose-500/15 to-red-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10" 
                        : "bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                    }`}>
                      {p.risk} RISK
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/projects/${p.code}`}
                      className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition border border-blue-200 dark:border-blue-800"
                    >
                      View &rarr;
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

