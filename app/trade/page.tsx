import Link from "next/link";
import { Prisma } from "@prisma/client";
import { 
  Download, 
  FileText, 
  Filter, 
  RotateCcw, 
  Search, 
  ChevronRight,
  BookOpen,
  LayoutGrid,
  List
} from "lucide-react";
import prisma from "@/lib/prisma";

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

interface TradeDocumentRow {
  id: number;
  title: string;
  document_type: string | null;
  publisher: string | null;
  year: number | null;
  file_size_bytes: number | null;
  mime_type: string | null;
  filename: string;
  original_filename: string | null;
  sector: string | null;
}

interface TradeYearRow { year: number | null; }
interface TradeCategoryRow { sector: string | null; count: number; }

function getSingle(v: QueryValue): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function parsePInt(v: string, d: number): number {
  const p = Number.parseInt(v, 10);
  return Number.isFinite(p) && p > 0 ? p : d;
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "0 KB";
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default async function TradePage({ searchParams }: PageProps) {
  // --- START LOGIC (Untouched) ---
  const q = await searchParams;
  const year = getSingle(q.year);
  const category = getSingle(q.category);
  const search = getSingle(q.search).trim();
  const page = parsePInt(getSingle(q.page), 1);
  const pageSize = parsePInt(getSingle(q.pageSize), 10);
  const offset = (page - 1) * pageSize;

  const filters: Prisma.Sql[] = [Prisma.sql`is_active = TRUE AND is_published = TRUE`];
  if (year) filters.push(Prisma.sql`year = ${Number(year)}`);
  if (category) filters.push(Prisma.sql`sector = ${category}`);
  if (search) filters.push(Prisma.sql`title ILIKE ${`%${search}%`} OR filename ILIKE ${`%${search}%`}`);

  const whereClause = filters.length ? Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}` : Prisma.empty;

  let records: TradeDocumentRow[] = [];
  let years: TradeYearRow[] = [];
  let categories: TradeCategoryRow[] = [];
  let total = 0;

  try {
    const [fetchedRecords, totalRows, fetchedYears, fetchedCategories] = await Promise.all([
      prisma.$queryRaw<TradeDocumentRow[]>` 
        SELECT id, title, document_type, publisher, year, file_size_bytes, mime_type, filename, original_filename, sector
        FROM trade.resource_documents ${whereClause}
        ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}
      `,
      prisma.$queryRaw<any[]>`SELECT COUNT(*) AS count FROM trade.resource_documents ${whereClause}`,
      prisma.$queryRaw<TradeYearRow[]>`SELECT DISTINCT year FROM trade.resource_documents WHERE is_active=TRUE AND is_published=TRUE ORDER BY year DESC NULLS LAST`,
      prisma.$queryRaw<TradeCategoryRow[]>`SELECT sector, COUNT(*)::int AS count FROM trade.resource_documents WHERE is_active=TRUE AND is_published=TRUE GROUP BY sector ORDER BY count DESC`,
    ]);

    records = fetchedRecords;
    years = fetchedYears;
    categories = fetchedCategories;
    total = Number(totalRows[0]?.count ?? 0);
  } catch (e) { console.error(e); }

  const totalPages = Math.ceil(total / pageSize) || 1;
  // --- END LOGIC ---

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800">
      
      {/* 1. Header: Professional Blue + Yellow Accent */}
      <header className="bg-[#193C8D] py-16 text-white border-b-4 border-yellow-400 shadow-lg">
        <div className="container mx-auto px-6 max-w-7xl">
          <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
            Kenya Association of Manufacturers
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Trade Intelligence Hub
          </h1>
          <p className="text-blue-100/70 max-w-2xl text-lg font-medium leading-relaxed italic">
            Centralized digital library for industrial policy and sector reports.
          </p>
        </div>
      </header>

      {/* 2. Search Section */}
      <div className="py-6 sticky top-0 bg-white/95 backdrop-blur-md z-40 border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl">
          <form method="GET" className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
              <input 
                name="search" 
                defaultValue={search}
                placeholder="Search resources..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-900/10 outline-none transition-all"
              />
            </div>
            <button type="submit" className="bg-[#002147] hover:bg-blue-800 text-white px-10 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md">
              Filter Hub
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
          
          {/* 3. Filter Sidebar */}
          <aside className="sticky top-32 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-between">
                Browse By <Filter size={14} className="text-yellow-500" />
              </h3>
              
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 mb-3 block uppercase tracking-wider">Publication Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    {years.map((y) => (
                      <Link 
                        key={y.year} 
                        href={`/trade?year=${y.year}`}
                        className={`text-xs py-2.5 rounded-lg border text-center font-bold transition-all ${year === String(y.year) ? 'bg-yellow-400 border-yellow-400 text-blue-900' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-900'}`}
                      >
                        {y.year}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 mb-3 block uppercase tracking-wider">Sector focus</label>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link 
                        key={cat.sector} 
                        href={`/trade?category=${cat.sector}`}
                        className={`flex items-center justify-between text-xs font-semibold py-2.5 px-3 rounded-lg transition-all ${category === cat.sector ? 'bg-blue-50 text-blue-900 border-l-4 border-yellow-400' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        <span className="truncate">{cat.sector}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-white rounded border border-slate-100 text-slate-300">
                          {cat.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/trade" className="inline-flex items-center gap-2 mt-10 text-[10px] font-bold text-slate-400 hover:text-blue-900 uppercase tracking-widest">
                <RotateCcw size={12} /> Clear results
              </Link>
            </div>
          </aside>

          {/* 4. Results List */}
          <main>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                Resource Feed • {total} Items
               </p>
               <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
                  <button className="p-2 bg-white rounded shadow-sm text-blue-900"><List size={18}/></button>
                  <button className="p-2 text-slate-400 hover:text-slate-600"><LayoutGrid size={18}/></button>
               </div>
            </div>

            <div className="space-y-8">
              {records.length > 0 ? records.map((doc) => (
                <div key={doc.id} className="group flex flex-col md:flex-row gap-8 bg-white p-6 rounded-2xl border border-slate-200 hover:border-yellow-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                  
                  {/* REAL IMAGE CONTAINER */}
                  <div className="relative shrink-0 w-full md:w-44 aspect-[3/4.2] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Placeholder Logic for "PDF images" */}
                    <div className="flex flex-col items-center justify-center h-full bg-slate-100 group-hover:bg-slate-200 transition-colors relative">
                        <FileText className="w-10 h-10 text-blue-900/10 mb-2" />
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Official Report</span>
                        
                        {/* Decorative Strip */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-blue-900/5 flex items-center px-4">
                           <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        </div>
                    </div>

                    <Link 
                      href={`/api/documents/download/${doc.id}`} 
                      className="absolute inset-0 bg-[#002147]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-yellow-400 gap-2"
                    >
                      <BookOpen size={24} />
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white">Preview PDF</span>
                    </Link>
                  </div>

                  {/* Document Details */}
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold text-blue-900 uppercase bg-yellow-50 px-3 py-1 rounded border border-yellow-100 tracking-tighter">
                        {doc.sector}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {doc.year} • Ref #{doc.id}
                      </span>
                    </div>

                    <Link 
                      href={`/api/documents/download/${doc.id}`}
                      className="text-xl font-extrabold text-slate-900 hover:text-blue-900 transition-colors mb-4 leading-tight block"
                    >
                      {doc.title}
                    </Link>

                    <p className="text-sm text-slate-500 line-clamp-3 mb-8 italic font-medium">
                      Strategic industrial intelligence regarding the {doc.sector} sector. Essential documentation for trade compliance and market analysis for the {doc.year} period.
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-8 pt-6 border-t border-slate-50">
                      <Link 
                        href={`/api/documents/download/${doc.id}`}
                        className="flex items-center gap-2 text-xs font-black text-blue-900 hover:text-yellow-600 transition-colors uppercase tracking-widest"
                      >
                        <BookOpen size={16} className="text-yellow-500" /> Quick View
                      </Link>
                      <Link 
                        href={`/api/documents/download/${doc.id}`}
                        className="flex items-center gap-2 text-xs font-black text-blue-900 hover:text-yellow-600 transition-colors uppercase tracking-widest"
                        download
                      >
                        <Download size={16} className="text-yellow-500" /> Save PDF ({formatBytes(doc.file_size_bytes)})
                      </Link>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                   <p className="text-slate-400 font-bold uppercase tracking-widest">No matching records</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


// import Link from "next/link";
// import { Prisma } from "@prisma/client";
// import { 
//   Download, 
//   FileText, 
//   Filter, 
//   RotateCcw, 
//   Search, 
//   ChevronRight,
//   Share2,
//   Copy,
//   BookOpen,
//   LayoutGrid,
//   List
// } from "lucide-react";
// import prisma from "@/lib/prisma";

// type QueryValue = string | string[] | undefined;

// interface PageProps {
//   searchParams: Promise<{
//     year?: QueryValue;
//     category?: QueryValue;
//     search?: QueryValue;
//     page?: QueryValue;
//     pageSize?: QueryValue;
//   }>;
// }

// interface TradeDocumentRow {
//   id: number;
//   title: string;
//   document_type: string | null;
//   publisher: string | null;
//   year: number | null;
//   file_size_bytes: number | null;
//   mime_type: string | null;
//   filename: string;
//   original_filename: string | null;
//   sector: string | null;
// }

// interface TradeYearRow { year: number | null; }
// interface TradeCategoryRow { sector: string | null; count: number; }

// function getSingle(v: QueryValue): string {
//   return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
// }

// function parsePInt(v: string, d: number): number {
//   const p = Number.parseInt(v, 10);
//   return Number.isFinite(p) && p > 0 ? p : d;
// }

// function formatBytes(bytes: number | null | undefined): string {
//   if (!bytes) return "Unknown size";
//   if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
//   return `${(bytes / 1048576).toFixed(1)} MB`;
// }

// export default async function TradePage({ searchParams }: PageProps) {
//   const q = await searchParams;
//   const year = getSingle(q.year);
//   const category = getSingle(q.category);
//   const search = getSingle(q.search).trim();
//   const page = parsePInt(getSingle(q.page), 1);
//   const pageSize = parsePInt(getSingle(q.pageSize), 10);
//   const offset = (page - 1) * pageSize;

//   const filters: Prisma.Sql[] = [Prisma.sql`is_active = TRUE AND is_published = TRUE`];
//   if (year) filters.push(Prisma.sql`year = ${Number(year)}`);
//   if (category) filters.push(Prisma.sql`sector = ${category}`);
//   if (search) filters.push(Prisma.sql`title ILIKE ${`%${search}%`} OR filename ILIKE ${`%${search}%`}`);

//   const whereClause = filters.length ? Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}` : Prisma.empty;

//   let records: TradeDocumentRow[] = [];
//   let years: TradeYearRow[] = [];
//   let categories: TradeCategoryRow[] = [];
//   let total = 0;

//   try {
//     const [fetchedRecords, totalRows, fetchedYears, fetchedCategories] = await Promise.all([
//       prisma.$queryRaw<TradeDocumentRow[]>` 
//         SELECT id, title, document_type, publisher, year, file_size_bytes, mime_type, filename, original_filename, sector
//         FROM trade.resource_documents ${whereClause}
//         ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}
//       `,
//       prisma.$queryRaw<any[]>`SELECT COUNT(*) AS count FROM trade.resource_documents ${whereClause}`,
//       prisma.$queryRaw<TradeYearRow[]>`SELECT DISTINCT year FROM trade.resource_documents WHERE is_active=TRUE AND is_published=TRUE ORDER BY year DESC NULLS LAST`,
//       prisma.$queryRaw<TradeCategoryRow[]>`SELECT sector, COUNT(*)::int AS count FROM trade.resource_documents WHERE is_active=TRUE AND is_published=TRUE GROUP BY sector ORDER BY count DESC`,
//     ]);

//     records = fetchedRecords;
//     years = fetchedYears;
//     categories = fetchedCategories;
//     total = Number(totalRows[0]?.count ?? 0);
//   } catch (e) { console.error(e); }

//   const totalPages = Math.ceil(total / pageSize) || 1;

//   return (
//     <div className="min-h-screen bg-slate-50 font-poppins text-slate-900">
      
//       {/* 1. Header: Blue with Yellow Accent */}
//       <header className="bg-gradient-to-br from-blue-900 via-indigo-950 to-black py-24 text-white relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 blur-[100px] rounded-full" />
//         <div className="container mx-auto px-6 max-w-7xl relative z-10">
//           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 mb-8">
//              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]" />
//              <p className="text-xs uppercase tracking-[0.2em] font-bold text-blue-50">
//               {total.toLocaleString()} Resources Available
//             </p>
//           </div>
//           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">
//             Trade <span className="text-yellow-400">Intelligence</span> Hub
//           </h1>
//           <p className="text-blue-100/70 max-w-3xl text-lg font-medium leading-relaxed border-l-4 border-yellow-400 pl-6 italic">
//             A centralized digital library for industrial policy, sector reports, and trade documentation.
//           </p>
//         </div>
//       </header>

//       {/* 2. Sticky Search Bar (Higher Z-index to stay above sidebar) */}
//       <div className="border-b border-slate-200 py-6 sticky top-0 bg-white/95 backdrop-blur-md z-40 shadow-sm">
//         <div className="container mx-auto px-6 max-w-7xl">
//           <form method="GET" className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1 group">
//               <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
//               <input 
//                 name="search" 
//                 defaultValue={search}
//                 placeholder="Search by title, sector, or keyword..." 
//                 className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-14 pr-6 text-base focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all font-medium"
//               />
//             </div>
//             <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-12 py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-yellow-400/20 uppercase tracking-widest active:scale-95">
//               Search Database
//             </button>
//           </form>
//         </div>
//       </div>

//       <div className="container mx-auto px-6 max-w-7xl py-16">
//         <div className="grid lg:grid-cols-[300px_1fr] gap-16 items-start">
          
//           {/* 3. STICKY SIDEBAR */}
//           <aside className="sticky top-32 space-y-10 h-fit">
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
//               <h3 className="text-sm font-black uppercase tracking-widest text-blue-900 border-b-2 border-yellow-400 pb-3 mb-8 flex items-center justify-between">
//                 Refine View
//                 <Filter size={18} className="text-yellow-500" />
//               </h3>
              
//               <div className="space-y-10">
//                 {/* Year Filter */}
//                 <div>
//                   <label className="text-xs uppercase font-bold text-slate-400 mb-5 block tracking-widest">Publication Year</label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {years.slice(0, 8).map((y) => (
//                       <Link 
//                         key={y.year} 
//                         href={`/trade?year=${y.year}`}
//                         className={`text-xs py-3 rounded-xl border text-center transition-all font-bold ${year === String(y.year) ? 'bg-blue-900 text-yellow-400 border-blue-900 shadow-md' : 'bg-slate-50 text-slate-600 border-transparent hover:border-yellow-400 hover:text-blue-900'}`}
//                       >
//                         {y.year}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Category Filter */}
//                 <div>
//                   <label className="text-xs uppercase font-bold text-slate-400 mb-5 block tracking-widest">Sector Focus</label>
//                   <div className="space-y-1">
//                     {categories.slice(0, 12).map((cat) => (
//                       <Link 
//                         key={cat.sector} 
//                         href={`/trade?category=${cat.sector}`}
//                         className={`group flex items-center justify-between text-sm font-semibold py-3 px-4 rounded-xl transition-all ${category === cat.sector ? 'bg-blue-50 text-blue-900 font-bold border-l-4 border-yellow-400' : 'text-slate-600 hover:bg-slate-50'}`}
//                       >
//                         <span className="truncate">{cat.sector}</span>
//                         <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-lg border border-slate-100 text-slate-400 group-hover:text-blue-900">
//                           {cat.count}
//                         </span>
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <Link href="/trade" className="inline-flex items-center gap-2 mt-12 w-full justify-center text-xs font-bold text-slate-400 hover:text-blue-900 uppercase tracking-widest transition-colors">
//                 <RotateCcw size={14} /> Clear filters
//               </Link>
//             </div>
//           </aside>

//           {/* 4. Document List Area */}
//           <main>
//             <div className="flex justify-between items-center mb-12">
//                <div className="h-1.5 w-24 bg-yellow-400 rounded-full" />
//                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
//                   <button className="p-3 bg-blue-900 text-yellow-400 rounded-xl shadow-md"><List size={20}/></button>
//                   <button className="p-3 text-slate-300 hover:text-blue-900"><LayoutGrid size={20}/></button>
//                </div>
//             </div>

//             <div className="space-y-16">
//               {records.map((doc) => (
//                 <div key={doc.id} className="group bg-white rounded-[2.5rem] border border-slate-200 p-8 flex gap-10 items-start transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 overflow-hidden">
                  
//                   {/* DOCUMENT COVER IMAGE (Dynamic Replacement for Icon) */}
//                   <div className="relative shrink-0 w-48 h-64 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-inner group-hover:border-yellow-400/50 transition-colors">
//                     {/* Visual Cover Content */}
//                     <div className="absolute top-0 left-0 right-0 h-14 bg-blue-900 flex items-center px-4">
//                         <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2" />
//                         <span className="text-[8px] font-black text-white uppercase tracking-widest">Report • {doc.year}</span>
//                     </div>
//                     <div className="flex flex-col items-center justify-center h-full pt-10 p-6 text-center">
//                         <FileText className="w-10 h-10 text-slate-100 mb-4" />
//                         <p className="text-[10px] font-black text-slate-900 uppercase leading-snug line-clamp-3 mb-2">{doc.title}</p>
//                         <div className="w-8 h-1 bg-yellow-400 rounded-full" />
//                     </div>
//                     {/* Hover Visual */}
//                     <Link href={`/api/documents/download/${doc.id}`} className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/80 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
//                         <BookOpen className="text-yellow-400 w-12 h-12" />
//                     </Link>
//                   </div>

//                   {/* Document Content */}
//                   <div className="flex flex-col py-2 flex-1">
//                     <div className="flex items-center gap-4 mb-4">
//                       <span className="text-[10px] font-bold text-blue-900 bg-yellow-50 px-4 py-1.5 rounded-lg uppercase tracking-widest border border-yellow-200">
//                         {doc.sector || 'Industry'}
//                       </span>
//                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                         {doc.year || '2026'} • ID #{doc.id}
//                       </span>
//                     </div>

//                     <Link 
//                       href={`/api/documents/download/${doc.id}`}
//                       className="text-2xl font-black text-slate-900 group-hover:text-blue-900 transition-colors leading-tight mb-5"
//                     >
//                       {doc.title}
//                     </Link>

//                     <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-8 pr-12 font-medium italic">
//                       This comprehensive {doc.sector} report covers strategic frameworks and trade data. 
//                       Essential reading for stakeholders monitoring market dynamics as of {doc.year}.
//                     </p>

//                     <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-8">
//                       <div className="flex gap-10">
//                         <Link 
//                             href={`/api/documents/download/${doc.id}`}
//                             className="flex items-center gap-2.5 text-[10px] font-black text-slate-900 hover:text-blue-900 uppercase tracking-widest transition-all"
//                         >
//                             <BookOpen size={16} className="text-yellow-500" />
//                             Quick View
//                         </Link>
//                         <Link 
//                             href={`/api/documents/download/${doc.id}`}
//                             className="flex items-center gap-2.5 text-[10px] font-black text-slate-900 hover:text-blue-900 uppercase tracking-widest transition-all"
//                         >
//                             <Download size={16} className="text-yellow-500" />
//                             Download PDF ({formatBytes(doc.file_size_bytes)})
//                         </Link>
//                       </div>
//                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Official KAM Data</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="pt-24 flex items-center justify-center gap-3 border-t border-slate-100 mt-28">
//                 <Link 
//                   href={`/trade?page=${page - 1}`}
//                   className={`h-14 w-14 flex items-center justify-center rounded-2xl border border-slate-200 transition-all ${page <= 1 ? 'opacity-30 pointer-events-none' : 'hover:border-blue-900 hover:bg-yellow-50'}`}
//                 >
//                   <ChevronRight size={24} className="rotate-180" />
//                 </Link>
                
//                 <div className="flex gap-3 mx-4 px-6 py-3 bg-white rounded-3xl border border-slate-100 shadow-sm">
//                   {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
//                     <Link
//                       key={p}
//                       href={`/trade?page=${p}`}
//                       className={`h-11 w-11 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${p === page ? 'bg-blue-900 text-yellow-400 shadow-xl' : 'hover:bg-slate-50 text-slate-400 hover:text-blue-900'}`}
//                     >
//                       {p}
//                     </Link>
//                   ))}
//                 </div>

//                 <Link 
//                   href={`/trade?page=${page + 1}`}
//                   className={`h-14 w-14 flex items-center justify-center rounded-2xl border border-slate-200 transition-all ${page >= totalPages ? 'opacity-30 pointer-events-none' : 'hover:border-blue-900 hover:bg-yellow-50'}`}
//                 >
//                   <ChevronRight size={24} />
//                 </Link>
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
      
//       <footer className="mt-20 py-24 bg-blue-900 text-center relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />
//           <p className="text-xs font-bold text-blue-300/40 uppercase tracking-[0.8em]">
//             Trade Intelligence Platform • 2026
//           </p>
//       </footer>
//     </div>
//   );
// }



// import Link from "next/link";
// import { Prisma } from "@prisma/client";
// import { Database, Download, FileText, Filter, RotateCcw, Search } from "lucide-react";
// import prisma from "@/lib/prisma";

// type QueryValue = string | string[] | undefined;

// interface PageProps {
//   searchParams: Promise<{
//     year?: QueryValue;
//     category?: QueryValue;
//     search?: QueryValue;
//     page?: QueryValue;
//     pageSize?: QueryValue;
//   }>;
// }

// interface TradeDocumentRow {
//   id: number;
//   title: string;
//   document_type: string | null;
//   publisher: string | null;
//   year: number | null;
//   file_size_bytes: number | null;
//   mime_type: string | null;
//   filename: string;
//   original_filename: string | null;
//   sector: string | null;
// }

// interface TradeYearRow {
//   year: number | null;
// }

// interface TradeCategoryRow {
//   sector: string | null;
//   count: number;
// }

// function getSingle(v: QueryValue): string {
//   return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
// }

// function parsePInt(v: string, d: number): number {
//   const p = Number.parseInt(v, 10);
//   return Number.isFinite(p) && p > 0 ? p : d;
// }

// function formatMB(bytes: number | null | undefined): string {
//   if (!bytes) return "-";
//   return `${(bytes / 1_048_576).toFixed(1)} MB`;
// }

// function formatBytes(bytes: number | null | undefined): string {
//   if (!bytes) return "Unknown";
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
//   return `${(bytes / 1048576).toFixed(1)} MB`;
// }

// export default async function TradePage({ searchParams }: PageProps) {
//   const q = await searchParams;

//   const year = getSingle(q.year);
//   const category = getSingle(q.category);
//   const search = getSingle(q.search).trim();
//   const page = parsePInt(getSingle(q.page), 1);
//   const pageSize = parsePInt(getSingle(q.pageSize), 25);
//   const offset = (page - 1) * pageSize;

//   const filters: Prisma.Sql[] = [Prisma.sql`is_active = TRUE AND is_published = TRUE`];

//   if (year) {
//     filters.push(Prisma.sql`year = ${Number(year)}`);
//   }
//   if (category) {
//     filters.push(Prisma.sql`sector = ${category}` );
//   }
//   if (search) {
//     filters.push(Prisma.sql`title ILIKE ${`%${search}%`} OR filename ILIKE ${`%${search}%`}`);
//   }

//   const whereClause = filters.length
//     ? Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}`
//     : Prisma.empty;

//   let records: TradeDocumentRow[] = [];
//   let years: TradeYearRow[] = [];
//   let categories: TradeCategoryRow[] = [];
//   let total = 0;
//   let databaseError = "";

//   try {
//     const [fetchedRecords, totalRows, fetchedYears, fetchedCategories] = await Promise.all([
//       prisma.$queryRaw<TradeDocumentRow[]>` 
//         SELECT id, title, document_type, publisher, year, file_size_bytes, mime_type, filename, original_filename, sector
//         FROM sector.resource_documents
//         ${whereClause}
//         ORDER BY created_at DESC
//         LIMIT ${pageSize} OFFSET ${offset}
//       `,
//       prisma.$queryRaw<Array<{ count: bigint | number }>>`
//         SELECT COUNT(*) AS count
//         FROM sector.resource_documents
//         ${whereClause}
//       `,
//       prisma.$queryRaw<TradeYearRow[]>` 
//         SELECT DISTINCT year
//         FROM sector.resource_documents
//         WHERE is_active = TRUE AND is_published = TRUE
//         ORDER BY year DESC NULLS LAST
//       `,
//       prisma.$queryRaw<TradeCategoryRow[]>` 
//         SELECT sector, COUNT(*)::int AS count
//         FROM sector.resource_documents
//         WHERE is_active = TRUE AND is_published = TRUE
//         GROUP BY sector
//         ORDER BY count DESC, sector ASC NULLS LAST
//       `,
//     ]);

//     records = fetchedRecords;
//     years = fetchedYears;
//     categories = fetchedCategories;
//     total = Number(totalRows[0]?.count ?? 0);
//   } catch (error) {
//     console.error("Trade page database error:", error);
//     databaseError = "The trade database is currently unavailable.";
//   }

//   const totalPages = Math.ceil(total / pageSize) || 1;
//   const inputStyle =
//     "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

//   const baseParams = new URLSearchParams();
//   if (year) baseParams.set("year", year);
//   if (category) baseParams.set("category", category);
//   if (search) baseParams.set("search", search);
//   baseParams.set("pageSize", String(pageSize));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-2xl">
//         <div className="container mx-auto px-6 py-12">
//           <div className="max-w-4xl mx-auto text-center">
//             <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl mb-6">
//               <Database className="w-8 h-8" />
//               <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
//                 Trade Intelligence Hub
//               </h1>
//             </div>
//             <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
//               Curated trade documents, policy briefs, and sector reports from KAM's document library.
//             </p>
//             <p className="text-blue-200 mt-4 text-lg font-mono bg-black/10 px-4 py-2 rounded-xl inline-block">
//               {total.toLocaleString()} documents • {categories.reduce((sum, c) => sum + c.count, 0)} indexed
//             </p>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto px-6 -mt-12 pb-20">
//         <div className="grid lg:grid-cols-[320px_1fr] gap-8">
//           {/* Sidebar */}
//           <aside className="lg:sticky lg:top-8 lg:max-h-screen lg:overflow-y-auto space-y-6">
//             <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
//                 <Filter className="w-7 h-7 text-blue-600" />
//                 Refine Results
//               </h2>
              
//               <form method="GET" className="space-y-6">
//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 mb-3 block">Search Documents</label>
//                   <div className="relative">
//                     <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
//                     <input 
//                       name="search" 
//                       defaultValue={search} 
//                       placeholder="e.g. sugar sector, policy brief..."
//                       className={`${inputStyle} pl-12`} 
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 mb-3 block">Year</label>
//                   <select name="year" defaultValue={year} className={inputStyle}>
//                     <option value="">All Years</option>
//                     {years.map((row) => row.year != null && (
//                       <option key={row.year} value={String(row.year)}>
//                         {row.year}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 mb-3 block">Category</label>
//                   <select name="category" defaultValue={category} className={inputStyle}>
//                     <option value="">All Categories</option>
//                     {categories.slice(0,10).map((row) => row.sector && (
//                       <option key={row.sector} value={row.sector}>
//                         {row.sector} ({row.count})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 mb-3 block">Per Page</label>
//                   <select name="pageSize" defaultValue={String(pageSize)} className={inputStyle}>
//                     <option value="12">12</option>
//                     <option value="24">24</option>
//                     <option value="36">36</option>
//                   </select>
//                 </div>

//                 <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
//                   Apply Filters
//                 </button>
//               </form>
//             </div>

//             {/* Quick Stats */}
//             <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-6 border border-emerald-100 shadow-lg">
//               <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Stats</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Total Docs</span>
//                   <span className="font-bold text-gray-900">{total.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Categories</span>
//                   <span className="font-bold text-emerald-700">{categories.length}</span>
//                 </div>
//                 <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
//                   <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{width: '80%'}}></div>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* Main Content */}
//           <main>
//             {databaseError ? (
//               <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
//                 <FileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Database Unavailable</h2>
//                 <p className="text-gray-600 max-w-md mx-auto">{databaseError}</p>
//               </div>
//             ) : records.length === 0 ? (
//               <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-20 text-center">
//                 <FileText className="w-20 h-20 text-gray-300 mx-auto mb-8" />
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">No documents match your filters</h2>
//                 <p className="text-gray-600 mb-8">Try adjusting your search terms or year selection above.</p>
//                 <Link href="/trade" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all">
//                   Clear All Filters
//                 </Link>
//               </div>
//             ) : (
//               <>
//                 <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-8">
//                   <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-2xl font-bold flex items-center gap-3">
//                         <Database className="w-8 h-8" />
//                         Trade Documents
//                       </h3>
//                       <span className="text-lg font-bold bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
//                         Page {page} of {totalPages}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Card Grid */}
//                   <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {records.map((r, index) => (
//                       <div key={`${r.id}-${index}`} className="group bg-gradient-to-br from-white to-slate-50 hover:from-blue-50 rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 hover:border-blue-200 p-8 h-full transition-all duration-500 hover:-translate-y-2">
//                         {/* Header */}
//                         <div className="flex items-start justify-between mb-6">
//                           <div className="flex items-center gap-3 flex-wrap">
//                             {r.document_type && (
//                               <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold uppercase rounded-full shadow-md">
//                                 {r.document_type}
//                               </span>
//                             )}
//                             {r.mime_type && (
//                               <span className="px-3 py-1 bg-white/60 text-blue-800 text-xs font-bold uppercase rounded-lg shadow-sm backdrop-blur-sm">
//                                 PDF
//                               </span>
//                             )}
//                           </div>
//                           <span className="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
//                             ID: {r.id}
//                           </span>
//                         </div>

//                         {/* Title */}
//                         <Link href={`/api/documents/download/${r.id}?mode=download`} className="block mb-6 group-hover:text-blue-900 transition-colors">
//                           <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 hover:underline mb-2">
//                             {r.title}
//                           </h3>
//                           <p className="text-sm text-slate-600 line-clamp-1 mb-4">
//                             {r.original_filename || r.filename}
//                           </p>
//                         </Link>

//                         {/* Meta */}
//                         <div className="space-y-2 mb-6">
//                           <div className="flex items-center gap-2 text-sm text-slate-600">
//                             <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
//                             {r.sector}
//                           </div>
//                           <div className="flex items-center gap-4 text-xs text-slate-500">
//                             {r.publisher && (
//                               <span className="flex items-center gap-1">
//                                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
//                                 {r.publisher}
//                               </span>
//                             )}
//                             {r.year && (
//                               <span className="font-mono">{r.year}</span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Size & CTA */}
//                         <div className="flex items-center justify-between pt-6 border-t border-slate-200">
//                           <span className="text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
//                             {formatBytes(r.file_size_bytes)}
//                           </span>
//                           <Link
//                             href={`/api/documents/download/${r.id}?mode=download`}
//                             className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
//                           >
//                             <Download className="w-4 h-4" />
//                             Download PDF
//                           </Link>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-6 flex items-center justify-center gap-4">
//                     <Link
//                       href={`/trade?${new URLSearchParams({ ...Object.fromEntries(baseParams), page: String(page - 1) }).toString()}`}
//                       className={`px-6 py-3 font-bold text-sm uppercase rounded-2xl transition-all shadow-md ${
//                         page <= 1 
//                           ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
//                           : 'bg-gradient-to-r from-gray-800 to-slate-800 hover:from-gray-900 hover:to-slate-900 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
//                       }`}
//                     >
//                       Previous
//                     </Link>
//                     <span className="text-lg font-bold text-gray-700 min-w-[100px] text-center">
//                       {page} / {totalPages}
//                     </span>
//                     <Link
//                       href={`/trade?${new URLSearchParams({ ...Object.fromEntries(baseParams), page: String(page + 1) }).toString()}`}
//                       className={`px-6 py-3 font-bold text-sm uppercase rounded-2xl transition-all shadow-md ${
//                         page >= totalPages 
//                           ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
//                           : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
//                       }`}
//                     >
//                       Next
//                     </Link>
//                   </div>
//                 )}
//               </>
//             )}

//             <div className="mt-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
//               <FileText className="w-4 h-4" />
//               Powered by KAM sector.resource_documents database
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

