"use client"

import React, { useState, useEffect } from "react"
import {
  Search,
  Filter,
  FileText,
  BarChart3,
  Database,
  ChevronRight,
  X,
  Download,
  ExternalLink,
} from "lucide-react"

type Report = {
  id: string
  title: string
  description: string
  type: "dashboard" | "pdf" | "database"
  source?: string
  status?: string
  author?: string
  date?: string
  url?: string
}

const reports: Report[] = [
{
  id: "powerbi-1",
  title: "ICMS Trade Dashboard",
  description:
    "Comprehensive visualization of ICMS trade declarations including FOB values, net weight trends, HS codes, and origin/destination analysis.",
  type: "dashboard",
  source: "ICMS Master",
  status: "Live Feed",
  url:
    "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9",
},
  {
    id: "powerbi-2",
    title: "Secondary Trade Dashboard",
    description: "Detailed regional trade trends and export insights.",
    type: "dashboard",
    url: "https://app.powerbi.com/view?r=SECOND_DASHBOARD_LINK",
  },
  {
    id: "pdf-1",
    title: "Fiscal Policy Impact on Agri-Exporters",
    description:
      "Detailed white paper on applicable taxes, levies, and duty rates for membership sectors in 2024/25.",
    type: "pdf",
    author: "Joseph Okumu",
    date: "March 2026",
  },
  {
    id: "db-1",
    title: "ICMS Declaration Records",
    description:
      "Searchable raw declaration database including HS codes, importers, FOB value and customs duty.",
    type: "database",
  },
]

