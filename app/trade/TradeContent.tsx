// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { Search, X, AlertCircle, ArrowUpRight, FileText, Eye, Download } from "lucide-react";

// export interface TradeReport {
//   id: number; // Numeric ID from the database
//   title: string;
//   url: string; 
//   year?: string | number;
//   type?: string;
// }

// interface RowProps {
//   item: TradeReport;
// }

// interface TradeContentProps {
//   reports: TradeReport[];
// }

// // --- THUMBNAIL COMPONENTS ---

// function PowerBiThumbnail() {
//   return (
//     <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-[#1E40AF]/30 bg-white flex items-center justify-center relative shadow-lg">
//       <img
//         src="https://app.powerbi.com/favicon.ico"
//         alt="Power BI"
//         className="w-12 h-12 object-contain"
//       />
//       <div className="absolute top-1.5 right-1.5 bg-[#F59E0B] text-[#1E40AF] text-[7px] font-black px-1 py-0.5 rounded uppercase">
//         LIVE
//       </div>
//     </div>
//   );
// }

// function PdfThumbnail() {
//   return (
//     <div className="w-16 h-20 shrink-0 rounded-lg border-2 border-orange-100 bg-white flex flex-col overflow-hidden shadow-md">
//       <div className="h-3 bg-orange-500 w-full flex items-center justify-center">
//         <span className="text-[7px] font-bold text-white uppercase tracking-tighter">PDF</span>
//       </div>
//       <div className="flex-1 flex items-center justify-center bg-orange-50">
//         <FileText className="w-8 h-8 text-orange-400" strokeWidth={1.5} />
//       </div>
//     </div>
//   );
// }

// // --- ROW COMPONENTS ---

