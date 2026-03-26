import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ChevronRight, Database, Filter, Search, RotateCcw, Globe2 } from "lucide-react";
import prisma from "@/lib/prisma";
import DebtTrendChart from "./DebtTrendChart";

type QueryValue = string | string[] | undefined;

interface PageProps {
  searchParams: Promise<{
    country?: QueryValue;
    year?: QueryValue;
    indicator?: QueryValue;
    page?: QueryValue;
    pageSize?: QueryValue;
  }>;
}

interface DebtRow {
  country_name: string;
  country_iso3: string | null;
  year: number;
  indicator_name: string;
  indicator_code: string;
  value: number | null;
  source: string | null;
}

interface YearRow {
  year: number | null;
}

interface IndicatorRow {
  indicator_code: string | null;
  indicator_name: string | null;
}

function getSingle(v: QueryValue): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function parsePInt(v: string, d: number): number {
  const p = Number.parseInt(v, 10);
  return Number.isFinite(p) && p > 0 ? p : d;
}

function formatDebtValue(value: number | null): string {
  if (value == null) return "-";
  if (Math.abs(value) <= 1) return `${(value * 100).toFixed(2)}%`;
  return `${value.toFixed(2)}%`;
}

function sourceBadgeClass(source: string | null): string {
  const text = (source || "unknown").toLowerCase();
  if (text.includes("imf")) return "bg-blue-100 text-blue-700";
  if (text.includes("world bank")) return "bg-emerald-100 text-emerald-700";
  if (text.includes("oecd")) return "bg-violet-100 text-violet-700";
  return "bg-slate-100 text-slate-700";
}

