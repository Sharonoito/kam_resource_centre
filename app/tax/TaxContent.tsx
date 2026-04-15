// "use client";

// import React, { useState } from "react";
// import { Download as DownloadIcon, ArrowUpRight, BarChart3, Database, X, FileText } from "lucide-react";
// import PdfThumbnail from "@/components/PdfThumbnail";
// import Link from "next/link";

// export interface TaxReport {
//   id: number | string;
//   title: string;
//   url: string; 
//   year?: string | number;
//   type?: string;
//   sector?: string;
// }

// interface TaxContentProps {
//   reports: TaxReport[];
// }

// export default function TaxContent({ reports }: TaxContentProps) {
//   // State to track which Power BI report is currently being viewed in the iframe
//   const [activeIframeUrl, setActiveIframeUrl] = useState<string | null>(null);

//   if (reports.length === 0) {
//     return (
//       <div className="py-24 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
//         <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">No Documents Found</h3>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full">
//       {/* FIX: SEARCH BAR OVERLAP 
//           We set z-20 here. Ensure your main site Navigation is z-50.
//           The top-[70px] ensures it doesn't hide behind or overlap the main header.
//       */}
//       <div className="sticky top-[70px] z-20 bg-white/95 backdrop-blur-md py-4 mb-6 border-b border-slate-100 shadow-sm md:shadow-none">
//          {/* The Search Input from ResearchHubContent will sit here */}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
//         {reports.map((doc) => {
//           const isPowerBI = doc.type === "POWERBI";

//           return (
//             <div
//               key={doc.id}
//               className="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-[#193C8D]/30 hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
//             >
//               {/* Card Header Visual */}
//               <div className="relative h-32 overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center">
//                 {isPowerBI ? (
//                   <div className="w-full h-full bg-gradient-to-br from-[#193C8D] to-[#0B1E3A] flex flex-col items-center justify-center relative">
//                     <Database className="absolute -bottom-4 -right-4 w-20 h-20 text-white/5 rotate-12" />
//                     <div className="relative z-10 w-10 h-10 bg-[#E7B947] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
//                       <BarChart3 className="w-6 h-6 text-[#193C8D]" />
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="relative w-full h-full">
//                     <PdfThumbnail pdfUrl={doc.url} className="w-full h-full object-cover object-top" />
//                     <div className="absolute inset-0 bg-[#0B1E3A]/20 group-hover:bg-[#0B1E3A]/40 transition-colors flex items-center justify-center">
//                        <FileText className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Card Content */}
//               <div className="p-4 flex flex-col flex-1">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-[8px] font-black text-[#193C8D] uppercase bg-[#193C8D]/5 px-1.5 py-0.5 rounded tracking-tighter">
//                     {doc.sector || "General Tax"}
//                   </span>
//                   <span className="text-[9px] font-mono text-slate-400 font-bold">{doc.year}</span>
//                 </div>
                
//                 <h3 className="text-[14px] font-bold text-[#0B1E3A] line-clamp-2 leading-tight group-hover:text-[#193C8D] transition-colors mb-4">
//                   {doc.title}
//                 </h3>

//                 {/* Card Actions */}
//                 <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
//                   {isPowerBI ? (
//                     <button
//                       onClick={() => setActiveIframeUrl(doc.url)}
//                       className="flex items-center justify-center gap-2 w-full py-2 bg-[#193C8D] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#E7B947] hover:text-[#193C8D] transition-all"
//                     >
//                       Analyze Report <ArrowUpRight size={14} />
//                     </button>
//                   ) : (
//                     <>
//                       <Link href={doc.url} target="_blank" className="text-[10px] font-black text-[#193C8D] hover:text-[#E7B947] uppercase tracking-tighter transition-colors">
//                         View Report
//                       </Link>
//                       <Link href={`${doc.url}?mode=download`} className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-[#193C8D] uppercase tracking-tighter transition-colors" download>
//                         <DownloadIcon size={12} /> Download
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* --- IFRAME MODAL FOR POWER BI --- */}
//       {activeIframeUrl && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1E3A]/90 backdrop-blur-md p-4 md:p-10">
//           <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
//             {/* Modal Top Bar */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-[#E7B947] rounded-lg flex items-center justify-center">
//                   <BarChart3 className="w-5 h-5 text-[#193C8D]" />
//                 </div>
//                 <p className="text-xs font-black text-[#0B1E3A] uppercase tracking-widest">Interactive Policy Analytics</p>
//               </div>
//               <button 
//                 onClick={() => setActiveIframeUrl(null)}
//                 className="p-2 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 rounded-full transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>
            
