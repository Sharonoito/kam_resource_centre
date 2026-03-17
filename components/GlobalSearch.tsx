"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight, ArrowDownRight, DollarSign, Calendar } from "lucide-react";

interface TradeResult {
  id: number;
  entry_number: string | null;
  hscode: string | null;
  hs_chapter: string | null;
  good_description: string | null;
  regime: string | null;
  origin_country: string | null;
  origin_country_code: string | null;
  country_name: string | null;
  fob_value: any;
  quantity: any;
  currency: string | null;
  total_tax_1: any;
  total_tax_2: any;
  import_duty: any;
  import_vat: any;
  excise: any;
  export_levy: any;
  idf: any;
  rdl: any;
  rml: any;
  prl: any;
  mss: any;
  other_tax: any;
  year: number | null;
  month: string | null;
  reg_date: string | null;
  url: string;
}

interface SearchResponse {
  results: TradeResult[];
  total: number;
  query: string;
  filters: {
    regime: string;
    year: string | null;
    country: string | null;
    availableYears: (number | null)[];
    availableCountries: (string | null)[];
  };
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TradeResult[]>([]);
  const [filters, setFilters] = useState({
    regime: 'all',
    year: '',
    country: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search - 300ms delay
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('q', query);
        if (filters.regime !== 'all') params.set('regime', filters.regime);
        if (filters.year) params.set('year', filters.year);
        if (filters.country) params.set('country', filters.country);

        const response = await fetch(`/api/search?${params.toString()}`);
        const data: SearchResponse = await response.json();
        setResults(data.results || []);
        
        // Update available filter options from API response
        if (data.filters.availableYears) {
          setAvailableYears(data.filters.availableYears.filter(Boolean) as number[]);
        }
        if (data.filters.availableCountries) {
          setAvailableCountries(data.filters.availableCountries.filter(Boolean) as string[]);
        }
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters.regime, filters.year, filters.country]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format currency value
  const formatValue = (value: any) => {
    if (!value) return '-';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-[#E7B947] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search products, HS codes, or countries..."
          className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E7B947] focus:ring-2 focus:ring-[#E7B947]/20 transition-all"
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Bar */}
      {isOpen && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {/* Regime Filter */}
          <select
            value={filters.regime}
            onChange={(e) => setFilters(prev => ({ ...prev, regime: e.target.value }))}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#E7B947]"
          >
            <option value="all">All Trade</option>
            <option value="IMPORT">Imports</option>
            <option value="EXPORT">Exports</option>
          </select>

          {/* Year Filter */}
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#E7B947]"
          >
            <option value="">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* Country Filter */}
          <select
            value={filters.country}
            onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#E7B947] min-w-[150px]"
          >
            <option value="">All Countries</option>
            {availableCountries.slice(0, 15).map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[500px] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-4 text-gray-500 text-center">
              Type at least 2 characters to search
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No trade records found for "{query}"</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((trade) => (
                <Link
                  key={trade.id}
                  href={trade.url}
                  className="block px-4 py-3 hover:bg-blue-50 transition-colors group border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Trade Type Badge */}
                      <div className="flex items-center gap-2 mb-1">
                        {trade.regime === 'EXPORT' ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                            <ArrowUpRight className="w-3 h-3" /> EXPORT
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                            <ArrowDownRight className="w-3 h-3" /> IMPORT
                          </span>
                        )}
                        {trade.hscode && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono">
                            HS: {trade.hscode}
                          </span>
                        )}
                      </div>

                      {/* Product Description */}
                      <div className="text-[#193C8D] font-semibold text-sm mb-1 group-hover:text-[#E7B947] transition-colors line-clamp-1">
                        {trade.good_description || 'Unknown Product'}
                      </div>

                      {/* Trade Details */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">{trade.origin_country || trade.country_name || 'Unknown'}</span>
                        </span>
                        {trade.year && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {trade.year}
                          </span>
                        )}
                        {trade.fob_value && (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign className="w-3 h-3" />
                            {formatValue(trade.fob_value)} {trade.currency || 'KES'}
                          </span>
                        )}
                      </div>

                      {/* Tax Information */}
                      {(trade.import_duty || trade.import_vat || trade.excise || trade.export_levy) && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="text-gray-400">Taxes:</span>
                          {trade.import_duty && (
                            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded">
                              Duty: {formatValue(trade.import_duty)}
                            </span>
                          )}
                          {trade.import_vat && (
                            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded">
                              VAT: {formatValue(trade.import_vat)}
                            </span>
                          )}
                          {trade.excise && (
                            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded">
                              Excise: {formatValue(trade.excise)}
                            </span>
                          )}
                          {trade.export_levy && (
                            <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded">
                              Levy: {formatValue(trade.export_levy)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#193C8D] shrink-0 mt-1" />
                  </div>
                </Link>
              ))}

              {/* Footer with total count */}
              {results.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="text-xs text-gray-500 text-center">
                    Found <span className="font-bold text-[#193C8D]">{results.length}</span> trade records
                    {filters.regime !== 'all' && <span> ({filters.regime === 'IMPORT' ? 'Imports' : 'Exports'})</span>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

