"use client"

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect if already signed in - role-based
  useEffect(() => {
    if (status === 'authenticated') {
      const role = session?.user?.role
      if (role === 'SUPERADMIN' || role === 'ADMIN') {
        router.replace('/admin')
      } else {
        router.replace('/member')
      }
    }
  }, [status, session?.user?.role, router]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'authenticated') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Simple redirect - role handled elsewhere
        router.push('/member')
        router.refresh()
      }
    })
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
            Welcome Back!
          </h2>
        </div>
        {/* Right Form Panel */}
        <div className="p-10 flex flex-col justify-center bg-white w-full">
          <div className="max-w-md mx-auto space-y-6 w-full">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
              <p className="text-sm text-gray-600">
                Please sign in to your account
              </p>
            </div>
            <Card className="shadow-none border-none">
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      required />
                  </div>
                  <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 bg-kam-blue text-white border border-kam-blue rounded-md shadow-sm hover:bg-kam-blue-dark focus:outline-none focus:ring-2 focus:ring-kam-blue focus:border-kam-blue disabled:opacity-50 disabled:cursor-not-allowed ${isPending ? 'animate-pulse' : ''}`}
                    disabled={isPending}
                  >
                    {isPending ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <div className="text-center space-y-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => signIn('google')}
                    disabled={isPending}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Sign in with Google
                  </button>
                  {/* <Link href="/auth/forgot-password" className="block text-xs text-blue-700 hover:underline">Forgot password?</Link> */}
                  <Link href="/auth/register" className="text-sm text-[#193C8D] hover:text-[#E7B947] font-medium block hover:underline">Don't have an account? Register</Link>
                </div>


              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}