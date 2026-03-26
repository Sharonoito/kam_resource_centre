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
  <Card className="bg-white shadow-lg hover:shadow-xl transition-all">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-2xl font-playfair">{value}</CardTitle>
      <Icon className="h-8 w-8 text-kam-blue" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xs text-green-600">{change}</p>
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
      <div className="mb-12">
        <h1 className="text-4xl font-playfair text-kam-navy mb-2">Admin Dashboard</h1>
        <p className="text-xl text-gray-600">Manage KAM Resource Centre content and users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/upload" className="block p-4 bg-kam-gold text-kam-navy rounded-lg hover:bg-yellow-400 transition">
              <UploadCloud className="inline h-5 w-5 mr-2" />
              Single Upload
            </Link>
            <Link href="/admin/bulk" className="block p-4 border rounded-lg hover:bg-gray-50 transition">
              Bulk CSV/Excel
            </Link>
          </CardContent>
        </Card>
        {/* Recent activity, charts later */}
      </div>
    </div>
  )
}

