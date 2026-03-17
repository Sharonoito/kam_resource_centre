import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { FileText, BarChart3, Database, ExternalLink, Download, Eye } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getSector(slug: string) {
  try {
    const sector = await prisma.kam_sector.findUnique({
      where: { slug, is_active: true },
      include: {
        contents: {
          where: { is_active: true },
          orderBy: [{ is_featured: "desc" }, { published_date: "desc" }]
        },
        sub_sectors: {
          where: { is_active: true },
          orderBy: { sort_order: "asc" }
        }
      }
    });
    return sector;
  } catch (error) {
    console.error("Error fetching sector:", error);
    return null;
  }
}

// Generate static params for all sectors
async function getAllSectorSlugs() {
  try {
    const sectors = await prisma.kam_sector.findMany({
      where: { is_active: true },
      select: { slug: true }
    });
    return sectors.map((s: { slug: string }) => s.slug);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllSectorSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export default async function SectorDetailPage({ params }: Props) {
  const { slug } = await params;
  const sector = await getSector(slug);

  if (!sector) {
    notFound();
  }

// Separate content by type
  const pdfContents = sector.contents.filter((c: { content_type: string }) => c.content_type === "PDF");
  const powerbiContents = sector.contents.filter((c: { content_type: string }) => c.content_type === "POWERBI");
  const databaseContents = sector.contents.filter((c: { content_type: string }) => c.content_type === "DATABASE");
  const linkContents = sector.contents.filter((c: { content_type: string }) => c.content_type === "LINK");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="text-white py-16 relative overflow-hidden"
        style={{ backgroundColor: sector.color || "#0B1E3A" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/african-pattern.png')]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <Link 
            href="/sectors" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            ← Back to Sectors
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{sector.icon}</span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold">
              {sector.name}
            </h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            {sector.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium">
              {sector.contents.length} Resources
            </span>
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium">
              {pdfContents.length} PDF Reports
            </span>
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium">
              {powerbiContents.length} Interactive Dashboards
            </span>
          </div>
        </div>
      </section>

      {/* Sub-sectors */}
      {sector.sub_sectors.length > 0 && (
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Sub-sectors
            </h2>
            <div className="flex flex-wrap gap-2">
              {sector.sub_sectors.map((sub: { id: number; name: string; slug: string }) => (
                <Link
                  key={sub.id}
                  href={`/sectors/${sector.slug}?sub=${sub.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-[#E7B947] hover:text-white rounded-full text-sm font-medium transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PDF Reports Section */}
      {pdfContents.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0B1E3A]">PDF Reports</h2>
                <p className="text-gray-600">Download sector reports and publications</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfContents.map((content: { id: number; is_featured: boolean; title: string; description?: string | null; pdf_url?: string | null; pdf_size?: string | null }) => (
                <div
                  key={content.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded">
                      PDF
                    </span>
                    {content.is_featured && (
                      <span className="px-2 py-1 bg-[#E7B947] text-white text-xs font-bold rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#0B1E3A] mb-2 line-clamp-2">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {content.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-gray-500">
                      {content.pdf_size}
                    </span>
                    <a
                      href={content.pdf_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-[#193C8D] hover:text-[#E7B947] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Power BI Section */}
      {powerbiContents.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0B1E3A]">Interactive Dashboards</h2>
                <p className="text-gray-600">Explore Power BI visualizations and analytics</p>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {powerbiContents.map((content: { id: number; title: string; powerbi_url?: string | null; powerbi_embed?: string | null }) => (
                <div
                  key={content.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs font-bold rounded">
                        Power BI
                      </span>
                      <a
                        href={content.powerbi_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-[#193C8D] hover:text-[#E7B947] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in New Tab
                      </a>
                    </div>
                    <h3 className="font-bold text-[#0B1E3A] mt-3">
                      {content.title}
                    </h3>
                  </div>
                  <div className="aspect-video bg-gray-100">
                    {content.powerbi_embed ? (
                      <iframe
                        src={content.powerbi_embed}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <BarChart3 className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Database/Trade Data Section */}
      {databaseContents.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0B1E3A]">Trade Data</h2>
                <p className="text-gray-600">Access customs and trade database records</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        HS Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Value
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {databaseContents.map((content: { id: number; title: string; tags?: string | null; keywords?: string | null }) => (
                      <tr key={content.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-[#0B1E3A]">
                            {content.title}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {content.tags || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {content.keywords || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          -
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/research/barometer?search=${encodeURIComponent(sector.name)}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-[#193C8D] hover:text-[#E7B947]"
                          >
                            <Eye className="w-4 h-4" />
                            View Data
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* External Links Section */}
      {linkContents.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0B1E3A]">External Resources</h2>
                <p className="text-gray-600">Useful links and external resources</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {linkContents.map((content: { id: number; title: string; external_url?: string | null; description?: string | null }) => (
                <a
                  key={content.id}
                  href={content.external_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#E7B947] hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-[#E7B947] group-hover:text-white transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0B1E3A] group-hover:text-[#E7B947] transition-colors">
                      {content.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {content.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Content Message */}
      {sector.contents.length === 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1E3A] mb-2">
              No Content Available Yet
            </h3>
            <p className="text-gray-600 mb-6">
              We&apos;re working on adding resources for this sector. Check back soon!
            </p>
            <Link
              href="/sectors"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#193C8D] text-white rounded-lg font-medium hover:bg-[#142C55] transition-colors"
            >
              Browse Other Sectors
            </Link>
          </div>
        </section>
      )}

      {/* Search CTA */}
      <section className="py-12 bg-[#0B1E3A]">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-gray-300 mb-6">
            Use our search to find specific reports, data, or resources across all sectors.
          </p>
          <Link
            href={`/research/barometer?search=${encodeURIComponent(sector.name)}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E7B947] text-[#0B1E3A] rounded-lg font-bold hover:bg-yellow-400 transition-colors"
          >
            <Database className="w-5 h-5" />
            Search Trade Data
          </Link>
        </div>
      </section>
    </div>
  );
}

