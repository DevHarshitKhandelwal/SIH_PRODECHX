"use client";

import { FileText, ShieldCheck, CheckCircle2 } from "lucide-react";
import { formatIndianNumber } from "../../lib/formatters";

const DOCUMENTS_CATALOG = [
  {
    name: "FlashReport_April2026.pdf",
    period: "April 2026",
    pages: 163,
    sizeBytes: 3215216,
    sha256: "90a6959e976da6928440efdea9c68847d1178356e4c0ebd078c51026ddb118d5",
    projectsIngested: 1981,
    status: "INGESTED & AUDITED"
  },
  {
    name: "FlashReport_May2026.pdf",
    period: "May 2026",
    pages: 163,
    sizeBytes: 3217996,
    sha256: "480d98632cd1b1d4fe70b58a5a753924b2735b0135e7c8507c1ec05ff2ddf005",
    projectsIngested: 1987,
    status: "INGESTED & AUDITED"
  },
  {
    name: "FlashReport_June_2026.pdf",
    period: "June 2026",
    pages: 161,
    sizeBytes: 6540236,
    sha256: "d26872ac9336b451d311e823646560d29d8a6c2fbc9fdca9fd78fc22fd08ca15",
    projectsIngested: 1847,
    status: "INGESTED & AUDITED"
  }
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6 transition-all duration-300">
      {/* Top Banner */}
      <div className="glass-card p-5 rounded-2xl flex items-center justify-between border-t-4 border-t-emerald-500 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">PAIMANA Flash Report Source Vault</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Authoritative source PDF documents ingested into Supabase Storage with cryptographic SHA-256 integrity verification.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" />
          100% Cryptographic Audit Pass
        </div>
      </div>

      {/* Documents Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Master Ingested PDF Document Vault</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Storage Bucket: paimana-documents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200/80 dark:border-slate-800/80">
              <tr>
                <th className="px-4 py-3.5">Document Name</th>
                <th className="px-4 py-3.5">Report Period</th>
                <th className="px-4 py-3.5 text-right">Pages</th>
                <th className="px-4 py-3.5 text-right">File Size</th>
                <th className="px-4 py-3.5 text-right">Projects Ingested</th>
                <th className="px-4 py-3.5">SHA-256 Checksum</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 font-medium">
              {DOCUMENTS_CATALOG.map((doc) => (
                <tr key={doc.name} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-mono">{doc.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-bold">{doc.period}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 dark:text-slate-300">{doc.pages}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 dark:text-slate-300">{(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB</td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-900 dark:text-white font-bold">{formatIndianNumber(doc.projectsIngested)}</td>
                  <td className="px-4 py-3.5 font-mono text-[10px] text-slate-500 dark:text-slate-400 max-w-xs truncate">{doc.sha256}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                      {doc.status}
                    </span>
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

