"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, Globe, DollarSign, Search, ArrowRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResearchHubContent() {
  const [searchTerm, setSearchTerm] = useState("");

  const mainResearchAreas = [
    {
      id: 1,
      title: "Industrial Barometer",
      subtitle: "Economic Performance & Trends",
      description: "Track Kenya's manufacturing sector health with quarterly economic data and market sentiment reports.",
      icon: <BarChart3 className="w-7 h-7" />,
      path: "/research/barometer",
      accent: "text-[#193C8D]",
      borderColor: "border-blue-100",
      buttonColor: "bg-[#193C8D] hover:bg-[#0B1E3A]",
      stats: { value: "50K+", label: "Firms Monitored" },
    },
    {
      id: 2,
      title: "Customs Data Hub",
      subtitle: "Trade Intelligence",
      description: "Deep dive into Kenya's import/export data, tariff analysis, and customs ICMS records.",
      icon: <Globe className="w-7 h-7" />,
      path: "/research/kra",
      accent: "text-emerald-600",
      borderColor: "border-emerald-100",
      buttonColor: "bg-[#193C8D] hover:bg-[#0B1E3A]",
      stats: { value: "1.2M+", label: "Trade Rows" },
    },
    {
      id: 3,
      title: "Macro-Economic Data",
      subtitle: "National Indicators",
      description: "Access Kenya's macroeconomic indicators including GDP, inflation, and exchange rates.",
      icon: <DollarSign className="w-7 h-7" />,
      path: "/research/macro",
      accent: "text-amber-600",
      borderColor: "border-amber-100",
      buttonColor: "bg-[#E7B947] hover:bg-[#D6B435]",
      stats: { value: "20Y+", label: "Historical Span" },
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
            <Activity className="w-3.5 h-3.5" />
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
              className="text-base text-blue-100/70 leading-relaxed max-w-lg font-medium italic"
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
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-4 text-sm outline-none text-slate-800 placeholder-slate-400 font-bold"
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
             <h2 className="text-lg font-black text-[#0B1E3A] uppercase tracking-tight">Data Repositories</h2>
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAreas.map((area) => (
                <motion.div
                  key={area.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`flex flex-col bg-white rounded-xl border border-slate-200 hover:border-[#193C8D] hover:shadow-lg transition-all duration-300 group overflow-hidden`}
                >
                  <div className="p-6 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-slate-50 ${area.accent} border border-slate-100 group-hover:bg-[#193C8D] group-hover:text-white transition-all`}>
                      {area.icon}
                    </div>
                    <h3 className="text-lg font-bold text-[#0B1E3A] mb-0.5">{area.title}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">{area.subtitle}</p>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium italic line-clamp-2">{area.description}</p>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-[#0B1E3A] leading-none">{area.stats.value}</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">{area.stats.label}</p>
                    </div>
                    <Link
                      href={area.path}
                      className={`px-3 py-1.5 ${area.buttonColor} text-white text-[9px] font-black uppercase rounded shadow-sm flex items-center gap-1.5`}
                    >
                      Enter <ArrowRight size={10} />
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


// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { 
//   TrendingUp, BarChart3, Globe, DollarSign, Search, 
//   ArrowRight, Activity, ChevronDown 
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function ResearchHubContent() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const mainResearchAreas = [
//     {
//       id: 1,
//       title: "Industrial Barometer",
//       subtitle: "Economic Performance & Trends",
//       description: "Track Kenya's manufacturing sector health with quarterly economic data and market sentiment reports.",
//       icon: <BarChart3 className="w-7 h-7" />,
//       path: "/research/barometer",
//       accent: "text-[#193C8D]",
//       borderColor: "border-blue-100",
//       buttonColor: "bg-[#193C8D] hover:bg-[#0B1E3A]",
//       stats: { value: "50K+", label: "Firms Monitored" },
//     },
//     {
//       id: 2,
//       title: "Customs Data Hub",
//       subtitle: "Trade Intelligence",
//       description: "Deep dive into Kenya's import/export data, tariff analysis, and customs ICMS records.",
//       icon: <Globe className="w-7 h-7" />,
//       path: "/research/kra",
//       accent: "text-emerald-600",
//       borderColor: "border-emerald-100",
//       buttonColor: "bg-[#193C8D] hover:bg-[#0B1E3A]",
//       stats: { value: "1.2M+", label: "Trade Rows" },
//     },
//     {
//       id: 3,
//       title: "Macro-Economic Data",
//       subtitle: "National Indicators",
//       description: "Access Kenya's macroeconomic indicators including GDP, inflation, and exchange rates.",
//       icon: <DollarSign className="w-7 h-7" />,
//       path: "/research/macro",
//       accent: "text-amber-600",
//       borderColor: "border-amber-100",
//       buttonColor: "bg-[#E7B947] hover:bg-[#D6B435]",
//       stats: { value: "20Y+", label: "Historical Span" },
//     },
//   ];

//   const filteredAreas = mainResearchAreas.filter(area =>
//     area.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-white">
//       {/* --- COMPACT HERO SECTION --- */}
//       <section className="relative bg-[#193C8D] pt-12 pb-20 overflow-hidden border-b-4 border-yellow-400">
//         <div className="container mx-auto px-6 relative z-10 max-w-7xl">
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-yellow-400 text-[9px] font-black uppercase tracking-widest mb-6"
//           >
//             <Activity className="w-3.5 h-3.5" />
//             <span>KAM Data Intelligence Hub</span>
//           </motion.div>
          
//           <div className="max-w-4xl">
//             <motion.h1 
//               initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
//               className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-[1]"
//             >
//               Industrial <span className="text-yellow-400">Research</span> <br />& Data Resources
//             </motion.h1>
//             <motion.p 
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
//               className="text-base text-blue-100/70 leading-relaxed max-w-lg font-medium italic"
//             >
//               The authoritative source for manufacturing evidence and economic indicators in Kenya.
//             </motion.p>
//           </div>
//         </div>
//       </section>

//       {/* --- SEARCH BAR (Pushed up more tightly) --- */}
//       <div className="relative z-50 -mt-7">
//         <div className="container mx-auto px-6 max-w-7xl">
//           <div className="relative max-w-2xl group">
//             <div className="absolute inset-0 bg-black/5 rounded-xl blur-lg" />
//             <div className="relative bg-white rounded-xl flex items-center shadow-xl border border-slate-200 overflow-hidden">
//               <div className="pl-5 text-slate-400">
//                 <Search className="w-5 h-5" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search publications..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-4 text-sm outline-none text-slate-800 placeholder-slate-400 font-bold"
//               />
//               <button className="bg-[#193C8D] text-white px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#0B1E3A] transition-colors">
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- SOURCES GRID (Compact Title) --- */}
//       <section className="pt-12 pb-6">
//         <div className="container mx-auto px-6 max-w-7xl">
//           <div className="flex items-center gap-3 mb-8">
//              <div className="w-1.5 h-6 bg-yellow-400 rounded-full" />
//              <h2 className="text-lg font-black text-[#0B1E3A] uppercase tracking-tight">Data Repositories</h2>
//           </div>

//           <AnimatePresence mode="popLayout">
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
//               {filteredAreas.map((area) => (
//                 <motion.div
//                   key={area.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                   className={`flex flex-col bg-white rounded-xl border border-slate-200 hover:border-[#193C8D] hover:shadow-lg transition-all duration-300 group overflow-hidden`}
//                 >
//                   <div className="p-6 flex-1">
//                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-slate-50 ${area.accent} border border-slate-100 group-hover:bg-[#193C8D] group-hover:text-white transition-all`}>
//                       {area.icon}
//                     </div>
//                     <h3 className="text-lg font-bold text-[#0B1E3A] mb-0.5">{area.title}</h3>
//                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">{area.subtitle}</p>
//                     <p className="text-slate-500 text-xs leading-relaxed font-medium italic line-clamp-2">{area.description}</p>
//                   </div>

//                   <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
//                     <div>
//                       <p className="text-xs font-black text-[#0B1E3A] leading-none">{area.stats.value}</p>
//                       <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">{area.stats.label}</p>
//                     </div>
//                     <Link
//                       href={area.path}
//                       className={`px-3 py-1.5 ${area.buttonColor} text-white text-[9px] font-black uppercase rounded shadow-sm flex items-center gap-1.5`}
//                     >
//                       Enter <ArrowRight size={10} />
//                     </Link>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </AnimatePresence>
//         </div>
//       </section>
//     </div>
//   );
// }
