import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ArrowRight, X, FileText, Database, BarChart3 } from "lucide-react";
import PowerBiEmbed from "@/components/PowerBiEmbed";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ view?: string; type?: string; report?: string }>;
}

interface ReportListing {
  id: string;
  title: string;
  excerpt: string;
  type: "powerbi" | "pdf" | "database";
  category: string;
  date: string;
  image?: string;
  embedUrl?: string;
  pageName?: string;
}

const BASE_EMBED_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9";

const LIVESTOCK_EMBED_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiNzk2OWU2OTUtODFiYS00ZTY2LWFlNGQtOTE1NTM3MDlhNTdlIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9";

const LIVESTOCK_REPORT_PAGES: Record<string, string> = {
  default: "5174b7720480096b117c",
  "tax-report": "6ec016681553452c19b0",
  "export-duty": "699131e82eeab37bc12c",
  "excise-duty": "5a148b282ab745e0c9be",
  "import-declaration-fee": "1ac94e6b666cc9ee1a3b",
  "import-duty": "14c79f5688b66ee078c2",
};

const HS_SECTIONS_MAP: Record<
  string,
  {
    number: string;
    name: string;
    description: string;
    icon: string;
    hsCodeRange?: string;
    embedUrl: string;
    pageName?: string;
    isLivestock?: boolean;
  }
> = {
  "i-live-animals": {
    number: "I",
    name: "Live Animals & Products",
    description: "Animal products and derivatives",
    icon: "🐾",
    hsCodeRange: "01-05",
    embedUrl: LIVESTOCK_EMBED_URL,
    pageName: "5174b7720480096b117c",
    isLivestock: true,
  },
  "ii-vegetable-products": {
    number: "II",
    name: "Vegetable Products",
    description: "Crops, seeds, and vegetation",
    icon: "🌾",
    hsCodeRange: "06-15",
    embedUrl: BASE_EMBED_URL,
    pageName: "5cb0946bc8c254a71ad0",
  },
  "iii-fats-oils": {
    number: "III",
    name: "Fats and Oils",
    description: "Animal and vegetable fats",
    icon: "🫒",
    hsCodeRange: "15",
    embedUrl: BASE_EMBED_URL,
    pageName: "5cb0946bc8c254a71ad0",
  },
  "iv-prepared-food": {
    number: "IV",
    name: "Prepared Foodstuffs",
    description: "Processed food items",
    icon: "🍫",
    hsCodeRange: "16-21",
    embedUrl: BASE_EMBED_URL,
    pageName: "e0b70589900315438756",
  },
  "v-mineral-products": {
    number: "V",
    name: "Mineral Products",
    description: "Ores, minerals, and salts",
    icon: "⛏️",
    hsCodeRange: "25-27",
    embedUrl: BASE_EMBED_URL,
    pageName: "eef57ede27775b057dd4",
  },
};

async function getSectionStats(hsCodeRange?: string) {
  try {
    if (!hsCodeRange) return { totalValue: 0, declarations: 0 };
    const [start, end] = hsCodeRange.split("-").map(Number);
    const stats = await prisma.icms_master.aggregate({
      _sum: { fob_value: true },
      _count: { id: true },
      where: {
        hscode: {
          gte: `${start.toString().padStart(2, "0")}`,
          lte: `${(end ?? start).toString().padStart(2, "0")}`,
        },
      },
    });
    return {
      totalValue: stats._sum.fob_value || 0,
      declarations: stats._count.id || 0,
    };
  } catch {
    return { totalValue: 0, declarations: 0 };
  }
}

