"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, BarChart3, Database, ArrowRight } from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";

// The 13 KAM Sectors - displayed prominently on homepage
const sectors = [
  { name: "Agriculture & Agro-processing", slug: "agriculture-agro-processing", icon: "🌾", color: "#22c55e", desc: "Crops, horticultural products, and value-added agricultural goods" },
  { name: "Automotive", slug: "automotive", icon: "🚗", color: "#3b82f6", desc: "Vehicle assembly and automotive parts manufacturing" },
  { name: "Building, Mining & Construction", slug: "building-mining-construction", icon: "🏗️", color: "#78716c", desc: "Construction materials, mining equipment, and building supplies" },
  { name: "Chemical & Allied", slug: "chemical-allied", icon: "🧪", color: "#8b5cf6", desc: "Industrial chemicals, fertilizers, paints, and adhesives" },
  { name: "Energy, Electrical & Electronics", slug: "energy-electrical-electronics", icon: "⚡", color: "#eab308", desc: "Power generation, electronics, and renewable energy" },
  { name: "Food & Beverages", slug: "food-beverages", icon: "🍫", color: "#f97316", desc: "Food processing, packaging, and beverage manufacturing" },
  { name: "Leather & Footwear", slug: "leather-footwear", icon: "👞", color: "#92400e", desc: "Leather processing, shoe manufacturing, and leather goods" },
  { name: "Metal & Allied", slug: "metal-allied", icon: "⚙️", color: "#64748b", desc: "Metal fabrication, steel products, and foundry operations" },
  { name: "Paper", slug: "paper", icon: "📄", color: "#d4d4d8", desc: "Paper manufacturing, packaging, and printing supplies" },
  { name: "Pharmaceutical & Medical", slug: "pharmaceutical-medical-equipment", icon: "💊", color: "#ef4444", desc: "Medicine manufacturing and medical equipment" },
  { name: "Plastics & Rubber", slug: "plastics-rubber", icon: "🧴", color: "#06b6d4", desc: "Plastic manufacturing, rubber products, and packaging" },
  { name: "Textile & Apparel", slug: "textile-apparel", icon: "👕", color: "#ec4899", desc: "Clothing manufacturing, fabric production, and garment export" },
  { name: "Timber", slug: "timber", icon: "🪵", color: "#78350f", desc: "Wood processing, furniture, and timber products" },
];

