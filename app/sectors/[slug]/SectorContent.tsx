"use client";

import { useState, useEffect } from "react";
import { FileText, Download, BarChart3, ExternalLink, Eye, Database, Layers, AlertCircle } from "lucide-react";
import Link from "next/link";
import { HsSection } from "@/types/sectors";
import { type ResourceDocument } from "@/lib/documents";
import ResourceDocumentCard from "@/components/ResourceDocumentCard";

interface SectorContentProps {
  sectorName: string;
  sectorColor?: string;
  sectionsData: HsSection[];
  pdfContents: any[];
  powerbiContents: any[];
  databaseContents: any[];
  linkContents: any[];
  resourceDocs?: ResourceDocument[];
}

type TabId = string;

export default function SectorContent({
  sectorName,
  sectorColor = "#193C8D",
  sectionsData,
  pdfContents,
  powerbiContents,
  databaseContents,
  linkContents,
  resourceDocs = [],
}: SectorContentProps) {
  
  // --- DEBUG LOGGING ---
  // This will log to your Browser Console (F12) every time the props change
  useEffect(() => {
    console.log(`🔍 [DEBUG] Sector: ${sectorName}`);
    console.log("📄 PDF Reports:", pdfContents.length);
    console.log("📊 Dashboards:", powerbiContents.length);
    console.log("☁️ SharePoint Docs (resourceDocs):", resourceDocs);
  }, [sectorName, pdfContents, powerbiContents, resourceDocs]);

  // Group resource_documents by document_type (e.g. 'Sector Profile', 'Report')
  const groupedResourceDocs = resourceDocs.reduce<Record<string, ResourceDocument[]>>((acc, doc) => {
    const key = (doc.sector ?? "").trim() || "General";
    (acc[key] ??= []).push(doc);
    return acc;
  }, {});
  const sectionOrderMap = new Map(sectionsData.map((section, index) => [section.name.toLowerCase(), index]));
  const resourceDocEntries = Object.entries(groupedResourceDocs).sort(([a], [b]) => {
    if (a === "General") return 1;
    if (b === "General") return -1;

    const aIndex = sectionOrderMap.get(a.toLowerCase());
    const bIndex = sectionOrderMap.get(b.toLowerCase());

    if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;

    return a.localeCompare(b);
  });

  const allTabs = [
    { id: "pdf",      label: "PDF Reports",    count: pdfContents.length,      icon: <FileText     className="w-4 h-4" /> },
    { id: "powerbi",  label: "Dashboards",     count: powerbiContents.length,  icon: <BarChart3    className="w-4 h-4" /> },
    { id: "database", label: "Trade Data",     count: databaseContents.length, icon: <Database     className="w-4 h-4" /> },
    { id: "links",    label: "External Links", count: linkContents.length,     icon: <ExternalLink className="w-4 h-4" /> },
    { id: "publications", label: "Publications", count: resourceDocs.length, icon: <FileText className="w-4 h-4" /> },
  ];
  
  const tabs = allTabs.filter(t => t.count > 0);
  const [activeTab, setActiveTab] = useState<TabId>(tabs[0]?.id ?? "pdf");
  const totalResources = pdfContents.length + powerbiContents.length + databaseContents.length + linkContents.length + resourceDocs.length;

  // Tracking function for Analytics
  const handleTrackAction = async (resourceId: number, action: "VIEW" | "DOWNLOAD") => {
    try {
      await fetch("/api/resources/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resourceId, action }),
      });
    } catch (err) {
      console.error("Tracking failed:", err);
    }
  };

  if (totalResources === 0) {
    return (
      <div className="text-center py-20 text-zinc-400">
        <Database className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-semibold">No resources found for this sector yet.</p>
        <p className="text-sm mt-1">Check back soon or use the search above.</p>
        {/* Debug Info for Admin */}
        <div className="mt-4 p-2 bg-zinc-50 rounded text-[10px] font-mono inline-block">
          Sector Query: "{sectorName}" | Published: {resourceDocs.length}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* 🛠️ DEBUG BANNER (Visible only during development) */}
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500" />
        <p className="text-xs text-blue-700 font-medium">
          <strong>Debug Mode:</strong> Loaded <strong>{resourceDocs.length}</strong> SharePoint resources for <strong>{sectorName}</strong>. 
          Check console (F12) for full JSON data.
        </p>
      </div>

      {/* HS Sections Coverage Banner */}
      {sectionsData.length > 0 && (
        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${sectorColor}20` }}
            >
              <Layers className="w-4 h-4" style={{ color: sectorColor }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B1E3A]">
                Aggregated across {sectionsData.length} HS {sectionsData.length === 1 ? "Section" : "Sections"}
              </h3>
              <p className="text-xs text-zinc-500">
                {totalResources} resource{totalResources !== 1 ? "s" : ""} unified under {sectorName}
                {resourceDocs.length > 0 && ` · ${resourceDocs.length} publication${resourceDocs.length !== 1 ? "s" : ""} from SharePoint`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {sectionsData.map((sec: HsSection) => (
              <Link
                key={sec.id}
                href={sec.path}
                className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 hover:border-zinc-400 px-3 py-1 rounded-full text-xs font-medium text-zinc-600 hover:text-[#193C8D] transition-colors"
              >
                <span className="font-mono text-[10px] text-zinc-400">{sec.id}</span>
                {sec.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tab Bar */}
      {tabs.length > 1 && (
        <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-[#193C8D] shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? "bg-[#193C8D] text-white" : "bg-zinc-200 text-zinc-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* PDF Reports */}
      {activeTab === "pdf" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
{pdfContents.map((content, index) => (
            <div key={`${content.id}-${content.section_tag || 'no-section'}-${content.document_type || 'unknown'}-${index}`} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded">PDF</span>
                {content.section_tag && (
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                    {content.section_tag}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-[#0B1E3A] mb-2 line-clamp-2 flex-1">{content.title}</h3>
              {content.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{content.description}</p>
              )}
              <div className="flex items-center justify-between pt-4 border-t mt-auto">
                <Link
                  href={`/resources/${content.id}`}
                  onClick={() => handleTrackAction(content.id, 'VIEW')}
                  className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Details
                </Link>
<a
                  href={`/api/documents/download/${content.id}?mode=download`}
                  onClick={() => handleTrackAction(content.id, 'DOWNLOAD')}
                  className="flex items-center gap-1 text-sm font-medium text-[#193C8D] hover:text-[#E7B947]"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Power BI Dashboards */}
      {activeTab === "powerbi" && (
        <div className="grid lg:grid-cols-2 gap-8">
{powerbiContents.map((content, index) => (
            <div key={`${content.id}-${content.section_tag || 'no-section'}-${content.document_type || 'powerbi'}-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-bold text-[#0B1E3A] truncate">{content.title}</h3>
                  {content.section_tag && (
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded shrink-0">
                      {content.section_tag}
                    </span>
                  )}
                </div>
                <a
                  href={content.powerbi_url || "#"}
                  onClick={() => handleTrackAction(content.id, 'VIEW')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-medium text-[#193C8D] hover:text-[#E7B947] shrink-0"
                >
                  <ExternalLink className="w-4 h-4" /> Open
                </a>
              </div>
              <div className="aspect-video bg-gray-100">
                {content.powerbi_embed ? (
                  <iframe src={content.powerbi_embed} className="w-full h-full" allowFullScreen />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <BarChart3 className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Database / Trade Data */}
      {activeTab === "database" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Source Section</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
{databaseContents.map((content, index) => (
                  <tr key={`${content.id}-${content.tags?.join('-') || 'no-tags'}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#0B1E3A]">{content.title}</td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-400">{content.tags || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/research/barometer?search=${encodeURIComponent(sectorName)}`}
                        onClick={() => handleTrackAction(content.id, 'VIEW')}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#193C8D] hover:text-[#E7B947]"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resource Documents — grouped by section/sector with General fallback */}
      {activeTab === "publications" && resourceDocEntries.length > 0 && (
        <div className="space-y-7">
          {resourceDocEntries.map(([sectionName, docs]) => (
            <div key={sectionName} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{sectionName}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 font-semibold">
                  {docs.length}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc) => (
                  <ResourceDocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}