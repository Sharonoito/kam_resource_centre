"use client"

import { useMemo, useState } from "react"
import { KAM_SECTORS, HsSection } from "@/types/sectors"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Database, ExternalLink, Eye, Link2, UploadCloud } from "lucide-react"

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
  const [sectorSlug, setSectorSlug] = useState<string>(KAM_SECTORS[0]?.slug ?? "")
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

  const selectedSector = useMemo(() => KAM_SECTORS.find((s) => s.slug === sectorSlug), [sectorSlug])

  const availableSections = useMemo(() => selectedSector?.sectionsData ?? [], [selectedSector])

  const effectiveSections = useMemo(() => {
    if (resourceCategory === "GENERAL_GLOBAL") {
      return [{ id: "G", name: "Research Hub", path: "/research", description: "General and policy resources" }]
    }
    if (selectedSectionNames.length === 0) return availableSections
    return availableSections.filter((sec: HsSection) => selectedSectionNames.includes(sec.name))
  }, [resourceCategory, selectedSectionNames, availableSections])

  const previewModel: PreviewModel = {
    title: title || "Untitled resource",
    description: description || "No description provided",
    document_type: documentType,
    download_url: sourceMode === "UPLOAD"
      ? (file ? `/uploads/admin/${file.name}` : "#")
      : (downloadUrl || "#"),
    section_tag: resourceCategory === "GENERAL_GLOBAL"
      ? "General/Other"
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
    setSuccessMessage("")

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

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("description", description.trim())
      formData.append("document_type", documentType)
      formData.append("resource_category", resourceCategory)
      formData.append("source_mode", sourceMode)
      formData.append("download_url", sourceMode === "LINK" ? downloadUrl.trim() : "")
      formData.append("sector_slug", resourceCategory === "SECTOR_SPECIFIC" ? (selectedSector?.slug ?? "") : "")
      formData.append(
        "section_names",
        JSON.stringify(
          resourceCategory === "SECTOR_SPECIFIC"
            ? (selectedSectionNames.length ? selectedSectionNames : availableSections.map((s) => s.name))
            : ["Research Hub"]
        )
      )
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
        if (res.status === 401) {
          setErrorMessage("Unauthorized. Please log in first via Keycloak.")
        } else if (res.status === 403) {
          setErrorMessage("You are logged in but do not have SUPERADMIN role in Keycloak.")
        } else {
          setErrorMessage(data.error || "Failed to create resource")
        }
        return
      }

      setSuccessMessage("Resource created successfully.")
      setTitle("")
      setDescription("")
      setDownloadUrl("")
      setCustomTags("")
      setSelectedSectionNames([])
      setFile(null)
      setSourceMode("LINK")
      setShowPreview(false)
    } catch (error) {
      console.error(error)
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
          Create sector resources or general policy entries. You can either paste a link or upload a file directly.
        </p>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {(errorMessage || successMessage) && (
            <div className={`rounded-xl p-3 border text-sm flex items-center gap-2 ${
              errorMessage
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}>
              {errorMessage ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{errorMessage || successMessage}</span>
            </div>
          )}

          <div className="rounded-2xl border border-zinc-200 p-4 bg-zinc-50/60">
            <label className="block text-sm font-semibold text-zinc-700 mb-2">How do you want to provide the resource?</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSourceMode("LINK")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  sourceMode === "LINK"
                    ? "bg-[#193C8D] text-white border-[#193C8D]"
                    : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <Link2 className="w-4 h-4" /> Paste Link
              </button>
              <button
                type="button"
                onClick={() => setSourceMode("UPLOAD")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  sourceMode === "UPLOAD"
                    ? "bg-[#193C8D] text-white border-[#193C8D]"
                    : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <UploadCloud className="w-4 h-4" /> Upload File
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Resource Category</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onCategoryChange("SECTOR_SPECIFIC")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  resourceCategory === "SECTOR_SPECIFIC"
                    ? "bg-[#193C8D] text-white border-[#193C8D]"
                    : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                Sector-Specific
              </button>
              <button
                type="button"
                onClick={() => onCategoryChange("GENERAL_GLOBAL")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  resourceCategory === "GENERAL_GLOBAL"
                    ? "bg-[#193C8D] text-white border-[#193C8D]"
                    : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                General/Global
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Sector</label>
              <select
                disabled={resourceCategory === "GENERAL_GLOBAL"}
                value={sectorSlug}
                onChange={(e) => {
                  setSectorSlug(e.target.value)
                  setSelectedSectionNames([])
                }}
                className="w-full p-3 border border-zinc-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 bg-white"
              >
                {KAM_SECTORS.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as ResourceType)}
                className="w-full p-3 border border-zinc-300 rounded-lg bg-white"
              >
                <option value="PDF">PDF</option>
                <option value="POWERBI">POWERBI</option>
                <option value="DATABASE">DATABASE</option>
                <option value="TRADE_DATA">TRADE_DATA</option>
                <option value="LINK">LINK</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">HS Sections</label>
            <div className={`grid md:grid-cols-2 gap-2 p-3 border border-zinc-200 rounded-lg ${resourceCategory === "GENERAL_GLOBAL" ? "bg-gray-50" : "bg-white"}`}>
              {resourceCategory === "GENERAL_GLOBAL" ? (
                <p className="text-sm text-gray-500">Disabled for General/Global resources. Using General/Other mapping.</p>
              ) : (
                availableSections.map((sec: HsSection) => (
                  <label key={sec.id} className="flex items-start gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSectionNames.includes(sec.name)}
                      onChange={() => toggleSection(sec.name)}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="font-mono text-xs text-gray-500 mr-2">{sec.id}</span>
                      {sec.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-zinc-300 rounded-lg bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 border border-zinc-300 rounded-lg bg-white"
            />
          </div>

          {sourceMode === "LINK" ? (
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Download URL / Path</label>
              <input
                type="text"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="/uploads/report.pdf or https://example.com/report.pdf"
                className="w-full p-3 border border-zinc-300 rounded-lg bg-white"
                required={sourceMode === "LINK"}
              />
              <p className="text-xs text-gray-500 mt-1">Use an internal path starting with / or a full http/https URL.</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Upload File</label>
              <div className="border-2 border-dashed border-zinc-300 rounded-xl p-4 bg-white hover:border-[#193C8D] transition-colors">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                  required={sourceMode === "UPLOAD"}
                />
                <p className="text-xs text-zinc-500 mt-2">
                  The API uploads this to public/uploads/admin and auto-generates the download path.
                </p>
                {file && (
                  <p className="text-xs text-emerald-700 mt-2 font-medium">Selected: {file.name}</p>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Additional Tags (comma-separated)</label>
            <input
              type="text"
              value={customTags}
              onChange={(e) => setCustomTags(e.target.value)}
              placeholder="Market Insight, 2026, Policy"
              className="w-full p-3 border border-zinc-300 rounded-lg bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg text-sm font-semibold hover:bg-zinc-50"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Hide Preview" : "Preview"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#193C8D] text-white rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-[#0f2e6d] transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save Resource"}
            </button>
          </div>

          {showPreview && (
            <div className="mt-4 p-4 border border-zinc-200 rounded-xl bg-zinc-50">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                SectorContent Card Preview ({previewModel.document_type})
              </p>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded">{previewModel.document_type}</span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded">
                    {previewModel.section_tag}
                  </span>
                </div>
                <h3 className="font-bold text-[#0B1E3A] mb-2">{previewModel.title}</h3>
                <p className="text-sm text-zinc-600 mb-4">{previewModel.description}</p>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[#193C8D]">
                    <Database className="w-4 h-4" /> Open
                  </span>
                  <a href={previewModel.download_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-zinc-500">
                    <ExternalLink className="w-4 h-4" /> URL
                  </a>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
