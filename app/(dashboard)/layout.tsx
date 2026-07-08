import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAuthCookie } from '@/lib/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userId = await getAuthCookie()

  if (!userId) {
    redirect('/login')
  }

  return (
    <div className="h-[100dvh] relative flex bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div>
      <main className="md:pl-72 w-full h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 pb-16 md:pb-0">
        <div className="p-4 md:p-8 h-full">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