// Translation Dictionary
const content = {
  en: {
    heroTitle: "Supporting Kenya's Export Growth Through Trusted Trade Intelligence",
    heroDesc: "The KAM Web-Based Resource Centre provides reliable trade data, research publications, and policy insights to strengthen manufacturing competitiveness under AfCFTA.",
    explore: "Explore Resources",
    learn: "Learn More",
    pillars: "Our Strategic Pillars",
    sectorsTitle: "Industrial Sectors",
    sectorsDesc: "Select your sector to access reports, analytics, and trade data",
    allSectors: "View All Sectors",
    smeTitle: "SME Development",
    smeDesc: "Empowering small and medium enterprises to scale through tailored capacity building and AfCFTA market access.",
    intelTitle: "Market Intelligence",
    intelDesc: "Providing data-driven insights to navigate complex global trade regulations.",
    growthTitle: "Industrial Growth",
    growthDesc: "Driving the 'Buy Kenya, Build Kenya' initiative through manufacturing excellence.",
    policyTitle: "Policy Advocacy",
    policyDesc: "Engaging stakeholders to create a conducive business environment for Kenyan manufacturers.",
    officesTitle: "KAM & AfCFTA Global Reach",
    aboutTitle: "About the Resource Centre",
    aboutDesc: "The Resource Centre bridges the export information gap by providing structured access to trade analytics, regulatory documentation, and manufacturing performance data for SMEs and policymakers.",
    newsTitle: "Latest News & Updates",
    reportsTitle: "Featured Reports"
  },
  sw: {
    heroTitle: "Kusaidia Ukuaji wa Mauzo ya Nje ya Kenya Kupitia Taarifa za Biashara Zinazoaminika",
    heroDesc: "Kituo cha Rasilimali cha KAM kinatoa data ya kuaminika ya biashara, machapisho ya utafiti, na maarifa ya sera ili kuimarisha ushindani wa viwanda chini ya AfCFTA.",
    explore: "Gundua Rasilimali",
    learn: "Jifunze Zaidi",
    pillars: "Nguzo Zetu za Kimkakati",
    sectorsTitle: "Sekta za Viwanda",
    sectorsDesc: "Chagua sekta yako kupata ripoti, Takwimu, na data ya biashara",
    allSectors: "Tazama Sekta Zote",
    smeTitle: "Maendeleo ya SME",
    smeDesc: "Kuwezesha biashara ndogo na za kati kukua kupitia ujenzi wa uwezo uliolengwa na upatikanaji wa soko la AfCFTA.",
    intelTitle: "Habari za Soko",
    intelDesc: "Kutoa maarifa yanayotokana na data ili kupitia kanuni tata za biashara duniani.",
    growthTitle: "Ukuaji wa Viwanda",
    growthDesc: "Kuendeleza mpango wa 'Nunua Kenya, Jenga Kenya' kupitia ubora wa viwanda.",
    policyTitle: "Ushawishi wa Sera",
    policyDesc: "Kushirikisha wadau ili kuunda mazingira mazuri ya biashara kwa watengenezaji wa Kenya.",
    officesTitle: "Mtandao wa Global wa KAM na AfCFTA",
    aboutTitle: "Kuhusu Kituo cha Rasilimali",
    aboutDesc: "Kituo cha Rasilimali kinaziba pengo la habari za mauzo ya nje kwa kutoa ufikiaji wa uchanganuzi wa biashara na nyaraka za udhibiti.",
    newsTitle: "Habari Mpya na Sasisho",
    reportsTitle: "Ripoti Zilizoangaziwa"
  }
};

