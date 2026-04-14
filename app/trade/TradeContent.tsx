"use client";

import React from "react";
import { Download as DownloadIcon, ArrowUpRight, BarChart3, Database, BookOpen } from "lucide-react";
import PdfThumbnail from "@/components/PdfThumbnail";
import Link from "next/link";

export interface TradeReport {
  id: number | string;
  title: string;
  url: string;
  year?: string | number;
  type?: string;
  sector?: string;
  file_size_bytes?: number;
}

interface TradeContentProps {
  reports: TradeReport[];
}

function formatBytes(bytes: number | null | undefined): string {
  if (bytes === undefined || bytes === null || isNaN(Number(bytes))) return "Size Unknown";
  const b = Number(bytes);
  if (b === 0) return "0 KB";
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function TradeContent({ reports }: TradeContentProps) {
  if (reports.length === 0) {
    return (
      <div className="py-24 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">No Documents Found</h3>
        <p className="text-sm text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reports.map((doc) => {
        const isPowerBI = doc.type === "POWERBI";
        const pdfViewUrl = doc.url;
        const pdfDownloadUrl = `${doc.url}?mode=download`;

        return (
          <div
            key={doc.id}
            className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-[#193C8D]/30 hover:shadow-2xl transition-all duration-300 overflow-hidden h-full"
          >
            {/* THUMBNAIL AREA (Modified) */}
            <div className="relative bg-slate-50 border-b border-slate-100 flex items-center justify-center p-0 overflow-hidden">
              {/* This wrapper now has no inner size constraints and uses object-cover */}
              <div className="relative w-full aspect-[4/5] bg-white flex items-center justify-center overflow-hidden">
                {isPowerBI ? (
                  <div className="w-full h-full bg-gradient-to-br from-[#193C8D] to-[#0B1E3A] flex flex-col items-center justify-center relative">
                    <Database className="absolute -bottom-4 -right-4 w-20 h-20 text-white/5 rotate-12" />
                    <div className="relative z-10 w-12 h-12 bg-[#E7B947] rounded-lg flex items-center justify-center shadow-lg">
                      <BarChart3 className="w-7 h-7 text-[#193C8D]" />
                    </div>
                    <div className="absolute top-2 right-2 bg-[#E7B947] text-[#193C8D] text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                      Live
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <PdfThumbnail
                      pdfUrl={pdfViewUrl}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover Overlay - now covers the full thumbnail area */}
                    <Link
                      href={pdfViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-[#0B1E3A]/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white gap-2"
                    >
                      <BookOpen size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Read</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-bold text-[#193C8D] uppercase bg-blue-50 px-2 py-0.5 rounded truncate max-w-[140px]">
                  {doc.sector || "Trade & Policy"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {doc.year || "2026"}
                </span>
              </div>

              <Link
                href={pdfViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#0B1E3A] hover:text-[#193C8D] mb-3 block leading-snug line-clamp-2"
              >
                {doc.title}
              </Link>

              <p className="text-[12px] text-slate-500 line-clamp-2 mb-6 italic">
                Official documentation regarding {doc.title.toLowerCase()}.
              </p>

              {/* ACTIONS AREA */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                {isPowerBI ? (
                  <Link
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-[#193C8D] text-white rounded-lg text-[10px] font-bold uppercase hover:bg-[#E7B947] hover:text-[#193C8D] transition"
                  >
                    View Analytics <ArrowUpRight size={14} />
                  </Link>
                ) : (
                  <>
                    <Link
                      href={pdfViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-[#193C8D] hover:text-yellow-600 flex items-center gap-1"
                    >
                      <BookOpen size={12} /> View
                    </Link>

                    {/* Standard <a> for download */}
                    <a
                      href={pdfDownloadUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-[#193C8D] transition-colors"
                    >
                      <DownloadIcon size={12} /> {formatBytes(doc.file_size_bytes)}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}




