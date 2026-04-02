
interface Props {
  params: Promise<{ slug: string }>;
}

async function getSessionSafe() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Failed to resolve session on sector detail page", error);
    return null;
  }
}

async function getSectorDocumentsSafe(canViewAll: boolean, coreName: string, fullName: string) {
  try {
    const publishedFilter = !canViewAll ? " AND is_published = true" : "";
    const escapedCoreName = coreName.toLowerCase().replace(/'/g, "''");
    const escapedFullName = fullName.toLowerCase().replace(/'/g, "''");

    const documentsRaw = await prisma.$queryRawUnsafe(`
      SELECT * FROM sector.v_documents_admin
      WHERE is_active = true${publishedFilter}
        AND (LOWER(sector) LIKE '%${escapedCoreName}%' OR LOWER(sector) LIKE '%${escapedFullName}%')
        AND LOWER(sector) != 'general'
      ORDER BY created_at DESC
    `);

    return Array.isArray(documentsRaw) ? documentsRaw : [];
  } catch (error) {
    console.error("Failed to fetch sector detail documents", error);
    return [];
  }
}

export default async function SectorDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await getSessionSafe();
  
  const canViewAll = ["SUPERADMIN", "ADMIN", "MEMBER"].includes(session?.user?.role || "") || 
                     session?.user?.accessTier === "PUBLIC_FULL";

import { KAM_SECTORS } from '@/types/sectors';
import SectorContent from './SectorContent';
import { notFound } from 'next/navigation';
import { fetchSectorDocuments, fetchSectorPowerBiReports } from '@/lib/documents';



  const documents = await getSectorDocumentsSafe(canViewAll, coreName, sectorMetadata.name);
  const sectorResourceDocs = await fetchSectorDocuments(coreName, sectorSectionNames).catch((error) => {
    console.error("Failed to fetch sector resource documents", error);
    return [];
  });

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const sector = KAM_SECTORS.find(s => s.slug === slug);

  if (!sector) notFound();

  // DEBUG: Log sector name and section names
  // eslint-disable-next-line no-console
  console.log('DEBUG: sector.name', sector.name);
  // eslint-disable-next-line no-console
  console.log('DEBUG: sector.sectionsData.map(s => s.name)', sector.sectionsData.map(s => s.name));

  // Fetch sector documents from the database using the correct DB sector name
  // For Automotive, use 'Automotive' instead of 'Automotive Sector'
  let dbSectorName = sector.name;
  if (sector.slug === 'automotive') dbSectorName = 'Automotive';
  if (sector.slug === 'leather') dbSectorName = 'Leather';
  // Add more mappings here if needed for other sectors
  const resources = await fetchSectorDocuments(dbSectorName, sector.sectionsData.map(s => s.name));
  const powerbiReports = await fetchSectorPowerBiReports(sector.id, sector.sectionsData.map(s => s.name));

  // Merge and pass to UI
  // Note: powerbi records use their `tags` field (set in the DB) to determine
  // which HS section they appear under. Do not override sector here.
  const allResources = [
    ...resources,
    ...powerbiReports.map(r => ({
      ...r,
      document_type: 'POWERBI',
    })),
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <SectorContent 
        sectionsData={sector.sectionsData || []} 
        sectorName={sector.name}
        sectorSlug={sector.slug}
        contentData={allResources} 
      />
    </main>
  );
}