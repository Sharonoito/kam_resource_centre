"use client"

import React, { useState, useEffect } from 'react'
import { 
  Search, Filter, Globe, ArrowRight, Plus,
  BarChart3, TrendingUp, X, ArrowDownLeft, ArrowUpRight, Clock, Target, Box, Activity
} from 'lucide-react'
import Link from 'next/link'

export default function BarometerGallery() {
  const [dbData, setDbData] = useState<any[]>([])
  const [meta, setMeta] = useState<{years: number[], countries: string[]}>({ years: [], countries: [] })
  const [statsData, setStatsData] = useState<any>(null)
  const [trendData, setTrendData] = useState<any[]>([])
  
  // Loading & Pagination States
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedFlow, setSelectedFlow] = useState('') 
  const [selectedSubcategory, setSelectedSubcategory] = useState('')

  // 1. Fetch Metadata (Only once on mount)
  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch('/api/customs/icms/meta')
        const data = await res.json()
        if (data) {
          setMeta({
            years: Array.isArray(data.years) ? data.years : [],
            countries: Array.isArray(data.countries) ? data.countries : []
          })
        }
      } catch (err) { console.error("Meta Fetch Error:", err) }
    }
    fetchMeta()
  }, [])

  // 2. Fetch Data Logic
  const fetchData = async (pageNum: number, isNewSearch: boolean) => {
    if (isNewSearch) {
        setLoading(true)
        setHasMore(true)
    } else {
        setLoadingMore(true)
    }

    const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10'
    })
    if (selectedYear) params.append('year', selectedYear)
    if (selectedMonth) params.append('month', selectedMonth)
    if (selectedCountry) params.append('country', selectedCountry)
    if (selectedFlow) params.append('flow', selectedFlow)
    if (selectedSubcategory) params.append('subcategory', selectedSubcategory)
    if (searchTerm) params.append('search', searchTerm)

    try {
      // Fetch stats and trends only on new searches to save resources
      const requests: any[] = [fetch(`/api/customs/icms?${params.toString()}`)]
      if (isNewSearch) {
          requests.push(fetch(`/api/customs/icms/stats?${params.toString()}`))
          requests.push(fetch(`/api/customs/icms/trend?${params.toString()}`))
      }

      const results = await Promise.all(requests)
      const newData = await results[0].json()
      
      if (isNewSearch) {
        const stats = await results[1].json()
        const trend = await results[2].json()
        setStatsData(stats)
        setTrendData(Array.isArray(trend) ? trend : [])
        setDbData(newData)
      } else {
        setDbData(prev => [...prev, ...newData])
      }

      // If we got fewer than 10 records, there are no more to load
      if (newData.length < 10) setHasMore(false)

    } catch (err) { 
      console.error("Data Fetch Error:", err) 
    } finally { 
      setLoading(false) 
      setLoadingMore(false)
    }
  }

  // Trigger search when filters change (Debounced search)
  useEffect(() => {
    setPage(1)
    const timeoutId = setTimeout(() => fetchData(1, true), 400)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedYear, selectedMonth, selectedCountry, selectedFlow, selectedSubcategory])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchData(nextPage, false)
  }

  // Helper Functions
  const generateSparkline = (data: any[]) => {
    if (!data || data.length < 2) return null;
    const values = data.map(d => d.total_fob || 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const width = 120;
    const height = 40;
    const points = values.map((val, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline fill="none" stroke="#E7B947" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    );
  };

  const getMonthName = (monthStr: string | null) => {
    if (!monthStr) return '';
    const m = monthStr.split('-')[1];
    const names: Record<string, string> = {
      '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR', '05': 'MAY', '06': 'JUN',
      '07': 'JUL', '08': 'AUG', '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC'
    };
    return names[m] || monthStr;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-20">
      
      {/* HERO SECTION */}
      <div className="bg-[#193C8D] pt-24 pb-32 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-[#E7B947] text-[#193C8D] text-[10px] font-black tracking-[0.3em] uppercase rounded-full">
              Trade Intelligence Portal
            </span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tight mb-8">
            Customs <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7B947] to-white font-black">CMS</span>
          </h1>
          <div className="relative max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-6 h-6" />
            <input 
              type="text"
              placeholder="Search by Goods, HS Code or Entry #..."
              className="w-full pl-16 pr-8 py-6 bg-white rounded-3xl text-zinc-900 shadow-2xl outline-none text-lg font-bold placeholder:text-zinc-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-zinc-100 sticky top-24 max-h-[85vh] overflow-y-auto">
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-[#193C8D]">
                  <Filter className="w-5 h-5" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Filters</h3>
                </div>
                <button 
                  onClick={() => {setSelectedYear(''); setSelectedMonth(''); setSelectedCountry(''); setSelectedFlow(''); setSelectedSubcategory('')}} 
                  className="text-red-500 hover:rotate-90 transition-transform"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Trade Flow Toggle */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">Trade Flow</label>
                <div className="flex gap-2 p-1.5 bg-zinc-50 rounded-2xl border-2 border-zinc-100">
                  <button 
                    onClick={() => setSelectedFlow(selectedFlow === 'IM' ? '' : 'IM')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${selectedFlow === 'IM' ? 'bg-white shadow-md text-[#193C8D]' : 'text-zinc-400'}`}
                  >
                    <ArrowDownLeft className="w-3 h-3 text-blue-500" /> IMPORTS
                  </button>
                  <button 
                    onClick={() => setSelectedFlow(selectedFlow === 'EX' ? '' : 'EX')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${selectedFlow === 'EX' ? 'bg-white shadow-md text-[#193C8D]' : 'text-zinc-400'}`}
                  >
                    <ArrowUpRight className="w-3 h-3 text-green-500" /> EXPORTS
                  </button>
                </div>
              </div>

              {/* Year Segment */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">Year Segment</label>
                <div className="flex flex-wrap gap-2">
                  {meta.years && meta.years.map(year => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year.toString() === selectedYear ? '' : year.toString())}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${
                          selectedYear === year.toString() ? 'bg-[#193C8D] border-[#193C8D] text-white' : 'bg-white border-zinc-100 text-zinc-400'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                </div>
              </div>

              {/* Country Selection */}
              <div className="mb-6">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">Origin/Destination</label>
                <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl text-sm font-black text-[#193C8D] outline-none appearance-none cursor-pointer">
                  <option value="">GLOBAL (ALL)</option>
                  {meta.countries && meta.countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Time Period */}
              <div className="mb-6">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">Time Period</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl text-sm font-black text-[#193C8D] outline-none appearance-none cursor-pointer">
                  <option value="">FULL YEAR</option>
                  {['01','02','03','04','05','06','07','08','09','10','11','12'].map((m, i) => (
                    <option key={m} value={m}>{['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][i]}</option>
                  ))}
                </select>
              </div>

              {/* Report Category */}
              <div className="mb-6">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">Report Category</label>
                <select className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl text-sm font-black text-[#193C8D] outline-none appearance-none cursor-pointer">
                  <option value="">ICMS DATA</option>
                </select>
              </div>

              {/* Subcategory */}
              <div className="mb-6">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">Subcategory</label>
                <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl text-sm font-black text-[#193C8D] outline-none appearance-none cursor-pointer">
                  <option value="">ALL REPORTS</option>
                  <option value="TAX_REPORTS">Tax Reports</option>
                  <option value="IMPORTS_REPORTS">Imports Reports</option>
                  <option value="EXPORTS_REPORTS">Exports Reports</option>
                </select>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-grow">
            
            {/* STATS HEADER */}
            <div className="mb-10 bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-blue-50 rounded-2xl"><TrendingUp className="w-8 h-8 text-[#193C8D]" /></div>
                <div>
                  <h2 className="text-2xl font-black text-[#193C8D] uppercase tracking-tight">
                    {selectedFlow === 'IM' ? 'Import' : selectedFlow === 'EX' ? 'Export' : 'Trade'} Intelligence
                  </h2>
                  <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {(statsData?.record_count || 0).toLocaleString()} Records Active
                  </p>
                </div>
              </div>

              {trendData?.length > 1 && (
                <div className="hidden xl:flex items-center gap-4 px-8 border-l border-zinc-100">
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Pulse</p>
                    {generateSparkline(trendData)}
                  </div>
                </div>
              )}

              <div className="text-right">
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Cumulative Value</p>
                <p className="text-3xl font-black text-[#193C8D]">
                  <span className="text-sm text-[#E7B947] mr-2">KES</span>
                  {(statsData?.total_fob || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1,2,3,4].map(i => <div key={i} className="h-80 bg-zinc-100 rounded-[3rem] animate-pulse" />)}
              </div>
            ) : dbData?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {dbData.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="group bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-1">
                        <div className="flex flex-wrap gap-2 mb-8">
                        <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${item.regime?.startsWith('EX') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                            {item.regime?.startsWith('EX') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                            {item.regime}
                        </span>
                        <span className="flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-700 rounded-full text-[10px] font-black uppercase border border-orange-100">
                            <Clock className="w-3 h-3" /> {getMonthName(item.month)} {item.year}
                        </span>
                        <span className="flex items-center gap-2 px-4 py-1.5 bg-zinc-50 text-zinc-500 rounded-full text-[10px] font-black uppercase border border-zinc-100">
                            <Globe className="w-3.5 h-3.5" /> {item.origin_country || 'Global'}
                        </span>
                        </div>

                        <div className="mb-6">
                        <p className="text-[10px] font-black text-[#E7B947] uppercase mb-2">Declaration #{item.entry_number}</p>
                        <h3 className="text-xl font-black text-[#193C8D] leading-tight line-clamp-2 uppercase">
                            {item.good_description || "UNDOCUMENTED SHIPMENT"}
                        </h3>
                        </div>

                        <div className="mt-auto pt-8 border-t border-zinc-50 flex items-end justify-between">
                        <div>
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">FOB Value</p>
                            <p className="text-2xl font-black text-[#193C8D]">
                                <span className="text-sm text-zinc-400 mr-1 font-bold">KES</span>
                                {Number(item.fob_value).toLocaleString()}
                            </p>
                        </div>
                        <Link 
                            href={`/research/barometer/analytics/${item.id}`}
                            className="flex items-center gap-3 px-8 py-4 bg-[#193C8D] text-white rounded-2xl hover:bg-[#E7B947] hover:text-[#193C8D] transition-all font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-900/10"
                        >
                            Analyze <ArrowRight className="w-4 h-4" />
                        </Link>
                        </div>
                    </div>
                    ))}
                </div>

                {/* LOAD MORE BUTTON */}
                {hasMore && (
                  <div className="mt-16 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="flex items-center gap-4 px-12 py-6 bg-white border-2 border-[#193C8D] text-[#193C8D] rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#193C8D] hover:text-white transition-all shadow-xl disabled:opacity-50 group"
                    >
                      {loadingMore ? (
                        <div className="w-5 h-5 border-t-2 border-[#E7B947] rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                      )}
                      {loadingMore ? 'Fetching Records...' : 'Load More Intelligence'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-[4rem] p-32 text-center border-2 border-dashed border-zinc-100 shadow-inner">
                <BarChart3 className="w-16 h-16 text-zinc-200 mx-auto mb-6" />
                <h3 className="text-3xl font-black text-[#193C8D] mb-4 uppercase">No Data Found</h3>
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Refine your filters to identify trade records.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
