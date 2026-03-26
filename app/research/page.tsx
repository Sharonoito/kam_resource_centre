import { fetchResearchDocuments } from "@/lib/documents";
import ResearchHubContent from "./ResearchHubContent";
import Link from "next/link";
// Renamed the icon import to avoid naming collisions
import { BookOpen, Download as DownloadIcon, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || isNaN(Number(bytes))) return "0 KB";
  const b = Number(bytes);
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default async function ResearchPage() {
  const docs = await fetchResearchDocuments();

  return (
    <div className="bg-[#FDFDFD] min-h-screen">
      <ResearchHubContent />
      
      {docs && docs.length > 0 && (
        <section className="pb-24 pt-4">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#193C8D] rounded-lg flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0B1E3A]">Research Library</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Official Publications & Whitepapers</p>
                </div>
              </div>
              <span className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
                {docs.length} RESOURCES
              </span>
            </div>

            {/* Document Rows */}
            <div className="space-y-6">
              {docs.map((doc: any, index: number) => (
                <div 
                  key={`${doc.id}-${index}`} 
                  className="group flex flex-col md:flex-row gap-8 bg-white p-5 rounded-2xl border border-slate-200 hover:border-yellow-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
                >
                  {/* Preview Box */}
                  <div className="relative shrink-0 w-full md:w-40 aspect-[3/4] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="flex flex-col items-center justify-center h-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                        <FileText className="w-8 h-8 text-[#193C8D]/20 mb-2" />
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">PDF Preview</span>
                    </div>
                    <Link 
                      href={`/api/documents/download/${doc.id}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-[#193C8D]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2"
                    >
                      <BookOpen size={20} />
                      <span className="text-[10px] font-bold uppercase">Read Report</span>
                    </Link>
                  </div>

                  {/* Info Column */}
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold text-[#193C8D] uppercase bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                        {doc.sector || "General Industry"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Ref: {doc.year || '2026'}
                      </span>
                    </div>

                    <Link 
                      href={`/api/documents/download/${doc.id}`}
                      target="_blank"
                      className="text-lg font-bold text-[#0B1E3A] hover:text-[#193C8D] transition-colors mb-3 block leading-snug"
                    >
                      {doc.title}
                    </Link>

                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium italic">
                      Strategic analysis and research findings related to the {doc.sector || "manufacturing"} sector in Kenya.
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-auto flex items-center gap-8 pt-4 border-t border-slate-50">
                      <Link 
                        href={`/api/documents/download/${doc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-black text-[#193C8D] hover:text-yellow-600 transition-colors uppercase tracking-widest"
                      >
                        <BookOpen size={14} /> View Online
                      </Link>

                      <Link 
                        href={`/api/documents/download/${doc.id}?mode=download`}
                        className="flex items-center gap-2 text-xs font-black text-[#193C8D] hover:text-yellow-600 transition-colors uppercase tracking-widest"
                        download
                      >
                        {/* Use the renamed Icon component here */}
                        <DownloadIcon size={14} /> Download ({formatBytes(doc.file_size_bytes)})
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer Infrastructure */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl text-center">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Portal Infrastructure</h3>
            <p className="text-slate-500 text-sm max-w-xl mx-auto italic">
              All data is vetted and synchronized from official KRA, CBK, and KNBS records to ensure accuracy for industrial policy advocacy.
            </p>
        </div>
      </section>
    </div>
  );
}



// import { fetchResearchDocuments } from "@/lib/documents";
// import ResearchHubContent from "./ResearchHubContent";
// import Link from "next/link";
// import { BookOpen, Download, FileText, ChevronRight } from "lucide-react";

// export const dynamic = "force-dynamic";

// // Helper for file sizes
// function formatBytes(bytes: number | null | undefined): string {
//   if (!bytes) return "0 KB";
//   if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
//   return `${(bytes / 1048576).toFixed(1)} MB`;
// }

// export default async function ResearchPage() {
//   const docs = await fetchResearchDocuments();

//   return (
//     <div className="bg-[#FDFDFD] min-h-screen">
//       <ResearchHubContent />
      
//       {docs.length > 0 && (
//         <section className="pb-24 pt-4">
//           <div className="container mx-auto px-6 max-w-7xl">
//             {/* Header for Documents */}
//             <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-[#193C8D] rounded-lg flex items-center justify-center shadow-lg">
//                   <BookOpen className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-[#0B1E3A]">Research Library</h2>
//                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Official Publications & Whitepapers</p>
//                 </div>
//               </div>
//               <span className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
//                 {docs.length} RESOURCES
//               </span>
//             </div>

//             {/* High-Density Row Layout (Same as Trade Hub) */}
//             <div className="space-y-6">
//               {docs.map((doc, index) => (
//                 <div 
//                   key={`${doc.id}-${index}`} 
//                   className="group flex flex-col md:flex-row gap-8 bg-white p-5 rounded-2xl border border-slate-200 hover:border-yellow-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
//                 >
//                   {/* Document Preview (Image Placeholder) */}
//                   <div className="relative shrink-0 w-full md:w-40 aspect-[3/4] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
//                     <div className="flex flex-col items-center justify-center h-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
//                         <FileText className="w-8 h-8 text-[#193C8D]/20 mb-2" />
//                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">PDF Preview</span>
//                     </div>
//                     <Link 
//                       href={`/api/documents/download/${doc.id}`} 
//                       className="absolute inset-0 bg-[#193C8D]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2"
//                     >
//                       <BookOpen size={20} />
//                       <span className="text-[10px] font-bold uppercase">Read Report</span>
//                     </Link>
//                   </div>

//                   {/* Document Info */}
//                   <div className="flex flex-col flex-1 py-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <span className="text-[10px] font-bold text-[#193C8D] uppercase bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
//                         {doc.sector || "General Industry"}
//                       </span>
//                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                         Ref: {doc.year || '2026'}
//                       </span>
//                     </div>

//                     <Link 
//                       href={`/api/documents/download/${doc.id}`}
//                       className="text-lg font-bold text-[#0B1E3A] hover:text-[#193C8D] transition-colors mb-3 block leading-snug"
//                     >
//                       {doc.title}
//                     </Link>

//                     <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium italic">
//                       Strategic analysis and research findings related to the {doc.sector || "manufacturing"} sector in Kenya.
//                     </p>

//                     <div className="mt-auto flex items-center gap-8 pt-4 border-t border-slate-50">
//                       <Link 
//                         href={`/api/documents/download/${doc.id}`}
//                         className="flex items-center gap-2 text-xs font-black text-[#193C8D] hover:text-yellow-600 transition-colors uppercase tracking-widest"
//                       >
//                         <BookOpen size={14} /> View Online
//                       </Link>
//                       <Link 
//                         href={`/api/documents/download/${doc.id}`}
//                         className="flex items-center gap-2 text-xs font-black text-[#193C8D] hover:text-yellow-600 transition-colors uppercase tracking-widest"
//                         download
//                       >
//                         <Download size={14} /> Download
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Infrastructure moved to bottom */}
//       <section className="py-20 bg-slate-50 border-t border-slate-200">
//         <div className="container mx-auto px-6 max-w-7xl text-center">
//             <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Portal Infrastructure</h3>
//             <p className="text-slate-500 text-sm max-w-xl mx-auto italic">
//               All data is vetted and synchronized from official KRA, CBK, and KNBS records to ensure accuracy for industrial policy advocacy.
//             </p>
//         </div>
//       </section>
//     </div>
//   );
// }