// function PowerBiRow({ item }: RowProps) {
//   return (
//     <div className="flex items-center gap-4 p-4 bg-[#1E40AF]/5 border border-[#1E40AF]/10 rounded-2xl hover:border-[#1E40AF]/40 transition-all group">
//       <PowerBiThumbnail />
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-[10px] font-black text-[#1E40AF] uppercase tracking-widest">Trade Intelligence</span>
//           <span className="px-1.5 py-0.5 rounded bg-[#F59E0B] text-[#1E40AF] text-[9px] font-black uppercase tracking-tighter">Live Data</span>
//         </div>
//         <h4 className="font-bold text-gray-900 text-base group-hover:text-[#1E40AF] transition-colors uppercase tracking-tight">
//           {item.title}
//         </h4>
//       </div>
//       <a
//         href={item.url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#F59E0B] hover:text-[#1E40AF] transition-all shadow-md"
//       >
//         Open Analytics <ArrowUpRight size={14} />
//       </a>
//     </div>
//   );
// }

// function PdfRow({ item }: RowProps) {
//   // Using the numeric ID to construct the API path just like your Research page
//   const apiBaseUrl = `/api/documents/download/${item.id}`;
//   const pdfViewUrl = apiBaseUrl;
//   const pdfDownloadUrl = `${apiBaseUrl}?mode=download`;

//   return (
//     <div className="flex items-center gap-4 p-4 bg-orange-50/30 border border-orange-100 rounded-2xl hover:border-orange-300 hover:bg-orange-50 transition-all group">
//       <PdfThumbnail />
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Trade Document</span>
//           <span className="text-[10px] font-bold text-orange-500">Archive {item.year}</span>
//         </div>
//         <h4 className="font-bold text-gray-900 text-base group-hover:text-orange-700 transition-colors uppercase tracking-tight line-clamp-1">
//           {item.title}
//         </h4>
//       </div>
//       <div className="flex items-center gap-2">
//         <a
//           href={pdfViewUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white border border-orange-200 text-orange-700 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-50 transition-all shadow-sm"
//         >
//           <Eye size={14} /> Preview
//         </a>
//         <a
//           href={pdfDownloadUrl}
//           className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-700 transition-all shadow-md"
//         >
//           <Download size={14} /> Download
//         </a>
//       </div>
//     </div>
//   );
// }

// // --- MAIN CONTENT COMPONENT ---

// export default function TradeContent({ reports }: TradeContentProps) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedYear, setSelectedYear] = useState<string>("");
//   const [selectedType, setSelectedType] = useState<string>("");
//   const [page, setPage] = useState(1);
//   const pageSize = 8;

//   const years = useMemo(() => {
//     const uniqueYears = Array.from(new Set(reports.map(r => r.year).filter(Boolean)));
//     return uniqueYears.sort((a, b) => String(b).localeCompare(String(a)));
//   }, [reports]);

//   const types = useMemo(() => {
//     return Array.from(new Set(reports.map(r => r.type).filter(Boolean)));
//   }, [reports]);

//   const filteredReports = useMemo(() => {
//     return reports.filter((item: TradeReport) => {
//       const matchesKeyword = searchQuery 
//         ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) 
//         : true;
//       const matchesYear = selectedYear 
//         ? String(item.year) === selectedYear 
//         : true;
//       const matchesType = selectedType 
//         ? String(item.type) === selectedType 
//         : true;
//       return matchesKeyword && matchesYear && matchesType;
//     });
//   }, [reports, searchQuery, selectedYear, selectedType]);

//   const totalPages = Math.ceil(filteredReports.length / pageSize);
//   const paginatedReports = filteredReports.slice((page - 1) * pageSize, page * pageSize);

//   useEffect(() => { setPage(1); }, [searchQuery, selectedYear, selectedType]);

//   return (
//     <div className="container mx-auto px-6 py-10">
//       <div className="mb-12">
//         <div className="flex flex-col md:flex-row md:items-end gap-4 max-w-4xl mx-auto">
//           <div className="relative flex-1">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search trade analytics..."
//               className="block w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium shadow-xl focus:ring-2 focus:ring-[#1E40AF] outline-none transition-all"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             {searchQuery && (
//               <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
//                 <X className="h-5 w-5" />
//               </button>
//             )}
//           </div>
          
//           <select
//             className="block w-full md:w-40 px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium shadow-xl cursor-pointer"
//             value={selectedYear}
//             onChange={e => setSelectedYear(e.target.value)}
//           >
//             <option value="">All Years</option>
//             {years.map((year) => (
//               <option key={String(year)} value={String(year)}>{year}</option>
//             ))}
//           </select>

//           <select
//             className="block w-full md:w-40 px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium shadow-xl cursor-pointer"
//             value={selectedType}
//             onChange={e => setSelectedType(e.target.value)}
//           >
//             <option value="">All Types</option>
//             {types.map((type) => (
//               <option key={String(type)} value={String(type)}>{type}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <main className="space-y-4 max-w-4xl mx-auto">
//         {paginatedReports.length === 0 ? (
//           <div className="py-24 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
//             <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
//             <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest">No Reports Found</h3>
//           </div>
//         ) : (
//           paginatedReports.map((item: TradeReport, idx: number) => {
//             if (item.type === "PDF") {
//               return <PdfRow key={item.id || idx} item={item} />;
//             }
//             return <PowerBiRow key={item.id || idx} item={item} />;
//           })
//         )}
//       </main>

//       {/* PAGINATION */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-10">
//           <button
//             className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-[#1E40AF] text-xs font-bold uppercase disabled:opacity-40 transition-all shadow-sm"
//             onClick={() => setPage(page - 1)}
//             disabled={page === 1}
//           >
//             Previous
//           </button>
//           <span className="text-xs font-bold text-zinc-500 px-4">
//             Page {page} of {totalPages}
//           </span>
//           <button
//             className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-[#1E40AF] text-xs font-bold uppercase disabled:opacity-40 transition-all shadow-sm"
//             onClick={() => setPage(page + 1)}
//             disabled={page === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import React from "react";
import { BookOpen, Download as DownloadIcon, ArrowUpRight, FileText } from "lucide-react";
import PdfThumbnail from "@/components/PdfThumbnail";
import Link from "next/link";

export interface TradeReport {
  id: number;
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

// Helper to format bytes
function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || isNaN(Number(bytes))) return "0 KB";
  const b = Number(bytes);
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
    <div className="space-y-6">
      {reports.map((doc, index) => {
        const isPowerBI = doc.type === "POWERBI";
        const pdfViewUrl = doc.url;
        const pdfDownloadUrl = `${doc.url}?mode=download`;

        // 1. POWER BI STYLING
        if (isPowerBI) {
          return (
            <div
              key={`${doc.id}-${index}`}
              className="group flex flex-col md:flex-row gap-8 bg-white p-5 rounded-2xl border border-yellow-200 hover:border-yellow-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
            >
              {/* PowerBI Thumbnail */}
              <div className="relative shrink-0 w-full md:w-40 aspect-[3/4] rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-yellow-50 border border-yellow-100">
                <img
                  src="https://app.powerbi.com/favicon.ico"
                  alt="Power BI"
                  className="w-16 h-16 object-contain mx-auto"
                />
                <div className="absolute top-2 right-2 bg-yellow-400 text-[#193C8D] text-[9px] font-black px-2 py-0.5 rounded uppercase shadow">LIVE</div>
              </div>

              {/* Info Column */}
              <div className="flex flex-col flex-1 py-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-yellow-700 uppercase bg-yellow-50 px-2.5 py-1 rounded border border-yellow-200">
                    Trade Analytics
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Ref: {doc.year || '2026'}
                  </span>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-[#0B1E3A] hover:text-yellow-600 transition-colors mb-3 block leading-snug uppercase tracking-tight"
                >
                  {doc.title}
                </a>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium italic">
                  Interactive PowerBI dashboard for industrial trade monitoring and sector analysis.
                </p>
                <div className="mt-auto flex items-center gap-8 pt-4 border-t border-slate-50">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-black text-yellow-700 hover:text-[#193C8D] transition-colors uppercase tracking-widest bg-yellow-100 px-4 py-2 rounded-xl shadow-sm"
                  >
                    Open Analytics <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          );
        }

        // 2. PDF STYLING (The standard listing)
        return (
          <div
            key={`${doc.id}-${index}`}
            className="group flex flex-col md:flex-row gap-8 bg-white p-5 rounded-2xl border border-slate-200 hover:border-yellow-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
          >
            {/* Preview Box */}
            <div className="relative shrink-0 w-full md:w-40 aspect-[3/4] rounded-xl overflow-hidden shadow-sm">
              <PdfThumbnail
                pdfUrl={pdfViewUrl}
                className="w-full h-full"
                delay={index * 100}
              />
              <Link
                href={pdfViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 bg-[#193C8D]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2"
              >
                <BookOpen size={20} />
                <span className="text-[10px] font-bold uppercase">Read Report</span>
              </Link>
            </div>

            {/* Info Column */}
            <div className="flex flex-col flex-1 py-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold text-[#193C8D] uppercase bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                  {doc.sector || "Trade & Policy"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Ref: {doc.year || '2026'}
                </span>
              </div>
              <Link
                href={pdfViewUrl}
                target="_blank"
                className="text-lg font-bold text-[#0B1E3A] hover:text-[#193C8D] transition-colors mb-3 block leading-snug uppercase tracking-tight"
              >
                {doc.title}
              </Link>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium italic">
                Official policy and trade documentation regarding {doc.title.toLowerCase()}.
              </p>

              {/* Action Buttons */}
              <div className="mt-auto flex items-center gap-8 pt-4 border-t border-slate-50">
                <Link
                  href={pdfViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-black text-[#193C8D] hover:text-yellow-600 transition-colors uppercase tracking-widest"
                >
                  <BookOpen size={14} /> View Online
                </Link>
                <Link
                  href={pdfDownloadUrl}
                  className="flex items-center gap-2 text-xs font-black text-[#193C8D] hover:text-yellow-600 transition-colors uppercase tracking-widest"
                  download
                >
                  <DownloadIcon size={14} /> Download ({formatBytes(doc.file_size_bytes)})
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}