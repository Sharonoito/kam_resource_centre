import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ArrowRight, X, FileText, Database, BarChart3 } from "lucide-react";
import PowerBiEmbed from "@/components/PowerBiEmbed";
import { KAM_SECTORS, HS_SECTIONS, getSectionSlug } from "@/types/sectors";
import { fetchSectorDocuments } from "@/lib/documents";

interface Props {
  params: Promise<{ slug: string; sectionSlug: string }>; // sector-slug/section-slug
  searchParams: Promise<{ view?: string; type?: string; report?: string }>;
}


interface ReportListing {
  id: string;
  title: string;
  excerpt: string;
  type: "powerbi" | "pdf" | "database";
  category: string;
  date: string;
  image?: string;
  embedUrl?: string;
  pageName?: string;
}

const BASE_EMBED_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9";

const LIVESTOCK_EMBED_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiNzk2OWU2OTUtODFiYS00ZTY2LWFlNGQtOTE1NTM3MDlhNTdlIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9";

async function getSectionStats(hsCodeRange?: string) {
  try {
    if (!hsCodeRange) return { totalValue: 0, declarations: 0 };
    const [start, end] = hsCodeRange.split("-").map(Number);
    const stats = await prisma.icms_master.aggregate({
      _sum: { fob_value: true },
      _count: { id: true },
      where: {
        hscode: {
          gte: `${start.toString().padStart(2, "0")}`,
          lte: `${(end ?? start).toString().padStart(2, "0")}`,
        },
      },
    });
    return {
      totalValue: stats._sum.fob_value || 0,
      declarations: stats._count.id || 0,
    };
  } catch {
    return { totalValue: 0, declarations: 0 };
  }
}

const getHsSection = (sectionSlug: string) => {
  return Object.values(HS_SECTIONS).find(s => getSectionSlug(s.path) === sectionSlug);
};

const getReportsForSection = (sectionSlug: string, sectionName: string, sectorName: string): ReportListing[] => {
  return [
    {
      id: `${sectionSlug}-analytics`,
      title: `${sectionName} - Trade Analytics Dashboard`,
      excerpt: `Interactive dashboard with trade flows, HS code performance, and ${sectorName} sector insights.`,
      type: "powerbi",
      category: "Overview",
      date: "Live Data",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    },
    {
      id: `${sectionSlug}-imports`,
      title: `${sectionName} - Import Trends`,
      excerpt: "Detailed import analytics including top suppliers, growth rates, and product performance.",
      type: "powerbi",
      category: "Import",
      date: "Live Data",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    },
    {
      id: `${sectionSlug}-exports`,
      title: `${sectionName} - Export Performance`,
      excerpt: "Export destination analysis, volume trends, and market share data.",
      type: "powerbi",
      category: "Export",
      date: "Live Data",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&h=300&fit=crop",
    },
    {
      id: `${sectionSlug}-report`,
      title: `${sectionName} Sector Report`,
      excerpt: `Latest ${sectorName} sub-sector analysis and trade performance review.`,
      type: "pdf",
      category: "Report",
      date: "2025",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=300&fit=crop",
    },
    {
      id: `${sectionSlug}-database`,
      title: `${sectionName} - Raw Trade Data`,
      excerpt: "Access full customs declarations dataset for detailed analysis.",
      type: "database",
      category: "Data",
      date: "Live Data",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66ca85?w=500&h=300&fit=crop",
    },
  ];
};

