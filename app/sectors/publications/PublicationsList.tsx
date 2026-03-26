"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Eye, PlayCircle, Search, Filter, X } from "lucide-react"
import Link from "next/link"
import ResourceDocumentCard from "@/components/ResourceDocumentCard"
import type { ResourceDocument } from "@/lib/documents"

interface Props {
  /** Live documents from DB (resource_documents table) */
  dbDocs: ResourceDocument[]
}

export default function PublicationsList({ dbDocs }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Derive sector / document_type categories from DB docs
  const categories = useMemo(() => {
    const types = new Set(dbDocs.map((d) => d.document_type ?? "Other"))
    return ["All", ...Array.from(types).sort()]
  }, [dbDocs])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return dbDocs.filter((doc) => {
      const matchesSearch =
        doc.filename.toLowerCase().includes(q) ||
        (doc.title ?? "").toLowerCase().includes(q) ||
        (doc.sector ?? "").toLowerCase().includes(q)
      const matchesCategory =
        selectedCategory === "All" || doc.document_type === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, dbDocs])

  // Group by document_type for themed sub-sections
  const grouped = useMemo(() => {
    if (selectedCategory !== "All") return { [selectedCategory]: filtered }
    return filtered.reduce<Record<string, ResourceDocument[]>>((acc, doc) => {
      const key = doc.document_type ?? "Other"
      if (!acc[key]) acc[key] = []
      acc[key].push(doc)
      return acc
    }, {})
  }, [filtered, selectedCategory])

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* HERO */}
      <section className="bg-[#193C8D] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-serif font-bold mb-4">Sector Publications</h1>
          <p className="text-gray-300 max-w-2xl">
            Explore sector profiles, reports and manufacturing research from Kenya&apos;s
            industrial sectors — sourced directly from KAM&apos;s document library.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT SIDEBAR */}
          <aside className="lg:w-1/4 space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-serif font-bold text-[#0B1E3A] mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" /> Search
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#193C8D] transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-serif font-bold text-[#0B1E3A] mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Document Type
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

            <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-serif font-bold text-[#0B1E3A] mb-3">Trade Barometers</h2>
              <p className="text-sm text-gray-600 mb-3">
                Real-time information on the trajectory of world trade.
              </p>
              <Link href="/research/barometer" className="text-[#193C8D] hover:text-[#E7B947] text-sm">
                More →
              </Link>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-serif font-bold text-[#0B1E3A] mb-4">Videos</h2>
              <div className="group cursor-pointer">
                <div className="relative mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600"
                    alt="Video thumbnail"
                    className="rounded-xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition rounded-xl">
                    <PlayCircle className="text-white w-12 h-12" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#193C8D]">
                  Global Trade Outlook: October 2025 update
                </p>
              </div>
            </section>
          </aside>

          {/* MAIN CONTENT */}
          <div className="lg:w-3/4 space-y-10">
            {/* Stats bar */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="font-semibold text-[#193C8D]">{filtered.length}</span> publications
              {searchQuery && (
                <span>
                  matching &ldquo;<span className="font-medium text-gray-700">{searchQuery}</span>&rdquo;
                </span>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200"
                >
                  <p className="text-gray-400 font-serif italic">No publications found.</p>
                </motion.div>
              ) : (
                Object.entries(grouped).map(([docType, docs]) => (
                  <motion.div
                    key={docType}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pl-1">
                      {docType}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {docs.map((doc) => (
                        <ResourceDocumentCard key={doc.id} doc={doc} showSector />
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  )
}
