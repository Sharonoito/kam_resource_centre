"use client"

import { useMemo, useState } from "react"
import { HS_SECTORS_ONLY, HsSection } from "@/types/sectors"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Database, ExternalLink, Eye, Link2, UploadCloud, Info } from "lucide-react"

// Navigation structure from navbar
const GENERAL_NAV_OPTIONS = [
  {
    label: "Trade",
    value: "trade",
    subLinks: [
      { label: "Free Trade Areas", value: "free-trade-areas" },
      { label: "Business Facilitation", value: "facilitation" },
      { label: "Standards & Compliance", value: "standards" },
      { label: "Customs & Borders", value: "customs" },
      { label: "Infrastructure & Logistics", value: "logistics" },
      { label: "Local Content (BKBK)", value: "local-content" },
      { label: "Domestic Trade", value: "domestic" },
      { label: "Trade Barriers", value: "barriers" },
      { label: "Partnerships", value: "partnerships" },
      { label: "Illicit Trade", value: "illicit" },
    ],
  },
  {
    label: "Tax",
    value: "tax",
    subLinks: [],
  },
  {
    label: "Publication",
    value: "publications",
    subLinks: [
      { label: "Annual Reports", value: "annual" },
      { label: "Policy Briefs", value: "policy" },
    ],
  },
  {
    label: "Research Hub",
    value: "research",
    subLinks: [
      { label: " Manufacturing Barometer ", value: "barometer" },
      { label: "Data Hub", value: "kra" },
      { label: "Macro-Economic Data", value: "macro" },
    ],
  },
]

type ResourceCategory = "SECTOR_SPECIFIC" | "GENERAL_GLOBAL"
type ResourceType = "PDF" | "POWERBI" | "DATABASE" | "TRADE_DATA" | "LINK"
type SourceMode = "LINK" | "UPLOAD"

interface PreviewModel {
  title: string
  description: string
  document_type: ResourceType
  download_url: string
  section_tag: string
}

