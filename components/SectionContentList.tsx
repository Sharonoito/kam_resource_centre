"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, ChevronDown, ArrowRight, Download, ExternalLink, FileText, BarChart3, Database } from "lucide-react";

interface ContentItem {
  id: number;
  type: 'pdf' | 'powerbi' | 'database';
  title: string;
  description?: string;
  pdf_url?: string;
  powerbi_url?: string;
  powerbi_embed?: string;
  hscode?: string;
  origin_country?: string;
  fob_value?: any;
  regime?: string;
  year?: number;
  url?: string;
}

interface SectionContentListProps {
  initialContent: ContentItem[];
  sectionSlug: string;
  sectionName: string;
  baseEmbedUrl: string;
  pageName?: string;
}

export default function SectionContentList({
  initialContent,
  sectionSlug,
  sectionName,
  baseEmbedUrl,
  pageName
}: SectionContentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tradeType, setTradeType] = useState("");
  const [year, setYear] = useState("");
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'report'>('list');

  // Filter content based on search and filters
  const filteredContent = useCallback(() => {
    return content.filter(item => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          item.title?.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search) ||
          item.hscode?.toLowerCase().includes(search) ||
          item.origin_country?.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }
      
      // Trade type filter
      if (tradeType && item.type === 'database') {
        if (tradeType === 'Import' && item.regime !== 'IMPORT') return false;
        if (tradeType === 'Export' && item.regime !== 'EXPORT') return false;
      }
      
      // Year filter
      if (year && item.type === 'database') {
        if (item.year !== parseInt(year)) return false;
      }
      
      return true;
    });
  }, [content, searchTerm, tradeType, year]);

  // Get unique years from database content
  const availableYears = Array.from(
    new Set(
      content
        .filter(c => c.type === 'database' && c.year)
        .map(c => c.year as number)
    )
  ).sort((a, b) => b - a);

  // Get PDF content
  const pdfContent = filteredContent().filter(c => c.type === 'pdf');
  
  // Get PowerBI content
  const powerbiContent = filteredContent().filter(c => c.type === 'powerbi');
  
  // Get Database content
  const databaseContent = filteredContent().filter(c => c.type === 'database');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Reset filters
  const clearFilters = () => {
    setSearchTerm("");
    setTradeType("");
    setYear("");
  };

  // Render content card based on type
  const renderContentCard = (item: ContentItem, index: number) => {
    if (item.type === 'pdf') {
      return (
        <div key={`pdf-${item.id}`} className="bg-white border border-zinc-200 rounded-[2rem] p-8 flex gap-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
          <div className="w-56 h-40 rounded-2xl overflow-hidden shrink-0 border bg-zinc-50 relative">
            <img 
              src={`https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop&auto=format`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              alt=""
            />
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded flex items-center gap-1">
                <FileText className="w-3 h-3" /> PDF
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold text-zinc-400">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <h3 className="font-black text-2xl mb-2 text-zinc-900 group-hover:text-[#193C8D] transition-colors line-clamp-2">{item.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>
            <div className="flex items-center gap-4">
              {item.pdf_url && (
                <>
                  <a
                    href={item.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#193C8D] font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all"
                  >
                    View PDF <ArrowRight className="w-5 h-5"/>
                  </a>
                  <a
                    href={item.pdf_url}
                    download
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#193C8D] font-medium text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (item.type === 'powerbi') {
      return (
        <div key={`powerbi-${item.id}`} className="bg-white border border-zinc-200 rounded-[2rem] p-8 flex gap-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
          <div className="w-56 h-40 rounded-2xl overflow-hidden shrink-0 border bg-zinc-50 relative">
            <img 
              src={`https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              alt=""
            />
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs font-bold rounded flex items-center gap-1">
                <BarChart3 className="w-3 h-3" /> Power BI
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold text-zinc-400">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <h3 className="font-black text-2xl mb-2 text-zinc-900 group-hover:text-[#193C8D] transition-colors line-clamp-2">{item.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>
            <Link
              href={`/sections/${sectionSlug}?view=report`}
              className="inline-flex items-center gap-2 text-[#193C8D] font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all"
            >
              Launch Dashboard <ArrowRight className="w-5 h-5"/>
            </Link>
          </div>
        </div>
      );
    }

    // Database content
    return (
      <div key={`db-${item.id}`} className="bg-white border border-zinc-200 rounded-[2rem] p-8 flex gap-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
        <div className="w-56 h-40 rounded-2xl overflow-hidden shrink-0 border bg-zinc-50 relative">
          <img 
            src={`https://images.unsplash.com/photo-1460925895917-aae19b6810a4?w=400&h=300&fit=crop&auto=format`} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            alt=""
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-bold rounded flex items-center gap-1 ${item.regime === 'EXPORT' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
              <Database className="w-3 h-3" /> {item.regime === 'EXPORT' ? 'EXPORT' : 'IMPORT'}
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            {item.hscode && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded">
                HS: {item.hscode}
              </span>
            )}
            {item.year && (
              <span className="text-xs font-bold text-zinc-400">{item.year}</span>
            )}
          </div>
          <h3 className="font-black text-2xl mb-2 text-zinc-900 group-hover:text-[#193C8D] transition-colors line-clamp-2">{item.title}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">
            {item.origin_country && `Origin: ${item.origin_country}`}
            {item.fob_value && ` | Value: KES ${Number(item.fob_value).toLocaleString()}`}
          </p>
          <Link
            href={item.url || `/research/kra/${item.id}`}
            className="inline-flex items-center gap-2 text-[#193C8D] font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all"
          >
            View Details <ArrowRight className="w-5 h-5"/>
          </Link>
        </div>
      </div>
    );
  };

  // If viewing report (PowerBI embed)
  if (viewMode === 'report') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border">
          <h2 className="font-black text-xl text-zinc-900">{sectionName} Analysis</h2>
          <button 
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2 text-xs font-black text-zinc-400 hover:text-red-600 uppercase tracking-wider"
          >
            <ArrowRight className="w-5 h-5 rotate-180"/> Close Analysis
          </button>
        </div>
        <div className="bg-white border rounded-[2rem] overflow-hidden shadow-2xl h-[800px]">
          <iframe
            src={pageName ? `${baseEmbedUrl}&pageName=${pageName}` : baseEmbedUrl}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-10">
      {/* SIDEBAR */}
      <aside className="w-72 shrink-0 space-y-6">
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-sm">
          <h3 className="font-black text-[10px] uppercase text-zinc-400 mb-6 tracking-[0.2em]">Discovery</h3>
          <nav className="space-y-2">
            <button 
              onClick={clearFilters}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all ${!tradeType ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <BarChart3 className="w-4 h-4" /> All Reports
            </button>
            <Link 
              href={`/sections/${sectionSlug}?tradeType=Import`}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all ${tradeType === 'Import' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <FileText className="w-4 h-4" /> Import Statistics
            </Link>
            <Link 
              href={`/sections/${sectionSlug}?tradeType=Export`}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all ${tradeType === 'Export' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <Database className="w-4 h-4" /> Export Statistics
            </Link>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 space-y-6">
        {/* Search and Filters */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                type="text" 
                placeholder={`Search within ${sectionName}...`}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm outline-none text-zinc-800 transition-all focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={tradeType}
                onChange={(e) => setTradeType(e.target.value)}
                className="px-4 py-2 bg-zinc-50 border rounded-xl text-sm font-bold text-zinc-600 flex items-center gap-2"
              >
                <option value="">All Trade Types</option>
                <option value="Import">Imports</option>
                <option value="Export">Exports</option>
              </select>
              <select 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="px-4 py-2 bg-zinc-50 border rounded-xl text-sm font-bold text-zinc-600 flex items-center gap-2"
              >
                <option value="">All Years</option>
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Lists */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#193C8D] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-zinc-500">Loading...</p>
          </div>
        ) : (
          <>
            {/* PDF Reports */}
            {pdfContent.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-black text-lg text-zinc-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" /> PDF Reports
                </h3>
                {pdfContent.map((item, idx) => renderContentCard(item, idx))}
              </div>
            )}

            {/* Power BI Dashboards */}
            {powerbiContent.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-black text-lg text-zinc-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-yellow-500" /> Interactive Dashboards
                </h3>
                {powerbiContent.map((item, idx) => renderContentCard(item, idx))}
              </div>
            )}

            {/* Database Records */}
            {databaseContent.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-black text-lg text-zinc-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" /> Trade Data Records
                </h3>
                {databaseContent.map((item, idx) => renderContentCard(item, idx))}
              </div>
            )}

            {/* No Results */}
            {filteredContent().length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border">
                <p className="text-zinc-500 font-medium">No results found</p>
                <button onClick={clearFilters} className="text-[#193C8D] text-sm font-bold mt-2">
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

