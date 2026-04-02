import Link from 'next/link';
import { ArrowLeft, Layers, ArrowRight } from 'lucide-react';
import { HsSection, KAM_SECTORS, getSectionSlug } from '@/types/sectors';
import { notFound } from 'next/navigation';


interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SectionList({ params }: Props) {
  const { slug } = await params;
  const sector = KAM_SECTORS.find(s => s.slug === slug);

  if (!sector) notFound();

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <Link 
          href="/sectors" 
          className="inline-flex items-center gap-2 mb-8 text-[#193C8D] hover:text-[#E7B947] font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Sectors
        </Link>

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-bold mb-6 border border-white/30"
            style={{ backgroundColor: `${sector.color}20` }}
          >
            <Layers size={16} style={{ color: sector.color }} />
            Section {sector.id} • HS {sector.hsChapters}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0B1E3A] to-[#193C8D] bg-clip-text text-transparent mb-6">
            {sector.emoji} {sector.name}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore HS Code sections and specialized analytics for this manufacturing sector.
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sector.sectionsData.map((section: HsSection) => {
            const sectionSlug = getSectionSlug(section.path);
            return (
              <Link
                key={section.id}
                href={`./sections/${sectionSlug}`}
                className="group bg-white/70 backdrop-blur-sm hover:bg-white border border-white/50 hover:border-[#E7B947]/50 shadow-lg hover:shadow-2xl rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4 h-full">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:shadow-lg transition-all mt-1 flex-shrink-0">
                    <span className="text-2xl font-serif font-black text-gray-700 group-hover:text-[#193C8D]">
                      {section.id}
                    </span>
                  </div>
                  <div className="flex-1 min-h-0">
                    <h3 className="font-bold text-xl text-[#0B1E3A] mb-2 line-clamp-2 leading-tight group-hover:text-[#193C8D] transition-colors">
                      {section.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                      {section.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#E7B947] uppercase tracking-wider group-hover:translate-x-1 transition-all">
                      View Analytics
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 text-center">
          <h4 className="text-lg font-bold text-[#0B1E3A] mb-2">Need Sector Overview?</h4>
          <Link 
            href="./" 
            className="inline-flex items-center gap-2 text-[#193C8D] font-bold hover:text-[#E7B947] transition-colors"
          >
            ← View {sector.name} Resources
          </Link>
        </div>
      </div>
    </section>
  );
}

