import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Users, MessageSquare, LogOut, Moon } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard | DeenDash',
  description: 'Admin administration panel',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Admin Sidebar */}
      <div className="w-64 flex-col hidden md:flex border-r bg-zinc-50 dark:bg-zinc-950">
        <div className="p-4 border-b">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
            <div className="bg-blue-600 p-1.5 rounded-md text-white">
              <Moon className="w-5 h-5" />
            </div>
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <Users className="w-5 h-5" />
            Users
          </Link>
          <Link href="/admin/feedback" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <MessageSquare className="w-5 h-5" />
            Feedback
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <LogOut className="w-5 h-5" />
            Exit Admin
          </Link>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
