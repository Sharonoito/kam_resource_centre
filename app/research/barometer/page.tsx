"use client"

import React, { useState, useEffect } from 'react'
import { 
  Search, Filter, Globe, ArrowRight, FileText, LayoutDashboard, Database,
  TrendingUp, X, ArrowDownLeft, ArrowUpRight, Clock, Target
} from 'lucide-react'
import Link from 'next/link'

export default function UnifiedTradePortal() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState('')

  // 1. Unified Fetch Logic
  // This API should call your DB, your PDF storage (S3/Supabase), and your PowerBI Map
  const fetchUnifiedData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        sector: selectedSector,
      })
      const res = await fetch(`/api/unified-search?${params.toString()}`)
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchUnifiedData, 500)
    return () => clearTimeout(timeout)
  }, [searchTerm, selectedSector])

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* 2. EMOTIONAL HERO SECTION */}
      <div className="bg-[#193C8D] pt-20 pb-32 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">
            Trade <span className="text-[#E7B947]">Navigator</span>
          </h1>
          <p className="text-blue-200 mb-8 font-medium max-w-xl">
            Access export data, market analytics, and regulatory reports for your sector in one click.
          </p>
          
          <div className="relative max-w-3xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text"
              placeholder="Try 'Flower Exports 2024' or 'Tea Market Report'..."
              className="w-full pl-16 pr-8 py-7 bg-white rounded-3xl text-zinc-900 shadow-2xl outline-none text-xl font-bold placeholder:text-zinc-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-12">
        {/* 3. SECTOR QUICK-ACCESS (Minimal Struggle) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {['Flowers', 'Coffee', 'Tea', 'Textiles', 'Minining', 'Services'].map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector === selectedSector ? '' : sector)}
              className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 font-black uppercase text-[10px] tracking-widest ${
                selectedSector === sector 
                ? 'bg-[#E7B947] border-[#E7B947] text-[#193C8D] shadow-lg scale-105' 
                : 'bg-white border-zinc-100 text-zinc-400 hover:border-[#193C8D]'
              }`}
            >
              <div className={`p-3 rounded-2xl ${selectedSector === sector ? 'bg-white/20' : 'bg-zinc-50'}`}>
                <Target className="w-6 h-6" />
              </div>
              {sector}
            </button>
          ))}
        </div>

        {/* 4. RESULTS FEED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col">
              {/* SOURCE TAG */}
              <div className="flex justify-between items-start mb-6">
                <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  item.type === 'POWER_BI' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  item.type === 'PDF' ? 'bg-red-50 text-red-600 border-red-100' :
                  'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {item.type === 'POWER_BI' && <LayoutDashboard className="w-3 h-3" />}
                  {item.type === 'PDF' && <FileText className="w-3 h-3" />}
                  {item.type === 'RAW_DATA' && <Database className="w-3 h-3" />}
                  {item.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-bold text-zinc-300">{item.date}</span>
              </div>

              <h3 className="text-xl font-black text-[#193C8D] uppercase leading-tight mb-4 line-clamp-2">
                {item.title}
              </h3>

              <p className="text-sm text-zinc-400 font-medium mb-8 line-clamp-2 italic">
                {item.description}
              </p>

              <div className="mt-auto">
                {/* DYNAMIC ACTION BUTTON */}
                <Link 
                  href={item.link} 
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                    item.type === 'POWER_BI' ? 'bg-[#193C8D] text-white' :
                    item.type === 'PDF' ? 'bg-zinc-900 text-white' :
                    'bg-zinc-100 text-zinc-600 hover:bg-[#E7B947] hover:text-[#193C8D]'
                  }`}
                >
                  {item.type === 'POWER_BI' ? 'Open Dashboard' : 
                   item.type === 'PDF' ? 'Download PDF' : 'View Raw Data'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}