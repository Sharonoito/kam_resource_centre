"use client";

import React from "react";
import { BookOpen, Download as DownloadIcon, ArrowUpRight, FileText } from "lucide-react";
import PdfThumbnail from "@/components/PdfThumbnail";
import Link from "next/link";

export interface TaxReport {
  id: number | string;
  title: string;
  url: string; 
  year?: string | number;
  type?: string;
  sector?: string;
}

interface TaxContentProps {
  reports: TaxReport[];
}

export default function TaxContent({ reports }: TaxContentProps) {
  if (reports.length === 0) {
    return (
      <div className="py-24 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">No Documents Found</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {reports.map((doc, index) => {
        const isPowerBI = doc.type === "POWERBI";
        // Ensure the URL is clean for the thumbnail component
        const thumbUrl = doc.url;

        return (
          <div
            key={doc.id}
            className="group flex flex-col md:flex-row gap-6 bg-white p-5 rounded-2xl border border-slate-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300"
          >
            {/* Thumbnail Area */}
            <div className="relative shrink-0 w-full md:w-40 aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
              {isPowerBI ? (
                <div className="w-full h-full flex items-center justify-center bg-yellow-50">
                   <img src="https://app.powerbi.com/favicon.ico" className="w-10 h-10 opacity-50" alt="BI" />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  {/* The PdfThumbnail component handles the canvas rendering */}
                  <PdfThumbnail
                    pdfUrl={thumbUrl}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay for better UX */}
                  <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/40 transition-colors flex items-center justify-center">
                     <FileText className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                  </div>
                </div>
              )}
            </div>

            {/* Info Area */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                  {doc.sector}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {doc.year}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-[#0B1E3A] group-hover:text-[#193C8D] transition-colors mb-2">
                {doc.title}
              </h3>

              <div className="mt-auto flex items-center gap-6 pt-4 border-t border-slate-50">
                <Link
                  href={doc.url}
                  target="_blank"
                  className="flex items-center gap-2 text-xs font-black text-[#193C8D] uppercase tracking-widest hover:text-yellow-600"
                >
                  <BookOpen size={14} /> View Report
                </Link>
                {!isPowerBI && (
                  <Link
                    href={`${doc.url}?mode=download`}
                    className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-[#193C8D]"
                    download
                  >
                    <DownloadIcon size={14} /> Download
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}