
import { HS_SECTORS_ONLY } from '@/types/sectors';
import SectorContent from './SectorContent';
import { notFound } from 'next/navigation';
import { fetchSectorDocuments, fetchSectorPowerBiReports } from '@/lib/documents';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  
  // Updated to use the correct specialized export
  const sector = HS_SECTORS_ONLY.find(s => s.slug === slug);

  if (!sector) notFound();

  let dbSectorName = sector.name;
  if (sector.slug === 'automotive') dbSectorName = 'Automotive';
  if (sector.slug === 'leather') dbSectorName = 'Leather';

  // 1. Fetch from sector.resource_documents (SharePoint)
  const resources = await fetchSectorDocuments(dbSectorName, sector.sectionsData.map(s => s.name));

  // 2. Fetch from kam_content (Admin uploads)
  const adminResources = await prisma.kam_content.findMany({
    where: {
      is_active: true,
      sector_id: sector.id,
      content_type: 'PDF',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      pdf_url: true, 
      pdf_size: true,
      sector_id: true,
      author: true,
      published_date: true,
      created_at: true,
      tags: true,
    },
    orderBy: { created_at: 'desc' },
  });

  // 3. Merge and normalize both sources
  const allResources = [
    ...resources,
    ...adminResources.map((doc) => ({
      ...doc,
      file_name: doc.title, 
      sector: sector.name,
      sharepoint_download_url: doc.pdf_url || '#',
      mime_type: 'application/pdf',
      document_type: 'PDF',
      year: doc.published_date ? new Date(doc.published_date).getFullYear() : 'N/A',
      publisher: doc.author || 'KAM',
    })),
  ];

  // 4. PowerBI reports
  const powerbiReports = await fetchSectorPowerBiReports(sector.id, sector.sectionsData.map(s => s.name));
  
  const allResourcesWithDashboards = [
    ...allResources,
    ...powerbiReports.map(r => ({
      ...r,
      document_type: 'POWERBI',
    })),
  ];

  const totalFiles = allResources.length;
  const totalDashboards = powerbiReports.length;

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <div className="bg-[#193C8D] text-white">
        <div className="container mx-auto px-6 pt-4 pb-0">
          <nav className="flex items-center gap-1.5 text-[11px] text-blue-200/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link href="/sectors" className="hover:text-white transition-colors">Sectors</Link>
            <ChevronRight size={10} />
            <span className="text-white font-semibold">{sector.name}</span>
          </nav>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
              style={{ backgroundColor: `${sector.color}25` }}
            >
              {sector.emoji}
            </div>
            <div>
              <p className="text-[10px] font-black text-[#E7B947] uppercase tracking-widest mb-1">
                Sector Resource Centre
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{sector.name}</h1>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-blue-200/70">
                <span>
                  <span className="font-black text-white text-sm">{totalFiles}</span> Documents
                </span>
                {totalDashboards > 0 && (
                  <span>
                    <span className="font-black text-white text-sm">{totalDashboards}</span> Dashboards
                  </span>
                )}
                <span>HS Chapters: <span className="text-white font-semibold">{sector.hsChapters}</span></span>
                <span>{sector.sectionsData.length} HS Section{sector.sectionsData.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectorContent
        sectionsData={sector.sectionsData || []}
        sectorName={sector.name}
        sectorSlug={sector.slug}
        contentData={allResourcesWithDashboards}
      />
    </div>
  );
}

// import { KAM_SECTORS } from '@/types/sectors';
// import SectorContent from './SectorContent';
// import { notFound } from 'next/navigation';
// import { fetchSectorDocuments, fetchSectorPowerBiReports } from '@/lib/documents';
// import prisma from '@/lib/prisma';
// import Link from 'next/link';
// import { ChevronRight } from 'lucide-react';

// interface Props {
//   params: Promise<{ slug: string }>;
// }

// export default async function Page({ params }: Props) {
//   const { slug } = await params;
//   const sector = KAM_SECTORS.find(s => s.slug === slug);

//   if (!sector) notFound();

