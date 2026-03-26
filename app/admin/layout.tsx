"use client"

import { useRequireAdmin } from '@/lib/isAdmin'
import AdminSidebar from '@/components/AdminSidebar'
import { Playfair_Display, DM_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useRequireAdmin()

  return (
    <div className={`${playfair.variable} ${dmSans.variable} font-dm-sans bg-gradient-to-br from-slate-50 to-gray-50 h-screen overflow-hidden`}>
      <div className="flex h-full">
        <div className="flex-shrink-0 w-72 h-screen sticky top-0 z-40 border-r border-gray-200 shadow-lg">
          <AdminSidebar />
        </div>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