export default async function MacroDebtPage({ searchParams }: PageProps) {
  const q = await searchParams;

  const country = getSingle(q.country).trim();
  const year = getSingle(q.year);
  const indicator = getSingle(q.indicator);
  const page = parsePInt(getSingle(q.page), 1);
  const pageSize = parsePInt(getSingle(q.pageSize), 25);
  const offset = (page - 1) * pageSize;

  const filters: Prisma.Sql[] = [];

  if (country) {
    filters.push(
      Prisma.sql`(country_name ILIKE ${`%${country}%`} OR country_iso3 ILIKE ${`%${country}%`})`
    );
  }
  if (year) {
    filters.push(Prisma.sql`year = ${Number(year)}`);
  }
  if (indicator) {
    filters.push(Prisma.sql`indicator_code = ${indicator}`);
  }

  const whereClause = filters.length
    ? Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}`
    : Prisma.empty;

  let rows: DebtRow[] = [];
  let years: YearRow[] = [];
  let indicators: IndicatorRow[] = [];
  let total = 0;
  let databaseError = "";

  try {
    const [fetchedRows, totalRows, fetchedYears, fetchedIndicators] = await Promise.all([
      prisma.$queryRaw<DebtRow[]>`
        SELECT country_name, country_iso3, year, indicator_name, indicator_code, value, source
        FROM macro_data.debt
        ${whereClause}
        ORDER BY year DESC, country_name ASC
        LIMIT ${pageSize} OFFSET ${offset}
      `,
      prisma.$queryRaw<Array<{ count: bigint | number }>>`
        SELECT COUNT(*) AS count
        FROM macro_data.debt
        ${whereClause}
      `,
      prisma.$queryRaw<YearRow[]>`
        SELECT year
        FROM macro_data.debt
        GROUP BY year
        ORDER BY year DESC
      `,
      prisma.$queryRaw<IndicatorRow[]>`
        SELECT indicator_code, MIN(indicator_name) AS indicator_name
        FROM macro_data.debt
        GROUP BY indicator_code
        ORDER BY indicator_code ASC
      `,
    ]);

    rows = fetchedRows;
    years = fetchedYears;
    indicators = fetchedIndicators;
    total = Number(totalRows[0]?.count ?? 0);
  } catch (error) {
    console.error("Macro debt query failed:", error);
    databaseError = "Macro database is currently unreachable.";
  }

  const totalPages = Math.ceil(total / pageSize) || 1;

  const trendMap = new Map<number, { sum: number; count: number }>();
  for (const row of rows) {
    if (row.value == null) continue;
    const current = trendMap.get(row.year) ?? { sum: 0, count: 0 };
    current.sum += Number(row.value);
    current.count += 1;
    trendMap.set(row.year, current);
  }

  const trendYears = Array.from(trendMap.keys()).sort((a, b) => a - b);
  const trendValues = trendYears.map((y) => {
    const item = trendMap.get(y)!;
    return item.count > 0 ? Number((item.sum / item.count).toFixed(2)) : 0;
  });

  const inputStyle =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none";

  const baseParams = new URLSearchParams();
  if (country) baseParams.set("country", country);
  if (year) baseParams.set("year", year);
  if (indicator) baseParams.set("indicator", indicator);
  baseParams.set("pageSize", String(pageSize));

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-[Poppins] text-slate-700">
      <header className="bg-[#1e3a8a] pt-10 pb-16 text-white">
        <div className="container mx-auto px-6">
          <nav className="mb-5 text-xs text-blue-100 flex items-center gap-2">
            <Link href="/research" className="hover:text-white">Research Hub</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/research/macro" className="hover:text-white">Macro-economic Data</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">Debt</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Macro-economic Debt Data</h1>
          <p className="text-blue-200 mt-2 text-sm italic font-mono">
            Database: macro_data.debt ({total.toLocaleString()} records)
          </p>
          {databaseError && (
            <p className="mt-3 inline-flex rounded-lg bg-red-500/15 px-3 py-2 text-xs font-medium text-red-100">
              {databaseError}
            </p>
          )}
        </div>
      </header>

      <div className="container mx-auto px-6 -mt-8 pb-20">
        <div className="flex flex-col xl:flex-row gap-8">
          <aside className="w-full xl:w-[300px] shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" /> Filters
                </h2>
                <Link href="/research/macro/debt" className="text-slate-300 hover:text-blue-600 transition">
                  <RotateCcw className="h-3.5 w-3.5" />
                </Link>
              </div>

              <form method="GET" className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Country / ISO3</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      name="country"
                      defaultValue={country}
                      placeholder="Kenya or KEN"
                      className={`${inputStyle} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Year</label>
                  <select name="year" defaultValue={year} className={inputStyle}>
                    <option value="">All Years</option>
                    {years.map((y) =>
                      y.year != null ? (
                        <option key={y.year} value={String(y.year)}>
                          {y.year}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Indicator</label>
                  <select name="indicator" defaultValue={indicator} className={inputStyle}>
                    <option value="">All Indicators</option>
                    {indicators.map((i) =>
                      i.indicator_code ? (
                        <option key={i.indicator_code} value={i.indicator_code}>
                          {i.indicator_code} {i.indicator_name ? `- ${i.indicator_name}` : ""}
                        </option>
                      ) : null
                    )}
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

                <button
                  type="submit"
                  className="w-full bg-[#1e3a8a] text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 shadow-md transition active:scale-95"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          <main className="flex-1 space-y-8">
            <DebtTrendChart
              categories={trendYears.map(String)}
              data={trendValues}
            />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                  <Database className="h-4 w-4 text-blue-600" /> Debt Records
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
                          {databaseError || "No debt records found for the selected filters."}
                        </td>
                      </tr>
                    )}
                    {rows.map((r, idx) => (
                      <tr key={`${r.country_name}-${r.year}-${r.indicator_code}-${idx}`} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{r.country_name}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-medium">{r.country_iso3 || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold text-slate-800">{r.year}</td>
                        <td className="px-6 py-4 max-w-md">
                          <div className="text-slate-700 font-medium line-clamp-2">{r.indicator_name}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">{r.indicator_code}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                          {formatDebtValue(r.value)}
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
                    href={`/research/macro/debt?${new URLSearchParams({ ...Object.fromEntries(baseParams), page: String(page - 1) }).toString()}`}
                    className={`text-[11px] font-bold uppercase px-4 py-2 border rounded-xl bg-white transition hover:bg-slate-50 ${page <= 1 ? "opacity-20 pointer-events-none" : ""}`}
                  >
                    Back
                  </Link>
                  <Link
                    href={`/research/macro/debt?${new URLSearchParams({ ...Object.fromEntries(baseParams), page: String(page + 1) }).toString()}`}
                    className={`text-[11px] font-bold uppercase px-4 py-2 bg-[#1e3a8a] text-white rounded-xl shadow-md transition hover:bg-blue-800 ${page >= totalPages ? "opacity-20 pointer-events-none" : ""}`}
                  >
                    Next
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Countries in Result</p>
                <p className="text-2xl font-black text-slate-800">
                  {new Set(rows.map((r) => r.country_name)).size.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Indicators in Result</p>
                <p className="text-2xl font-black text-slate-800">
                  {new Set(rows.map((r) => r.indicator_code)).size.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="bg-blue-50 p-2.5 rounded-lg">
                  <Globe2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Data Providers</p>
                  <p className="text-xl font-black text-slate-800">
                    {new Set(rows.map((r) => r.source || "Unknown")).size.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
