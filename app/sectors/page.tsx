import Link from "next/link";
import { Prisma } from "@prisma/client";
import { BarChart3 } from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { KAM_SECTORS, HsSection } from "@/types/sectors";

export const dynamic = "force-dynamic";

/**
 * Fetches the minimal doc set (id + sector tag) needed to count resources
 * per KAM sector using the same OR logic as the detail page.
 */
async function getAllDocuments(canViewAll: boolean) {
  try {
    return await prisma.$queryRaw<Array<{ id: number; sector: string | null }>>`
      SELECT id, sector
      FROM sector.v_documents_admin
      WHERE is_active = TRUE
      ${canViewAll ? Prisma.empty : Prisma.sql`AND is_published = TRUE`}
    `;
  } catch (error) {
    console.error("Error fetching documents from Prisma:", error);
    return [];
  }
}

async function getGlobalPowerBiReports() {
  return prisma.kam_content.findMany({
    where: {
      content_type: 'POWERBI',
      sector_id: null,
      is_active: true,
      NOT: { tags: 'macro' },
    },
    select: { id: true, title: true, description: true, powerbi_embed: true },
    orderBy: { id: 'asc' },
  });
}

export default async function SectorsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "PUBLIC";
  const canViewAll =
    role === "SUPERADMIN" ||
    role === "ADMIN" ||
    role === "MEMBER";

  const allDocs = await getAllDocuments(canViewAll);
  const globalReports = await getGlobalPowerBiReports();

  // Count resources per sector using the same OR logic as the detail page:
  //   sector column == KAM sector name  OR  sector column == any sectionsData name
  // All comparisons are case-insensitive.
  const displaySectors = KAM_SECTORS.map(kSector => {
    const sectorTerms = new Set([
      kSector.name.toLowerCase(),
      ...kSector.sectionsData.map((sec: HsSection) => sec.name.toLowerCase()),
    ]);

    const count = allDocs.filter(doc => {
      const tag = (doc.sector ?? "").toLowerCase();
      // Exact match first; fall back to substring so legacy short names (e.g.
      // "Agriculture") still map to the parent sector.
      return sectorTerms.has(tag) || Array.from(sectorTerms).some(term => tag.includes(term) || term.includes(tag));
    }).length;

    return { ...kSector, count };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#193C8D] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/african-pattern.png')]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Kenya's Industrial Sectors
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Explore KAM's 13 manufacturing sectors. Access sector-specific reports, 
              trade intelligence, and HS Code classifications.
            </p>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySectors.map((sector) => (
              <Link
                key={sector.id}
                href={`/sectors/${sector.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#E7B947]"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${sector.color}15` }}
                  >
                    {sector.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Sector {sector.id.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-bold py-0.5 px-2 rounded-full bg-gray-100 text-gray-500">
                            HS {sector.hsChapters}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0B1E3A] group-hover:text-[#193C8D] transition-colors mb-2">
                      {sector.name}
                    </h3>
                    
                    {/* HS Sections Preview */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {sector.sectionsData.slice(0, 3).map((sec: HsSection) => (
                            <span key={sec.id} className="text-[9px] font-medium text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded font-mono">
                                {sec.id}
                            </span>
                        ))}
                        {sector.sectionsData.length > 3 && (
                            <span className="text-[9px] font-medium text-gray-300 border border-gray-100 px-1.5 py-0.5 rounded">
                                +{sector.sectionsData.length - 3}
                            </span>
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sector.color }} />
                        {sector.count} Resources
                      </span>
                      <span className="text-[#193C8D] font-bold group-hover:text-[#E7B947] transition-colors flex items-center gap-1">
                        Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Global Power BI Reports */}
      {globalReports.length > 0 && (
        <section className="py-16 bg-[#0B1E3A]">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <span className="text-[10px] font-black text-[#E7B947] uppercase tracking-widest">Power BI Dashboards</span>
              <h2 className="text-2xl font-bold text-white mt-1">Manufacturing Exports Intelligence</h2>
              <p className="text-sm text-blue-200/60 mt-1">Interactive dashboards covering all KAM sectors</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {globalReports.map((report) => (
                <div key={report.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#E7B947]/40 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#E7B947]/10 rounded-xl shrink-0">
                      <BarChart3 className="w-6 h-6 text-[#E7B947]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm mb-1">{report.title}</h3>
                      {report.description && (
                        <p className="text-xs text-blue-200/50 mb-4 line-clamp-2">{report.description}</p>
                      )}
                      <Link
                        href={`/sectors/report/${report.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#E7B947] text-[#0B1E3A] text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-yellow-300 transition-colors"
                      >
                        <BarChart3 className="w-3 h-3" /> View Report
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Summary Stats */}
      <section className="py-12 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-around gap-8 text-center">
            <div>
              <p className="text-4xl font-black text-[#E7B947]">{displaySectors.length}</p>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Active Sectors</p>
            </div>
            <div className="w-px h-12 bg-zinc-100 hidden md:block" />
            <div>
              <p className="text-4xl font-black text-[#193C8D]">
                {displaySectors.reduce((acc, s) => acc + s.count, 0)}
              </p>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Total Resources</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

