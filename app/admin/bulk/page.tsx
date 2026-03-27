"use client"

import { useRequireAdmin } from '@/lib/isAdmin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Loader2, FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'

export default function BulkUploadPage() {
  useRequireAdmin()
  
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<any[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      previewFile(selectedFile)
    }
  }

  const previewFile = (selectedFile: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      if (selectedFile.name.endsWith('.csv')) {
        // Papaparse
        import('papaparse').then(({ parse }) => {
          parse(data as string, {
            header: true,
            complete: (results) => setPreview(results.data)
          })
        })
      } else {
        // XLSX
        import('xlsx').then(({ read, utils }) => {
          const wb = read(data)
          const ws = wb.Sheets[wb.SheetNames[0]]
          const json = utils.sheet_to_json(ws)
          setPreview(json)
        })
      }
    }
    reader.readAsArrayBuffer(selectedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await fetch('/api/admin/bulk', {
      method: 'POST',
      body: formData,
    })
    
    if (res.ok) {
      alert('Bulk upload successful!')
    } else {
      alert('Bulk upload failed')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-kam-navy mb-2">Bulk Upload</h1>
        <p className="text-slate-600">Upload CSV or Excel with content data. Columns: title, description, sector_slug, content_type, file_name</p>
        <a
          href="/templates/bulk-upload-template.csv"
          download
          className="mt-4 inline-flex items-center rounded-lg border border-kam-blue/25 bg-kam-blue/5 px-4 py-2 text-sm font-medium text-kam-navy hover:bg-kam-blue/10 transition"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Download Excel Template (CSV)
        </a>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-kam-navy">
            <FileSpreadsheet className="h-6 w-6" />
            Bulk CSV/Excel Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select CSV or Excel file
              </label>
              <input
                type="file"
                accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={handleFileChange}
                className="w-full p-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-kam-blue"
                required
              />
            </div>
            
            {preview.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Preview ({preview.length} rows)</h3>
                <div className="overflow-auto max-h-96">
                  <table className="w-full border-collapse bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-kam-blue/5">
                        {preview[0] && Object.keys(preview[0]).map((key) => (
                          <th key={key} className="border p-3 text-left font-semibold">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(0,5).map((row, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="p-3">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                      {preview.length > 5 && (
                        <tr>
                          <td colSpan={Object.keys(preview[0]).length} className="p-3 text-center text-gray-500">
                            ... and {preview.length - 5} more rows
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-kam-gold text-kam-navy py-4 px-8 rounded-xl font-bold text-lg hover:brightness-95 disabled:opacity-50 flex items-center justify-center space-x-3 transition shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6" />
                  <span>Upload {preview.length} items</span>
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

