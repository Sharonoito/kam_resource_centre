import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ChevronRight, Database, Filter, Search, RotateCcw } from "lucide-react";
import prisma from "@/lib/prisma";

type QueryValue = string | string[] | undefined;

type Row = {
  id: number;
  date: string;
  base_currency: string;
  target_currency: string;
  rate: number;
  source: string | null;
};

function getSingle(v: QueryValue): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function parsePInt(v: string, d: number): number {
  const p = Number.parseInt(v, 10);
  return Number.isFinite(p) && p > 0 ? p : d;
}

export default async function MacroExchangeRatesPage({
  searchParams,
}: {
  searchParams: Promise<{ base?: QueryValue; target?: QueryValue; page?: QueryValue; pageSize?: QueryValue }>;
}) {
  const q = await searchParams;
  const base = getSingle(q.base).trim().toUpperCase();
  const target = getSingle(q.target).trim().toUpperCase();
  const page = parsePInt(getSingle(q.page), 1);
  const pageSize = parsePInt(getSingle(q.pageSize), 25);
  const offset = (page - 1) * pageSize;

  const filters: Prisma.Sql[] = [];
  if (base) filters.push(Prisma.sql`base_currency = ${base}`);
  if (target) filters.push(Prisma.sql`target_currency = ${target}`);
  const whereClause = filters.length
    ? Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}`
    : Prisma.empty;

  let rows: Row[] = [];
  let total = 0;
  let error = "";

  try {
    const [resultRows, totalRows] = await Promise.all([
      prisma.$queryRaw<Row[]>`
        SELECT id, date::text, base_currency, target_currency, rate, source
        FROM macro_data.exchange_rates
        ${whereClause}
        ORDER BY date DESC, id DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `,
      prisma.$queryRaw<Array<{ count: bigint | number }>>`
        SELECT COUNT(*) AS count
        FROM macro_data.exchange_rates
        ${whereClause}
      `,
    ]);
    rows = resultRows;
    total = Number(totalRows[0]?.count ?? 0);
  } catch (e) {
    console.error("Macro exchange rates query failed", e);
    error = "Macro database is currently unreachable.";
  }

  const totalPages = Math.ceil(total / pageSize) || 1;
  const inputStyle =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none";

  const baseParams = new URLSearchParams();
  if (base) baseParams.set("base", base);
  if (target) baseParams.set("target", target);
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
            <span className="text-white">Exchange Rates</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Macro Exchange Rates</h1>
          <p className="text-blue-200 mt-2 text-sm italic font-mono">
            Database: macro_data.exchange_rates ({total.toLocaleString()} records)
          </p>
          {error && <p className="mt-3 inline-flex rounded-lg bg-red-500/15 px-3 py-2 text-xs font-medium text-red-100">{error}</p>}
        </div>
      </header>

      <div className="container mx-auto px-6 -mt-8 pb-20 flex flex-col xl:flex-row gap-8">
        <aside className="w-full xl:w-[300px] shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" /> Filters
              </h2>
              <Link href="/research/macro/exchange-rates" className="text-slate-300 hover:text-blue-600 transition">
                <RotateCcw className="h-3.5 w-3.5" />
              </Link>
            </div>
            <form method="GET" className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Base Currency</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input name="base" defaultValue={base} placeholder="EUR" className={`${inputStyle} pl-9`} />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Target Currency</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input name="target" defaultValue={target} placeholder="USD" className={`${inputStyle} pl-9`} />
                </div>
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

        <main className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <Database className="h-4 w-4 text-blue-600" /> Exchange Rates
              </h3>
              <span className="text-xs text-slate-500">Page {page} / {totalPages}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-tight">
                  <tr>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Base</th>
                    <th className="px-6 py-4 text-left">Target</th>
                    <th className="px-6 py-4 text-right">Rate</th>
                    <th className="px-6 py-4 text-left">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-t">
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">{error || "No exchange-rate records found."}</td>
                    </tr>
                  )}
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{r.date.slice(0, 10)}</td>
                      <td className="px-6 py-4 font-semibold">{r.base_currency}</td>
                      <td className="px-6 py-4 font-semibold">{r.target_currency}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold">{Number(r.rate).toFixed(6)}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">{r.source || "Unknown"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
              <span className="text-[11px] font-medium text-slate-400">Total: {total.toLocaleString()} records</span>
              <div className="flex gap-2">
                <Link href={`/research/macro/exchange-rates?${new URLSearchParams({ ...Object.fromEntries(baseParams), page: String(page - 1) }).toString()}`} className={`text-[11px] font-bold uppercase px-4 py-2 border rounded-xl bg-white transition hover:bg-slate-50 ${page <= 1 ? "opacity-20 pointer-events-none" : ""}`}>Back</Link>
                <Link href={`/research/macro/exchange-rates?${new URLSearchParams({ ...Object.fromEntries(baseParams), page: String(page + 1) }).toString()}`} className={`text-[11px] font-bold uppercase px-4 py-2 bg-[#1e3a8a] text-white rounded-xl shadow-md transition hover:bg-blue-800 ${page >= totalPages ? "opacity-20 pointer-events-none" : ""}`}>Next</Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
