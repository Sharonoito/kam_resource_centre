"use client"

import Link from "next/link"
import { FileText, Download, TableProperties, BarChart2, ExternalLink, Eye } from "lucide-react"
import type { ResourceDocument, FileIconType } from "@/lib/documents"
import { getFileIconType } from "@/lib/documents"

function getDocumentHref(doc: ResourceDocument): string {
  if (doc.id) return `/api/documents/download/${doc.id}`
  return "#"
}

function FileIcon({ type, className = "w-8 h-8" }: { type: FileIconType; className?: string }) {
  switch (type) {
    case "pdf":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="2" width="13" height="17" rx="2" className="fill-red-50 stroke-red-400" strokeWidth="1.5" />
          <path d="M16 2l5 5h-5V2z" className="fill-red-200" />
          <path d="M7 9h6M7 12h6M7 15h4" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
          <text x="4" y="21" fontSize="5" fontWeight="bold" fill="#ef4444">PDF</text>
        </svg>
      )
    case "excel":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="2" width="13" height="17" rx="2" className="fill-green-50 stroke-green-400" strokeWidth="1.5" />
          <path d="M16 2l5 5h-5V2z" className="fill-green-200" />
          <path d="M7 9l4 6M11 9l-4 6" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" />
          <text x="4" y="21" fontSize="4.5" fontWeight="bold" fill="#16a34a">XLSX</text>
        </svg>
      )
    case "powerbi":
      return (
        <BarChart2 className={className + " text-yellow-500"} />
      )
    default:
      return (
        <FileText className={className + " text-[#193C8D]"} />
      )
  }
}

const TYPE_BADGE: Record<string, string> = {
  "Policy Brief":    "bg-purple-50 text-purple-700 border-purple-200",
  "Sector Profile":  "bg-blue-50   text-blue-700   border-blue-200",
  "Report":          "bg-amber-50  text-amber-700  border-amber-200",
  "General Document":"bg-gray-50   text-gray-600   border-gray-200",
}

function TypeBadge({ type }: { type: string | null }) {
  const cls = TYPE_BADGE[type ?? ""] ?? "bg-gray-50 text-gray-500 border-gray-200"
  return (
    <span className={`inline-flex items-center border px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      {type ?? "Document"}
    </span>
  )
}

interface ResourceDocumentCardProps {
  doc: ResourceDocument
  showSector?: boolean
}

export default function ResourceDocumentCard({ doc, showSector = false }: ResourceDocumentCardProps) {
  const iconType = getFileIconType(doc.filename, doc.mime_type)
  const baseHref = getDocumentHref(doc)
  const hasLink = baseHref !== "#"
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#E7B947]/60 transition-all p-5 flex gap-5">
      <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#193C8D]/5 transition-colors">
        <FileIcon type={iconType} className="w-8 h-8" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <TypeBadge type={doc.document_type} />
          {showSector && doc.sector && doc.sector.toLowerCase() !== "general" && (
            <span className="inline-flex items-center border border-[#193C8D]/20 bg-[#193C8D]/5 text-[#193C8D] px-2 py-0.5 rounded-full text-[10px] font-semibold">
              {doc.sector}
            </span>
          )}
          {doc.year && (
            <span className="text-[10px] text-gray-400 font-mono">{doc.year}</span>
          )}
        </div>
        <h3 className="font-semibold text-sm text-[#0B1E3A] leading-snug mb-1 line-clamp-2 group-hover:text-[#193C8D] transition-colors">
          {doc.filename}
        </h3>
        {doc.publisher && (
          <p className="text-xs text-gray-400 mb-3 truncate">
            Published by {doc.publisher}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-auto">
          {hasLink ? (
            <>
              <a
                href={`${baseHref}?mode=preview`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#193C8D] hover:bg-[#0B1E3A] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </a>
              <a
                href={`${baseHref}?mode=download`}
                className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-[#193C8D] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50 text-gray-700"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-not-allowed">
              <FileText className="w-3.5 h-3.5" />
              No link yet
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
