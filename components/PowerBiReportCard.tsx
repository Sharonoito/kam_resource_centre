"use client"

import Link from "next/link";
import { BarChart3, ExternalLink } from "lucide-react";
import { kam_content } from "@prisma/client";

interface PowerBiReportCardProps {
  report: kam_content;
}

export default function PowerBiReportCard({ report }: PowerBiReportCardProps) {
  return (
    <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#193C8D] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block text-[11px] font-black uppercase tracking-widest text-blue-900">Interactive Dashboard</span>
            <span className="text-[10px] font-bold text-blue-600 bg-white/50 px-2.5 py-1 rounded-full">Power BI</span>
          </div>
        </div>
      </div>
      
      <Link href={`/sectors/report/${report.id}`} className="block">
        <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-2 mb-3 hover:text-[#193C8D] transition-colors">
          {report.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-6 leading-relaxed">
          {report.description}
        </p>
      </Link>

      <div className="flex items-center gap-3 pt-4 border-t border-blue-100">
        <Link 
          href={`/sectors/report/${report.id}`}
          className="flex items-center gap-2 text-xs font-bold text-[#193C8D] hover:text-blue-700 uppercase tracking-wider transition-colors"
        >
          <BarChart3 size={14} />
          Open Dashboard
        </Link>
        <Link 
          href={report.powerbi_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ExternalLink size={14} />
          Direct Link
        </Link>
      </div>
    </div>
  );
}
