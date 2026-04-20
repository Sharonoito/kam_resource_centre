"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ForgotPassword() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleForgot = async (formData: FormData) => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        body: JSON.stringify({ email: formData.get("email") }),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        setMessage("Check your email for reset link")
      } else {
        const { error } = await res.json()
        setMessage(error || "Error sending email")
      }
    } catch (e) {
      setMessage("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset password</h1>
          <p className="text-sm text-gray-600">
            Enter your email to receive reset instructions
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Forgot password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div className={`p-3 rounded-md text-sm ${message.includes('Check') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {message}
              </div>
            )}
            
            <form action={handleForgot} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-kam-blue focus:border-kam-blue"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-kam-blue hover:bg-kam-navy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kam-blue transition duration-150 ease-in-out disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <div className="text-center space-y-2">
              <Link href="/auth/signin" className="text-sm text-kam-blue hover:underline font-medium">
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}