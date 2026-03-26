"use client"

import { useRequireAdmin } from '@/lib/isAdmin'
import { useSession } from 'next-auth/react'
import ResourceForm from './ResourceForm'

export default function UploadPage() {
  useRequireAdmin()
  const { data: session, status } = useSession()

  const currentRole = session?.user?.role || 'PUBLIC'
  const roleTone = currentRole === 'SUPERADMIN' || currentRole === 'ADMIN'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-amber-50 text-amber-700 border-amber-200'

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-playfair text-kam-navy mb-2">Resource Management</h1>
        <p className="text-gray-600">Create sector-specific or general resources for the public portal.</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500">Session Debug:</span>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${roleTone}`}>
            Current Role: {status === 'loading' ? 'LOADING' : currentRole}
          </span>
        </div>
      </div>

      <ResourceForm />
    </div>
  )
}

