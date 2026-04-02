

import { KAM_SECTORS } from '@/types/sectors';
import SectorContent from './SectorContent';
import { notFound } from 'next/navigation';
import { fetchSectorDocuments, fetchSectorPowerBiReports } from '@/lib/documents';



interface Props {
  params: Promise<{ slug: string }>;
}

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