export default async function SectionDetailPage({
  params,
  searchParams,
}: Props) {
  const resolvedParams = await params;
  const { slug: sectorSlug, sectionSlug } = resolvedParams;
  const { view, type, report } = await searchParams;

  const sectorMetadata = KAM_SECTORS.find(s => s.slug === sectorSlug);
  if (!sectorMetadata) notFound();

  const section = getHsSection(sectionSlug);
  if (!section) notFound();


  const session = await getServerSession(authOptions);
  const canViewAll = ["SUPERADMIN", "ADMIN", "MEMBER"].includes(session?.user?.role || "");

  // Filter documents by BOTH sector and section
  const coreName = sectorMetadata.name.replace(" Sector", "").replace(" and Allied", "");
  const publishedFilter = !canViewAll ? ' AND is_published = true' : '';
  const documentsRaw = await prisma.$queryRawUnsafe(`
    SELECT * FROM sector.v_documents_admin 
    WHERE is_active = true${publishedFilter}
      AND LOWER(sector) LIKE '%${coreName}%'
      AND (LOWER(sector) LIKE '%${section.name.toLowerCase()}%' OR LOWER(filename) LIKE '%${section.name.split(' ')[0].toLowerCase()}%')
      AND LOWER(sector) != 'general'
    ORDER BY created_at DESC
  `);
  const documents = Array.isArray(documentsRaw) ? documentsRaw : [];

  const reports = getReportsForSection(sectionSlug, section.name, sectorMetadata.name);
  const filteredReports = type ? reports.filter((r) => r.category.toLowerCase() === type.toLowerCase()) : reports;

  const stats = await getSectionStats(section.hsCodeRange || undefined);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="bg-gradient-to-r from-[${sectorMetadata.color}] to-[#193C8D] pt-12 pb-20 text-white relative">
        <div className="container mx-auto px-6">
          <Link
            href={`/sectors/${sectorSlug}`}
            className="opacity-70 hover:opacity-100 flex items-center gap-2 text-sm mb-8 transition"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to {sectorMetadata.name}
          </Link>

          <div className="flex justify-between items-end gap-8">
            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mt-2">
                {section.id}
              </div>

              <div>
                <p className="text-yellow-300 uppercase text-xs mb-4 font-black tracking-wider">
                  {sectorMetadata.name} • Section {section.id}
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">{section.name}</h1>
                <p className="text-blue-100 max-w-2xl text-lg">{section.description}</p>
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-xl text-right min-w-[180px]">
              <p className="text-white/70 text-sm font-medium">Trade Value</p>
              <p className="font-black text-2xl lg:text-3xl">
                KES {Math.round(Number(stats.totalValue) / 1e6)}M
              </p>
              <p className="text-xs text-white/50">{stats.declarations.toLocaleString()} Declarations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 lg:py-24 -mt-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {view === "report" ? (
            <div className="p-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-[#0B1E3A]">
                  {reports.find(r => r.id === report)?.title || `${section.name} Dashboard`}
                </h2>
                <Link
                  href={`/sectors/${sectorSlug}/sections/${sectionSlug}`}
                  className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                  Close
                </Link>
              </div>

              <PowerBiEmbed
                reportUrl={BASE_EMBED_URL}
                pageName="5174b7720480096b117c" // Default page
                title={`${section.name} Analytics`}
                height="900px"
              />
            </div>
          ) : (
            <>
              <div className="p-8 lg:p-12 border-b border-gray-100">
                <div className="flex flex-wrap gap-3 mb-12">
                  <Link 
                    href={`/sectors/${sectorSlug}/sections/${sectionSlug}`}
                    className="px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 bg-[#E7B947]/90 hover:bg-[#E7B947] text-[#193C8D] shadow-lg hover:shadow-xl transition-all"
                  >
                    <BarChart3 className="w-4 h-4" />
                    All Analytics
                  </Link>
                  <Link 
                    href={`/sectors/${sectorSlug}/sections/${sectionSlug}?type=Import`}
                    className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 border-2 border-gray-200 hover:bg-white transition-all ${type === 'Import' ? 'bg-[#E7B947] text-[#193C8D] border-[#E7B947]' : ''}`}
                  >Import</Link>
                  <Link 
                    href={`/sectors/${sectorSlug}/sections/${sectionSlug}?type=Export`}
                    className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 border-2 border-gray-200 hover:bg-white transition-all ${type === 'Export' ? 'bg-[#E7B947] text-[#193C8D] border-[#E7B947]' : ''}`}
                  >Export</Link>
                  <Link 
                    href={`/sectors/${sectorSlug}/sections/${sectionSlug}?type=Tax`}
                    className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 border-2 border-gray-200 hover:bg-white transition-all ${type === 'Tax' ? 'bg-[#E7B947] text-[#193C8D] border-[#E7B947]' : ''}`}
                  >Tax</Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {filteredReports.map((reportItem) => (
                    <div key={reportItem.id} className="group bg-gradient-to-br from-gray-50 to-white p-8 lg:p-12 rounded-2xl border border-gray-100 hover:shadow-2xl hover:border-[#E7B947]/50 transition-all duration-500 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#${sectorMetadata.color}]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                          {reportItem.type === 'powerbi' && <BarChart3 className="w-6 h-6 text-blue-600" />}
                          {reportItem.type === 'pdf' && <FileText className="w-6 h-6 text-red-600" />}
                          {reportItem.type === 'database' && <Database className="w-6 h-6 text-green-600" />}
                          <span className="uppercase text-xs font-bold bg-gray-100 px-3 py-1 rounded-full tracking-wider">
                            {reportItem.category}
                          </span>
                        </div>
                        
                        <h3 className="font-black text-2xl mb-4 text-[#0B1E3A] leading-tight line-clamp-2">
                          {reportItem.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-8 flex-1 leading-relaxed line-clamp-3">
                          {reportItem.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100 mt-auto">
                          <div className="text-xs text-gray-500">
                            Updated: <span className="font-semibold">{reportItem.date}</span>
                          </div>
                          {reportItem.type === "powerbi" ? (
                            <Link 
                              href={`/sectors/${sectorSlug}/sections/${sectionSlug}?view=report&report=${reportItem.id}`}
                              className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#193C8D] to-[#0B1E3A] text-white font-black rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
                            >
                              Launch Dashboard
                              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          ) : reportItem.type === "pdf" ? (
                            <Link 
                              href={`/sectors/${sectorSlug}/sections/${sectionSlug}/pdf/${reportItem.id}`}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-black rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                              Download Report
                              <FileText className="w-4 h-4" />
                            </Link>
                          ) : (
                            <Link 
                              href={`/sectors/${sectorSlug}/sections/${sectionSlug}/data/${reportItem.id}`}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-black rounded-xl hover:shadow-lg transition-all duration-300 uppercase tracking-wide text-sm"
                            >
                              Access Data
                              <Database className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Documents Grid */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-[#0B1E3A]">
                        {documents.length} Section-Specific Documents
                      </h3>
                      <Link href={`/resources?sector=${sectorSlug}&section=${sectionSlug}`} className="text-sm font-bold text-[#E7B947] hover:underline">
                        View All →
                      </Link>
                    </div>
                    
                    {documents.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.slice(0, 6).map((doc: any) => (
                          <div key={doc.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all">
                            <div className="flex items-start gap-3 mb-4">
                              <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded uppercase">
                                {doc.document_type || 'PDF'}
                              </span>
                              <span className="ml-auto text-xs text-gray-400">
                                {doc.created_at?.split('T')[0] || 'Recent'}
                              </span>
                            </div>
                            <h4 className="font-semibold text-[#0B1E3A] mb-2 line-clamp-2">{doc.filename || doc.title}</h4>
                            {doc.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{doc.description}</p>
                            )}
                            <div className="flex gap-3">
                              <Link href={`/resources/${doc.id}`} className="text-xs text-blue-600 hover:underline flex-1">
                                View Details
                              </Link>
                              <a href={`/api/documents/download/${doc.id}`} className="text-xs font-bold text-[#193C8D] hover:text-[#E7B947]">
                                Download →
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-gray-600 mb-2">No documents yet</h4>
                        <p className="text-gray-500">Check back soon for {section.name.toLowerCase()} reports and publications.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

