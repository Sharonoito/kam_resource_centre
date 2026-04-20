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
 * SLIM POWER BI CARD - Reduced vertical footprint
 */
function PowerBiRow({ item, sectorSlug }: { item: any; sectorSlug: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#193C8D]/5 border border-[#193C8D]/10 rounded-xl hover:border-[#193C8D]/40 transition-all group">
      <div className="w-10 h-10 bg-[#193C8D] rounded-lg flex items-center justify-center text-[#E7B947] shrink-0 shadow-sm">
        <BarChart3 size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black text-[#193C8D] uppercase tracking-widest">Dashboard</span>
          <span className="bg-[#E7B947] text-[#193C8D] text-[7px] px-1 rounded font-black uppercase">Live</span>
        </div>
        <h4 className="font-bold text-gray-900 text-[13px] uppercase truncate leading-tight">
          {item.title || 'Power BI Report'}
        </h4>
      </div>

      <Link
        href={`/sectors/${sectorSlug}/report/${item.id}`}
        className="shrink-0 p-2 bg-[#193C8D] text-white rounded-lg hover:bg-[#0B1E3A] transition-all active:scale-95"
        title="Open Analytics"
      >
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}

/**
 * SLIM DOCUMENT CARD - Tightened padding and layout
 */
function DocumentRow({ item }: { item: any }) {
  const name = item.title || item.file_name || item.filename;
  const file = item.filename || item.file_name;
  const docType = item.document_type || 'RESOURCE';
  const year = item.year;
  
  let pdfUrl = null;
  if (item.sharepoint_download_url) {
    pdfUrl = item.sharepoint_download_url;
  } else if (file && item.sector_id) {
    pdfUrl = `/uploads/admin/${encodeURIComponent(file)}`;
  } else if (file) {
    pdfUrl = `/documents/sector-reports/${encodeURIComponent(file)}`;
  }

  return (
    <div className="flex items-center gap-3 p-2.5 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-[#193C8D]/20 transition-all group">
      {/* Smaller horizontal-friendly thumbnail */}
      <div className="w-10 h-12 shrink-0 rounded-md border border-gray-50 overflow-hidden bg-gray-50 flex items-center justify-center">
        {pdfUrl ? (
          <PdfThumbnail pdfUrl={pdfUrl} />
        ) : (
          <FileText size={18} className="text-gray-200" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter bg-gray-50 px-1.5 py-0.5 rounded">
            {docType}
          </span>
          {year && <span className="text-[10px] font-mono font-bold text-[#193C8D]">{year}</span>}
        </div>
        <h4 className="font-bold text-gray-700 text-[12px] uppercase truncate leading-none">
          {name}
        </h4>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {pdfUrl && (
          <>
            <a
              href={pdfUrl}
              target="_blank" rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-[#193C8D] transition-colors"
            >
              <Eye size={16} />
            </a>
            <a
              href={pdfUrl}
              download
              className="p-1.5 text-gray-400 hover:text-[#193C8D] transition-colors"
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

  const filteredContent = useMemo(() => {
    return contentData.filter(item => {
      const searchTerms = searchQuery.toLowerCase();
      const searchableStr = `${item.title} ${item.file_name} ${item.filename} ${item.document_type} ${item.year} ${item.publisher}`.toLowerCase();
      return searchableStr.includes(searchTerms);
    });
  }, [contentData, searchQuery]);

  const groupedContent = useMemo(() => {
    const groups: Record<string, any[]> = {};
    const sectionNames = new Set(sectionsData.map(s => s.name.toLowerCase()));

    filteredContent.forEach((item: any) => {
      let groupName = 'Other Resources';
      if (item.powerbi_embed || item.powerbi_url) {
        groupName = 'Sector Overview';
      } else {
        if (item.sub_sector_id && sectionLookup.has(item.sub_sector_id)) {
          groupName = sectionLookup.get(item.sub_sector_id)!;
        } else {
          if (item.sector && sectionNames.has(item.sector.toLowerCase())) {
            groupName = item.sector;
          } else {
            const tags = Array.isArray(item.tags) ? item.tags : typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : [];
            const sectionNamesField = Array.isArray(item.section_names) ? item.section_names : typeof item.section_names === 'string' ? item.section_names.split(',').map((t: string) => t.trim()) : [];
            const allSectionKeys = [...sectionNames];
            const match = [...tags, ...sectionNamesField].find(tag => allSectionKeys.includes(tag.toLowerCase()));
            if (match) groupName = match;
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
    <div className="container mx-auto px-6 py-6">
      {/* COMPACT SEARCH */}
      <div className="mb-8">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${contentData.length} ${sectorName} assets...`}
            className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-xl text-sm shadow-sm focus:ring-1 focus:ring-[#193C8D] outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SLIM SIDEBAR */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24 bg-gray-50/50 border border-gray-100 rounded-2xl p-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Directory</h3>
            <nav className="space-y-0.5">
              {allVisibleSections.map((section) => {
                const count = groupedContent[section.name]?.length ?? 0;
                if (count === 0 && searchQuery) return null;
                return (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg text-[10px] font-bold text-gray-500 uppercase hover:bg-[#193C8D] hover:text-white transition-all group"
                  >
                    <span className="truncate pr-2">{section.name}</span>
                    <span className="opacity-50 group-hover:opacity-100">{count}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* TWO-COLUMN SLIM GRID */}
        <main className="flex-1 min-w-0 space-y-8">
          {filteredContent.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Matches</p>
            </div>
          ) : (
            allVisibleSections.map((section) => {
              const items = groupedContent[section.name] || [];
              if (items.length === 0) return null;

              return (
                <section key={section.id} id={`section-${section.id}`} className="scroll-mt-32">
                  <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-100">
                    <h2 className="text-[10px] font-black text-[#193C8D] uppercase tracking-widest">
                      {section.name}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
