"use client"

import { useState, useRef } from "react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface SubLink {
  name: string
  path: string
  description?: string
}

interface NavLink {
  name: string
  path: string
  description: string
  subLinks?: SubLink[]
}

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isActive = (path: string) => pathname === path

  const publicLinks: NavLink[] = [
    // { name: "About", path: "/about", description: "Learn about KAM's mission and impact." },

    {
      name: "Research Hub",
      path: "/research",
      description: "Access economic barometers and trade intelligence data.",
      subLinks: [
        { name: "Industrial Barometer", path: "/research/barometer", description: "Economic performance & trends" },
        { name: "KRA Data Hub", path: "/research/kra", description: "Customs, ICMS & trade data" },
        { name: "Macro-Economic Data", path: "/research/macro", description: "National GDP & fiscal policy" },
      ],
    },

    {
      name: "Sectors",
      path: "/sectors",
      description: "Comprehensive data on sector publications, leadership, and governance.",
      subLinks: [
        { name: "Applicable Taxes", path: "/sectors/taxes", description: "Outlook on applicable taxes in each sector" },
        { name: "Sector Publications", path: "/sectors/publications", description: "Sector and subsector publications" },
        { name: "Membership & Products", path: "/sectors/membership", description: "Membership and products by HS Codes" },
        { name: "Sector Governance", path: "/sectors/governance", description: "Legislative and governance documents" },
        { name: "Sectors Leadership", path: "/sectors/leadership", description: "History and current leadership tenure" },
      ],
    },

    {
      name: "HS Sections",
      path: "/sections",
      description: "Explore the 21 Harmonized System product sections with trade data.",
      subLinks: [
        { name: "Live Animals", path: "/sections/i-live-animals", description: "Animals and animal products" },
        { name: "Vegetable Products", path: "/sections/ii-vegetable-products", description: "Agricultural and plant goods" },
        { name: "Fats and Oils", path: "/sections/iii-fats-oils", description: "Animal and vegetable oils" },
        { name: "Prepared Food", path: "/sections/iv-prepared-food", description: "Processed food products" },
        { name: "Mineral Products", path: "/sections/v-mineral-products", description: "Petroleum, minerals and fuels" },
        { name: "Chemicals", path: "/sections/vi-chemicals", description: "Industrial and organic chemicals" },
        { name: "Plastics & Rubber", path: "/sections/vii-plastics-rubber", description: "Polymer and rubber materials" },
        { name: "Leather Goods", path: "/sections/viii-leather", description: "Leather and animal hides" },
        { name: "Wood Articles", path: "/sections/ix-wood", description: "Timber and wood products" },
        { name: "Paper & Pulp", path: "/sections/x-paper", description: "Paper manufacturing materials" },
        { name: "Textiles", path: "/sections/xi-textiles", description: "Clothing and fabric materials" },
        { name: "Footwear", path: "/sections/xii-footwear", description: "Shoes and footwear products" },
        { name: "Stone & Glass", path: "/sections/xiii-stone-ceramic", description: "Ceramics, cement and glass" },
        { name: "Precious Items", path: "/sections/xiv-pearls", description: "Pearls, gems and jewellery" },
        { name: "Base Metals", path: "/sections/xv-base-metals", description: "Iron, steel and metal goods" },
        { name: "Machinery", path: "/sections/xvi-machinery", description: "Industrial machinery and equipment" },
        { name: "Transport", path: "/sections/xvii-transport", description: "Vehicles and transport equipment" },
        { name: "Optical / Medical", path: "/sections/xviii-optical-medical", description: "Medical and optical instruments" },
        { name: "Arms & Ammo", path: "/sections/xix-arms", description: "Weapons and ammunition" },
        { name: "Misc Items", path: "/sections/xx-miscellaneous", description: "Various manufactured goods" },
        { name: "Art & Antiques", path: "/sections/xxi-art-antiques", description: "Artworks and antiques" },
      ],
    },

{
      name: "Trade & Policy",
      path: "/trade",
      description: "Trade agreements, customs information, and business compliance data.",
      subLinks: [
        { name: "Free Trade Areas", path: "/trade/free-trade-areas", description: "AfCFTA and regional trade blocs" },
        { name: "Business Facilitation", path: "/trade/facilitation", description: "Trade and business support services" },
        { name: "Standards & Compliance", path: "/trade/standards", description: "Product quality and regulatory standards" },
        { name: "Customs & Borders", path: "/trade/customs", description: "Customs procedures and border management" },
        { name: "Infrastructure & Logistics", path: "/trade/logistics", description: "Transport, supply chain and logistics" },
        { name: "Local Content (BKBK)", path: "/trade/local-content", description: "Buy Kenya Build Kenya initiatives" },
        { name: "Domestic Trade", path: "/trade/domestic", description: "Internal market and local trade policy" },
        { name: "Trade Barriers", path: "/trade/barriers", description: "Non-tariff and technical barriers to trade" },
        { name: "Partnerships", path: "/trade/partnerships", description: "Collaborative programs and trade partnerships" },
        { name: "Illicit Trade", path: "/trade/illicit", description: "Monitoring and combatting illegal trade" },
      ],
    },

    // { name: "Contact", path: "/contact", description: "Get in touch with our policy experts." },
  ]

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(name)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150)
  }

  const activeLinkData = publicLinks.find((l) => l.name === activeMenu)
  const isHSMenu = activeMenu === "HS Sections"

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full" onMouseLeave={handleMouseLeave}>
        <div className="h-1 w-full bg-[#E7B947]" />

        <nav className="relative border-b border-zinc-200 bg-white shadow-sm">
          <div className="container mx-auto flex h-20 items-center justify-between px-6">

            <Link href="/" className="flex items-center">
              <img src="/images/kamlogo.jpg" className="h-12 w-auto object-contain" />
            </Link>

            <div className="hidden lg:flex items-center gap-10 h-full">
              {publicLinks.map((item) => (
                <div
                  key={item.name}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => item.subLinks && handleMouseEnter(item.name)}
                >
                  <Link
                    href={item.path}
                    className={`text-sm font-semibold transition-colors ${
                      isActive(item.path) || activeMenu === item.name
                        ? "text-[#193C8D]"
                        : "text-zinc-600 hover:text-[#193C8D]"
                    }`}
                  >
                    {item.name}
                  </Link>

                  {(isActive(item.path) || activeMenu === item.name) && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E7B947]"
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => signIn("keycloak")}
              className="px-6 py-2.5 bg-[#193C8D] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-lg transition-all"
            >
              Login
            </button>
          </div>

          <AnimatePresence>
            {activeMenu && activeLinkData?.subLinks && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 top-full w-full bg-white border-b border-zinc-200 shadow-xl"
              >
                <div className="container mx-auto px-6 py-12">
                  <div className="flex gap-32 items-start">
                    <div className="w-72 shrink-0">
                      <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-8 flex flex-col h-full justify-between">
                        <div>
                          <div className="w-8 h-1 bg-[#E7B947] mb-4 rounded-full" />
                          <h3 className="text-xl font-black text-[#193C8D] uppercase tracking-tight mb-3">
                            {activeMenu}
                          </h3>
                          <p className="text-zinc-500 text-xs leading-relaxed">
                            {activeLinkData.description}
                          </p>
                        </div>
                        <div className="mt-6 pt-5 border-t border-zinc-200">
                          <Link
                            href={activeLinkData.path}
                            onClick={() => setActiveMenu(null)}
                            className="inline-flex items-center gap-2 text-[#193C8D] text-xs font-bold uppercase tracking-wider group"
                          >
                            <span className="group-hover:text-[#E7B947] transition-colors">
                              View All
                            </span>
                            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white border border-zinc-200 group-hover:bg-[#E7B947] group-hover:border-[#E7B947] transition-all">
                              <ArrowRight className="w-3.5 h-3.5 text-[#193C8D] group-hover:text-white transition-colors" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex-1 pl-32 border-l border-zinc-100 grid gap-3 ${
                        isHSMenu ? "grid-cols-3 xl:grid-cols-4" : "grid-cols-2"
                      }`}
                    >
                      {activeLinkData.subLinks.map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          onClick={() => setActiveMenu(null)}
                          className="group flex flex-col p-3 rounded-xl hover:bg-zinc-50 transition border border-transparent hover:border-zinc-100"
                        >
                          <span className="text-[#193C8D] text-sm font-semibold group-hover:text-[#E7B947] transition-colors">
                            {sub.name}
                          </span>
                          {sub.description && (
                            <span className="text-zinc-400 text-xs mt-1 line-clamp-1">
                              {sub.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <div className="h-20 w-full" />
    </>
  )
}