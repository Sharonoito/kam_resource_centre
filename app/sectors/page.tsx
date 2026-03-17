import Link from "next/link";
import prisma from "@/lib/prisma";

// Static generation for better performance
export const dynamic = "force-dynamic";

async function getSectors() {
  try {
    const sectors = await prisma.kam_sector.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: {
            contents: {
              where: { is_active: true }
            }
          }
        }
      },
      orderBy: { sort_order: "asc" }
    });
    return sectors;
  } catch (error) {
    console.error("Error fetching sectors:", error);
    return [];
  }
}

export default async function SectorsPage() {
  const sectors = await getSectors();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#193C8D] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/african-pattern.png')]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
              Kenya&apos;s Industrial Sectors
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Explore KAM&apos;s 13 manufacturing sectors. Access sector-specific reports, 
              Power BI analytics, and trade data to drive your business decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector: { id: number; slug: string; icon?: string | null; color?: string | null; name: string; description?: string | null; _count: { contents: number } }) => (
              <Link
                key={sector.id}
                href={`/sectors/${sector.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: `${sector.color}20` }}
                  >
                    {sector.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#0B1E3A] group-hover:text-[#E7B947] transition-colors mb-2">
                      {sector.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {sector.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-[#E7B947]" />
                        {sector._count.contents} Resources
                      </span>
                      <span className="text-[#193C8D] font-medium group-hover:translate-x-1 transition-transform">
                        View Sector →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-[#E7B947]">{sectors.length}</p>
              <p className="text-sm text-gray-600 mt-1">Active Sectors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#193C8D]">
                {sectors.reduce((acc: number, s: { _count: { contents: number } }) => acc + s._count.contents, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Resources</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#E7B947]">PDF</p>
              <p className="text-sm text-gray-600 mt-1">Reports Available</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#193C8D]">Power BI</p>
              <p className="text-sm text-gray-600 mt-1">Interactive Dashboards</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

