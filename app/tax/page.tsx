import Link from "next/link";
import { 
  Filter, 
  RotateCcw, 
  Search, 
  BookOpen
} from "lucide-react";
import prisma from "@/lib/prisma";
import TaxContent from "./TaxContent";

// 1. Define the interface for our cleaned data
interface TaxRecord {
  id: number;
  title: string;
  url: string;
  year: string;
  type: string;
  sector: string;
}

type QueryValue = string | string[] | undefined;

interface PageProps {
  searchParams: Promise<{
    year?: QueryValue;
    category?: QueryValue;
    search?: QueryValue;
    page?: QueryValue;
  }>;
}

function getSingle(v: QueryValue): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function TaxReportsPage({ searchParams }: PageProps) {
  const q = await searchParams;
  
  // Extract Search and Filter Params
  const yearParam = getSingle(q.year);
  const categoryParam = getSingle(q.category); 
  const searchParam = getSingle(q.search).trim();
  const currentPage = Math.max(1, parseInt(getSingle(q.page) || "1"));
  const pageSize = 6;

  // Fetch Data
  const taxDocs = await prisma.kam_content.findMany({
    where: {
      is_active: true,
      visibility: 'PUBLIC',
      sector_id: -3, 
    },
    include: {
      sector_relation: true
    },
    orderBy: { 
      published_date: 'desc' 
    },
  });

  // 2. Normalize Logic - doc is explicitly typed as 'any' to clear TS7006
  let allRecords: TaxRecord[] = taxDocs.map((doc: any) => {
    const isPdf = doc.content_type === "PDF" || (doc.pdf_url && !doc.powerbi_url);
    const downloadUrl = isPdf 
      ? `/api/documents/download/admin-${doc.id}` 
      : (doc.powerbi_embed || doc.powerbi_url || doc.pdf_url || '#');

    return {
      id: doc.id,
      title: doc.title || "Untitled Report",
      url: downloadUrl,
      year: doc.published_date ? new Date(doc.published_date).getFullYear().toString() : '2024',
      type: doc.content_type || (isPdf ? "PDF" : "POWERBI"),
      sector: doc.sector_relation?.name || "Tax & Fiscal Policy",
    };
  });

  // 3. Apply Filters - r is explicitly typed to clear TS errors
  if (yearParam) {
    allRecords = allRecords.filter((r: TaxRecord) => r.year === yearParam);
  }
  if (categoryParam) {
    allRecords = allRecords.filter((r: TaxRecord) => r.type === categoryParam);
  }
  if (searchParam) {
    allRecords = allRecords.filter((r: TaxRecord) => 
      r.title.toLowerCase().includes(searchParam.toLowerCase())
    );
  }

  // Pagination Calculations
  const totalItems = allRecords.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedRecords = allRecords.slice(
    (currentPage - 1) * pageSize, 
    currentPage * pageSize
  );

  // Aggregate Data for Sidebar
  const years = Array.from(new Set(allRecords.map((r: TaxRecord) => r.year))).sort((a, b) => b.localeCompare(a));
  const types = Array.from(new Set(allRecords.map((r: TaxRecord) => r.type)));

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800">
      <header className="bg-[#193C8D] py-16 text-white border-b-4 border-yellow-400 shadow-lg">
        <div className="container mx-auto px-6 max-w-7xl">
          <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
            Kenya Association of Manufacturers
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Tax Performance <span className="text-yellow-400">Reports</span>
          </h1>
          <p className="text-blue-100/70 text-sm font-medium italic max-w-lg">
            Access official tax performance analysis and industrial fiscal reports.
          </p>
        </div>
      </header>

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
                placeholder="Search tax resources..." 
                className="w-full px-4 py-4 text-sm outline-none text-slate-800 placeholder-slate-400 font-bold"
              />
              <button type="submit" className="bg-[#193C8D] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#0B1E3A]">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12">
          <aside className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex justify-between">
                Filters <Filter size={14} className="text-yellow-500" />
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 mb-3 block uppercase tracking-tighter">Publication Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    {years.map((y) => (
                      <Link 
                        key={y} 
                        href={`/tax?year=${y}${categoryParam ? `&category=${categoryParam}` : ''}`}
                        className={`text-xs py-2 rounded-lg border text-center font-bold transition-all ${yearParam === y ? 'bg-yellow-400 border-yellow-400 text-blue-900' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-900'}`}
                      >
                        {y}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 mb-3 block uppercase tracking-tighter">Resource Type</label>
                  <div className="space-y-2">
                    {types.map((t) => (
                      <Link 
                        key={t} 
                        href={`/tax?category=${t}${yearParam ? `&year=${yearParam}` : ''}`}
                        className={`flex items-center justify-between text-xs font-semibold py-2.5 px-3 rounded-lg border transition-all ${categoryParam === t ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'}`}
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/tax" className="inline-flex items-center gap-2 mt-8 text-[10px] font-bold text-slate-400 hover:text-blue-900 uppercase">
                <RotateCcw size={12} /> Reset All
              </Link>
            </div>
          </aside>

          <main>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#193C8D] rounded-lg flex items-center justify-center shadow-lg text-white">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#0B1E3A]">Report Library</h2>
              </div>
              <span className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200 uppercase">
                {totalItems} Items
              </span>
            </div>

            <TaxContent reports={paginatedRecords} />

            {totalPages > 1 && (
              <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/tax?page=${currentPage - 1}${yearParam ? `&year=${yearParam}` : ''}${categoryParam ? `&category=${categoryParam}` : ''}`}
                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest border rounded-xl transition-all ${currentPage <= 1 ? 'pointer-events-none opacity-30' : 'hover:border-[#193C8D] hover:text-[#193C8D]'}`}
                  >
                    Previous
                  </Link>
                  <Link
                    href={`/tax?page=${currentPage + 1}${yearParam ? `&year=${yearParam}` : ''}${categoryParam ? `&category=${categoryParam}` : ''}`}
                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-[#193C8D] text-white rounded-xl transition-all ${currentPage >= totalPages ? 'pointer-events-none opacity-30' : 'hover:bg-[#0B1E3A]'}`}
                  >
                    Next
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