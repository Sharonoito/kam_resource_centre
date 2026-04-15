import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ArrowRight, X, FileText, Database, BarChart3 } from "lucide-react";
import PowerBiEmbed from "@/components/PowerBiEmbed";
// FIX: Ensure both constants are imported to resolve build errors
import { HS_SECTORS_ONLY, HS_SECTIONS } from "@/types/sectors";

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

/**
 * Fetches aggregated trade stats from the ICMS master table
 */
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
      totalValue: Number(stats._sum.fob_value) || 0,
      declarations: stats._count.id || 0,
    };
  } catch (error) {
    console.error("Error fetching section stats:", error);
    return { totalValue: 0, declarations: 0 };
  }
}

/**
 * Resolves the HS section data from the slug
 */
const getHsSection = (sectionSlug: string) => {
  const key = sectionSlug.toUpperCase() as keyof typeof HS_SECTIONS;
  const sectionsArray = Object.values(HS_SECTIONS) as any[];
  
  return HS_SECTIONS[key] || sectionsArray.find(s => 
    s.name.toLowerCase().includes(sectionSlug.toLowerCase()) || 
    (s.path && s.path.toLowerCase().includes(sectionSlug.toLowerCase()))
  );
};

/**
 * Generates specific report listings for the given section
 */
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
  // NEXT 15 FIX: Await params and searchParams
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const { slug: sectorSlug, sectionSlug } = resolvedParams;
  const { view, type, report } = resolvedSearchParams;

  // Resolve metadata
  const sectorMetadata = (HS_SECTORS_ONLY as any[]).find(s => s.slug === sectorSlug);
  if (!sectorMetadata) notFound();

  const section = getHsSection(sectionSlug);
  if (!section) notFound();

  // Authentication & Authorization
  const session = await getServerSession(authOptions);
  const canViewAll = ["SUPERADMIN", "ADMIN", "MEMBER"].includes(session?.user?.role || "");

  // Filter documents by BOTH sector and section
  const coreName = sectorMetadata.name.replace(" Sector", "").replace(" and Allied", "");
  
  // FIX: Parameterized query for security (replaces string interpolation)
  const documentsRaw = await prisma.$queryRawUnsafe(`
    SELECT * FROM sector.v_documents_admin 
    WHERE is_active = true 
    ${!canViewAll ? 'AND is_published = true' : ''}
    AND LOWER(sector) LIKE $1
    AND (LOWER(sector) LIKE $2 OR LOWER(filename) LIKE $3)
    AND LOWER(sector) != 'general'
    ORDER BY created_at DESC
  `, 
    `%${coreName.toLowerCase()}%`, 
    `%${section.name.toLowerCase()}%`, 
    `%${section.name.split(' ')[0].toLowerCase()}%`
  );
  
  const documents = Array.isArray(documentsRaw) ? documentsRaw : [];

  const reports = getReportsForSection(sectionSlug, section.name, sectorMetadata.name);
  const filteredReports = type ? reports.filter((r) => r.category.toLowerCase() === type.toLowerCase()) : reports;

  const stats = await getSectionStats(section.hsCodeRange || undefined);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Section */}
      <section className={`bg-gradient-to-r from-[${sectorMetadata.color}] to-[#193C8D] pt-12 pb-20 text-white relative`}>
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
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mt-2 font-bold">
                {section.id}
              </div>

              <div>
                <p className="text-yellow-300 uppercase text-xs mb-4 font-black tracking-wider">
                  {sectorMetadata.name} • Section {section.id}
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">{section.name}</h1>
                <p className="text-blue-100 max-w-2xl text-lg leading-relaxed">{section.description}</p>
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-xl text-right min-w-[200px] backdrop-blur-sm border border-white/10">
              <p className="text-white/70 text-sm font-medium mb-1">Trade Value</p>
              <p className="font-black text-2xl lg:text-3xl">
                KES {Math.round(stats.totalValue / 1e6).toLocaleString()}M
              </p>
              <p className="text-xs text-white/50 mt-1 font-medium">
                {stats.declarations.toLocaleString()} Declarations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-6 py-16 lg:py-24 -mt-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          
          {/* EMBED VIEW: Displaying PowerBI or Reports */}
          {view === "report" ? (
            <div className="p-8 lg:p-12">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="text-3xl font-black text-[#0B1E3A]">
                    {reports.find(r => r.id === report)?.title || `${section.name} Dashboard`}
                  </h2>
                  <p className="text-gray-500 mt-1 text-sm">Interactive Analysis • Updated {new Date().getFullYear()}</p>
                </div>
                <Link
                  href={`/sectors/${sectorSlug}/sections/${sectionSlug}`}
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  Close View
                </Link>
              </div>

              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                <PowerBiEmbed
                  reportUrl={sectionSlug.includes('livestock') ? LIVESTOCK_EMBED_URL : BASE_EMBED_URL}
                  pageName="5174b7720480096b117c"
                  title={`${section.name} Analytics`}
                  height="850px"
                />
              </div>
            </div>
          ) : (
            <>
              {/* LISTING VIEW: Tabs and Grid */}
              <div className="p-8 lg:p-12">
                
                {/* Navigation Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                  <div className="flex flex-wrap gap-3">
                    <Link 
                      href={`/sectors/${sectorSlug}/sections/${sectionSlug}`}
                      className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${!type ? 'bg-[#E7B947] text-[#193C8D] shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      All Analytics
                    </Link>
                    {['Import', 'Export', 'Tax', 'Report'].map((tab) => (
                      <Link 
                        key={tab}
                        href={`/sectors/${sectorSlug}/sections/${sectionSlug}?type=${tab}`}
                        className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 border-2 transition-all ${type === tab ? 'bg-[#E7B947] text-[#193C8D] border-[#E7B947] shadow-md' : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-white'}`}
                      >
                        {tab}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="text-sm font-bold text-gray-400">
                    Showing {filteredReports.length} results
                  </div>
                </div>

                {/* Primary Reports Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-20">
                  {filteredReports.map((reportItem) => (
                    <div 
                      key={reportItem.id} 
                      className="group relative bg-white p-8 lg:p-10 rounded-2xl border border-gray-100 hover:shadow-2xl hover:border-[#E7B947]/30 transition-all duration-500"
                    >
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${
                              reportItem.type === 'powerbi' ? 'bg-blue-50 text-blue-600' : 
                              reportItem.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                            }`}>
                              {reportItem.type === 'powerbi' && <BarChart3 className="w-6 h-6" />}
                              {reportItem.type === 'pdf' && <FileText className="w-6 h-6" />}
                              {reportItem.type === 'database' && <Database className="w-6 h-6" />}
                            </div>
                            <div>
                              <span className="block uppercase text-[10px] font-black tracking-[0.1em] text-gray-400 mb-1">Category</span>
                              <span className="uppercase text-xs font-black text-[#193C8D] bg-blue-50/50 px-2 py-1 rounded">
                                {reportItem.category}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                             <span className="block uppercase text-[10px] font-black tracking-[0.1em] text-gray-400 mb-1">Updated</span>
                             <span className="text-xs font-bold text-gray-600">{reportItem.date}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-black text-2xl mb-4 text-[#0B1E3A] group-hover:text-[#193C8D] transition-colors line-clamp-2">
                          {reportItem.title}
                        </h3>
                        
                        <p className="text-gray-500 mb-10 flex-1 leading-relaxed line-clamp-3 italic">
                          "{reportItem.excerpt}"
                        </p>
                        
                        <div className="flex items-center gap-4">
                          {reportItem.type === "powerbi" ? (
                            <Link 
                              href={`/sectors/${sectorSlug}/sections/${sectionSlug}?view=report&report=${reportItem.id}`}
                              className="group/btn w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#193C8D] to-[#0B1E3A] text-white font-black rounded-xl hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
                            >
                              Launch Dashboard
                              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          ) : reportItem.type === "pdf" ? (
                            <Link 
                              href={`/resources?type=pdf&search=${section.name}`}
                              className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-red-100 text-red-600 font-black rounded-xl hover:bg-red-50 hover:border-red-200 transition-all duration-300"
                            >
                              Download Report
                              <FileText className="w-5 h-5" />
                            </Link>
                          ) : (
                            <Link 
                              href={`/resources?type=data&search=${section.name}`}
                              className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-green-100 text-green-600 font-black rounded-xl hover:bg-green-50 hover:border-green-200 transition-all duration-300"
                            >
                              Access Raw Data
                              <Database className="w-5 h-5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Secondary Documents Section */}
                <div className="pt-16 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-2xl font-black text-[#0B1E3A] flex items-center gap-3">
                        <FileText className="w-6 h-6 text-[#E7B947]" />
                        Section-Specific Library
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">Official publications and regulatory documents related to {section.name}</p>
                    </div>
                    <Link 
                      href={`/resources?sector=${sectorSlug}&section=${sectionSlug}`} 
                      className="group flex items-center gap-2 text-sm font-black text-[#193C8D] hover:text-[#E7B947] transition-colors"
                    >
                      Browse Full Library
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  {documents.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {documents.slice(0, 9).map((doc: any) => (
                        <div 
                          key={doc.id} 
                          className="bg-gray-50/50 hover:bg-white rounded-2xl p-6 border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300 group"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-100 text-red-500">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="px-2 py-1 bg-white text-[10px] font-black text-gray-400 rounded border border-gray-100 uppercase">
                              {doc.document_type || 'PDF'}
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-[#0B1E3A] mb-3 line-clamp-2 min-h-[3rem] group-hover:text-[#193C8D] transition-colors">
                            {doc.filename || doc.title}
                          </h4>
                          
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100/50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }) : 'Recently Added'}
                            </span>
                            <a 
                              href={`/api/documents/download/${doc.id}`} 
                              className="text-xs font-black text-[#193C8D] hover:text-[#E7B947] flex items-center gap-1"
                            >
                              Download <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Database className="w-8 h-8 text-gray-300" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-600 mb-2">No documents currently listed</h4>
                      <p className="text-gray-400 max-w-sm mx-auto">Specific reports for this section are being compiled. Please check back later or browse the general {sectorMetadata.name} resources.</p>
                      <Link 
                        href={`/resources?sector=${sectorSlug}`}
                        className="inline-flex mt-8 text-sm font-black text-[#193C8D] hover:underline"
                      >
                        View General Sector Resources
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer Support/Contact CTA */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-[#0B1E3A] rounded-3xl p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-black mb-2">Can't find the specific data you need?</h3>
            <p className="text-blue-200">Our research team can provide custom trade analysis and sector-specific data exports upon request.</p>
          </div>
          <Link 
            href="/contact?subject=Data Request" 
            className="px-10 py-4 bg-[#E7B947] text-[#193C8D] font-black rounded-xl hover:scale-105 transition-all shadow-lg whitespace-nowrap"
          >
            Request Custom Report
          </Link>
        </div>
      </section>
    </div>
  );
}