export default function Home() {
  const { data: session } = useSession();
  const [lang, setLang] = useState<"en" | "sw">("en");
  const [hoveredCard, setHoveredCard] = useState<"top" | "bottom" | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>("Africa");

  const t = content[lang];

  const getCardBg = (card: "top" | "bottom") => {
    if (hoveredCard === "top") return "bg-[#E7B947]";
    if (hoveredCard === "bottom") return "bg-[#193C8D]";
    return card === "top" ? "bg-[#193C8D]" : "bg-[#E7B947]";
  };

  const getTextColor = () => (hoveredCard === "top" ? "text-[#193C8D]" : "text-white");
  const getBtnBg = () => (hoveredCard === "top" ? "bg-[#193C8D]" : "bg-[#E7B947]");
  const getBtnText = () => (hoveredCard === "top" ? "text-white" : "text-[#193C8D]");

  const regions = [
    { name: "Africa", details: "Regional hub in Nairobi, covering 54 AfCFTA signatory states with active trade corridors in East and Central Africa." },
    { name: "Asia", details: "Strategic partnerships with Asian manufacturing hubs and export processing zones." },
    { name: "Europe", details: "Trade facilitation offices focused on EPA agreements and EU market standards." },
    { name: "North America", details: "Export promotion desks for AGOA-related manufacturing opportunities." }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 relative overflow-hidden font-sans">
      
      {/* LANGUAGE TOGGLE */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-2">
        <button onClick={() => setLang("en")} className={`px-3 py-1 rounded shadow-lg text-xs font-bold transition ${lang === 'en' ? 'bg-[#193C8D] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>EN</button>
        <button onClick={() => setLang("sw")} className={`px-3 py-1 rounded shadow-lg text-xs font-bold transition ${lang === 'sw' ? 'bg-[#193C8D] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>SW</button>
      </div>

      {/* Subtle African Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/images/african-pattern.png')" }} />

      {/* TOP STRIP */}
      <div className="bg-[#0B1E3A] text-white text-xs py-2 px-6 relative z-10">
        <div className="container mx-auto flex justify-between">
          <span>Enhancing SME Competitiveness & Market Access under AfCFTA</span>
          <span className="hidden md:block">Supported by FCDO / TMA</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative bg-[#F5F7FA] py-16 z-10">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[#0B1E3A] leading-tight mb-6">{t.heroTitle}</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{t.heroDesc}</p>
            <div className="flex gap-4">
              <a href="#sectors" className="bg-[#0B1E3A] text-white px-6 py-3 rounded-md font-medium hover:bg-[#142C55] transition">{t.explore}</a>
              <a href="#about" className="border border-[#0B1E3A] text-[#0B1E3A] px-6 py-3 rounded-md font-medium hover:bg-[#0B1E3A] hover:text-white transition">{t.learn}</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative">
            {/* Global Search Component */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <GlobalSearch />
            </div>
            
            {/* Image below search */}
            <div className="rounded-lg overflow-hidden shadow-lg bg-[#0B1E3A]">
              <img src="/images/KAM.jpg" alt="KAM Resource Centre" className="w-full h-[300px] object-cover opacity-90" />
              <div className="absolute bottom-6 left-6 bg-white/90 px-4 py-2 rounded shadow text-sm font-medium text-[#0B1E3A]">
                AfCFTA Member States & Trade Corridors
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* NEW: SECTORS SECTION - Prominent & Easy Access */}
      {/* ============================================ */}
      <section id="sectors" className="py-20 bg-gradient-to-br from-[#0B1E3A] to-[#193C8D] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/african-pattern.png')]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-[#E7B947] text-[#0B1E3A] text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              Quick Access
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
              {t.sectorsTitle}
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {t.sectorsDesc}
            </p>
          </div>

          {/* Sectors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
            {sectors.map((sector, index) => (
              <Link
                key={sector.slug}
                href={`/sectors/${sector.slug}`}
                className="group bg-white/10 backdrop-blur-sm hover:bg-white rounded-xl p-4 border border-white/20 hover:border-[#E7B947] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{sector.icon}</span>
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: sector.color }}
                  />
                </div>
                <h3 className="text-white font-bold text-sm leading-tight group-hover:text-[#E7B947] transition-colors">
                  {sector.name}
                </h3>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link 
              href="/sectors"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E7B947] text-[#0B1E3A] rounded-full font-bold hover:bg-white transition-colors"
            >
              {t.allSectors}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Resource Types Quick Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/sectors?type=pdf" className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <FileText className="w-6 h-6 text-red-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1E3A]">PDF Reports</h3>
                <p className="text-sm text-gray-600">Download sector reports</p>
              </div>
            </Link>
            <Link href="/sectors?type=powerbi" className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                <BarChart3 className="w-6 h-6 text-yellow-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1E3A]">Power BI Dashboards</h3>
                <p className="text-sm text-gray-600">Interactive analytics</p>
              </div>
            </Link>
            <Link href="/research/barometer" className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Database className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1E3A]">Trade Database</h3>
                <p className="text-sm text-gray-600">ICMS customs data</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* STRATEGIC IMPACT SECTION */}
      <section className="py-24 bg-gray-100 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-12">
            <button className="bg-[#193C8D] text-white px-6 py-2 rounded-full flex items-center gap-2 text-sm font-medium hover:opacity-90 transition">
              <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center">→</span>
              <span>{t.pillars}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* 1. SME DEVELOPMENT */}
            <div onMouseEnter={() => setHoveredCard("top")} onMouseLeave={() => setHoveredCard(null)} className={`${getCardBg("top")} p-10 rounded-3xl flex flex-col justify-between min-h-[320px] transition-colors duration-500 cursor-pointer`}>
              <div>
                <h3 className={`text-4xl font-bold mb-4 ${getTextColor()}`}>{t.smeTitle}</h3>
                <p className={`text-lg leading-relaxed ${hoveredCard === 'top' ? 'text-[#193C8D]/80' : 'text-gray-200'}`}>{t.smeDesc}</p>
              </div>
              <div className={`${getBtnBg()} ${getBtnText()} w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl`}>→</div>
            </div>

            {/* 2. MARKET INTELLIGENCE */}
            <div className="relative group overflow-hidden rounded-3xl min-h-[320px]">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80" alt="Intel" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#193C8D]/40" />
              <div className="relative z-20 p-10 h-full flex flex-col justify-between text-white">
                <div><h3 className="text-4xl font-bold mb-4">{t.intelTitle}</h3><p className="text-gray-100 text-lg">{t.intelDesc}</p></div>
                <div className="bg-[#E7B947] text-[#193C8D] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">→</div>
              </div>
            </div>

            {/* 3. INDUSTRIAL GROWTH */}
            <div className="relative group overflow-hidden rounded-3xl min-h-[480px]">
              <img src="https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?auto=format&fit=crop&w=800&q=80" alt="Growth" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-20 p-10 h-full flex flex-col justify-between text-white">
                <div><h3 className="text-4xl font-bold mb-4">{t.growthTitle}</h3><p className="text-gray-100 text-lg">{t.growthDesc}</p></div>
                <div className="bg-[#E7B947] text-[#193C8D] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">→</div>
              </div>
            </div>

            {/* 4. POLICY ADVOCACY */}
            <div onMouseEnter={() => setHoveredCard("bottom")} onMouseLeave={() => setHoveredCard(null)} className={`${getCardBg("bottom")} p-10 rounded-3xl flex flex-col justify-between min-h-[320px] transition-colors duration-500 cursor-pointer`}>
              <div>
                <h3 className={`text-4xl font-bold mb-4 ${hoveredCard === 'bottom' ? 'text-white' : 'text-[#193C8D]'}`}>{t.policyTitle}</h3>
                <p className={`text-lg leading-relaxed ${hoveredCard === 'bottom' ? 'text-gray-100' : 'text-[#193C8D]/80'}`}>{t.policyDesc}</p>
              </div>
              <div className={`${hoveredCard === 'bottom' ? 'bg-[#E7B947] text-[#193C8D]' : 'bg-[#193C8D] text-white'} w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl`}>→</div>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL REACH SECTION */}
      <section className="py-24 bg-[#193C8D] text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/african-pattern.png')" }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-serif font-bold text-center mb-16">{t.officesTitle}</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative flex justify-center items-center min-h-[300px]">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
                 alt="World Map" 
                 className="opacity-40 invert grayscale w-full max-w-lg h-auto" 
               />
               <div className="absolute top-[58%] left-[53%]">
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E7B947] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#E7B947]"></span>
                  </span>
               </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden text-gray-800 shadow-2xl border-t-4 border-[#E7B947]">
              {regions.map((region) => (
                <div key={region.name} className="border-b last:border-none border-gray-100">
                  <button 
                    onClick={() => setActiveRegion(activeRegion === region.name ? null : region.name)} 
                    className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-[#193C8D] uppercase tracking-wider text-sm">{region.name}</span>
                    <span className={`text-2xl font-light transition-transform duration-300 ${activeRegion === region.name ? "rotate-45 text-[#E7B947]" : "text-[#193C8D]"}`}>
                      +
                    </span>
                  </button>
                  <AnimatePresence>
                    {activeRegion === region.name && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        className="overflow-hidden bg-blue-50/20 px-6"
                      >
                        <p className="pb-6 text-sm text-gray-600 leading-relaxed border-l-2 border-[#E7B947] pl-4 italic">
                          {region.details}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="bg-[#0B1E3A] text-white py-16 z-10 relative">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          <div><p className="text-3xl font-bold text-[#E7B947]">54</p><p className="text-sm mt-2">AfCFTA Countries</p></div>
          <div><p className="text-3xl font-bold text-[#E7B947]">8%</p><p className="text-sm mt-2">Export Growth (2024)</p></div>
          <div><p className="text-3xl font-bold text-[#E7B947]">10K+</p><p className="text-sm mt-2">SMEs Supported</p></div>
          <div><p className="text-3xl font-bold text-[#E7B947]">100+</p><p className="text-sm mt-2">Policy Publications</p></div>
        </div>
      </section>


      {/* ABOUT SECTION */}
      <section id="about" className="py-24 z-10 relative overflow-hidden bg-white">
        <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 text-[20rem] font-serif font-black text-zinc-50 opacity-[0.03] select-none">
          KAM
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative">
          <div className="flex flex-col items-center">
            <div className="w-20 h-1 bg-[#E7B947] mb-10 rounded-full"></div>
            
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#0B1E3A] mb-8 text-center leading-tight">
              {t.aboutTitle}
            </h2>
            
            <div className="relative">
              <span className="absolute -top-10 -left-10 text-8xl text-[#E7B947]/20 font-serif">"</span>
              
              <p className="text-gray-600 leading-relaxed text-xl lg:text-2xl font-light italic text-center max-w-4xl mx-auto">
                {t.aboutDesc}
              </p>

              <span className="absolute -bottom-16 -right-10 text-8xl text-[#E7B947]/20 font-serif">"</span>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full border-t border-zinc-100 pt-12">
              {[
                { label: "Established", val: "1959" },
                { label: "Members", val: "1,500+" },
                { label: "Sectors", val: "13" },
                { label: "Impact", val: "AfCFTA Ready" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-[#0B1E3A] font-serif font-bold text-2xl">{stat.val}</div>
                  <div className="text-[#E7B947] text-[10px] uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* NEWS SECTION */}
      <section id="news" className="bg-zinc-50 py-28 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <div className="text-[#E7B947] font-bold text-xs tracking-[0.3em] uppercase mb-3">Intelligence Update</div>
              <h2 className="text-4xl font-serif font-bold text-[#0B1E3A]">{t.newsTitle}</h2>
            </div>
            <button className="text-[#0B1E3A] font-bold text-sm border-b-2 border-[#E7B947] pb-1 hover:text-[#E7B947] transition-colors">
              View All Insights →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Manufacturing Exports Rise by 8%", tag: "Trade Data", img: "bg-blue-100" },
              { title: "AfCFTA Progress Report Released", tag: "Policy", img: "bg-amber-100" },
              { title: "SME Export Readiness Workshop", tag: "Events", img: "bg-zinc-200" }
            ].map((item, i) => (
              <div 
                key={i} 
                className="group relative bg-white rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(231,185,71,0.1)] hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-[#E7B947]/20"
              >
                <div className={`relative h-56 rounded-2xl overflow-hidden mb-6 ${item.img}`}>
                  <div className="absolute inset-0 bg-[#0B1E3A]/10 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#0B1E3A] uppercase tracking-tighter">
                    {item.tag}
                  </div>
                </div>

                <div className="px-2 pb-4">
                  <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mb-3">March 12, 2025</p>
                  <h3 className="text-xl font-bold text-[#0B1E3A] mb-4 group-hover:text-[#193C8D] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-6">
                    <Link href="#" className="flex items-center gap-2 text-sm font-bold text-[#E7B947] group/link">
                      Read Analysis
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED REPORTS */}
      <section id="reports" className="bg-[#F9FAFB] py-20 relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-[#0B1E3A] text-center mb-12">{t.reportsTitle}</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {["Kenya Export Performance Report 2025", "AfCFTA Market Access Policy Brief"].map((title, i) => (
              <div key={i} className="flex gap-6 bg-white p-6 rounded-lg border shadow-sm">
                <div className="w-20 h-28 bg-[#0B1E3A] rounded"></div>
                <div>
                  <h3 className="font-semibold text-[#0B1E3A] mb-3">{title}</h3>
                  <button className="text-sm bg-[#E7B947] text-[#0B1E3A] px-4 py-2 rounded hover:bg-yellow-400 transition">Download PDF</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