//             {/* The Iframe Viewer */}
//             <div className="flex-1 bg-slate-50 relative">
//               <iframe
//                 title="Tax Analytics PowerBI"
//                 src={activeIframeUrl}
//                 className="w-full h-full border-0"
//                 allowFullScreen={true}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React from "react";
import { BookOpen, Download as DownloadIcon, ArrowUpRight, BarChart3, Database } from "lucide-react";
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
    <div className="relative">
      {/* FIX: Z-INDEX & STICKY BEHAVIOR 
         We ensure this container stays below the main site navigation (z-50).
         The backdrop-blur makes it look modern when content scrolls underneath.
      */}
      <div className="sticky top-16 z-40 bg-[#FDFDFD]/80 backdrop-blur-md py-4 mb-6 border-b border-slate-100">
         {/* If your search input is inside ResearchHubContent, ensure it inherits this Z-index logic */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((doc) => {
          const isPowerBI = doc.type === "POWERBI";
          const thumbUrl = doc.url;

          return (
            <div
              key={doc.id}
              className="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-[#193C8D]/30 hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
            >
              {/* Header Area */}
              <div className="relative h-32 overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                {isPowerBI ? (
                  <div className="w-full h-full bg-gradient-to-br from-[#193C8D] to-[#0B1E3A] flex flex-col items-center justify-center relative">
                    <Database className="absolute -bottom-4 -right-4 w-20 h-20 text-white/5 rotate-12" />
                    <div className="relative z-10 w-10 h-10 bg-[#E7B947] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <BarChart3 className="w-6 h-6 text-[#193C8D]" />
                    </div>
                    <div className="absolute top-2 right-2 bg-[#E7B947] text-[#193C8D] text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                      Live Analytics
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <PdfThumbnail
                      pdfUrl={thumbUrl}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-[#0B1E3A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1 bg-white text-[#193C8D] text-[9px] font-black rounded-full uppercase shadow-xl">
                        Quick View
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-black text-[#193C8D] uppercase bg-[#193C8D]/5 px-1.5 py-0.5 rounded tracking-tighter">
                    {doc.sector || "Tax Resource"}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold">
                    {doc.year}
                  </span>
                </div>
                
                {/* FIX: Removed target="_blank" for PowerBI 
                   This keeps the user within the site frame.
                */}
                <Link href={doc.url} className="block mb-4">
                  <h3 className="text-[14px] font-bold text-[#0B1E3A] line-clamp-2 leading-tight group-hover:text-[#193C8D] transition-colors">
                    {doc.title}
                  </h3>
                </Link>

                {/* Action Area */}
                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                  {isPowerBI ? (
                     <Link
                      href={`/resources/${doc.id}`}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#193C8D] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#E7B947] hover:text-[#193C8D] transition-all active:scale-95"
                    >
                      Analyze Report <ArrowUpRight size={14} />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href={doc.url}
                        target="_blank"
                        className="text-[10px] font-black text-[#193C8D] hover:text-[#E7B947] uppercase tracking-tighter transition-colors"
                      >
                        Read Online
                      </Link>
                      <Link
                        href={`${doc.url}?mode=download`}
                        className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-[#193C8D] uppercase tracking-tighter transition-colors"
                        download
                      >
                        <DownloadIcon size={12} /> Download
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