export default function SectorDataPortal() {
  const [activeReport, setActiveReport] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    dashboard: true,
    pdf: true,
    database: true,
  })

  // Additional filter states
  const [year, setYear] = useState<string>("")
  const [month, setMonth] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [flow, setFlow] = useState<string>("")
  const [office, setOffice] = useState<string>("")

  // ICMS database state
  const [icmsData, setIcmsData] = useState<any[]>([])
  const [icmsLoading, setIcmsLoading] = useState(true)
  const [icmsError, setIcmsError] = useState<string | null>(null)

  // Fetch ICMS database records from API with filters
  useEffect(() => {
    setIcmsLoading(true)
    const params = new URLSearchParams({
      page: "1",
      limit: "10",
      ...(year && { year }),
      ...(month && { month }),
      ...(country && { country }),
      ...(flow && { flow }),
      ...(office && { office }),
      ...(searchQuery && { search: searchQuery }),
    })

    fetch(`/api/customs/icms?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setIcmsData(data)
        setIcmsLoading(false)
      })
      .catch((error) => {
        setIcmsError(error.message)
        setIcmsLoading(false)
      })
  }, [year, month, country, flow, office, searchQuery])

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    const matchesType = filters[report.type]

    return matchesSearch && matchesType
  })

  const mainDashboard = reports.find((r) => r.type === "dashboard")

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HERO */}
      <section className="bg-[#193C8D] text-white py-16">
        <div className="container mx-auto px-6">
          <p className="text-[#E7B947] uppercase text-xs font-black mb-3">
            Institutional Portal
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Sector Intelligence</h1>
          <p className="text-white/80 max-w-2xl">
            Centralized repository for membership market insights,
            tax policies, and ICMS trade declarations.
          </p>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="container mx-auto px-6 py-12 flex gap-12">
        {/* SIDEBAR FILTER */}
        <aside className="w-[300px] hidden lg:block">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-8 sticky top-24">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black text-[#193C8D] uppercase">
                <Filter className="w-4 h-4 text-[#E7B947]" />
                Filter Intelligence
              </h3>
              <div className="h-1 w-10 bg-[#E7B947] mt-2 rounded-full"></div>
            </div>

            {/* HS Filter */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                HS Global Section
              </label>
              <select className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50">
                <option>All Classifications</option>
                <option>I: Live Animals</option>
                <option>II: Vegetable Products</option>
                <option>XV: Base Metals</option>
              </select>
            </div>

{/* Year Filter */}
<div className="space-y-3">
  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
    Year
  </label>
  <select
    value={year}
    onChange={(e) => setYear(e.target.value)}
    className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50"
  >
    <option value="">All Years</option>
    {[2024, 2025, 2026].map((y) => (
      <option key={y} value={y}>{y}</option>
    ))}
  </select>
</div>

    {/* Month Filter */}
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
        Month
      </label>
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50"
      >
        <option value="">All Months</option>
        {[
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ].map((m, i) => (
          <option key={i} value={(i + 1).toString().padStart(2, '0')}>{m}</option>
        ))}
      </select>
    </div>

    {/* Country Filter */}
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
        Country
      </label>
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50"
      >
        <option value="">All Countries</option>
        {["Kenya", "Uganda", "Tanzania", "Ethiopia"].map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    {/* Flow/Regime Filter */}
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
        Flow / Regime
      </label>
      <select
        value={flow}
        onChange={(e) => setFlow(e.target.value)}
        className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50"
      >
        <option value="">All Flows</option>
        {["Import", "Export", "Transit"].map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
    </div>

    {/* Office/Station Filter */}
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
        Office / Station
      </label>
      <select
        value={office}
        onChange={(e) => setOffice(e.target.value)}
        className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50"
      >
        <option value="">All Offices</option>
        {["Nairobi", "Mombasa", "Kisumu", "Eldoret"].map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>

            {/* RESOURCE TYPE */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Resource Type
              </label>
              <div className="space-y-3">
                <label className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#193C8D]" />
                    Dashboards
                  </span>
                  <input
                    type="checkbox"
                    checked={filters.dashboard}
                    onChange={() =>
                      setFilters({ ...filters, dashboard: !filters.dashboard })
                    }
                  />
                </label>

                <label className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    PDF Reports
                  </span>
                  <input
                    type="checkbox"
                    checked={filters.pdf}
                    onChange={() => setFilters({ ...filters, pdf: !filters.pdf })}
                  />
                </label>

                <label className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-600" />
                    Raw Data
                  </span>
                  <input
                    type="checkbox"
                    checked={filters.database}
                    onChange={() =>
                      setFilters({ ...filters, database: !filters.database })
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 space-y-10">
          {/* SEARCH */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by HS Code, Keyword, or Policy Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-zinc-200 bg-white text-zinc-900"
            />
          </div>

          {/* MAIN POWER BI DASHBOARD EMBED */}
          {mainDashboard && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#193C8D]" />
                {mainDashboard.title}
              </h2>
              <p className="text-zinc-700 max-w-xl">{mainDashboard.description}</p>
              <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden">
                {loading && (
                  <div className="flex items-center justify-center h-[600px] text-zinc-500 font-bold">
                    Loading dashboard...
                  </div>
                )}
                <iframe
                  title={mainDashboard.title}
                  src={mainDashboard.url}
                  width="100%"
                  height="600px"
                  allowFullScreen
                  className="w-full"
                  onLoad={() => setLoading(false)}
                />
              </div>
            </section>
          )}

          {/* OTHER REPORTS */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredReports
              .filter((report) => report.id !== mainDashboard?.id)
              .map((report) => (
                <div
                  key={report.id}
                  className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {report.type === "dashboard" && (
                      <BarChart3 className="w-5 h-5 text-[#193C8D]" />
                    )}
                    {report.type === "pdf" && <FileText className="w-5 h-5 text-red-600" />}
                    {report.type === "database" && (
                      <Database className="w-5 h-5 text-green-600" />
                    )}
                    <span className="text-[10px] uppercase font-bold text-zinc-400">
                      {report.type}
                    </span>
                  </div>

                  <h3 className="font-black text-xl text-zinc-900 mb-3">{report.title}</h3>

                  <p className="text-zinc-600 mb-6">{report.description}</p>

                  {report.type === "dashboard" ? (
                    <button
                      onClick={() => setActiveReport(report.id)}
                      className="flex items-center gap-2 text-[#193C8D] font-bold text-sm"
                    >
                      Launch Dashboard
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">
                        {report.author} • {report.date}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-100">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-100">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </section>

          {/* ACTIVE DASHBOARD MODAL */}
          {activeReport && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-6xl w-full p-6 relative shadow-xl">
                <button
                  onClick={() => setActiveReport(null)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-red-600"
                  aria-label="Close dashboard"
                >
                  <X className="w-6 h-6" />
                </button>

                {(() => {
                  const report = reports.find((r) => r.id === activeReport)
                  if (!report) return null

                  if (report.type === "dashboard" && report.url) {
                    return (
                      <>
                        <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 mb-4">
                          <BarChart3 className="w-6 h-6 text-[#193C8D]" />
                          {report.title}
                        </h2>
                        <iframe
                          title={report.title}
                          src={report.url}
                          width="100%"
                          height="800px"
                          allowFullScreen
                          className="w-full rounded-xl"
                        />
                      </>
                    )
                  }

                  if (report.type === "pdf") {
                    return (
                      <>
                        <h2 className="text-2xl font-black text-zinc-900 mb-4">{report.title}</h2>
                        <p>{report.description}</p>
                        <p className="text-xs text-zinc-500 mt-2">
                          Author: {report.author} • Date: {report.date}
                        </p>
                      </>
                    )
                  }

                  return null
                })()}
              </div>
            </div>
          )}

          {/* ICMS DATABASE TABLE */}
          <section>
            <h2 className="text-2xl font-black text-zinc-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-green-600" />
              ICMS Declaration Records
            </h2>

            {icmsLoading && <p>Loading data...</p>}
            {icmsError && <p className="text-red-600">Error: {icmsError}</p>}

            {!icmsLoading && !icmsError && icmsData.length === 0 && (
              <p>No records found.</p>
            )}

            {!icmsLoading && !icmsError && icmsData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border border-zinc-200 rounded-xl text-left text-sm">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="border-b border-zinc-200 px-4 py-2">Entry Number</th>
                      <th className="border-b border-zinc-200 px-4 py-2">HS Code</th>
                      <th className="border-b border-zinc-200 px-4 py-2">Description</th>
                      <th className="border-b border-zinc-200 px-4 py-2">Origin Country</th>
                      <th className="border-b border-zinc-200 px-4 py-2">FOB Value</th>
                      <th className="border-b border-zinc-200 px-4 py-2">Customs Duty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {icmsData.map((record: any) => (
                      <tr key={record.id} className="odd:bg-white even:bg-zinc-50">
                        <td className="border-b border-zinc-200 px-4 py-2">{record.entry_number}</td>
                        <td className="border-b border-zinc-200 px-4 py-2">{record.hscode}</td>
                        <td className="border-b border-zinc-200 px-4 py-2">{record.good_description}</td>
                        <td className="border-b border-zinc-200 px-4 py-2">{record.origin_country}</td>
                        <td className="border-b border-zinc-200 px-4 py-2">{record.fob_value}</td>
                        <td className="border-b border-zinc-200 px-4 py-2">{record.customs_duty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}


// "use client"

// import React, { useState, useEffect } from "react"
// import {
//   Search,
//   Filter,
//   FileText,
//   BarChart3,
//   Database,
//   ChevronRight,
//   X,
//   Download,
//   ExternalLink,
// } from "lucide-react"

// type Report = {
//   id: string
//   title: string
//   description: string
//   type: "dashboard" | "pdf" | "database"
//   source?: string
//   status?: string
//   author?: string
//   date?: string
// }

// const reports: Report[] = [
//   {
//     id: "powerbi-1",
//     title: "Interactive Section II Trade Performance",
//     description:
//       "Live visualizations of FOB values, net weight trends, and destination country analysis for Vegetable Products.",
//     type: "dashboard",
//     source: "ICMS Master",
//     status: "Live Feed",
//   },
//   {
//     id: "pdf-1",
//     title: "Fiscal Policy Impact on Agri-Exporters",
//     description:
//       "Detailed white paper on applicable taxes, levies, and duty rates for membership sectors in 2024/25.",
//     type: "pdf",
//     author: "Joseph Okumu",
//     date: "March 2026",
//   },
//   {
//     id: "db-1",
//     title: "ICMS Declaration Records",
//     description:
//       "Searchable raw declaration database including HS codes, importers, FOB value and customs duty.",
//     type: "database",
//   },
// ]

// export default function SectorDataPortal() {
//   const [activeReport, setActiveReport] = useState<string | null>(null)
//   const [searchQuery, setSearchQuery] = useState("")

//   // Filters for reports
//   const [filters, setFilters] = useState({
//     dashboard: true,
//     pdf: true,
//     database: true,
//   })

//   // ICMS DB query state
//   const [query, setQuery] = useState({
//     page: 1,
//     limit: 10,
//     year: "",
//     country: "",
//     month: "",
//     flow: "",
//     office: "",
//     search: ""
//   })

//   // ICMS DB data + loading
//   const [records, setRecords] = useState<any[]>([])
//   const [loadingData, setLoadingData] = useState(false)

//   const POWER_BI_URL =
//     "https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9"

//   // Filter reports based on search + resource type filters
//   const filteredReports = reports.filter((report) => {
//     const matchesSearch = report.title
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())

//     const matchesType = filters[report.type]

//     return matchesSearch && matchesType
//   })

//   // Fetch ICMS data from API
//   const fetchICMS = async () => {
//     setLoadingData(true)

//     const params = new URLSearchParams()
//     Object.entries(query).forEach(([key, value]) => {
//       if (value) params.append(key, value.toString())
//     })

//     try {
//       const res = await fetch(`/api/customs/icms?${params.toString()}`)
//       const data = await res.json()
//       setRecords(data)
//     } catch (error) {
//       console.error("Error fetching ICMS data:", error)
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   // Fetch whenever query changes
//   useEffect(() => {
//     fetchICMS()
//   }, [query])

//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">

//       {/* HERO */}

//       <section className="bg-[#193C8D] text-white py-16">
//         <div className="container mx-auto px-6">

//           <p className="text-[#E7B947] uppercase text-xs font-black mb-3">
//             Institutional Portal
//           </p>

//           <h1 className="text-4xl md:text-5xl font-black mb-4">
//             Sector Intelligence
//           </h1>

//           <p className="text-white/80 max-w-2xl">
//             Centralized repository for membership market insights,
//             tax policies, and ICMS trade declarations.
//           </p>

//         </div>
//       </section>

//       {/* MAIN LAYOUT */}

//       <div className="container mx-auto px-6 py-12 flex gap-12">

//         {/* SIDEBAR FILTER */}

//         <aside className="w-[300px] hidden lg:block">

//           <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-8 sticky top-24">

//             <div>
//               <h3 className="flex items-center gap-2 text-sm font-black text-[#193C8D] uppercase">
//                 <Filter className="w-4 h-4 text-[#E7B947]" />
//                 Filter Intelligence
//               </h3>

//               <div className="h-1 w-10 bg-[#E7B947] mt-2 rounded-full"></div>
//             </div>

//             {/* HS Global Section (just UI, no backend hook) */}

//             <div className="space-y-3">
//               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
//                 HS Global Section
//               </label>

//               <select className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50">
//                 <option>All Classifications</option>
//                 <option>I: Live Animals</option>
//                 <option>II: Vegetable Products</option>
//                 <option>XV: Base Metals</option>
//               </select>
//             </div>

//             {/* Resource Type Filters */}

//             <div className="space-y-3">

//               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
//                 Resource Type
//               </label>

//               <div className="space-y-3">

//                 <label className="flex items-center justify-between text-sm">
//                   <span className="flex items-center gap-2">
//                     <BarChart3 className="w-4 h-4 text-[#193C8D]" />
//                     Dashboards
//                   </span>

//                   <input
//                     type="checkbox"
//                     checked={filters.dashboard}
//                     onChange={() =>
//                       setFilters({ ...filters, dashboard: !filters.dashboard })
//                     }
//                   />
//                 </label>

//                 <label className="flex items-center justify-between text-sm">
//                   <span className="flex items-center gap-2">
//                     <FileText className="w-4 h-4 text-red-600" />
//                     PDF Reports
//                   </span>

//                   <input
//                     type="checkbox"
//                     checked={filters.pdf}
//                     onChange={() =>
//                       setFilters({ ...filters, pdf: !filters.pdf })
//                     }
//                   />
//                 </label>

//                 <label className="flex items-center justify-between text-sm">
//                   <span className="flex items-center gap-2">
//                     <Database className="w-4 h-4 text-green-600" />
//                     Raw Data
//                   </span>

//                   <input
//                     type="checkbox"
//                     checked={filters.database}
//                     onChange={() =>
//                       setFilters({ ...filters, database: !filters.database })
//                     }
//                   />
//                 </label>

//               </div>

//             </div>

//             {/* Year Filter */}

//             <div className="space-y-3">
//               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
//                 Year
//               </label>

//               <select
//                 className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50"
//                 value={query.year}
//                 onChange={(e) =>
//                   setQuery({ ...query, year: e.target.value, page: 1 })
//                 }
//               >
//                 <option value="">All Years</option>
//                 <option value="2024">2024</option>
//                 <option value="2023">2023</option>
//                 <option value="2022">2022</option>
//               </select>
//             </div>

//             {/* Country Filter */}

//             <div className="space-y-3">
//               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
//                 Country
//               </label>

//               <select
//                 className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50"
//                 value={query.country}
//                 onChange={(e) =>
//                   setQuery({ ...query, country: e.target.value, page: 1 })
//                 }
//               >
//                 <option value="">All Countries</option>
//                 <option value="China">China</option>
//                 <option value="Kenya">Kenya</option>
//                 <option value="India">India</option>
//               </select>
//             </div>

//             {/* Month Filter */}

//             <div className="space-y-3">
//               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
//                 Month
//               </label>

//               <select
//                 className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50"
//                 value={query.month}
//                 onChange={(e) =>
//                   setQuery({ ...query, month: e.target.value, page: 1 })
//                 }
//               >
//                 <option value="">All Months</option>
//                 <option value="01">January</option>
//                 <option value="02">February</option>
//                 <option value="03">March</option>
//                 <option value="04">April</option>
//                 <option value="05">May</option>
//                 <option value="06">June</option>
//                 <option value="07">July</option>
//                 <option value="08">August</option>
//                 <option value="09">September</option>
//                 <option value="10">October</option>
//                 <option value="11">November</option>
//                 <option value="12">December</option>
//               </select>
//             </div>

//             {/* Flow Filter */}

//             <div className="space-y-3">
//               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
//                 Trade Flow
//               </label>

//               <select
//                 className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50"
//                 value={query.flow}
//                 onChange={(e) =>
//                   setQuery({ ...query, flow: e.target.value, page: 1 })
//                 }
//               >
//                 <option value="">All Flows</option>
//                 <option value="import">Imports</option>
//                 <option value="export">Exports</option>
//               </select>
//             </div>

//             {/* Office Filter */}

//             <div className="space-y-3">
//               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
//                 Station / Office
//               </label>

//               <input
//                 type="text"
//                 placeholder="Enter office"
//                 value={query.office}
//                 onChange={(e) =>
//                   setQuery({ ...query, office: e.target.value, page: 1 })
//                 }
//                 className="w-full border border-zinc-200 rounded-xl p-3 text-sm text-zinc-700 bg-zinc-50"
//               />
//             </div>

//           </div>

//         </aside>

//         {/* MAIN CONTENT */}

//         <main className="flex-1 space-y-10">

//           {/* SEARCH */}

//           <div className="relative max-w-2xl">

//             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />

//             <input
//               type="text"
//               placeholder="Search by HS Code, Keyword, or Policy Number..."
//               value={query.search}
//               onChange={(e) =>
//                 setQuery({ ...query, search: e.target.value, page: 1 })
//               }
//               className="w-full pl-12 pr-6 py-4 rounded-xl border border-zinc-200 bg-white text-zinc-900"
//             />

//           </div>

//           {/* DASHBOARD VIEW */}

//           {activeReport ? (

//             <div className="space-y-6">

//               <div className="flex justify-between items-center">

//                 <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
//                   <BarChart3 className="w-6 h-6 text-[#193C8D]" />
//                   Interactive Trade Dashboard
//                 </h2>

//                 <button
//                   onClick={() => setActiveReport(null)}
//                   className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-red-600"
//                 >
//                   <X className="w-4 h-4" />
//                   Close Dashboard
//                 </button>

//               </div>

//               <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden">

//                 {loadingData && (
//                   <div className="flex items-center justify-center h-[600px] text-zinc-500 font-bold">
//                     Loading dashboard...
//                   </div>
//                 )}

//                 <iframe
//                   title="Sector Trade Dashboard"
//                   src={POWER_BI_URL}
//                   width="100%"
//                   height="800px"
//                   allowFullScreen
//                   className="w-full"
//                   onLoad={() => setLoadingData(false)}
//                 />

//               </div>

//             </div>

//           ) : (

//             <div>

//               {/* REPORT CARDS */}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

//                 {filteredReports.map((report) => (

//                   <div
//                     key={report.id}
//                     className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition"
//                   >

//                     <div className="flex items-center gap-3 mb-4">

//                       {report.type === "dashboard" && (
//                         <BarChart3 className="w-5 h-5 text-[#193C8D]" />
//                       )}

//                       {report.type === "pdf" && (
//                         <FileText className="w-5 h-5 text-red-600" />
//                       )}

//                       {report.type === "database" && (
//                         <Database className="w-5 h-5 text-green-600" />
//                       )}

//                       <span className="text-[10px] uppercase font-bold text-zinc-400">
//                         {report.type}
//                       </span>

//                     </div>

//                     <h3 className="font-black text-xl text-zinc-900 mb-3">
//                       {report.title}
//                     </h3>

//                     <p className="text-zinc-600 mb-6">
//                       {report.description}
//                     </p>

//                     {report.type === "dashboard" ? (

//                       <button
//                         onClick={() => setActiveReport(report.id)}
//                         className="flex items-center gap-2 text-[#193C8D] font-bold text-sm"
//                       >
//                         Launch Dashboard
//                         <ChevronRight className="w-4 h-4" />
//                       </button>

//                     ) : report.type === "database" ? (

//                       <div className="text-sm text-zinc-500 font-semibold">
//                         {/* Show number of records loaded */}
//                         {loadingData ? "Loading database..." : `${records.length} records loaded`}
//                       </div>

//                     ) : (

//                       <div className="flex justify-between items-center">

//                         <span className="text-xs text-zinc-500">
//                           {report.author} • {report.date}
//                         </span>

//                         <div className="flex gap-2">

//                           <button className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-100">
//                             <Download className="w-4 h-4" />
//                           </button>

//                           <button className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-100">
//                             <ExternalLink className="w-4 h-4" />
//                           </button>

//                         </div>

//                       </div>

//                     )}

//                   </div>

//                 ))}

//               </div>

//               {/* ICMS Data Table */}

//               <div className="bg-white border rounded-2xl p-6">

//                 <h2 className="text-xl font-black mb-6">
//                   ICMS Trade Declarations
//                 </h2>

//                 {loadingData ? (
//                   <div className="text-center p-10 text-zinc-500 font-bold">
//                     Loading data...
//                   </div>
//                 ) : (

//                   <div className="overflow-x-auto">

//                     <table className="w-full text-sm">

//                       <thead className="bg-zinc-50 border-b">

//                         <tr>
//                           <th className="p-3 text-left">Entry</th>
//                           <th className="p-3 text-left">HS Code</th>
//                           <th className="p-3 text-left">Description</th>
//                           <th className="p-3 text-left">Country</th>
//                           <th className="p-3 text-left">FOB Value</th>
//                           <th className="p-3 text-left">Station</th>
//                           <th className="p-3 text-left">Year</th>
//                         </tr>

//                       </thead>

//                       <tbody>

//                         {records.length === 0 && (
//                           <tr>
//                             <td colSpan={7} className="text-center p-6 text-zinc-500">
//                               No records found.
//                             </td>
//                           </tr>
//                         )}

//                         {records.map((row) => (

//                           <tr key={row.id} className="border-b hover:bg-zinc-50">

//                             <td className="p-3">{row.entry_number}</td>
//                             <td className="p-3">{row.hscode}</td>
//                             <td className="p-3">{row.good_description}</td>
//                             <td className="p-3">{row.origin_country}</td>
//                             <td className="p-3">KES {Number(row.fob_value).toLocaleString()}</td>
//                             <td className="p-3">{row.station}</td>
//                             <td className="p-3">{row.year}</td>

//                           </tr>

//                         ))}

//                       </tbody>

//                     </table>

//                   </div>

//                 )}

//                 {/* Pagination */}

//                 <div className="flex justify-between mt-6">

//                   <button
//                     onClick={() =>
//                       setQuery({ ...query, page: Math.max(1, query.page - 1) })
//                     }
//                     disabled={query.page === 1}
//                     className={`px-4 py-2 border rounded ${query.page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-100"}`}
//                   >
//                     Previous
//                   </button>

//                   <span className="px-4 py-2 font-semibold">
//                     Page {query.page}
//                   </span>

//                   <button
//                     onClick={() =>
//                       setQuery({ ...query, page: query.page + 1 })
//                     }
//                     className="px-4 py-2 border rounded hover:bg-zinc-100"
//                   >
//                     Next
//                   </button>

//                 </div>

//               </div>

//             </div>

//           )}

//         </main>

//       </div>

//     </div>
//   )
// }