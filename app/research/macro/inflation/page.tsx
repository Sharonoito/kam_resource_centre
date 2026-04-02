import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ChevronRight, Database, Filter, Search, RotateCcw, BarChart3, TrendingUp } from "lucide-react";
import prisma from "@/lib/prisma";

type QueryValue = string | string[] | undefined;

type Row = {
  id: number;
  country_iso3: string;
  country_name: string;
  year: number;
  value: number | null;
  indicator_code: string;
  indicator_name: string;
  source: string | null;
  is_projection: boolean | null;
};

function getSingle(v: QueryValue): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function parsePInt(v: string, d: number): number {
  const p = Number.parseInt(v, 10);
  return Number.isFinite(p) && p > 0 ? p : d;
}

function sourceBadgeClass(source: string | null): string {
  const text = (source || "unknown").toLowerCase();
  if (text.includes("imf")) return "bg-blue-100 text-blue-700";
  if (text.includes("world bank")) return "bg-emerald-100 text-emerald-700";
  return "bg-slate-100 text-slate-700";
}

export default async function MacroInflationPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: QueryValue; year?: QueryValue; indicator?: QueryValue; page?: QueryValue; pageSize?: QueryValue }>;
}) {
  const q = await searchParams;
  const country = getSingle(q.country).trim();
  const year = getSingle(q.year);
  const indicator = getSingle(q.indicator);
  const page = parsePInt(getSingle(q.page), 1);
  const pageSize = parsePInt(getSingle(q.pageSize), 25);
  const offset = (page - 1) * pageSize;

  const filters: Prisma.Sql[] = [];
  if (country) filters.push(Prisma.sql`(country_name ILIKE ${`%${country}%`} OR country_iso3 ILIKE ${`%${country}%`})`);
  if (year) filters.push(Prisma.sql`year = ${Number(year)}`);
  if (indicator) filters.push(Prisma.sql`indicator_code = ${indicator}`);
  const whereClause = filters.length
    ? Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}`
    : Prisma.empty;

  let rows: Row[] = [];
  let years: Array<{ year: number | null }> = [];
  let indicators: Array<{ indicator_code: string | null; indicator_name: string | null }> = [];
  let total = 0;
  let error = "";
  let inflationEmbedUrl: string | null = null;

  try {
    const [resultRows, totalRows, yearRows, indicatorRows, pbiRecord] = await Promise.all([
      prisma.$queryRaw<Row[]>`
        SELECT id, country_iso3, country_name, year, value, indicator_code, indicator_name, source, is_projection
        FROM macro_data.inflation
        ${whereClause}
        ORDER BY year DESC, country_name ASC
        LIMIT ${pageSize} OFFSET ${offset}
      `,
      prisma.$queryRaw<Array<{ count: bigint | number }>>`
        SELECT COUNT(*) AS count
        FROM macro_data.inflation
        ${whereClause}
      `,
      prisma.$queryRaw<Array<{ year: number | null }>>`
        SELECT year FROM macro_data.inflation GROUP BY year ORDER BY year DESC
      `,
      prisma.$queryRaw<Array<{ indicator_code: string | null; indicator_name: string | null }>>`
        SELECT indicator_code, MIN(indicator_name) AS indicator_name
        FROM macro_data.inflation
        GROUP BY indicator_code
        ORDER BY indicator_code ASC
      `,
      prisma.kam_content.findUnique({
        where: { slug: 'macro-africa-inflation-pbi' },
        select: { powerbi_embed: true, powerbi_url: true },
      }),
    ]);

    rows = resultRows;
    years = yearRows;
    indicators = indicatorRows;
    total = Number(totalRows[0]?.count ?? 0);
    inflationEmbedUrl = pbiRecord?.powerbi_embed ?? pbiRecord?.powerbi_url ?? null;
  } catch (e) {
    console.error("Macro inflation query failed", e);
    error = "Macro database is currently unreachable.";
  }

  const totalPages = Math.ceil(total / pageSize) || 1;
  const inputStyle = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none";

  const baseParams = new URLSearchParams();
  if (country) baseParams.set("country", country);
  if (year) baseParams.set("year", year);
  if (indicator) baseParams.set("indicator", indicator);
  baseParams.set("pageSize", String(pageSize));

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-[Poppins] text-slate-700">
      <header className="bg-[#1e3a8a] pt-10 pb-24 text-white">
        <div className="container mx-auto px-6">
          <nav className="mb-5 text-xs text-blue-100 flex items-center gap-2">
            <Link href="/research" className="hover:text-white">Research Hub</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/research/macro" className="hover:text-white">Macro-economic Data</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">Inflation</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Macro Inflation Data</h1>
          <p className="text-blue-200 mt-2 text-sm italic font-mono">Database: macro_data.inflation ({total.toLocaleString()} records)</p>
          {error && <p className="mt-3 inline-flex rounded-lg bg-red-500/15 px-3 py-2 text-xs font-medium text-red-100">{error}</p>}
        </div>
      </header>

      <div className="container mx-auto px-6 -mt-16 pb-20 space-y-8">

        {/* Power BI — Full width */}
        {inflationEmbedUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <iframe
              title="Africa Inflation Dashboard"
              src={inflationEmbedUrl}
              className="w-full aspect-video border-0"
              allowFullScreen
            />
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-8">
        {/* FILTERS SIDEBAR */}
        <aside className="w-full xl:w-[220px] shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" /> Filters
              </h2>
              <Link href="/research/macro/inflation" className="text-slate-300 hover:text-blue-600 transition">
                <RotateCcw className="h-3.5 w-3.5" />
              </Link>
            </div>
            <form method="GET" className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Country / ISO3</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input name="country" defaultValue={country} className={`${inputStyle} pl-9`} />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Year</label>
                <select name="year" defaultValue={year} className={inputStyle}>
                  <option value="">All Years</option>
                  {years.map((y) => y.year != null ? <option key={y.year} value={String(y.year)}>{y.year}</option> : null)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Indicator</label>
                <select name="indicator" defaultValue={indicator} className={inputStyle}>
                  <option value="">All Indicators</option>
                  {indicators.map((i) => i.indicator_code ? <option key={i.indicator_code} value={i.indicator_code}>{i.indicator_code}{i.indicator_name ? ` - ${i.indicator_name}` : ""}</option> : null)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Rows</label>
                <select name="pageSize" defaultValue={String(pageSize)} className={inputStyle}>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#1e3a8a] text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 shadow-md transition">
                Apply Filters
              </button>
            </form>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Data Table */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                  <Database className="h-4 w-4 text-blue-600" /> Inflation Records
                </h3>
                <span className="text-xs text-slate-500">Page {page} / {totalPages}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-tight">
                    <tr>
                      <th className="px-6 py-4 text-left">Country</th>
                      <th className="px-6 py-4 text-left">Year</th>
                      <th className="px-6 py-4 text-left">Indicator</th>
                      <th className="px-6 py-4 text-right">Value</th>
                      <th className="px-6 py-4 text-left">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-t">
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">
                          {error || "No inflation records found."}
                        </td>
                      </tr>
                    )}
                    {rows.map((r) => (
                      <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{r.country_name}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{r.country_iso3}</div>
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold">{r.year}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-700">{r.indicator_name}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{r.indicator_code} {r.is_projection ? "• projection" : ""}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold">
                          {r.value == null ? "-" : Number(r.value).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded uppercase ${sourceBadgeClass(r.source)}`}>
                            {r.source || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                <span className="text-[11px] font-medium text-slate-400">Total: {total.toLocaleString()} records</span>
                <div className="flex gap-2">
                  <Link
                    href={`/research/macro/inflation?${new URLSearchParams({ ...Object.fromEntries(baseParams), page: String(page - 1) }).toString()}`}
                    className={`text-[11px] font-bold uppercase px-4 py-2 border rounded-xl bg-white transition hover:bg-slate-50 ${page <= 1 ? "opacity-20 pointer-events-none" : ""}`}
                  >Back</Link>
                  <Link
                    href={`/research/macro/inflation?${new URLSearchParams({ ...Object.fromEntries(baseParams), page: String(page + 1) }).toString()}`}
                    className={`text-[11px] font-bold uppercase px-4 py-2 bg-[#1e3a8a] text-white rounded-xl shadow-md transition hover:bg-blue-800 ${page >= totalPages ? "opacity-20 pointer-events-none" : ""}`}
                  >Next</Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6 lg:sticky lg:top-8">

            {/* Highlights card */}
            <div className="bg-[#facc15] text-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="h-4 w-4 text-slate-600" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Price Dynamics</h4>
                </div>
                <h3 className="text-lg font-bold mb-3 tracking-tight">Africa Inflation</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Tracks consumer price index changes and inflation projections across African countries, sourced from the IMF and World Bank.
                </p>
              </div>
              <BarChart3 className="absolute -right-6 -bottom-6 h-28 w-28 text-black/5 pointer-events-none group-hover:scale-110 transition-transform" />
            </div>

            {/* Indicators summary */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest">Indicators in Dataset</h4>
              <div className="space-y-2">
                {indicators.slice(0, 6).map((i) => (
                  <div key={i.indicator_code} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-xs text-slate-600 truncate">{i.indicator_name || i.indicator_code}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dataset stat */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Total Records</p>
                <p className="text-lg font-black text-slate-800 leading-none">{total.toLocaleString()}</p>
              </div>
            </div>

          </div>
        </main>
        </div>{/* end flex row */}
      </div>
    </div>
  );
}
