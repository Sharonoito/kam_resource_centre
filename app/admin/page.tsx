"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useRequireAdmin } from '@/lib/isAdmin'
import { LucideIcon, BarChart3, FileText, Users, UploadCloud } from 'lucide-react'
import Link from 'next/link'

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
}

const StatCard = ({ title, value, change, icon: Icon }: StatCardProps) => (
  <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-2xl font-semibold text-kam-navy">{value}</CardTitle>
      <Icon className="h-8 w-8 text-kam-blue" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-slate-600">{title}</p>
      <p className="text-xs text-emerald-600">{change}</p>
    </CardContent>
  </Card>
)

export default function AdminDashboard() {
  useRequireAdmin()

  const [stats, setStats] = useState({
    totalContent: '0',
    totalSectors: '0',
    totalUsers: '0',
    totalPurchases: '0'
  })

  useEffect(() => {
    // Fetch stats from API later
    // /api/admin/stats
    setStats({
      totalContent: '1,234',
      totalSectors: '12',
      totalUsers: '567',
      totalPurchases: '89'
    })
  }, [])

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-kam-navy mb-2">Admin Dashboard</h1>
        <p className="text-base text-slate-600">Manage KAM Resource Centre content and users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Content"
          value={stats.totalContent}
          change="+12.5%"
          icon={FileText}
        />
        <StatCard
          title="Sectors"
          value={stats.totalSectors}
          change="+1"
          icon={BarChart3}
        />
        <StatCard
          title="Users"
          value={stats.totalUsers}
          change="+45"
          icon={Users}
        />
        <StatCard
          title="Purchases"
          icon={UploadCloud}
          value={stats.totalPurchases}
          change="+23%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-kam-navy">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/upload" className="block p-4 bg-kam-gold text-kam-navy rounded-lg hover:brightness-95 transition font-medium">
              <UploadCloud className="inline h-5 w-5 mr-2" />
              Single Upload
            </Link>
            <Link href="/admin/bulk" className="block p-4 border border-kam-blue/20 text-kam-navy rounded-lg hover:bg-kam-blue/5 transition font-medium">
              Bulk CSV/Excel
            </Link>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-kam-navy">Admin Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Use Single Upload for one resource at a time.</p>
            <p>Use Bulk Upload for CSV/Excel imports.</p>
            <p>Review uploaded entries before publishing updates.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

