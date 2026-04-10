import Link from "next/link";
import { 
  Filter, 
  RotateCcw, 
  Search, 
  LayoutGrid,
  List,
  BookOpen
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getFileIconType } from "@/lib/documents";
import TradeContent from "./TradeContent";

type QueryValue = string | string[] | undefined;

interface PageProps {
  searchParams: Promise<{
    year?: QueryValue;
    category?: QueryValue;
    search?: QueryValue;
    page?: QueryValue;
    pageSize?: QueryValue;
  }>;
}

function getSingle(v: QueryValue): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function parsePInt(v: string, d: number): number {
  const p = Number.parseInt(v, 10);
  return Number.isFinite(p) && p > 0 ? p : d;
}

export default async function TradePage({ searchParams }: PageProps) {
  const q = await searchParams;
  const yearParam = getSingle(q.year);
  const categoryParam = getSingle(q.category);
  const searchParam = getSingle(q.search).trim();
  const page = parsePInt(getSingle(q.page), 1);
  const pageSize = parsePInt(getSingle(q.pageSize), 10);
  const offset = (page - 1) * pageSize;

  // 1. Fetch SharePoint PDFs/PowerBI
  const sharepointDocs: any[] = await prisma.$queryRaw`
    SELECT id, title, document_type, publisher, year, file_size_bytes, filename, sector, mime_type
    FROM trade.resource_documents 
    WHERE is_active = TRUE AND is_published = TRUE
  `;

  // 2. Fetch admin uploads
  const adminDocsRaw = await prisma.kam_content.findMany({
    where: {
      is_active: true,
      content_type: { in: ['PDF', 'POWERBI'] },
      sector_id: -5, 
    },
    include: {
      sector_relation: true
    },
    orderBy: { created_at: 'desc' },
  });

  // 3. Merge and Normalize
  let allRecords = [
    ...sharepointDocs.map((doc) => {
      const fileType = getFileIconType(doc.filename || "", doc.mime_type);
      const isPdf = doc.mime_type?.includes('pdf') || doc.filename?.toLowerCase().endsWith('.pdf');
      
      return {
        id: doc.id,
        title: doc.title,
        url: fileType === "powerbi" ? (doc.filename || `/api/documents/download/${doc.id}`) : `/api/documents/download/${doc.id}`,
        year: doc.year ? String(doc.year) : "2024",
        type: isPdf ? "PDF" : (fileType === "powerbi" ? "POWERBI" : "DOCUMENT"),
        sector: doc.sector || "Trade Intelligence",
        file_size_bytes: doc.file_size_bytes || 0
      };
    }),
    ...adminDocsRaw.map((doc) => {
      const isPowerBI = (doc.content_type || "").toUpperCase() === "POWERBI";
      return {
        id: doc.id,
        title: doc.title,
        url: isPowerBI ? (doc.powerbi_url || `/api/documents/download/${doc.id}`) : `/api/documents/download/${doc.id}`,
        year: doc.published_date ? new Date(doc.published_date).getFullYear().toString() : "2024",
        type: isPowerBI ? "POWERBI" : "PDF",
        sector: doc.sector_relation?.name || "General Trade",
        file_size_bytes: 0
      };
    }),
  ];

  // 4. Filter
  if (yearParam) allRecords = allRecords.filter(r => r.year === yearParam);
  if (categoryParam) allRecords = allRecords.filter(r => r.sector === categoryParam);
  if (searchParam) {
    allRecords = allRecords.filter(r => 
      r.title.toLowerCase().includes(searchParam.toLowerCase())
    );
  }

  // 5. Sidebar Data
  const years = Array.from(new Set(allRecords.map(r => r.year)))
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a))
    .map(y => ({ year: y }));

  const categoriesMap = allRecords.reduce((acc: any, curr) => {
    acc[curr.sector] = (acc[curr.sector] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(categoriesMap).map(cat => ({
    sector: cat,
    count: categoriesMap[cat]
  }));

  const total = allRecords.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginatedRecords = allRecords.slice(offset, offset + pageSize);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800">
      <header className="bg-[#193C8D] py-16 text-white border-b-4 border-yellow-400 shadow-lg">
        <div className="container mx-auto px-6 max-w-7xl">
          <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
            Kenya Association of Manufacturers
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Trade Intelligence <span className="text-yellow-400">Hub</span>
          </h1>
          <p className="text-blue-100/70 text-sm font-medium italic max-w-lg">
            Access protocols, trade agreements, and industrial policy documents.
          </p>
        </div>
      </header>

      {/* Search Bar matching Research style positioning */}
      <div className="relative z-50 -mt-7">
        <div className="container mx-auto px-6 max-w-7xl">
          <form method="GET" className="relative max-w-2xl group">
            <div className="absolute inset-0 bg-black/5 rounded-xl blur-lg" />
            <div className="relative bg-white rounded-xl flex items-center shadow-xl border border-slate-200 overflow-hidden">
               <div className="pl-5 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                name="search" 
                defaultValue={searchParam}
                placeholder="Search trade resources..." 
                className="w-full px-4 py-4 text-sm outline-none text-slate-800 placeholder-slate-400 font-bold"
              />
              <button type="submit" className="bg-[#193C8D] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#0B1E3A] transition-colors">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12">
          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex justify-between">
                Browse By <Filter size={14} className="text-yellow-500" />
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 mb-3 block uppercase">Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    {years.map((y) => (
                      <Link 
                        key={y.year} 
                        href={`/trade?year=${y.year}`}
                        className={`text-xs py-2 rounded-lg border text-center font-bold transition-all ${yearParam === y.year ? 'bg-yellow-400 border-yellow-400 text-blue-900' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-900'}`}
                      >
                        {y.year}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 mb-3 block uppercase">Sector</label>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link 
                        key={cat.sector} 
                        href={`/trade?category=${encodeURIComponent(cat.sector)}`}
                        className={`flex items-center justify-between text-xs font-semibold py-2.5 px-3 rounded-lg transition-all ${categoryParam === cat.sector ? 'bg-blue-50 text-blue-900 border-l-4 border-yellow-400' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        <span className="truncate">{cat.sector}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 rounded">{cat.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/trade" className="inline-flex items-center gap-2 mt-8 text-[10px] font-bold text-slate-400 hover:text-blue-900 uppercase">
                <RotateCcw size={12} /> Clear Filters
              </Link>
            </div>
          </aside>

          {/* Main Content Area */}
          <main>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#193C8D] rounded-lg flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0B1E3A]">Resource Library</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Trade Protocols & Archives</p>
                </div>
              </div>
              <span className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200 uppercase tracking-tighter">
                {total} Resources Found
              </span>
            </div>

            <TradeContent reports={paginatedRecords} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-6">
                <p className="text-xs font-bold text-slate-400 uppercase">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/trade?page=${page - 1}`}
                    className={`px-4 py-2 text-xs font-black border rounded-xl ${page <= 1 ? 'pointer-events-none opacity-30' : 'hover:border-blue-900 transition-all'}`}
                  >
                    ← Prev
                  </Link>
                  <Link
                    href={`/trade?page=${page + 1}`}
                    className={`px-4 py-2 text-xs font-black bg-[#193C8D] text-white rounded-xl ${page >= totalPages ? 'pointer-events-none opacity-30' : 'hover:bg-blue-800 transition-all'}`}
                  >
                    Next →
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}