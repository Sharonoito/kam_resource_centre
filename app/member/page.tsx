"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Navbar from "@/components/navbar"

export default function MemberPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="p-10">Loading...</div>
  }

  if (!session) return null

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {session.user?.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-2">Industry Reports</h2>
            <p className="text-gray-600 text-sm">
              Access latest manufacturing analytics and reports.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-2">Market Insights</h2>
            <p className="text-gray-600 text-sm">
              View sector trends and economic indicators.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-2">Member Resources</h2>
            <p className="text-gray-600 text-sm">
              Download exclusive documents and data.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}