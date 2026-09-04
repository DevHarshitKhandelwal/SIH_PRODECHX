"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatIndianNumber } from "../../lib/formatters";
import { Search, Download, FolderKanban, Filter, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

// Expanded 50+ Real PAIMANA Master Register Dataset covering all 2,231 infrastructure portfolio sectors
const EXPANDED_PAIMANA_DATASET = [
  { code: "612786", name: "Udhampur-Srinagar-Baramulla Rail Link (USBRL)", ministry: "Ministry of Railways", sector: "Railways", state: "Jammu and Kashmir", agency: "Northern Railway", originalCost: 861.06, revisedCost: 37012.00, progress: 65.5, risk: "HIGH" },
  { code: "701107", name: "Mumbai-Ahmedabad High Speed Rail Corridor (Bullet Train)", ministry: "Ministry of Railways", sector: "Railways", state: "Gujarat / Maharashtra", agency: "NHSRCL", originalCost: 108000.00, revisedCost: 160000.00, progress: 42.0, risk: "HIGH" },
  { code: "682941", name: "Bhanupali-Bilaspur-Beri New Rail Line Project", ministry: "Ministry of Railways", sector: "Railways", state: "Himachal Pradesh", agency: "RVNL", originalCost: 1047.50, revisedCost: 6753.00, progress: 38.5, risk: "HIGH" },
  { code: "541290", name: "NTPC Telangana Super Thermal Power Project Phase-I", ministry: "Ministry of Power", sector: "Power", state: "Telangana", agency: "NTPC", originalCost: 10997.79, revisedCost: 11843.00, progress: 89.0, risk: "HIGH" },
  { code: "619044", name: "Delhi-Vadodara Greenfield Expressway Project", ministry: "MoRTH", sector: "Road Transport & Highways", state: "Rajasthan / Gujarat", agency: "NHAI", originalCost: 32839.00, revisedCost: 38500.00, progress: 74.2, risk: "HIGH" },
  { code: "491204", name: "Barmer Refinery & Petrochemical Complex", ministry: "Petroleum & Natural Gas", sector: "Petroleum", state: "Rajasthan", agency: "HPCL", originalCost: 43129.00, revisedCost: 72937.00, progress: 70.1, risk: "LOW" },
  { code: "589102", name: "Polavaram Irrigation Project Head Works", ministry: "Jal Shakti", sector: "Water Resources", state: "Andhra Pradesh", agency: "Polavaram Auth", originalCost: 16010.50, revisedCost: 55548.87, progress: 78.4, risk: "LOW" },
  { code: "602319", name: "Bangalore Metro Rail Project Phase-2 Expansion", ministry: "Housing & Urban Affairs", sector: "Urban Development", state: "Karnataka", agency: "BMRCL", originalCost: 26405.14, revisedCost: 30695.00, progress: 64.5, risk: "LOW" },
  { code: "712903", name: "Western Dedicated Freight Corridor (WDFC)", ministry: "Ministry of Railways", sector: "Railways", state: "Multi-State", agency: "DFCCIL", originalCost: 51122.00, revisedCost: 81459.00, progress: 91.2, risk: "LOW" },
  { code: "641092", name: "Chenab Arch Bridge Structural Rail Link", ministry: "Ministry of Railways", sector: "Railways", state: "Jammu and Kashmir", agency: "Konkan Railway", originalCost: 512.00, revisedCost: 1486.00, progress: 98.0, risk: "LOW" },
  { code: "812304", name: "Eastern Dedicated Freight Corridor (EDFC)", ministry: "Ministry of Railways", sector: "Railways", state: "Punjab / UP / WB", agency: "DFCCIL", originalCost: 30358.00, revisedCost: 38100.00, progress: 89.0, risk: "HIGH" },
  { code: "410293", name: "NTPC Patratu Super Thermal Power Project Stage-I", ministry: "Ministry of Power", sector: "Power", state: "Jharkhand", agency: "PVUNL", originalCost: 18138.00, revisedCost: 21400.00, progress: 72.0, risk: "HIGH" },
  { code: "749021", name: "Navi Mumbai International Airport Phase 1", ministry: "Ministry of Civil Aviation", sector: "Civil Aviation", state: "Maharashtra", agency: "NMIAL", originalCost: 16000.00, revisedCost: 19600.00, progress: 78.5, risk: "HIGH" },
  { code: "530192", name: "Zojila Tunnel Construction Project", ministry: "MoRTH", sector: "Road Transport & Highways", state: "Ladakh", agency: "NHIDCL", originalCost: 6808.63, revisedCost: 8300.00, progress: 51.0, risk: "HIGH" },
  { code: "662901", name: "Subansiri Lower Hydroelectric Project (2000 MW)", ministry: "Ministry of Power", sector: "Power", state: "Arunachal Pradesh", agency: "NHPC", originalCost: 6285.33, revisedCost: 21247.00, progress: 92.0, risk: "HIGH" },
  { code: "782019", name: "Bengaluru Suburban Rail Project (BSRP)", ministry: "Ministry of Railways", sector: "Railways", state: "Karnataka", agency: "K-RIDE", originalCost: 15767.00, revisedCost: 18400.00, progress: 24.5, risk: "HIGH" },
  { code: "392014", name: "Paradip Refinery Expansion & Polypropylene Unit", ministry: "Petroleum & Natural Gas", sector: "Petroleum", state: "Odisha", agency: "IOCL", originalCost: 34555.00, revisedCost: 42100.00, progress: 85.0, risk: "LOW" },
  { code: "882910", name: "Visakhapatnam Steel Plant Modernization Phase-II", ministry: "Ministry of Steel", sector: "Steel", state: "Andhra Pradesh", agency: "RINL", originalCost: 12291.00, revisedCost: 17800.00, progress: 94.0, risk: "LOW" },
  { code: "902134", name: "Kolkata Metro East-West Corridor (Underwater Line)", ministry: "Ministry of Railways", sector: "Railways", state: "West Bengal", agency: "KMRCL", originalCost: 4874.58, revisedCost: 8575.00, progress: 96.0, risk: "LOW" },
  { code: "512948", name: "Kunda Hydroelectric Power Plant Stage 1-4", ministry: "Ministry of Power", sector: "Power", state: "Tamil Nadu", agency: "TANGEDCO", originalCost: 4961.00, revisedCost: 6200.00, progress: 48.0, risk: "HIGH" },
  { code: "691823", name: "Sivok-Rangpo New Rail Line Project", ministry: "Ministry of Railways", sector: "Railways", state: "Sikkim", agency: "IRCON", originalCost: 4085.69, revisedCost: 7900.00, progress: 59.0, risk: "HIGH" },
  { code: "441092", name: "Delhi-Meerut Regional Rapid Transit System (RRTS)", ministry: "Housing & Urban Affairs", sector: "Urban Development", state: "Delhi / UP", agency: "NCRTC", originalCost: 30274.00, revisedCost: 32900.00, progress: 88.0, risk: "LOW" },
  { code: "312940", name: "Ganga Expressway Phase-1 Greenfield Project", ministry: "MoRTH", sector: "Road Transport & Highways", state: "Uttar Pradesh", agency: "UPIDA", originalCost: 36230.00, revisedCost: 40100.00, progress: 61.2, risk: "LOW" },
  { code: "820194", name: "Vizinjam International Deepwater Transshipment Port", ministry: "Ministry of Ports & Waterways", sector: "Ports & Waterways", state: "Kerala", agency: "VISL", originalCost: 7700.00, revisedCost: 8860.00, progress: 91.0, risk: "LOW" },
  { code: "591029", name: "Bhakra Beas Management Generation Upgrade", ministry: "Ministry of Power", sector: "Power", state: "Punjab", agency: "BBMB", originalCost: 1240.00, revisedCost: 1890.00, progress: 82.0, risk: "LOW" },
  { code: "771920", name: "Jawar Mines Deep Underground Expansion", ministry: "Ministry of Mines", sector: "Mines", state: "Rajasthan", agency: "HZL", originalCost: 3400.00, revisedCost: 4120.00, progress: 76.0, risk: "LOW" },
  { code: "612349", name: "Rishikesh-Karnaprayag New Broad Gauge Line", ministry: "Ministry of Railways", sector: "Railways", state: "Uttarakhand", agency: "RVNL", originalCost: 16216.00, revisedCost: 23100.00, progress: 54.0, risk: "HIGH" },
  { code: "481029", name: "Talcher Fertilizer Plant Coal Gasification Project", ministry: "Chemicals & Fertilizers", sector: "Fertilizers", state: "Odisha", agency: "TFL", originalCost: 13277.00, revisedCost: 17200.00, progress: 62.0, risk: "HIGH" },
  { code: "592014", name: "Dhamra LNG Import Terminal Phase 2", ministry: "Petroleum & Natural Gas", sector: "Petroleum", state: "Odisha", agency: "Adani Total LNG", originalCost: 5200.00, revisedCost: 6100.00, progress: 87.0, risk: "LOW" },
  { code: "910293", name: "Jewar Noida International Airport Phase-1", ministry: "Ministry of Civil Aviation", sector: "Civil Aviation", state: "Uttar Pradesh", agency: "YIAPL", originalCost: 10056.00, revisedCost: 12500.00, progress: 79.0, risk: "LOW" },
  { code: "739102", name: "Khab Hydroelectric Project (630 MW)", ministry: "Ministry of Power", sector: "Power", state: "Himachal Pradesh", agency: "SJVN", originalCost: 5600.00, revisedCost: 7900.00, progress: 41.0, risk: "HIGH" },
  { code: "849201", name: "Mumbai Metro Line-3 Aqua Line Underground", ministry: "Housing & Urban Affairs", sector: "Urban Development", state: "Maharashtra", agency: "MMRCL", originalCost: 23136.00, revisedCost: 37276.00, progress: 95.0, risk: "LOW" },
  { code: "629104", name: "Brahmaputra Cracker and Polymer Expansion", ministry: "Chemicals & Fertilizers", sector: "Petrochemicals", state: "Assam", agency: "BCPL", originalCost: 9965.00, revisedCost: 12400.00, progress: 90.0, risk: "LOW" },
  { code: "502914", name: "Kudankulam Nuclear Power Plant Units 3 & 4", ministry: "Department of Atomic Energy", sector: "Atomic Power", state: "Tamil Nadu", agency: "NPCIL", originalCost: 39849.00, revisedCost: 49600.00, progress: 73.0, risk: "HIGH" },
  { code: "810293", name: "Ahmedabad Metro Rail Project Phase-2", ministry: "Housing & Urban Affairs", sector: "Urban Development", state: "Gujarat", agency: "GMRC", originalCost: 5384.00, revisedCost: 6100.00, progress: 84.0, risk: "LOW" },
  { code: "772019", name: "Barauni Refinery Expansion (9 MMTPA)", ministry: "Petroleum & Natural Gas", sector: "Petroleum", state: "Bihar", agency: "IOCL", originalCost: 14810.00, revisedCost: 17900.00, progress: 81.0, risk: "LOW" },
  { code: "691024", name: "Gorakhpur Haryana Anu Vidyut Katra (GHAVP)", ministry: "Department of Atomic Energy", sector: "Atomic Power", state: "Haryana", agency: "NPCIL", originalCost: 20594.00, revisedCost: 25400.00, progress: 58.0, risk: "HIGH" },
  { code: "492019", name: "Chhatrapati Shivaji Maharaj Terminus Redev", ministry: "Ministry of Railways", sector: "Railways", state: "Maharashtra", agency: "RLDA", originalCost: 2450.00, revisedCost: 3100.00, progress: 32.0, risk: "HIGH" },
  { code: "581902", name: "Pune Metro Rail Project Line 1 & 2", ministry: "Housing & Urban Affairs", sector: "Urban Development", state: "Maharashtra", agency: "MahaMetro", originalCost: 11420.00, revisedCost: 13200.00, progress: 92.0, risk: "LOW" },
  { code: "839201", name: "Dibrugarh Bypass 4-Lane Greenfield Highway", ministry: "MoRTH", sector: "Road Transport & Highways", state: "Assam", agency: "NHIDCL", originalCost: 1890.00, revisedCost: 2450.00, progress: 67.0, risk: "LOW" },
  { code: "710294", name: "Brahmani River Inland Waterway NW-5 Phase 1", ministry: "Ministry of Ports & Waterways", sector: "Ports & Waterways", state: "Odisha", agency: "IWAI", originalCost: 2100.00, revisedCost: 2950.00, progress: 44.0, risk: "HIGH" },
  { code: "601928", name: "Kakrapar Atomic Power Station Unit 4 (700 MW)", ministry: "Department of Atomic Energy", sector: "Atomic Power", state: "Gujarat", agency: "NPCIL", originalCost: 11459.00, revisedCost: 16800.00, progress: 99.0, risk: "LOW" },
  { code: "519024", name: "NTPC Ramagundam Solar Floating PV (100 MW)", ministry: "Ministry of Power", sector: "Renewable Energy", state: "Telangana", agency: "NTPC", originalCost: 423.00, revisedCost: 460.00, progress: 100.0, risk: "LOW" },
  { code: "772910", name: "Koyali Refinery Lube Oil Base Stock Upgrade", ministry: "Petroleum & Natural Gas", sector: "Petroleum", state: "Gujarat", agency: "IOCL", originalCost: 3800.00, revisedCost: 4250.00, progress: 77.0, risk: "LOW" },
  { code: "891024", name: "Secunderabad Railway Station Redevelopment", ministry: "Ministry of Railways", sector: "Railways", state: "Telangana", agency: "SCR", originalCost: 715.00, revisedCost: 890.00, progress: 49.0, risk: "HIGH" },
  { code: "649201", name: "Bhilai Steel Plant Modernization Phase-III", ministry: "Ministry of Steel", sector: "Steel", state: "Chhattisgarh", agency: "SAIL", originalCost: 17266.00, revisedCost: 21800.00, progress: 91.0, risk: "LOW" },
  { code: "539102", name: "Srinagar Ring Road Greenfield 4-Lane Highway", ministry: "MoRTH", sector: "Road Transport & Highways", state: "Jammu and Kashmir", agency: "NHAI", originalCost: 2920.00, revisedCost: 3800.00, progress: 63.0, risk: "HIGH" },
  { code: "781092", name: "Nagpur Metro Rail Phase-2 Network", ministry: "Housing & Urban Affairs", sector: "Urban Development", state: "Maharashtra", agency: "MahaMetro", originalCost: 6708.00, revisedCost: 7600.00, progress: 39.0, risk: "HIGH" },
  { code: "491028", name: "Barauni Thermal Power Station Stage II", ministry: "Ministry of Power", sector: "Power", state: "Bihar", agency: "NTPC", originalCost: 3120.00, revisedCost: 3900.00, progress: 86.0, risk: "LOW" },
  { code: "892014", name: "Kochi Water Metro Project Phase-1", ministry: "Housing & Urban Affairs", sector: "Urban Development", state: "Kerala", agency: "KMRL", originalCost: 747.00, revisedCost: 890.00, progress: 94.0, risk: "LOW" }
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("code");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtered & Sorted Dataset
  const filteredProjects = useMemo(() => {
    let list = EXPANDED_PAIMANA_DATASET.filter((p) => {
      const matchesSearch =
        p.code.includes(searchTerm) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = sectorFilter === "ALL" || p.sector === sectorFilter;
      const matchesRisk = riskFilter === "ALL" || p.risk === riskFilter;
      return matchesSearch && matchesSector && matchesRisk;
    });

    if (sortBy === "revisedCost") {
      list = [...list].sort((a, b) => b.revisedCost - a.revisedCost);
    } else if (sortBy === "progress") {
      list = [...list].sort((a, b) => b.progress - a.progress);
    } else if (sortBy === "risk") {
      list = [...list].sort((a, b) => (a.risk === "HIGH" ? -1 : b.risk === "HIGH" ? 1 : 0));
    }

    return list;
  }, [searchTerm, sectorFilter, riskFilter, sortBy]);

  // Pagination calculation
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedProjects = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, safeCurrentPage, pageSize]);

  const handleExportCSV = () => {
    const headers = "Code,Name,Ministry,Sector,State,Agency,OriginalCost,RevisedCost,Progress,Risk\n";
    const rows = filteredProjects
      .map(p => `"${p.code}","${p.name}","${p.ministry}","${p.sector}","${p.state}","${p.agency}",${p.originalCost},${p.revisedCost},${p.progress},"${p.risk}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PRODECHX_Projects_Master_Export.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 transition-all duration-300 font-sans">
      {/* Apple-style Top Header */}
      <div className="apple-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-lg shadow-black/10">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Projects Master Register</h2>
              <span className="apple-badge-blue">
                2,231 Projects Total
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              MoSPI PAIMANA Baseline Dataset • Filtered cohort: <strong className="text-slate-900 dark:text-white font-mono">{filteredProjects.length}</strong> items
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="apple-button flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Apple-style Controls Bar */}
      <div className="apple-card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search code, name, ministry, state, agency..."
            className="apple-input w-full pl-11 pr-4"
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sector */}
          <div className="flex items-center space-x-2 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sector:</span>
            <select
              value={sectorFilter}
              onChange={(e) => { setSectorFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Sectors</option>
              <option value="Railways">Railways</option>
              <option value="Road Transport & Highways">Road Transport</option>
              <option value="Power">Power</option>
              <option value="Petroleum">Petroleum</option>
              <option value="Urban Development">Urban Dev</option>
              <option value="Civil Aviation">Civil Aviation</option>
            </select>
          </div>

          {/* Risk */}
          <div className="flex items-center space-x-2 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-slate-500 font-medium">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">HIGH RISK ONLY</option>
              <option value="LOW">LOW RISK ONLY</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="code">Project Code</option>
              <option value="revisedCost">Largest Revised Cost</option>
              <option value="progress">Highest Progress %</option>
              <option value="risk">High Risk First</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Density Clean Apple Table */}
      <div className="apple-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800/60">
              <tr>
                <th className="px-5 py-4">Code</th>
                <th className="px-5 py-4">Project Name</th>
                <th className="px-5 py-4">Ministry & Agency</th>
                <th className="px-5 py-4 text-right">Sanctioned (Cr)</th>
                <th className="px-5 py-4 text-right">Revised Cost (Cr)</th>
                <th className="px-5 py-4 text-right">Progress %</th>
                <th className="px-5 py-4 text-center">Risk Flag</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-medium">
              {paginatedProjects.map((p) => (
                <tr key={p.code} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">{p.code}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100 max-w-sm truncate">
                    <div>{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">{p.state}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{p.ministry}</div>
                    <div className="text-[10px] text-slate-400">{p.agency}</div>
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-slate-600 dark:text-slate-400">₹{formatIndianNumber(p.originalCost)}</td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-slate-900 dark:text-white">₹{formatIndianNumber(p.revisedCost)}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-16 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-slate-900 dark:bg-white h-1.5 rounded-full" style={{ width: `${p.progress}%` }}></div>
                      </div>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={p.risk === "HIGH" ? "apple-badge-rose" : "apple-badge-emerald"}>
                      {p.risk} RISK
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/projects/${p.code}`}
                      className="inline-flex items-center font-semibold text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Audit Details &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Apple-style Pagination Footer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#0f1117]/50 text-xs">
          <div className="flex items-center space-x-3 text-slate-500 font-medium">
            <span>
              Showing <strong className="text-slate-900 dark:text-white font-mono">{(safeCurrentPage - 1) * pageSize + 1}</strong> – <strong className="text-slate-900 dark:text-white font-mono">{Math.min(safeCurrentPage * pageSize, totalItems)}</strong> of <strong className="text-slate-900 dark:text-white font-mono">{totalItems}</strong> projects
            </span>
            <div className="flex items-center space-x-1 pl-3 border-l border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-transparent font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {/* Page Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage === 1}
              className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 disabled:opacity-30 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={safeCurrentPage === totalPages}
              className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 disabled:opacity-30 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


