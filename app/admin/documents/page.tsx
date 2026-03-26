"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRequireAdmin } from '@/lib/isAdmin'
import { Loader2, Search, RefreshCw } from 'lucide-react'

// --- Reusable UI Components (Defined here or imported from your UI lib) ---
const Switch = ({ checked, onCheckedChange, id }: { checked: boolean; onCheckedChange: (v: boolean) => void; id: string }) => (
  <input
    id={id}
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer"
  />
)

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'secondary' }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${variant === 'secondary' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
    {children}
  </span>
)

// --- Types updated to match your Database View ---
interface Document {
  id: number
  title: string
  official_kam_sector_name: string // Matches your DB screenshot
  document_type: string
  download_url: string | null
  is_active: boolean
  is_published?: boolean // Optional if not in current view
  file_size_bytes?: number 
  created_at?: string 
}

export default function DocumentsAdminPage() {
  useRequireAdmin()
  
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({ sector: '', active: true })
  const [page, setPage] = useState(1)

  // Memoized fetcher to avoid infinite loops in useEffect
  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        active: filters.active.toString(),
        page: page.toString(),
        limit: '20',
        ...(filters.sector && { sector: filters.sector })
      })
      
      const res = await fetch(`/api/admin/documents?${params}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      
      setDocuments(data.documents || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const toggleFlag = async (id: number, field: string, value: boolean) => {
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'PATCH', // Usually PATCH for updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value }),
      })
      if (res.ok) fetchDocuments()
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KAM Resource Manager</h1>
          <p className="text-gray-500">Managing {total} documents</p>
        </div>
        <button 
          onClick={() => fetchDocuments()}
          className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </header>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex-1 min-w-[200px]">
              <input 
                className="w-full p-2 border rounded-md"
                placeholder="Search sector (e.g. Leather)..."
                value={filters.sector}
                onChange={(e) => setFilters({...filters, sector: e.target.value})}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch 
                id="active-toggle"
                checked={filters.active} 
                onCheckedChange={(v) => setFilters({...filters, active: v})} 
              />
              <span className="text-sm font-medium">Show Active Only</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p>Fetching from Database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-4 font-semibold">Document Title</th>
                    <th className="p-4 font-semibold">KAM Sector</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-gray-50/50 transition">
                      <td className="p-4">
                        <div className="font-medium text-blue-900">{doc.title}</div>
                        <div className="text-xs text-gray-400">{doc.download_url}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{doc.official_kam_sector_name}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge>{doc.document_type}</Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Switch 
                          id={`s-${doc.id}`}
                          checked={doc.is_active}
                          onCheckedChange={(v) => toggleFlag(doc.id, 'is_active', v)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}