//   // DEBUG: Log sector name and section names
//   // eslint-disable-next-line no-console
//   console.log('DEBUG: sector.name', sector.name);
//   // eslint-disable-next-line no-console
//   console.log('DEBUG: sector.sectionsData.map(s => s.name)', sector.sectionsData.map(s => s.name));

//   // Fetch sector documents from the database using the correct DB sector name
//   // For Automotive, use 'Automotive' instead of 'Automotive Sector'
//   let dbSectorName = sector.name;
//   if (sector.slug === 'automotive') dbSectorName = 'Automotive';
//   if (sector.slug === 'leather') dbSectorName = 'Leather';
//   // Add more mappings here if needed for other sectors

//   // Fetch from sector.resource_documents (SharePoint)
//   const resources = await fetchSectorDocuments(dbSectorName, sector.sectionsData.map(s => s.name));
//   // Fetch from kam_content (Admin uploads)
//   const adminResources = await prisma.kam_content.findMany({
//     where: {
//       is_active: true,
//       sector_id: sector.id,
//       content_type: 'PDF',
//     },
//     select: {
//       id: true,
//       title: true,
//       filename: true,
//       sector_id: true,
//       document_type: true,
//       year: true,
//       publisher: true,
//       created_at: true,
//       tags: true,
//       download_url: true,
//       description: true,
//     },
//     orderBy: { created_at: 'desc' },
//   });

//   // Merge and normalize both sources
//   const allResources = [
//     ...resources,
//     ...adminResources.map((doc) => ({
//       ...doc,
//       // Normalize fields for UI compatibility
//       file_name: doc.filename,
//       sector: sector.name,
//       sharepoint_download_url: doc.download_url || `/uploads/admin/${doc.filename}`,
//       mime_type: 'application/pdf',
//     })),
//   ];

//   // PowerBI reports (from kam_content)
//   const powerbiReports = await fetchSectorPowerBiReports(sector.id, sector.sectionsData.map(s => s.name));
//   const allResourcesWithDashboards = [
//     ...allResources,
//     ...powerbiReports.map(r => ({
//       ...r,
//       document_type: 'POWERBI',
//     })),
//   ];

//   const totalFiles = allResources.length;
//   const totalDashboards = powerbiReports.length;

//   return (
//     <div className="min-h-screen bg-[#F8F9FC]">
//       {/* Page header */}
//       <div className="bg-[#193C8D] text-white">
//         {/* Breadcrumb */}
//         <div className="container mx-auto px-6 pt-4 pb-0">
//           <nav className="flex items-center gap-1.5 text-[11px] text-blue-200/70">
//             <Link href="/" className="hover:text-white transition-colors">Home</Link>
//             <ChevronRight size={10} />
//             <Link href="/sectors" className="hover:text-white transition-colors">Sectors</Link>
//             <ChevronRight size={10} />
//             <span className="text-white font-semibold">{sector.name}</span>
//           </nav>
//         </div>

//         <div className="container mx-auto px-6 py-8">
//           <div className="flex items-start gap-4">
//             <div
//               className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
//               style={{ backgroundColor: `${sector.color}25` }}
//             >
//               {sector.emoji}
//             </div>
//             <div>
//               <p className="text-[10px] font-black text-[#E7B947] uppercase tracking-widest mb-1">
//                 Sector Resource Centre
//               </p>
//               <h1 className="text-2xl lg:text-3xl font-bold text-white">{sector.name}</h1>
//               <div className="flex flex-wrap gap-4 mt-3 text-xs text-blue-200/70">
//                 <span>
//                   <span className="font-black text-white text-sm">{totalFiles}</span> Documents
//                 </span>
//                 {totalDashboards > 0 && (
//                   <span>
//                     <span className="font-black text-white text-sm">{totalDashboards}</span> Dashboards
//                   </span>
//                 )}
//                 <span>HS Chapters: <span className="text-white font-semibold">{sector.hsChapters}</span></span>
//                 <span>{sector.sectionsData.length} HS Section{sector.sectionsData.length !== 1 ? 's' : ''}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <SectorContent
//         sectionsData={sector.sectionsData || []}
//         sectorName={sector.name}
//         sectorSlug={sector.slug}
//         contentData={allResourcesWithDashboards}
//       />
//     </div>
//   );
// }
