import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const settingGroups = [
  {
    title: 'Platform',
    items: [
      { label: 'Maintenance Mode', value: 'Off' },
      { label: 'Public Registration', value: 'On' },
      { label: 'Default Access Tier', value: 'PUBLIC_FREE_ONLY' },
    ],
  },
  {
    title: 'Content Controls',
    items: [
      { label: 'Auto Publish Uploads', value: 'Off' },
      { label: 'Require Review For Bulk Upload', value: 'On' },
      { label: 'Broken Link Checks', value: 'Daily' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { label: 'Admin Digest Email', value: 'Enabled' },
      { label: 'Upload Failure Alerts', value: 'Enabled' },
      { label: 'Subscription Reminder', value: 'Weekly' },
    ],
  },
]

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-kam-navy mb-2">Settings</h1>
        <p className="text-slate-600">System preferences and administrative defaults.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {settingGroups.map((group) => (
          <Card key={group.title} className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-kam-navy">{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <p className="text-sm text-slate-600">{item.label}</p>
                  <span className="rounded-md bg-kam-blue/5 border border-kam-blue/20 px-2.5 py-1 text-xs font-semibold text-kam-navy">
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-kam-navy">Configuration Status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">Auth Service: Healthy</div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">Storage: Healthy</div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">Queue: Degraded</div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">Search: Healthy</div>
        </CardContent>
      </Card>
    </div>
  )
}
