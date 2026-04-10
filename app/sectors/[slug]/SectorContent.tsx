"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, Download, Eye, AlertCircle, BarChart3,
  Search, X, Filter, ArrowUpRight 
} from 'lucide-react';
import { HsSection } from '@/types/sectors';
import PdfThumbnail from '@/components/PdfThumbnail';

interface SectorContentProps {
  sectionsData: HsSection[];
  contentData: any[];
  sectorName: string;
  sectorSlug: string;
}

/**
 * POWER BI THUMBNAIL - mini dashboard visual
 */
function PowerBiThumbnail() {
  return (
    <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden border border-[#193C8D]/30 bg-[#193C8D] relative shadow-lg">
      <div className="absolute inset-0 flex flex-col p-2 gap-1">
        <div className="h-1.5 bg-white/20 rounded-sm w-3/4" />
        <div className="h-1 bg-white/10 rounded-sm w-1/2 mb-1" />
        {/* Bar chart */}
        <div className="flex items-end gap-0.5 flex-1">
          {[55, 80, 40, 95, 65, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-[#E7B947]/90" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="h-px bg-white/20 w-full" />
        <div className="h-1 bg-white/10 rounded-sm w-2/3" />
      </div>
      <div className="absolute top-1.5 right-1.5 bg-[#E7B947] text-[#193C8D] text-[6px] font-black px-1 py-0.5 rounded uppercase">
        LIVE
      </div>
    </div>
  );
}

/**
 * POWER BI ROW - High-profile dashboard card
 */
function PowerBiRow({ item, sectorSlug }: { item: any; sectorSlug: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-[#193C8D]/5 border border-[#193C8D]/10 rounded-2xl hover:border-[#193C8D]/40 transition-all group">
      <PowerBiThumbnail />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-[#193C8D] uppercase tracking-widest">Intelligence Dashboard</span>
          <span className="px-1.5 py-0.5 rounded bg-[#E7B947] text-[#193C8D] text-[9px] font-black uppercase tracking-tighter">Live Data</span>
        </div>
        <h4 className="font-bold text-gray-900 text-base group-hover:text-[#193C8D] transition-colors uppercase tracking-tight">
          {item.title || 'Power BI Report'}
        </h4>
        {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">{item.description}</p>}
      </div>
      <Link
        href={`/sectors/${sectorSlug}/report/${item.id}`}
        className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#193C8D] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#E7B947] hover:text-[#193C8D] transition-all shadow-md active:scale-95"
      >
        Open Analytics <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

/**
 * DOCUMENT ROW - Clean, data-dense row
 */
function DocumentRow({ item }: { item: any }) {
  const name = item.title || item.file_name || item.filename;
  const file = item.filename || item.file_name;
  const docType = item.document_type || 'RESOURCE';
  const year = item.year;
  // Determine correct PDF URL based on source
  let pdfUrl = null;
  if (item.sharepoint_download_url) {
    // SharePoint document
    pdfUrl = item.sharepoint_download_url;
  } else if (file && item.sector_id) {
    // Admin upload (kam_content)
    pdfUrl = `/uploads/admin/${encodeURIComponent(file)}`;
  } else if (file) {
    // Fallback to sector-reports
    pdfUrl = `/documents/sector-reports/${encodeURIComponent(file)}`;
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:border-[#193C8D]/20 transition-all group">
      {pdfUrl ? (
        <PdfThumbnail pdfUrl={pdfUrl} />
      ) : (
        <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-red-500 group-hover:bg-red-50 transition-all">
          <FileText size={20} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded group-hover:bg-[#193C8D]/10 group-hover:text-[#193C8D] transition-colors">
            {docType}
          </span>
          {year && <span className="text-[10px] font-mono font-black text-[#193C8D]">{year}</span>}
        </div>
        <h4 className="font-bold text-gray-700 text-sm truncate uppercase tracking-tight">
          {name}
        </h4>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {pdfUrl && (
          <>
            <a
              href={pdfUrl}
              target="_blank" rel="noopener noreferrer"
              className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 hover:text-[#193C8D] transition-all"
              title="Quick View"
            >
              <Eye size={16} />
            </a>
            <a
              href={pdfUrl}
              download
              className="p-2.5 bg-[#193C8D] text-white rounded-xl hover:bg-[#0B1E3A] transition-all shadow-sm active:scale-90"
              title="Download PDF"
            >
              <Download size={16} />
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function SectorContent({
  sectionsData = [],
  contentData = [],
  sectorName,
  sectorSlug,
}: SectorContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const sectionLookup = useMemo(() => new Map(sectionsData.map(s => [s.id, s.name])), [sectionsData]);

  // Unified Filtering Logic
  const filteredContent = useMemo(() => {
    return contentData.filter(item => {
      const searchTerms = searchQuery.toLowerCase();
      const searchableStr = `${item.title} ${item.file_name} ${item.filename} ${item.document_type} ${item.year} ${item.publisher}`.toLowerCase();
      return searchableStr.includes(searchTerms);
    });
  }, [contentData, searchQuery]);

  // Grouping Logic (with tag/section matching for GENERAL_GLOBAL)
  const groupedContent = useMemo(() => {
    const groups: Record<string, any[]> = {};
    const sectionNames = new Set(sectionsData.map(s => s.name.toLowerCase()));

    filteredContent.forEach((item: any) => {
      let groupName = 'Other Resources';

      // Prefer PowerBI grouping
      if (item.powerbi_embed || item.powerbi_url) {
        groupName = 'Sector Overview';
      } else {
        // Try to match by sub_sector_id
        if (item.sub_sector_id && sectionLookup.has(item.sub_sector_id)) {
          groupName = sectionLookup.get(item.sub_sector_id)!;
        } else {
          // Try to match by sector name (legacy)
          if (item.sector && sectionNames.has(item.sector.toLowerCase())) {
            groupName = item.sector;
          } else {
            // Try to match by tags or section_names (for GENERAL_GLOBAL)
            // Accepts comma-separated string or array
            const tags = Array.isArray(item.tags)
              ? item.tags
              : typeof item.tags === 'string'
                ? item.tags.split(',').map((t: string) => t.trim())
                : [];
            const sectionNamesField = Array.isArray(item.section_names)
              ? item.section_names
              : typeof item.section_names === 'string'
                ? item.section_names.split(',').map((t: string) => t.trim())
                : [];
            // Try to match any tag/section_name to a section
            const allSectionKeys = [...sectionNames];
            const match = [...tags, ...sectionNamesField].find(tag => allSectionKeys.includes(tag.toLowerCase()));
            if (match) {
              groupName = match;
            }
          }
        }
      }

      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(item);
    });

    return groups;
  }, [filteredContent, sectionsData, sectionLookup]);

  const allVisibleSections = [
    ...(groupedContent['Sector Overview'] ? [{ id: 'overview', name: 'Sector Overview' }] : []),
    ...sectionsData,
    ...(groupedContent['Other Resources'] ? [{ id: 'other', name: 'Other Resources' }] : []),
  ];

  return (
    <div className="container mx-auto px-6 py-10">
      {/* 1. SEARCH & UTILITY BAR */}
      <div className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${totalItems} ${sectorName} resources (title, year, type)...`}
            className="block w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium shadow-xl focus:ring-2 focus:ring-[#193C8D] focus:border-transparent outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#193C8D]"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Found {filteredContent.length} Matching Assets
            </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* 2. NAVIGATION SIDEBAR */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 bg-gray-50 border border-gray-100 rounded-3xl p-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
              <Filter size={12} className="text-[#193C8D]" /> Directory
            </h3>
            <nav className="space-y-1">
              {allVisibleSections.map((section) => {
                const count = groupedContent[section.name]?.length ?? 0;
                if (count === 0 && searchQuery) return null; // Hide empty sections during search
                
                return (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-tight hover:bg-[#193C8D] hover:text-white transition-all group"
                  >
                    <span className="truncate pr-2">{section.name}</span>
                    <span className="bg-white text-gray-400 group-hover:bg-white/20 group-hover:text-white px-2 py-0.5 rounded-lg border border-gray-100 group-hover:border-transparent transition-all">
                      {count}
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* 3. ASSET GRID */}
        <main className="flex-1 min-w-0 space-y-12">
          {filteredContent.length === 0 ? (
            <div className="py-24 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest">No Matches Found</h3>
              <p className="text-xs text-gray-400 mt-1">Adjust your search terms to find resources in this sector.</p>
            </div>
          ) : (
            allVisibleSections.map((section) => {
              const items = groupedContent[section.name] || [];
              if (items.length === 0) return null;

              return (
                <section key={section.id} id={`section-${section.id}`} className="scroll-mt-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#193C8D] flex items-center justify-center text-white font-mono text-[10px] font-black">
                         {section.id.toString().substring(0,2).toUpperCase()}
                      </div>
                      <h2 className="text-sm font-black text-[#193C8D] uppercase tracking-widest">
                        {section.name}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {items.map((item: any) =>
                      (item.powerbi_embed || item.powerbi_url)
                        ? <PowerBiRow key={item.id} item={item} sectorSlug={sectorSlug} />
                        : <DocumentRow key={item.id} item={item} />
                    )}
                  </div>
                </section>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}

const totalItems = 0; 
