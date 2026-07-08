import { redirect } from 'next/navigation'
import { getAdminCookie } from '@/lib/auth'
import Link from 'next/link'
import { ShieldAlert, Users, LogOut, ArrowLeft } from 'lucide-react'
import { adminLogout } from './login/actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAdmin = await getAdminCookie()

  if (!isAdmin) {
    redirect('/admindash/login')
  }

  return (
    <div className="h-[100dvh] relative flex bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Admin Sidebar */}
      <div className="w-64 hidden md:flex flex-col bg-zinc-900 border-r border-zinc-800 h-full">
        <div className="px-4 py-6 flex items-center mb-8 border-b border-zinc-800">
          <div className="relative h-8 w-8 mr-3 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">AdminDash</h1>
        </div>
        
        <div className="flex-1 px-3 space-y-2">
          <Link
            href="/admindash"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-red-900/20 text-red-400"
          >
            <Users className="mr-3 h-5 w-5" />
            Registered Users
          </Link>
          <Link
            href="/"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-3 h-5 w-5" />
            Back to User App
          </Link>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out Admin
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
          <div className="flex items-center">
            <ShieldAlert className="h-6 w-6 text-red-500 mr-2" />
            <span className="font-bold">AdminDash</span>
          </div>
          <form action={adminLogout}>
            <button type="submit" className="text-zinc-400 hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>
        
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
