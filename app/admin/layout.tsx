"use client"

import { useRequireAdmin } from '@/lib/isAdmin'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useRequireAdmin()

  return (
    <div className="font-sans bg-slate-50 h-screen overflow-hidden">
      <div className="flex h-full">
        <div className="flex-shrink-0 w-72 h-screen sticky top-0 z-40 border-r border-slate-200 bg-white">
          <AdminSidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="border-b border-slate-200 bg-white px-8 py-5">
            <h1 className="text-xl font-semibold text-kam-navy">Admin Console</h1>
            <p className="text-sm text-slate-600">KAM Resource Centre management</p>
          </div>
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

