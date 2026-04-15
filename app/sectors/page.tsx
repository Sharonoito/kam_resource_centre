import Link from "next/link";
import { Prisma } from "@prisma/client";
import { 
  BarChart3, ChevronRight, Info, 
  Layers, ArrowUpRight, BookOpen, Database, 
  FileCheck, ShieldCheck 
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ALL_SECTORS, mapDbSectorToId } from "@/types/sectors";

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

  const displaySectors = ALL_SECTORS
    .filter(s => s.id > 0) 
    .map(sector => ({
      ...sector,
      count: allDocs.filter(doc => mapDbSectorToId(doc.sector) === sector.id).length
    }));

  const totalResources = displaySectors.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-[#193C8D] selection:text-white" suppressHydrationWarning>
      
      <header className="bg-[#193C8D] text-white relative overflow-hidden">
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

        <div className="border-t border-white/10 bg-black/10 backdrop-blur-md">
          <div className="container mx-auto px-6 py-6 flex flex-wrap gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-blue-300/60 mb-1">Active Resources</span>
              <span className="text-2xl font-mono font-bold text-[#E7B947]">{totalResources.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-blue-300/60 mb-1">Live Dashboards</span>
              <span className="text-2xl font-mono font-bold">{globalReports.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-blue-300/60 mb-1">Manufacturing Sectors</span>
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
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {displaySectors.map((sector) => {
                // Here is the magic: rendering the Heroicon from the config
                const Icon = sector.icon;

                return (
                  <Link
                    key={sector.id}
                    href={`/sectors/${sector.slug}`}
                    className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#193C8D] transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(25,60,141,0.12)]"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white border border-yellow-400 group-hover:border-yellow-500 transition-colors">
                         <Icon className="w-7 h-7 text-[#193C8D] group-hover:text-[#193C8D]/90 transition-colors" />
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
                );
              })}
            </div>
          </div>

          <aside className="lg:w-[380px] space-y-8">
            <div className="bg-[#193C8D] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <h3 className="text-[11px] font-black text-[#E7B947] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Global Intelligence
              </h3>
              <div className="space-y-4">
                {globalReports.map(report => (
                  <Link 
                    key={report.id} 
                    href={`/sectors/report/${report.id}`}
                    className="flex flex-col p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-[#193C8D] transition-all duration-300"
                  >
                    <span className="text-xs font-bold mb-1">{report.title}</span>
                    <span className="text-[9px] uppercase tracking-widest opacity-60">Visual Analytics</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Directory Guard</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm h-fit">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Verified HS Data</h5>
                    <p className="text-[11px] text-slate-500">Classifications synced with KRA & WCO standards.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm h-fit">
                    <ShieldCheck className="w-5 h-5 text-[#193C8D]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Secure Protocol</h5>
                    <p className="text-[11px] text-slate-500">Access limited based on KAM member credentials.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <Info className="w-5 h-5 text-[#193C8D] shrink-0" />
              <p className="text-[11px] text-blue-900/70 leading-relaxed italic">
                Can&apos;t find a specific sector? Ensure your profile is mapped correctly in settings.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}



// import Link from "next/lik";
// import { Prisma } from "@prisma/client";
// import { 
//   BarChart3, Search, ChevronRight, Info, 
//   Layers, ArrowUpRight, BookOpen, Database, 
//   FileCheck, ShieldCheck 
// } from "lucide-react";
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
//     console.error("Error fetching documents:", error);
//     return [];
//   }
// }

// async function getSessionSafe() {
//   try {
//     return await getServerSession(authOptions);
//   } catch (error) {
//     return null;
//   }
// }

// async function getGlobalPowerBiReports() {
//   try {
//     return await prisma.kam_content.findMany({
//       where: { 
//         content_type: "POWERBI", 
//         OR: [{ sector_id: null }, { sector_id: -1 }],
//         is_active: true 
//       },
//       select: { id: true, title: true, description: true },
//       orderBy: { id: "asc" },
//     });
//   } catch (error) {
//     return [];
//   }
// }

// export default async function SectorsPage() {
//   const session = await getSessionSafe();
//   const role = session?.user?.role ?? "PUBLIC";
//   const canViewAll = ["SUPERADMIN", "ADMIN", "MEMBER"].includes(role);

//   const allDocs = await getAllDocuments(canViewAll);
//   const globalReports = await getGlobalPowerBiReports();

//   // Filter and map only to actual Manufacturing Sectors
//   const displaySectors = ALL_SECTORS
//     .filter(s => s.id > 0) // Removes internal/special hubs
//     .map(sector => ({
//       ...sector,
//       count: allDocs.filter(doc => mapDbSectorToId(doc.sector) === sector.id).length
//     }));

//   const totalResources = displaySectors.reduce((acc, s) => acc + s.count, 0);

//   return (
//     <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-[#193C8D] selection:text-white" suppressHydrationWarning>
      
//       {/* INDUSTRIAL HEADER */}
//       <header className="bg-[#193C8D] text-white relative overflow-hidden">
//         {/* Architectural Grid Overlay */}
//         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
//              style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        
//         <div className="container mx-auto px-6 py-20 relative z-10">
//           <div className="max-w-4xl">
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
//               <Layers className="w-3 h-3 text-[#E7B947]" /> Industrial Intelligence Platform
//             </div>
//             <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
//               Sector <span className="text-[#E7B947]">Resource</span> Centre
//             </h1>
//             <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
//               Kenya&apos;s primary repository for manufacturing trade data, technical standards, and cross-border intelligence.
//             </p>
//           </div>
//         </div>

//         {/* Stats Bar */}
//         <div className="border-t border-white/10 bg-black/10 backdrop-blur-md">
//           <div className="container mx-auto px-6 py-6 flex flex-wrap gap-12">
//             <div className="flex flex-col">
//               <span className="text-[10px] uppercase font-black tracking-widest text-blue-300/60 mb-1 text-center">Active Resources</span>
//               <span className="text-2xl font-mono font-bold text-[#E7B947]">{totalResources.toLocaleString()}</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-[10px] uppercase font-black tracking-widest text-blue-300/60 mb-1 text-center">Live Dashboards</span>
//               <span className="text-2xl font-mono font-bold">{globalReports.length}</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-[10px] uppercase font-black tracking-widest text-blue-300/60 mb-1 text-center">Manufacturing Sectors</span>
//               <span className="text-2xl font-mono font-bold">{displaySectors.length}</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-6 py-16">
//         <div className="flex flex-col lg:flex-row gap-16">
          
//           <div className="flex-1">
//             <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
//               <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
//                 <Database className="w-6 h-6 text-[#193C8D]" /> Sector Repositories
//               </h2>
//               <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                 <span className="w-2 h-2 rounded-full bg-green-500" /> Real-time sync
//               </div>
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               {displaySectors.map((sector) => (
//                 <Link
//                   key={sector.id}
//                   href={`/sectors/${sector.slug}`}
//                   className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#193C8D] transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(25,60,141,0.12)]"
//                 >
//                   <div className="flex justify-between items-start mb-6">
//                     <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
//                       {sector.emoji}
//                     </div>
//                     <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-[#193C8D] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
//                   </div>

//                   <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#193C8D]">
//                     {sector.name}
//                   </h3>
                  
//                   <div className="flex items-center gap-2 text-[10px] font-black text-[#193C8D] uppercase tracking-tighter bg-blue-50/50 w-fit px-2 py-0.5 rounded border border-blue-100 mb-4">
//                     HS Chapters {sector.hsChapters}
//                   </div>

//                   <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6">
//                     {sector.sectionsData.map(s => s.name).join(' • ')}
//                   </p>

//                   <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
//                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                       <BookOpen className="w-3.5 h-3.5" /> {sector.count} Documents
//                     </span>
//                     <span className="text-[11px] font-black text-[#193C8D] uppercase opacity-0 group-hover:opacity-100 transition-all">
//                       Browse Sector →
//                     </span>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* SIDEBAR */}
//           <aside className="lg:w-[380px] space-y-8">
//             {/* Global Intelligence Card */}
//             <div className="bg-[#193C8D] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
//               <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-[#E7B947]/10 transition-colors" />
              
//               <h3 className="text-[11px] font-black text-[#E7B947] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
//                 <BarChart3 className="w-4 h-4" /> Global Intelligence
//               </h3>

//               <div className="space-y-4">
//                 {globalReports.map(report => (
//                   <Link 
//                     key={report.id} 
//                     href={`/sectors/report/${report.id}`}
//                     className="flex flex-col p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-[#193C8D] transition-all duration-300 group/item"
//                   >
//                     <span className="text-xs font-bold mb-1">{report.title}</span>
//                     <span className="text-[9px] uppercase tracking-widest opacity-60 group-hover/item:text-[#193C8D]">Visual Analytics</span>
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             {/* Verification / Security Card */}
//             <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
//               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Directory Guard</h4>
//               <div className="space-y-6">
//                 <div className="flex gap-4">
//                   <div className="p-3 bg-white rounded-xl shadow-sm h-fit">
//                     <FileCheck className="w-5 h-5 text-emerald-600" />
//                   </div>
//                   <div>
//                     <h5 className="text-sm font-bold text-slate-900">Verified HS Data</h5>
//                     <p className="text-[11px] text-slate-500 leading-relaxed">Classifications are synced with current KRA & WCO standards.</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-4">
//                   <div className="p-3 bg-white rounded-xl shadow-sm h-fit">
//                     <ShieldCheck className="w-5 h-5 text-[#193C8D]" />
//                   </div>
//                   <div>
//                     <h5 className="text-sm font-bold text-slate-900">Secure Protocol</h5>
//                     <p className="text-[11px] text-slate-500 leading-relaxed">Document access is limited based on KAM member credentials.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Info Tip */}
//             <div className="flex gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
//               <Info className="w-5 h-5 text-[#193C8D] shrink-0" />
//               <p className="text-[11px] text-blue-900/70 leading-relaxed italic">
//                 Can&apos;t find a specific sector? Ensure your profile is mapped to the correct manufacturing branch in your settings.
//               </p>
//             </div>
//           </aside>
//         </div>
//       </main>

//     </div>
//   );
// }

