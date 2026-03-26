import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ArrowLeft } from "lucide-react";
import SectorContent from "./SectorContent";
import { fetchSectorDocuments } from "@/lib/documents";
import { KAM_SECTORS } from "@/types/sectors";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SectorDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  
  const canViewAll = ["SUPERADMIN", "ADMIN", "MEMBER"].includes(session?.user?.role || "") || 
                     session?.user?.accessTier === "PUBLIC_FULL";

  const sectorMetadata = Array.isArray(KAM_SECTORS) 
    ? KAM_SECTORS.find((s) => s.slug === slug)
    : null;

  if (!sectorMetadata) return notFound();

  const coreName = sectorMetadata.name.replace(" Sector", "").replace(" and Allied", "");
  const sectorSectionNames = sectorMetadata.sectionsData.map((section) => section.name);

  // Fixed: Simple raw SQL string (no Prisma/sql deps)
  const publishedFilter = !canViewAll ? ' AND is_published = true' : '';
  const documentsRaw = await prisma.$queryRawUnsafe(`
    SELECT * FROM sector.v_documents_admin 
    WHERE is_active = true${publishedFilter}
      AND (LOWER(sector) LIKE '%${coreName}%' OR LOWER(sector) LIKE '%${sectorMetadata.name.toLowerCase()}%')
      AND LOWER(sector) != 'general'
    ORDER BY created_at DESC
  `);
  const documents = Array.isArray(documentsRaw) ? documentsRaw : []; 
  const sectorResourceDocs = await fetchSectorDocuments(coreName, sectorSectionNames);

  // 2. Mapping using the 28-column table data
  const formatDocs = (docs: any[]) => docs.map(doc => ({
    id: doc.id,
    title: doc.filename || doc.title, 
    description: doc.description || null, // Restored
    pdf_url: doc.sharepoint_download_url || "#", // Restored
    section_tag: doc.sector || sectorMetadata.name,
    type: doc.document_type,
    tags: doc.tags || [] // Restored
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="text-white py-16 relative overflow-hidden" style={{ backgroundColor: sectorMetadata.color }}>
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/sectors" className="inline-flex items-center gap-2 mb-6 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={18} /> Back to Sectors
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{sectorMetadata.emoji}</span>
            <h1 className="text-4xl lg:text-5xl font-bold">{sectorMetadata.name}</h1>
          </div>
          <p className="bg-white/20 inline-block px-4 py-1 rounded-full text-sm font-medium">
            {documents.length} Resources Found
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <SectorContent
            sectorName={sectorMetadata.name}
            sectorColor={sectorMetadata.color}
            sectionsData={sectorMetadata.sectionsData}
            pdfContents={formatDocs(documents.filter((d: any) => ["PDF", "Report", "Sector Profile", "Policy Brief"].includes(d.document_type || "")))}
            powerbiContents={formatDocs(documents.filter((d: any) => d.document_type === "POWERBI"))}
            databaseContents={formatDocs(documents.filter((d: any) => ["DATABASE", "TRADE_DATA"].includes(d.document_type || "")))}
            linkContents={formatDocs(documents.filter((d: any) => d.document_type === "LINK"))}
            resourceDocs={sectorResourceDocs}
          />
        </div>
      </section>
    </div>
  );
}











// import { notFound } from "next/navigation";
// import prisma from "@/lib/prisma";
// import Link from "next/link";
// import { ArrowLeft, FileText, Download, Eye } from "lucide-react";
// import { HS_SECTIONS } from "@/types/sectors";

// interface Props {
//   params: Promise<{ slug: string }>;
// }

// export default async function SectionDetailPage({ params }: Props) {
//   const { slug } = await params;

//   // 1. FIX: HS_SECTIONS is a Record. Use Object.values() to treat it like an array for .find()
//   const section = Object.values(HS_SECTIONS).find((s) => s.path === `/sections/${slug}`);
  
//   if (!section) notFound();

//   // 2. Fetch documents with corrected Prisma syntax
//   const documents = await prisma.vDocumentsAdmin.findMany({
//     where: {
//       is_active: true,
//       is_published: true,
//       OR: [
//         { sector: { contains: section.name, mode: "insensitive" } },
//         { filename: { contains: section.name.split(" ")[0], mode: "insensitive" } }
//       ],
//     },
//     orderBy: { created_at: "desc" },
//   });

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <section className="bg-[#193C8D] text-white py-16">
//         <div className="container mx-auto px-6">
//           <Link href="/sectors" className="flex items-center gap-2 text-white/80 hover:text-white mb-6">
//             <ArrowLeft size={18} /> Back to Sectors
//           </Link>
//           <div className="flex flex-col gap-2">
//             <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">
//               Section {section.id}
//             </span>
//             <h1 className="text-4xl font-bold">{section.name}</h1>
//             <p className="text-blue-100 max-w-2xl mt-2">
//               {section.description}
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="py-12">
//         <div className="container mx-auto px-6">
//           <div className="flex items-center justify-between mb-8 border-b pb-4">
//             <h2 className="text-xl font-bold text-[#0B1E3A]">
//               {documents.length} Specialized Resources
//             </h2>
//           </div>

//           {documents.length === 0 ? (
//             <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
//               <FileText className="mx-auto w-12 h-12 text-gray-300 mb-4" />
//               <p className="text-gray-500">No specific documents found for this section yet.</p>
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {documents.map((doc: any) => (
//                 <div key={doc.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col">
//                   <div className="flex items-start justify-between mb-4">
//                     <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase">
//                       {doc.document_type || 'PDF'}
//                     </span>
//                     <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
//                       {doc.year || '2026'}
//                     </span>
//                   </div>

//                   <h3 className="font-bold text-[#0B1E3A] mb-3 line-clamp-2 flex-1">
//                     {doc.filename || doc.title}
//                   </h3>

//                   {doc.description && (
//                     <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic">
//                       {doc.description}
//                     </p>
//                   )}

//                   <div className="flex items-center justify-between pt-4 border-t mt-auto">
//                     <button className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
//                       <Eye size={14} /> Details
//                     </button>
//                     <a
//                       href={doc.download_url || "#"}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-1 text-sm font-bold text-[#193C8D] hover:text-amber-600"
//                     >
//                       <Download size={16} /> Download
//                     </a>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }






// import Link from "next/link";
// import { notFound } from "next/navigation";
// import prisma from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { Database, ArrowLeft } from "lucide-react";
// import SectorContent from "./SectorContent";
// import { fetchSectorDocuments } from "@/lib/documents";
// import { KAM_SECTORS } from "@/types/sectors";

// interface Props {
//   params: Promise<{ slug: string }>;
// }

// export default async function SectorDetailPage({ params }: Props) {
//   const { slug } = await params;
//   const session = await getServerSession(authOptions);
  
//   const canViewAll = ["SUPERADMIN", "ADMIN", "MEMBER"].includes(session?.user?.role || "") || 
//                      session?.user?.accessTier === "PUBLIC_FULL";

//   const sectorMetadata = KAM_SECTORS.find((s) => s.slug === slug);
//   if (!sectorMetadata) notFound();

//   const coreName = sectorMetadata.name.replace(" Sector", "").replace(" and Allied", "");

//   const [documents, sectorResourceDocs] = await Promise.all([
//     prisma.vDocumentsAdmin.findMany({
//       where: {
//         is_active: true,
//         ...(canViewAll ? {} : { is_published: true }),
//         AND: [
//           {
//             OR: [
//               { sector: { contains: sectorMetadata.name, mode: "insensitive" } },
//               { sector: { contains: coreName, mode: "insensitive" } }
//             ]
//           },
//           {
//             // This ensures the 8 "General" docs stay in the Hubs, not here.
//             sector: { not: "General" } 
//           }
//         ]
//       },
//       orderBy: { created_at: "desc" },
//     }),
//     fetchSectorDocuments(coreName),
//   ]);

//   // FIX: Mapping 'title' to use 'doc.filename' instead of 'doc.title'
//   const formatDocs = (docs: any[]) => docs.map(doc => ({
//     id: doc.id,
//     // Using filename here so the UI shows "Growing and diversifying steel industry..."
//     title: doc.filename || doc.title, 
//     description: doc.description || null,
//     pdf_url: doc.download_url || doc.sharepoint_download_url,
//     section_tag: doc.sector || sectorMetadata.name,
//     type: doc.document_type
//   }));

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <section className="text-white py-16 relative" style={{ backgroundColor: sectorMetadata.color }}>
//         <div className="container mx-auto px-6">
//           <Link href="/sectors" className="inline-flex items-center gap-2 mb-6 text-white/80 hover:text-white transition-colors">
//             <ArrowLeft size={18} /> Back to Sectors
//           </Link>
//           <div className="flex items-center gap-4 mb-4">
//             <span className="text-5xl">{sectorMetadata.emoji}</span>
//             <h1 className="text-4xl lg:text-5xl font-bold">{sectorMetadata.name}</h1>
//           </div>
//           <p className="bg-white/20 inline-block px-4 py-1 rounded-full text-sm font-medium">
//             {documents.length} Sector Specific Resources
//           </p>
//         </div>
//       </section>

//       <section className="py-12">
//         <div className="container mx-auto px-6">
//           <SectorContent
//             sectorName={sectorMetadata.name}
//             sectorColor={sectorMetadata.color}
//             sectionsData={sectorMetadata.sectionsData}
//             pdfContents={formatDocs(documents.filter(d => ["PDF", "Report", "Sector Profile", "General Document"].includes(d.document_type || "")))}
//             powerbiContents={formatDocs(documents.filter(d => d.document_type === "POWERBI"))}
//             databaseContents={formatDocs(documents.filter(d => ["DATABASE", "TRADE_DATA"].includes(d.document_type || "")))}
//             linkContents={formatDocs(documents.filter(d => d.document_type === "LINK"))}
//             resourceDocs={sectorResourceDocs}
//           />
//         </div>
//       </section>
//     </div>
//   );
// }




















