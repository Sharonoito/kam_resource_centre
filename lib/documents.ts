// Fetch all resources tagged for Research/KRA (PDF, Power BI, etc.)
export async function fetchKRAResearchResources(): Promise<any[]> {
  // This fetches all resources where tags or section includes 'Research', 'KRA', or 'Customs Data Hub'
  return prisma.kam_content.findMany({
    where: {
      is_active: true,
      OR: [
        { tags: { contains: "Research", mode: "insensitive" } },
        { tags: { contains: "KRA", mode: "insensitive" } },
        { tags: { contains: "Customs Data Hub", mode: "insensitive" } },
        { tags: { contains: "Trade Intelligence", mode: "insensitive" } },
      ],
    },
    orderBy: { created_at: "desc" },
  });
}
// Fetch a single Power BI report by id (for the full-screen viewer)
export async function getPowerBiReportById(id: number) {
  return prisma.kam_content.findFirst({
    where: { id, content_type: 'POWERBI', is_active: true },
    select: { id: true, title: true, description: true, powerbi_embed: true, powerbi_url: true },
  });
}

// Fetch Power BI reports for a sector (and its sections)
export async function fetchSectorPowerBiReports(sectorId: number, sectionNames: string[] = []) {
  // Optionally, you can also filter by sub_sector_id if needed
  return prisma.kam_content.findMany({
    where: {
      sector_id: sectorId,
      content_type: 'POWERBI',
      is_active: true,
    },
    select: {
      id: true,
      title: true,
      sector_id: true,
      sub_sector_id: true,
      powerbi_embed: true,
      powerbi_url: true,
      description: true,
      tags: true,
    },
    orderBy: { created_at: 'desc' }
  });
}
// lib/documents.ts - Grouped sector.v_documents_admin query +
// lib/documents.ts - Grouped sector.v_documents_admin query +
//                    resource_documents fetch functions for RBAC-aware routing
import prisma from './prisma'
import { Prisma } from '@prisma/client'
// No Prisma type import needed for raw query

// ---------------------------------------------------------------------------
// resource_documents — typed interface
// ---------------------------------------------------------------------------

export interface ResourceDocument {
  id: number
  filename: string
  title: string
  sector: string | null
  document_type: string | null
  sharepoint_download_url: string | null
  mime_type: string | null
  year: number | null
  publisher: string | null
  created_at: Date | null
}

// Routing helper: derive which navigation section a document belongs to
export type ResourceNavTarget = 'sectors' | 'trade' | 'publications' | 'research'

export function getNavTarget(
  doc: Pick<ResourceDocument, 'sector' | 'document_type'>
): ResourceNavTarget {
  if (doc.document_type?.toLowerCase() === 'policy brief') return 'trade'
  if (doc.document_type?.toLowerCase() === 'general document') return 'research'
  const isGeneral = !doc.sector || doc.sector.toLowerCase() === 'general'
  if (isGeneral) return 'publications'
  return 'sectors'
}

// File-type icon key for conditional rendering in cards
export type FileIconType = 'pdf' | 'excel' | 'powerbi' | 'document'

export function getFileIconType(filename: string, mimeType?: string | null): FileIconType {
  const lower = filename.toLowerCase()
  const mime = (mimeType ?? '').toLowerCase()

  if (mime.includes('pdf') || lower.endsWith('.pdf')) return 'pdf'
  if (
    mime.includes('spreadsheet') ||
    mime.includes('excel') ||
    lower.endsWith('.xlsx') ||
    lower.endsWith('.xls') ||
    lower.endsWith('.csv')
  )
    return 'excel'
  if (lower.endsWith('.pbix') || lower.includes('powerbi')) return 'powerbi'
  return 'document'
}

const BASE_SELECT = `
  SELECT id, filename, title, sector, document_type,
         sharepoint_download_url, mime_type, year, publisher, created_at
  FROM sector.resource_documents
`

// ---------------------------------------------------------------------------
// Fetch: sector detail pages (non-General documents for a named sector)
// ---------------------------------------------------------------------------
export async function fetchSectorDocuments(
  sectorName: string,
  sectionNames: string[] = []
): Promise<ResourceDocument[]> {
  const normalizedSections = sectionNames
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean)

  const sectionFilter = normalizedSections.length
    ? Prisma.sql` OR LOWER(sector) IN (${Prisma.join(normalizedSections)})`
    : Prisma.empty

  return prisma.$queryRaw<ResourceDocument[]>`
    SELECT DISTINCT id, filename, title, sector, document_type,
           sharepoint_download_url, mime_type, year, publisher, created_at
    FROM sector.resource_documents
    WHERE is_active = TRUE AND is_published = TRUE
      AND (LOWER(sector) = LOWER(${sectorName}) ${sectionFilter})
    ORDER BY created_at DESC
  `
}

// ---------------------------------------------------------------------------
// Fetch: Trade & Policy page — Policy Briefs only
// ---------------------------------------------------------------------------
export async function fetchPolicyBriefs(): Promise<ResourceDocument[]> {
  return prisma.$queryRaw<ResourceDocument[]>`
    SELECT id, filename, title, sector, document_type,
           sharepoint_download_url, mime_type, year, publisher, created_at
    FROM sector.resource_documents
    WHERE is_active = TRUE AND is_published = TRUE
      AND LOWER(document_type) = 'policy brief'
    ORDER BY created_at DESC
  `
}

// ---------------------------------------------------------------------------
// Fetch: Publications page — Reports + Sector Profiles across all sectors
// ---------------------------------------------------------------------------
export async function fetchPublications(): Promise<ResourceDocument[]> {
  return prisma.$queryRaw<ResourceDocument[]>`
    SELECT id, filename, title, sector, document_type,
           sharepoint_download_url, mime_type, year, publisher, created_at
    FROM sector.resource_documents
    WHERE is_active = TRUE AND is_published = TRUE
      AND document_type IN ('Report', 'Sector Profile')
    ORDER BY document_type ASC, sector ASC, created_at DESC
  `
}

// ---------------------------------------------------------------------------
// Fetch: Research Hub — General Documents + Reports where sector = 'General'
// ---------------------------------------------------------------------------
export async function fetchResearchDocuments(): Promise<ResourceDocument[]> {
  return prisma.$queryRaw<ResourceDocument[]>`
    SELECT id, filename, title, sector, document_type,
           sharepoint_download_url, mime_type, year, publisher, created_at
    FROM sector.resource_documents
    WHERE is_active = TRUE AND is_published = TRUE
      AND (
        LOWER(document_type) = 'general document'
        OR (LOWER(document_type) = 'report' AND LOWER(sector) = 'general')
      )
    ORDER BY created_at DESC
  `
}


// ---------------------------------------------------------------------------
// Group an array of docs by document_type for themed section rendering
// ---------------------------------------------------------------------------
export function groupByDocumentType(
  docs: ResourceDocument[]
): Record<string, ResourceDocument[]> {
  return docs.reduce<Record<string, ResourceDocument[]>>((acc, doc) => {
    const key = doc.document_type ?? 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(doc)
    return acc
  }, {})
}


interface Doc {
  id: number
  title: string
  sector: string
  document_type: string
  download_url: string | null
}

export async function getDocumentsBySector(sectorNames: string[]) {
  const docs: Doc[] = await prisma.$queryRaw`
    SELECT id, title, sector, document_type, download_url, created_at::text as created_at
    FROM sector.v_documents_admin 
    WHERE is_active = true AND is_published = true 
      AND sector = ANY(${sectorNames}::text[])
    ORDER BY created_at DESC
  `
  return docs
}

