"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (formData: FormData) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
          name: formData.get('name'),
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (!res.ok) {
        const { error } = await res.json()
        setError(error || 'Registration failed')
        return
      }
      
      router.push('/auth/signin?message=Account created! Please sign in.')
    } catch (e) {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden bg-white">
        {/* Left Navy Panel with Logo */}
        <div className="bg-[#193C8D] p-12 flex flex-col items-center justify-center hidden md:flex">
          <div className="bg-white rounded-2xl p-4 shadow-lg flex items-center justify-center">
            <img 
              src="/images/kamlogo.jpg" 
              alt="KAM Logo" 
              className="h-14 w-auto object-contain transition-all duration-300 sm:h-16 md:h-20 lg:h-24 xl:h-28"
            />
          </div>
          <h2 className="text-2xl font-bold mt-6 text-white">
            Create Account
          </h2>

        </div>

        {/* Right Form Panel */}
        <div className="p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
              <p className="text-sm text-gray-600">
                Join KAM Web Resource Centre
              </p>
            </div>
            <Card className="shadow-none border-none">
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <form action={handleRegister} className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full name
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#193C8D] focus:border-[#193C8D] transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 7.33c.3.3.74.3 1.04 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#193C8D] focus:border-[#193C8D] transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        minLength={8}
                        required
                        className="w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#193C8D] focus:border-[#193C8D] transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-[#193C8D] hover:bg-[#122855] text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#193C8D]/50 transition-all duration-300"
                  >
                    {loading ? 'Creating...' : 'Create account'}
                  </button>
                </form>
                <div className="text-center space-y-2 pt-4 border-t border-gray-100">
                  <Link href="/auth/signin" className="text-sm text-[#193C8D] hover:text-[#E7B947] font-medium block hover:underline">
                    Already have an account? Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
