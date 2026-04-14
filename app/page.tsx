"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, BarChart3, Database, ArrowRight } from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";

// D3 Imports for the Map
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";

// --- Types & Constants ---
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

const content = {
  en: {
    heroTitle: "Empowering Kenya’s Export Growth through Trusted Trade Policy Insights",
    heroDesc: "KAM’s Resource Centre provides you with trade data, in-depth research, and policy insights designed to drive manufacturing competitiveness within the AfCFTA, empowering you to make informed regional and global market decisions.",
    explore: "Explore Resources",
    learn: "Learn More",
    pillars: "Our Strategic Pillars",
    aboutTitle: "About the Resource Centre",
    aboutDesc: "The Resource Centre bridges the export information gap by providing structured access to trade analytics, regulatory documentation, and manufacturing performance data for SMEs and policymakers.",
    intelTitle: "Market Insights",
    intelDesc: "Providing data-driven insights to navigate complex global trade regulations.",
    policyTitle: "Trade Policy",
    policyDesc: "Engaging stakeholders to create a conducive business environment for Kenyan manufacturers.",
    officesTitle: "KAM & AfCFTA Global Reach",
    reportsTitle: "Featured Reports"
  },
  sw: {
    heroTitle: "Kusaidia Ukuaji wa Mauzo ya Nje ya Kenya Kupitia Taarifa za Biashara Zinazoaminika",
    heroDesc: "Kituo cha Rasilimali cha KAM kinatoa data ya kuaminika ya biashara, machapisho ya utafiti, na maarifa ya sera ili kuimarisha ushindani wa viwanda chini ya AfCFTA.",
    explore: "Gundua Rasilimali",
    learn: "Jifunze Zaidi",
    pillars: "Nguzo Zetu za Kimkakati",
    aboutTitle: "Kuhusu Kituo cha Rasilimali",
    aboutDesc: "Kituo cha Rasilimali kinaziba pengo la habari za mauzo ya nje kwa kutoa ufikiaji wa uchanganuzi wa biashara na nyaraka za udhibiti.",
    intelTitle: "Habari za Soko",
    intelDesc: "Kutoa maarifa yanayotokana na data ili kupitia kanuni tata za biashara duniani.",
    policyTitle: "Ushawishi wa Sera",
    policyDesc: "Kushirikisha wadau ili kuunda mazingira mazuri ya biashara kwa watengenezaji wa Kenya.",
    officesTitle: "Mtandao wa Global wa KAM na AfCFTA",
    reportsTitle: "Ripoti Zilizoangaziwa"
  }
};

interface ExportMarket {
  country: string;
  value: number;
  coords: { lat: number; lng: number };
}

interface DashboardStats {
  afcftaCountries: string | number;
  exportGrowth: string;
  smesSupported: string;
  policyPublications: string | number;
}

