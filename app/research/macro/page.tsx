import Link from "next/link";
import { ArrowRight, Banknote, LineChart, Percent, Landmark } from "lucide-react";

const datasets = [
  {
    title: "Debt",
    subtitle: "Sovereign debt indicators",
    description: "Government debt metrics by country, year, and indicator definitions.",
    href: "/research/macro/debt",
    icon: Landmark,
  },
  {
    title: "Exchange Rates",
    subtitle: "FX market references",
    description: "Historical exchange-rate records by base and target currencies.",
    href: "/research/macro/exchange-rates",
    icon: Banknote,
  },
  {
    title: "Indicators",
    subtitle: "Macro signal library",
    description: "Core macro indicators and values across countries and years.",
    href: "/research/macro/indicators",
    icon: LineChart,
  },
  {
    title: "Inflation",
    subtitle: "Price-level dynamics",
    description: "Inflation history and projections with indicator metadata.",
    href: "/research/macro/inflation",
    icon: Percent,
  },
];

export default function MacroIndexPage() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] font-[Poppins] text-slate-700">
      <header className="bg-[#1e3a8a] pt-12 pb-20 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Macro-economic Data</h1>
          <p className="text-blue-200 mt-2 text-sm">Research Hub datasets for debt, FX, indicators, and inflation.</p>
        </div>
      </header>

      <section className="container mx-auto px-6 -mt-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {datasets.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{item.subtitle}</p>
                  <h2 className="text-xl font-bold text-slate-800 mt-1">{item.title}</h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-md">{item.description}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 shrink-0">
                  <item.icon className="h-5 w-5 text-blue-700" />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-blue-700 font-semibold text-sm">
                Open Dataset <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
