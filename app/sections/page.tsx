import Link from "next/link";
import prisma from "@/lib/prisma";
import { ArrowRight } from "lucide-react";
import { HS_SECTIONS_MAP } from "@/constants/hs-sections";

async function getTotalStats() {
  try {
    const stats = await prisma.icms_master.aggregate({
      _sum: { fob_value: true },
      _count: { id: true },
    });

    return {
      totalValue: stats._sum.fob_value || 0,
      declarations: stats._count.id || 0,
    };
  } catch {
    return { totalValue: 0, declarations: 0 };
  }
}

export default async function SectionsPage() {
  const totalStats = await getTotalStats();
  const sections = Object.entries(HS_SECTIONS_MAP);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero */}
      <section className="bg-[#193C8D] pt-28 pb-20 text-white">
        <div className="container mx-auto px-6 text-center">

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            HS Sections
          </h1>

          <p className="text-xl max-w-3xl mx-auto mb-12 text-blue-100 leading-relaxed">
            Explore the 21 Harmonized System product sections with
            comprehensive trade analytics, Power BI dashboards,
            and sector trade reports.
          </p>

          <div className="bg-white text-slate-900 rounded-2xl p-8 max-w-xl mx-auto shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 text-left">

              <div>
                <p className="uppercase text-xs font-semibold text-slate-500 mb-1">
                  Total Trade Value
                </p>
                <p className="text-3xl font-bold text-[#193C8D]">
                  KES {(Number(totalStats.totalValue) / 1000000000).toLocaleString()}B
                </p>
              </div>

              <div>
                <p className="uppercase text-xs font-semibold text-slate-500 mb-1">
                  Declarations
                </p>
                <p className="text-3xl font-bold text-[#193C8D]">
                  {totalStats.declarations.toLocaleString()}
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Sections */}
      <section className="container mx-auto px-6 py-20">

        <div className="mb-16 text-center">

          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Available Sections
          </h2>

          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Select a section to access detailed analytics,
            Power BI dashboards and sector trade reports.
          </p>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">

          {sections.map(([slug, section]) => (
            <Link
              key={slug}
              href={`/sections/${slug}`}
              className="group bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >

              {/* Icon */}
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
                <section.icon className="w-8 h-8 text-[#193C8D]" />
              </div>

              {/* Section Label */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Section {section.number}
                </span>

                <span className="text-xs text-slate-400">
                  {section.hsCodeRange}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-[#193C8D] transition-colors">
                {section.name}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-6 flex-1">
                {section.description}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <span className="text-sm font-medium text-[#193C8D]">
                  Explore Section
                </span>

                <ArrowRight className="w-4 h-4 text-[#193C8D] group-hover:translate-x-1 transition-transform" />
              </div>

            </Link>
          ))}

        </div>

        {/* Coming Soon */}
        <div className="text-center mt-20 p-10 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-2xl font-semibold text-slate-800 mb-2">
            16 More Sections Coming Soon
          </p>

          <p className="text-slate-600 max-w-md mx-auto">
            Additional HS sections covering chemicals, machinery,
            textiles, transport equipment and more trade sectors
            will be added soon.
          </p>
        </div>

      </section>

    </div>
  );
}