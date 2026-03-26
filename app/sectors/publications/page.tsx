import { fetchPublications } from "@/lib/documents"
import PublicationsList from "./PublicationsList"

export const dynamic = "force-dynamic"

export default async function SectorPublicationsPage() {
  const docs = await fetchPublications()
  return <PublicationsList dbDocs={docs} />
}
