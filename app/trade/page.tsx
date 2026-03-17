import Link from "next/link";
import { ArrowRight, Globe, Shield, Truck, Scale, FileText, Users, Building2, MapPin } from "lucide-react";

const tradeTopics = [
  {
    name: "Free Trade Areas",
    path: "/trade/free-trade-areas",
    description: "AfCFTA and regional trade blocs - rules of origin, tariffs and market access",
    icon: Globe
  },
  {
    name: "Business Facilitation",
    path: "/trade/facilitation",
    description: "Trade and business support services - licensing and single window systems",
    icon: Users
  },
  {
    name: "Standards & Compliance",
    path: "/trade/standards",
    description: "Product quality and regulatory standards - KEBS, sanitary & phytosanitary measures",
    icon: Shield
  },
  {
    name: "Customs & Borders",
    path: "/trade/customs",
    description: "Customs procedures and border management - iCMS, valuation and classification",
    icon: Scale
  },
  {
    name: "Infrastructure & Logistics",
    path: "/trade/logistics",
    description: "Transport, supply chain and logistics - ports, SGR and cold chain infrastructure",
    icon: Truck
  },
  {
    name: "Local Content (BKBK)",
    path: "/trade/local-content",
    description: "Buy Kenya Build Kenya initiatives - PPPs and government procurement",
    icon: Building2
  },
  {
    name: "Domestic Trade",
    path: "/trade/domestic",
    description: "Internal market and local trade policy - county markets and distribution networks",
    icon: MapPin
  },
  {
    name: "Trade Barriers",
    path: "/trade/barriers",
    description: "Non-tariff and technical barriers to trade - SPS, TBT and import bans",
    icon: FileText
  },
  {
    name: "Partnerships",
    path: "/trade/partnerships",
    description: "Collaborative programs and trade partnerships - EPZ, KIA and export councils",
    icon: Users
  },
  {
    name: "Illicit Trade",
    path: "/trade/illicit",
    description: "Monitoring and combatting illegal trade - counterfeits and smuggling",
    icon: Shield
  }
];

export default function TradePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero */}
      <section className="bg-[#193C8D] pt-28 pb-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Trade & Policy
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-12">
              Trade agreements, customs procedures, regulatory compliance and business facilitation resources for Kenyan manufacturers.
            </p>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="container mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Trade Topics
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Explore guides, regulations, agreements and compliance resources for international and domestic trade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tradeTopics.map((topic) => (
            <Link
              key={topic.path}
              href={topic.path}
              className="group bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#193C8D]/10 transition-colors">
                <topic.icon className="w-8 h-8 text-[#193C8D] group-hover:text-[#193C8D]" />
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-4 group-hover:text-[#193C8D] transition-colors">
                {topic.name}
              </h3>
              
              <p className="text-slate-600 text-sm mb-8 flex-1">
                {topic.description}
              </p>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <span className="text-sm font-medium text-[#193C8D]">
                  Explore Topic
                </span>
                <ArrowRight className="w-4 h-4 text-[#193C8D] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
