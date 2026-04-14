import { fetchResearchDocuments } from "@/lib/documents";
import ResearchHubContent from "./ResearchHubContent";
import Link from "next/link";
import { BookOpen, Download as DownloadIcon, ArrowUpRight, BarChart3, Database } from "lucide-react";
import PdfThumbnail from "@/components/PdfThumbnail";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || isNaN(Number(bytes))) return "0 KB";
  const b = Number(bytes);
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default async function ResearchPage() {
  const docs = await fetchResearchDocuments();
  const kamContent = await prisma.kam_content.findMany({
    where: {
      OR: [
        { sector_id: -1 },
        { tags: { contains: "research", mode: "insensitive" } },
        { tags: { contains: "kra", mode: "insensitive" } },
      ],
      is_active: true,
      content_type: { in: ['PDF', 'POWERBI'] },
    },
    orderBy: { created_at: "desc" },
    take: 24, 
  });

  const mergedDocs = [
    ...docs.map((d: any) => ({
      ...d,
      pdfUrl: d.sharepoint_download_url || (d.filename ? `/research/pdfs/${encodeURIComponent(d.filename)}` : null),
      source: 'sharepoint',
    })),
    ...kamContent.map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      sector: "Research Hub",
      document_type: c.content_type === 'POWERBI' ? 'POWERBI' : 'Document',
      year: c.year || 2024,
      file_size_bytes: c.file_size_bytes || 0,
      pdfUrl: c.content_type === 'POWERBI' ? c.powerbi_url : (c.pdf_url || `/uploads/admin/${encodeURIComponent(c.filename)}`),
      source: 'admin',
    })),
  ];

  const seen = new Set();
  const allDocs = mergedDocs.filter((doc: any) => {
    const key = `${doc.id}-${doc.source}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="bg-[#FDFDFD] min-h-screen relative">
      {/* RESEARCH HUB CONTENT / SEARCH BAR 
        Ensure your Search component inside ResearchHubContent uses a lower z-index than the main nav.
      */}
      <div className="relative z-20">
        <ResearchHubContent />
      </div>
      
      {allDocs.length > 0 && (
        <section className="pb-24 pt-4 relative z-10">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#193C8D] rounded flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-[#0B1E3A]">Research Library</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {allDocs.length} Resources Available
              </span>
            </div>

            {/* COMPACT THREE COLUMN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allDocs.map((doc: any, index: number) => {
                const isAdmin = doc.source === 'admin';
                const pdfViewUrl = isAdmin ? doc.pdfUrl : `/api/documents/download/${doc.id}`;
                const pdfDownloadUrl = isAdmin ? doc.pdfUrl : `/api/documents/download/${doc.id}?mode=download`;

                const cardBase = "group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-[#193C8D]/30 hover:shadow-xl transition-all duration-300 overflow-hidden h-full";

                if (doc.document_type === 'POWERBI') {
                  return (
                    <div key={`${doc.id}-${index}`} className={cardBase}>
                      {/* POWER BI HERO PLACEHOLDER */}
                      <div className="relative h-32 bg-gradient-to-br from-[#193C8D] to-[#0B1E3A] flex flex-col items-center justify-center overflow-hidden">
                        {/* Decorative Background Icon */}
                        <Database className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
                        
                        {/* Main Hero Icon */}
                        <div className="relative z-10 w-12 h-12 bg-[#E7B947] rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                          <BarChart3 className="w-7 h-7 text-[#193C8D]" />
                        </div>
                        
                        <div className="absolute top-3 right-3 bg-[#E7B947] text-[#193C8D] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          Live Insights
                        </div>
                      </div>
                      
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold text-[#193C8D] uppercase tracking-tight">Interactive Dashboard</span>
                          <span className="text-[9px] font-mono text-slate-300 font-bold ml-auto">{doc.year}</span>
                        </div>
                        <h4 className="text-[14px] font-bold text-[#0B1E3A] mb-4 line-clamp-2 leading-tight group-hover:text-[#193C8D] transition-colors">
                          {doc.title}
                        </h4>
                        
                        <div className="mt-auto">
                          <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" 
                             className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#193C8D] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#E7B947] hover:text-[#193C8D] transition-all shadow-md active:scale-95">
                            Launch Analytics <ArrowUpRight size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={`${doc.id}-${index}`} className={cardBase}>
                    {/* Compact Wide PDF Preview */}
                    <div className="relative h-32 overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                      {pdfViewUrl ? (
                         <PdfThumbnail pdfUrl={pdfViewUrl} className="w-full h-full object-cover object-top" delay={index * 50} />
                      ) : (
                        <BookOpen size={32} className="text-slate-200" />
                      )}
                      <div className="absolute inset-0 bg-[#0B1E3A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="px-3 py-1 bg-white text-[#193C8D] text-[9px] font-black rounded-full uppercase shadow-xl">Quick Read</span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black text-[#193C8D] uppercase bg-[#193C8D]/5 px-1.5 py-0.5 rounded">
                          {doc.sector || "Research"}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 font-bold ml-auto">{doc.year}</span>
                      </div>
                      
                      <Link href={pdfViewUrl} target="_blank" className="block mb-4">
                        <h4 className="text-[14px] font-bold text-[#0B1E3A] line-clamp-2 leading-tight group-hover:text-[#193C8D] transition-all">
                          {doc.title}
                        </h4>
                      </Link>
                      
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50">
                        <Link href={pdfViewUrl} target="_blank" className="text-[10px] font-black text-[#193C8D] hover:text-[#E7B947] uppercase tracking-tighter transition-colors">
                          View Online
                        </Link>
                        <Link href={pdfDownloadUrl} download className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-[#193C8D] uppercase tracking-tighter transition-colors">
                          <DownloadIcon size={12} /> {formatBytes(doc.file_size_bytes)}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Simplified Bottom Bar */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4">
              <span className="w-8 h-[1px] bg-slate-200"></span>
              KAM Research Hub 2026
              <span className="w-8 h-[1px] bg-slate-200"></span>
            </p>
        </div>
      </footer>
    </div>
  );
}