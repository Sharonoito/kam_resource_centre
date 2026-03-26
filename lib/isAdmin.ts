'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useRequireAdmin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === "loading") return
    
    const role = session?.user?.role
    if (!role || (role !== "SUPERADMIN" && role !== "ADMIN")) {
      router.push("/unauthorized")
      router.refresh()
    }
  }, [session, status, router])
}


