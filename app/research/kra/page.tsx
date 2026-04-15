import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Database, Filter, Search, TrendingUp, Globe, BarChart3, RotateCcw, FileText, BarChart2 } from "lucide-react";
import prisma from "@/lib/prisma";
import KraCharts from "./KraCharts";
import PageSizeSelector from "./PageSizeSelector";
import { fetchKRAResearchResources } from "@/lib/documents";

type QueryValue = string | string[] | undefined;

interface PageProps {
  searchParams: Promise<{
    year?: QueryValue; month?: QueryValue; country?: QueryValue;
    flow?: QueryValue; office?: QueryValue; category?: QueryValue;
    search?: QueryValue; page?: QueryValue; pageSize?: QueryValue;
  }>;
}

const POWER_BI_URL = "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getSingle(v: QueryValue): string { return Array.isArray(v) ? v[0] ?? "" : v ?? ""; }
function parsePInt(v: string, d: number): number {
  const p = Number.parseInt(v, 10);
  return Number.isFinite(p) && p > 0 ? p : d;
}
function toNumber(v: any): number { return v == null ? 0 : Number(v); }

export default async function KraTradeIntelligencePage({ searchParams }: PageProps) {
  const q = await searchParams;

  const year = getSingle(q.year);
  const month = getSingle(q.month);
  const country = getSingle(q.country);
  const office = getSingle(q.office);
  const category = getSingle(q.category);
  const search = getSingle(q.search).trim();
  const page = parsePInt(getSingle(q.page), 1);
  const pageSize = parsePInt(getSingle(q.pageSize), 15);

  const [uploadedResources, kraKamContent, latest] = await Promise.all([
    fetchKRAResearchResources(),
    prisma.kam_content.findMany({
      where: {
        OR: [
          { sector_id: -1, tags: { contains: "kra", mode: "insensitive" } },
          { tags: { contains: "kra", mode: "insensitive" } }
        ],
        is_active: true,
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.icms_master.aggregate({ _max: { year: true } })
  ]);

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

  const where: Prisma.icms_masterWhereInput = filters.length > 0 ? { AND: filters } : {};

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
        where, // Apply filters to the top partners too
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
      prisma.icms_master.groupBy({
        by: ["station"],
        _count: { id: true },
        where,
        orderBy: { _count: { id: "desc" } },
        take: 20,
      }),
      prisma.icms_master.groupBy({
        by: ["hs_chapter"],
        _count: { id: true },
        where,
        orderBy: { _count: { id: "desc" } },
        take: 25,
      }),
    ]);

  const revCat = revMonth.map(r => r.month || "N/A");
  const revVal = revMonth.map(r => toNumber(r._sum.fob_value));
  const pie = declType.map(d => ({ name: d.regime || "Other", y: d._count.id }));
  const totalPages = Math.ceil(total / pageSize) || 1;

  const allResources: any[] = uploadedResources.map((doc: any) => ({
    ...doc,
    raw_id: doc.id,
    id: `upload-${doc.id}`,
    display_type: doc.content_type || doc.document_type || "Document"
  }));

  const existingTitles = new Set(allResources.map(res => res.title.toLowerCase().trim()));

  kraKamContent.forEach(c => {
    const normalizedTitle = c.title.toLowerCase().trim();
    if (!existingTitles.has(normalizedTitle)) {
      allResources.push({
        raw_id: c.id,
        id: `kam-${c.id}`,
        title: c.title,
        description: c.description,
        sector: "KRA Research",
        display_type: c.content_type || "Document",
        year: c.published_date ? new Date(c.published_date).getFullYear() : 2024,
        publisher: "KAM Upload",
        pdf_url: (c as any).pdf_url || (c as any).file_url || null,
        powerbi_url: (c as any).powerbi_url || null
      });
      existingTitles.add(normalizedTitle);
    }
  });

  const inputStyle = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-[Poppins] text-slate-700">
      <header className="bg-[#1e3a8a] pt-12 pb-24 text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">KRA Trade Intelligence</h1>
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

      <div className="container mx-auto px-6 -mt-16 pb-20 space-y-8">
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-[#193C8D]" />
            <h2 className="text-xl font-bold text-[#193C8D]">Uploaded Research Resources</h2>
            <span className="ml-2 text-xs font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
              {allResources.length} UNIQUE RESOURCES
            </span>
          </div>

          {allResources.length === 0 ? (
            <div className="text-slate-400 italic">No uploaded research resources found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allResources.map((doc: any) => (
                <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-lg transition">
                  <div className="flex items-center gap-2 mb-1">
                    {doc.display_type?.toLowerCase().includes("powerbi") ? (
                      <BarChart2 className="w-5 h-5 text-amber-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {doc.display_type}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 truncate" title={doc.title}>{doc.title}</div>
                  <div className="text-xs text-slate-400">{doc.year || ""} {doc.publisher ? `• ${doc.publisher}` : ""}</div>
                  <div className="flex gap-4 mt-2">
                    <Link href={`/resources/${doc.raw_id}`} className="text-xs font-bold text-blue-700 hover:underline">
                      View Resource
                    </Link>
                    {doc.pdf_url && (
                      <a href={doc.pdf_url} download className="text-xs font-bold text-slate-400 hover:text-blue-700 flex items-center gap-1 transition-colors">
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <iframe title="KRA Trade Intelligence" src={POWER_BI_URL} className="w-full aspect-video border-0 block" allowFullScreen />
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          <aside className="w-full xl:w-[220px] shrink-0">
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
                    <input name="search" defaultValue={search} placeholder="HS Code or Desc" className={`${inputStyle} pl-9`} />
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
                  {countries.map(c => <option key={c.origin_country!} value={c.origin_country!}>{c.origin_country}</option>)}
                </select>
                <select name="category" defaultValue={category} className={inputStyle}>
                  <option value="">HS Category</option>
                  {chapters.map(ch => <option key={ch.hs_chapter!} value={ch.hs_chapter!}>Chapter {ch.hs_chapter}</option>)}
                </select>
                <button type="submit" className="w-full bg-[#1e3a8a] text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 shadow-md transition active:scale-95">
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
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
                        <th className="px-6 py-4 text-left">Description</th>
                        <th className="px-6 py-4 text-left">Location</th>
                        <th className="px-6 py-4 text-right">FOB Value (KES)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-t">
                      {records.map(r => (
                        <tr key={r.id} className="hover:bg-blue-50/40 transition-colors group">
                          <td className="px-6 py-4 max-w-xs md:max-w-md">
                            <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">{r.regime}</span>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic mt-1 font-medium">{r.good_description}</p>
                            <div className="text-[10px] text-slate-400 mt-1">HS Code: <span className="font-mono text-blue-600">{r.hscode}</span></div>
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
                  <span className="text-[11px] font-medium text-slate-400">Showing {records.length} of {total.toLocaleString()} records</span>
                  <div className="flex gap-2">
                    <Link href={`?page=${page - 1}&pageSize=${pageSize}`} className={`text-[11px] font-bold uppercase px-4 py-2 border rounded-xl bg-white ${page <= 1 ? "opacity-20 pointer-events-none" : ""}`}>Back</Link>
                    <Link href={`?page=${page + 1}&pageSize=${pageSize}`} className={`text-[11px] font-bold uppercase px-4 py-2 bg-[#1e3a8a] text-white rounded-xl ${page >= totalPages ? "opacity-20 pointer-events-none" : ""}`}>Next</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-8">
              <div className="bg-[#facc15] text-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-5">
                    <TrendingUp className="h-4 w-4 text-slate-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Market Presence</h4>
                  </div>
                  <h3 className="text-lg font-bold mb-4 tracking-tight">Top Trade Partners</h3>
                  <div className="space-y-3.5">
                    {/* Dynamic numbers based on the filtered data set */}
                    {countries.slice(0, 3).map((c, i) => (
                      <div key={`partner-${i}`} className="flex justify-between items-center">
                        <span className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                          <Globe className="h-4 w-4 text-slate-600" /> {c.origin_country || "Unknown"}
                        </span>
                        <div className="flex flex-col items-end">
                            <span className="font-mono font-bold text-slate-900">{c._count.id.toLocaleString()}</span>
                            <span className="text-[9px] uppercase font-bold text-slate-500">declarations</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <BarChart3 className="absolute -right-6 -bottom-6 h-28 w-28 text-black/5 pointer-events-none group-hover:scale-110 transition-transform" />
              </div>

              <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest">Statistical Trends</h4>
                <KraCharts revenue={{ categories: revCat, data: revVal }} declarationTypes={pie} />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="bg-blue-50 p-3 rounded-xl"><Database className="h-5 w-5 text-blue-600" /></div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Filtered Set</p>
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