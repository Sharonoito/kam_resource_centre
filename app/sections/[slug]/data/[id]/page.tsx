import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Download, Search, Filter, Database, BarChart3, FileText, MapPin } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

// Dummy data structure - replace with real Prisma query
const dummyTradeRecords = [
  {
    id: 1,
    hsCode: '0101.21.00',
    description: 'Pure-bred breeding horses',
    date: '2024-03-15',
    origin: 'United Kingdom',
    destination: 'Kenya',
    quantity: '12 heads',
    fobValue: 'KES 4,560,000',
    cifValue: 'KES 5,234,000',
    dutyPaid: 'KES 523,400',
    trader: 'Equine Imports Ltd',
    documents: 3
  },
  {
    id: 2,
    hsCode: '0106.31.00',
    description: 'Live chickens weighing not more than 185g',
    date: '2024-03-14',
    origin: 'Brazil',
    destination: 'Kenya',
    quantity: '25,000 birds',
    fobValue: 'KES 12,500,000',
    cifValue: 'KES 14,250,000',
    dutyPaid: 'KES 1,425,000',
    trader: 'Poultry International KE',
    documents: 2
  },
  {
    id: 3,
    hsCode: '0201.10.00',
    description: 'Carcasses and half-carcasses of bovine animals, fresh or chilled',
    date: '2024-03-13',
    origin: 'Ethiopia',
    destination: 'Kenya',
    quantity: '8.5 MT',
    fobValue: 'KES 3,200,000',
    cifValue: 'KES 3,520,000',
    dutyPaid: 'KES 352,000',
    trader: 'East Africa Meat Packers',
    documents: 4
  },
  {
    id: 4,
    hsCode: '0406.90.10',
    description: 'Fresh (unripened or unripe) cheese',
    date: '2024-03-12',
    origin: 'Netherlands',
    destination: 'Kenya',
    quantity: '2,400 kg',
    fobValue: 'KES 1,680,000',
    cifValue: 'KES 1,848,000',
    dutyPaid: 'KES 184,800',
    trader: 'Dairy Global Traders',
    documents: 2
  },
  {
    id: 5,
    hsCode: '0502.10.00',
    description: 'Dry glands of animals',
    date: '2024-03-10',
    origin: 'India',
    destination: 'Kenya',
    quantity: '450 kg',
    fobValue: 'KES 720,000',
    cifValue: 'KES 756,000',
    dutyPaid: 'KES 75,600',
    trader: 'Pharma Raw Materials Ltd',
    documents: 3
  },
  {
    id: 6,
    hsCode: '0101.29.90',
    description: 'Other horses, live',
    date: '2024-03-08',
    origin: 'United Arab Emirates',
    destination: 'Kenya',
    quantity: '5 heads',
    fobValue: 'KES 2,250,000',
    cifValue: 'KES 2,475,000',
    dutyPaid: 'KES 247,500',
    trader: 'Desert Horse Imports',
    documents: 2
  }
];

async function getSectionData(slug: string, id: string) {
  // Real implementation would query Prisma based on slug/id
  // For now return dummy data filtered by section
  const sectionData = dummyTradeRecords.filter(record => 
    record.hsCode.startsWith('01') || record.hsCode.startsWith('02') || 
    record.hsCode.startsWith('03') || record.hsCode.startsWith('04') || 
    record.hsCode.startsWith('05')
  );
  
  return {
    title: 'Live Animals & Products - Trade Declarations Database',
    sectionSlug: slug,
    databaseId: id,
    totalRecords: sectionData.length,
    records: sectionData,
    lastUpdated: '2024-03-16',
    exportFormats: ['CSV', 'Excel', 'PDF']
  };
}

export default async function SectionDataPage({ params }: Props) {
  const { slug, id } = await params;
  
  const data = await getSectionData(slug, id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#193C8D] to-[#142C55] text-white py-20">
        <div className="container mx-auto px-6">
          <Link href={`/sections/${slug}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Link>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {data.title}
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Complete trade declarations database for HS Section I. Search, filter and export raw customs data.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E7B947] mb-1">{data.totalRecords}</div>
                <div className="text-sm opacity-90">Total Records</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E7B947] mb-1">{data.lastUpdated}</div>
                <div className="text-sm opacity-90">Last Updated</div>
              </div>
              <div className="text-center md:text-left">
                <div className="flex flex-wrap gap-2">
                  {data.exportFormats.map((format) => (
                    <button key={format} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition-all">
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-end">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search declarations by HS code, trader name, origin country..." 
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#193C8D] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                HS Code
              </button>
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                Origin
              </button>
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                Date
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="w-12 h-12 bg-[#193C8D]/10 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-[#193C8D]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{data.totalRecords}</p>
              <p className="text-sm text-slate-500">Total Declarations</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">KES 24.7M</p>
              <p className="text-sm text-slate-500">Total FOB Value</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">6</p>
              <p className="text-sm text-slate-500">Unique Traders</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">4</p>
              <p className="text-sm text-slate-500">Origin Countries</p>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Trade Declarations
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">HS Code</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Origin</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">FOB Value</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Trader</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-900">{record.hsCode}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{record.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                        {record.origin}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{record.fobValue}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-slate-900">{record.trader}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row gap-4 mt-8 p-6 bg-white rounded-2xl shadow-sm border">
          <button className="flex-1 bg-[#193C8D] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#142C55] transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Export All (CSV/Excel)
          </button>
          <button className="flex-1 border border-slate-200 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            Load More Records
          </button>
        </div>
      </section>
    </div>
  );
}

