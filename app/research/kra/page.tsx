import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Database, Filter, Search, TrendingUp, Globe, BarChart3, RotateCcw } from "lucide-react";
import prisma from "@/lib/prisma";
import KraCharts from "./KraCharts";
import PageSizeSelector from "./PageSizeSelector";

type QueryValue = string | string[] | undefined;

interface PageProps {
  searchParams: Promise<{
    year?: QueryValue; month?: QueryValue; country?: QueryValue;
    flow?: QueryValue; office?: QueryValue; category?: QueryValue;
    search?: QueryValue; page?: QueryValue; pageSize?: QueryValue;
  }>;
}

const POWER_BI_URL = "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getSingle(v: QueryValue): string { return Array.isArray(v) ? v[0] ?? "" : v ?? ""; }
function parsePInt(v: string, d: number): number {
  const p = Number.parseInt(v, 10);
  return Number.isFinite(p) && p > 0 ? p : d;
}
function toNumber(v: any): number { return v == null ? 0 : Number(v); }

export default async function KRAResearchPage({ searchParams }: PageProps) {
  const q = await searchParams;

  const year = getSingle(q.year);
  const month = getSingle(q.month);
  const country = getSingle(q.country);
  const office = getSingle(q.office);
  const category = getSingle(q.category);
  const search = getSingle(q.search).trim();
  const page = parsePInt(getSingle(q.page), 1);
  const pageSize = parsePInt(getSingle(q.pageSize), 15);

  const latest = await prisma.icms_master.aggregate({ _max: { year: true } });
  const effectiveYear = year || String(latest._max.year ?? "2020");

  const filters: Prisma.icms_masterWhereInput[] = [];

  if (effectiveYear) filters.push({ year: Number(effectiveYear) });
  if (month) filters.push({ month: { contains: `-${month.padStart(2, "0")}` } });
  if (country) filters.push({ origin_country: country });
  if (office) filters.push({ station: office });
  if (category) filters.push({ hs_chapter: category });

  if (search) {
    filters.push({
      OR: [
        { entry_number: { contains: search, mode: "insensitive" } },
        { good_description: { contains: search, mode: "insensitive" } },
        { hscode: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  const where: Prisma.icms_masterWhereInput =
    filters.length > 0 ? { AND: filters } : {};

  const [revMonth, declType, records, total, yrs, countries, stations, chapters] =
    await Promise.all([
      prisma.icms_master.groupBy({
        by: ["year", "month"],
        _sum: { fob_value: true },
        where,
        orderBy: [{ year: "asc" }, { month: "asc" }],
      }),
      prisma.icms_master.groupBy({
        by: ["regime"],
        _count: { id: true },
        where,
        orderBy: { _count: { id: "desc" } },
        take: 8,
      }),
      prisma.icms_master.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: "desc" },
      }),
      prisma.icms_master.count({ where }),
      prisma.icms_master.groupBy({ by: ["year"], orderBy: { year: "desc" } }),
      prisma.icms_master.groupBy({
        by: ["origin_country"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
      prisma.icms_master.groupBy({
        by: ["station"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 20,
      }),
      prisma.icms_master.groupBy({
        by: ["hs_chapter"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 25,
      }),
    ]);

  const revCat = revMonth.map(r => r.month || "N/A");
  const revVal = revMonth.map(r => toNumber(r._sum.fob_value));
  const pie = declType.map(d => ({ name: d.regime || "Other", y: d._count.id }));
  const totalPages = Math.ceil(total / pageSize) || 1;

  const inputStyle =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-[Poppins] text-slate-700">

      {/* HEADER */}
      <header className="bg-[#1e3a8a] pt-12 pb-24 text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              KRA Trade Intelligence
            </h1>
            <p className="text-blue-200 mt-2 text-sm italic font-mono">
              Database: icms_master ({total.toLocaleString()} records)
            </p>
          </div>

          <div className="hidden md:block">
            <div className="bg-white/10 px-5 py-3 rounded-xl backdrop-blur border border-white/20 text-center">
              <span className="text-[10px] uppercase font-medium text-blue-300 block">System</span>
              <span className="text-sm font-semibold tracking-wide">Live Feed</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 -mt-16 pb-20">
        <div className="flex flex-col xl:flex-row gap-8">

          {/* FILTERS SIDEBAR */}
          <aside className="w-full xl:w-[300px] shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" /> Filters
                </h2>
                <Link href="/research/kra" className="text-slate-300 hover:text-blue-600 transition">
                  <RotateCcw className="h-3.5 w-3.5" />
                </Link>
              </div>

              <form method="GET" className="space-y-5">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input name="search" defaultValue={search} placeholder="Entry or HS Code"
                      className={`${inputStyle} pl-9`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select name="year" defaultValue={effectiveYear} className={inputStyle}>
                    {yrs.map(y => <option key={String(y.year)} value={String(y.year)}>{y.year}</option>)}
                  </select>
                  <select name="month" defaultValue={month} className={inputStyle}>
                    <option value="">Month</option>
                    {MONTH_NAMES.map((m, i) => (
                      <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                    ))}
                  </select>
                </div>

                <select name="country" defaultValue={country} className={inputStyle}>
                  <option value="">Country</option>
                  {countries.map(c => (
                    <option key={c.origin_country!} value={c.origin_country!}>{c.origin_country}</option>
                  ))}
                </select>

                <select name="category" defaultValue={category} className={inputStyle}>
                  <option value="">HS Category</option>
                  {chapters.map(ch => (
                    <option key={ch.hs_chapter!} value={ch.hs_chapter!}>Chapter {ch.hs_chapter}</option>
                  ))}
                </select>

                <button type="submit"
                  className="w-full bg-[#1e3a8a] text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 shadow-md transition active:scale-95">
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 h-[520px]">
                <iframe
                  title="PowerBI"
                  src={POWER_BI_URL}
                  className="w-full h-full rounded-xl border-0"
                />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                    <Database className="h-4 w-4 text-blue-600" /> Declarations Log
                  </h3>
                  <PageSizeSelector currentSize={pageSize} />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-tight">
                      <tr>
                        <th className="px-6 py-4 text-left">Entry Number</th>
                        <th className="px-6 py-4 text-left">Description</th>
                        <th className="px-6 py-4 text-left">Location</th>
                        <th className="px-6 py-4 text-right">FOB Value (KES)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-t">
                      {records.map(r => (
                        <tr key={r.id} className="hover:bg-blue-50/40 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-mono font-bold text-blue-900">{r.entry_number}</div>
                            <div className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">Ref: {r.id}</div>
                          </td>
                          <td className="px-6 py-4 max-w-xs md:max-w-md">
                            <div className="flex gap-2 mb-1.5">
                              <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                                {r.regime}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                              {r.good_description}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-800 font-bold text-xs">{r.origin_country}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-medium">{r.station}</div>
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                            {toNumber(r.fob_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                  <span className="text-[11px] font-medium text-slate-400">Total: {total.toLocaleString()} records</span>
                  <div className="flex gap-2">
                    <Link href={`?page=${page - 1}&pageSize=${pageSize}`}
                      className={`text-[11px] font-bold uppercase px-4 py-2 border rounded-xl bg-white transition hover:bg-slate-50 ${page <= 1 ? "opacity-20 pointer-events-none" : ""}`}>
                      Back
                    </Link>
                    <Link href={`?page=${page + 1}&pageSize=${pageSize}`}
                      className={`text-[11px] font-bold uppercase px-4 py-2 bg-[#1e3a8a] text-white rounded-xl shadow-md transition hover:bg-blue-800 ${page >= totalPages ? "opacity-20 pointer-events-none" : ""}`}>
                      Next
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR: Strategic Insights Column */}
            <div className="space-y-6 lg:sticky lg:top-8">
              
              {/* TOP PARTNERS: Now using the Yellow Brand color (#facc15) */}
              <div className="bg-[#facc15] text-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-5">
                    <TrendingUp className="h-4 w-4 text-slate-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Market Presence</h4>
                  </div>
                  <h3 className="text-lg font-bold mb-4 tracking-tight">Top Trade Partners</h3>
                  <div className="space-y-3.5">
                    {countries.slice(0, 3).map((c, i) => (
                      <div key={i} className="flex justify-between items-center group/item">
                        <span className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                          <Globe className="h-4 w-4 text-slate-600" /> {c.origin_country}
                        </span>
                        <div className="flex flex-col items-end">
                           <span className="font-mono font-bold text-slate-900">{c._count.id.toLocaleString()}</span>
                           <span className="text-[9px] uppercase font-bold text-slate-500">declarations</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Visual Flair background icon */}
                <BarChart3 className="absolute -right-6 -bottom-6 h-28 w-28 text-black/5 pointer-events-none group-hover:scale-110 transition-transform" />
              </div>

              {/* CHARTS CARD */}
              <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest">Statistical Trends</h4>
                <KraCharts revenue={{ categories: revCat, data: revVal }} declarationTypes={pie} />
              </div>

              {/* STAT SUMMARY CARD */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="bg-blue-50 p-3 rounded-xl">
                    <Database className="h-5 w-5 text-blue-600" />
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Total Dataset</p>
                    <p className="text-lg font-black text-slate-800 leading-none">{total.toLocaleString()}</p>
                 </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// import Link from "next/link";
// import { Prisma } from "@prisma/client";
// import { BarChart3, Database, Filter, Search } from "lucide-react";
// import prisma from "@/lib/prisma";
// import KraCharts from "./KraCharts";

// type QueryValue = string | string[] | undefined;

// interface PageProps {
//   searchParams: Promise<{
//     year?: QueryValue;
//     month?: QueryValue;
//     country?: QueryValue;
//     flow?: QueryValue;
//     office?: QueryValue;
//     category?: QueryValue;
//     fromDate?: QueryValue;
//     toDate?: QueryValue;
//     search?: QueryValue;
//     page?: QueryValue;
//     pageSize?: QueryValue;
//   }>;
// }

// const POWER_BI_URL =
//   "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9";

// const MONTH_NAMES = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
// const DEFAULT_PAGE_SIZE = 25;

// function getSingle(value: QueryValue): string {
//   if (Array.isArray(value)) {
//     return value[0] ?? "";
//   }
//   return value ?? "";
// }

// function parsePositiveInt(raw: string, fallback: number): number {
//   const parsed = Number.parseInt(raw, 10);
//   return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
// }

// function toNumber(value: Prisma.Decimal | number | null | undefined): number {
//   if (value == null) {
//     return 0;
//   }
//   return Number(value);
// }

// function formatCurrency(value: number): string {
//   return new Intl.NumberFormat("en-KE", {
//     style: "currency",
//     currency: "KES",
//     maximumFractionDigits: 0,
//   }).format(value);
// }

// function toMonthLabel(year: number | null, month: string | null): string {
//   if (!month && year) {
//     return String(year);
//   }

//   if (month) {
//     const parts = month.split("-");
//     const monthToken = parts[parts.length - 1] ?? "";
//     const monthNumber = Number.parseInt(monthToken, 10);
//     const monthName = monthNumber >= 1 && monthNumber <= 12 ? MONTH_NAMES[monthNumber - 1] : month;
//     const resolvedYear = year ?? Number.parseInt(parts[0] ?? "", 10);

//     if (Number.isFinite(resolvedYear)) {
//       return `${monthName} ${resolvedYear}`;
//     }

//     return monthName;
//   }

//   return "Unspecified";
// }

// function buildQueryString(
//   current: Record<string, string>,
//   overrides: Record<string, string>
// ): string {
//   const params = new URLSearchParams();

//   Object.entries({ ...current, ...overrides }).forEach(([key, value]) => {
//     if (value) {
//       params.set(key, value);
//     }
//   });

//   return params.toString();
// }

// export default async function KRAResearchPage({ searchParams }: PageProps) {
//   const query = await searchParams;

//   const year = getSingle(query.year);
//   const month = getSingle(query.month);
//   const country = getSingle(query.country);
//   const flow = getSingle(query.flow);
//   const office = getSingle(query.office);
//   const category = getSingle(query.category);
//   const fromDate = getSingle(query.fromDate);
//   const toDate = getSingle(query.toDate);
//   const search = getSingle(query.search).trim();

//   const page = parsePositiveInt(getSingle(query.page), 1);
//   const requestedPageSize = parsePositiveInt(getSingle(query.pageSize), DEFAULT_PAGE_SIZE);
//   const pageSize = PAGE_SIZE_OPTIONS.includes(requestedPageSize as (typeof PAGE_SIZE_OPTIONS)[number])
//     ? requestedPageSize
//     : DEFAULT_PAGE_SIZE;

//   const latestYear = await prisma.icms_master.aggregate({
//     _max: { year: true },
//     where: { year: { not: null } },
//   });

//   // Use the latest year by default to keep first load fast on very large tables.
//   const effectiveYear = year || String(latestYear._max.year ?? "");

//   const filters: Prisma.icms_masterWhereInput[] = [];

//   if (effectiveYear) {
//     filters.push({ year: parsePositiveInt(effectiveYear, 0) || undefined });
//   }

//   if (month) {
//     filters.push({ month: { contains: `-${month}` } });
//   }

//   if (country) {
//     filters.push({ origin_country: { equals: country, mode: "insensitive" } });
//   }

//   if (flow) {
//     filters.push({ regime: { startsWith: flow, mode: "insensitive" } });
//   }

//   if (office) {
//     filters.push({ station: { contains: office, mode: "insensitive" } });
//   }

//   if (category) {
//     filters.push({ hs_chapter: { equals: category, mode: "insensitive" } });
//   }

//   const from = fromDate ? new Date(fromDate) : null;
//   const to = toDate ? new Date(toDate) : null;

//   if (from || to) {
//     filters.push({
//       created_at: {
//         ...(from && !Number.isNaN(from.getTime()) ? { gte: from } : {}),
//         ...(to && !Number.isNaN(to.getTime()) ? { lte: to } : {}),
//       },
//     });
//   }

//   if (search) {
//     filters.push({
//       OR: [
//         { entry_number: { contains: search, mode: "insensitive" } },
//         { good_description: { contains: search, mode: "insensitive" } },
//         { hscode: { contains: search, mode: "insensitive" } },
//       ],
//     });
//   }

//   const where: Prisma.icms_masterWhereInput = filters.length > 0 ? { AND: filters } : {};
//   const skip = (page - 1) * pageSize;

//   const [
//     revenueByMonth,
//     declarationByType,
//     records,
//     totalRecords,
//     years,
//     countries,
//     flows,
//     offices,
//     categories,
//   ] = await Promise.all([
//     prisma.icms_master.groupBy({
//       by: ["year", "month"],
//       _sum: { fob_value: true },
//       where,
//       orderBy: [{ year: "asc" }, { month: "asc" }],
//     }),
//     prisma.icms_master.groupBy({
//       by: ["regime"],
//       _count: { id: true },
//       where,
//       orderBy: { _count: { id: "desc" } },
//       take: 8,
//     }),
//     prisma.icms_master.findMany({
//       where,
//       select: {
//         id: true,
//         entry_number: true,
//         hscode: true,
//         good_description: true,
//         origin_country: true,
//         regime: true,
//         station: true,
//         year: true,
//         month: true,
//         fob_value: true,
//         import_duty: true,
//         created_at: true,
//       },
//       skip,
//       take: pageSize,
//       orderBy: [{ created_at: "desc" }, { id: "desc" }],
//     }),
//     prisma.icms_master.count({ where }),
//     prisma.icms_master.groupBy({
//       by: ["year"],
//       where: { year: { not: null } },
//       orderBy: { year: "desc" },
//       take: 10,
//     }),
//     prisma.icms_master.groupBy({
//       by: ["origin_country"],
//       where: { origin_country: { not: null } },
//       _count: { id: true },
//       orderBy: { _count: { id: "desc" } },
//       take: 50,
//     }),
//     prisma.icms_master.groupBy({
//       by: ["regime"],
//       where: { regime: { not: null } },
//       _count: { id: true },
//       orderBy: { _count: { id: "desc" } },
//       take: 20,
//     }),
//     prisma.icms_master.groupBy({
//       by: ["station"],
//       where: { station: { not: null } },
//       _count: { id: true },
//       orderBy: { _count: { id: "desc" } },
//       take: 25,
//     }),
//     prisma.icms_master.groupBy({
//       by: ["hs_chapter"],
//       where: { hs_chapter: { not: null } },
//       _count: { id: true },
//       orderBy: { _count: { id: "desc" } },
//       take: 20,
//     }),
//   ]);

//   const revenueCategories = revenueByMonth.map((entry) =>
//     toMonthLabel(entry.year ?? null, entry.month ?? null)
//   );
//   const revenueData = revenueByMonth.map((entry) => toNumber(entry._sum.fob_value));

//   const declarationTypeData = declarationByType.map((entry) => ({
//     name: entry.regime || "Unspecified",
//     y: entry._count.id,
//   }));

//   const tableRows = records.map((record) => ({
//     id: record.id,
//     entryNumber: record.entry_number || "-",
//     hsCode: record.hscode || "-",
//     description: record.good_description || "-",
//     originCountry: record.origin_country || "-",
//     regime: record.regime || "-",
//     station: record.station || "-",
//     period: toMonthLabel(record.year ?? null, record.month ?? null),
//     fobValue: toNumber(record.fob_value),
//     customsDuty: toNumber(record.import_duty),
//   }));

//   const baseParams: Record<string, string> = {
//     year: effectiveYear,
//     month,
//     country,
//     flow,
//     office,
//     category,
//     fromDate,
//     toDate,
//     search,
//     pageSize: String(pageSize),
//   };

//   const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
//   const safePage = Math.min(page, totalPages);

//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">
//       <section className="bg-[#193C8D] py-14 text-white">
//         <div className="container mx-auto px-6">
//           <p className="mb-3 text-xs font-black uppercase text-[#E7B947]">Institutional Portal</p>
//           <h1 className="mb-3 text-4xl font-black md:text-5xl">KRA Trade Intelligence</h1>
//           <p className="max-w-3xl text-white/80">
//             Live ICMS data streams with aggregate trade analytics and declaration drill-downs.
//           </p>
//         </div>
//       </section>

//       <div className="container mx-auto flex flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start">
//         <aside className="w-full rounded-2xl border border-zinc-200 bg-white p-6 lg:sticky lg:top-24 lg:w-[320px]">
//           <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-[#193C8D]">
//             <Filter className="h-4 w-4 text-[#E7B947]" />
//             Filter Intelligence
//           </h3>

//           <form method="GET" action="/research/kra" className="space-y-4">
//             <div>
//               <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Search</label>
//               <div className="relative">
//                 <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
//                 <input
//                   name="search"
//                   defaultValue={search}
//                   placeholder="Entry no, HS code, description"
//                   className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3 text-sm"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">From</label>
//                 <input type="date" name="fromDate" defaultValue={fromDate} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm" />
//               </div>
//               <div>
//                 <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">To</label>
//                 <input type="date" name="toDate" defaultValue={toDate} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm" />
//               </div>
//             </div>

//             <div>
//               <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Year</label>
//               <select name="year" defaultValue={effectiveYear} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm">
//                 <option value="">All Years</option>
//                 {years
//                   .filter((y) => y.year != null)
//                   .map((y) => (
//                     <option key={String(y.year)} value={String(y.year)}>
//                       {y.year}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Month</label>
//               <select name="month" defaultValue={month} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm">
//                 <option value="">All Months</option>
//                 {MONTH_NAMES.map((monthName, index) => {
//                   const monthValue = String(index + 1).padStart(2, "0");
//                   return (
//                     <option key={monthValue} value={monthValue}>
//                       {monthName}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Category (HS Chapter)</label>
//               <select name="category" defaultValue={category} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm">
//                 <option value="">All Categories</option>
//                 {categories
//                   .filter((item) => item.hs_chapter)
//                   .map((item) => (
//                     <option key={item.hs_chapter as string} value={item.hs_chapter as string}>
//                       {item.hs_chapter}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Country</label>
//               <select name="country" defaultValue={country} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm">
//                 <option value="">All Countries</option>
//                 {countries
//                   .filter((item) => item.origin_country)
//                   .map((item) => (
//                     <option key={item.origin_country as string} value={item.origin_country as string}>
//                       {item.origin_country}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Flow / Regime</label>
//               <select name="flow" defaultValue={flow} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm">
//                 <option value="">All Flows</option>
//                 {flows
//                   .filter((item) => item.regime)
//                   .map((item) => (
//                     <option key={item.regime as string} value={item.regime as string}>
//                       {item.regime}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Office / Station</label>
//               <select name="office" defaultValue={office} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm">
//                 <option value="">All Offices</option>
//                 {offices
//                   .filter((item) => item.station)
//                   .map((item) => (
//                     <option key={item.station as string} value={item.station as string}>
//                       {item.station}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Rows Per Page</label>
//               <select name="pageSize" defaultValue={String(pageSize)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm">
//                 {PAGE_SIZE_OPTIONS.map((size) => (
//                   <option key={size} value={size}>
//                     {size}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="grid grid-cols-2 gap-2 pt-2">
//               <button type="submit" className="rounded-xl bg-[#193C8D] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#142f6f]">
//                 Apply
//               </button>
//               <Link href="/research/kra" className="rounded-xl border border-zinc-300 px-4 py-2.5 text-center text-sm font-bold text-zinc-700 hover:bg-zinc-100">
//                 Reset
//               </Link>
//             </div>
//           </form>
//         </aside>

//         <main className="w-full space-y-8">
//           <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
//             <article className="rounded-2xl border border-zinc-200 bg-white shadow-sm xl:col-span-2">
//               <div className="border-b border-zinc-200 px-5 py-4">
//                 <h2 className="flex items-center gap-2 text-lg font-black text-zinc-900">
//                   <BarChart3 className="h-5 w-5 text-[#193C8D]" />
//                   ICMS Trade Dashboard
//                 </h2>
//               </div>
//               <iframe
//                 title="ICMS Trade Dashboard"
//                 src={POWER_BI_URL}
//                 width="100%"
//                 height="650"
//                 allowFullScreen
//                 className="w-full"
//               />
//             </article>

//             <article>
//               <KraCharts
//                 revenue={{ categories: revenueCategories, data: revenueData }}
//                 declarationTypes={declarationTypeData}
//               />
//             </article>
//           </section>

//           <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
//             <div className="flex flex-col gap-2 border-b border-zinc-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
//               <h2 className="flex items-center gap-2 text-lg font-black text-zinc-900">
//                 <Database className="h-5 w-5 text-green-600" />
//                 ICMS Declaration Records
//               </h2>
//               <p className="text-sm text-zinc-600">
//                 Showing {(safePage - 1) * pageSize + 1} - {Math.min(safePage * pageSize, totalRecords)} of {totalRecords.toLocaleString()} rows
//               </p>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[920px] text-left text-sm">
//                 <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
//                   <tr>
//                     <th className="px-4 py-3">Entry Number</th>
//                     <th className="px-4 py-3">HS Code</th>
//                     <th className="px-4 py-3">Description</th>
//                     <th className="px-4 py-3">Origin Country</th>
//                     <th className="px-4 py-3">Regime</th>
//                     <th className="px-4 py-3">Station</th>
//                     <th className="px-4 py-3">Period</th>
//                     <th className="px-4 py-3">FOB Value</th>
//                     <th className="px-4 py-3">Customs Duty</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tableRows.length === 0 ? (
//                     <tr>
//                       <td colSpan={9} className="px-4 py-6 text-center text-zinc-500">
//                         No declarations found for the selected filters.
//                       </td>
//                     </tr>
//                   ) : (
//                     tableRows.map((row) => (
//                       <tr key={row.id} className="border-t border-zinc-200 odd:bg-white even:bg-zinc-50/60">
//                         <td className="px-4 py-3 font-medium text-zinc-800">{row.entryNumber}</td>
//                         <td className="px-4 py-3">{row.hsCode}</td>
//                         <td className="max-w-[300px] truncate px-4 py-3" title={row.description}>{row.description}</td>
//                         <td className="px-4 py-3">{row.originCountry}</td>
//                         <td className="px-4 py-3">{row.regime}</td>
//                         <td className="px-4 py-3">{row.station}</td>
//                         <td className="px-4 py-3">{row.period}</td>
//                         <td className="px-4 py-3">{formatCurrency(row.fobValue)}</td>
//                         <td className="px-4 py-3">{formatCurrency(row.customsDuty)}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-4">
//               <Link
//                 href={`/research/kra?${buildQueryString(baseParams, { page: String(Math.max(1, safePage - 1)) })}`}
//                 className={`rounded-lg px-3 py-2 text-sm font-semibold ${
//                   safePage <= 1 ? "pointer-events-none bg-zinc-100 text-zinc-400" : "bg-zinc-900 text-white hover:bg-zinc-700"
//                 }`}
//               >
//                 Previous
//               </Link>
//               <span className="text-sm text-zinc-600">
//                 Page {safePage} of {totalPages}
//               </span>
//               <Link
//                 href={`/research/kra?${buildQueryString(baseParams, { page: String(Math.min(totalPages, safePage + 1)) })}`}
//                 className={`rounded-lg px-3 py-2 text-sm font-semibold ${
//                   safePage >= totalPages ? "pointer-events-none bg-zinc-100 text-zinc-400" : "bg-zinc-900 text-white hover:bg-zinc-700"
//                 }`}
//               >
//                 Next
//               </Link>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }
