import { createClient } from '@/lib/supabase/server'
import { PrayerList } from '@/components/features/salah/prayer-list'
import { DateNavigator } from '@/components/shared/date-navigator'
import { getAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SalahPage(props: { searchParams: Promise<{ date?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  // Determine the date to fetch
  const todayLocal = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local format roughly
  // To avoid timezone issues server-side, just get UTC date if no local is provided, or better:
  // Usually, new Date().toISOString().split('T')[0] works fine for simple UTC tracking
  const today = new Date().toISOString().split('T')[0]
  const date = searchParams.date || today
  
  const userId = await getAuthCookie()
  if (!userId) redirect('/login')

  const { data: prayers } = await supabase
    .from('prayers')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salah</h1>
          <p className="text-muted-foreground">
            Track your daily prayers and build consistency.
          </p>
        </div>
        <DateNavigator currentDate={date} />
      </div>

      <PrayerList initialPrayers={prayers || []} date={date} userId={userId} />
    </div>
  )
}
