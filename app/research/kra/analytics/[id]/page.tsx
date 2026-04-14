"use client"

import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Globe, ShieldCheck, 
  Coins, FileText, PieChart, Activity, FileDown,
  Hash, Info, Box
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RecordAnalytics({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter()
  
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await fetch(`/api/customs/icms/${id}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Fetch Error:", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) getDetails()
  }, [id])

  const downloadPDF = () => {
    if (!data) return
    const doc = new jsPDF()
    
    // Header
    doc.setFillColor(25, 60, 141) 
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text("TRADE INTELLIGENCE REPORT", 15, 25)
    
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 50)

    autoTable(doc, {
      startY: 60,
      head: [['Field', 'Value']],
      body: [
        ['Entry Number', data.entry_number],
        ['Description', data.good_description],
        ['HS Code', data.hscode],
        ['Origin', data.origin_country],
        ['Regime', data.regime],
        ['Station', data.station],
        ['Value (FOB)', `${data.currency || 'KES'} ${Number(data.fob_value).toLocaleString()}`],
        ['Total Tax', `KES ${Number(data.total_tax_1).toLocaleString()}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [231, 185, 71] } 
    })

    doc.save(`Report_${data.entry_number}.pdf`)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#193C8D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-black text-[#193C8D] animate-pulse uppercase tracking-widest text-[10px]">Processing Intelligence...</p>
      </div>
    </div>
  )

  if (!data) return <div className="p-20 text-center font-black">RECORD NOT FOUND</div>

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* HEADER */}
      <div className="bg-[#193C8D] pt-16 pb-32 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex justify-between items-start mb-12">
            <button 
              onClick={() => router.push('/research/barometer')}
              className="group flex items-center gap-3 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all border border-white/10 text-xs"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO LIBRARY
            </button>
            <button 
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-[#E7B947] text-[#193C8D] px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-2xl"
            >
              <FileDown className="w-4 h-4" /> Export as PDF
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-green-500/20 text-green-400 text-[10px] font-black tracking-widest uppercase rounded-full border border-green-500/30 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> System Verified
                </span>
                <span className="px-4 py-1.5 bg-white/10 text-white/70 text-[10px] font-black tracking-widest uppercase rounded-full border border-white/10">
                  Ref: {data.id}
                </span>
              </div>
              <h1 className="text-5xl font-black leading-tight uppercase tracking-tight mb-4">
                {data.entry_number}
              </h1>
              <p className="text-white/60 font-bold text-lg max-w-3xl uppercase leading-relaxed">
                {data.good_description || "Shipment Details Classified"}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shrink-0 min-w-[300px]">
              <p className="text-[#E7B947] text-[10px] font-black uppercase tracking-[0.2em] mb-2">Freight On Board (FOB)</p>
              <p className="text-4xl font-black">
                <span className="text-sm text-white/40 mr-2 font-bold">{data.currency || 'KES'}</span>
                {Number(data.fob_value || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* FISCAL CARD */}
            <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-zinc-100">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-[#193C8D]"><Coins className="w-6 h-6" /></div>
                  <h3 className="text-xl font-black text-[#193C8D] uppercase tracking-tight">Taxation & Levies</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                {[
                  { label: "Import Duty", val: data.import_duty, color: "bg-blue-600" },
                  { label: "Value Added Tax", val: data.import_vat, color: "bg-orange-500" },
                  { label: "Excise Duty", val: data.excise, color: "bg-purple-600" },
                  { label: "IDF Fees", val: data.idf, color: "bg-emerald-600" },
                  { label: "RDL Levies", val: data.rdl, color: "bg-rose-600" },
                  { label: "Misc Taxes", val: data.other_tax, color: "bg-zinc-500" },
                ].map((tax) => (
                  <div key={tax.label} className="group flex items-center justify-between border-b border-zinc-50 pb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-1 h-4 rounded-full ${tax.color} opacity-40`} />
                        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">{tax.label}</span>
                    </div>
                    <span className="font-black text-[#193C8D]">KES {Number(tax.val || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-6 bg-[#193C8D] rounded-2xl flex justify-between items-center">
                <span className="text-white/50 text-xs font-black uppercase tracking-widest">Total Tax Liability</span>
                <span className="text-[#E7B947] text-2xl font-black">KES {Number(data.total_tax_1 || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* TECHNICAL SPECS */}
            <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-zinc-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-zinc-50 rounded-2xl text-zinc-600"><Info className="w-6 h-6" /></div>
                  <h3 className="text-xl font-black text-[#193C8D] uppercase tracking-tight">Declaration Details</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <SpecBox label="HS Code" value={data.hscode} icon={<Hash className="w-3 h-3"/>} />
                    <SpecBox label="Regime" value={data.regime} icon={<Activity className="w-3 h-3"/>} />
                    <SpecBox label="Quantity" value={data.quantity} icon={<Box className="w-3 h-3"/>} />
                    <SpecBox label="Currency" value={data.currency} icon={<PieChart className="w-3 h-3"/>} />
                </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <div className="bg-[#193C8D] text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-12 relative z-10">
                <div className="p-3 bg-[#E7B947] rounded-2xl text-[#193C8D]"><Globe className="w-6 h-6" /></div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Logistics</h3>
              </div>

              <div className="space-y-10 relative z-10">
                <LogisticsItem label="Origin/Destination" value={data.origin_country || 'GLOBAL'} />
                <LogisticsItem label="Customs Station" value={data.station || 'MOMBASA PORT'} />
                <LogisticsItem label="Registration Date" value={data.reg_date || 'N/A'} />
                <div className="pt-8 border-t border-white/10">
                    <p className="text-[10px] font-black text-[#E7B947] uppercase mb-3 tracking-[0.2em]">Data Source</p>
                    <div className="flex items-center gap-2 text-white/60 font-bold text-xs uppercase">
                        ICMS Live Feed Database
                    </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function SpecBox({ label, value, icon }: { label: string, value: any, icon: any }) {
    return (
        <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 transition-all">
            <div className="flex items-center gap-2 mb-2 text-zinc-400">
                {icon}
                <p className="text-[9px] font-black uppercase tracking-widest">{label}</p>
            </div>
            <p className="font-black text-[#193C8D] text-lg truncate">{value || '---'}</p>
        </div>
    )
}

function LogisticsItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[10px] font-black text-white/30 uppercase mb-2 tracking-widest">{label}</p>
            <p className="text-xl font-bold text-white uppercase">{value}</p>
        </div>
    )
}