const isValidDownloadUrl = (value: string) => {
  if (!value) return false
  if (value.startsWith("/")) return true
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export default function ResourceForm() {
  const [resourceCategory, setResourceCategory] = useState<ResourceCategory>("SECTOR_SPECIFIC")
  // Updated default slug state
  const [sectorSlug, setSectorSlug] = useState<string>(HS_SECTORS_ONLY[0]?.slug ?? "")
  const [isSubscription, setIsSubscription] = useState(false)
  const [subscriptionType, setSubscriptionType] = useState<'free' | 'paid'>("free")
  const [paybill, setPaybill] = useState("")
  const [selectedSectionNames, setSelectedSectionNames] = useState<string[]>([])
  const [sourceMode, setSourceMode] = useState<SourceMode>("LINK")
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [documentType, setDocumentType] = useState<ResourceType>("PDF")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [customTags, setCustomTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [generalNav, setGeneralNav] = useState("")
  const [generalSubNav, setGeneralSubNav] = useState("")

  // Updated sector lookup logic
  const selectedSector = useMemo(() => HS_SECTORS_ONLY.find((s) => s.slug === sectorSlug), [sectorSlug])
  
  const selectedGeneralNav = useMemo(() => 
    GENERAL_NAV_OPTIONS.find(opt => opt.value === generalNav), 
    [generalNav]
  )

  const availableSections = useMemo(() => selectedSector?.sectionsData ?? [], [selectedSector])

  const effectiveSections = useMemo(() => {
    if (resourceCategory === "GENERAL_GLOBAL") {
      return [{ 
        id: generalNav, 
        name: generalSubNav || generalNav, 
        path: `/${generalNav}${generalSubNav ? `/${generalSubNav}` : ""}`, 
        description: "General and policy resources" 
      }]
    }
    if (selectedSectionNames.length === 0) return availableSections
    return availableSections.filter((sec: HsSection) => selectedSectionNames.includes(sec.name))
  }, [resourceCategory, selectedSectionNames, availableSections, generalNav, generalSubNav])

  const previewModel: PreviewModel = {
    title: title || "Untitled resource",
    description: description || "No description provided",
    document_type: documentType,
    download_url: sourceMode === "UPLOAD"
      ? (file ? `/uploads/admin/${file.name}` : "#")
      : (downloadUrl || "#"),
    section_tag: resourceCategory === "GENERAL_GLOBAL"
      ? (generalNav === "trade" ? "Trade Hub" : "General/Other")
      : effectiveSections[0]?.name || selectedSector?.name || "Unknown",
  }

  const toggleSection = (name: string) => {
    setSelectedSectionNames((prev) => (
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    ))
  }

  const onCategoryChange = (next: ResourceCategory) => {
    setResourceCategory(next)
    if (next === "GENERAL_GLOBAL") {
      setSelectedSectionNames([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    
    if (isSubscription && subscriptionType === "paid" && !paybill.trim()) {
      setErrorMessage("Paybill is required for paid subscriptions.")
      return
    }

    if (!title.trim()) {
      setErrorMessage("Title is required.")
      return
    }

    if (sourceMode === "LINK") {
      if (!isValidDownloadUrl(downloadUrl.trim())) {
        setErrorMessage("Download URL must be an absolute URL (http/https) or an app path starting with '/'.")
        return
      }
    } else if (!file) {
      setErrorMessage("Please choose a file to upload.")
      return
    }

    if (resourceCategory === "SECTOR_SPECIFIC" && !selectedSector) {
      setErrorMessage("Please select a sector.")
      return
    }
    if (resourceCategory === "GENERAL_GLOBAL" && !generalNav) {
      setErrorMessage("Please select a navigation section.")
      return
    }

    setIsSubmitting(true)
    setSuccessMessage("")

    try {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("description", description.trim())
      formData.append("document_type", documentType)
      formData.append("resource_category", resourceCategory)
      formData.append("source_mode", sourceMode)
      formData.append("is_subscription", String(isSubscription))
      formData.append("subscription_type", isSubscription ? subscriptionType : "")
      formData.append("paybill", isSubscription && subscriptionType === "paid" ? paybill.trim() : "")
      formData.append("download_url", sourceMode === "LINK" ? downloadUrl.trim() : "")
      
      let finalSectorSlug = ""
      if (resourceCategory === "SECTOR_SPECIFIC") {
        finalSectorSlug = selectedSector?.slug ?? ""
      } else if (resourceCategory === "GENERAL_GLOBAL" && generalNav === "trade") {
        finalSectorSlug = "TRADE_HUB_GENERAL"
      }
      formData.append("sector_slug", finalSectorSlug)

      formData.append(
        "section_names",
        JSON.stringify(
          resourceCategory === "SECTOR_SPECIFIC"
            ? (selectedSectionNames.length ? selectedSectionNames : availableSections.map((s) => s.name))
            : [generalSubNav || generalNav]
        )
      )
      formData.append("general_nav", resourceCategory === "GENERAL_GLOBAL" ? generalNav : "")
      formData.append("general_subnav", resourceCategory === "GENERAL_GLOBAL" ? generalSubNav : "")
      formData.append(
        "tags",
        JSON.stringify(
          customTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      )

      if (sourceMode === "UPLOAD" && file) {
        formData.append("file", file)
      }

      const res = await fetch("/api/admin/resources", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create resource")
        return
      }

      setSuccessMessage("Resource created successfully.")
      setTitle(""); setDescription(""); setDownloadUrl(""); setCustomTags("");
      setSelectedSectionNames([]); setFile(null); setSourceMode("LINK");
      setShowPreview(false); setIsSubscription(false); setGeneralNav(""); setGeneralSubNav("");
    } catch (error) {
      setErrorMessage("Network error while saving resource.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-[#193C8D] via-[#2a5bc2] to-[#E7B947]" />
      <CardHeader className="bg-gradient-to-br from-slate-50 to-white border-b border-zinc-100">
        <CardTitle className="text-2xl text-[#0B1E3A]">Add Resource</CardTitle>
        <p className="text-sm text-zinc-500">
          Create sector resources or general policy entries.
        </p>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {(errorMessage || successMessage) && (
            <div className={`rounded-xl p-3 border text-sm flex items-center gap-2 ${
              errorMessage ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}>
              {errorMessage ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{errorMessage || successMessage}</span>
            </div>
          )}

          {/* Source Selection */}
          <div className="rounded-2xl border border-zinc-200 p-4 bg-zinc-50/60">
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Source Mode</label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setSourceMode("LINK")} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition ${sourceMode === "LINK" ? "bg-[#193C8D] text-white" : "bg-white text-zinc-600"}`}>
                <Link2 className="w-4 h-4" /> Paste Link
              </button>
              <button type="button" onClick={() => setSourceMode("UPLOAD")} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition ${sourceMode === "UPLOAD" ? "bg-[#193C8D] text-white" : "bg-white text-zinc-600"}`}>
                <UploadCloud className="w-4 h-4" /> Upload File
              </button>
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Resource Category</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => onCategoryChange("SECTOR_SPECIFIC")} className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${resourceCategory === "SECTOR_SPECIFIC" ? "bg-[#193C8D] text-white" : "bg-white"}`}>
                Sector-Specific
              </button>
              <button type="button" onClick={() => onCategoryChange("GENERAL_GLOBAL")} className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${resourceCategory === "GENERAL_GLOBAL" ? "bg-[#193C8D] text-white" : "bg-white"}`}>
                General/Global
              </button>
            </div>
          </div>

          {resourceCategory === "GENERAL_GLOBAL" && (
            <div className="space-y-4 p-4 rounded-xl border border-zinc-200 bg-zinc-50/30">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">General Navigation</label>
                <select
                  value={generalNav}
                  onChange={e => {
                    setGeneralNav(e.target.value)
                    setGeneralSubNav("")
                  }}
                  className="w-full max-w-xs p-2.5 border border-zinc-300 rounded-lg bg-white shadow-sm"
                >
                  <option value="">Select Navigation</option>
                  {GENERAL_NAV_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                
                {generalNav === "trade" && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    <p className="text-[11px] font-bold text-blue-700 uppercase tracking-tight">
                      Linked to Trade Intelligence Hub (ID: -5)
                    </p>
                  </div>
                )}
              </div>

              {selectedGeneralNav?.subLinks && selectedGeneralNav.subLinks.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-1">
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Sub Navigation</label>
                  <select
                    value={generalSubNav}
                    onChange={e => setGeneralSubNav(e.target.value)}
                    className="w-full max-w-xs p-2.5 border border-zinc-300 rounded-lg bg-white shadow-sm"
                  >
                    <option value="">Select Sub Navigation</option>
                    {selectedGeneralNav.subLinks.map(sub => (
                      <option key={sub.value} value={sub.value}>{sub.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Subscription Settings */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isSubscription} onChange={e => setIsSubscription(e.target.checked)} className="accent-[#193C8D] w-4 h-4" />
              <span className="text-sm font-semibold text-zinc-700">Require subscription?</span>
            </label>
            {isSubscription && (
              <div className="mt-4 pl-6 space-y-4 border-l-2 border-zinc-100">
                <select value={subscriptionType} onChange={e => setSubscriptionType(e.target.value as 'free' | 'paid')} className="w-full max-w-xs p-2 border border-zinc-300 rounded-lg">
                  <option value="free">Free (Login Required)</option>
                  <option value="paid">Paid (Paybill Required)</option>
                </select>
                {subscriptionType === "paid" && (
                  <input type="text" value={paybill} onChange={e => setPaybill(e.target.value)} placeholder="Paybill number" className="w-full max-w-xs p-2 border border-zinc-300 rounded-lg" />
                )}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Sector</label>
              <select disabled={resourceCategory === "GENERAL_GLOBAL"} value={sectorSlug} onChange={(e) => {setSectorSlug(e.target.value); setSelectedSectionNames([])}} className="w-full p-3 border border-zinc-300 rounded-lg disabled:bg-gray-100">
                {HS_SECTORS_ONLY.map((s) => (<option key={s.slug} value={s.slug}>{s.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Document Type</label>
              <select value={documentType} onChange={(e) => setDocumentType(e.target.value as ResourceType)} className="w-full p-3 border border-zinc-300 rounded-lg">
                <option value="PDF">PDF</option>
                <option value="POWERBI">POWERBI</option>
              </select>
            </div>
          </div>

          {/* HS Sections (Disabled for General) */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">HS Sections</label>
            <div className={`grid md:grid-cols-2 gap-2 p-3 border border-zinc-200 rounded-lg ${resourceCategory === "GENERAL_GLOBAL" ? "bg-gray-50" : "bg-white"}`}>
              {resourceCategory === "GENERAL_GLOBAL" ? (
                <p className="text-sm text-gray-400 italic">Mapping is handled via Nav selection.</p>
              ) : (
                availableSections.map((sec: HsSection) => (
                  <label key={sec.id} className="flex items-start gap-2 text-sm cursor-pointer hover:bg-zinc-50 p-1 rounded">
                    <input type="checkbox" checked={selectedSectionNames.includes(sec.name)} onChange={() => toggleSection(sec.name)} className="mt-0.5 accent-[#193C8D]" />
                    <span><span className="font-mono text-xs text-gray-500 mr-2">{sec.id}</span>{sec.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-zinc-300 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-3 border border-zinc-300 rounded-lg" />
          </div>

          {sourceMode === "LINK" ? (
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Download URL / Path</label>
              <input type="text" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} className="w-full p-3 border border-zinc-300 rounded-lg font-mono text-sm" required />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Upload File</label>
              <div className="border-2 border-dashed border-zinc-300 rounded-xl p-4 hover:border-[#193C8D] cursor-pointer">
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full text-sm" required={sourceMode === "UPLOAD"} />
                {file && <p className="text-xs text-emerald-700 mt-2 font-medium">Selected: {file.name}</p>}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Tags (comma-separated)</label>
            <input type="text" value={customTags} onChange={(e) => setCustomTags(e.target.value)} className="w-full p-3 border border-zinc-300 rounded-lg" />
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <button type="button" onClick={() => setShowPreview((p) => !p)} className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-zinc-50 transition">
              <Eye className="w-4 h-4" /> {showPreview ? "Hide Preview" : "Preview"}
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#193C8D] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#0f2e6d] transition">
              {isSubmitting ? "Saving..." : "Save Resource"}
            </button>
          </div>

          {showPreview && (
            <div className="mt-4 p-4 border border-zinc-200 rounded-xl bg-zinc-50 animate-in fade-in zoom-in-95">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase">{previewModel.document_type}</span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 border px-1.5 py-0.5 rounded">{previewModel.section_tag}</span>
                </div>
                <h3 className="font-bold text-[#0B1E3A] mb-2">{previewModel.title}</h3>
                <p className="text-sm text-zinc-600 mb-4 line-clamp-2">{previewModel.description}</p>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[#193C8D]"><Database className="w-4 h-4" /> Open</span>
                  <a href={previewModel.download_url} target="_blank" className="inline-flex items-center gap-1 text-sm text-zinc-500"><ExternalLink className="w-4 h-4" /> Source</a>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}