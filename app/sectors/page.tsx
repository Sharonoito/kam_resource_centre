import Link from "next/link";
import { Prisma } from "@prisma/client";
import { 
  BarChart3, Search, ChevronRight, Info, 
  Layers, ArrowUpRight, BookOpen, Database, 
  FileCheck, ShieldCheck 
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ALL_SECTORS, HsSection, mapDbSectorToId } from "@/types/sectors";

export const dynamic = "force-dynamic";

async function getAllDocuments(canViewAll: boolean) {
  try {
    return await prisma.$queryRaw<Array<{ id: number; sector: string | null }>>`
      SELECT id, sector
      FROM sector.resource_documents
      WHERE is_active = TRUE
      ${canViewAll ? Prisma.empty : Prisma.sql`AND is_published = TRUE`}
    `;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

async function getSessionSafe() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    return null;
  }
}

async function getGlobalPowerBiReports() {
  try {
    return await prisma.kam_content.findMany({
      where: { 
        content_type: "POWERBI", 
        OR: [{ sector_id: null }, { sector_id: -1 }],
        is_active: true 
      },
      select: { id: true, title: true, description: true },
      orderBy: { id: "asc" },
    });
  } catch (error) {
    return [];
  }
}

export default async function SectorsPage() {
  const session = await getSessionSafe();
  const role = session?.user?.role ?? "PUBLIC";
  const canViewAll = ["SUPERADMIN", "ADMIN", "MEMBER"].includes(role);

  const allDocs = await getAllDocuments(canViewAll);
  const globalReports = await getGlobalPowerBiReports();

  // Filter and map only to actual Manufacturing Sectors
  const displaySectors = ALL_SECTORS
    .filter(s => s.id > 0) // Removes internal/special hubs
    .map(sector => ({
      ...sector,
      count: allDocs.filter(doc => mapDbSectorToId(doc.sector) === sector.id).length
    }));

  const totalResources = displaySectors.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-[#193C8D] selection:text-white" suppressHydrationWarning>
      
      {/* INDUSTRIAL HEADER */}
      <header className="bg-[#193C8D] text-white relative overflow-hidden">
        {/* Architectural Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <Layers className="w-3 h-3 text-[#E7B947]" /> Industrial Intelligence Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
              Sector <span className="text-[#E7B947]">Resource</span> Centre
            </h1>
            <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
              Kenya&apos;s primary repository for manufacturing trade data, technical standards, and cross-border intelligence.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-t border-white/10 bg-black/10 backdrop-blur-md">
          <div className="container mx-auto px-6 py-6 flex flex-wrap gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-blue-300/60 mb-1 text-center">Active Resources</span>
              <span className="text-2xl font-mono font-bold text-[#E7B947]">{totalResources.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-blue-300/60 mb-1 text-center">Live Dashboards</span>
              <span className="text-2xl font-mono font-bold">{globalReports.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-blue-300/60 mb-1 text-center">Manufacturing Sectors</span>
              <span className="text-2xl font-mono font-bold">{displaySectors.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Database className="w-6 h-6 text-[#193C8D]" /> Sector Repositories
              </h2>
              <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Real-time sync
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {displaySectors.map((sector) => (
                <Link
                  key={sector.id}
                  href={`/sectors/${sector.slug}`}
                  className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#193C8D] transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(25,60,141,0.12)]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      {sector.emoji}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-[#193C8D] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#193C8D]">
                    {sector.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#193C8D] uppercase tracking-tighter bg-blue-50/50 w-fit px-2 py-0.5 rounded border border-blue-100 mb-4">
                    HS Chapters {sector.hsChapters}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6">
                    {sector.sectionsData.map(s => s.name).join(' • ')}
                  </p>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" /> {sector.count} Documents
                    </span>
                    <span className="text-[11px] font-black text-[#193C8D] uppercase opacity-0 group-hover:opacity-100 transition-all">
                      Browse Sector →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="lg:w-[380px] space-y-8">
            {/* Global Intelligence Card */}
            <div className="bg-[#193C8D] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-[#E7B947]/10 transition-colors" />
              
              <h3 className="text-[11px] font-black text-[#E7B947] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Global Intelligence
              </h3>

              <div className="space-y-4">
                {globalReports.map(report => (
                  <Link 
                    key={report.id} 
                    href={`/sectors/report/${report.id}`}
                    className="flex flex-col p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-[#193C8D] transition-all duration-300 group/item"
                  >
                    <span className="text-xs font-bold mb-1">{report.title}</span>
                    <span className="text-[9px] uppercase tracking-widest opacity-60 group-hover/item:text-[#193C8D]">Visual Analytics</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Verification / Security Card */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Directory Guard</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm h-fit">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Verified HS Data</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Classifications are synced with current KRA & WCO standards.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm h-fit">
                    <ShieldCheck className="w-5 h-5 text-[#193C8D]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Secure Protocol</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Document access is limited based on KAM member credentials.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Tip */}
            <div className="flex gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <Info className="w-5 h-5 text-[#193C8D] shrink-0" />
              <p className="text-[11px] text-blue-900/70 leading-relaxed italic">
                Can&apos;t find a specific sector? Ensure your profile is mapped to the correct manufacturing branch in your settings.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer Utility */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 KAM Web Resource Centre | Industrial Intelligence Unit
          </p>
          <div className="flex gap-8 text-[10px] font-black text-[#193C8D] uppercase tracking-widest">
            <Link href="#" className="hover:underline">Documentation</Link>
            <Link href="#" className="hover:underline">Support Hub</Link>
            <Link href="#" className="hover:underline">API Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


// import Link from "next/link";
// import { Prisma } from "@prisma/client";
// import { BarChart3, Search, Filter, BookOpen, ChevronRight, Info } from "lucide-react";
// import prisma from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { ALL_SECTORS, HsSection, mapDbSectorToId } from "@/types/sectors";

// export const dynamic = "force-dynamic";

// async function getAllDocuments(canViewAll: boolean) {
//   try {
//     return await prisma.$queryRaw<Array<{ id: number; sector: string | null }>>`
//       SELECT id, sector
//       FROM sector.resource_documents
//       WHERE is_active = TRUE
//       ${canViewAll ? Prisma.empty : Prisma.sql`AND is_published = TRUE`}
//     `;
//   } catch (error) {
//     console.error("Error fetching documents from Prisma:", error);
//     return [];
//   }
// }

// async function getSessionSafe() {
//   try {
//     return await getServerSession(authOptions);
//   } catch (error) {
//     console.error("Failed to resolve session on sectors page", error);
//     return null;
//   }
// }

// async function getGlobalPowerBiReports() {
//   try {
//     return await prisma.kam_content.findMany({
//       where: { 
//         content_type: "POWERBI", 
//         OR: [
//           { sector_id: null },
//           { sector_id: -1 },
//           { sector_id: -2 }
//         ],
//         is_active: true 
//       },
//       select: { id: true, title: true, description: true },
//       orderBy: { id: "asc" },
//     });
//   } catch (error) {
//     console.error("Error fetching Power BI reports:", error);
//     return [];
//   }
// }

// export default async function SectorsPage() {
//   const session = await getSessionSafe();
//   const role = session?.user?.role ?? "PUBLIC";
//   const canViewAll =
//     role === "SUPERADMIN" ||
//     role === "ADMIN" ||
//     role === "MEMBER";

//   const allDocs = await getAllDocuments(canViewAll);
//   const globalReports = await getGlobalPowerBiReports();

//   const displaySectors = ALL_SECTORS.map(sector => {
//     const count = allDocs.filter(doc => mapDbSectorToId(doc.sector) === sector.id).length;
//     return { ...sector, count };
//   });

//   const totalResources = displaySectors.reduce((acc, s) => acc + s.count, 0);

//   return (
//     // Added suppressHydrationWarning to the root div as a fallback safeguard
//     <div className="min-h-screen bg-white" suppressHydrationWarning>
      
//       {/* Utility Header using Brand Blue #193C8D */}
//       <header className="bg-[#193C8D] text-white border-b border-white/10 relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/african-pattern.png')]" />
//         </div>

//         <div className="container mx-auto px-6 py-12 relative z-10">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
//             <div className="max-w-2xl">
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="bg-[#E7B947] text-[#193C8D] text-[10px] font-black px-2.5 py-1 rounded tracking-wider uppercase">
//                   Resource Hub
//                 </span>
//                 <span className="text-blue-100 text-xs font-medium">Internal Intelligence Portal</span>
//               </div>
//               <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
//                 Sector Resource Centre
//               </h1>
//               <p className="text-blue-50 text-lg leading-relaxed">
//                 Centralized access to trade intelligence, HS Code data, and reports for Kenya&apos;s manufacturing sectors.
//               </p>
//             </div>
            
//             <div className="flex gap-4">
//               <div className="bg-white/5 border border-white/10 p-5 rounded-2xl min-w-[140px] backdrop-blur-sm">
//                 <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest mb-1">Total Resources</p>
//                 <p className="text-3xl font-mono text-[#E7B947] font-bold">{totalResources}</p>
//               </div>
//               <div className="bg-white/5 border border-white/10 p-5 rounded-2xl min-w-[140px] backdrop-blur-sm">
//                 <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest mb-1">Dashboards</p>
//                 <p className="text-3xl font-mono text-white font-bold">{globalReports.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Sticky Quick-Access Strip */}
//       <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
//         <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <div className="flex items-center gap-6 text-[11px] text-gray-600 font-bold uppercase tracking-wider">
//              <span className="flex items-center gap-2"><Search className="w-3.5 h-3.5 text-gray-400"/> Filter Sectors</span>
//              <span className="hidden md:inline text-gray-200">|</span>
//              <span className="hidden md:inline">Showing {displaySectors.length} Active Categories</span>
//           </div>
//           <div className="flex items-center gap-3">
//              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
//              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Database Sync Active</span>
//           </div>
//         </div>
//       </div>

//       <main className="container mx-auto px-6 py-12">
//         <div className="flex flex-col lg:flex-row gap-12">
          
//           {/* Main Library Grid */}
//           <div className="flex-1">
//             <div className="grid md:grid-cols-2 gap-5">
//               {displaySectors.map((sector) => (
//                 <Link
//                   key={sector.id}
//                   href={`/sectors/${sector.slug}`}
//                   // Removed nested interactive elements to ensure clean hydration
//                   className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#193C8D]/20 transition-all duration-300 cursor-pointer"
//                 >
//                   <div className="p-6">
//                     <div className="flex justify-between items-start mb-4">
//                         <div 
//                             className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
//                             style={{ backgroundColor: `${sector.color}15` }} // Slightly more opacity for emoji background
//                         >
//                             {sector.emoji}
//                         </div>
//                         <span className="text-[10px] font-mono font-bold bg-gray-50 text-gray-400 border border-gray-100 px-2 py-1 rounded">
//                           HS {sector.hsChapters}
//                         </span>
//                     </div>
                    
//                     <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#193C8D] transition-colors mb-1">
//                         {sector.name}
//                     </h3>
//                     <p className="text-xs text-gray-500 mb-4 line-clamp-1 italic">
//                         {sector.sectionsData.map(s => s.name).join(' • ')}
//                     </p>

//                     <div className="flex flex-wrap gap-1.5">
//                         {sector.sectionsData.slice(0, 2).map((sec: HsSection) => (
//                             <span key={sec.id} className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
//                                 SEC {sec.id}
//                             </span>
//                         ))}
//                     </div>
//                   </div>
                  
//                   <div className="mt-auto px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between group-hover:bg-[#193C8D]/5 transition-colors">
//                     <span className="text-[#193C8D] text-xs font-black uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
//                       Access Library <ChevronRight className="w-4 h-4" />
//                     </span>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Intelligence Sidebar */}
//           <aside className="lg:w-80 space-y-8">
//             {globalReports.length > 0 && (
//               <div className="bg-[#193C8D] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-[#193C8D]">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                
//                 <div className="relative z-10">
//                   <h3 className="text-xs font-black text-[#E7B947] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
//                     <BarChart3 className="w-4 h-4" /> Global Intelligence
//                   </h3>
//                   <div className="space-y-4">
//                     {globalReports.map(report => (
//                       <Link 
//                         key={report.id} 
//                         href={`/sectors/report/${report.id}`}
//                         className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all"
//                       >
//                         <p className="text-sm font-bold text-white mb-1">{report.title}</p>
//                         <div className="flex items-center justify-between">
//                             <span className="text-[10px] text-blue-100 uppercase font-bold tracking-tighter">Interactive Dashboard</span>
//                             <ChevronRight className="w-3 h-3 text-[#E7B947]" />
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg">
//               <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <Info className="w-4 h-4 text-[#193C8D]" /> Centre Directory
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex gap-3">
//                     <div className="w-1 h-auto bg-[#193C8D]/20 rounded-full" />
//                     <div className="text-xs text-gray-600 leading-relaxed">
//                         <strong className="text-gray-800 block mb-1">Technical Files</strong>
//                         Access HS code classifications and manufacturing standards per sector.
//                     </div>
//                 </div>
//                 <div className="flex gap-3">
//                     <div className="w-1 h-auto bg-[#E7B947]/40 rounded-full" />
//                     <div className="text-xs text-gray-600 leading-relaxed">
//                         <strong className="text-gray-800 block mb-1">Trade Reports</strong>
//                         Published market intelligence and export performance metrics.
//                     </div>
//                 </div>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }