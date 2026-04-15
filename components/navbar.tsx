"use client"

import { useEffect, useState, useRef } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react"
import { 
  BeakerIcon, 
  TruckIcon, 
  BuildingOffice2Icon, 
  PresentationChartLineIcon,
  GlobeAltIcon,
  BanknotesIcon,
  BookOpenIcon,
  BoltIcon,
  DocumentTextIcon,
  AcademicCapIcon, 
  ScissorsIcon, 
  ShoppingBagIcon,
  FireIcon,
  CircleStackIcon,
  BriefcaseIcon,
  PuzzlePieceIcon
} from "@heroicons/react/24/outline"
// Updated import to match the new type definition
import { HS_SECTORS_ONLY } from "@/types/sectors"

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
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  // Use the new constant for initialization
  const [hoveredSectorId, setHoveredSectorId] = useState<number>(HS_SECTORS_ONLY[0].id)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role ?? "PUBLIC"
  const isAdmin = userRole === "SUPERADMIN" || userRole === "ADMIN"

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    setMobileOpen(false)
    setMobileExpanded(null)
  }, [pathname])

  if (pathname.startsWith('/admin')) {
    return null
  }

  const publicLinks: NavLink[] = [
    {
      name: "Home",
      path: "/",
      description: "Welcome to the KAM Data Portal - your gateway to comprehensive trade and economic insights.",
    },
    {
      name: "Sectors",
      path: "/sectors",
      description: "Explore KAM's 13 industrial sectors and their HS section classifications.",
    },
    {
      name: "Trade Policy",
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
    {
      name: "Tax",
      path: "/tax",
      description: "Tax reports, analysis, and resources."
    },
    {
      name: "Publications",
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
    {
      name: "Research Hub",
      path: "/research",
      description: "Access economic barometers and trade intelligence data.",
      subLinks: [
        { name: "Industrial Barometer", path: "/research/barometer", description: "Economic performance & trends" },
        { name: "Data Hub", path: "/research/kra", description: "Customs, Domestic & trade data" },
        { name: "Macro-Economic Data", path: "/research/macro", description: "National GDP & fiscal policy" },
      ],
    },
  ]

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(name)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150)
  }

  const activeLinkData = publicLinks.find((l) => l.name === activeMenu)
  const isSectorsMenu = activeMenu === "Sectors"
  // Using the new constant for data lookup
  const hoveredSector = HS_SECTORS_ONLY.find((s) => s.id === hoveredSectorId) ?? HS_SECTORS_ONLY[0]

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full" onMouseLeave={handleMouseLeave}>
        {/* TOP BAR */}
        <div className="bg-white border-b border-zinc-100 h-20">
          <div className="container mx-auto flex h-full items-center justify-between gap-3 px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2 md:gap-4 min-w-0 flex-1 pr-2 md:pr-4">
              <img src="/images/kamlogo.jpg" className="h-10 md:h-12 w-auto object-contain shrink-0" alt="KAM Logo" />
              <div className="h-8 w-[1px] bg-zinc-200 hidden md:block" />
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-lg md:text-xl font-black text-[#193C8D] uppercase tracking-tighter truncate">KAM</span>
                <span className="hidden sm:block text-sm md:text-lg font-medium text-zinc-500 truncate">Resource Centre</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 md:gap-6 shrink-0">
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-200 text-[#193C8D]"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-zinc-700 hidden md:block">
                    {session.user?.name || session.user?.email}
                  </span>
                  <button onClick={() => signOut()} className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-kam-navy transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn("keycloak")}
                  className="px-6 py-2.5 bg-[#193C8D] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-lg transition-all"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Navigation Links */}
        <nav className="relative bg-[#193C8D] border-b border-[#E7B947]/30 hidden lg:block">
          <div className="container mx-auto flex h-14 items-center px-6">
            <div className="hidden lg:flex items-center gap-1 h-full">
              {publicLinks.map((item) => (
                <div
                  key={item.name}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => (item.subLinks || item.name === "Sectors") && handleMouseEnter(item.name)}
                >
                  <Link
                    href={item.path}
                    className={`px-5 h-full flex items-center text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive(item.path) || activeMenu === item.name
                        ? "bg-[#E7B947] text-[#193C8D]"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* MEGA MENU DROPDOWN */}
          <AnimatePresence>
            {activeMenu && (activeLinkData?.subLinks || isSectorsMenu) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 top-full w-full bg-white border-b border-zinc-200 shadow-xl"
              >
                <div className="container mx-auto px-6 py-12">
                  {isSectorsMenu ? (
                    <div className="flex gap-8 items-start">
                      <div className="w-64 shrink-0">
                        <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-8 flex flex-col h-full justify-between">
                          <div>
                            <div className="w-8 h-1 bg-[#E7B947] mb-4 rounded-full" />
                            <h3 className="text-xl font-black text-[#193C8D] uppercase tracking-tight mb-3">Sectors</h3>
                            <p className="text-zinc-500 text-xs leading-relaxed">{activeLinkData?.description}</p>
                          </div>
                          <div className="mt-6 pt-5 border-t border-zinc-200">
                            <Link href="/sectors" onClick={() => setActiveMenu(null)} className="inline-flex items-center gap-2 text-[#193C8D] text-xs font-bold uppercase tracking-wider group">
                              <span className="group-hover:text-[#E7B947] transition-colors">View All</span>
                              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white border border-zinc-200 group-hover:bg-[#E7B947] group-hover:border-[#E7B947] transition-all">
                                <ArrowRight className="w-3.5 h-3.5 text-[#193C8D] group-hover:text-white transition-colors" />
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="w-56 shrink-0 border-l border-zinc-100 pl-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">KAM Sectors</p>
                        <div className="flex flex-col gap-0.5">
                          {HS_SECTORS_ONLY.map((sector) => (
                            <button
                              key={sector.id}
                              onMouseEnter={() => setHoveredSectorId(sector.id)}
                              className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                hoveredSectorId === sector.id ? "bg-[#193C8D] text-white" : "text-zinc-600 hover:bg-zinc-50"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <sector.icon className="w-4 h-4 flex-shrink-0 text-current" />
                                <span className="line-clamp-1">{sector.name}</span>
                              </span>
                              <ChevronRight className="w-3 h-3 shrink-0 opacity-50" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 border-l border-zinc-100 pl-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">
                          Related Sectors
                        </p>
                        <Link href={`/sectors/${hoveredSector.slug}`} onClick={() => setActiveMenu(null)} className="group flex items-center gap-2 p-6 rounded-xl border border-dashed border-zinc-200 hover:border-[#193C8D] hover:bg-zinc-50 transition w-full">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:from-[#193C8D]/10 group-hover:to-[#E7B947]/10 transition-all">
                            <hoveredSector.icon className="w-5 h-5 text-slate-600 group-hover:text-[#193C8D] transition-colors" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#193C8D] group-hover:text-[#E7B947] transition-colors block">
                              View {hoveredSector.name} Resources
                            </span>
                            <span className="text-xs text-zinc-500">All documents & dashboards</span>
                          </div>
                          <ArrowRight className="w-4 h-4 ml-auto text-zinc-400 group-hover:text-[#193C8D] transition-colors" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-32 items-start">
                      <div className="w-72 shrink-0">
                        <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-8 flex flex-col h-full justify-between">
                          <div>
                            <div className="w-8 h-1 bg-[#E7B947] mb-4 rounded-full" />
                            <h3 className="text-xl font-black text-[#193C8D] uppercase tracking-tight mb-3">{activeMenu}</h3>
                            <p className="text-zinc-500 text-xs leading-relaxed">{activeLinkData!.description}</p>
                          </div>
                          <div className="mt-6 pt-5 border-t border-zinc-200">
                            <Link href={activeLinkData!.path} onClick={() => setActiveMenu(null)} className="inline-flex items-center gap-2 text-[#193C8D] text-xs font-bold uppercase tracking-wider group">
                              <span className="group-hover:text-[#E7B947] transition-colors">View All</span>
                              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white border border-zinc-200 group-hover:bg-[#E7B947] group-hover:border-[#E7B947] transition-all">
                                <ArrowRight className="w-3.5 h-3.5 text-[#193C8D] group-hover:text-white transition-colors" />
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 pl-32 border-l border-zinc-100 grid grid-cols-2 gap-3">
                        {activeLinkData!.subLinks!.map((sub) => (
                          <Link key={sub.path} href={sub.path} onClick={() => setActiveMenu(null)} className="group flex flex-col p-3 rounded-xl hover:bg-zinc-50 transition border border-transparent hover:border-zinc-100">
                            <span className="text-[#193C8D] text-sm font-semibold group-hover:text-[#E7B947] transition-colors">{sub.name}</span>
                            {sub.description && <span className="text-zinc-400 text-xs mt-1 line-clamp-1">{sub.description}</span>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden absolute left-0 right-0 top-20 bg-white border-b border-zinc-200 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              <div className="px-5 py-4 space-y-2">
                {publicLinks.map((item) => {
                  const isExpandable = Boolean(item.subLinks?.length) || item.name === "Sectors"
                  const expanded = mobileExpanded === item.name

                  return (
                    <div key={item.name} className="border border-zinc-100 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between bg-zinc-50">
                        <Link href={item.path} className={`flex-1 px-4 py-3 text-sm font-semibold ${isActive(item.path) ? "text-[#193C8D]" : "text-zinc-700"}`} onClick={() => setMobileOpen(false)}>
                          {item.name}
                        </Link>
                        {isExpandable && (
                          <button type="button" className="px-4 py-3 text-zinc-500" onClick={() => setMobileExpanded(expanded ? null : item.name)}>
                            <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
                          </button>
                        )}
                      </div>

                      {expanded && item.subLinks?.length ? (
                        <div className="bg-white p-2 space-y-1">
                          {item.subLinks.map((sub) => (
                            <Link key={sub.path} href={sub.path} className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50" onClick={() => setMobileOpen(false)}>
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      ) : null}

                      {expanded && item.name === "Sectors" ? (
                        <div className="bg-white p-2 grid grid-cols-1 gap-1">
                          {HS_SECTORS_ONLY.map((sector) => (
                            <Link key={sector.id} href={`/sectors/${sector.slug}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50" onClick={() => setMobileOpen(false)}>
                              <sector.icon className="w-4 h-4 flex-shrink-0 text-current" />
                              <span className="line-clamp-1">{sector.name}</span>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="h-20 lg:h-[136px] w-full" />
    </>
  )
}

