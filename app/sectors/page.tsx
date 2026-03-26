import Link from "next/link";
import { Prisma } from "@prisma/client";
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

export default async function SectorsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "PUBLIC";
  const accessTier = session?.user?.accessTier ?? "PUBLIC_FREE_ONLY";
  const canViewAll =
    role === "SUPERADMIN" ||
    role === "ADMIN" ||
    role === "MEMBER" ||
    accessTier === "PUBLIC_FULL";

  const allDocs = await getAllDocuments(canViewAll);

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


// import Link from "next/link";
// import prisma from "@/lib/prisma";

// // Static generation for better performance
// export const dynamic = "force-dynamic";

// async function getSectors() {
//   try {
//     const sectors = await prisma.kam_sector.findMany({
//       where: { is_active: true },
//       include: {
//         _count: {
//           select: {
//             contents: {
//               where: { is_active: true }
//             }
//           }
//         }
//       },
//       orderBy: { sort_order: "asc" }
//     });
//     return sectors;
//   } catch (error) {
//     console.error("Error fetching sectors:", error);
//     return [];
//   }
// }

// export default async function SectorsPage() {
//   const sectors = await getSectors();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section className="bg-[#193C8D] text-white py-20 relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/african-pattern.png')]" />
//         </div>
//         <div className="container mx-auto px-6 relative z-10">
//           <div className="max-w-3xl">
//             <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
//               Kenya&apos;s Industrial Sectors
//             </h1>
//             <p className="text-xl text-gray-300 leading-relaxed">
//               Explore KAM&apos;s 13 manufacturing sectors. Access sector-specific reports, 
//               Power BI analytics, and trade data to drive your business decisions.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Sectors Grid */}
//       <section className="py-16">
//         <div className="container mx-auto px-6">
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {sectors.map((sector: { id: number; slug: string; icon?: string | null; color?: string | null; name: string; description?: string | null; _count: { contents: number } }) => (
//               <Link
//                 key={sector.id}
//                 href={`/sectors/${sector.slug}`}
//                 className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
//               >
//                 <div className="flex items-start gap-4">
//                   <div 
//                     className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
//                     style={{ backgroundColor: `${sector.color}20` }}
//                   >
//                     {sector.icon}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-lg font-bold text-[#0B1E3A] group-hover:text-[#E7B947] transition-colors mb-2">
//                       {sector.name}
//                     </h3>
//                     <p className="text-sm text-gray-600 line-clamp-2">
//                       {sector.description}
//                     </p>
//                     <div className="mt-4 flex items-center gap-4 text-xs">
//                       <span className="flex items-center gap-1 text-gray-500">
//                         <span className="w-2 h-2 rounded-full bg-[#E7B947]" />
//                         {sector._count.contents} Resources
//                       </span>
//                       <span className="text-[#193C8D] font-medium group-hover:translate-x-1 transition-transform">
//                         View Sector →
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Quick Stats */}
//       <section className="py-12 bg-white border-t">
//         <div className="container mx-auto px-6">
//           <div className="grid md:grid-cols-4 gap-8 text-center">
//             <div>
//               <p className="text-3xl font-bold text-[#E7B947]">{sectors.length}</p>
//               <p className="text-sm text-gray-600 mt-1">Active Sectors</p>
//             </div>
//             <div>
//               <p className="text-3xl font-bold text-[#193C8D]">
//                 {sectors.reduce((acc: number, s: { _count: { contents: number } }) => acc + s._count.contents, 0)}
//               </p>
//               <p className="text-sm text-gray-600 mt-1">Total Resources</p>
//             </div>
//             <div>
//               <p className="text-3xl font-bold text-[#E7B947]">PDF</p>
//               <p className="text-sm text-gray-600 mt-1">Reports Available</p>
//             </div>
//             <div>
//               <p className="text-3xl font-bold text-[#193C8D]">Power BI</p>
//               <p className="text-sm text-gray-600 mt-1">Interactive Dashboards</p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

