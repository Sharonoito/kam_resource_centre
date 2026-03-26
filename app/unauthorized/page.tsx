import Link from 'next/link'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kam-navy to-kam-blue text-white px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold bg-gradient-to-r from-kam-gold to-yellow-400 bg-clip-text text-transparent">
            Admin Access Required
          </h1>
          <p className="text-xl opacity-90">
            You need SUPERADMIN role to access the admin dashboard.
          </p>
        </div>
        <Link 
          href="/" 
          className="inline-block px-8 py-4 bg-kam-gold hover:bg-yellow-400 text-kam-navy font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}


