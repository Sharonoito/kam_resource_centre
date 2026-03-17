"use client";

import Link from "next/link";
import { 
  TrendingUp, 
  BarChart3, 
  Globe, 
  DollarSign, 
  Search, 
  ArrowRight,
  Download,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResearchHub() {
  const [searchTerm, setSearchTerm] = useState("");

  const mainResearchAreas = [
    {
      id: 1,
      title: "Industrial Barometer",
      subtitle: "Economic Performance & Trends",
      description: "Track Kenya's manufacturing sector health with quarterly economic data, growth indicators, and market sentiment from KAM's comprehensive barometer survey.",
      icon: <BarChart3 className="w-10 h-10" />,
      path: "/research/barometer",
      color: "bg-blue-50/50",
      accent: "text-blue-600",
      borderColor: "border-blue-100",
      buttonColor: "bg-[#193C8D] hover:bg-[#0B1E3A]",
      categories: ["📊 Quarterly Data", "📈 Growth Trends", "🎯 Sentiment"],
      stats: { value: "50K+", label: "Companies Tracked" },
    },
    {
      id: 2,
      title: "KRA Data Hub",
      subtitle: "Customs & Trade Intelligence",
      description: "Deep dive into Kenya's import/export data, tariff analysis, and customs transactions. Access ICMS records and trade flow insights for market research.",
      icon: <Globe className="w-10 h-10" />,
      path: "/research/kra",
      color: "bg-emerald-50/50",
      accent: "text-emerald-600",
      borderColor: "border-emerald-100",
      buttonColor: "bg-[#E7B947] hover:bg-[#D6B435]",
      categories: ["🌍 Trade Flows", "📋 ICMS Records", "💰 Tariff Data"],
      stats: { value: "1.2M+", label: "Trade Records" },
      subItems: [
        { name: "Customs & Trade (ICMS)", path: "/research/kra/customs", icon: "📦" },
        { name: "Trade Analytics", path: "/research/kra/analytics", icon: "📊" },
      ],
    },
    {
      id: 3,
      title: "Macro-Economic Data",
      subtitle: "National Economic Indicators",
      description: "Access Kenya's macroeconomic indicators including GDP, inflation, exchange rates, and fiscal policy data. Understand the broader economic context.",
      icon: <DollarSign className="w-10 h-10" />,
      path: "/research/macro",
      color: "bg-amber-50/50",
      accent: "text-amber-600",
      borderColor: "border-amber-100",
      buttonColor: "bg-[#E7B947] hover:bg-[#D6B435]",
      categories: ["📊 GDP Data", "💹 Inflation", "💱 Forex Rates"],
      stats: { value: "20Y+", label: "Historical Data" },
    },
  ];

  const features = [
    { icon: <Search className="w-6 h-6" />, title: "Advanced Search", description: "Intelligent filters across all research databases." },
    { icon: <Download className="w-6 h-6" />, title: "Export Data", description: "Download in CSV, Excel, or PDF for your offline analysis." },
    { icon: <Zap className="w-6 h-6" />, title: "Real-time Updates", description: "Access the latest data with monthly automated syncs." },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Interactive Charts", description: "Visualize patterns with our dynamic dashboard tools." },
    { icon: <Globe className="w-6 h-6" />, title: "API Access", description: "Integrate KAM data directly into your own enterprise systems." },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Verified Sources", description: "Data vetted from KRA, CBK, and KNBS official records." },
  ];

  const filteredAreas = mainResearchAreas.filter(area =>
    area.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">

      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#193C8D] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#193C8D] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#E7B947] rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#E7B947] text-sm font-bold mb-8 backdrop-blur-md">
            <TrendingUp className="w-4 h-4" />
            <span>KAM Data Intelligence Hub</span>
          </motion.div>
          <motion.h1 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]">
            Empowering Industry <br /><span className="text-[#E7B947]">Through Data.</span>
          </motion.h1>
          <motion.p className="text-xl text-zinc-300 leading-relaxed max-w-2xl mb-10">
            Navigate Kenya's manufacturing landscape with precision. Access real-time economic indicators, customs intelligence, and market sentiment reports.
          </motion.p>
        </div>
      </section>

      {/* --- STICKY SEARCH BAR --- */}
      <div className="sticky top-[80px] z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 py-4">
        <div className="container mx-auto px-6">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search datasets, barometer reports, or trade flows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-3xl shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#193C8D] focus:border-transparent text-gray-800 placeholder-gray-400 text-lg transition-all"
            />
          </div>
        </div>
      </div>

{/* --- PRIMARY RESEARCH CARDS --- */}
<section className="py-20">
  <div className="container mx-auto px-6">
    <div className="flex items-end justify-between mb-12">
      <div>
        <h2 className="text-3xl font-serif font-bold text-[#0B1E3A]">Primary Sources</h2>
        <div className="w-12 h-1 bg-[#E7B947] mt-2 rounded-full" />
      </div>
    </div>

    <AnimatePresence mode="popLayout">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAreas.map((area, index) => (
          <motion.div
            key={area.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col bg-white rounded-3xl shadow-md hover:shadow-2xl border ${area.borderColor} overflow-hidden transition-all duration-300 group`}
          >
            <div className="p-8 flex-1 flex flex-col">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${area.accent} bg-white group-hover:scale-110 transition-transform shadow-sm`}>
                {area.icon}
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl font-semibold text-[#0B1E3A] mb-1">{area.title}</h3>
              <p className={`text-sm font-medium uppercase tracking-wide mb-4 ${area.accent}`}>{area.subtitle}</p>

              {/* Description */}
              <p className="text-gray-800 text-sm leading-relaxed mb-6 font-medium">{area.description}</p>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {area.categories.map((cat) => (
                  <span key={cat} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200">
                    {cat}
                  </span>
                ))}
              </div>

              {/* Sub-items */}
              {area.subItems && (
                <div className="space-y-3 mt-6 bg-gray-50 p-4 rounded-2xl">
                  {area.subItems.map(item => (
                    <Link key={item.name} href={item.path} className="flex items-center justify-between text-sm font-medium text-gray-800 hover:text-[#193C8D]">
                      <span>{item.icon} {item.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Stats & Explore Button */}
            <div className="px-8 pb-8 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-[#0B1E3A]">{area.stats.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{area.stats.label}</p>
              </div>
              <Link
                href={area.path}
                className={`px-6 py-2 ${area.buttonColor} text-white font-semibold rounded-xl flex items-center gap-2 shadow hover:shadow-lg transition`}
              >
                Explore <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  </div>
</section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold text-[#0B1E3A] mb-4">Powerful Research Tools</h2>
            <p className="text-zinc-500 font-medium italic">Comprehensive infrastructure for industrial analysis</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-zinc-200 hover:border-[#E7B947] transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-[#E7B947]/10 group-hover:text-[#E7B947] transition-colors text-[#193C8D]">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0B1E3A] mb-2">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// "use client";

// import Link from "next/link";
// import { 
//   TrendingUp, 
//   BarChart3, 
//   Globe, 
//   DollarSign, 
//   Users, 
//   BookOpen, 
//   ArrowRight, 
//   Search, 
//   ChevronDown,
//   Download,
//   ShieldCheck,
//   Zap
// } from "lucide-react";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function ResearchHub() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const mainResearchAreas = [
//     {
//       id: 1,
//       title: "Industrial Barometer",
//       subtitle: "Economic Performance & Trends",
//       description: "Track Kenya's manufacturing sector health with quarterly economic data, growth indicators, and market sentiment from KAM's comprehensive barometer survey.",
//       icon: <BarChart3 className="w-10 h-10" />,
//       path: "/research/barometer",
//       color: "bg-blue-50/50",
//       accent: "text-blue-600",
//       borderColor: "border-blue-100",
//       buttonColor: "bg-[#193C8D] hover:bg-[#0B1E3A]",
//       categories: ["📊 Quarterly Data", "📈 Growth Trends", "🎯 Sentiment"],
//       stats: { value: "50K+", label: "Companies Tracked" },
//     },
//     {
//       id: 2,
//       title: "KRA Data Hub",
//       subtitle: "Customs & Trade Intelligence",
//       description: "Deep dive into Kenya's import/export data, tariff analysis, and customs transactions. Access ICMS records and trade flow insights for market research.",
//       icon: <Globe className="w-10 h-10" />,
//       path: "/research/kra",
//       color: "bg-emerald-50/50",
//       accent: "text-emerald-600",
//       borderColor: "border-emerald-100",
//       buttonColor: "bg-emerald-700 hover:bg-emerald-800",
//       categories: ["🌍 Trade Flows", "📋 ICMS Records", "💰 Tariff Data"],
//       stats: { value: "1.2M+", label: "Trade Records" },
//       subItems: [
//         { name: "Customs & Trade (ICMS)", path: "/research/kra/customs", icon: "📦" },
//         { name: "Trade Analytics", path: "/research/kra/analytics", icon: "📊" },
//       ],
//     },
//     {
//       id: 3,
//       title: "Macro-Economic Data",
//       subtitle: "National Economic Indicators",
//       description: "Access Kenya's macroeconomic indicators including GDP, inflation, exchange rates, and fiscal policy data. Understand the broader economic context.",
//       icon: <DollarSign className="w-10 h-10" />,
//       path: "/research/macro",
//       color: "bg-amber-50/50",
//       accent: "text-amber-600",
//       borderColor: "border-amber-100",
//       buttonColor: "bg-amber-600 hover:bg-amber-700",
//       categories: ["📊 GDP Data", "💹 Inflation", "💱 Forex Rates"],
//       stats: { value: "20Y+", label: "Historical Data" },
//     },
//   ];

//   const features = [
//     { icon: <Search className="w-6 h-6" />, title: "Advanced Search", description: "Intelligent filters across all research databases." },
//     { icon: <Download className="w-6 h-6" />, title: "Export Data", description: "Download in CSV, Excel, or PDF for your offline analysis." },
//     { icon: <Zap className="w-6 h-6" />, title: "Real-time Updates", description: "Access the latest data with monthly automated syncs." },
//     { icon: <TrendingUp className="w-6 h-6" />, title: "Interactive Charts", description: "Visualize patterns with our dynamic dashboard tools." },
//     { icon: <Globe className="w-6 h-6" />, title: "API Access", description: "Integrate KAM data directly into your own enterprise systems." },
//     { icon: <ShieldCheck className="w-6 h-6" />, title: "Verified Sources", description: "Data vetted from KRA, CBK, and KNBS official records." },
//   ];

//   const filteredAreas = mainResearchAreas.filter((area) =>
//     area.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     area.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-white font-sans text-zinc-900">
      
//       {/* --- HERO SECTION --- */}
//       <section className="relative bg-[#0B1E3A] py-24 overflow-hidden">
//         <div className="absolute inset-0 opacity-20 pointer-events-none">
//             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#193C8D] rounded-full blur-[120px]" />
//             <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#E7B947] rounded-full blur-[100px]" />
//         </div>

//         <div className="container mx-auto px-6 relative z-10">
//           <div className="max-w-4xl">
//             <motion.div 
//                 initial={{ opacity: 0, y: 20 }} 
//                 animate={{ opacity: 1, y: 0 }}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#E7B947] text-sm font-bold mb-8 backdrop-blur-md"
//             >
//               <TrendingUp className="w-4 h-4" />
//               <span>KAM Data Intelligence Hub</span>
//             </motion.div>
            
//             <motion.h1 
//                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
//                 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]"
//             >
//               Empowering Industry <br />
//               <span className="text-[#E7B947]">Through Data.</span>
//             </motion.h1>

//             <motion.p 
//                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
//                 className="text-xl text-zinc-300 leading-relaxed max-w-2xl mb-10"
//             >
//               Navigate Kenya's manufacturing landscape with precision. Access real-time economic indicators, customs intelligence, and market sentiment reports.
//             </motion.p>

//             <motion.div 
//                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
//                 className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-white/10"
//             >
//               {[
//                 { value: "15Y+", label: "Historical Trends" },
//                 { value: "100K+", label: "Data Points" },
//                 { value: "Real-time", label: "Syncing" },
//                 { value: "99.9%", label: "Accuracy" },
//               ].map((stat) => (
//                 <div key={stat.label}>
//                   <p className="text-3xl font-bold text-white">{stat.value}</p>
//                   <p className="text-sm text-zinc-400 uppercase tracking-widest font-semibold">{stat.label}</p>
//                 </div>
//               ))}
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* --- STICKY SEARCH BAR --- */}
//       <div className="sticky top-[80px] z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-4">
//         <div className="container mx-auto px-6">
//           <div className="relative max-w-3xl">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
//             <input
//               type="text"
//               placeholder="Search datasets, barometer reports, or trade flows..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#193C8D] focus:bg-white transition-all text-zinc-900 shadow-sm"
//             />
//           </div>
//         </div>
//       </div>

//       {/* --- RESEARCH CARDS --- */}
//       <section className="py-20">
//         <div className="container mx-auto px-6">
//           <div className="flex items-end justify-between mb-12">
//             <div>
//               <h2 className="text-3xl font-serif font-bold text-[#0B1E3A]">Primary Databases</h2>
//               <div className="w-12 h-1 bg-[#E7B947] mt-2 rounded-full" />
//             </div>
//           </div>

//           <AnimatePresence mode="popLayout">
//             <div className="grid lg:grid-cols-3 gap-8">
//               {filteredAreas.map((area, idx) => (
//                 <motion.div
//                   layout
//                   key={area.id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: idx * 0.1 }}
//                   className={`flex flex-col rounded-3xl border ${area.borderColor} ${area.color} overflow-hidden hover:shadow-2xl transition-all duration-500 group`}
//                 >
//                   <div className="p-8 flex-1">
//                     <div className={`${area.accent} mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
//                       {area.icon}
//                     </div>
//                     <h3 className="text-2xl font-bold text-[#0B1E3A] mb-1">{area.title}</h3>
//                     <p className={`text-sm font-bold uppercase tracking-wider mb-4 ${area.accent}`}>{area.subtitle}</p>
//                     <p className="text-zinc-600 text-sm leading-relaxed mb-6 font-medium">
//                       {area.description}
//                     </p>

//                     <div className="flex flex-wrap gap-2 mb-8">
//                       {area.categories.map((cat) => (
//                         <span key={cat} className="px-3 py-1 bg-white/80 text-xs font-bold text-zinc-700 rounded-full border border-zinc-100">
//                           {cat}
//                         </span>
//                       ))}
//                     </div>

//                     {area.subItems && (
//                       <div className="space-y-3 mb-8 bg-white/50 p-4 rounded-2xl">
//                         {area.subItems.map(item => (
//                             <Link key={item.name} href={item.path} className="flex items-center justify-between group/link text-sm font-bold text-zinc-700 hover:text-[#193C8D]">
//                                 <span className="flex items-center gap-2">
//                                     <span className="opacity-70">{item.icon}</span> {item.name}
//                                 </span>
//                                 <ArrowRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
//                             </Link>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="px-8 pb-8">
//                     <div className="flex items-center justify-between mb-6 pt-6 border-t border-zinc-200/50">
//                         <div>
//                             <p className="text-2xl font-black text-[#0B1E3A]">{area.stats.value}</p>
//                             <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">{area.stats.label}</p>
//                         </div>
//                         <Link 
//                             href={area.path}
//                             className={`px-6 py-3 ${area.buttonColor} text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95`}
//                         >
//                             Explore <ArrowRight className="w-4 h-4" />
//                         </Link>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </AnimatePresence>
//         </div>
//       </section>

//       {/* --- FEATURES GRID --- */}
//       <section className="py-24 bg-zinc-50 border-y border-zinc-200">
//         <div className="container mx-auto px-6">
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h2 className="text-4xl font-serif font-bold text-[#0B1E3A] mb-4">Powerful Research Tools</h2>
//             <p className="text-zinc-500 font-medium italic">Comprehensive infrastructure for industrial analysis</p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-10">
//             {features.map((feature, idx) => (
//               <div key={idx} className="bg-white p-8 rounded-3xl border border-zinc-200 hover:border-[#E7B947] transition-colors group">
//                 <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-[#E7B947]/10 group-hover:text-[#E7B947] transition-colors text-[#193C8D]">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-lg font-bold text-[#0B1E3A] mb-2">{feature.title}</h3>
//                 <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* --- FAQ SECTION --- */}
//       <section className="py-24">
//         <div className="container mx-auto px-6 max-w-4xl">
//           <h2 className="text-3xl font-serif font-bold text-[#0B1E3A] text-center mb-12">Common Queries</h2>
//           <div className="grid gap-4">
//             {[
//               { q: "Is this data free to access?", a: "Yes. All curated datasets are public resources provided by KAM." },
//               { q: "How often is data updated?", a: "The barometer is quarterly, while trade/macro data syncs monthly." },
//               { q: "Can I use this data for academic research?", a: "Absolutely. We encourage citations referring to the KAM Data Hub." }
//             ].map((faq, i) => (
//               <details key={i} className="group bg-zinc-50 rounded-2xl border border-zinc-200">
//                 <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-[#0B1E3A] list-none">
//                   {faq.q}
//                   <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
//                 </summary>
//                 <div className="px-6 pb-6 text-zinc-600 font-medium">
//                   {faq.a}
//                 </div>
//               </details>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* --- CTA BANNER --- */}
//       <section className="container mx-auto px-6 mb-24">
//         <div className="bg-[#193C8D] rounded-[2rem] p-12 text-center relative overflow-hidden">
//             <div className="absolute top-0 right-0 p-8 opacity-10">
//                 <Globe className="w-64 h-64 text-white" />
//             </div>
//             <h2 className="text-4xl font-serif font-bold text-white mb-6 relative z-10">Ready to dive into Kenya's industry data?</h2>
//             <p className="text-blue-100 mb-10 text-lg max-w-xl mx-auto relative z-10 italic font-medium">
//                 Start exploring comprehensive research on manufacturing, trade flows, and economic trends.
//             </p>
//             <div className="flex flex-wrap justify-center gap-4 relative z-10">
//                 <Link href="/research/barometer" className="px-10 py-4 bg-[#E7B947] text-[#0B1E3A] font-black uppercase tracking-tighter rounded-2xl hover:bg-white transition-all shadow-xl">
//                     Access Barometer
//                 </Link>
//                 <Link href="/contact" className="px-10 py-4 bg-white/10 text-white font-black uppercase tracking-tighter rounded-2xl hover:bg-white/20 transition-all border border-white/20">
//                     Request Custom Report
//                 </Link>
//             </div>
//         </div>
//       </section>

//     </div>
//   );
// }