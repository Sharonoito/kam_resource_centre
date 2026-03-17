import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, ShieldCheck, Globe, Package, Landmark } from "lucide-react";

export default async function DeclarationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch specific record using the unique ID from the URL
  const record = await prisma.icms_master.findUnique({
    where: { id: parseInt(id) }
  });

  if (!record) notFound();

  return (
    <div className="min-h-screen bg-[#F4F7FA] pb-20">
      {/* MINIMAL HEADER */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href=".." className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#193C8D]">
            <ArrowLeft className="w-4 h-4" /> Return to Data Hub
          </Link>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#193C8D] transition-all">
            <Printer className="w-3 h-3" /> Print Record
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto mt-12 px-6">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          
          {/* TOP BRANDING BAR */}
          <div className="bg-[#193C8D] p-12 text-white relative">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-[#E7B947] w-6 h-6" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60">Verified KRA Master Record</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-tight max-w-2xl">
                {record.good_description}
              </h1>
            </div>
            <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-[-20deg] translate-x-10" />
          </div>

          {/* MAIN DATA GRID */}
          <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
              
              <DataBlock label="HS Classification" value={record.hscode} icon={<Package className="w-4 h-4" />} />
              <DataBlock label="Origin Territory" value={record.origin_country} icon={<Globe className="w-4 h-4" />} />
              <DataBlock label="Filing Reference" value={record.entry_number} icon={<Landmark className="w-4 h-4" />} />
              
              <div className="lg:col-span-3 h-px bg-slate-100 my-4" />

              {/* FINANCIALS BLOCK */}
              <div className="md:col-span-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Financial Assessment</p>
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-1">Calculated FOB Value</p>
                      <p className="text-4xl font-black text-[#193C8D] italic tracking-tighter">
                        KES {new Intl.NumberFormat().format(Number(record.fob_value))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Currency Type</p>
                      <p className="font-bold text-slate-700">Kenya Shilling</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SIDE METADATA */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Sync Information</p>
                 <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">System ID</p>
                      <p className="text-xs font-mono font-bold text-slate-700">PRISMA_REF_{record.id}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Data Source</p>
                      <p className="text-xs font-bold text-slate-700 italic underline decoration-[#E7B947] underline-offset-4 cursor-help">KRA ICMS Database</p>
                    </div>
                 </div>
              </div>

            </div>
          </div>

          {/* FOOTER DISCLAIMER */}
          <div className="bg-slate-50 border-t border-slate-100 p-8 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
              This data is synchronized from the Kenya Revenue Authority ICMS database. <br/>
              Internal Reference Only • KAM Research Hub © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataBlock({ label, value, icon }: { label: string; value: any; icon: any }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[#193C8D]">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-lg font-bold text-slate-800 pl-6 border-l-2 border-slate-100">{value || "---"}</p>
    </div>
  );
}