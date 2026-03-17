"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Download, Eye, PlayCircle, Search, Filter, X } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

const publications = [
  { id: 1, title: "Automotive sector profile 2020", date: "Monday at 7:07 AM", author: "Joshat Machagua", fileUrl: "/documents/sector-reports/Automotive sector profile 2020 (13) (6).pdf", category: "Automotive" },
  { id: 2, title: "Building and Construction sector 2020", date: "Monday at 7:07 AM", author: "Joshat Machagua", fileUrl: "/documents/sector-reports/Buildind and Construction sector 2020 (4).pdf", category: "Construction" },
  { id: 3, title: "Growing and diversifying steel industry in Kenya", date: "Monday at 7:07 AM", author: "Joshat Machagua", fileUrl: "/documents/sector-reports/Growing and diversifying steel industry in Kenya (12).pdf", category: "Steel" },
  { id: 4, title: "Implications on Maize Milling Costs Policy Brief", date: "Monday at 7:07 AM", author: "Joshat Machagua", fileUrl: "/documents/sector-reports/Implications on Maize Milling Costs Policy Brief (3) (3).pdf", category: "Agriculture" },
  { id: 5, title: "Leather Sub Sector Profile", date: "Monday at 7:07 AM", author: "Joshat Machagua", fileUrl: "/documents/sector-reports/LEATHER SUB SECTOR.final small pdf (4).pdf", category: "Leather" },
  { id: 6, title: "Livestock Annual Report 2024", date: "Monday at 7:07 AM", author: "Joshat Machagua", fileUrl: "/documents/sector-reports/livestock-annual-report-2024.pdf", category: "Livestock" },
  { id: 7, title: "Maize Value Chain Report", date: "Monday at 7:07 AM", author: "Joshat Machagua", fileUrl: "/documents/sector-reports/MAIZE VALUE CHAIN REPORT (2) (3).pdf", category: "Agriculture" },
  { id: 8, title: "Quarry Sub-sector Profile", date: "Monday at 7:07 AM", author: "Joshat Machagua", fileUrl: "/documents/sector-reports/Quarry Sub-sector profile (5).pdf", category: "Mining" },
  { id: 9, title: "Salt Profile Final", date: "Monday at 7:07 AM", author: "Joshat Machagua", fileUrl: "/documents/sector-reports/salt profile final small pdf (1) (4).pdf", category: "Mining" },
  { id: 10, title: "Sugar Sub Sector Profile 2020", date: "Monday at 7:07 AM", author: "Joshat Machagua", fileUrl: "/documents/sector-reports/sugar sub sector profile 2020 (4).pdf", category: "Agriculture" }
]

export default function SectorPublications() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = useMemo(() => ["All", ...new Set(publications.map(p => p.category))], [])

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || pub.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const handleAction = (url: string, action: "view" | "download") => {
    if (action === "view") {
      window.open(url, "_blank")
    } else {
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", url.split("/").pop() || "document.pdf")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* HERO */}
      <section className="bg-[#193C8D] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-serif font-bold mb-4">Sector Publications</h1>
          <p className="text-gray-300 max-w-2xl">
            Explore reports, sector studies and manufacturing insights from Kenya's industrial sectors.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* FIXED LAYOUT CLASS BELOW: flex-col lg:flex-row */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT SIDEBAR (1/4 Width) */}
          <aside className="lg:w-1/4 space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-serif font-bold text-[#0B1E3A] mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" /> Search
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#193C8D] transition"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-serif font-bold text-[#0B1E3A] mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-[#193C8D] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-serif font-bold text-[#0B1E3A] mb-4">See also</h2>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-[#193C8D] hover:text-[#E7B947]">Trade Statistics</Link></li>
                <li><Link href="#" className="text-[#193C8D] hover:text-[#E7B947]">Digital technologies and trade</Link></li>
              </ul>
            </section>
          </aside>

          {/* MAIN CONTENT (Center 1/2 Width) */}
          <div className="lg:w-1/2 space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredPublications.length > 0 ? (
                filteredPublications.map((pub, index) => (
                  <motion.div
                    key={pub.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-6 flex gap-6"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <FileText className="text-[#193C8D] w-8 h-8" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-lg text-[#0B1E3A] mb-1 leading-tight">
                        {pub.title}
                      </h3>
                      <p className="text-xs text-gray-500">By {pub.author}</p>
                      <p className="text-xs text-gray-400 mb-4">Added: {pub.date}</p>
                      <div className="flex gap-3">
                        <button onClick={() => handleAction(pub.fileUrl, "view")} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition">
                          <Eye className="w-4 h-4" /> Preview
                        </button>
                        <button onClick={() => handleAction(pub.fileUrl, "download")} className="flex items-center gap-2 bg-[#193C8D] hover:bg-[#0B1E3A] text-white px-4 py-2 rounded-lg text-sm transition">
                          <Download className="w-4 h-4" /> Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-serif italic">No publications found.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDEBAR (1/4 Width) */}
          <aside className="lg:w-1/4 space-y-8">
            <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-serif font-bold text-[#0B1E3A] mb-3">Trade Barometers</h2>
              <p className="text-sm text-gray-600 mb-3">Providing real time information on the trajectory of world trade.</p>
              <Link href="#" className="text-[#193C8D] hover:text-[#E7B947] text-sm">More →</Link>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-serif font-bold text-[#0B1E3A] mb-4">Videos</h2>
              <div className="group cursor-pointer">
                <div className="relative mb-3">
                  <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600" alt="Video" className="rounded-xl" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                    <PlayCircle className="text-white w-12 h-12" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#193C8D]">Global Trade Outlook: October 2025 update</p>
              </div>
            </section>
          </aside>

        </div>
      </div>
    </main>
  )
}