const getReportsForSection = (sectionSlug: string, sectionName: string): ReportListing[] => {
  if (sectionSlug === "i-live-animals") {
    return [
      {
        id: "livestock-general-analytics",
        title: `${sectionName} - General Analytics Dashboard`,
        excerpt: "Comprehensive Power BI dashboard with overall trade analytics for live animals and animal products.",
        type: "powerbi",
        category: "Overview",
        date: "March 2026",
        embedUrl: BASE_EMBED_URL,
        pageName: "5174b7720480096b117c",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-import-analytics",
        title: `${sectionName} - Import Analytics Dashboard`,
        excerpt: "Interactive Power BI dashboard showing import trends and trade flows for live animals and animal products.",
        type: "powerbi",
        category: "Import",
        date: "March 2026",
        embedUrl: LIVESTOCK_EMBED_URL,
        pageName: "5174b7720480096b117c",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-export-performance",
        title: `${sectionName} - Export Performance Dashboard`,
        excerpt: "Power BI visualization of export destinations, volumes and growth for live animals and animal products.",
        type: "powerbi",
        category: "Export",
        date: "March 2026",
        embedUrl: LIVESTOCK_EMBED_URL,
        pageName: "5174b7720480096b117c",
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-tax-report",
        title: `${sectionName} - Tax Report`,
        excerpt: "Comprehensive tax analysis for live animals and animal products imports and exports.",
        type: "powerbi",
        category: "Tax",
        date: "March 2026",
        embedUrl: LIVESTOCK_EMBED_URL,
        pageName: "6ec016681553452c19b0",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-export-duty",
        title: `${sectionName} - Export Duty Performance`,
        excerpt: "Power BI report showing export duty performance for live animals and animal products.",
        type: "powerbi",
        category: "Export",
        date: "March 2026",
        embedUrl: LIVESTOCK_EMBED_URL,
        pageName: "699131e82eeab37bc12c",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-excise-duty",
        title: `${sectionName} - Excise Duty Performance`,
        excerpt: "Power BI report showing excise duty performance for live animals and animal products.",
        type: "powerbi",
        category: "Tax",
        date: "March 2026",
        embedUrl: LIVESTOCK_EMBED_URL,
        pageName: "5a148b282ab745e0c9be",
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-import-declaration-fee",
        title: `${sectionName} - Import Declaration Fee Performance`,
        excerpt: "Power BI report showing import declaration fee performance for live animals and animal products.",
        type: "powerbi",
        category: "Import",
        date: "March 2026",
        embedUrl: LIVESTOCK_EMBED_URL,
        pageName: "1ac94e6b666cc9ee1a3b",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-import-duty",
        title: `${sectionName} - Import Duty Performance`,
        excerpt: "Power BI report showing import duty performance for live animals and animal products.",
        type: "powerbi",
        category: "Import",
        date: "March 2026",
        embedUrl: LIVESTOCK_EMBED_URL,
        pageName: "14c79f5688b66ee078c2",
        image: "https://images.unsplash.com/photo-1428014612949-47b877a1a818?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-annual-report-2024",
        title: `${sectionName} - Annual Trade Report 2024`,
        excerpt: "Comprehensive annual trade report for live animals and animal products in PDF format.",
        type: "pdf",
        category: "Report",
        date: "January 2025",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-market-study",
        title: `${sectionName} - Market Study Report`,
        excerpt: "Detailed market analysis and trends for live animals and animal products sector.",
        type: "pdf",
        category: "Report",
        date: "December 2024",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-trade-database",
        title: `${sectionName} - Trade Database`,
        excerpt: "Access raw trade data for live animals and animal products. Search and filter declarations.",
        type: "database",
        category: "Data",
        date: "Live Data",
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&h=300&fit=crop",
      },
      {
        id: "livestock-company-directory",
        title: `${sectionName} - Company Directory`,
        excerpt: "Directory of importers and exporters dealing in live animals and animal products.",
        type: "database",
        category: "Data",
        date: "Updated Monthly",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
      },



      {
        id: "leather-sub-sector-report",
        title: "Leather Sub-Sector Profile",
        excerpt: "Detailed sector publication including subsector growth and cost analysis.",
        type: "pdf",
        category: "Report",
        date: "Jan 2025",
        // Make sure this file exists in public/documents/sector-reports/
        // fileUrl: "/documents/sector-reports/Automotive.pdf", 
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
      },
    ];
  }

  return [
    {
      id: "imports-dashboard",
      title: `${sectionName} - Import Analytics Dashboard`,
      excerpt: "Interactive Power BI dashboard showing import trends and trade flows.",
      type: "powerbi",
      category: "Import",
      date: "March 2026",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    },
    {
      id: "exports-dashboard",
      title: `${sectionName} - Export Performance Dashboard`,
      excerpt: "Power BI visualization of export destinations, volumes and growth.",
      type: "powerbi",
      category: "Export",
      date: "March 2026",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&h=300&fit=crop",
    },
    {
      id: "tax-analysis",
      title: `${sectionName} - Customs & Tax Revenue`,
      excerpt: "Power BI analytics showing duties, VAT and excise tax collected.",
      type: "powerbi",
      category: "Tax",
      date: "March 2026",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop",
    },
  ];
};

