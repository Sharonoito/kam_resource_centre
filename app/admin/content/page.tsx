import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const dummyContent = [
  {
    id: 'CNT-001',
    title: 'Kenya Manufacturing Outlook 2026',
    type: 'PDF',
    sector: 'General',
    status: 'Published',
    updatedAt: '2026-03-20',
  },
  {
    id: 'CNT-002',
    title: 'Trade Compliance Brief - Q1',
    type: 'LINK',
    sector: 'Trade',
    status: 'Draft',
    updatedAt: '2026-03-18',
  },
  {
    id: 'CNT-003',
    title: 'Industrial Production Snapshot',
    type: 'DATABASE',
    sector: 'Research Hub',
    status: 'Published',
    updatedAt: '2026-03-15',
  },
]

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-kam-navy mb-2">Content</h1>
        <p className="text-slate-600">Manage all uploaded resources and publication entries.</p>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-kam-navy">Content Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="bg-kam-blue/5 text-left text-sm text-slate-700">
                  <th className="p-3 border-b border-slate-200">ID</th>
                  <th className="p-3 border-b border-slate-200">Title</th>
                  <th className="p-3 border-b border-slate-200">Type</th>
                  <th className="p-3 border-b border-slate-200">Sector</th>
                  <th className="p-3 border-b border-slate-200">Status</th>
                  <th className="p-3 border-b border-slate-200">Updated</th>
                  <th className="p-3 border-b border-slate-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {dummyContent.map((item) => (
                  <tr key={item.id} className="text-sm hover:bg-slate-50">
                    <td className="p-3 border-b border-slate-100 text-slate-600">{item.id}</td>
                    <td className="p-3 border-b border-slate-100 font-medium text-slate-800">{item.title}</td>
                    <td className="p-3 border-b border-slate-100 text-slate-600">{item.type}</td>
                    <td className="p-3 border-b border-slate-100 text-slate-600">{item.sector}</td>
                    <td className="p-3 border-b border-slate-100">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 border-b border-slate-100 text-slate-600">{item.updatedAt}</td>
                    <td className="p-3 border-b border-slate-100">
                      <button
                        type="button"
                        className="rounded-lg border border-kam-blue/25 px-3 py-1.5 text-xs font-semibold text-kam-navy hover:bg-kam-blue/5"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
