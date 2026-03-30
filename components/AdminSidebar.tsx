"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FilePlus, 
  FileSpreadsheet, 
  FileText,
  Users, 
  Settings,
  LogOut
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/upload', icon: FilePlus, label: 'Single Upload' },
  { href: '/admin/bulk', icon: FileSpreadsheet, label: 'Bulk Upload' },
  { href: '/admin/content', icon: FileText, label: 'Content' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="w-72 bg-kam-blue text-white flex flex-col h-full">
      <div className="p-6 border-b border-white/20 flex-shrink-0">
        <h2 className="text-2xl font-semibold text-kam-gold mb-1">KAM Admin</h2>
        <p className="text-white/80 text-sm">Resource Centre</p>
        {session && (
          <p className="text-xs text-white/60 mt-2 truncate">
            {session.user?.name || session.user?.email}
          </p>
        )}
      </div>
      <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all group ${
                isActive
                  ? 'bg-kam-gold text-kam-navy font-semibold shadow-lg'
                  : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-6 border-t border-white/20 flex-shrink-0">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-3 text-left rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