export default async function HSectionDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { view, type, report } = await searchParams;

  const section = HS_SECTIONS_MAP[slug];
  if (!section) notFound();

  const stats = await getSectionStats(section.hsCodeRange);
  const reports = getReportsForSection(slug, section.name);

  const filteredReports = type
    ? reports.filter((r) => r.category.toLowerCase() === type.toLowerCase())
    : reports;

  const getReportConfig = (reportId: string, sectionSlug: string): { pageName: string; embedUrl: string } => {
    const defaultConfig = { 
      pageName: section.pageName || "", 
      embedUrl: section.embedUrl 
    };
    
    if (sectionSlug !== "i-live-animals") return defaultConfig;
    
    const reportPageMap: Record<string, { pageName: string; embedUrl: string }> = {
      "livestock-general-analytics": { pageName: "5174b7720480096b117c", embedUrl: BASE_EMBED_URL },
      "livestock-import-analytics": { pageName: "5174b7720480096b117c", embedUrl: LIVESTOCK_EMBED_URL },
      "livestock-export-performance": { pageName: "5174b7720480096b117c", embedUrl: LIVESTOCK_EMBED_URL },
      "livestock-tax-report": { pageName: "6ec016681553452c19b0", embedUrl: LIVESTOCK_EMBED_URL },
      "livestock-export-duty": { pageName: "699131e82eeab37bc12c", embedUrl: LIVESTOCK_EMBED_URL },
      "livestock-excise-duty": { pageName: "5a148b282ab745e0c9be", embedUrl: LIVESTOCK_EMBED_URL },
      "livestock-import-declaration-fee": { pageName: "1ac94e6b666cc9ee1a3b", embedUrl: LIVESTOCK_EMBED_URL },
      "livestock-import-duty": { pageName: "14c79f5688b66ee078c2", embedUrl: LIVESTOCK_EMBED_URL },
    };
    
    return reportPageMap[reportId] || defaultConfig;
  };

  const reportConfig = report ? getReportConfig(report, slug) : { pageName: section.pageName || "", embedUrl: section.embedUrl };
  const currentReportTitle = report ? reports.find(r => r.id === report)?.title || section.name : section.name;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="bg-[#193C8D] pt-12 pb-20 text-white">
        <div className="container mx-auto px-6">
          <Link
            href="/sections"
            className="opacity-60 hover:opacity-100 flex items-center gap-2 text-sm mb-8"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Sections
          </Link>

          <div className="flex justify-between items-end">
            <div className="flex gap-6">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl">
                {section.icon}
              </div>

              <div>
                <p className="text-[#E7B947] uppercase text-xs mb-2 font-black">
                  Section {section.number}
                </p>

                <h1 className="text-4xl font-black">{section.name}</h1>
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-white/50 text-xs">Total Value</p>
              <p className="font-bold text-xl">
                KES {(Number(stats.totalValue) / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {view === "report" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-2xl text-zinc-900">
                {currentReportTitle}
              </h2>

              <Link
                href={`/sections/${slug}`}
                className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-red-600"
              >
                <X className="w-4 h-4" /> Close Dashboard
              </Link>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden shadow-xl">
              <PowerBiEmbed
                reportUrl={reportConfig.embedUrl}
                pageName={reportConfig.pageName}
                title={currentReportTitle}
                height="800px"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex gap-4 flex-wrap">
              <Link href={`/sections/${slug}`} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${!type ? "bg-[#E7B947] text-[#193C8D]" : "bg-white border border-zinc-300 text-[#193C8D]"}`}>
                <BarChart3 className="w-4 h-4" /> All
              </Link>
              <Link href={`/sections/${slug}?type=Import`} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${type === "Import" ? "bg-[#E7B947] text-[#193C8D]" : "bg-white border border-zinc-300 text-[#193C8D]"}`}>Import</Link>
              <Link href={`/sections/${slug}?type=Export`} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${type === "Export" ? "bg-[#E7B947] text-[#193C8D]" : "bg-white border border-zinc-300 text-[#193C8D]"}`}>Export</Link>
              <Link href={`/sections/${slug}?type=Tax`} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${type === "Tax" ? "bg-[#E7B947] text-[#193C8D]" : "bg-white border border-zinc-300 text-[#193C8D]"}`}>Tax</Link>

            </div>

            <main className="space-y-6">
              {filteredReports.map((reportItem) => (
                <div key={reportItem.id} className="bg-white border rounded-2xl p-8 flex gap-8 shadow-sm">
                  <img src={reportItem.image} className="w-52 h-40 object-cover rounded-xl" alt="" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       {reportItem.type === 'pdf' && <FileText className="w-4 h-4 text-red-600" />}
                       {reportItem.type === 'database' && <Database className="w-4 h-4 text-[#193C8D]" />}
                       <span className="text-[10px] font-bold uppercase text-zinc-400">{reportItem.type}</span>
                    </div>
                    <h3 className="font-black text-xl mb-3 text-zinc-900">{reportItem.title}</h3>
                    <p className="text-zinc-600">{reportItem.excerpt}</p>
                    
                    {reportItem.type === "powerbi" ? (
                      <Link href={`/sections/${slug}?view=report&report=${reportItem.id}`} className="inline-flex items-center gap-2 text-[#193C8D] font-black text-sm mt-6">
                        Launch Dashboard <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : reportItem.type === "pdf" ? (
                    <Link 
                      href={`/sections/${slug}/pdf/${reportItem.id}`} 
                      className="inline-flex items-center gap-2 text-red-600 font-black text-sm mt-6"
                    >
                      View Report (PDF) <ArrowRight className="w-4 h-4" />
                    </Link>
                    ) : (
                      // Inside your filteredReports.map loop for 'database' types
                      <Link 
                        href={`/sections/${slug}/data/${reportItem.id}`} 
                        className="inline-flex items-center gap-2 text-green-700 font-black text-xs uppercase tracking-widest mt-6 group"
                      >
                        Access Live Data <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </main>
          </div>
        )}
      </section>
    </div>
  );
}