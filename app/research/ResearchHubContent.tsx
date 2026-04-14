"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChartBarIcon, 
  GlobeAltIcon, 
  BanknotesIcon, 
  MagnifyingGlassIcon, 
  ArrowRightIcon, 
  BoltIcon 
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

export default function ResearchHubContent() {
  const [searchTerm, setSearchTerm] = useState("");

  const mainResearchAreas: Array<{
    id: number;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    // accent: string;
    borderColor: string;
    buttonColor: string;
    stats?: { value: string; label: string };
  }> = [
    {
      id: 1,
      title: " Manufacturing Barometer ",
      subtitle: "Economic Performance & Trends",
      description: "Quarterly updates on manufacturing sector performance and market sentiment reports.",
      // ICON: Glyph itself is Brand Blue
      icon: <ChartBarIcon className="w-6 h-6 text-[#193C8D]" />,
      path: "/research/barometer",
      // accent: "bg-[#193C8D]",
      borderColor: "border-yellow-400",
      buttonColor: "bg-[#193C8D] hover:bg-[#0B1E3A]",
    },
    {
      id: 2,
      title: "Customs Data Hub",
      subtitle: "Trade Intelligence",
      description: "Deep dive into Kenya's import/export data, tariff analysis, and customs ICMS records.",
      // ICON: Glyph itself is Brand Blue
      icon: <GlobeAltIcon className="w-6 h-6 text-[#193C8D]" />,
      path: "/research/kra",
      // accent: "bg-[#193C8D]",
      borderColor: "border-yellow-400",
      buttonColor: "bg-[#193C8D] hover:bg-[#0B1E3A]",
    },
    {
      id: 3,
      title: "Macro-Economic Data",
      subtitle: "National Indicators",
      description: "Access Kenya's macroeconomic indicators including GDP, inflation, and exchange rates.",
      // ICON: Glyph itself is Brand Blue
      icon: <BanknotesIcon className="w-6 h-6 text-[#193C8D]" />,
      path: "/research/macro",
      // accent: "bg-[#193C8D]",
      borderColor: "border-yellow-400",
      buttonColor: "bg-[#193C8D] hover:bg-[#0B1E3A]",
    },
  ];

  const filteredAreas = mainResearchAreas.filter(area =>
    area.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white">
      <section className="relative bg-[#193C8D] pt-12 pb-20 overflow-hidden border-b-4 border-yellow-400">
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-yellow-400 text-[9px] font-black uppercase tracking-widest mb-6"
          >
            <BoltIcon className="w-3.5 h-3.5" />
            <span>KAM Data Intelligence Hub</span>
          </motion.div>
          
          <div className="max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-[1]"
            >
              Industrial <span className="text-yellow-400">Research</span> <br />& Data Resources
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-base text-blue-100/70 leading-relaxed max-w-lg font-medium"
            >
              The authoritative source for manufacturing evidence and economic indicators in Kenya.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="relative z-50 -mt-7">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="relative max-w-2xl group">
            <div className="absolute inset-0 bg-black/5 rounded-xl blur-lg" />
            <div className="relative bg-white rounded-xl flex items-center shadow-xl border border-slate-200 overflow-hidden">
              <div className="pl-5 text-slate-400">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-4 text-sm outline-none text-black placeholder-slate-400 font-bold"
              />
              <button className="bg-[#193C8D] text-white px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#0B1E3A] transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="pt-12 pb-6">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-1.5 h-6 bg-yellow-400 rounded-full" />
             <h2 className="text-lg font-black text-black uppercase tracking-tight">Data Repositories</h2>
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAreas.map((area) => (
                <motion.div
                  key={area.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`flex flex-col bg-white rounded-xl border border-slate-200 hover:border-[#193C8D] hover:shadow-lg transition-all duration-300 group overflow-hidden`}
                >
                  <div className="p-6 flex-1">
                    {/* ICON CONTAINER: White BG, Yellow Border, Blue Icon Glyph */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 bg-white border-2 ${area.borderColor} shadow-inner group-hover:scale-110 transition-transform`}>
                      {area.icon}
                    </div>
                    <h3 className="text-lg font-bold text-black mb-0.5">{area.title}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">{area.subtitle}</p>
                    {/* DESCRIPTION: Normal font weight, Black text */}
                    <p className="text-black text-xs leading-relaxed font-normal line-clamp-2">{area.description}</p>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {area.stats && (
                        <>
                          <p className="text-xs font-black text-black leading-none">{area.stats.value}</p>
                          <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">{area.stats.label}</p>
                        </>
                      )}
                    </div>
                    <Link
                      href={area.path} 
                      className={`px-3 py-1.5 ${area.buttonColor} text-white text-[9px] font-black uppercase rounded shadow-sm flex items-center gap-1.5`}
                    >
                      Read More <ArrowRightIcon className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