// --- ISO-Accurate Africa Map for Hero Section ---
function HeroAfricaMap() {
  const width = 400;
  const height = 450;

  const projection = geoMercator()
    .scale(280) 
    .center([20, 2]) 
    .translate([width / 2, height / 2]);

  const pathGenerator = geoPath().projection(projection);

  const allCountries = feature(worldData as any, (worldData as any).objects.countries) as any;
  
  const africaIds = [
    "012", "024", "204", "072", "854", "108", "120", "132", "140", "148", "174", "178", 
    "180", "262", "226", "232", "231", "266", "270", "288", "324", "624", "384", "404", 
    "426", "430", "434", "450", "454", "466", "478", "480", "504", "508", "516", "562", 
    "566", "646", "678", "686", "690", "694", "706", "728", "729", "736", "748", "834", 
    "768", "788", "800", "818", "894", "716"
  ];

  const africaFeatures = allCountries.features.filter((d: any) => 
    africaIds.includes(d.id?.toString().padStart(3, '0'))
  );

  const hubs = [
    { name: "Nairobi", coords: [36.8, -1.2] as [number, number] },
    { name: "Lagos", coords: [3.4, 6.5] as [number, number] },
    { name: "Cairo", coords: [31.2, 30.0] as [number, number] },
    { name: "Jo'burg", coords: [28.0, -26.2] as [number, number] },
    { name: "Dakar", coords: [-17.4, 14.7] as [number, number] },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full p-4 drop-shadow-2xl">
      {africaFeatures.map((d: any, i: number) => (
        <motion.path
          key={`hero-africa-${d.id}`}
          d={pathGenerator(d)!}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: i * 0.02 }}
          fill="#E7B947"
          fillOpacity="0.1"
          stroke="#E7B947"
          strokeWidth="0.3"
          whileHover={{ fillOpacity: 0.5, strokeWidth: 1 }}
        />
      ))}

      {hubs.map((hub, i) => {
        const pos = projection(hub.coords);
        if (!pos) return null;
        return (
          <g key={`hub-${hub.name}`}>
            <circle cx={pos[0]} cy={pos[1]} r="2" fill="#E7B947" />
            <motion.circle
              cx={pos[0]} cy={pos[1]} r="5"
              stroke="#E7B947" strokeWidth="1" fill="transparent"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5 }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// --- D3 Global Export Map Component ---
function ExportMap() {
  const [markets, setMarkets] = useState<ExportMarket[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  const width = 800;
  const height = 400;

  const projection = geoMercator()
    .scale(130)
    .translate([width / 2, height / 1.5]);

  const path = geoPath().projection(projection);

  const kenyaCoords: [number, number] = [36.817223, -1.286389];
  const kenyaXY = projection(kenyaCoords);

  useEffect(() => {
    fetch("/api/export-markets")
      .then((res) => res.json())
      .then(setMarkets)
      .catch((err) => console.error("Error fetching map data:", err));
  }, []);

  const countries = feature(worldData as any, (worldData as any).objects.countries) as any;

  return (
    <div className="flex justify-center w-full overflow-hidden">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="bg-[#193C8D] rounded-xl shadow-2xl max-w-full h-auto"
      >
        {countries.features.map((d: any, i: number) => (
          <path
            key={`country-${i}`}
            d={path(d)!}
            fill="#94A3B8"
            stroke="#1E3A8A"
            strokeWidth={0.5}
            className="transition-colors duration-300 hover:fill-slate-300"
          />
        ))}

        {kenyaXY &&
          markets.map((m) => {
            const dest = projection([m.coords.lng, m.coords.lat]);
            if (!dest) return null;

            return (
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                key={`line-${m.country}`}
                x1={kenyaXY[0]}
                y1={kenyaXY[1]}
                x2={dest[0]}
                y2={dest[1]}
                stroke="#E7B947"
                strokeWidth={2}
                strokeDasharray="4,2"
              />
            );
          })}

        {markets.map((m) => {
          const dest = projection([m.coords.lng, m.coords.lat]);
          if (!dest) return null;

          return (
            <g
              key={`point-${m.country}`}
              onMouseEnter={() => setHovered(m.country)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <circle
                cx={dest[0]}
                cy={dest[1]}
                r={hovered === m.country ? 7 : 5}
                fill="#E7B947"
                stroke="white"
                strokeWidth={1.5}
                className="transition-all duration-200"
              />

              {hovered === m.country && (
                <g className="z-50">
                   <rect 
                    x={dest[0] + 10} 
                    y={dest[1] - 25} 
                    width={140} 
                    height={40} 
                    rx={4} 
                    fill="white" 
                    className="shadow-lg"
                  />
                  <text
                    x={dest[0] + 15}
                    y={dest[1] - 10}
                    fill="#193C8D"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {m.country}
                  </text>
                  <text
                    x={dest[0] + 15}
                    y={dest[1] + 5}
                    fill="#E7B947"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    Value: ${m.value.toLocaleString()}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {kenyaXY && (
          <g>
            <circle
              cx={kenyaXY[0]}
              cy={kenyaXY[1]}
              r={6}
              fill="#E7B947"
              stroke="white"
              strokeWidth={2}
            />
            <circle
              cx={kenyaXY[0]}
              cy={kenyaXY[1]}
              r={12}
              fill="#E7B947"
              className="animate-ping opacity-30"
            />
            <text
              x={kenyaXY[0] + 10}
              y={kenyaXY[1] + 5}
              fill="#E7B947"
              fontSize="14"
              fontWeight="bold"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
            >
              Kenya
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// --- Main Home Page ---
export default function Home() {
  const { data: session } = useSession();
  const [lang, setLang] = useState<"en" | "sw">("en");
  const [hoveredCard, setHoveredCard] = useState<"top" | "bottom" | null>(null);

  const [stats, setStats] = useState<DashboardStats>({
    afcftaCountries: "...",
    exportGrowth: "...",
    smesSupported: "...",
    policyPublications: "..."
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/homepage-stats");
        const data = await res.json();
        if (!data.error) {
          setStats({
            afcftaCountries: data.afcftaCountries,
            exportGrowth: data.exportGrowth,
            smesSupported: data.smesSupported,
            policyPublications: data.policyPublications
          });
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    }
    fetchStats();
  }, []);

  const t = content[lang];

  const getCardBg = (card: "top" | "bottom") => {
    if (hoveredCard === "top") return "bg-[#E7B947]";
    if (hoveredCard === "bottom") return "bg-[#193C8D]";
    return card === "top" ? "bg-[#193C8D]" : "bg-[#E7B947]";
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/african-pattern.png')" }} />

      {/* HERO SECTION */}
      <section className="relative bg-[#F5F7FA] pt-24 pb-16 z-10">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[#0B1E3A] leading-tight mb-6">
              {t.heroTitle}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t.heroDesc}
            </p>
            <div className="flex gap-4">
              <Link href="/sectors">
                <button className="bg-[#193C8D] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-all">
                  {t.explore}
                </button>
              </Link>
            </div>
          </motion.div>

          <div className="relative">
            {/* <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <GlobalSearch />
            </div> */}

            <div className="rounded-lg overflow-hidden shadow-lg bg-[#0B1E3A] flex items-center justify-center h-[500px] relative">
              <HeroAfricaMap />

              <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-[#E7B947] rounded-full animate-ping" />
                  <p className="text-[#E7B947] font-bold text-sm tracking-widest uppercase">AfCFTA Network</p>
                </div>
                <p className="text-white/90 text-[10px] leading-relaxed">
                  Unifying 54 nations into the world's largest free trade area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 z-10 relative bg-white">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <div className="w-20 h-1 bg-[#E7B947] mx-auto mb-10 rounded-full"></div>
          <h2 className="text-4xl font-serif font-bold text-[#0B1E3A] mb-8">{t.aboutTitle}</h2>
          <p className="text-gray-600 text-xl lg:text-2xl font-light italic leading-relaxed">
            "{t.aboutDesc}"
          </p>
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
            <div className="relative group overflow-hidden rounded-3xl min-h-[320px]">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80" alt="Intel" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#193C8D]/40" />
              <div className="relative z-20 p-10 h-full flex flex-col justify-between text-white">
                <div>
                  <h3 className="text-4xl font-bold mb-4">{t.intelTitle}</h3>
                  <p className="text-gray-100 text-lg">{t.intelDesc}</p>
                </div>
                <div className="bg-[#E7B947] text-[#193C8D] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">→</div>
              </div>
            </div>

            <div 
              onMouseEnter={() => setHoveredCard("bottom")} 
              onMouseLeave={() => setHoveredCard(null)} 
              className={`${getCardBg("bottom")} p-10 rounded-3xl flex flex-col justify-between min-h-[320px] transition-colors duration-500 cursor-pointer`}
            >
              <div>
                <h3 className={`text-4xl font-bold mb-4 ${hoveredCard === 'bottom' ? 'text-white' : 'text-[#193C8D]'}`}>{t.policyTitle}</h3>
                <p className={`text-lg leading-relaxed ${hoveredCard === 'bottom' ? 'text-gray-100' : 'text-[#193C8D]/80'}`}>{t.policyDesc}</p>
              </div>
              <div className={`${hoveredCard === 'bottom' ? 'bg-[#E7B947] text-[#193C8D]' : 'bg-[#193C8D] text-white'} w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl`}>→</div>
            </div>
          </div>
        </div>
      </section>

      {/* KENYA EXPORT DESTINATIONS SECTION */}
      <section className="py-24 bg-[#193C8D] text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
             style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/african-pattern.png')" }} />

        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-serif font-bold text-center mb-8">Kenya's Export Destinations</h2>
          <p className="text-center max-w-2xl mx-auto mb-16 text-lg text-blue-100/90">
            Explore where Kenyan goods are exported around the world. The map highlights Kenya's key export markets and the value of exports to each destination.
          </p>
          <div className="flex justify-center">
            <ExportMap />
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="bg-[#0B1E3A] text-white py-16 z-10 relative">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-[#E7B947]">{stats.afcftaCountries}</p>
            <p className="text-sm mt-2 opacity-80">AfCFTA Countries</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#E7B947]">{stats.exportGrowth}</p>
            <p className="text-sm mt-2 opacity-80">Export Growth</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#E7B947]">{stats.smesSupported}</p>
            <p className="text-sm mt-2 opacity-80">SMEs Supported</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#E7B947]">{stats.policyPublications}</p>
            <p className="text-sm mt-2 opacity-80">Policy Publications</p>
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
                <div className="w-20 h-28 bg-[#0B1E3A] rounded flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-[#0B1E3A] mb-3">{title}</h3>
                  <button className="text-sm bg-[#E7B947] text-[#0B1E3A] px-4 py-2 rounded hover:bg-yellow-400 transition">
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
