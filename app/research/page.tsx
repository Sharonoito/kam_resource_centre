import { fetchResearchDocuments } from "@/lib/documents";
import ResearchHubContent from "./ResearchHubContent";
import Link from "next/link";
import { BookOpen, Download as DownloadIcon, ArrowUpRight } from "lucide-react";
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
    take: 20,
  });

  // Normalize and merge
  // Merge and deduplicate by id+source
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
  // Deduplicate by id+source
  const seen = new Set();
  const allDocs = mergedDocs.filter((doc: any) => {
    const key = `${doc.id}-${doc.source}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="bg-[#FDFDFD] min-h-screen">
      <ResearchHubContent />
      
      {allDocs.length > 0 && (
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
                {allDocs.length} RESOURCES
              </span>
            </div>

            {/* Document Rows */}
            <div className="space-y-6">
              {allDocs.map((doc: any, index: number) => {
                if (doc.document_type === 'POWERBI') {
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
                          style={{ filter: 'drop-shadow(0 1px 2px #E7B94722)' }}
                        />
                        <div className="absolute top-2 right-2 bg-yellow-400 text-[#193C8D] text-[9px] font-black px-2 py-0.5 rounded uppercase shadow">LIVE</div>
                      </div>
                      {/* Info Column */}
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold text-yellow-700 uppercase bg-yellow-50 px-2.5 py-1 rounded border border-yellow-200">
                            Analytics Dashboard
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Ref: {doc.year || '2026'}
                          </span>
                        </div>
                        <a
                          href={doc.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-bold text-[#0B1E3A] hover:text-yellow-600 transition-colors mb-3 block leading-snug"
                        >
                          {doc.title}
                        </a>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium italic">
                          Interactive PowerBI analytics for research and policy insights.
                        </p>
                        <div className="mt-auto flex items-center gap-8 pt-4 border-t border-slate-50">
                          <a
                            href={doc.pdfUrl}
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
                // PDF/Document fallback (existing UI)
                // Use direct file link for admin uploads, download API for legacy
                const isAdmin = doc.source === 'admin';
                const pdfViewUrl = isAdmin ? doc.pdfUrl : `/api/documents/download/${doc.id}`;
                const pdfDownloadUrl = isAdmin ? doc.pdfUrl : `/api/documents/download/${doc.id}?mode=download`;
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
                        delay={index * 150}
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
                          {doc.sector || "General Industry"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Ref: {doc.year || '2026'}
                        </span>
                      </div>
                      <Link
                        href={pdfViewUrl}
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

