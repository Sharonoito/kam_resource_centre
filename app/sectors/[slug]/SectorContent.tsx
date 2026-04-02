"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { FileText, Download, Eye, AlertCircle, BarChart3 } from 'lucide-react';
import { HsSection } from '@/types/sectors';

interface SectorContentProps {
  sectionsData: HsSection[];
  contentData: any[];
  sectorName: string;
  sectorSlug: string;
}

function PowerBiCard({ item, sectorSlug }: { item: any; sectorSlug: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all group flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-blue-50 text-blue-500 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
          <BarChart3 size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Power BI Report</p>
          <h4 className="font-bold text-[#193C8D] text-sm line-clamp-2">
            {item.title || 'Power BI Report'}
          </h4>
        </div>
      </div>
      {item.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
      )}
      <Link
        href={`/sectors/${sectorSlug}/report/${item.id}`}
        className="mt-auto flex items-center justify-center gap-2 py-2 px-4 bg-[#193C8D] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#E7B947] hover:text-[#0B1E3A] transition-colors"
      >
        <Eye size={12} /> View Report
      </Link>
    </div>
  );
}

function DocumentCard({ item }: { item: any }) {
  const name = item.title || item.file_name || item.filename;
  const file = item.filename || item.file_name;
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-red-50 text-red-500 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
          <FileText size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-0.5">Document</p>
          <h4 className="font-bold text-[#193C8D] text-sm line-clamp-2">{name}</h4>
        </div>
      </div>
      <div className="mt-auto flex gap-2">
        <a
          href={`/documents/sector-reports/${encodeURIComponent(file)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 py-2 bg-[#193C8D] text-white text-[10px] font-bold rounded-lg hover:bg-[#0B1E3A] transition-colors flex items-center justify-center gap-2"
        >
          <Eye size={12} /> Preview
        </a>
        <a
          href={`/documents/sector-reports/${encodeURIComponent(file)}`}
          download
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={14} className="text-gray-400" />
        </a>
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

  const sectionLookup = useMemo(
    () => new Map(sectionsData.map(s => [s.id, s.name])),
    [sectionsData]
  );

  const getGroupName = (item: any): string => {
    if (item.sub_sector_id && sectionLookup.has(item.sub_sector_id)) {
      return sectionLookup.get(item.sub_sector_id)!;
    }
    if (item.sector === 'Leather' && Array.from(sectionLookup.values()).includes('Leather Goods')) {
      return 'Leather Goods';
    }
    if (item.sector && Array.from(sectionLookup.values()).includes(item.sector)) {
      return item.sector;
    }
    const title = (item.title || item.file_name || item.filename || '').toLowerCase();
    if (title.includes('automotive')) return 'Transport';
    if (item.tags) return item.tags;
    if (item.sector) return item.sector;
    return 'Other Resources';
  };

  const groupedContent = useMemo(() => {
    const groups: Record<string, any[]> = {};
    const sectionNames = new Set(sectionsData.map(s => s.name));
    const unmatched: any[] = [];

    contentData.forEach((item: any) => {
      const groupName = getGroupName(item);
      if (sectionNames.has(groupName)) {
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(item);
      } else if (item.powerbi_embed || item.powerbi_url) {
        if (!groups['Sector Overview']) groups['Sector Overview'] = [];
        groups['Sector Overview'].push(item);
      } else {
        unmatched.push(item);
      }
    });

    if (unmatched.length > 0) groups['Other Resources'] = unmatched;
    return groups;
  }, [contentData, sectionLookup, sectionsData]);

  if (!sectionsData || sectionsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-red-400 mb-4 opacity-20" />
        <h3 className="text-lg font-bold text-[#193C8D]">No HS Sections Found</h3>
        <p className="text-sm text-gray-500">The sectionsData array for {sectorName} is empty.</p>
      </div>
    );
  }

  const renderGrid = (items: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item: any) =>
        (item.powerbi_embed || item.powerbi_url)
          ? <PowerBiCard key={item.id} item={item} sectorSlug={sectorSlug} />
          : <DocumentCard key={item.id} item={item} />
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <div className="border-b-2 border-[#E7B947] pb-4">
        <h1 className="text-3xl font-bold text-[#193C8D]">{sectorName} Overview</h1>
      </div>

      {sectionsData.map((section) => {
        const items = groupedContent[section.name] || [];
        return (
          <div key={section.id} className="space-y-6">
            <h2 className="text-sm font-black text-[#E7B947] uppercase tracking-widest flex items-center gap-2">
              <span className="bg-[#193C8D] text-white px-2 py-0.5 rounded text-[10px]">{section.id}</span>
              {section.name}
            </h2>
            {items.length > 0 ? renderGrid(items) : (
              <div className="py-10 bg-slate-50 rounded-xl border border-dashed border-gray-200 text-center">
                <p className="text-xs text-gray-400 italic">No resources matched to {section.name} yet.</p>
              </div>
            )}
          </div>
        );
      })}

      {groupedContent['Sector Overview']?.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-sm font-black text-[#E7B947] uppercase tracking-widest flex items-center gap-2">
            <span className="bg-[#193C8D] text-white px-2 py-0.5 rounded text-[10px]">star</span>
            Sector Overview
          </h2>
          {renderGrid(groupedContent['Sector Overview'])}
        </div>
      )}

      {groupedContent['Other Resources']?.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-sm font-black text-[#E7B947] uppercase tracking-widest flex items-center gap-2">
            <span className="bg-[#193C8D] text-white px-2 py-0.5 rounded text-[10px]">?</span>
            Other Resources
          </h2>
          {renderGrid(groupedContent['Other Resources'])}
        </div>
      )}
    </div>
  );
}
