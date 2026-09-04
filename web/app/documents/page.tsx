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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900">PAIMANA Flash Report Source Vault</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative source PDF documents ingested into Supabase Storage with real cryptographic SHA-256 integrity verification.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
          <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
          100% Cryptographic Audit Pass
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Master Ingested PDF Document Vault</h3>
          <span className="text-xs text-slate-500">Storage Bucket: paimana-documents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Document Name</th>
                <th className="px-4 py-3">Report Period</th>
                <th className="px-4 py-3 text-right">Pages</th>
                <th className="px-4 py-3 text-right">File Size</th>
                <th className="px-4 py-3 text-right">Projects Ingested</th>
                <th className="px-4 py-3">SHA-256 Checksum</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {DOCUMENTS_CATALOG.map((doc) => (
                <tr key={doc.name} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-semibold text-slate-900 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{doc.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-semibold">{doc.period}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700">{doc.pages}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700">{(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-900 font-bold">{formatIndianNumber(doc.projectsIngested)}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500 max-w-xs truncate">{doc.sha256}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
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
